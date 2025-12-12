#!/usr/bin/env node

/**
 * Sync Shipping Rules from WooCommerce
 *
 * Fetches shipping zones, methods, and tax rates from WooCommerce
 * and saves them to lib/woocommerce/shipping-rules.json
 *
 * Runs automatically during build process
 */

const fs = require('fs')
const path = require('path')

const WOO_BASE_URL = process.env.WP_BASE_URL || process.env.NEXT_PUBLIC_WOOCOMMERCE_URL
const WOO_CONSUMER_KEY = process.env.WOO_CONSUMER_KEY || process.env.WOOCOMMERCE_CONSUMER_KEY
const WOO_CONSUMER_SECRET = process.env.WOO_CONSUMER_SECRET || process.env.WOOCOMMERCE_CONSUMER_SECRET

if (!WOO_BASE_URL || !WOO_CONSUMER_KEY || !WOO_CONSUMER_SECRET) {
  console.error('❌ Missing WooCommerce credentials. Using default shipping rules.')
  process.exit(0) // Don't fail build, use defaults
}

async function fetchShippingZones() {
  const auth = Buffer.from(`${WOO_CONSUMER_KEY}:${WOO_CONSUMER_SECRET}`).toString('base64')

  try {
    // Fetch all shipping zones
    const zonesRes = await fetch(`${WOO_BASE_URL}/wp-json/wc/v3/shipping/zones`, {
      headers: { 'Authorization': `Basic ${auth}` }
    })

    if (!zonesRes.ok) {
      throw new Error(`Failed to fetch zones: ${zonesRes.status}`)
    }

    const zones = await zonesRes.json()
    console.log(`✅ Found ${zones.length} shipping zones`)

    // Fetch methods for each zone
    const zonesWithMethods = await Promise.all(
      zones.map(async (zone) => {
        if (zone.id === 0) return null // Skip "Rest of World"

        const methodsRes = await fetch(
          `${WOO_BASE_URL}/wp-json/wc/v3/shipping/zones/${zone.id}/methods`,
          { headers: { 'Authorization': `Basic ${auth}` } }
        )

        if (!methodsRes.ok) {
          console.warn(`⚠️  Failed to fetch methods for zone ${zone.name}`)
          return null
        }

        const methods = await methodsRes.json()

        // Extract relevant settings
        const freeShippingMethod = methods.find(m => m.method_id === 'free_shipping' && m.enabled)
        const flatRateMethod = methods.find(m => m.method_id === 'flat_rate' && m.enabled)

        if (!freeShippingMethod && !flatRateMethod) {
          console.warn(`⚠️  No enabled shipping methods for zone ${zone.name}`)
          return null
        }

        return {
          zoneId: zone.id,
          zoneName: zone.name,
          freeShippingThreshold: freeShippingMethod
            ? parseFloat(freeShippingMethod.settings.min_amount?.value || 0)
            : 999999,
          flatRate: flatRateMethod
            ? parseFloat(flatRateMethod.settings.cost?.value?.replace(',', '.') || 0)
            : 0,
        }
      })
    )

    return zonesWithMethods.filter(Boolean)
  } catch (error) {
    console.error('❌ Error fetching shipping zones:', error.message)
    throw error
  }
}

async function fetchTaxRates() {
  const auth = Buffer.from(`${WOO_CONSUMER_KEY}:${WOO_CONSUMER_SECRET}`).toString('base64')

  try {
    const taxRes = await fetch(`${WOO_BASE_URL}/wp-json/wc/v3/taxes`, {
      headers: { 'Authorization': `Basic ${auth}` }
    })

    if (!taxRes.ok) {
      throw new Error(`Failed to fetch taxes: ${taxRes.status}`)
    }

    const taxes = await taxRes.json()
    console.log(`✅ Found ${taxes.length} tax rates`)

    // Group by country
    const taxByCountry = {}
    taxes.forEach(tax => {
      if (tax.country && tax.rate) {
        taxByCountry[tax.country] = parseFloat(tax.rate) / 100
      }
    })

    return taxByCountry
  } catch (error) {
    console.error('❌ Error fetching tax rates:', error.message)
    throw error
  }
}

async function main() {
  console.log('🚀 Syncing shipping rules from WooCommerce...\n')

  try {
    const [zones, taxRates] = await Promise.all([
      fetchShippingZones(),
      fetchTaxRates()
    ])

    // Map zone names to country codes (you can expand this mapping)
    const countryMapping = {
      'Österreich': 'AT',
      'Austria': 'AT',
      'Germany': 'DE',
      'Deutschland': 'DE',
    }

    // Build shipping rules object
    const shippingRules = {}

    zones.forEach(zone => {
      const countryCode = countryMapping[zone.zoneName] || zone.zoneName
      shippingRules[countryCode] = {
        freeShippingThreshold: zone.freeShippingThreshold,
        flatRate: zone.flatRate,
        taxRate: taxRates[countryCode] || 0.10, // Default 10%
        zoneName: zone.zoneName,
      }
    })

    // Add default fallback
    shippingRules.DEFAULT = {
      freeShippingThreshold: 100,
      flatRate: 9.99,
      taxRate: 0.20,
      zoneName: 'Rest of World',
    }

    // Write to JSON file
    const outputPath = path.join(__dirname, '..', 'lib', 'woocommerce', 'shipping-rules.json')
    fs.writeFileSync(outputPath, JSON.stringify(shippingRules, null, 2))

    console.log('\n✅ Shipping rules synced successfully!')
    console.log(`📝 Written to: ${outputPath}`)
    console.log(`\nRules synced for countries: ${Object.keys(shippingRules).join(', ')}\n`)

  } catch (error) {
    console.error('\n❌ Failed to sync shipping rules')
    console.error('Using default fallback rules instead\n')

    // Write default rules
    const defaultRules = {
      AT: {
        freeShippingThreshold: 79,
        flatRate: 5.99,
        taxRate: 0.10,
        zoneName: 'Austria',
      },
      DE: {
        freeShippingThreshold: 79,
        flatRate: 5.99,
        taxRate: 0.10,
        zoneName: 'Germany',
      },
      DEFAULT: {
        freeShippingThreshold: 100,
        flatRate: 9.99,
        taxRate: 0.20,
        zoneName: 'Rest of World',
      }
    }

    const outputPath = path.join(__dirname, '..', 'lib', 'woocommerce', 'shipping-rules.json')
    fs.writeFileSync(outputPath, JSON.stringify(defaultRules, null, 2))

    console.log('✅ Default rules written successfully\n')
  }
}

main()
