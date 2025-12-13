'use client'

import { useState } from 'react'
import { Product } from '@/lib/woocommerce/products'
import TasteProfileChart from '@/components/product/taste-profile-chart'

interface ProductTabsProps {
  product: Product
}

export function ProductTabs({ product }: ProductTabsProps) {
  // Check if product is olive oil
  const isOliveOil = product.categories.some(cat => cat.slug === 'olivenoel' || cat.slug === 'olivenole')

  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'shipping' | 'taste'>('description')

  return (
    <div className="mt-12 bg-white rounded-lg shadow overflow-hidden">
      {/* Tab Navigation */}
      <div className="relative border-b border-primary-dark/10">
        {/* Scrollable tab container */}
        <div className="flex overflow-x-auto overflow-y-hidden scrollbar-hide md:overflow-x-visible snap-x snap-mandatory scroll-smooth">
          <button
            onClick={() => setActiveTab('description')}
            className={`flex-shrink-0 md:flex-1 px-4 sm:px-6 md:px-6 py-3 md:py-4 text-sm md:text-button font-bold transition-colors snap-start ${
              activeTab === 'description'
                ? 'bg-primary text-cream'
                : 'bg-cream/50 text-primary hover:bg-cream'
            }`}
          >
            <span className="hidden sm:inline">Beschreibung</span>
            <span className="sm:hidden">Info</span>
          </button>
          {isOliveOil && (
            <button
              onClick={() => setActiveTab('taste')}
              className={`flex-shrink-0 md:flex-1 px-4 sm:px-6 md:px-6 py-3 md:py-4 text-sm md:text-button font-bold transition-colors snap-start whitespace-nowrap ${
                activeTab === 'taste'
                  ? 'bg-primary text-cream'
                  : 'bg-cream/50 text-primary hover:bg-cream'
              }`}
            >
              <span className="hidden sm:inline">Geschmacksprofil</span>
              <span className="sm:hidden">🫒 Profil</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-shrink-0 md:flex-1 px-4 sm:px-6 md:px-6 py-3 md:py-4 text-sm md:text-button font-bold transition-colors snap-start ${
              activeTab === 'details'
                ? 'bg-primary text-cream'
                : 'bg-cream/50 text-primary hover:bg-cream'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`flex-shrink-0 md:flex-1 px-4 sm:px-6 md:px-6 py-3 md:py-4 text-sm md:text-button font-bold transition-colors snap-start ${
              activeTab === 'shipping'
                ? 'bg-primary text-cream'
                : 'bg-cream/50 text-primary hover:bg-cream'
            }`}
          >
            Versand
          </button>
        </div>

        {/* Scroll indicator gradient - mobile only */}
        <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden" />
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'description' && (
          <div>
            {product.description ? (
              <div
                className="prose prose-sm max-w-none text-body text-primary-dark"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <p className="text-body text-primary-dark/70">
                Keine Beschreibung verfügbar.
              </p>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Product Details from ACF */}
            {product.acf?.product_detail_description && (
              <div>
                <h3 className="text-h4 text-primary mb-3 font-serif">Produktdetails</h3>
                <div
                  className="prose prose-sm max-w-none text-body text-primary-dark"
                  dangerouslySetInnerHTML={{ __html: product.acf.product_detail_description }}
                />
              </div>
            )}

            {/* Additional Information */}
            {product.acf?.additional_information && (
              <div>
                <h3 className="text-h4 text-primary mb-3 font-serif">Zusätzliche Informationen</h3>
                <div
                  className="prose prose-sm max-w-none text-body text-primary-dark"
                  dangerouslySetInnerHTML={{ __html: product.acf.additional_information }}
                />
              </div>
            )}

            {/* Scope of Delivery */}
            {product.acf?.scope_of_delivery && (
              <div>
                <h3 className="text-h4 text-primary mb-3 font-serif">Lieferumfang</h3>
                <div
                  className="prose prose-sm max-w-none text-body text-primary-dark"
                  dangerouslySetInnerHTML={{ __html: product.acf.scope_of_delivery }}
                />
              </div>
            )}

            {/* Weight and Dimensions */}
            {(product.weight || product.sku || product.categories.length > 0) && (
              <div>
                <h3 className="text-h4 text-primary mb-3 font-serif">Spezifikationen</h3>
                <div className="space-y-2">
                  {product.sku && (
                    <div className="flex gap-3">
                      <span className="text-body font-semibold text-primary-dark">Art.-Nr.:</span>
                      <span className="text-body text-primary-dark/70">{product.sku}</span>
                    </div>
                  )}
                  {product.categories.length > 0 && (
                    <div className="flex gap-3">
                      <span className="text-body font-semibold text-primary-dark">Kategorien:</span>
                      <span className="text-body text-primary-dark/70">
                        {product.categories.map((cat) => cat.name).join(', ')}
                      </span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex gap-3">
                      <span className="text-body font-semibold text-primary-dark">Gewicht:</span>
                      <span className="text-body text-primary-dark/70">{product.weight}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Default message if no details */}
            {!product.acf?.product_detail_description &&
             !product.acf?.additional_information &&
             !product.acf?.scope_of_delivery &&
             !product.weight &&
             !product.sku &&
             product.categories.length === 0 && (
              <p className="text-body text-primary-dark/70">
                Keine zusätzlichen Details verfügbar.
              </p>
            )}
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-6">
            {/* Shipping Info from ACF or default */}
            {product.acf?.shipping_information ? (
              <div
                className="prose prose-sm max-w-none text-body text-primary-dark"
                dangerouslySetInnerHTML={{ __html: product.acf.shipping_information }}
              />
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-h4 text-primary mb-3 font-serif">Versand nach Deutschland</h3>
                  <p className="text-body text-primary-dark/70">
                    Wir versenden Ihre Bestellung innerhalb von 2-3 Werktagen.
                    Die Lieferzeit beträgt in der Regel 3-5 Werktage nach Versand.
                  </p>
                </div>

                <div>
                  <h3 className="text-h4 text-primary mb-3 font-serif">Versand nach Österreich</h3>
                  <p className="text-body text-primary-dark/70">
                    Der Versand nach Österreich erfolgt innerhalb von 2-3 Werktagen.
                    Die Lieferzeit beträgt in der Regel 4-6 Werktage nach Versand.
                  </p>
                </div>

                <div>
                  <h3 className="text-h4 text-primary mb-3 font-serif">Verpackung</h3>
                  <p className="text-body text-primary-dark/70">
                    Alle unsere Produkte werden sorgfältig verpackt, um eine sichere Lieferung zu gewährleisten.
                    Wir verwenden umweltfreundliche Verpackungsmaterialien, wann immer möglich.
                  </p>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <p className="text-body-sm text-primary-dark/70">
                    <strong className="text-primary">Kostenloser Versand</strong> ab einem Bestellwert von 79€
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'taste' && isOliveOil && (
          <div>

            <TasteProfileChart />
          </div>
        )}
      </div>
    </div>
  )
}
