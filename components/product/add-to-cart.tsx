'use client'

import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { Product, ProductVariation } from '@/lib/woocommerce/products'
import { Button } from '@/components/ui/button'

interface AddToCartButtonProps {
  product: Product
  variation?: ProductVariation
  className?: string
  quantity?: number
}

export function AddToCartButton({
  product,
  variation,
  className = "",
  quantity = 1
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    setIsAdding(true)

    addItem(product, quantity, variation)

    setTimeout(() => {
      setIsAdding(false)
    }, 500)
  }

  const stockStatus = variation?.stock_status || product.stock_status
  const isOutOfStock = stockStatus === 'outofstock'

  if (isOutOfStock) {
    return (
      <Button
        disabled
        variant="secondary"
        size="lg"
        className={`w-full cursor-not-allowed opacity-50 ${className}`}
      >
        Ausverkauft
      </Button>
    )
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding}
      variant="primary"
      size="lg"
      className={`w-full ${isAdding ? 'opacity-75' : ''} ${className}`}
    >
      {isAdding ? (
        <>Wird hinzugefügt...</>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          In den Warenkorb
        </>
      )}
    </Button>
  )
}
