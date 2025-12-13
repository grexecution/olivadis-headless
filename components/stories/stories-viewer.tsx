'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { STORIES, PROFILE_IMAGE } from './stories-config'

interface StoriesViewerProps {
  onClose: () => void
}

export function StoriesViewer({ onClose }: StoriesViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressInterval = useRef<NodeJS.Timeout | undefined>(undefined)

  const currentStory = STORIES[currentIndex]

  // Handle story progression
  useEffect(() => {
    if (isPaused) return

    const duration = currentStory.duration
    const intervalTime = 50
    const increment = (intervalTime / duration) * 100

    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext()
          return 0
        }
        return prev + increment
      })
    }, intervalTime)

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [currentIndex, isPaused, currentStory.duration])

  // Play video when it's the current story
  useEffect(() => {
    if (currentStory.type === 'video' && videoRef.current) {
      videoRef.current.play()
    }
  }, [currentIndex, currentStory.type])

  // Preload next story (images and videos)
  useEffect(() => {
    if (currentIndex < STORIES.length - 1) {
      const nextStory = STORIES[currentIndex + 1]

      if (nextStory.type === 'image') {
        // Preload next image
        const img = new window.Image()
        img.src = nextStory.media
      } else if (nextStory.type === 'video') {
        // Preload next video
        const video = document.createElement('video')
        video.src = nextStory.media
        video.preload = 'auto'
      }
    }
  }, [currentIndex])

  const handleNext = () => {
    if (currentIndex < STORIES.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setProgress(0)
    } else {
      onClose()
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setProgress(0)
    }
  }

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const clickX = e.clientX
    const screenWidth = window.innerWidth

    if (clickX < screenWidth / 2) {
      handlePrevious()
    } else {
      handleNext()
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') handlePrevious()
      if (e.key === 'ArrowRight') handleNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])

  return (
    <div
      className="fixed inset-0 z-[100] bg-black md:flex md:items-center md:justify-center"
      onClick={(e) => {
        // Close when clicking the backdrop (only on desktop)
        if (e.target === e.currentTarget && window.innerWidth >= 768) {
          onClose()
        }
      }}
    >
      {/* Container - Fullscreen on mobile, 9:16 centered on desktop */}
      <div className="relative h-full w-full md:h-[90vh] md:w-auto md:aspect-[9/16] md:max-h-[90vh] md:rounded-xl overflow-hidden md:shadow-2xl">
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
          {STORIES.map((story, index) => (
            <div key={story.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width: index < currentIndex ? '100%' : index === currentIndex ? `${progress}%` : '0%'
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
              <Image
                src={PROFILE_IMAGE}
                alt="Olivadis"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div className="text-white">
              <p className="font-semibold text-sm">Olivadis</p>
              <p className="text-xs opacity-75">Vor 2 Stunden</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Story Content */}
        <div
          className="relative h-full w-full cursor-pointer"
          onClick={handleTap}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {currentStory.type === 'image' && (
            <Image
              src={currentStory.media}
              alt={currentStory.caption || 'Story'}
              fill
              className="object-cover"
              priority
            />
          )}

          {currentStory.type === 'video' && (
            <video
              ref={videoRef}
              src={currentStory.media}
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
            />
          )}

          {/* Caption Overlay - Shows on all story types */}
          {currentStory.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <p className="text-white text-base md:text-lg font-medium leading-relaxed">
                {currentStory.caption}
              </p>
            </div>
          )}
        </div>

        {/* Desktop Navigation Arrows */}
        <div className="hidden md:block">
          {currentIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {currentIndex < STORIES.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Pause indicator */}
        {isPaused && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-black/50">
              <div className="flex gap-2">
                <div className="w-1.5 h-8 bg-white rounded-full"></div>
                <div className="w-1.5 h-8 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
