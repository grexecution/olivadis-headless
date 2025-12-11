import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getProduct, getAllProducts, getProductVariations, getStockStatus } from '@/lib/woocommerce/products'
import { AddToCartButton } from '@/components/product/add-to-cart'
import FamilyOriginSection from '@/components/sections/family-origin-section'

export async function generateStaticParams() {
  const products = await getAllProducts()

  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let product

  try {
    product = await getProduct(slug)
  } catch (error) {
    notFound()
  }

  if (!product) {
    notFound()
  }

  // Get variations if it's a variable product
  const variations = product.type === 'variable' && product.variations
    ? await getProductVariations(product.id)
    : []

  const stockInfo = getStockStatus(product)
  const price = parseFloat(product.price)
  const regularPrice = parseFloat(product.regular_price)
  const isOnSale = product.on_sale && regularPrice > price

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-body-sm text-primary-dark/70">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Startseite
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/shop" className="hover:text-primary transition-colors">
                Shop
              </Link>
            </li>
            <li>/</li>
            <li className="text-primary-dark">{product.name}</li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-lg p-8 shadow">
          {/* Product Images */}
          <div>
            <div className="aspect-square overflow-hidden rounded-lg bg-cream mb-4 relative">
              {product.images[0]?.src ? (
                <Image
                  src={product.images[0].src}
                  alt={product.images[0].alt || product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-primary/30 text-h3">No Image</span>
                </div>
              )}

              {/* Sale Badge */}
              {isOnSale && (
                <div className="absolute top-4 right-4 bg-primary text-cream px-4 py-2 rounded-md text-body-sm font-bold">
                  Angebot
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1, 5).map((image) => (
                  <div
                    key={image.id}
                    className="aspect-square overflow-hidden rounded-md bg-cream cursor-pointer hover:opacity-75 transition-opacity relative"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt || product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 12vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-h2 text-primary mb-4">{product.name}</h1>

            {/* Price */}
            <div className="mb-6">
              {isOnSale ? (
                <div className="flex items-baseline gap-4">
                  <span className="text-price text-primary font-bold">
                    €{price.toFixed(2)}
                  </span>
                  <span className="text-body-lg text-primary-dark/40 line-through">
                    €{regularPrice.toFixed(2)}
                  </span>
                  <span className="bg-primary text-cream px-3 py-1 rounded-md text-body-sm font-bold">
                    Sparen Sie €{(regularPrice - price).toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-price text-primary font-bold">
                  €{price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <div
                className="text-body text-primary-dark mb-6 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            {/* Stock Status */}
            <div className="mb-6">
              <span
                className={`inline-block px-4 py-2 rounded-md text-body-sm font-bold ${
                  stockInfo.inStock
                    ? 'bg-primary/10 text-primary'
                    : 'bg-primary-dark/10 text-primary-dark'
                }`}
              >
                {stockInfo.stockText}
              </span>
            </div>

            {/* Variations Info */}
            {variations.length > 0 && (
              <div className="mb-6 p-4 bg-cream rounded-md">
                <p className="text-body-sm text-primary-dark mb-2 font-bold">
                  Verfügbare Optionen:
                </p>
                <p className="text-body-sm text-primary-dark/70">
                  Dieses Produkt hat {variations.length} Variation{variations.length > 1 ? 'en' : ''}
                </p>
              </div>
            )}

            {/* Add to Cart */}
            <div className="mb-8">
              <AddToCartButton product={product} />
            </div>

            {/* Product Meta */}
            <div className="border-t border-primary-dark/10 pt-6 space-y-3">
              {product.sku && (
                <div className="flex gap-3">
                  <span className="text-body font-bold text-primary-dark">Art.-Nr.:</span>
                  <span className="text-body text-primary-dark/70">{product.sku}</span>
                </div>
              )}
              {product.categories.length > 0 && (
                <div className="flex gap-3">
                  <span className="text-body font-bold text-primary-dark">Kategorien:</span>
                  <span className="text-body text-primary-dark/70">
                    {product.categories.map((cat) => cat.name).join(', ')}
                  </span>
                </div>
              )}
              {product.weight && (
                <div className="flex gap-3">
                  <span className="text-body font-bold text-primary-dark">Gewicht:</span>
                  <span className="text-body text-primary-dark/70">{product.weight}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="mt-12 bg-white rounded-lg p-8 shadow">
            <h2 className="text-h3 text-primary mb-6 pb-4 border-b border-primary-dark/10">
              Produktbeschreibung
            </h2>
            <div
              className="prose prose-sm max-w-none text-body text-primary-dark"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        )}

        {/* Additional Information from ACF fields */}
        {product.acf && (
          <div className="mt-12 bg-white rounded-lg p-8 shadow">
            <h2 className="text-h3 text-primary mb-6 pb-4 border-b border-primary-dark/10">
              Zusätzliche Informationen
            </h2>
            <div className="space-y-6">
              {product.acf.product_detail_description && (
                <div>
                  <h3 className="text-h4 text-primary mb-3">Produktdetails</h3>
                  <div
                    className="prose prose-sm max-w-none text-body text-primary-dark"
                    dangerouslySetInnerHTML={{ __html: product.acf.product_detail_description }}
                  />
                </div>
              )}
              {product.acf.scope_of_delivery && (
                <div>
                  <h3 className="text-h4 text-primary mb-3">Lieferumfang</h3>
                  <div
                    className="prose prose-sm max-w-none text-body text-primary-dark"
                    dangerouslySetInnerHTML={{ __html: product.acf.scope_of_delivery }}
                  />
                </div>
              )}
              {product.acf.shipping_information && (
                <div>
                  <h3 className="text-h4 text-primary mb-3">Versandinformationen</h3>
                  <div
                    className="prose prose-sm max-w-none text-body text-primary-dark"
                    dangerouslySetInnerHTML={{ __html: product.acf.shipping_information }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Family & Origin Section */}
      <FamilyOriginSection />

      <div className="container">
        {/* Back to Shop Link */}
        <div className="mt-12 pb-12 text-center">
          <Link
            href="/shop"
            className="inline-block text-primary text-body-lg font-bold hover:text-primary-light transition-colors"
          >
            ← Zurück zum Shop
          </Link>
        </div>
      </div>
    </div>
  )
}
