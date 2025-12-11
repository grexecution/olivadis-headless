'use client'

import { ReactNode } from 'react'
import { CartProvider } from '@/lib/cart-context'
import { CurrencyProvider } from '@/lib/currency-context'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CurrencyProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </CurrencyProvider>
  )
}
