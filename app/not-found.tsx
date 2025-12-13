import Link from 'next/link'
import { Home, ShoppingBag } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-120px)] bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-[120px] md:text-[180px] font-bold text-primary/10 leading-none font-serif">
            404
          </h1>
        </div>

        {/* Main Message */}
        <div className="mb-12">
          <h2 className="text-h2 md:text-h2-lg text-primary mb-4 font-serif">
            Seite nicht gefunden
          </h2>
          <p className="text-base md:text-body text-primary-dark/70 max-w-md mx-auto">
            Die Seite, die Sie suchen, existiert leider nicht. Vielleicht wurde sie verschoben oder der Link ist veraltet.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full text-button font-bold hover:bg-primary-light transition-all hover:scale-105 shadow-lg"
          >
            <Home className="w-5 h-5" />
            Zur Startseite
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-cream text-primary border-2 border-primary px-8 py-4 rounded-full text-button font-bold hover:bg-primary hover:text-white transition-all hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            Zum Shop
          </Link>
        </div>
      </div>
    </div>
  )
}
