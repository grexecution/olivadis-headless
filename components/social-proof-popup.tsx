'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, X } from 'lucide-react'

interface RecentPurchase {
  firstName: string
  country: string
  productName: string
  productImage: string | null
  quantity: number
  timeAgo: string
  timestamp: number
}

const MAX_SHOWS_PER_SESSION = 2
const MIN_TIME_BETWEEN_SHOWS = 60000 // 60 seconds in milliseconds

export function SocialProofPopup() {
  const [purchases, setPurchases] = useState<RecentPurchase[]>([])
  const [currentPurchase, setCurrentPurchase] = useState<RecentPurchase | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Fetch recent purchases on mount
  useEffect(() => {
    async function fetchPurchases() {
      try {
        const response = await fetch('/api/recent-purchases')
        const data = await response.json()
        if (data.purchases && data.purchases.length > 0) {
          setPurchases(data.purchases)
        }
      } catch (error) {
        console.error('Failed to fetch recent purchases:', error)
      }
    }

    fetchPurchases()
  }, [])

  const showRandomPurchase = useCallback(() => {
    if (purchases.length === 0) return

    // Check session storage for show count and last show time
    const showCount = parseInt(sessionStorage.getItem('socialProofShowCount') || '0', 10)
    const lastShowTime = parseInt(sessionStorage.getItem('socialProofLastShow') || '0', 10)
    const now = Date.now()

    // Don't show if we've reached max shows per session
    if (showCount >= MAX_SHOWS_PER_SESSION) {
      return
    }

    // Don't show if not enough time has passed since last show
    if (lastShowTime && (now - lastShowTime) < MIN_TIME_BETWEEN_SHOWS) {
      return
    }

    // Show the popup
    const randomIndex = Math.floor(Math.random() * purchases.length)
    setCurrentPurchase(purchases[randomIndex])
    setIsVisible(true)

    // Update session storage
    sessionStorage.setItem('socialProofShowCount', (showCount + 1).toString())
    sessionStorage.setItem('socialProofLastShow', now.toString())

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setIsVisible(false)
    }, 5000)
  }, [purchases])

  // Show random purchases at intervals
  useEffect(() => {
    if (purchases.length === 0) return

    // Check if we've already maxed out shows for this session
    const showCount = parseInt(sessionStorage.getItem('socialProofShowCount') || '0', 10)
    if (showCount >= MAX_SHOWS_PER_SESSION) {
      return // Don't set up any timers if we've maxed out
    }

    // Initial delay before first popup (10-20 seconds)
    const initialDelay = Math.random() * 10000 + 10000

    const initialTimer = setTimeout(() => {
      showRandomPurchase()

      // Set up recurring interval (every 70-90 seconds to account for 60s minimum)
      const interval = setInterval(() => {
        // Check again if we've maxed out during the interval
        const currentCount = parseInt(sessionStorage.getItem('socialProofShowCount') || '0', 10)
        if (currentCount >= MAX_SHOWS_PER_SESSION) {
          clearInterval(interval)
          return
        }
        showRandomPurchase()
      }, Math.random() * 20000 + 70000) // 70-90 seconds

      return () => clearInterval(interval)
    }, initialDelay)

    return () => clearTimeout(initialTimer)
  }, [purchases, showRandomPurchase])

  function handleClose() {
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && currentPurchase && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 pointer-events-auto"
        >
          <div className="bg-white rounded-lg shadow-2xl border-2 border-primary/10 overflow-hidden">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 p-1 hover:bg-cream/50 rounded-full transition-colors z-10"
              aria-label="Schließen"
            >
              <X className="w-4 h-4 text-primary-dark/40" />
            </button>

            <div className="flex gap-3 p-4">
              {/* Product Image or Icon */}
              {currentPurchase.productImage ? (
                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-cream border border-primary/10">
                  <Image
                    src={currentPurchase.productImage}
                    alt={currentPurchase.productName}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-7 h-7 text-primary" />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Header with customer name */}
                <p className="text-sm font-bold text-primary mb-1 leading-tight">
                  {currentPurchase.firstName} aus {currentPurchase.country}
                </p>

                {/* Purchase action */}
                <p className="text-xs text-primary-dark/70 mb-2">
                  hat gerade gekauft
                </p>

                {/* Product Info */}
                <div className="bg-cream/50 rounded-md px-2.5 py-1.5 border border-primary/5">
                  <p className="text-xs text-primary-dark font-semibold leading-tight">
                    {currentPurchase.quantity > 1 && `${currentPurchase.quantity}x `}
                    {currentPurchase.productName}
                  </p>
                </div>

                {/* Time ago - small and subtle */}
                <p className="text-xs text-primary-dark/40 mt-1.5">
                  {currentPurchase.timeAgo}
                </p>
              </div>
            </div>

            {/* Bottom accent bar */}
            <div className="h-1 bg-gradient-to-r from-primary via-primary-light to-primary" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
