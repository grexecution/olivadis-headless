'use client'

import { useState, useRef, useEffect } from 'react'
import { StoriesViewer } from './stories-viewer'
import { STORIES, PROFILE_VIDEO, PROFILE_IMAGE } from './stories-config'

export function StoriesButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Load component after first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      setIsLoaded(true)
      // Fade in after a brief delay
      setTimeout(() => setIsVisible(true), 100)
    }

    // Listen for any user interaction
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      window.addEventListener(event, handleInteraction, { once: true, passive: true })
    })

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleInteraction)
      })
    }
  }, [])

  // Auto-play video when loaded
  useEffect(() => {
    if (isLoaded && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Video autoplay might be blocked, that's okay
      })
    }
  }, [isLoaded])

  // Don't render until user interacts
  if (!isLoaded) {
    return null
  }

  return (
    <>
      {/* Sticky Button - Bottom Right */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 group transition-opacity duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Olivadis Stories ansehen"
      >
        {/* Gradient Border Ring - Instagram Style */}
        <div className="relative">
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[3px] animate-pulse">
            <div className="w-full h-full rounded-full bg-background"></div>
          </div>

          {/* Profile Video */}
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-background shadow-xl group-hover:scale-110 transition-transform duration-200">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
              poster={PROFILE_IMAGE}
            >
              <source src={PROFILE_VIDEO} type="video/mp4" />
            </video>
            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          {/* Story Count Badge */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-white text-xs font-bold rounded-full border-2 border-background flex items-center justify-center shadow-lg">
            {STORIES.length}
          </div>
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {STORIES.length} neue Stories
          <div className="absolute top-full right-6 -mt-1 w-2 h-2 bg-primary rotate-45"></div>
        </div>
      </button>

      {/* Stories Viewer Modal */}
      {isOpen && <StoriesViewer onClose={() => setIsOpen(false)} />}
    </>
  )
}
