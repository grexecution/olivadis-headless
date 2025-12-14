'use client'

import { useState } from 'react'

export interface TasteProfile {
  bitterness: number // 0-100
  fruitiness: number // 0-100
  pungency: number // 0-100 (Schärfe/spiciness)
  complexity: number // 0-100
  intensity: number // 0-100
}

interface TasteProfileChartProps {
  profile?: TasteProfile
  className?: string
}

// Default profile if none provided
const DEFAULT_PROFILE: TasteProfile = {
  bitterness: 75,
  fruitiness: 85,
  pungency: 70,
  complexity: 90,
  intensity: 80,
}

export default function TasteProfileChart({ profile = DEFAULT_PROFILE, className = '' }: TasteProfileChartProps) {
  const [hoveredAttribute, setHoveredAttribute] = useState<string | null>(null)

  const attributes = [
    { key: 'bitterness', label: 'Bitterkeit', value: profile.bitterness, color: '#1C4220' },
    { key: 'fruitiness', label: 'Fruchtigkeit', value: profile.fruitiness, color: '#3B6912' },
    { key: 'pungency', label: 'Schärfe', value: profile.pungency, color: '#1C4220' },
    { key: 'complexity', label: 'Komplexität', value: profile.complexity, color: '#3B6912' },
    { key: 'intensity', label: 'Intensität', value: profile.intensity, color: '#1C4220' },
  ]

  // Calculate polygon points for the radar chart
  const calculatePoints = (values: number[], size: number = 200) => {
    const center = size / 2
    const angleStep = (2 * Math.PI) / values.length
    const maxRadius = center - 20

    return values
      .map((value, index) => {
        const angle = angleStep * index - Math.PI / 2 // Start from top
        const radius = (value / 100) * maxRadius
        const x = center + radius * Math.cos(angle)
        const y = center + radius * Math.sin(angle)
        return `${x},${y}`
      })
      .join(' ')
  }

  // Calculate axis lines for the background grid
  const axisLines = (size: number = 200) => {
    const center = size / 2
    const maxRadius = center - 20
    const angleStep = (2 * Math.PI) / attributes.length

    return attributes.map((_, index) => {
      const angle = angleStep * index - Math.PI / 2
      const x = center + maxRadius * Math.cos(angle)
      const y = center + maxRadius * Math.sin(angle)
      return { x1: center, y1: center, x2: x, y2: y }
    })
  }

  // Calculate label positions
  const labelPositions = (size: number = 200) => {
    const center = size / 2
    const labelRadius = center - 5
    const angleStep = (2 * Math.PI) / attributes.length

    return attributes.map((attr, index) => {
      const angle = angleStep * index - Math.PI / 2
      const x = center + labelRadius * Math.cos(angle)
      const y = center + labelRadius * Math.sin(angle)
      return { x, y, label: attr.label, key: attr.key, value: attr.value }
    })
  }

  const size = 200
  const values = attributes.map(a => a.value)
  const polygonPoints = calculatePoints(values, size)

  return (
    <div>
      <h3 className="text-h4 md:text-h4-lg text-primary mb-4">Geschmacksprofil</h3>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* SVG Radar Chart */}
        <div className="relative">
          <svg width={size} height={size} className="overflow-visible">
            {/* Background circles */}
            <circle cx={size/2} cy={size/2} r={(size/2 - 20) * 0.25} fill="none" stroke="#F2E9DB" strokeWidth="1" />
            <circle cx={size/2} cy={size/2} r={(size/2 - 20) * 0.5} fill="none" stroke="#F2E9DB" strokeWidth="1" />
            <circle cx={size/2} cy={size/2} r={(size/2 - 20) * 0.75} fill="none" stroke="#F2E9DB" strokeWidth="1" />
            <circle cx={size/2} cy={size/2} r={size/2 - 20} fill="none" stroke="#F2E9DB" strokeWidth="1" />

            {/* Axis lines */}
            {axisLines(size).map((line, i) => (
              <line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="#F2E9DB"
                strokeWidth="1"
              />
            ))}

            {/* Data polygon */}
            <polygon
              points={polygonPoints}
              fill="#1C4220"
              fillOpacity="0.3"
              stroke="#1C4220"
              strokeWidth="2"
              className="transition-all duration-300"
            />

            {/* Data points */}
            {calculatePoints(values, size).split(' ').map((point, i) => {
              const [x, y] = point.split(',').map(Number)
              const attr = attributes[i]
              const isHovered = hoveredAttribute === attr.key

              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4}
                  fill="#3B6912"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredAttribute(attr.key)}
                  onMouseLeave={() => setHoveredAttribute(null)}
                />
              )
            })}

            {/* Labels */}
            {labelPositions(size).map((pos, i) => {
              const isHovered = hoveredAttribute === pos.key
              return (
                <text
                  key={i}
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  className={`text-xs font-medium fill-primary transition-all duration-200 ${
                    isHovered ? 'font-bold' : ''
                  }`}
                  dominantBaseline="middle"
                  onMouseEnter={() => setHoveredAttribute(pos.key)}
                  onMouseLeave={() => setHoveredAttribute(null)}
                >
                  {pos.label}
                </text>
              )
            })}
          </svg>
        </div>

        {/* Legend with values */}
        <div className="flex-1 space-y-3 w-full md:w-auto">
          {attributes.map((attr) => {
            const isHovered = hoveredAttribute === attr.key
            return (
              <div
                key={attr.key}
                className={`flex items-center justify-between gap-4 p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                  isHovered ? 'bg-cream/50' : 'bg-transparent'
                }`}
                onMouseEnter={() => setHoveredAttribute(attr.key)}
                onMouseLeave={() => setHoveredAttribute(null)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: attr.color }}
                  />
                  <span className={`text-sm ${isHovered ? 'font-semibold' : 'font-medium'}`}>
                    {attr.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-cream rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${attr.value}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-8 text-right">{attr.value}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Info text */}
      <p className="text-xs text-primary/60 mt-4 italic">
        Bewerten Sie das Aroma auf einer Skala von 0-100
      </p>
    </div>
  )
}

/**
 * Default profiles for different product categories
 */
export const DEFAULT_TASTE_PROFILES: Record<string, TasteProfile> = {
  // Extra Virgin Olive Oil - robust, complex
  'extra-virgin': {
    bitterness: 75,
    fruitiness: 85,
    pungency: 70,
    complexity: 90,
    intensity: 80,
  },
  // Mild Olive Oil - gentle, fruity
  'mild': {
    bitterness: 30,
    fruitiness: 70,
    pungency: 25,
    complexity: 50,
    intensity: 40,
  },
  // Organic Olive Oil - balanced
  'organic': {
    bitterness: 60,
    fruitiness: 75,
    pungency: 55,
    complexity: 70,
    intensity: 65,
  },
  // Flavored Olive Oil - varied
  'flavored': {
    bitterness: 40,
    fruitiness: 60,
    pungency: 50,
    complexity: 80,
    intensity: 70,
  },
  // Default fallback
  'default': {
    bitterness: 50,
    fruitiness: 50,
    pungency: 50,
    complexity: 50,
    intensity: 50,
  },
}
