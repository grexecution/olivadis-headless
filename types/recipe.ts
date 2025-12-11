/**
 * Recipe Type Definitions
 */

export interface RecipeImage {
  id: number
  src: string
  width: number
  height: number
  alt: string
}

export interface RecipeCategory {
  id: number
  name: string
  slug: string
}

export interface RecipeIngredient {
  amount?: string
  name: string
}

export interface RecipeInstruction {
  step: string
}

export interface NutritionalInfo {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
}

export type DifficultyLevel = 'Sehr leicht' | 'Leicht' | 'Mittel' | 'Schwer'

export interface Recipe {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  date: string
  modified: string
  featured_image: RecipeImage | null
  categories: RecipeCategory[]
  prep_time: string
  difficulty: DifficultyLevel
  servings: number
  ingredients: RecipeIngredient[]
  instructions: RecipeInstruction[]
  cooks_note?: string
  nutritional_info?: NutritionalInfo
  video_url?: string
  locked?: boolean
}

export interface RecipesResponse {
  recipes: Recipe[]
  total: number
  pages: number
}

export interface RecipeCategoryResponse {
  id: number
  name: string
  slug: string
  count: number
}
