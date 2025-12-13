'use client'

import { Fragment, useState, useEffect, useMemo } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Plus, Minus, ShoppingBag, Truck, Sparkles } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useGeolocation } from '@/lib/hooks/use-geolocation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PaymentIcons } from '@/components/ui/payment-icons'
import { decodeHtmlEntities } from '@/lib/utils/html'
import { formatEUR } from '@/lib/utils/currency'
import { translateCountryName } from '@/lib/utils/countries'
import { calculateCartTotals, getFreeShippingThreshold, getTaxRatePercentage, SHIPPING_RULES } from '@/lib/utils/shipping-calculator'

export function SideCart() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice
  } = useCart()

  const { countryCode, country, loading: geoLoading } = useGeolocation()
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null)
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null)

  // Use selected country if set, otherwise fall back to geolocation
  const activeCountryCode = selectedCountryCode || countryCode || 'AT'

  // Get country display name
  const getCountryDisplayName = (code: string) => {
    const rule = SHIPPING_RULES[code as keyof typeof SHIPPING_RULES]
    return rule ? rule.zoneName : code
  }

  // Calculate cart totals INSTANTLY using client-side rules (<100ms)
  // No API calls, no delays, no loading states needed
  const cartCalculation = useMemo(() => {
    if (items.length === 0) {
      return {
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        country: activeCountryCode,
        isFreeShipping: false,
      }
    }

    return calculateCartTotals(items, activeCountryCode)
  }, [items, activeCountryCode])

  const estimatedTax = cartCalculation.tax
  const estimatedShipping = cartCalculation.shipping
  const estimatedTotal = cartCalculation.total
  const estimatedCountry = getCountryDisplayName(activeCountryCode)
  const taxRatePercentage = getTaxRatePercentage(activeCountryCode)

  // Free shipping threshold and progress (from WooCommerce settings)
  const FREE_SHIPPING_THRESHOLD = getFreeShippingThreshold(activeCountryCode)
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice)
  const freeShippingProgress = Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100)
  const isFreeShippingUnlocked = totalPrice >= FREE_SHIPPING_THRESHOLD

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeCart}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-cream text-primary">
                    {/* Header Section */}
                    <div className="bg-white border-b border-primary/10">
                      {/* Warenkorb Title */}
                      <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-5 w-5 text-primary" />
                          <h2 className="text-h4 text-primary">Warenkorb</h2>
                          {totalItems > 0 && (
                            <span className="ml-1 rounded-full bg-primary text-cream px-2 py-0.5 text-body-sm font-bold">
                              {totalItems}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          className="rounded-md p-2 hover:bg-cream transition-colors text-primary"
                          onClick={closeCart}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Free Shipping Progress - Full Width */}
                      {items.length > 0 && (
                        <div className={`px-6 py-3 border-t transition-all duration-500 bg-gray-200 ${
                          isFreeShippingUnlocked
                            ? 'bg-gradient-to-r from-primary/5 via-primary-light/5 to-primary/5 border-primary/10'
                            : 'bg-cream/30 border-primary/5'
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {isFreeShippingUnlocked ? (
                              <>
                                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                                <span className="text-sm font-bold text-primary">
                                  Kostenloser Versand freigeschaltet!
                                </span>
                              </>
                            ) : (
                              <>
                                <Truck className="w-5 h-5 text-primary" />
                                <span className="text-sm font-medium text-primary-dark">
                                  Noch <span className="font-bold text-primary">{formatEUR(remainingForFreeShipping)}</span> bis kostenloser Versand
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative w-full h-2 bg-primary/10 rounded-full overflow-hidden">
                          <div
                            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out ${
                              isFreeShippingUnlocked
                                ? 'bg-gradient-to-r from-primary via-primary-light to-primary animate-pulse'
                                : 'bg-gradient-to-r from-primary to-primary-light'
                            }`}
                            style={{ width: `${freeShippingProgress}%` }}
                          />
                          {/* Shimmer effect when unlocked */}
                          {isFreeShippingUnlocked && (
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                          )}
                        </div>
                        </div>
                      )}
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-5L0">
                      {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <ShoppingBag className="h-16 w-16 text-primary/20 mb-4" />
                          <p className="text-body text-primary/60 mb-4">Ihr Warenkorb ist leer</p>
                          <Link
                            href="/shop"
                            onClick={closeCart}
                          >
                            <Button variant="primary">
                              Weiter einkaufen
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {items.map((item) => (
                            <div key={item.id} className="flex gap-4 bg-white p-4 rounded-md border border-primary/10">
                              {/* Product Image */}
                              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-primary/10">
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

                              <div className="flex flex-1 flex-col justify-between">
                                <div className="flex justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-body text-primary line-clamp-2">
                                      {decodeHtmlEntities(item.name)}
                                    </h3>
                                    {item.variation?.attributes && (
                                      <p className="mt-1 text-body-sm text-primary/60">
                                        {item.variation.attributes.map((attr) => (
                                          <span key={attr.name}>{decodeHtmlEntities(attr.value)} </span>
                                        ))}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-primary/40 hover:text-primary transition-colors h-fit flex-shrink-0"
                                    aria-label="Remove item"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                                <div className="flex items-end justify-between">
                                  {/* Compact Quantity Selector - Click to expand */}
                                  {expandedItemId === item.id ? (
                                    // Expanded: Show full controls
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="w-6 h-6 flex items-center justify-center rounded border border-primary/20 hover:bg-primary hover:text-cream transition-colors text-primary"
                                        aria-label="Decrease quantity"
                                      >
                                        <Minus className="h-3 w-3" />
                                      </button>
                                      <span className="w-4 text-center text-sm font-bold text-primary">{item.quantity}</span>
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-6 h-6 flex items-center justify-center rounded border border-primary/20 hover:bg-primary hover:text-cream transition-colors text-primary"
                                        aria-label="Increase quantity"
                                      >
                                        <Plus className="h-3 w-3" />
                                      </button>
                                      <button
                                        onClick={() => setExpandedItemId(null)}
                                        className="ml-1 text-md text-primary/50 hover:text-primary"
                                        aria-label="Close"
                                      >
                                        ✓
                                      </button>
                                    </div>
                                  ) : (
                                    // Collapsed: Show compact badge
                                    <button
                                      onClick={() => setExpandedItemId(item.id)}
                                      className="px-2 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors text-sm font-medium text-primary"
                                      aria-label="Change quantity"
                                    >
                                      ×{item.quantity}
                                    </button>
                                  )}
                                  <p className="text-lg text-primary font-bold">
                                    {formatEUR(item.price * item.quantity)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Checkout Section */}
                    {items.length > 0 && (
                      <div className="border-t border-primary/10 px-4 py-4 bg-white space-y-2">
                        {/* Shipping and Tax Notice Box */}
                        <div className="mb-2 p-3 bg-cream/50 rounded-md border border-primary/10">
                          <div className="flex items-start gap-2">
                            <Truck className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                            <div className="text-xs flex-1">
                              <p className="text-primary/70">
                                Versand und MwSt basierend auf{' '}
                                <span className="relative inline-block">
                                  <select
                                    value={activeCountryCode}
                                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                                    className="appearance-none bg-transparent text-primary font-medium underline cursor-pointer hover:text-primary/80 transition-colors border-0 focus:outline-none focus:ring-0 p-0"
                                  >
                                    {Object.keys(SHIPPING_RULES)
                                      .filter((code) => code !== 'DEFAULT')
                                      .map((code) => (
                                        <option key={code} value={code}>
                                          {getCountryDisplayName(code)}
                                        </option>
                                      ))}
                                  </select>
                                </span>.
                              </p>
                              <p className="text-primary/50 mt-1 hidden md:block">
                                Endgültige Kosten werden an der Kasse berechnet.
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Subtotal */}
                        <div className="flex justify-between text-sm">
                          <p className="text-primary/60">Zwischensumme</p>
                          <p className="text-primary font-bold">{formatEUR(totalPrice)}</p>
                        </div>

                        {/* Shipping */}
                        <div className="flex justify-between text-xs">
                          <p className="text-primary/50">Versandkosten</p>
                          <p className={estimatedShipping === 0 ? 'text-primary font-bold' : 'text-primary/70'}>
                            {estimatedShipping === 0 ? 'Kostenlos' : formatEUR(estimatedShipping)}
                          </p>
                        </div>

                        {/* Tax */}
                        <div className="flex justify-between text-xs">
                          <p className="text-primary/50">MwSt. ({taxRatePercentage}%)</p>
                          <p className="text-primary/70">{formatEUR(estimatedTax)}</p>
                        </div>

                        <div className="border-b border-primary/10" />

                        {/* Total */}
                        <div className="flex justify-between text-lg font-bold pt-1">
                          <p className="text-primary">Summe</p>
                          <p className="text-primary">{formatEUR(estimatedTotal)}</p>
                        </div>

                        {/* Checkout Button */}
                        <Link
                          href="/checkout"
                          onClick={closeCart}
                        >
                          <Button
                            variant="primary"
                            size="lg"
                            className="w-full"
                          >
                            Zur Kassa
                          </Button>
                        </Link>

                        {/* Payment Methods */}
                        <div className="flex flex-col items-center gap-1.5 pt-2 border-t border-primary/10">
                          <PaymentIcons className="justify-center" />
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
