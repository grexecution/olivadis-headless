/**
 * Olive Season Status System
 *
 * Tracks the current seasonal status of olive trees based on Greek olive calendar
 * Provides real-time status based on current date
 */

export interface SeasonStatus {
  key: string
  name: string
  icon: string
  description: string
  color: string
  bgColor: string
  months: number[] // 1-12 (January = 1, December = 12)
}

/**
 * Greek olive season calendar
 * Based on typical olive cultivation cycle in Pteleos, Greece
 */
export const OLIVE_SEASONS: SeasonStatus[] = [
  {
    key: 'flowering',
    name: 'Blütezeit',
    icon: '🌸',
    description: 'Die Olivenbäume blühen',
    color: '#FF69B4',
    bgColor: '#FFF0F5',
    months: [3, 4, 5], // March - May
  },
  {
    key: 'growing',
    name: 'Wachstum',
    icon: '🌿',
    description: 'Oliven wachsen und reifen',
    color: '#3B6912',
    bgColor: '#F0F8E8',
    months: [6, 7, 8], // June - August
  },
  {
    key: 'ripening',
    name: 'Reifung',
    icon: '🫒',
    description: 'Oliven werden reif',
    color: '#8B4513',
    bgColor: '#FFF8DC',
    months: [9, 10], // September - October
  },
  {
    key: 'harvest',
    name: 'Ernte',
    icon: '🚜',
    description: 'Frische Ernte läuft',
    color: '#1C4220',
    bgColor: '#E8F5E9',
    months: [11, 12], // November - December
  },
  {
    key: 'bottling',
    name: 'Abfüllung',
    icon: '🏺',
    description: 'Öl wird abgefüllt',
    color: '#6B4226',
    bgColor: '#F5F5DC',
    months: [1, 2], // January - February
  },
]

/**
 * Get the current olive season status based on current date
 *
 * @param date - Optional date to check (defaults to current date)
 * @returns The current season status object
 *
 * @example
 * ```tsx
 * const season = getCurrentSeasonStatus()
 * console.log(season.name) // "Ernte" (if November)
 * console.log(season.icon) // "🚜"
 * ```
 */
export function getCurrentSeasonStatus(date: Date = new Date()): SeasonStatus {
  const month = date.getMonth() + 1 // JavaScript months are 0-indexed

  const currentSeason = OLIVE_SEASONS.find((season) =>
    season.months.includes(month)
  )

  // Fallback to growing season if no match (shouldn't happen)
  return currentSeason || OLIVE_SEASONS[1]
}

/**
 * Get the next upcoming season
 *
 * @param date - Optional date to check (defaults to current date)
 * @returns The next season status object and days until it starts
 */
export function getNextSeason(date: Date = new Date()): {
  season: SeasonStatus
  daysUntil: number
} {
  const currentMonth = date.getMonth() + 1
  const currentSeason = getCurrentSeasonStatus(date)

  // Find next season index
  const currentIndex = OLIVE_SEASONS.findIndex(
    (s) => s.key === currentSeason.key
  )
  const nextIndex = (currentIndex + 1) % OLIVE_SEASONS.length
  const nextSeason = OLIVE_SEASONS[nextIndex]

  // Calculate days until next season starts
  const nextSeasonStartMonth = nextSeason.months[0]
  const currentDate = new Date(date)

  let targetDate = new Date(date.getFullYear(), nextSeasonStartMonth - 1, 1)
  if (nextSeasonStartMonth <= currentMonth) {
    // Next season is next year
    targetDate = new Date(date.getFullYear() + 1, nextSeasonStartMonth - 1, 1)
  }

  const daysUntil = Math.ceil(
    (targetDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  return {
    season: nextSeason,
    daysUntil,
  }
}

/**
 * Get season by key
 */
export function getSeasonByKey(key: string): SeasonStatus | undefined {
  return OLIVE_SEASONS.find((s) => s.key === key)
}

/**
 * Check if a specific season is currently active
 */
export function isSeasonActive(seasonKey: string, date: Date = new Date()): boolean {
  const currentSeason = getCurrentSeasonStatus(date)
  return currentSeason.key === seasonKey
}

/**
 * Get all seasons (for display/reference)
 */
export function getAllSeasons(): SeasonStatus[] {
  return OLIVE_SEASONS
}

/**
 * Format season for display with emoji and name
 */
export function formatSeasonDisplay(season: SeasonStatus): string {
  return `${season.icon} ${season.name}`
}

/**
 * Get season progress percentage (how far through the current season)
 */
export function getSeasonProgress(date: Date = new Date()): number {
  const currentSeason = getCurrentSeasonStatus(date)
  const currentMonth = date.getMonth() + 1
  const currentDay = date.getDate()

  // Find position in season
  const monthIndex = currentSeason.months.indexOf(currentMonth)
  if (monthIndex === -1) return 0

  const totalMonths = currentSeason.months.length
  const daysInMonth = new Date(
    date.getFullYear(),
    currentMonth,
    0
  ).getDate()

  const monthProgress = currentDay / daysInMonth
  const seasonProgress = (monthIndex + monthProgress) / totalMonths

  return Math.round(seasonProgress * 100)
}
