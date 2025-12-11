'use client'

import { useState, useEffect } from 'react'
import { Package } from 'lucide-react'

export default function InventoryBar() {
  // Mock inventory data - in production this would come from WooCommerce API
  const [inventoryPercentage] = useState(67) // 67% sold
  const currentYear = new Date().getFullYear()
  const nextHarvestMonth = 'November' // Olive harvest is typically October-November

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-cream shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2 text-sm">
          {/* Left side - Inventory Status */}
          <div className="flex items-center gap-3">
            <Package className="w-4 h-4 flex-shrink-0" />
            <div className="flex items-center gap-2">
              <span className="font-semibold hidden sm:inline">Ernte {currentYear}:</span>
              <span className="text-cream/90">
                {inventoryPercentage}% verkauft
              </span>
            </div>
          </div>

          {/* Center - Progress Bar */}
          <div className="flex-1 max-w-xs mx-4 hidden md:block">
            <div className="w-full h-2 bg-cream/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-cream transition-all duration-500 ease-out rounded-full"
                style={{ width: `${inventoryPercentage}%` }}
              />
            </div>
          </div>

          {/* Right side - Next Harvest Info */}
          <div className="text-right text-cream/90 text-xs sm:text-sm whitespace-nowrap">
            Nächste Ernte: <span className="font-semibold text-cream">{nextHarvestMonth} {currentYear + 1}</span>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="pb-2 md:hidden">
          <div className="w-full h-1.5 bg-cream/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-cream transition-all duration-500 ease-out rounded-full"
              style={{ width: `${inventoryPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
