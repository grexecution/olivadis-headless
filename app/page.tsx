import Link from 'next/link'
import Image from 'next/image'
import { Check, X, ShoppingCart, ArrowRight } from 'lucide-react'
import { getCategories, ProductCategory, getProduct } from '@/lib/woocommerce/products'
import { getTestimonials, Testimonial } from '@/lib/woocommerce/testimonials'
import { ScrollIndicator } from '@/components/ui/scroll-indicator'
import FamilyOriginSection from '@/components/sections/family-origin-section'
import FamilyOriginHeroSection from '@/components/sections/family-origin-hero-section'
import TestimonialsSection from '@/components/sections/testimonials-section'
import CTASection from '@/components/sections/cta-section'
import { decodeHtmlEntities } from '@/lib/utils/html'
import { formatEUR } from '@/lib/utils/currency'

export default async function Home() {
  let categories: ProductCategory[] = []
  let testimonials: Testimonial[] = []
  let featuredProduct = null

  try {
    categories = await getCategories()
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    // Continue with empty array - show empty state
  }

  try {
    testimonials = await getTestimonials()
  } catch (error) {
    console.error('Failed to fetch testimonials:', error)
    // Continue with empty array
  }

  try {
    // Fetch the specific "olivenoel" product for the hero featured box
    featuredProduct = await getProduct('olivenoel')
  } catch (error) {
    console.error('Failed to fetch featured product:', error)
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section - Compact Product Hero */}
      <section className="relative min-h-[75vh] md:min-h-[80vh] flex items-center overflow-hidden border-t-4 border-primary/20">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/banner-desktop-lo.mp4" type="video/mp4" />
          </video>
          {/* Lighter Green Overlay to See Video Better */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/75 via-primary/70 to-primary/75" />
        </div>

        <div className="container relative z-10 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr,0.6fr] gap-8 lg:gap-10 items-center max-w-6xl mx-auto">
            {/* Left Column - Hero Content */}
            <div className="text-cream">
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
                <div className="inline-flex items-center gap-1.5 md:gap-2 bg-cream/20 backdrop-blur-sm text-cream px-3 md:px-4 py-1.5 md:py-2 rounded-full">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs md:text-sm font-semibold">100% Bio & Familiengeführt</span>
                </div>

                <div className="inline-flex items-center gap-1.5 md:gap-2 bg-cream/20 backdrop-blur-sm text-cream px-3 md:px-4 py-1.5 md:py-2 rounded-full">
                  <span className="text-xs md:text-sm font-semibold">🇬🇷 Aus Griechenland</span>
                </div>

                <div className="inline-flex items-center gap-1.5 md:gap-2 bg-cream/20 backdrop-blur-sm text-cream px-3 md:px-4 py-1.5 md:py-2 rounded-full">
                  <span className="text-xs md:text-sm font-semibold">⭐⭐⭐⭐⭐ Bewertungen</span>
                </div>
              </div>

              <h1 className="text-h2 md:text-[60px] md:leading-[66px] md:tracking-[-2.24px] font-bold mb-6 leading-tight font-serif">
                Willkommen beim<br/>
                <span className="italic" style={{ color: '#5DA81A' }}>Olivadis Familienbetrieb</span>
              </h1>

              <p className="text-base md:text-body-lg text-cream/90 mb-8 leading-relaxed">
                Erleben Sie das feinste Bio-Olivenöl, mit Leidenschaft und Tradition aus unseren Familienhainen in Griechenland hergestellt.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-cream text-primary px-8 py-4 rounded-full text-button font-bold hover:bg-cream/90 transition-all hover:scale-105 shadow-lg"
                >
                  Jetzt einkaufen
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
                <Link
                  href="/ueber-uns"
                  className="inline-flex items-center gap-2 bg-cream/10 backdrop-blur-sm text-cream px-8 py-4 rounded-full text-button font-bold hover:bg-cream/20 transition-all border-2 border-cream/30"
                >
                  Unsere Geschichte
                </Link>
              </div>

              {/* Quick Features */}
              <div className="flex flex-wrap gap-4 text-sm text-cream/80">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-cream flex-shrink-0" />
                  <span>Kostenloser Versand ab 50€</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-cream flex-shrink-0" />
                  <span>Frische Ernte {new Date().getFullYear()}</span>
                </div>
              </div>
            </div>

            {/* Right Column - Compact Product Card */}
            <div>
              {featuredProduct ? (
                <div className="relative">
                  {/* Product Card - Compact Version */}
                  <div className="relative bg-gradient-to-br from-white to-cream/15 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-primary/10 hover:shadow-2xl transition-all duration-300">
                    {/* Small Bestseller Badge */}
                    {featuredProduct.featured && (
                      <div className="absolute -top-3 -right-3 z-10">
                        <div className="bg-primary text-cream px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                          Bestseller
                        </div>
                      </div>
                    )}

                    {/* Compact Product Image */}
                    <div className="relative h-54 mb-4 flex items-center justify-center bg-gradient-to-br from-cream/30 to-transparent rounded-xl">
                      {featuredProduct.images[0]?.src ? (
                        <Image
                          src={featuredProduct.images[0].src}
                          alt={decodeHtmlEntities(featuredProduct.name)}
                          width={180}
                          height={240}
                          className="object-contain drop-shadow-xl"
                          priority
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/30">
                          <ShoppingCart className="w-16 h-16" />
                        </div>
                      )}
                    </div>

                    {/* Product Info - Compact */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-primary mb-1 line-clamp-2">
                          {decodeHtmlEntities(featuredProduct.name)}
                        </h3>

                      </div>

                      {/* Single CTA */}
                      <Link
                        href={`/product/${featuredProduct.slug}`}
                        className="w-full inline-flex items-center justify-center gap-2 bg-primary text-cream px-6 py-3 rounded-full text-sm font-bold hover:bg-primary-light transition-all hover:scale-105 shadow-md"
                      >
                        <ShoppingCart className="w-4 h-4" aria-hidden="true" />
                        Jetzt kaufen
                      </Link>

                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/50 rounded-2xl p-8 text-center">
                  <p className="text-primary-dark/60 text-sm">Produkt wird geladen...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="bg-cream py-20" aria-labelledby="categories">
        <div className="container">
          <div className="text-center mb-16">
            <h2 id="categories" className="text-h2 md:text-h2-lg text-primary mb-4 font-serif">
              Unsere <span className="italic text-primary-light">Produktkategorien</span>
            </h2>
            <p className="text-base md:text-body-lg text-primary-dark max-w-2xl mx-auto">
              Entdecken Sie unsere vielfältige Auswahl an griechischen Bio-Produkten
            </p>
          </div>

          {categories.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto mb-12">
              {categories
                .filter(cat => cat.slug !== 'uncategorized')
                .map((category) => (
                  <Link
                    key={category.id}
                    href={`/shop?category=${category.slug}`}
                    className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Category Image */}
                    <div className="aspect-[4/3] relative bg-primary/5">
                      {category.image?.src ? (
                        <Image
                          src={category.image.src}
                          alt={decodeHtmlEntities(category.name)}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                          <span className="text-6xl opacity-20">🫒</span>
                        </div>
                      )}

                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                      {/* Category Content */}
                      <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                        <h3 className="text-h3 md:text-h3-lg font-serif text-white mb-2">
                          {decodeHtmlEntities(category.name)}
                        </h3>

                        {category.description && (
                          <p className="text-sm text-white/90 mb-3 line-clamp-2">
                            {decodeHtmlEntities(category.description)}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-white/80 text-sm font-medium">
                            {category.count} {category.count === 1 ? 'Produkt' : 'Produkte'}
                          </span>

                          <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
                            <span className="text-sm">Entdecken</span>
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          ) : (
            <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-md border border-primary/10 mb-12">
              <p className="text-base md:text-body text-primary-dark/70 text-center">
                Kategorien werden hier angezeigt, sobald Sie Ihre WooCommerce-API-Anmeldedaten in <code className="bg-cream px-2 py-1 rounded text-sm">.env.local</code> konfiguriert haben
              </p>
            </div>
          )}

          <div className="text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-primary !text-white px-8 py-4 rounded-full text-button font-bold hover:bg-primary-light transition-all hover:scale-105 shadow-lg"
            >
              Alle Produkte ansehen
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Family & Origin Hero Section - New Design */}
      <FamilyOriginHeroSection />

      {/* Product Delivery Section with Video */}
      <section className="bg-cream/80 py-20" aria-labelledby="product-delivery">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6">
              <h2 id="product-delivery" className="text-h2 md:text-h2-lg text-primary">
                So sieht unser <span className="font-serif italic text-primary-light">Olivenöl</span> aus, wenn es bei Ihnen ankommt
              </h2>
              <p className="text-base md:text-body-lg text-primary-dark">
                Unser Olivenöl kommt in einer hochwertigen Glasflasche zu Ihnen nach Hause, die so dekorativ ist, dass selbst Ihre Gäste staunen werden.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-primary text-cream px-8 py-4 rounded-lg text-button font-bold hover:bg-primary/90 transition-all hover:scale-105"
              >
                Jetzt kaufen
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl shadow-2xl overflow-hidden bg-background">
              <iframe
                src="https://player.vimeo.com/video/908381235?h=d9e1443ba8&autoplay=1&loop=1&muted=1&background=1&autopause=0"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                title="Olivadis Olivenöl Unboxing"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Olivadis vs Conventional Comparison Section */}
      <section className="bg-[#faf1e5] py-20" aria-labelledby="comparison">
        <div className="container max-w-6xl">
          <h2 id="comparison" className="sr-only">Vergleich: Olivadis vs Herkömmliches Olivenöl</h2>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0 mb-8">
            {/* VS Badge - Positioned Absolutely in Middle */}
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="bg-[#faf1e5] border-8 border-[#dbcfac] rounded-full w-28 h-28 flex items-center justify-center shadow-2xl">
                <span className="text-4xl font-serif font-bold italic text-primary-light">Vs</span>
              </div>
            </div>
            {/* Olivadis Column */}
            <div className="bg-[rgba(60,224,77,0.05)] rounded-tl-2xl rounded-bl-2xl lg:rounded-tr-none lg:rounded-br-none rounded-tr-2xl rounded-br-2xl lg:rounded-bl-2xl p-8 lg:p-12">
              <h3 className="text-h3 md:text-h3-lg text-center mb-6">
                <span className="font-serif italic text-primary-light">Olivadis</span> natives Olivenöl extra
              </h3>
              <div className="relative h-54 lg:h-80 mb-8 flex items-center justify-center">
                <Image
                  src="/olivadis-single.png"
                  alt="Olivadis Premium Olivenölflasche"
                  width={200}
                  height={400}
                  className="object-contain"
                />
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 lg:p-8 space-y-4">
                {[
                  'Sie wissen, woher es kommt: Olivadis wird ausschließlich aus den besten unserer Oliven in Pteleos hergestellt.',
                  'Olivadis ist immer frisch und hat eine längere Haltbarkeit - wir verkaufen nur die aktuelle Ernte.',
                  'Das Geschmacksprofil von Olivadis ist mild und doch voll und rundet den Geschmack Ihrer Zutaten harmonisch ab.',
                  'Unser Olivenöl kommt in einer hochwertigen Glasflasche zu Ihnen nach Hause.',
                  'Kinder lieben Olivadis auch - endlich ist Olivenöl nicht nur scharf und bitter.',
                  'Olivadis ist perfekt als Geschenk: ob zu Weihnachten, Nikolaus oder einfach als Mitbringsel.'
                ].map((text, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded bg-[#ecfdee] border-2 border-primary-light flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-primary" aria-hidden="true" />
                    </div>
                    <p className="text-sm text-primary-dark leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conventional Column */}
            <div className="bg-background rounded-tr-2xl rounded-br-2xl lg:rounded-tl-none lg:rounded-bl-none rounded-tl-2xl rounded-bl-2xl lg:rounded-tr-2xl p-8 lg:p-12 mt-8 lg:mt-0">
              <h3 className="text-h3 md:text-h3-lg text-center mb-6">
                <span className="font-serif italic text-red-700">Herkömmliches</span> Supermarkt-Olivenöl
              </h3>
              <div className="relative h-54 lg:h-80 mb-8 flex items-center justify-center">
                <Image
                  src="/conventional-oil.png"
                  alt="Herkömmliche Supermarkt Olivenölflasche"
                  width={200}
                  height={400}
                  className="object-contain"
                />
              </div>
              <div className="bg-[rgba(250,241,229,0.5)] border-2 border-gray-200 rounded-2xl p-6 lg:p-8 space-y-4">
                {[
                  'Oliven werden von Großhändlern aus verschiedenen Regionen gekauft und gemischt.',
                  'Oft ist das Öl im Supermarkt bereits 1-2 Jahre alt.',
                  'Supermarkt-Olivenöl ist oft sehr dominant im Geschmack.',
                  'Teure Supermarktöle sind oft so intensiv, dass sie nur für kalte Gerichte verwendet werden.',
                  'Supermarkt-Olivenöle verschwinden meist im Küchenschrank.',
                  'Olivenöl schmeckt oft bitter und scharf. Das kommt bei wenigen Kindern gut an.'
                ].map((text, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded bg-[#fff4f4] border-2 border-red-700 flex items-center justify-center mt-0.5">
                      <X className="w-4 h-4 text-red-700" aria-hidden="true" />
                    </div>
                    <p className="text-sm text-primary-dark leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-primary text-cream px-8 py-4 rounded-lg text-button font-bold hover:bg-primary/90 transition-all hover:scale-105"
            >
              Jetzt kaufen
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials / Wall of Love */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Final CTA Section */}
      <CTASection
        heading="Bereit für echtes griechisches Bio-Olivenöl?"
        subheading="Entdecken Sie den Unterschied, den authentisches Olivenöl aus Griechenland macht."
        buttonText="Jetzt entdecken"
        variant="primary"
      />
    </main>
  )
}
