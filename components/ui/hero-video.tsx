'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export function HeroVideo() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)

  // Delay video loading by 2 seconds after page load to improve LCP
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoadVideo(true)
    }, 2000) // 2 second delay

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Poster Image - Fades out when video loads */}
      <Image
        src="/video-thumbnail.jpg"
        alt="Olivadis olive oil production"
        fill
        priority
        fetchPriority="high"
        className="object-cover transition-opacity duration-500"
        style={{
          opacity: isVideoLoaded ? 0 : 1,
          pointerEvents: 'none',
        }}
        sizes="100vw"
      />

      {/* Video - Only loads after delay, fades in when ready */}
      {shouldLoadVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setIsVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: isVideoLoaded ? 1 : 0 }}
        >
          <source src="/videos/banner-desktop-compressed.mp4" type="video/mp4" />
        </video>
      )}

      {/* Lighter Green Overlay to See Video Better */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/75 via-primary/70 to-primary/75" />
    </div>
  )
}