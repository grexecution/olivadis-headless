'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product, ProductVariation } from '@/lib/woocommerce/products'
import { formatEUR } from '@/lib/utils/currency'
import { AddToCartButton } from './add-to-cart'

interface VariationSelectorProps {
  variations: ProductVariation[]
  product: Product
}

export function VariationSelector({ variations, product }: VariationSelectorProps) {
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(
    variations[0] || null
  )

  if (variations.length === 0) return null

  return (
    <div className="mb-3">
      <p className="text-body-sm text-primary-dark mb-3 font-bold">
        Verfügbare Optionen:
      </p>

      {/* Variation Grid */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {variations.map((variation) => {
          const attributeName = variation.attributes[0]?.option || `Variante ${variation.id}`
          const isSelected = selectedVariation?.id === variation.id
          const isOutOfStock = variation.stock_status === 'outofstock'

          return (
            <button
              key={variation.id}
              onClick={() => !isOutOfStock && setSelectedVariation(variation)}
              disabled={isOutOfStock}
              className={`group relative w-full border-2 rounded-lg p-2 transition-all flex items-start gap-2 ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-primary/20 bg-white hover:border-primary hover:bg-cream/50'
              } ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* Selected Checkmark */}
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 bg-primary text-cream rounded-full p-0.5 shadow-lg z-10">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Variation Image - Left */}
              {variation.image?.src && (
                <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden rounded-md bg-cream">
                  <Image
                    src={variation.image.src}
                    alt={attributeName}
                    fill
                    className={`object-cover transition-transform duration-300 ${
                      !isOutOfStock && 'group-hover:scale-105'
                    }`}
                    sizes="48px"
                  />
                </div>
              )}

              {/* Variation Info - Name and Price */}
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap:0 md:gap-0.5 sm:gap-2 text-left min-w-0">
                {/* Name */}
                <p className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-primary-dark'}`}>
                  {attributeName}
                </p>

                {/* Price */}
                {variation.price && (
                  <div className="flex flex-col md:flex-row md:items-baseline gap:0 md:gap-1.5">
                    {variation.on_sale && variation.regular_price ? (
                      <>
                        <span className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-primary-dark'}`}>
                          {formatEUR(parseFloat(variation.price))}
                        </span>
                        <span className="text-xs text-primary-dark/40 line-through">
                          {formatEUR(parseFloat(variation.regular_price))}
                        </span>
                      </>
                    ) : (
                      <span className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-primary-dark'}`}>
                        {formatEUR(parseFloat(variation.price))}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Stock Badge */}
              {isOutOfStock && (
                <div className="absolute top-1.5 right-1.5 bg-primary-dark/80 text-cream px-2 py-0.5 rounded text-xs font-bold">
                  Ausverkauft
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Price & Add to Cart for Selected Variation */}
      {selectedVariation && (
        <div className="space-y-4 mb-3">
          {/* Price */}
          <div>
            {selectedVariation.on_sale && selectedVariation.regular_price ? (
              <div className="flex items-start gap-4">
                <div className="flex flex-col gap:0 md:gap-1">
                  <span className="text-price text-primary font-bold">
                    {formatEUR(parseFloat(selectedVariation.price))}
                  </span>
                  <span className="text-body-lg text-primary-dark/40 line-through">
                    {formatEUR(parseFloat(selectedVariation.regular_price))}
                  </span>
                </div>
                <span className="bg-primary text-cream px-3 py-1 rounded-md text-body-sm font-bold whitespace-nowrap">
                  Sparen Sie {formatEUR(parseFloat(selectedVariation.regular_price) - parseFloat(selectedVariation.price))}
                </span>
              </div>
            ) : (
              <span className="text-price text-primary font-bold">
                {formatEUR(parseFloat(selectedVariation.price))}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <AddToCartButton
            product={product}
            variation={selectedVariation}
          />
        </div>
      )}
    </div>
  )
}
