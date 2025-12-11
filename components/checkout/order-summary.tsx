'use client'

import { CartItem } from '@/lib/cart-context'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'

interface OrderSummaryProps {
  items: CartItem[]
  subtotal: number
  shipping?: number
  tax?: number
}

export function OrderSummary({ items, subtotal, shipping = 0, tax = 0 }: OrderSummaryProps) {
  const total = subtotal + shipping + tax

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
                {item.name}
              </h4>
              {item.variation?.attributes && (
                <p className="mt-1 text-body-sm text-primary/60">
                  {item.variation.attributes.map((attr) => (
                    <span key={attr.name}>{attr.value} </span>
                  ))}
                </p>
              )}
              <div className="mt-2 flex justify-between items-center">
                <span className="text-body text-primary/60">
                  Qty: {item.quantity}
                </span>
                <span className="text-price text-primary font-bold">
                  €{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-primary/10 mb-4" />

      {/* Order Totals */}
      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between text-body">
          <span className="text-primary/60">Zwischensumme</span>
          <span className="text-primary font-bold">€{subtotal.toFixed(2)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-body">
          <span className="text-primary/60">Versand</span>
          <span className="text-primary font-bold">
            {shipping === 0 ? 'Im nächsten Schritt berechnet' : `€${shipping.toFixed(2)}`}
          </span>
        </div>

        {/* Tax */}
        {tax > 0 && (
          <div className="flex justify-between text-body">
            <span className="text-primary/60">MwSt. (20%)</span>
            <span className="text-primary font-bold">€{tax.toFixed(2)}</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-primary/10" />

        {/* Total */}
        <div className="flex justify-between text-h4 font-bold">
          <span className="text-primary">Gesamt</span>
          <span className="text-primary">€{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Tax Notice */}
      <div className="mt-4 pt-4 border-t border-primary/10">
        <p className="text-body-sm text-primary/60 text-center">
          Alle Preise inkl. MwSt.
        </p>
      </div>
    </div>
  )
}
