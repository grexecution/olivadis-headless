import { getAllProducts, getCategories, Product, ProductCategory } from '@/lib/woocommerce/products'
import { ProductCard } from '@/components/product/product-card'
import ShopFilters from '@/components/shop/shop-filters'

interface ShopPageProps {
  searchParams: Promise<{
    category?: string
    size?: string
    min_price?: string
    max_price?: string
  }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  let products: Product[] = []
  let categories: ProductCategory[] = []

  try {
    products = await getAllProducts()
    categories = await getCategories()
  } catch (error) {
    console.error('Failed to fetch products:', error)
    // Continue with empty array - show empty state
  }

  // Filter products based on URL parameters
  let filteredProducts = products

  // Filter by category
  if (params.category) {
    filteredProducts = filteredProducts.filter(product =>
      product.categories.some(cat => cat.slug === params.category)
    )
  }

  // Filter by price range
  const minPrice = params.min_price ? Number(params.min_price) : 0
  const maxPrice = params.max_price ? Number(params.max_price) : Infinity
  if (params.min_price || params.max_price) {
    filteredProducts = filteredProducts.filter(product => {
      const price = Number(product.price)
      return price >= minPrice && price <= maxPrice
    })
  }

  // Filter by size (checking product attributes and variations)
  if (params.size) {
    filteredProducts = filteredProducts.filter(product => {
      // Check if product name or attributes contain the size
      const nameMatch = product.name.toLowerCase().includes(params.size!.toLowerCase())
      const attributeMatch = product.attributes.some(attr =>
        attr.options.some(opt => opt.toLowerCase().includes(params.size!.toLowerCase()))
      )
      return nameMatch || attributeMatch
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Shop Content */}
      <section className="bg-background py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Filter Sidebar - 1/3 width on tablets, 1/4 width on large screens */}
            <aside className="md:col-span-1 lg:col-span-1">
              <ShopFilters categories={categories} />
            </aside>

            {/* Products Area - 2/3 width on tablets, 3/4 width on large screens */}
            <div className="md:col-span-2 lg:col-span-3">
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
                <div className="text-center py-20">
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
