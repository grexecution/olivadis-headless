import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Revalidation API Route
 *
 * Triggered by WordPress webhooks when content changes
 *
 * POST /api/revalidate
 *
 * Headers:
 * - X-Revalidation-Secret: Secret key for authentication
 *
 * Body:
 * {
 *   type: 'recipe' | 'product' | 'recipe_category' | 'product_category' | 'full',
 *   action: 'created' | 'updated' | 'deleted' | 'trashed' | 'changed' | 'revalidate',
 *   data: { id, slug, ... }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify secret key
    const secret = request.headers.get('X-Revalidation-Secret')
    const expectedSecret = process.env.REVALIDATION_SECRET

    if (!expectedSecret) {
      console.error('REVALIDATION_SECRET not configured')
      return NextResponse.json(
        { success: false, error: 'Revalidation not configured' },
        { status: 500 }
      )
    }

    if (secret !== expectedSecret) {
      console.error('Invalid revalidation secret')
      return NextResponse.json(
        { success: false, error: 'Invalid secret' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { type, action, data } = body

    console.log(`Revalidation triggered: ${type} - ${action}`, data)

    // Handle full site revalidation
    if (type === 'full' && action === 'revalidate') {
      await revalidatePath('/', 'layout')
      return NextResponse.json({
        success: true,
        message: 'Full site revalidated',
        revalidated: ['Full site'],
      })
    }

    const revalidated: string[] = []

    // Handle recipe revalidation
    if (type === 'recipe') {
      if (action === 'created' || action === 'updated') {
        // Revalidate recipe listing page
        await revalidatePath('/rezepte')
        revalidated.push('/rezepte')

        // Revalidate single recipe page if slug exists
        if (data.slug) {
          await revalidatePath(`/rezepte/${data.slug}`)
          revalidated.push(`/rezepte/${data.slug}`)
        }

        // Revalidate homepage (if recipes are featured there)
        await revalidatePath('/')
        revalidated.push('/')
      } else if (action === 'deleted' || action === 'trashed') {
        // Revalidate recipe listing page
        await revalidatePath('/rezepte')
        revalidated.push('/rezepte')

        // Revalidate single recipe page to show 404
        if (data.slug) {
          await revalidatePath(`/rezepte/${data.slug}`)
          revalidated.push(`/rezepte/${data.slug}`)
        }

        // Revalidate homepage
        await revalidatePath('/')
        revalidated.push('/')
      }
    }

    // Handle recipe category revalidation
    if (type === 'recipe_category') {
      // Revalidate all recipe pages when categories change
      await revalidatePath('/rezepte')
      revalidated.push('/rezepte')

      // Revalidate homepage
      await revalidatePath('/')
      revalidated.push('/')
    }

    // Handle product revalidation
    if (type === 'product') {
      if (action === 'created' || action === 'updated' || action === 'stock_changed' || action === 'variation_changed') {
        // Revalidate shop page
        await revalidatePath('/shop')
        revalidated.push('/shop')

        // Revalidate single product page if slug exists
        if (data.slug) {
          await revalidatePath(`/product/${data.slug}`)
          revalidated.push(`/product/${data.slug}`)
        }

        // Revalidate homepage (if products are featured there)
        await revalidatePath('/')
        revalidated.push('/')
      } else if (action === 'deleted' || action === 'trashed') {
        // Revalidate shop page
        await revalidatePath('/shop')
        revalidated.push('/shop')

        // Revalidate single product page to show 404
        if (data.slug) {
          await revalidatePath(`/product/${data.slug}`)
          revalidated.push(`/product/${data.slug}`)
        }

        // Revalidate homepage
        await revalidatePath('/')
        revalidated.push('/')
      }
    }

    // Handle product category revalidation
    if (type === 'product_category') {
      // Revalidate all product pages when categories change
      await revalidatePath('/shop')
      revalidated.push('/shop')

      // Revalidate homepage
      await revalidatePath('/')
      revalidated.push('/')
    }

    console.log('Revalidated paths:', revalidated)

    return NextResponse.json({
      success: true,
      message: `Revalidated ${revalidated.length} path(s)`,
      revalidated,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET request for testing/debugging
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Revalidation endpoint is active',
    note: 'Use POST request with X-Revalidation-Secret header',
  })
}
