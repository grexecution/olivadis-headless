'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { MapPin, Users } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-cream/30">
      <div className="text-center">
        <MapPin className="w-8 h-8 text-primary mx-auto mb-2 animate-pulse" />
        <p className="text-sm text-primary-dark">Karte wird geladen...</p>
      </div>
    </div>
  ),
})

interface FamilyMember {
  name: string
  role: string
  image: string
  description: string
}

const familyMembers: FamilyMember[] = [
  {
    name: 'Nicki',
    role: 'Geschäftsführerin',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    description: 'Führt das Familienunternehmen mit Leidenschaft und Innovation',
  },
  {
    name: 'Papa',
    role: 'Gründer & Olivenbauer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    description: 'Der Visionär hinter Olivadis - seit den 1970ern',
  },
  {
    name: 'Familie',
    role: 'Die nächste Generation',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&auto=format&fit=crop&q=80',
    description: 'Gemeinsam für authentisches Bio-Olivenöl',
  },
]

export default function FamilyOriginSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="bg-background py-20" aria-labelledby="family-origin">
      <div className="container">
        {/* Main Section Heading */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 id="family-origin" className="text-h2 md:text-h2-lg text-primary mb-4">
            Familie & <span className="font-serif italic text-primary-light">Herkunft</span>
          </h2>
          <p className="text-base md:text-body-lg text-primary-dark leading-relaxed">
            Seit Generationen widmen wir uns mit Herz und Seele dem Anbau der besten Oliven in Pteleos, Griechenland.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Family Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <p className="text-xl font-bold text-primary">
                Die Olivadis Familie
              </p>
            </div>

            {/* Family Members */}
            <div className="space-y-4">
              {familyMembers.map((member, index) => (
                <div
                  key={index}
                  className="group flex gap-4 items-center bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-primary/10 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-primary mb-0.5">{member.name}</h3>
                    <p className="text-xs text-primary-light font-semibold mb-1">{member.role}</p>
                    <p className="text-sm text-primary-dark leading-relaxed">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map Section */}
          <div className="space-y-6">
            {/* Map Container */}
            <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-xl border-4 border-primary/20">
              {mounted && <MapComponent />}
            </div>

            {/* Elegant bottom text */}
            <div className="text-center">
              <p className="text-body text-primary-dark/70 leading-relaxed italic">
                Seit 1970 kultivieren wir <span className="font-semibold text-primary">100% Bio</span> Oliven unter der griechischen Sonne
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
