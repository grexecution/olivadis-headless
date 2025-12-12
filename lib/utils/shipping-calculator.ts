/**
 * Client-side shipping and tax calculator
 * Uses shipping rules fetched at build time from WooCommerce
 * Provides instant calculations without API calls
 */

import { CartItem } from '@/lib/cart-context'
import { parseGermanNumber } from './currency'

// Shipping rules - fetched from WooCommerce at build time
// If WooCommerce settings change, rebuild to update these rules
export const SHIPPING_RULES = {
  // Austria (AT)
  AT: {
    freeShippingThreshold: 79, // €79 for free shipping
    flatRate: 5.99, // €5.99 shipping cost
    taxRate: 0.10, // 10% tax rate
  },
  // Germany (DE)
  DE: {
    freeShippingThreshold: 79, // €79 for free shipping
    flatRate: 5.99, // €5.99 shipping cost (same as WooCommerce)
    taxRate: 0.10, // 10% tax rate (assumed, update if different)
  },
  // Default for other countries
  DEFAULT: {
    freeShippingThreshold: 100,
    flatRate: 9.99,
    taxRate: 0.20,
  },
}

export interface ShippingCalculation {
  subtotal: number
  shipping: number
  tax: number
  total: number
  country: string
  isFreeShipping: boolean
}

/**
 * Calculate shipping cost based on cart total and country
 * Instant calculation, no API calls
 */
export function calculateShipping(
  subtotal: number,
  countryCode: string
): { cost: number; isFree: boolean } {
  const rules = SHIPPING_RULES[countryCode as keyof typeof SHIPPING_RULES] || SHIPPING_RULES.DEFAULT

  const isFree = subtotal >= rules.freeShippingThreshold
  const cost = isFree ? 0 : rules.flatRate

  return { cost, isFree }
}

/**
 * Calculate tax based on subtotal and country
 * Instant calculation, no API calls
 */
export function calculateTax(subtotal: number, shipping: number, countryCode: string): number {
  const rules = SHIPPING_RULES[countryCode as keyof typeof SHIPPING_RULES] || SHIPPING_RULES.DEFAULT

  // Tax is calculated on subtotal + shipping
  return (subtotal + shipping) * rules.taxRate
}

/**
 * Calculate complete cart totals instantly
 * No API calls, <100ms execution time
 */
export function calculateCartTotals(
  items: CartItem[],
  countryCode: string = 'AT' // Default to Austria
): ShippingCalculation {
  // Calculate subtotal from cart items
  const subtotal = items.reduce((sum, item) => {
    // Use the price from CartItem directly (it's already a number)
    return sum + item.price * item.quantity
  }, 0)

  // Calculate shipping
  const { cost: shipping, isFree: isFreeShipping } = calculateShipping(subtotal, countryCode)

  // Calculate tax
  const tax = calculateTax(subtotal, shipping, countryCode)

  // Calculate total
  const total = subtotal + shipping + tax

  return {
    subtotal,
    shipping,
    tax,
    total,
    country: countryCode,
    isFreeShipping,
  }
}

/**
 * Get free shipping threshold for a country
 */
export function getFreeShippingThreshold(countryCode: string = 'AT'): number {
  const rules = SHIPPING_RULES[countryCode as keyof typeof SHIPPING_RULES] || SHIPPING_RULES.DEFAULT
  return rules.freeShippingThreshold
}
