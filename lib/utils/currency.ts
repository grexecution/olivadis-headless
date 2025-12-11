/**
 * Format a number as German currency (EUR)
 * Examples:
 * - 1234.56 -> "1.234,56 €"
 * - 10 -> "10,00 €"
 * - 1000000 -> "1.000.000,00 €"
 */
export function formatEUR(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a number in German style (without currency symbol)
 * Examples:
 * - 1234.56 -> "1.234,56"
 * - 10 -> "10,00"
 */
export function formatNumber(amount: number, decimals: number = 2): string {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)
}

/**
 * Parse a German-formatted number string to a float
 * Examples:
 * - "5,99" -> 5.99
 * - "1.234,56" -> 1234.56
 */
export function parseGermanNumber(value: string): number {
  // Remove thousand separators (.) and replace comma (,) with period (.)
  const normalized = value.replace(/\./g, '').replace(',', '.')
  return parseFloat(normalized)
}
