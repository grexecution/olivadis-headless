'use client'

import { useState, useEffect } from 'react'
import { Package } from 'lucide-react'

// Format date in German format: "12.Dez.2025"
function formatGermanDate(date: Date): string {
  const day = date.getDate()
  const year = date.getFullYear()

  const germanMonths = [
    'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
    'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'
  ]

  const month = germanMonths[date.getMonth()]

  return `${day}.${month}.${year}`
}

export default function InventoryBar() {
  // Mock inventory data - in production this would come from WooCommerce API
  const [inventoryPercentage] = useState(87) // 67% sold
  const today = formatGermanDate(new Date())
  const currentYear = new Date().getFullYear()
  const nextHarvestMonth = 'November' // Olive harvest is typically October-November

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-cream text-primary border-b border-primary/10 shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-2 md:gap-4 py-1.5 md:py-2 text-xs md:text-sm px-2">
          {/* Left side - Inventory Status */}
          <div className="flex items-center gap-1.5 md:gap-3">
            <Package className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0 text-primary" />
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className="font-semibold hidden sm:inline text-primary">{today}:</span>
              <span className="text-primary/80">
                {inventoryPercentage}% verkauft
              </span>
            </div>
          </div>

          {/* Pipe Separator */}
          <div className="text-primary/30 font-light">|</div>

          {/* Center - Progress Bar (Desktop only) */}
          <div className="flex-1 max-w-xs hidden md:block">
            <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                style={{ width: `${inventoryPercentage}%` }}
              />
            </div>
          </div>

          {/* Right side - Next Harvest Info */}
          <div className="text-primary/80 whitespace-nowrap">
            Nächste Ernte: <span className="font-semibold text-primary">{nextHarvestMonth} {currentYear + 1}</span>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="pb-1.5 md:hidden px-2">
          <div className="w-full h-1.5 bg-primary/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
              style={{ width: `${inventoryPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
