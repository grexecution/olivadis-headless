import { NextRequest, NextResponse } from 'next/server'
import { wooClient } from '@/lib/woocommerce/client'
import { WooCommerceAddress, WooCommerceOrder } from '@/types/woocommerce'

interface CheckoutRequestBody {
  billing: WooCommerceAddress
  shipping: WooCommerceAddress
  line_items: Array<{
    product_id: number
    variation_id?: number
    quantity: number
  }>
  payment_method?: string
  payment_method_title?: string
  customer_note?: string
  coupon_lines?: Array<{
    code: string
    discount?: string
  }>
}

/**
 * POST /api/checkout
 * Create a new WooCommerce order
 *
 * Request body:
 * {
 *   billing: WooCommerceAddress
 *   shipping: WooCommerceAddress
 *   line_items: Array<{ product_id: number, variation_id?: number, quantity: number }>
 *   payment_method?: string
 *   payment_method_title?: string
 *   customer_note?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequestBody = await request.json()

    // Validate required fields
    if (!body.billing || !body.shipping || !body.line_items || body.line_items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: billing, shipping, and line_items are required'
        },
        { status: 400 }
      )
    }

    // Validate line items
    for (const item of body.line_items) {
      if (!item.product_id || !item.quantity || item.quantity <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Each line item must have a valid product_id and quantity'
          },
          { status: 400 }
        )
      }
    }

    // Create order data for WooCommerce
    const orderData: any = {
      billing: body.billing,
      shipping: body.shipping,
      line_items: body.line_items,
      payment_method: body.payment_method || 'bacs',
      payment_method_title: body.payment_method_title || 'Direct Bank Transfer',
      customer_note: body.customer_note || '',
      set_paid: false, // Order needs to be paid
      status: 'pending' as const,
    }

    // Add coupon lines if provided
    if (body.coupon_lines && body.coupon_lines.length > 0) {
      orderData.coupon_lines = body.coupon_lines
    }

    // Create order via WooCommerce API
    const order = await wooClient.request<WooCommerceOrder>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })

    // Return success response with order details
    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_number: order.number,
      order_key: order.order_key,
      status: order.status,
      total: order.total,
      currency: order.currency,
      payment_url: order.id ? `${process.env.WP_BASE_URL}/checkout/order-pay/${order.id}/?key=${order.order_key}` : undefined,
      message: 'Order created successfully',
    })
  } catch (error) {
    console.error('Error creating order:', error)

    // Handle WooCommerce API errors
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create order',
          details: error.message
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred while creating the order'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/checkout
 * Retrieve order details by order ID
 *
 * Query params:
 * - order_id: number (required)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('order_id')

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'order_id is required' },
        { status: 400 }
      )
    }

    // Fetch order from WooCommerce
    const order = await wooClient.request<WooCommerceOrder>(`/orders/${orderId}`)

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        number: order.number,
        status: order.status,
        total: order.total,
        currency: order.currency,
        billing: order.billing,
        shipping: order.shipping,
        line_items: order.line_items,
        date_created: order.date_created,
      },
    })
  } catch (error) {
    console.error('Error fetching order:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch order',
          details: error.message
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
