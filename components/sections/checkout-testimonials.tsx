'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Heart, X } from 'lucide-react'

interface Testimonial {
  id: number
  featured_image_url?: string
}

export default function CheckoutTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch('https://olivadis.com/wp-json/wp/v2/wall_of_love?per_page=6&_embed')
        if (response.ok) {
          const posts = await response.json()
          const data = posts
            .filter((post: any) => post.featured_media > 0)
            .map((post: any) => ({
              id: post.id,
              featured_image_url: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || ''
            }))
            .filter((t: Testimonial) => t.featured_image_url)
            .slice(0, 6)

          setTestimonials(data)
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  // Close lightbox on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  if (loading || testimonials.length === 0) {
    return null
  }

  return (
    <div className="mt-6">
      <div className="bg-cream/50 rounded-lg p-6 border border-primary/10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-primary-light fill-primary-light" aria-hidden="true" />
          <h3 className="text-lg font-bold text-primary">
            Kundenbewertungen
          </h3>
        </div>

        {/* Single column list of testimonials */}
        <div className="space-y-3">
          {testimonials.map((testimonial) => (
            <button
              key={testimonial.id}
              onClick={() => setSelectedImage(testimonial.featured_image_url || null)}
              className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 bg-white border border-primary/10 w-full cursor-zoom-in"
            >
              <div className="relative w-full">
                <Image
                  src={testimonial.featured_image_url || ''}
                  alt="Kundenbewertung"
                  width={400}
                  height={600}
                  className="w-full h-auto object-contain"
                  sizes="400px"
                />
              </div>
              {/* Subtle overlay on hover */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 pointer-events-none" />
            </button>
          ))}
        </div>

        {/* Footer text */}
        <p className="text-xs text-primary-dark/60 text-center mt-4 italic">
          Vertrauen Sie auf über 1.000+ zufriedene Kunden
        </p>
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
    </div>
  )
}
