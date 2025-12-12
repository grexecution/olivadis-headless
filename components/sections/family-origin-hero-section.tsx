'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <MapPin className="w-8 h-8 text-white/50 animate-pulse" />
    </div>
  ),
})

interface FamilyMember {
  name: string
  role: string
  image: string
}

const familyMembers: FamilyMember[] = [
  {
    name: 'Miltiadis',
    role: 'Gründer & Vater',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Niki',
    role: 'Tochter & Geschäftsführerin',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Cris',
    role: 'Sohn',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  },
]

export default function FamilyOriginHeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden" aria-labelledby="family-origin-hero">
      {/* Full-screen Map Background */}
      <div className="absolute inset-0 z-0">
        {mounted && <MapComponent />}
        {/* Very light gradient overlay to show maximum map detail */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/10 to-primary/30" />
      </div>

      {/* Content Container */}
      <div className="container relative z-10 h-full flex flex-col justify-between py-12 md:py-16">
        {/* Top Content - Just space for alignment */}
        <div></div>

        {/* Bottom Content - Horizontal Family Tags */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {/* Miltiadis - First and slightly larger */}
          <div className="group flex items-center gap-1.5 md:gap-3 bg-primary/95 backdrop-blur-md px-2.5 py-1.5 md:px-5 md:py-3 rounded-full border md:border-2 border-cream/60 shadow-xl md:shadow-2xl hover:border-cream hover:scale-105 transition-all duration-300">
            <div className="relative w-8 h-8 md:w-14 md:h-14 rounded-full overflow-hidden ring-1 md:ring-3 ring-cream/70 group-hover:ring-cream flex-shrink-0 transition-all">
              <Image
                src={familyMembers[0].image}
                alt={familyMembers[0].name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-left pr-1 md:pr-2">
              <h3 className="text-xs md:text-base font-bold text-white font-serif leading-tight">
                {familyMembers[0].name}
              </h3>
              <p className="text-[10px] md:text-xs text-cream/90">
                {familyMembers[0].role}
              </p>
            </div>
          </div>

          {/* Niki and Cris - Same size */}
          {familyMembers.slice(1).map((member, index) => (
            <div
              key={index}
              className="group flex items-center gap-1.5 md:gap-2 bg-primary/90 backdrop-blur-md px-2 py-1.5 md:px-4 md:py-3 rounded-full border border-cream/40 shadow-lg md:shadow-xl hover:border-cream hover:scale-105 transition-all duration-300"
            >
              <div className="relative w-7 h-7 md:w-12 md:h-12 rounded-full overflow-hidden ring-1 md:ring-2 ring-cream/50 group-hover:ring-cream flex-shrink-0 transition-all">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left pr-1 md:pr-2">
                <h3 className="text-[11px] md:text-sm font-bold text-white font-serif leading-tight">
                  {member.name}
                </h3>
                <p className="text-[9px] md:text-xs text-cream/90">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
