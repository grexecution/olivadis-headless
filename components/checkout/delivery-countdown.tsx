'use client'

import { useEffect, useState } from 'react'
import { Truck, Clock, Info } from 'lucide-react'

interface DeliveryCountdownProps {
  selectedCountry: string
  className?: string
}

interface ShippingDuration {
  min: number
  max: number
}

// Shipping durations by country (in business days)
const SHIPPING_DURATIONS: Record<string, ShippingDuration> = {
  AT: { min: 2, max: 3 },
  DE: { min: 3, max: 4 },
  // EU countries
  IT: { min: 5, max: 7 },
  FR: { min: 5, max: 7 },
  ES: { min: 5, max: 7 },
  NL: { min: 5, max: 7 },
  BE: { min: 5, max: 7 },
  CH: { min: 5, max: 7 },
  // Default for other countries
  DEFAULT: { min: 7, max: 10 },
}

export default function DeliveryCountdown({ selectedCountry, className = '' }: DeliveryCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>('')
  const [isPastCutoff, setIsPastCutoff] = useState(false)

  // Order cutoff time (2 PM local time)
  const CUTOFF_HOUR = 14
  const CUTOFF_MINUTE = 0

  useEffect(() => {
    const calculateDelivery = () => {
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()

      // Get shipping duration for selected country
      const duration = SHIPPING_DURATIONS[selectedCountry] || SHIPPING_DURATIONS.DEFAULT

      // Calculate cutoff time for today
      const todayCutoff = new Date(now)
      todayCutoff.setHours(CUTOFF_HOUR, CUTOFF_MINUTE, 0, 0)

      let orderProcessDate: Date
      let hoursUntilCutoff: number
      let minutesUntilCutoff: number

      if (now < todayCutoff) {
        // Before cutoff - can ship today
        orderProcessDate = new Date(now)
        setIsPastCutoff(false)

        const diffMs = todayCutoff.getTime() - now.getTime()
        hoursUntilCutoff = Math.floor(diffMs / (1000 * 60 * 60))
        minutesUntilCutoff = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      } else {
        // After cutoff - ships tomorrow
        orderProcessDate = new Date(now)
        orderProcessDate.setDate(orderProcessDate.getDate() + 1)
        orderProcessDate.setHours(CUTOFF_HOUR, CUTOFF_MINUTE, 0, 0)
        setIsPastCutoff(true)

        const diffMs = orderProcessDate.getTime() - now.getTime()
        hoursUntilCutoff = Math.floor(diffMs / (1000 * 60 * 60))
        minutesUntilCutoff = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      }

      // Calculate estimated delivery date (add business days, skip weekends)
      let deliveryDate = new Date(orderProcessDate)
      let businessDaysAdded = 0

      while (businessDaysAdded < duration.max) {
        deliveryDate.setDate(deliveryDate.getDate() + 1)
        const dayOfWeek = deliveryDate.getDay()

        // Skip weekends (0 = Sunday, 6 = Saturday)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          businessDaysAdded++
        }
      }

      // Format countdown
      if (hoursUntilCutoff > 0) {
        setTimeRemaining(`${hoursUntilCutoff}h ${minutesUntilCutoff}m`)
      } else {
        setTimeRemaining(`${minutesUntilCutoff}m`)
      }

      // Format delivery date in German
      const deliveryDateStr = deliveryDate.toLocaleDateString('de-DE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      // Capitalize first letter
      setEstimatedDelivery(deliveryDateStr.charAt(0).toUpperCase() + deliveryDateStr.slice(1))
    }

    calculateDelivery()
    const interval = setInterval(calculateDelivery, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [selectedCountry])

  if (!selectedCountry || !estimatedDelivery) {
    return null
  }

  const duration = SHIPPING_DURATIONS[selectedCountry] || SHIPPING_DURATIONS.DEFAULT

  return (
    <div className={`bg-gradient-to-br from-primary/5 to-primary/10 rounded-md p-2 lg:p-3 border border-primary/10 ${className}`}>
      {/* Compact Header */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <Truck className="w-3 h-3 text-primary" />
        <h3 className="text-[10px] lg:text-xs font-semibold text-primary">Voraussichtliche Lieferung</h3>
      </div>

      {/* Main content - ultra compact */}
      <div className="space-y-1.5">
        {/* Countdown - only if before cutoff */}
        {!isPastCutoff && (
          <div className="flex items-center gap-1.5 bg-white/50 rounded p-1.5">
            <Clock className="w-3 h-3 text-primary animate-pulse flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[8px] lg:text-[9px] text-primary/70 leading-tight">Bestellen innerhalb</p>
              <p className="text-xs lg:text-sm font-bold text-primary tabular-nums">{timeRemaining}</p>
            </div>
          </div>
        )}

        {/* Delivery date - compact */}
        <div className="flex items-center gap-1.5 bg-white/50 rounded p-1.5">
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Truck className="w-2.5 h-2.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[8px] lg:text-[9px] text-primary/70 leading-tight">
              Voraussichtlich bei Ihnen am
            </p>
            <p className="text-[10px] lg:text-xs font-bold text-primary truncate">{estimatedDelivery}</p>
          </div>
        </div>

        {/* Disclaimer - more detailed */}
        <p className="text-[8px] lg:text-[9px] text-primary/50 text-center leading-tight px-1">
          {isPastCutoff
            ? 'Versand morgen • Lieferzeit kann je nach Verfügbarkeit variieren'
            : 'Bei Bestellung heute • Lieferzeit kann je nach Verfügbarkeit variieren'
          }
        </p>
      </div>
    </div>
  )
}
