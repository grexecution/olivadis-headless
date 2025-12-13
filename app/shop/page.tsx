import { Suspense } from 'react'
import { getAllProducts, getCategories, Product, ProductCategory } from '@/lib/woocommerce/products'
import { ShopClient } from './shop-client'

// Force static generation at build time - ZERO API calls after deployment
export const dynamic = 'force-static'
export const revalidate = 3600

export default async function ShopPage() {
  let products: Product[] = []
  let categories: ProductCategory[] = []

  // Allowed category IDs in specific order
  const allowedCategoryIds = [31, 44, 49, 65, 74]

  try {
    // Fetch ALL data at build time - only happens once during build
    const allProducts = await getAllProducts()
    const allCategories = await getCategories()

    // Filter and sort categories by allowed IDs in specified order
    categories = allowedCategoryIds
      .map(id => allCategories.find(cat => cat.id === id))
      .filter((cat): cat is ProductCategory => cat !== undefined)

    // Filter products to only include those in allowed categories
    products = allProducts.filter(product =>
      product.categories.some(cat => allowedCategoryIds.includes(cat.id))
    )
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }

  // Pass filtered data to client component for instant filtering
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ShopClient products={products} categories={categories} />
    </Suspense>
  )
}
