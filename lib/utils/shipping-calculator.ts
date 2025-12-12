/**
 * Client-side shipping and tax calculator
 * Uses shipping rules fetched at build time from WooCommerce
 * Provides instant calculations without API calls
 */

import { CartItem } from '@/lib/cart-context'
import shippingRulesData from '@/lib/woocommerce/shipping-rules.json'

// Shipping rules - automatically synced from WooCommerce at build time
// Script: scripts/sync-shipping-rules.js runs before every build
// To update: Change WooCommerce settings → Trigger Vercel rebuild
export const SHIPPING_RULES = shippingRulesData as Record<string, {
  freeShippingThreshold: number
  flatRate: number
  taxRate: number
  zoneName: string
}>

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
