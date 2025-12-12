'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from 'lucide-react'
import { ProductCategory } from '@/lib/woocommerce/products'

interface ShopFiltersProps {
  categories: ProductCategory[]
}

const SIZES = ['100ml', '200ml', '300ml', '400ml', '500ml', '600ml', '1L', '3L']

export default function ShopFilters({ categories }: ShopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '')
  const [selectedSize, setSelectedSize] = useState<string>(searchParams.get('size') || '')
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('min_price')) || 0,
    Number(searchParams.get('max_price')) || 200
  ])

  const [showCategories, setShowCategories] = useState(true)
  const [showPrice, setShowPrice] = useState(true)
  const [showSize, setShowSize] = useState(true)

  // Mobile filter modal state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Prevent body scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileFilterOpen])

  const applyFilters = (category?: string, size?: string, minPrice?: number, maxPrice?: number) => {
    const params = new URLSearchParams()

    const cat = category !== undefined ? category : selectedCategory
    const sz = size !== undefined ? size : selectedSize
    const minP = minPrice !== undefined ? minPrice : priceRange[0]
    const maxP = maxPrice !== undefined ? maxPrice : priceRange[1]

    if (cat) params.set('category', cat)
    if (sz) params.set('size', sz)
    if (minP > 0) params.set('min_price', minP.toString())
    if (maxP < 200) params.set('max_price', maxP.toString())

    router.push(`/shop${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    applyFilters(category, undefined, undefined, undefined)
  }

  const handleSizeChange = (size: string) => {
    const newSize = selectedSize === size ? '' : size
    setSelectedSize(newSize)
    applyFilters(undefined, newSize, undefined, undefined)
  }

  const handlePriceApply = () => {
    applyFilters(undefined, undefined, priceRange[0], priceRange[1])
  }

  const handleClearFilters = () => {
    setSelectedCategory('')
    setSelectedSize('')
    setPriceRange([0, 200])
    router.push('/shop')
  }

  // Count active filters
  const activeFiltersCount = [
    selectedCategory,
    selectedSize,
    priceRange[0] > 0 || priceRange[1] < 200
  ].filter(Boolean).length

  // Filter content component (reusable for mobile and desktop)
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-h4 font-bold text-primary">Filter</h2>
        {(selectedCategory || selectedSize || priceRange[0] > 0 || priceRange[1] < 200) && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-primary/60 hover:text-primary transition-colors flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Zurücksetzen
          </button>
        )}
      </div>

      <div className="h-px bg-primary/10" />

      {/* Categories */}
      <div className="space-y-4">
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-body font-semibold text-primary">Kategorien</h3>
          {showCategories ? (
            <ChevronUp className="w-4 h-4 text-primary/60" />
          ) : (
            <ChevronDown className="w-4 h-4 text-primary/60" />
          )}
        </button>

        {showCategories && (
          <div className="space-y-3">
            <button
              onClick={() => handleCategoryChange('')}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === ''
                  ? 'bg-primary text-white'
                  : 'text-primary/60 hover:bg-cream/50'
              }`}
            >
              Alle Produkte
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.slug)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.slug
                    ? 'bg-primary text-white'
                    : 'text-primary/60 hover:bg-cream/50'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-px bg-primary/10" />

      {/* Price Range */}
      <div className="space-y-4">
        <button
          onClick={() => setShowPrice(!showPrice)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-body font-semibold text-primary">Preis</h3>
          {showPrice ? (
            <ChevronUp className="w-4 h-4 text-primary/60" />
          ) : (
            <ChevronDown className="w-4 h-4 text-primary/60" />
          )}
        </button>

        {showPrice && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-primary">
              <span>€{priceRange[0]}</span>
              <span>€{priceRange[1]}</span>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="200"
                step="10"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-full h-2 bg-cream rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <input
                type="range"
                min="0"
                max="200"
                step="10"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full h-2 bg-cream rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-primary/10" />

      {/* Size */}
      <div className="space-y-4">
        <button
          onClick={() => setShowSize(!showSize)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-body font-semibold text-primary">Größe</h3>
          {showSize ? (
            <ChevronUp className="w-4 h-4 text-primary/60" />
          ) : (
            <ChevronDown className="w-4 h-4 text-primary/60" />
          )}
        </button>

        {showSize && (
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedSize === size
                    ? 'bg-primary text-cream'
                    : 'bg-cream/50 text-primary/60 hover:bg-cream'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-px bg-primary/10" />

      {/* Apply Price Filter Button */}
      <button
        onClick={handlePriceApply}
        className="w-full bg-primary text-white py-3 px-6 rounded-lg font-bold hover:bg-primary-dark transition-colors"
      >
        Preis anwenden
      </button>
    </div>
  )

  return (
    <>
      {/* Mobile Filter Button - Only visible on mobile */}
      <div className="md:hidden mb-6">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="w-full bg-cream border-2 border-primary/20 text-primary py-3 px-6 rounded-lg font-bold hover:bg-primary hover:text-cream transition-all flex items-center justify-center gap-2 relative"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filter & Sortieren
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-cream w-6 h-6 rounded-full text-sm font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filter Modal - Slide up from bottom */}
      {isMobileFilterOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-primary-dark/60 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Modal */}
          <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
            {/* Modal Header */}
            <div className="sticky top-0 bg-background border-b border-primary/10 p-4 flex items-center justify-between z-10">
              <h2 className="text-h4 font-bold text-primary">Filter & Sortieren</h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 hover:bg-cream/50 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-primary" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <FilterContent />
            </div>

            {/* Modal Footer - Apply Button */}
            <div className="sticky bottom-0 bg-background border-t border-primary/10 p-4">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-primary text-cream py-4 px-6 rounded-lg font-bold hover:bg-primary-dark transition-colors"
              >
                Ergebnisse anzeigen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filter Sidebar - Hidden on mobile */}
      <div className="hidden md:block bg-background border border-primary/10 rounded-2xl p-6 sticky top-24">
        <FilterContent />
      </div>
    </>
  )
}
