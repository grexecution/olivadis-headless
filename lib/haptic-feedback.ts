/**
 * Haptic Feedback Utility for Mobile Devices
 *
 * Provides tactile feedback patterns using the Vibration API
 * Gracefully degrades on devices that don't support vibration
 */

export type HapticPattern =
  | 'addToCart'
  | 'removeItem'
  | 'buttonTap'
  | 'error'
  | 'success'
  | 'notification'

/**
 * Vibration patterns in milliseconds
 * Format: [vibrate, pause, vibrate, pause, ...]
 */
const patterns: Record<HapticPattern, number | number[]> = {
  // Double pulse for add to cart - satisfying confirmation
  addToCart: [50, 100, 50],

  // Strong pulse for removing item - clear deletion
  removeItem: 200,

  // Subtle tap for button press - tactile response
  buttonTap: 10,

  // Shake pattern for errors - attention grabber
  error: [50, 50, 50, 50, 50],

  // Celebration pattern for success
  success: [100, 50, 100],

  // Notification pulse
  notification: [30, 100, 30, 100, 30],
}

/**
 * Triggers haptic feedback if supported
 *
 * @param pattern - The haptic pattern to play
 * @returns boolean - True if vibration was triggered, false otherwise
 *
 * @example
 * ```tsx
 * import { haptic } from '@/lib/haptic-feedback'
 *
 * <button onClick={() => {
 *   haptic('buttonTap')
 *   addToCart(product)
 * }}>
 *   Add to Cart
 * </button>
 * ```
 */
export function haptic(pattern: HapticPattern): boolean {
  // Check if vibration API is supported
  if (typeof window === 'undefined' || !navigator.vibrate) {
    return false
  }

  try {
    const vibrationPattern = patterns[pattern]
    navigator.vibrate(vibrationPattern)
    return true
  } catch (error) {
    // Silently fail if vibration is not available
    console.warn('Haptic feedback not available:', error)
    return false
  }
}

/**
 * Stop any ongoing vibration
 */
export function stopHaptic(): void {
  if (typeof window !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(0)
  }
}

/**
 * Check if device supports haptic feedback
 */
export function isHapticSupported(): boolean {
  return typeof window !== 'undefined' && 'vibrate' in navigator
}

/**
 * Custom vibration pattern
 *
 * @param pattern - Array of milliseconds [vibrate, pause, vibrate, ...]
 *
 * @example
 * ```tsx
 * customHaptic([100, 50, 100, 50, 200]) // Custom pattern
 * ```
 */
export function customHaptic(pattern: number | number[]): boolean {
  if (typeof window === 'undefined' || !navigator.vibrate) {
    return false
  }

  try {
    navigator.vibrate(pattern)
    return true
  } catch (error) {
    console.warn('Custom haptic feedback failed:', error)
    return false
  }
}
