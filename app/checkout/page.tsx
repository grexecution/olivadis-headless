import { getAllCountries, getAllTaxRates, Country, TaxRate } from '@/lib/woocommerce/countries-taxes'
import { getAllShippingZones, getShippableCountries, ShippingZoneWithMethods } from '@/lib/woocommerce/shipping'
import CheckoutClient from './checkout-client'

export default async function CheckoutPage() {
  // Pre-fetch countries, tax rates, and shipping zones on server
  let countries: Country[] = []
  let taxRates: TaxRate[] = []
  let shippingZones: ShippingZoneWithMethods[] = []

  try {
    countries = await getAllCountries()
  } catch (error) {
    console.error('[Checkout Server] Error fetching countries:', error)
  }

  try {
    taxRates = await getAllTaxRates()
  } catch (error) {
    console.error('[Checkout Server] Error fetching tax rates:', error)
  }

  try {
    shippingZones = await getAllShippingZones()
  } catch (error) {
    console.error('[Checkout Server] Error fetching shipping zones:', error)
  }

  // Get list of countries that we ship to
  const shippableCountries = getShippableCountries(shippingZones)

  return (
    <CheckoutClient
      countries={countries}
      taxRates={taxRates}
      shippingZones={shippingZones}
      shippableCountries={shippableCountries}
    />
  )
}
