'use client'

import { useEffect, useState } from 'react'
import { getCurrentSeasonStatus, getNextSeason, type SeasonStatus } from '@/lib/olive-season'

interface OliveSeasonBadgeProps {
  variant?: 'navbar' | 'hero' | 'full'
  className?: string
}

export default function OliveSeasonBadge({ variant = 'navbar', className = '' }: OliveSeasonBadgeProps) {
  const [season, setSeason] = useState<SeasonStatus | null>(null)
  const [nextSeason, setNextSeason] = useState<{ season: SeasonStatus; daysUntil: number } | null>(null)
  const [mounted, setMounted] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    setMounted(true)
    const currentSeason = getCurrentSeasonStatus()
    const upcoming = getNextSeason()
    setSeason(currentSeason)
    setNextSeason(upcoming)
  }, [])

  // Avoid hydration mismatch
  if (!mounted || !season) {
    return null
  }

  // Navbar variant - compact badge
  if (variant === 'navbar') {
    return (
      <div
        className={`hidden md:flex relative items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 ${className}`}
        style={{
          backgroundColor: season.bgColor,
          color: season.color,
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className="text-[10px] font-normal opacity-80">Status:</span>
        <span className="text-base">{season.icon}</span>
        <span className="font-semibold">{season.name}</span>

        {/* Visible Tooltip */}
        {showTooltip && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 w-64 p-3 bg-white rounded-lg shadow-xl border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="text-xs text-primary-dark space-y-1.5">
              <p className="font-bold text-primary">Griechischer Olivenkalender</p>
              <p className="text-[11px]">{season.description}</p>
              {nextSeason && (
                <p className="text-[10px] text-primary/60 pt-1 border-t border-primary/10">
                  Nächste Phase: {nextSeason.season.icon} {nextSeason.season.name} in {nextSeason.daysUntil} Tagen
                </p>
              )}
            </div>
            {/* Arrow */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-l border-t border-primary/20 rotate-45"></div>
          </div>
        )}
      </div>
    )
  }

  // Hero variant - small badge for product pages
  if (variant === 'hero') {
    return (
      <div
        className={`relative inline-flex flex-col md:flex-row items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 hover:scale-105 ${className}`}
        style={{
          backgroundColor: season.bgColor,
          color: season.color,
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-normal opacity-80">Aktueller Status:</span>
          <span className="text-lg">{season.icon}</span>
          <span className="text-sm font-bold">{season.name}</span>
        </div>
        <span className="text-xs opacity-70">({season.description})</span>

        {/* Visible Tooltip */}
        {showTooltip && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 w-72 p-4 bg-white rounded-lg shadow-xl border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="text-sm text-primary-dark space-y-2">
              <p className="font-bold text-primary">🫒 Griechischer Olivenkalender</p>
              <p className="text-xs leading-relaxed">{season.description}</p>
              {nextSeason && (
                <p className="text-[11px] text-primary/60 pt-2 border-t border-primary/10">
                  <span className="font-semibold">Nächste Phase:</span> {nextSeason.season.icon} {nextSeason.season.name} in {nextSeason.daysUntil} Tagen
                </p>
              )}
            </div>
            {/* Arrow */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-l border-t border-primary/20 rotate-45"></div>
          </div>
        )}
      </div>
    )
  }

  // Full variant - detailed card
  return (
    <div className={`bg-cream rounded-xl p-4 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
          style={{ backgroundColor: season.bgColor }}
        >
          {season.icon}
        </div>
        <div>
          <h3 className="text-h4 text-primary">{season.name}</h3>
          <p className="text-sm text-primary/70">{season.description}</p>
        </div>
      </div>

      {nextSeason && (
        <div className="pt-3 border-t border-primary/10">
          <p className="text-xs text-primary/60">
            Nächste Phase: {nextSeason.season.icon} {nextSeason.season.name} in {nextSeason.daysUntil} Tagen
          </p>
        </div>
      )}
    </div>
  )
}
