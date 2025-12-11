'use client'

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export function Navbar() {
  const { openCart, totalItems } = useCart()

  return (
    <nav className="bg-primary text-cream sticky top-0 z-50 shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-h4 font-serif italic">Olivadis</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-body hover:text-cream-light transition-colors">
              Startseite
            </Link>
            <Link href="/shop" className="text-body hover:text-cream-light transition-colors">
              Shop
            </Link>
            <Link href="/rezepte" className="text-body hover:text-cream-light transition-colors">
              Rezepte
            </Link>
            <Link href="/ueber-uns" className="text-body hover:text-cream-light transition-colors">
              Unsere Geschichte
            </Link>
            <Link href="/checkout" className="text-body hover:text-cream-light transition-colors">
              Kasse
            </Link>
          </div>

          <button
            onClick={openCart}
            className="relative p-2 hover:bg-primary-light rounded-md transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-cream text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}
