import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getRecipes, getRecipeCategories, getDifficultyColor } from '@/lib/woocommerce/recipes'
import { Recipe, RecipeCategoryResponse } from '@/types/recipe'
import RecipeStoriesPreview from '@/components/stories/recipe-stories-preview'

export const metadata: Metadata = {
  title: 'Rezepte | Olivadis',
  description: 'Entdecken Sie köstliche Rezepte mit Olivadis Premium Olivenöl. Aufstriche, Salate, Dips und mehr.',
}

export default async function RezeptePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category: selectedCategory } = await searchParams
  let recipes: Recipe[] = []
  let categories: RecipeCategoryResponse[] = []

  try {
    // Fetch recipes and categories
    const [recipesResponse, categoriesResponse] = await Promise.all([
      getRecipes(selectedCategory ? { category: selectedCategory } : {}),
      getRecipeCategories(),
    ])
    recipes = recipesResponse.recipes
    categories = categoriesResponse
  } catch (error) {
    console.error('Failed to fetch recipes:', error)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background */}
      <section className="relative bg-primary text-cream py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=1600&q=80"
            alt="Mediterranean cooking"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          {/* Green Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary/85"></div>
        </div>

        <div className="container relative z-10">
          <h1 className="text-h1 mb-6 font-serif">Rezepte</h1>
          <p className="text-xl text-cream/90 max-w-2xl leading-relaxed">
            Entdecken Sie köstliche Rezepte mit Olivadis Premium Olivenöl.
            Von einfachen Aufstrichen bis zu raffinierten Hauptgerichten.
          </p>
        </div>
      </section>

      {/* Recipe Stories */}
      <RecipeStoriesPreview />

      {/* Categories Filter */}
      {categories.length > 0 && (
        <section className="bg-cream py-8 border-b border-primary/10">
          <div className="container">
            <div className="flex flex-wrap gap-3">
              {/* All Recipes Button */}
              <Link
                href="/rezepte"
                className={`px-6 py-2.5 rounded-full text-body-sm font-medium transition-all ${
                  !selectedCategory
                    ? 'bg-primary text-cream'
                    : 'bg-background text-primary hover:bg-primary hover:text-cream'
                }`}
              >
                Alle Rezepte ({recipes.length})
              </Link>

              {/* Category Buttons */}
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/rezepte?category=${category.slug}`}
                  className={`px-6 py-2.5 rounded-full text-body-sm font-medium transition-all ${
                    selectedCategory === category.slug
                      ? 'bg-primary text-cream'
                      : 'bg-background text-primary hover:bg-primary hover:text-cream'
                  }`}
                >
                  {category.name} ({category.count})
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recipes Grid */}
      <section className="py-16">
        <div className="container">
          {/* Recipe Count */}
          <div className="mb-8">
            <p className="text-body text-primary-dark">
              {recipes.length} {recipes.length === 1 ? 'Rezept' : 'Rezepte'}{' '}
              {selectedCategory && (
                <>
                  in{' '}
                  <span className="font-semibold">
                    {categories.find((c) => c.slug === selectedCategory)?.name}
                  </span>
                </>
              )}
            </p>
          </div>

          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-20">
              <div className="max-w-md mx-auto bg-cream p-8 rounded-lg">
                <h3 className="text-h3 text-primary mb-4">Keine Rezepte gefunden</h3>
                <p className="text-body text-primary-dark/70 mb-6">
                  {selectedCategory
                    ? 'In dieser Kategorie wurden keine Rezepte gefunden.'
                    : 'Rezepte werden hier angezeigt, sobald sie veröffentlicht werden.'}
                </p>
                {selectedCategory && (
                  <Link
                    href="/rezepte"
                    className="inline-block px-6 py-3 bg-primary text-cream rounded-full text-button hover:bg-primary-dark transition-colors"
                  >
                    Alle Rezepte anzeigen
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

/**
 * Recipe Card Component
 */
function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { slug, title, featured_image, prep_time, difficulty, servings, excerpt, categories, locked } = recipe
  const isLocked = locked === true

  return (
    <Link
      href={`/rezepte/${slug}`}
      className="group bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-all relative"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-cream overflow-hidden">
        {featured_image ? (
          <Image
            src={featured_image.src}
            alt={featured_image.alt || title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-cream">
            <svg
              className="w-16 h-16 text-primary/20"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/80 backdrop-blur-sm rounded-full p-4">
              <svg className="h-8 w-8 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Lock Badge */}
        {isLocked && (
          <div className="absolute top-3 left-3">
            <div className="bg-black/80 backdrop-blur-sm text-cream px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-xs font-semibold">Nur für Kunden</span>
            </div>
          </div>
        )}

        {/* Difficulty Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-body-sm font-medium ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.slice(0, 2).map((category) => (
              <span
                key={category.id}
                className="text-body-sm text-primary-light"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-h4 text-primary mb-3 group-hover:text-primary-light transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-body text-primary-dark/70 mb-4 line-clamp-2">
            {excerpt.replace(/<[^>]*>/g, '')}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 text-body-sm text-primary-dark/60">
          {/* Prep Time */}
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{prep_time}</span>
          </div>

          {/* Servings */}
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>{servings} {servings === 1 ? 'Portion' : 'Portionen'}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
