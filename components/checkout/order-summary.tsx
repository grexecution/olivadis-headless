'use client'

import { CartItem } from '@/lib/cart-context'
import { Country } from '@/lib/woocommerce/countries-taxes'
import { formatEUR } from '@/lib/utils/currency'
import Image from 'next/image'
import { ShoppingBag, CheckCircle, Lock } from 'lucide-react'
import { decodeHtmlEntities } from '@/lib/utils/html'

interface OrderSummaryProps {
  items: CartItem[]
  subtotal: number
  shipping?: number
  shippingMethodTitle?: string
  tax?: number
  taxRate?: number
  couponDiscount?: number
  appliedCoupon?: {
    code: string
    freeShipping?: boolean
  } | null
  isLoading?: boolean
  selectedCountry?: string
  countries?: Country[]
}

export function OrderSummary({
  items,
  subtotal,
  shipping = 0,
  shippingMethodTitle = 'Versand',
  tax = 0,
  taxRate = 0,
  couponDiscount = 0,
  appliedCoupon = null,
  isLoading = false,
  selectedCountry = 'DE',
  countries = []
}: OrderSummaryProps) {
  // WooCommerce prices already include tax, so total is subtotal + shipping - coupon
  const total = subtotal + shipping - couponDiscount
  const countryName = countries.find(c => c.code === selectedCountry)?.name || selectedCountry

  return (
    <div className="bg-cream-light rounded-md p-6 border border-primary/10">
      <h3 className="text-h3 text-primary mb-6">Bestellübersicht</h3>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            {/* Product Image */}
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-primary/10 bg-white">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-cream">
                  <ShoppingBag className="h-8 w-8 text-primary/30" />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1">
              <h4 className="text-body font-bold text-primary">
                {decodeHtmlEntities(item.name)}
              </h4>
              {item.variation?.attributes && (
                <p className="mt-1 text-body-sm text-primary/60">
                  {item.variation.attributes.map((attr) => (
                    <span key={attr.name}>{decodeHtmlEntities(attr.value)} </span>
                  ))}
                </p>
              )}
              <div className="mt-2 flex justify-between items-center">
                <span className="text-body-sm text-primary/60">
                  Qty: {item.quantity}
                </span>
                <span className="text-body-sm font-semibold text-primary">
                  {formatEUR(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-primary/10 mb-4" />

      {/* Order Totals */}
      <div className="space-y-2">
        {/* Subtotal */}
        <div className="flex justify-between text-body-sm">
          <span className="text-primary/60">Zwischensumme</span>
          <span className="text-primary font-medium">{formatEUR(subtotal)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-body-sm">
          <span className="text-primary/60">{shippingMethodTitle}</span>
          <span className="text-primary font-medium text-xs">
            {shipping === 0 ? 'Kostenlos' : formatEUR(shipping)}
          </span>
        </div>

        {/* Tax */}
        {tax > 0 && (
          <div className="flex justify-between text-body-sm">
            <span className="text-primary/60">MwSt. (20%)</span>
            <span className="text-primary font-medium">{formatEUR(tax)}</span>
          </div>
        )}

        {/* Coupon Discount */}
        {couponDiscount > 0 && appliedCoupon && (
          <div className="flex justify-between text-body-sm">
            <span className="text-primary-light font-medium">Gutschein ({appliedCoupon.code})</span>
            <span className="text-primary-light font-medium">-{formatEUR(couponDiscount)}</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-primary/10" />

        {/* Total */}
        <div className="flex justify-between text-h4 font-bold">
          <span className="text-primary">Gesamt</span>
          <span className="text-primary">{formatEUR(total)}</span>
        </div>

        {/* Tax Notice */}
        {taxRate > 0 && (
          <p className="text-xs text-primary/60 pt-2">
            Alle Preise inkl. {taxRate.toFixed(0)}% MwSt. ({countryName})
          </p>
        )}
      </div>

      {/* Place Order Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 bg-primary text-cream py-4 rounded-lg font-bold text-button hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cream"></div>
            Bestellung wird bearbeitet...
          </>
        ) : (
          <>
            <CheckCircle className="h-5 w-5" />
            Jetzt kaufen
          </>
        )}
      </button>

      {/* Security Badge */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-primary-dark/60">
        <Lock className="h-4 w-4" />
        Sichere SSL-verschlüsselte Zahlung
      </div>
    </div>
  )
}
