'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { useGeolocation } from '@/lib/hooks/use-geolocation'
import { CheckoutForm, type CheckoutFormData } from '@/components/checkout/checkout-form'
import { OrderSummary } from '@/components/checkout/order-summary'
import CheckoutTestimonials from '@/components/sections/checkout-testimonials'
import CouponInput from '@/components/checkout/coupon-input'
import { WooCommerceAddress } from '@/types/woocommerce'
import { Country, TaxRate, calculateTax } from '@/lib/woocommerce/countries-taxes'
import { ShippingZoneWithMethods, findShippingZoneForCountry, calculateShippingCost, calculateCartWeight } from '@/lib/woocommerce/shipping'
import Link from 'next/link'
import { ArrowLeft, CreditCard, ShoppingCart, ChevronDown } from 'lucide-react'

interface CouponData {
  id: number
  code: string
  amount: string
  discountType: string
  description: string
  freeShipping: boolean
  discountAmount: number
  individualUse: boolean
}

interface CheckoutClientProps {
  countries: Country[]
  taxRates: TaxRate[]
  shippingZones: ShippingZoneWithMethods[]
  shippableCountries: string[]
}

export default function CheckoutClient({ countries, taxRates, shippingZones, shippableCountries }: CheckoutClientProps) {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const { countryCode } = useGeolocation() // Detect country from IP
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Use detected country code, fallback to AT (Austria)
  const defaultCountry = countryCode || 'AT'

  // Form data state with IP-detected country
  const [formData, setFormData] = useState<CheckoutFormData>({
    billing: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address_1: '',
      address_2: '',
      city: '',
      postcode: '',
      country: defaultCountry,
      state: '',
      company: '',
    },
    shipping: {
      first_name: '',
      last_name: '',
      address_1: '',
      address_2: '',
      city: '',
      postcode: '',
      country: defaultCountry,
      state: '',
      company: '',
    },
    sameAsBilling: true,
  })

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null)

  // Payment method state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bacs')

  // Customer note state
  const [customerNote, setCustomerNote] = useState('')

  // Mobile order summary expandable state
  const [isMobileOrderSummaryOpen, setIsMobileOrderSummaryOpen] = useState(false)

  // Update form country when geolocation completes
  useEffect(() => {
    if (countryCode && countryCode !== formData.billing.country) {
      setFormData(prev => ({
        ...prev,
        billing: { ...prev.billing, country: countryCode },
        shipping: { ...prev.shipping, country: countryCode },
      }))
    }
  }, [countryCode]) // Only run when countryCode changes

  // Calculate tax based on selected country
  const { taxAmount, taxRate } = useMemo(() => {
    return calculateTax(totalPrice, formData.billing.country, formData.billing.state, taxRates)
  }, [totalPrice, formData.billing.country, formData.billing.state, taxRates])

  // Calculate shipping cost based on country and cart
  const { shippingCost, shippingMethodTitle } = useMemo(() => {
    const zone = findShippingZoneForCountry(shippingZones, formData.billing.country, formData.billing.state)

    if (!zone) {
      return { shippingCost: 0, shippingMethodTitle: 'Im nächsten Schritt berechnet' }
    }

    const totalWeight = calculateCartWeight(items)

    // Calculate shipping (works with weight OR order amount)
    const shippingResult = calculateShippingCost(zone, totalWeight, totalPrice)

    if (!shippingResult) {
      return { shippingCost: 0, shippingMethodTitle: 'Im nächsten Schritt berechnet' }
    }

    return { shippingCost: shippingResult.cost, shippingMethodTitle: shippingResult.methodTitle }
  }, [formData.billing.country, formData.billing.state, shippingZones, items, totalPrice])

  // Calculate coupon discount
  const couponDiscount = appliedCoupon?.discountAmount || 0

  // Calculate final total: subtotal + shipping + tax - coupon
  // Note: WooCommerce prices already include tax, so we don't add it again
  const finalTotal = totalPrice + shippingCost - couponDiscount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Prepare billing and shipping data
      const billing = formData.billing
      const shipping = formData.sameAsBilling
        ? {
            ...formData.billing,
            email: undefined,
            phone: undefined,
          }
        : formData.shipping

      // Convert cart items to line items for WooCommerce
      const line_items = items.map(item => ({
        product_id: item.productId,
        variation_id: item.variationId,
        quantity: item.quantity,
      }))

      // Payment method titles
      const paymentMethodTitles: Record<string, string> = {
        'bacs': 'Banküberweisung',
        'stripe': 'Kreditkarte',
        'paypal': 'PayPal',
        'klarna': 'Klarna',
      }

      // Create order via API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          billing,
          shipping,
          line_items,
          payment_method: selectedPaymentMethod,
          payment_method_title: paymentMethodTitles[selectedPaymentMethod] || 'Banküberweisung',
          customer_note: customerNote,
          coupon_lines: appliedCoupon ? [{
            code: appliedCoupon.code,
            discount: appliedCoupon.discountAmount.toFixed(2),
          }] : [],
          // Pass calculated values to ensure consistency
          shipping_total: shippingCost.toFixed(2),
          total: finalTotal.toFixed(2),
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Fehler beim Erstellen der Bestellung')
      }

      // Clear cart and redirect to success page
      clearCart()
      router.push(`/checkout/success?order_id=${data.order_id}`)
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="container mx-auto py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-h2 text-primary mb-4">Ihr Warenkorb ist leer</h1>
          <p className="text-body text-primary/60 mb-8">
            Fügen Sie Produkte zu Ihrem Warenkorb hinzu, um fortzufahren.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-primary text-cream px-6 py-3 rounded-md hover:bg-primary-light transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Weiter einkaufen
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors mb-2"
        >
          <ArrowLeft className="h-5 w-5" />
          Zurück zum Shop
        </Link>
        <h1 className="text-h1 text-primary">Kasse</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-body text-red-800">{error}</p>
        </div>
      )}

      {/* Mobile Order Summary - Expandable */}
      <div className="lg:hidden mb-6 bg-white rounded-md border border-primary/10 overflow-hidden">
        <button
          type="button"
          onClick={() => setIsMobileOrderSummaryOpen(!isMobileOrderSummaryOpen)}
          className="w-full px-4 py-4 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary-dark/60" aria-hidden="true" />
            <span className="font-semibold text-primary">
              Bestellübersicht ({items.length} {items.length === 1 ? 'Artikel' : 'Artikel'})
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg text-primary">
              €{(totalPrice + shippingCost + taxAmount - couponDiscount).toFixed(2)}
            </span>
            <ChevronDown
              className={`h-5 w-5 text-primary-dark/60 transition-transform ${isMobileOrderSummaryOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </div>
        </button>
        {isMobileOrderSummaryOpen && (
          <div className="px-4 pb-4 border-t border-primary/10">
            <OrderSummary
              items={items}
              subtotal={totalPrice}
              shipping={shippingCost}
              shippingMethodTitle={shippingMethodTitle}
              tax={taxAmount}
              taxRate={taxRate}
              couponDiscount={couponDiscount}
              appliedCoupon={appliedCoupon}
              isLoading={isLoading}
              selectedCountry={formData.billing.country}
              countries={countries}
            />
          </div>
        )}
      </div>

      {/* Checkout Grid */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information Form */}
            <div className="bg-white rounded-md p-6 border border-primary/10">
              <CheckoutForm
                formData={formData}
                onFormDataChange={setFormData}
                isLoading={isLoading}
                shippableCountries={shippableCountries}
                countries={countries}
              />
            </div>

          {/* Coupon Code */}
          <CouponInput
            onCouponApplied={(coupon) => setAppliedCoupon(coupon)}
            onCouponRemoved={() => setAppliedCoupon(null)}
            appliedCoupon={appliedCoupon}
            cartItems={items}
          />

          {/* Payment Methods */}
          <div className="bg-white rounded-md p-6 border border-primary/10">
            <h3 className="text-h3 text-primary mb-6">Zahlungsmethode</h3>
            <div className="space-y-3">
              {/* Bank Transfer */}
              <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/30 border-primary bg-primary/5">
                <input
                  type="radio"
                  name="payment_method"
                  value="bacs"
                  checked={selectedPaymentMethod === 'bacs'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="mt-1 w-4 h-4 text-primary focus:ring-primary accent-primary"
                />
                <div className="ml-3 flex-1">
                  <div className="font-bold text-primary">Banküberweisung</div>
                  <div className="text-body-sm text-primary/60 mt-1">
                    Zahlen Sie direkt auf unser Bankkonto
                  </div>
                </div>
              </label>

              {/* Credit Card (Stripe) */}
              <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/30 ${selectedPaymentMethod === 'stripe' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="stripe"
                  checked={selectedPaymentMethod === 'stripe'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="mt-1 w-4 h-4 text-primary focus:ring-primary accent-primary"
                />
                <div className="ml-3 flex-1">
                  <div className="font-bold text-primary">Kreditkarte</div>
                  <div className="flex gap-2 mt-2">
                    <div className="px-2 py-1 bg-cream rounded text-xs font-medium">Visa</div>
                    <div className="px-2 py-1 bg-cream rounded text-xs font-medium">Mastercard</div>
                    <div className="px-2 py-1 bg-cream rounded text-xs font-medium">Amex</div>
                  </div>
                </div>
              </label>

              {/* PayPal */}
              <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/30 ${selectedPaymentMethod === 'paypal' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="paypal"
                  checked={selectedPaymentMethod === 'paypal'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="mt-1 w-4 h-4 text-primary focus:ring-primary accent-primary"
                />
                <div className="ml-3 flex-1">
                  <div className="font-bold text-primary">PayPal</div>
                  <div className="flex gap-2 mt-2">
                    <div className="px-2 py-1 bg-[#003087] text-white rounded text-xs font-medium">PayPal</div>
                  </div>
                </div>
              </label>

              {/* Klarna */}
              <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/30 ${selectedPaymentMethod === 'klarna' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="klarna"
                  checked={selectedPaymentMethod === 'klarna'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="mt-1 w-4 h-4 text-primary focus:ring-primary accent-primary"
                />
                <div className="ml-3 flex-1">
                  <div className="font-bold text-primary">Klarna</div>
                  <div className="flex gap-2 mt-2">
                    <div className="px-2 py-1 bg-[#FFB3C7] text-black rounded text-xs font-medium">Klarna</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Order Notes */}
          <div className="bg-white rounded-md p-6 border border-primary/10">
            <h3 className="text-h3 text-primary mb-4">Bestellnotizen (optional)</h3>
            <textarea
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              placeholder="Hinweise zu Ihrer Bestellung, z.B. besondere Hinweise zur Lieferung"
              rows={4}
              className="w-full px-3 py-2 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none text-body text-primary bg-cream/50"
            />
          </div>
        </div>

        {/* Order Summary - 1/3 width on large screens */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-4">
            <OrderSummary
              items={items}
              subtotal={totalPrice}
              shipping={shippingCost}
              shippingMethodTitle={shippingMethodTitle}
              tax={taxAmount}
              taxRate={taxRate}
              couponDiscount={couponDiscount}
              appliedCoupon={appliedCoupon}
              isLoading={isLoading}
              selectedCountry={formData.billing.country}
              countries={countries}
            />
            <CheckoutTestimonials />
          </div>
        </div>
        </div>
      </form>
    </div>
  )
}
