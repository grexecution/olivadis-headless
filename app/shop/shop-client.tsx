'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { SlidersHorizontal } from 'lucide-react'
import { Product, ProductCategory } from '@/lib/woocommerce/products'
import { ProductCard } from '@/components/product/product-card'
import ShopFilters from '@/components/shop/shop-filters'

interface ShopClientProps {
  products: Product[]
  categories: ProductCategory[]
}

export function ShopClient({ products, categories }: ShopClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null)

  useEffect(() => {
    // Get filter parameters from URL
    const category = searchParams.get('category')
    const size = searchParams.get('size')
    const minPrice = searchParams.get('min_price')
    const maxPrice = searchParams.get('max_price')

    // Filter products in-memory (instant, no API calls)
    let filtered = products

    // Filter by category
    if (category) {
      filtered = filtered.filter(product =>
        product.categories.some(cat => cat.slug === category)
      )
      // Find the selected category object for the hero
      const categoryObj = categories.find(cat => cat.slug === category)
      setSelectedCategory(categoryObj || null)
    } else {
      setSelectedCategory(null)
    }

    // Filter by price range
    const min = minPrice ? Number(minPrice) : 0
    const max = maxPrice ? Number(maxPrice) : Infinity
    if (minPrice || maxPrice) {
      filtered = filtered.filter(product => {
        const price = Number(product.price)
        return price >= min && price <= max
      })
    }

    // Filter by size
    if (size) {
      filtered = filtered.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(size.toLowerCase())
        const attributeMatch = product.attributes.some(attr =>
          attr.options.some(opt => opt.toLowerCase().includes(size.toLowerCase()))
        )
        return nameMatch || attributeMatch
      })
    }

    // Sort: In-stock products first, then out-of-stock
    filtered.sort((a, b) => {
      const aInStock = a.stock_status === 'instock' || a.in_stock
      const bInStock = b.stock_status === 'instock' || b.in_stock

      // In-stock products (true) come before out-of-stock (false)
      if (aInStock && !bInStock) return -1
      if (!aInStock && bInStock) return 1
      return 0
    })

    setFilteredProducts(filtered)
  }, [searchParams, products, categories])

  return (
    <div className="min-h-screen bg-background">
      {/* Shop Hero - Always shown */}
      <section className="bg-gradient-to-b from-cream to-cream/50 border-b border-primary/10 py-8 md:py-10">
        <div className="container">
          <div className="max-w-3xl">
            {/* Mobile Hero Card */}
            <div className="flex items-center justify-between gap-4">
              {/* Left Column: Title & Metadata */}
              <div className="flex-1 min-w-0">
                {/* Shop Title */}
                <h1 className="text-h2 md:text-h1 text-primary font-serif mb-3 tracking-tight">
                  Shop
                </h1>

                {/* Metadata Row with enhanced styling */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Category Badge - Enhanced */}
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1.5 bg-primary text-white px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm">
                      {selectedCategory.name}
                    </span>
                  )}

                  {/* Product Count - Enhanced Typography */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-primary-dark/70">
                      {filteredProducts.length}
                    </span>
                    <span className="text-sm text-primary-dark/50">
                      {filteredProducts.length === 1 ? 'Produkt' : 'Produkte'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Filter Button (Mobile Only) - Enhanced */}
              <button
                onClick={() => {
                  if ((window as any).__openMobileFilter) {
                    (window as any).__openMobileFilter()
                  }
                }}
                className="md:hidden group bg-primary text-white py-3 px-4 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:bg-primary-dark transition-all duration-200 flex items-center gap-2 flex-shrink-0 active:scale-95"
              >
                <SlidersHorizontal className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                <span className="hidden sm:inline">Filtern</span>
              </button>
            </div>

            {/* Category Description - Enhanced */}
            {selectedCategory?.description && (
              <div className="mt-4 pt-4 border-t border-primary/10">
                <p className="text-sm md:text-base text-primary-dark/70 leading-relaxed italic">
                  {selectedCategory.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Category Selector - Mobile Only */}
      <section className="bg-background border-b border-primary/10 py-4 md:hidden">
        <div className="container">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            {/* All Products Button */}
            <button
              onClick={() => router.push('/shop')}
              className={`flex-shrink-0 snap-start px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                !searchParams.get('category')
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-primary border border-primary/20 hover:border-primary'
              }`}
            >
              Alle
            </button>

            {/* Category Pills */}
            {categories
              .filter(cat => cat.slug !== 'uncategorized')
              .map((category) => (
                <button
                  key={category.id}
                  onClick={() => router.push(`/shop?category=${category.slug}`)}
                  className={`flex-shrink-0 snap-start px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                    searchParams.get('category') === category.slug
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-primary border border-primary/20 hover:border-primary'
                  }`}
                >
                  {category.name}
                  <span className="ml-1.5 text-xs opacity-70">({category.count})</span>
                </button>
              ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-6 md:py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-8">
            {/* Filter Sidebar */}
            <aside className="col-span-1 md:col-span-1 lg:col-span-1">
              <ShopFilters categories={categories} onOpenMobileFilter={() => {}} />
            </aside>

            {/* Products Area */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 md:py-20">
                  <div className="max-w-md mx-auto bg-cream p-8 rounded-lg">
                    <p className="text-h3 md:text-h3-lg text-primary mb-4">Keine Produkte gefunden</p>
                    <p className="text-base md:text-body text-primary-dark/70">
                      {products.length === 0
                        ? 'Produkte werden hier angezeigt, sobald Sie Ihre WooCommerce-API-Anmeldedaten konfiguriert haben'
                        : 'Keine Produkte entsprechen den ausgewählten Filtern. Versuchen Sie, die Filter zurückzusetzen.'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
