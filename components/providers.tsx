'use client'

import { ReactNode } from 'react'
import { CartProvider } from '@/lib/cart-context'
import { CurrencyProvider } from '@/lib/currency-context'
import { GeolocationProvider } from '@/lib/geolocation-context'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <GeolocationProvider>
      <CurrencyProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </CurrencyProvider>
    </GeolocationProvider>
  )
}
