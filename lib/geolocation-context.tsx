'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface GeolocationData {
  country: string
  countryCode: string
  loading: boolean
}

const GeolocationContext = createContext<GeolocationData | undefined>(undefined)

export function GeolocationProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<GeolocationData>({
    country: 'Austria',
    countryCode: 'AT',
    loading: true,
  })

  useEffect(() => {
    // Check if we have a cookie from middleware (server-side detection)
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift()
      return null
    }

    const cookieCountry = getCookie('user-country')

    if (cookieCountry) {
      // Use cookie from server-side detection (instant, no API call!)
      setData({
        country: cookieCountry,
        countryCode: cookieCountry,
        loading: false,
      })
      return
    }

    // Fallback to client-side API call if no cookie
    const controller = new AbortController()

    fetch('https://ipapi.co/json/', { signal: controller.signal })
      .then((res) => res.json())
      .then((geoData) => {
        setData({
          country: geoData.country_name || 'Austria',
          countryCode: geoData.country_code || 'AT',
          loading: false,
        })
      })
      .catch((error) => {
        // Only set fallback if not aborted
        if (error.name !== 'AbortError') {
          setData({
            country: 'Austria',
            countryCode: 'AT',
            loading: false,
          })
        }
      })

    // Cleanup: abort fetch if component unmounts
    return () => controller.abort()
  }, [])

  return (
    <GeolocationContext.Provider value={data}>
      {children}
    </GeolocationContext.Provider>
  )
}

export function useGeolocation(): GeolocationData {
  const context = useContext(GeolocationContext)
  if (!context) {
    throw new Error('useGeolocation must be used within GeolocationProvider')
  }
  return context
}
