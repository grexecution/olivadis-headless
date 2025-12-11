'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Heart, ArrowDown, X } from 'lucide-react'
import type { Testimonial } from '@/lib/woocommerce/testimonials'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [showAll, setShowAll] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const initialCount = 9

  // Close lightbox on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  const displayedTestimonials = showAll ? testimonials : testimonials.slice(0, initialCount)
  const hasMore = testimonials.length > initialCount

  return (
    <section className="bg-cream py-20" aria-labelledby="testimonials-heading">
      <div className="container">
        {/* Section Heading */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-primary-light fill-primary-light" aria-hidden="true" />
            <h2 id="testimonials-heading" className="text-h2 md:text-h2-lg text-primary">
              Was unsere <span className="font-serif italic text-primary-light">Kunden</span> sagen
            </h2>
          </div>
          <p className="text-base md:text-body-lg text-primary-dark leading-relaxed">
            Echte Bewertungen und Erfahrungen von zufriedenen Olivadis-Liebhabern
          </p>
        </div>

        {/* Masonry Grid - Max 3 columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {displayedTestimonials.map((testimonial) => (
            <button
              key={testimonial.id}
              onClick={() => setSelectedImage(testimonial.featured_image_url || null)}
              className="group mb-6 break-inside-avoid inline-block w-full cursor-zoom-in"
            >
              <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border-2 border-primary/10 hover:border-primary/30">
                <div className="relative w-full">
                  <Image
                    src={testimonial.featured_image_url || ''}
                    alt="Kundenbewertung"
                    width={500}
                    height={700}
                    className="w-full h-auto object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 pointer-events-none" />
              </div>
            </button>
          ))}
        </div>

        {/* View More Button */}
        {hasMore && !showAll && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-3 bg-primary text-cream px-10 py-4 rounded-full text-button hover:bg-primary-light transition-all hover:scale-105 font-bold shadow-lg hover:shadow-xl"
            >
              Mehr Bewertungen anzeigen
              <ArrowDown className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        {showAll && (
          <div className="text-center mt-12">
            <p className="text-body text-primary-dark/70 italic">
              Möchten Sie auch Ihre Erfahrung teilen? Wir freuen uns auf Ihr Feedback! 🫒
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Schließen"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Kundenbewertung vergrößert"
              width={1200}
              height={1800}
              className="w-full h-auto object-contain rounded-lg"
              priority
            />
          </div>
        </div>
      )}
    </section>
  )
}
