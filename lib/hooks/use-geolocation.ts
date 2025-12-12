'use client'

import { useState, useEffect } from 'react'

interface GeolocationData {
  country: string
  countryCode: string
  loading: boolean
}

export function useGeolocation(): GeolocationData {
  const [data, setData] = useState<GeolocationData>({
    country: 'Austria',
    countryCode: 'AT', // Default to Austria
    loading: true,
  })

  useEffect(() => {
    // Try to get country from IP using a free geolocation API
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((geoData) => {
        setData({
          country: geoData.country_name || 'Austria',
          countryCode: geoData.country_code || 'AT',
          loading: false,
        })
      })
      .catch(() => {
        // Fallback to Austria if API fails
        setData({
          country: 'Austria',
          countryCode: 'AT',
          loading: false,
        })
      })
  }, [])

  return data
}
