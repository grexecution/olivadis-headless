import { NextResponse } from 'next/server'
import { wooClient } from '@/lib/woocommerce/client'

interface WooCommerceOrder {
  id: number
  date_created: string
  billing: {
    first_name: string
    last_name: string
    city: string
    country: string
  }
  line_items: Array<{
    name: string
    quantity: number
    price: number
    total: string
    image?: {
      src: string
    }
  }>
}

export interface RecentPurchase {
  firstName: string
  country: string
  productName: string
  productImage: string | null
  quantity: number
  timeAgo: string
  timestamp: number
}

function getCountryName(code: string): string {
  const countries: Record<string, string> = {
    AT: 'Österreich',
    DE: 'Deutschland',
    CH: 'Schweiz',
    IT: 'Italien',
    FR: 'Frankreich',
    ES: 'Spanien',
    NL: 'Niederlande',
    BE: 'Belgien',
    LU: 'Luxemburg',
    GB: 'Vereinigtes Königreich',
    US: 'USA',
  }
  return countries[code] || code
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 60) {
    return `vor ${diffMinutes} Minute${diffMinutes !== 1 ? 'n' : ''}`
  } else if (diffHours < 24) {
    return `vor ${diffHours} Stunde${diffHours !== 1 ? 'n' : ''}`
  } else if (diffDays < 7) {
    return `vor ${diffDays} Tag${diffDays !== 1 ? 'en' : ''}`
  }
  return 'vor über einer Woche'
}

export async function GET() {
  try {
    // Fetch recent completed orders (last 10)
    const orders = await wooClient.request<WooCommerceOrder[]>(
      '/orders?status=completed&per_page=10&orderby=date&order=desc'
    )

    if (!orders || orders.length === 0) {
      return NextResponse.json({ purchases: [] })
    }

    // Transform orders into social proof data
    const purchases: RecentPurchase[] = orders
      .filter(order =>
        order.billing.first_name &&
        order.line_items.length > 0
      )
      .map(order => {
        // Find the most expensive product in the order
        const mostExpensiveItem = order.line_items.reduce((prev, current) =>
          parseFloat(current.total) > parseFloat(prev.total) ? current : prev
        )

        return {
          firstName: order.billing.first_name,
          country: getCountryName(order.billing.country),
          productName: mostExpensiveItem.name,
          productImage: mostExpensiveItem.image?.src || null,
          quantity: mostExpensiveItem.quantity,
          timeAgo: getTimeAgo(order.date_created),
          timestamp: new Date(order.date_created).getTime(),
        }
      })
      .slice(0, 5) // Return max 5 most recent

    return NextResponse.json({ purchases })
  } catch (error) {
    console.error('Failed to fetch recent purchases:', error)
    // Return empty array instead of error to prevent UI breaking
    return NextResponse.json({ purchases: [] })
  }
}
