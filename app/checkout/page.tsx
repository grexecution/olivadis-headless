'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { CheckoutForm } from '@/components/checkout/checkout-form'
import { OrderSummary } from '@/components/checkout/order-summary'
import { WooCommerceAddress } from '@/types/woocommerce'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async (billing: WooCommerceAddress, shipping: WooCommerceAddress) => {
    setIsLoading(true)
    setError(null)

    try {
      // Convert cart items to line items for WooCommerce
      const line_items = items.map(item => ({
        product_id: item.productId,
        variation_id: item.variationId,
        quantity: item.quantity,
      }))

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
          payment_method: 'bacs',
          payment_method_title: 'Direct Bank Transfer',
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create order')
      }

      // Clear cart on successful order
      clearCart()

      // Redirect to order confirmation page
      router.push(`/checkout/success?order_id=${data.order_id}`)
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Redirect if cart is empty
  if (items.length === 0 && !isLoading) {
    return (
      <div className="container mx-auto py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-h2 text-primary mb-4">Ihr Warenkorb ist leer</h1>
          <p className="text-body text-primary/60 mb-8">
            Fügen Sie einige Artikel zu Ihrem Warenkorb hinzu, bevor Sie zur Kasse gehen.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Weiter einkaufen
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-body text-primary hover:text-primary-light transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zum Warenkorb
        </Link>
        <h1 className="text-h2 text-primary">Kasse</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-body text-red-800">{error}</p>
        </div>
      )}

      {/* Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form - 2/3 width on large screens */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-md p-6 border border-primary/10">
            <CheckoutForm onSubmit={handleCheckout} isLoading={isLoading} />
          </div>
        </div>

        {/* Order Summary - 1/3 width on large screens */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <OrderSummary items={items} subtotal={totalPrice} />
          </div>
        </div>
      </div>
    </div>
  )
}
