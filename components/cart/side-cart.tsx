'use client'

import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Plus, Minus, ShoppingBag, Trash2, Truck, Sparkles } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useGeolocation } from '@/lib/hooks/use-geolocation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PaymentIcons } from '@/components/ui/payment-icons'
import { decodeHtmlEntities } from '@/lib/utils/html'
import { formatEUR } from '@/lib/utils/currency'
import { translateCountryName } from '@/lib/utils/countries'

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
  const [estimatedTax, setEstimatedTax] = useState(0)
  const [estimatedShipping, setEstimatedShipping] = useState(0)
  const [taxRate, setTaxRate] = useState(0)
  const [estimatedCountry, setEstimatedCountry] = useState('Austria')
  const [isCalculating, setIsCalculating] = useState(false)

  // Fetch estimated tax and shipping when cart changes or country is detected
  useEffect(() => {
    if (geoLoading || items.length === 0) return

    // Show calculating state immediately
    setIsCalculating(true)

    // Debounce API calls to avoid rapid-fire requests
    const debounceTimer = setTimeout(() => {
      // Fetch estimated costs from API
      fetch('/api/cart/estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        country: countryCode,
        subtotal: totalPrice,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }),
    })
      .then(res => res.json())
      .then(data => {
        console.log('Cart estimate response:', data)
        if (data.success) {
          const translatedCountry = translateCountryName(data.countryName || country)
          console.log('Translating country:', data.countryName, '->', translatedCountry)
          setEstimatedTax(data.tax || 0)
          setEstimatedShipping(data.shipping || 0)
          setTaxRate(data.taxRate || 0)
          setEstimatedCountry(translatedCountry)
        } else {
          // API returned error but with data
          const translatedCountry = translateCountryName(data.countryName || country)
          console.log('API error, using fallback. Country:', data.countryName, '->', translatedCountry)
          setEstimatedTax(data.tax || totalPrice * 0.20)
          setEstimatedShipping(data.shipping || 5.90)
          setTaxRate(data.taxRate || 20)
          setEstimatedCountry(translatedCountry)
        }
        setIsCalculating(false)
      })
      .catch((error) => {
        console.error('Failed to fetch cart estimates:', error)
        // Fallback to default estimates
        const translatedCountry = translateCountryName(country)
        console.log('Catch fallback. Country:', country, '->', translatedCountry)
        setEstimatedTax(totalPrice * 0.20) // 20% VAT default
        setEstimatedShipping(5.90) // Default shipping
        setTaxRate(20)
        setEstimatedCountry(translatedCountry)
        setIsCalculating(false)
      })
    }, 300) // 300ms debounce delay

    // Cleanup function to cancel pending API calls
    return () => clearTimeout(debounceTimer)
  }, [countryCode, totalPrice, items, geoLoading, country])

  const estimatedTotal = totalPrice + estimatedTax + estimatedShipping

  // Free shipping threshold and progress
  const FREE_SHIPPING_THRESHOLD = 50
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
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-primary/10 px-6 py-4 bg-white">
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

                    {/* Free Shipping Progress - Only show if cart has items */}
                    {items.length > 0 && (
                      <div className={`mx-6 mt-4 mb-2 p-4 rounded-lg transition-all duration-500 ${
                        isFreeShippingUnlocked
                          ? 'bg-gradient-to-r from-primary/10 via-primary-light/10 to-primary/10 border-2 border-primary/20'
                          : 'bg-cream/50 border border-primary/10'
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

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
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
                        <div className="space-y-6">
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

                              <div className="flex flex-1 flex-col">
                                <div className="flex justify-between">
                                  <div className="flex-1">
                                    <h3 className="text-body font-bold text-primary">
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
                                    className="text-primary/40 hover:text-primary transition-colors ml-2 h-fit"
                                    aria-label="Remove item"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                                <div className="mt-2 flex items-end justify-between">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      className="rounded-md border border-primary/20 p-1 hover:bg-cream transition-colors text-primary"
                                      aria-label="Decrease quantity"
                                    >
                                      <Minus className="h-3 w-3" />
                                    </button>
                                    <span className="w-8 text-center text-body font-bold text-primary">{item.quantity}</span>
                                    <button
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      className="rounded-md border border-primary/20 p-1 hover:bg-cream transition-colors text-primary"
                                      aria-label="Increase quantity"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </button>
                                  </div>
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
                      <div className="border-t border-primary/10 px-6 py-4 bg-white space-y-2">
                        {/* Subtotal */}
                        <div className="flex justify-between text-sm">
                          <p className="text-primary/60">Zwischensumme</p>
                          <p className="text-primary font-bold">{formatEUR(totalPrice)}</p>
                        </div>

                        {/* Estimated Shipping */}
                        <div className={`flex justify-between text-xs transition-all duration-300 ${isCalculating ? 'blur-sm opacity-50' : ''}`}>
                          <p className="text-primary/50">Geschätzter Versand ({estimatedCountry})</p>
                          <p className={estimatedShipping === 0 ? 'text-primary font-bold' : 'text-primary/70'}>
                            {estimatedShipping === 0 ? 'Kostenlos' : formatEUR(estimatedShipping)}
                          </p>
                        </div>

                        {/* Estimated Tax */}
                        <div className={`flex justify-between text-xs transition-all duration-300 ${isCalculating ? 'blur-sm opacity-50' : ''}`}>
                          <p className="text-primary/50">Geschätzte MwSt. ({taxRate}%, {estimatedCountry})</p>
                          <p className="text-primary/70">{formatEUR(estimatedTax)}</p>
                        </div>

                        <div className="border-b border-primary/10" />

                        {/* Total */}
                        <div className="flex justify-between text-lg font-bold pt-1">
                          <p className="text-primary">Geschätzte Summe</p>
                          <p className="text-primary">{formatEUR(estimatedTotal)}</p>
                        </div>

                        {/* Tax Notice */}
                        <p className="text-[10px] text-primary/60 text-center pb-1">
                          Endgültige Kosten werden an der Kasse berechnet
                        </p>

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
