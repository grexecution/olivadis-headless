import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface CTASectionProps {
  heading?: string
  subheading?: string
  buttonText?: string
  buttonHref?: string
  variant?: 'primary' | 'cream'
}

export default function CTASection({
  heading = 'Entdecken Sie griechisches Bio-Olivenöl',
  subheading = 'Direkt vom Erzeuger zu Ihnen nach Hause',
  buttonText = 'Zum Shop',
  buttonHref = '/shop',
  variant = 'primary'
}: CTASectionProps) {
  const isPrimary = variant === 'primary'

  return (
    <section
      className={`py-12 md:py-20 ${isPrimary ? 'bg-primary' : 'bg-cream'}`}
      aria-labelledby="cta-heading"
    >
      <div className="container">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Heading */}
          <h2
            id="cta-heading"
            className={`text-h2 md:text-h2-lg font-serif ${
              isPrimary ? 'text-white' : 'text-primary'
            }`}
          >
            {heading}
          </h2>

          {/* Subheading */}
          <p
            className={`text-base md:text-body-lg ${
              isPrimary ? 'text-white/90' : 'text-primary-dark'
            }`}
          >
            {subheading}
          </p>

          {/* CTA Button */}
          <div>
            <Link
              href={buttonHref}
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-button font-bold transition-all hover:scale-105 shadow-lg ${
                isPrimary
                  ? 'bg-white text-primary hover:bg-cream'
                  : 'bg-primary !text-white hover:bg-primary-light'
              }`}
            >
              {buttonText}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
