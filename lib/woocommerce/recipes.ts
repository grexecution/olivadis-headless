/**
 * Recipe API Functions
 * Handles all interactions with the WordPress Recipe REST API
 */

import { Recipe, RecipesResponse, RecipeCategoryResponse } from '@/types/recipe'

const WP_URL = process.env.WP_BASE_URL || process.env.NEXT_PUBLIC_WOO_API_URL?.replace('/wp-json/wc/v3', '') || 'https://olivadis.com'
const RECIPE_API_BASE = `${WP_URL}/wp-json/olivadis/v1`

interface RecipeRequestOptions {
  endpoint: string
  params?: Record<string, string | number | boolean>
  cache?: RequestCache
  revalidate?: number
}

/**
 * Make request to Recipe REST API
 */
async function recipeRequest<T>(options: RecipeRequestOptions): Promise<T> {
  const { endpoint, params = {}, cache = 'force-cache', revalidate = 60 } = options

  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, String(value))
  })

  const url = `${RECIPE_API_BASE}${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache,
      next: { revalidate },
    })

    if (!response.ok) {
      throw new Error(`Recipe API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error('Recipe API request failed:', error)
    throw error
  }
}

/**
 * Get all recipes with pagination and filtering
 */
export async function getRecipes(params: {
  per_page?: number
  page?: number
  category?: string
} = {}): Promise<RecipesResponse> {
  return recipeRequest<RecipesResponse>({
    endpoint: '/recipes',
    params: {
      per_page: 100,
      ...params,
    },
  })
}

/**
 * Get single recipe by slug
 */
export async function getRecipe(slug: string): Promise<Recipe> {
  return recipeRequest<Recipe>({
    endpoint: `/recipes/${slug}`,
  })
}

/**
 * Get recipe categories
 */
export async function getRecipeCategories(): Promise<RecipeCategoryResponse[]> {
  return recipeRequest<RecipeCategoryResponse[]>({
    endpoint: '/recipe-categories',
  })
}

/**
 * Get recipes by category
 */
export async function getRecipesByCategory(categorySlug: string): Promise<RecipesResponse> {
  return getRecipes({ category: categorySlug })
}

/**
 * Get all recipes (convenience function)
 */
export async function getAllRecipes(): Promise<Recipe[]> {
  const response = await getRecipes({ per_page: 100 })
  return response.recipes
}

/**
 * Get featured recipes (first N recipes)
 */
export async function getFeaturedRecipes(limit: number = 3): Promise<Recipe[]> {
  const response = await getRecipes({ per_page: limit })
  return response.recipes
}

/**
 * Search recipes by title
 * Note: This is a client-side filter. For better performance,
 * you may want to add a search endpoint to the WordPress plugin
 */
export async function searchRecipes(searchTerm: string): Promise<Recipe[]> {
  const allRecipes = await getAllRecipes()
  const searchLower = searchTerm.toLowerCase()

  return allRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchLower) ||
    recipe.excerpt.toLowerCase().includes(searchLower)
  )
}

/**
 * Get difficulty level display text
 */
export function getDifficultyText(difficulty: string): string {
  const difficultyMap: Record<string, string> = {
    'Sehr leicht': 'Sehr leicht',
    'Leicht': 'Leicht',
    'Mittel': 'Mittel',
    'Schwer': 'Schwer',
  }
  return difficultyMap[difficulty] || difficulty
}

/**
 * Get difficulty level color (for badges/chips)
 */
export function getDifficultyColor(difficulty: string): string {
  const colorMap: Record<string, string> = {
    'Sehr leicht': 'bg-green-100 text-green-800',
    'Leicht': 'bg-blue-100 text-blue-800',
    'Mittel': 'bg-yellow-100 text-yellow-800',
    'Schwer': 'bg-red-100 text-red-800',
  }
  return colorMap[difficulty] || 'bg-gray-100 text-gray-800'
}

/**
 * Format prep time display
 */
export function formatPrepTime(prepTime: string): string {
  // Already formatted in German from WordPress
  return prepTime
}

/**
 * Format servings display
 */
export function formatServings(servings: number): string {
  return `${servings} ${servings === 1 ? 'Portion' : 'Portionen'}`
}

/**
 * Check if recipe has video
 */
export function hasVideo(recipe: Recipe): boolean {
  return !!recipe.video_url && recipe.video_url.length > 0
}

/**
 * Get video embed URL (YouTube/Vimeo)
 */
export function getVideoEmbedUrl(videoUrl: string): string | null {
  if (!videoUrl) return null

  // YouTube
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const youtubeMatch = videoUrl.match(youtubeRegex)
  if (youtubeMatch && youtubeMatch[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }

  // Vimeo
  const vimeoRegex = /(?:vimeo\.com\/)([0-9]+)/
  const vimeoMatch = videoUrl.match(vimeoRegex)
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?dnt=1`
  }

  return null
}

/**
 * Format nutritional info for display
 */
export function formatNutritionalInfo(nutritionalInfo: Recipe['nutritional_info']): string[] {
  if (!nutritionalInfo) return []

  const formatted: string[] = []

  if (nutritionalInfo.calories) {
    formatted.push(`${nutritionalInfo.calories} kcal`)
  }
  if (nutritionalInfo.protein) {
    formatted.push(`${nutritionalInfo.protein}g Eiweiß`)
  }
  if (nutritionalInfo.carbs) {
    formatted.push(`${nutritionalInfo.carbs}g Kohlenhydrate`)
  }
  if (nutritionalInfo.fat) {
    formatted.push(`${nutritionalInfo.fat}g Fett`)
  }
  if (nutritionalInfo.fiber) {
    formatted.push(`${nutritionalInfo.fiber}g Ballaststoffe`)
  }

  return formatted
}
