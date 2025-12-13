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
      <p className="text-base text-primary-dark mb-4 font-bold">
        Verfügbare Optionen:
      </p>

      {/* Variation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {variations.map((variation) => {
          const attributeName = variation.attributes[0]?.option || `Variante ${variation.id}`
          const isSelected = selectedVariation?.id === variation.id
          const isOutOfStock = variation.stock_status === 'outofstock'
          const salePrice = variation.on_sale && variation.regular_price
            ? parseFloat(variation.regular_price) - parseFloat(variation.price)
            : 0

          return (
            <button
              key={variation.id}
              onClick={() => !isOutOfStock && setSelectedVariation(variation)}
              disabled={isOutOfStock}
              className={`group relative w-full border-2 rounded-lg p-3 transition-all flex items-start gap-3 ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-primary/20 bg-white hover:border-primary hover:bg-cream/50'
              } ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* Selected Checkmark */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-primary text-cream rounded-full p-1 shadow-lg z-10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Sale Badge */}
              {!isOutOfStock && salePrice > 0 && (
                <div className="absolute top-2 right-2 bg-primary text-cream px-2 py-0.5 rounded-md text-xs font-bold shadow-sm">
                  -{Math.round((salePrice / parseFloat(variation.regular_price!)) * 100)}%
                </div>
              )}

              {/* Variation Image - Left */}
              {variation.image?.src && (
                <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-md bg-cream">
                  <Image
                    src={variation.image.src}
                    alt={attributeName}
                    fill
                    className={`object-cover transition-transform duration-300 ${
                      !isOutOfStock && 'group-hover:scale-105'
                    }`}
                    sizes="64px"
                  />
                </div>
              )}

              {/* Variation Info - Name and Price */}
              <div className="flex-1 flex flex-col gap-1.5 text-left min-w-0">
                {/* Name */}
                <p className={`text-sm font-semibold leading-tight ${isSelected ? 'text-primary' : 'text-primary-dark'}`}>
                  {attributeName}
                </p>

                {/* Price */}
                {variation.price && (
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className={`text-base font-bold ${isSelected ? 'text-primary' : 'text-primary-dark'}`}>
                      {formatEUR(parseFloat(variation.price))}
                    </span>
                    {variation.on_sale && variation.regular_price && (
                      <span className="text-sm text-primary-dark/40 line-through">
                        {formatEUR(parseFloat(variation.regular_price))}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Stock Badge */}
              {isOutOfStock && (
                <div className="absolute top-2 right-2 bg-primary-dark/90 text-cream px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">
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
          {/* Price Display */}
          <div className="bg-cream/30 rounded-lg p-4 border border-primary/10">
            {selectedVariation.on_sale && selectedVariation.regular_price ? (
              <div className="flex items-center sm:items-start gap-2 sm:gap-3">
                {/* Price Info */}
                <div className="flex items-baseline gap-3 flex-1">
                  <span className="text-price text-primary font-bold">
                    {formatEUR(parseFloat(selectedVariation.price))}
                  </span>
                  <span className="text-body-lg text-primary-dark/40 line-through">
                    {formatEUR(parseFloat(selectedVariation.regular_price))}
                  </span>
                </div>

                {/* Savings Badge */}
                <span className="bg-primary text-cream px-3 py-1 sm:px-4 sm:py-2.5 rounded-md text-sm font-bold whitespace-nowrap">
                  -{Math.round(((parseFloat(selectedVariation.regular_price) - parseFloat(selectedVariation.price)) / parseFloat(selectedVariation.regular_price)) * 100)}%
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
