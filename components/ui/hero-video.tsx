'use client'

import { useState } from 'react'
import Image from 'next/image'

export function HeroVideo() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Poster Image - Fades out when video loads */}
      <Image
        src="/video-thumbnail.jpg"
        alt="Olivadis olive oil production"
        fill
        priority
        className="object-cover transition-opacity duration-500"
        style={{
          opacity: isVideoLoaded ? 0 : 1,
          pointerEvents: 'none',
        }}
        sizes="100vw"
      />

      {/* Video - Fades in when loaded */}
      <video
        autoPlay
        muted
        loop
        playsInline
        onCanPlay={() => setIsVideoLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: isVideoLoaded ? 1 : 0 }}
      >
        <source src="/videos/banner-desktop-lo.mp4" type="video/mp4" />
      </video>

      {/* Lighter Green Overlay to See Video Better */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/75 via-primary/70 to-primary/75" />
    </div>
  )
}