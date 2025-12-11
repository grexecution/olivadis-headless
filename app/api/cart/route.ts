import { NextRequest, NextResponse } from 'next/server'

// In-memory cart storage (for demo purposes)
// In production, use a database or session storage
const carts = new Map<string, any[]>()

/**
 * GET /api/cart
 * Retrieve cart items for the current session
 */
export async function GET(request: NextRequest) {
  try {
    // Get session ID from cookies or create a new one
    const sessionId = request.cookies.get('session_id')?.value || 'default'

    const cartItems = carts.get(sessionId) || []

    return NextResponse.json({
      success: true,
      items: cartItems,
      total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/cart
 * Add item to cart
 *
 * Request body:
 * {
 *   productId: number
 *   name: string
 *   price: number
 *   quantity: number
 *   image?: string
 *   variationId?: number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, name, price, quantity = 1, image, variationId } = body

    // Validate required fields
    if (!productId || !name || !price) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get or create session ID
    const sessionId = request.cookies.get('session_id')?.value || 'default'

    // Get current cart
    const cartItems = carts.get(sessionId) || []

    // Create unique item ID
    const itemId = variationId ? `${productId}-${variationId}` : productId.toString()

    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === itemId)

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      cartItems[existingItemIndex].quantity += quantity
    } else {
      // Add new item to cart
      cartItems.push({
        id: itemId,
        productId,
        variationId,
        name,
        price,
        quantity,
        image,
        addedAt: new Date().toISOString(),
      })
    }

    // Save updated cart
    carts.set(sessionId, cartItems)

    return NextResponse.json({
      success: true,
      message: 'Item added to cart',
      items: cartItems,
      total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/cart
 * Remove item from cart or clear entire cart
 *
 * Query params:
 * - itemId: string (optional) - Remove specific item
 * - If no itemId provided, clears entire cart
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')

    const sessionId = request.cookies.get('session_id')?.value || 'default'

    if (itemId) {
      // Remove specific item
      const cartItems = carts.get(sessionId) || []
      const updatedItems = cartItems.filter(item => item.id !== itemId)
      carts.set(sessionId, updatedItems)

      return NextResponse.json({
        success: true,
        message: 'Item removed from cart',
        items: updatedItems,
      })
    } else {
      // Clear entire cart
      carts.delete(sessionId)

      return NextResponse.json({
        success: true,
        message: 'Cart cleared',
        items: [],
      })
    }
  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove item from cart' },
      { status: 500 }
    )
  }
}
