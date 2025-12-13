'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Product, ProductCategory } from '@/lib/woocommerce/products'
import { ProductCard } from '@/components/product/product-card'
import ShopFilters from '@/components/shop/shop-filters'

interface ShopClientProps {
  products: Product[]
  categories: ProductCategory[]
}

export function ShopClient({ products, categories }: ShopClientProps) {
  const searchParams = useSearchParams()
  const [filteredProducts, setFilteredProducts] = useState(products)

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

    setFilteredProducts(filtered)
  }, [searchParams, products])

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-background py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Filter Sidebar */}
            <aside className="col-span-1 md:col-span-1 lg:col-span-1">
              <ShopFilters categories={categories} />
            </aside>

            {/* Products Area */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              {/* Product Count */}
              <div className="mb-8">
                <p className="text-body text-primary-dark">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'Produkt' : 'Produkte'} angezeigt
                </p>
              </div>

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
