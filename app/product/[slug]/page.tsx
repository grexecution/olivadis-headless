import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getProduct, getAllProducts, getProductVariations, getStockStatus } from '@/lib/woocommerce/products'
import { AddToCartButton } from '@/components/product/add-to-cart'
import { VariationSelector } from '@/components/product/variation-selector'
import FamilyOriginHeroSection from '@/components/sections/family-origin-hero-section'
import TestimonialsSection from '@/components/sections/testimonials-section'
import { getTestimonials, Testimonial } from '@/lib/woocommerce/testimonials'
import { ProductTabs } from '@/components/product/product-tabs'
import { PaymentIcons } from '@/components/ui/payment-icons'
import { decodeHtmlEntities } from '@/lib/utils/html'
import { formatEUR } from '@/lib/utils/currency'

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
  let testimonials: Testimonial[] = []

  try {
    product = await getProduct(slug)
    testimonials = await getTestimonials()
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

  // Get unique additional images (excluding the main/featured image)
  // Filter out duplicates and images without src
  const mainImageSrc = product.images[0]?.src
  const additionalImages = product.images
    .slice(1)
    .filter((img, index, arr) => {
      // Filter out images without src
      if (!img.src) return false
      // Filter out duplicates (including main image)
      if (img.src === mainImageSrc) return false
      // Filter out duplicate additional images
      return arr.findIndex(i => i.src === img.src) === index
    })

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
            <li className="text-primary-dark">{decodeHtmlEntities(product.name)}</li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-lg p-4 md:p-8 shadow">
          {/* Product Images */}
          <div>
            <div className="aspect-square overflow-hidden rounded-lg bg-cream mb-4 relative">
              {product.images[0]?.src ? (
                <Image
                  src={product.images[0].src}
                  alt={decodeHtmlEntities(product.images[0].alt || product.name)}
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

              {/* Origin Badge - Top Left */}
              <div className="absolute top-4 left-4">
                <div className="inline-flex items-center gap-2 bg-primary/90 text-cream px-3 py-1.5 rounded-full shadow-lg">
                  <span className="text-sm font-semibold">🇬🇷 Aus Griechenland</span>
                </div>
              </div>

              {/* Sale Badge */}
              {isOnSale && (
                <div className="absolute top-4 right-4 bg-primary text-cream px-4 py-2 rounded-md text-body-sm font-bold">
                  Angebot
                </div>
              )}
            </div>

            {/* Thumbnail Gallery - Only show if there are additional images beyond the main one */}
            {additionalImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {additionalImages.slice(0, 4).map((image) => (
                  <div
                    key={image.id}
                    className="aspect-square overflow-hidden rounded-md bg-cream cursor-pointer hover:opacity-75 transition-opacity relative"
                  >
                    <Image
                      src={image.src}
                      alt={decodeHtmlEntities(image.alt || product.name)}
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
            {/* 5 Star Rating & Stock Status */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <div className="flex gap-0.5" aria-label="5 von 5 Sternen">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-primary"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-primary-dark/70">({product.rating_count || 119} Bewertungen)</span>
              </div>

              {/* Stock Status */}
              <span
                className={`inline-block px-4 py-2 rounded-md text-body-sm font-bold whitespace-nowrap ${
                  stockInfo.inStock
                    ? 'bg-primary/10 text-primary'
                    : 'bg-primary-dark/10 text-primary-dark'
                }`}
              >
                {stockInfo.stockText}
              </span>
            </div>

            <h1 className="text-h3 md:text-h3-lg text-primary mb-4 font-serif">
              {decodeHtmlEntities(product.name)}
            </h1>

            {/* Short Description */}
            {product.short_description && (
              <div
                className="text-base text-primary-dark/90 mb-6 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            {/* Feature List */}
            <div className="mb-6 p-4 bg-cream/50 rounded-lg border border-primary/10">
              <h3 className="text-base font-bold text-primary mb-3">Produktmerkmale:</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-primary-dark">
                  <svg className="w-5 h-5 text-primary-light flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>100% Bio-zertifiziert aus Familienanbau</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-primary-dark">
                  <svg className="w-5 h-5 text-primary-light flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Kaltgepresst für höchste Qualität</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-primary-dark">
                  <svg className="w-5 h-5 text-primary-light flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Direkt aus Griechenland importiert</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-primary-dark">
                  <svg className="w-5 h-5 text-primary-light flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Sorgfältig verpackt für sicheren Versand</span>
                </li>
              </ul>
            </div>

            {/* Recipe Unlock Badge */}
            <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div>
                  <h3 className="text-base font-bold text-primary mb-1">Exklusive Rezepte enthalten!</h3>
                  <p className="text-sm text-primary-dark/70">
                    Mit diesem Kauf erhalten Sie Zugang zu exklusiven griechischen Rezepten in unserem Rezeptbereich.
                  </p>
                </div>
              </div>
            </div>

            {/* Variations Selector - If product has variations */}
            {variations.length > 0 ? (
              <VariationSelector variations={variations} product={product} />
            ) : (
              /* Price & Add to Cart - For simple products only */
              <div className="space-y-4 mb-3">
                {/* Price */}
                <div>
                  {isOnSale ? (
                    <div className="flex items-center gap-2 md:gap-4">
                      <div className="flex flex-col gap:0 md:gap-1">
                        <span className="text-price text-primary font-bold">
                          {formatEUR(price)}
                        </span>
                        <span className="text-body-lg text-primary-dark/40 line-through">
                          {formatEUR(regularPrice)}
                        </span>
                      </div>
                      <span className="bg-primary text-cream px-3 py-1 rounded-md text-sm font-bold whitespace-nowrap">
                        -{Math.round(((regularPrice - price) / regularPrice) * 100)}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-price text-primary font-bold">
                      {formatEUR(price)}
                    </span>
                  )}
                </div>

                {/* Add to Cart */}
                <AddToCartButton product={product} />
              </div>
            )}

            {/* Payment Methods */}
            <div className="flex flex-col gap-2 items-center">
              <PaymentIcons />
            </div>
          </div>
        </div>

        {/* Product Tabs - Always Show */}
        <ProductTabs product={product} />

      </div>

      {/* Map Section with Family & Origin */}
      <FamilyOriginHeroSection />

      {/* Testimonials Section */}
      <TestimonialsSection testimonials={testimonials} />
    </div>
  )
}
