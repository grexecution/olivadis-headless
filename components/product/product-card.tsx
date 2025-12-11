'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/woocommerce/products'
import { AddToCartButton } from './add-to-cart'
import { decodeHtmlEntities } from '@/lib/utils/html'
import { formatEUR } from '@/lib/utils/currency'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const price = parseFloat(product.price)
  const regularPrice = parseFloat(product.regular_price)
  const isOnSale = product.on_sale && regularPrice > price

  return (
    <div className="group flex flex-col bg-white border border-gray-200 rounded-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Product Image */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-cream">
        {product.images[0]?.src ? (
          <Image
            src={product.images[0].src}
            alt={decodeHtmlEntities(product.images[0].alt || product.name)}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-cream">
            <span className="text-primary/30 text-h4">No Image</span>
          </div>
        )}

        {/* Sale Badge */}
        {isOnSale && (
          <div className="absolute top-3 right-3 bg-primary text-cream px-3 py-1 rounded-md text-body-sm font-bold">
            Sale
          </div>
        )}

        {/* Out of Stock Badge */}
        {product.stock_status === 'outofstock' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-cream text-h4 font-bold">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-h4 text-primary mb-2 hover:text-primary-light transition-colors">
            {decodeHtmlEntities(product.name)}
          </h3>
        </Link>

        {/* Short Description */}
        {product.short_description && (
          <div
            className="text-body-sm text-primary-dark/70 mb-3 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: product.short_description }}
          />
        )}

        {/* Price */}
        <div className="mb-4 mt-auto">
          {isOnSale ? (
            <div className="flex items-baseline gap-2">
              <span className="text-price text-primary font-bold">
                {formatEUR(price)}
              </span>
              <span className="text-body-sm text-gray-400 line-through">
                {formatEUR(regularPrice)}
              </span>
            </div>
          ) : (
            <span className="text-price text-primary font-bold">
              €{price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <AddToCartButton product={product} />
      </div>
    </div>
  )
}
