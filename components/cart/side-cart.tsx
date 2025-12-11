'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { decodeHtmlEntities } from '@/lib/utils/html'
import { formatEUR } from '@/lib/utils/currency'

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
                              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-primary/10">
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
                                  <p className="text-price text-primary font-bold">
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
                      <div className="border-t border-primary/10 px-6 py-6 bg-white">
                        {/* Subtotal */}
                        <div className="flex justify-between text-body mb-4">
                          <p className="text-primary/60">Zwischensumme</p>
                          <p className="text-primary font-bold">{formatEUR(totalPrice)}</p>
                        </div>

                        <div className="border-b border-primary/10 mb-4" />

                        {/* Total */}
                        <div className="flex justify-between text-h4 font-bold mb-6">
                          <p className="text-primary">Gesamt</p>
                          <p className="text-primary">{formatEUR(totalPrice)}</p>
                        </div>

                        {/* Tax Notice */}
                        <p className="text-body-sm text-primary/60 mb-4 text-center">
                          Versand und Steuern werden an der Kasse berechnet
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
                            Zur Kasse gehen
                          </Button>
                        </Link>

                        {/* Continue Shopping */}
                        <Link
                          href="/shop"
                          onClick={closeCart}
                          className="block text-center mt-4"
                        >
                          <Button
                            variant="outline"
                            size="md"
                            className="w-full"
                          >
                            Weiter einkaufen
                          </Button>
                        </Link>
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
