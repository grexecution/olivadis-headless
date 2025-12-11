'use client'

import { useState } from 'react'
import { Tag, X, Loader2, CheckCircle } from 'lucide-react'

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

interface CouponInputProps {
  onCouponApplied: (coupon: CouponData) => void
  onCouponRemoved: () => void
  appliedCoupon: CouponData | null
  cartItems: any[]
  customerId?: number
}

export default function CouponInput({
  onCouponApplied,
  onCouponRemoved,
  appliedCoupon,
  cartItems,
  customerId,
}: CouponInputProps) {
  const [couponCode, setCouponCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState('')
  const [showInput, setShowInput] = useState(false)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Bitte geben Sie einen Gutscheincode ein')
      return
    }

    setIsValidating(true)
    setError('')

    try {
      const response = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponCode: couponCode.trim(),
          cartItems: cartItems.map(item => ({
            productId: item.productId,
            variationId: item.variationId,
            quantity: item.quantity,
            price: item.price,
          })),
          customerId: customerId,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Ungültiger Gutscheincode')
        setIsValidating(false)
        return
      }

      // Coupon is valid
      onCouponApplied(data.coupon)
      setCouponCode('')
      setShowInput(false)
      setError('')
    } catch (err: any) {
      setError('Fehler beim Validieren des Gutscheins. Bitte versuchen Sie es erneut.')
    } finally {
      setIsValidating(false)
    }
  }

  const handleRemoveCoupon = () => {
    onCouponRemoved()
    setCouponCode('')
    setError('')
    setShowInput(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyCoupon()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-primary/10 p-6">
      {/* Applied Coupon Display */}
      {appliedCoupon && (
        <div className="bg-primary-light/10 border border-primary-light rounded-lg p-4 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="bg-primary-light/20 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary-light" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-primary tracking-wide">
                    {appliedCoupon.code}
                  </span>
                  <span className="text-xs bg-primary-light/20 text-primary px-2 py-0.5 rounded-full font-medium">
                    Angewendet
                  </span>
                </div>
                {appliedCoupon.description && (
                  <p className="text-sm text-primary-dark mb-2">{appliedCoupon.description}</p>
                )}
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="text-primary font-semibold">
                    €{appliedCoupon.discountAmount.toFixed(2)} Rabatt
                  </span>
                  {appliedCoupon.freeShipping && (
                    <span className="bg-primary-light/20 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                      Kostenloser Versand
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-primary-light hover:text-primary p-1 hover:bg-primary/5 rounded transition"
              aria-label="Gutschein entfernen"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Coupon Input */}
      {!appliedCoupon && (
        <>
          {!showInput ? (
            <button
              onClick={() => setShowInput(true)}
              className="flex items-center gap-2 text-primary hover:text-primary-light font-medium transition"
              type="button"
            >
              <Tag className="h-5 w-5" />
              <span>Haben Sie einen Gutscheincode?</span>
            </button>
          ) : (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-primary mb-2">
                Gutscheincode eingeben
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase())
                      setError('')
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="SOMMER2024"
                    className={`w-full px-4 py-3 bg-cream/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      error ? 'border-red-500' : 'border-primary/20'
                    }`}
                    disabled={isValidating}
                  />
                  {isValidating && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isValidating || !couponCode.trim()}
                  className="px-6 py-3 bg-primary text-cream rounded-lg font-semibold hover:bg-primary-light transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isValidating ? 'Prüfen...' : 'Anwenden'}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowInput(false)
                  setCouponCode('')
                  setError('')
                }}
                className="text-sm text-primary-dark/60 hover:text-primary-dark"
              >
                Abbrechen
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
