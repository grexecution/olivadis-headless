import { Suspense } from 'react'
import { getAllProducts, getCategories, Product, ProductCategory } from '@/lib/woocommerce/products'
import { ShopClient } from './shop-client'

// Force static generation at build time - ZERO API calls after deployment
export const dynamic = 'force-static'
export const revalidate = 3600

export default async function ShopPage() {
  let products: Product[] = []
  let categories: ProductCategory[] = []

  try {
    // Fetch ALL data at build time - only happens once during build
    products = await getAllProducts()
    categories = await getCategories()
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }

  // Pass all data to client component for instant filtering
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ShopClient products={products} categories={categories} />
    </Suspense>
  )
}
