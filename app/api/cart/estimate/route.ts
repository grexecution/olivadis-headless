import { NextRequest, NextResponse } from 'next/server'
import { getAllTaxRates, calculateTax, getAllCountries } from '@/lib/woocommerce/countries-taxes'
import { calculateShippingForCheckout } from '@/lib/woocommerce/shipping'

export async function POST(request: NextRequest) {
  let country = 'AT'
  let countryName = 'Austria'

  try {
    const body = await request.json()
    country = body.country
    const subtotal = body.subtotal
    const items = body.items

    if (!country || !subtotal || !items) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields', countryName },
        { status: 400 }
      )
    }

    console.log('Cart estimate request:', { country, subtotal, itemCount: items.length })

    // Fetch tax rates and countries in parallel
    const [taxRates, countries] = await Promise.all([
      getAllTaxRates(),
      getAllCountries()
    ])

    // Find country name
    const countryData = countries.find(c => c.code === country)
    countryName = countryData?.name || country

    console.log('Found country:', countryName, 'Tax rates:', taxRates.length)

    // Calculate tax
    const { taxAmount, taxRate } = calculateTax(
      subtotal,
      country,
      '', // state (not needed for IP-based estimates)
      taxRates
    )

    console.log('Calculated tax:', { taxAmount, taxRate })

    // Calculate shipping
    // Map cart items to include necessary fields for shipping calculation
    const cartItems = items.map((item: any) => ({
      id: item.productId,
      quantity: item.quantity,
      price: subtotal / items.reduce((sum: number, i: any) => sum + i.quantity, 0), // Approximate price per item
      weight: 0.5 // Default weight in kg (you may want to fetch actual product weight)
    }))

    const shippingResult = await calculateShippingForCheckout(
      country,
      cartItems,
      subtotal
    )

    const shipping = shippingResult?.cost || 0

    console.log('Calculated shipping:', shipping, 'Method:', shippingResult?.methodTitle)

    return NextResponse.json({
      success: true,
      tax: taxAmount,
      shipping,
      taxRate,
      countryName
    })
  } catch (error) {
    console.error('Error calculating cart estimates:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate estimates',
        tax: 0,
        shipping: 0,
        taxRate: 20,
        countryName
      },
      { status: 500 }
    )
  }
}
