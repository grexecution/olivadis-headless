import Image from 'next/image'
import { getAllProducts, Product } from '@/lib/woocommerce/products'
import { ProductCard } from '@/components/product/product-card'

export default async function ShopPage() {
  let products: Product[] = []

  try {
    products = await getAllProducts()
  } catch (error) {
    console.error('Failed to fetch products:', error)
    // Continue with empty array - show empty state
  }

  return (
    <div className="min-h-screen">
      {/* Hero/Header Section with Background */}
      <section className="relative bg-primary text-cream py-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1600&q=80"
            alt="Olive oil products"
            fill
            className="object-cover"
            priority
          />
          {/* Green Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/95 to-primary/85"></div>
        </div>

        <div className="container relative z-10 text-center">
          <h1 className="text-h1 md:text-h1-lg mb-4 font-serif">Shop</h1>
          <p className="text-lg md:text-xl text-cream/90 max-w-2xl mx-auto">
            Entdecken Sie unsere Premium-Olivenöl-Kollektion aus den sonnenverwöhnten Hainen Griechenlands
          </p>
        </div>
      </section>

      {/* Main Shop Content */}
      <section className="bg-background py-12">
        <div className="container">
          {/* Product Count */}
          <div className="mb-8">
            <p className="text-body text-primary-dark">
              {products.length} {products.length === 1 ? 'Produkt' : 'Produkte'} angezeigt
            </p>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto bg-cream p-8 rounded-lg">
                <p className="text-h3 md:text-h3-lg text-primary mb-4">Keine Produkte gefunden</p>
                <p className="text-base md:text-body text-primary-dark/70">
                  Produkte werden hier angezeigt, sobald Sie Ihre WooCommerce-API-Anmeldedaten in <code className="bg-white px-2 py-1 rounded text-sm">.env.local</code> konfiguriert haben
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
