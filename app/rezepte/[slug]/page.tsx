import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  getRecipe,
  getAllRecipes,
  getDifficultyColor,
  formatNutritionalInfo,
  getVideoEmbedUrl,
  hasVideo,
} from '@/lib/woocommerce/recipes'
import { Recipe } from '@/types/recipe'

interface RecipePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  try {
    const recipes = await getAllRecipes()
    return recipes.map((recipe) => ({
      slug: recipe.slug,
    }))
  } catch (error) {
    console.error('Failed to generate static params for recipes:', error)
    return []
  }
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const recipe = await getRecipe(slug)
    return {
      title: `${recipe.title} | Rezepte | Olivadis`,
      description: recipe.excerpt || `${recipe.title} - Ein köstliches Rezept mit Olivadis Premium Olivenöl`,
      openGraph: {
        title: recipe.title,
        description: recipe.excerpt || undefined,
        images: recipe.featured_image ? [recipe.featured_image.src] : [],
      },
    }
  } catch (error) {
    return {
      title: 'Rezept nicht gefunden | Olivadis',
    }
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params
  let recipe: Recipe

  try {
    recipe = await getRecipe(slug)
  } catch (error) {
    console.error('Failed to fetch recipe:', error)
    notFound()
  }

  const videoEmbedUrl = recipe.video_url ? getVideoEmbedUrl(recipe.video_url) : null
  const nutritionalInfoFormatted = formatNutritionalInfo(recipe.nutritional_info)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image Section */}
      {recipe.featured_image && (
        <section className="relative h-[60vh] min-h-[400px] bg-cream">
          <Image
            src={recipe.featured_image.src}
            alt={recipe.featured_image.alt || recipe.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />

          {/* Breadcrumb */}
          <div className="absolute top-8 left-0 right-0">
            <div className="container">
              <div className="flex items-center gap-2 text-body-sm text-cream">
                <Link href="/" className="hover:underline">
                  Home
                </Link>
                <span>/</span>
                <Link href="/rezepte" className="hover:underline">
                  Rezepte
                </Link>
                <span>/</span>
                <span className="font-medium">{recipe.title}</span>
              </div>
            </div>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 pb-12">
            <div className="container">
              <h1 className="text-h1 text-cream mb-4">{recipe.title}</h1>
              {recipe.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {recipe.categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/rezepte?category=${category.slug}`}
                      className="px-4 py-2 bg-cream/20 backdrop-blur-sm text-cream rounded-full text-body-sm hover:bg-cream/30 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Recipe Content */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content - 2/3 width */}
            <div className="lg:col-span-2">
              {/* Recipe Meta */}
              <div className="bg-cream rounded-lg p-8 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Prep Time */}
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-body-sm text-primary-dark/60 mb-1">Zubereitungszeit</p>
                    <p className="text-body-lg font-semibold text-primary">{recipe.prep_time}</p>
                  </div>

                  {/* Difficulty */}
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-body-sm text-primary-dark/60 mb-1">Schwierigkeit</p>
                    <p className="text-body-lg font-semibold">
                      <span className={`px-3 py-1 rounded-full text-body-sm ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </span>
                    </p>
                  </div>

                  {/* Servings */}
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-body-sm text-primary-dark/60 mb-1">Portionen</p>
                    <p className="text-body-lg font-semibold text-primary">{recipe.servings}</p>
                  </div>
                </div>
              </div>

              {/* Locked Content Notice */}
              {recipe.locked && (
                <div className="bg-primary/5 border-2 border-primary rounded-lg p-8 mb-12">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-h3 text-primary mb-3">Dieses Rezept ist nur für Kunden verfügbar</h3>
                    <p className="text-body text-primary-dark/70 mb-6 max-w-lg">
                      Um Zugriff auf alle Zutaten, Zubereitungsschritte und exklusive Tipps zu erhalten,
                      melden Sie sich bitte an oder werden Sie Kunde von Olivadis.
                    </p>
                    <div className="flex gap-4">
                      <Link
                        href="/shop"
                        className="px-6 py-3 bg-primary text-cream rounded-full text-button hover:bg-primary-dark transition-colors"
                      >
                        Zum Shop
                      </Link>
                      <Link
                        href="/rezepte"
                        className="px-6 py-3 bg-background text-primary border-2 border-primary rounded-full text-button hover:bg-primary hover:text-cream transition-colors"
                      >
                        Alle Rezepte
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              {recipe.content && !recipe.locked && (
                <div className="prose prose-lg max-w-none mb-12">
                  <div
                    className="text-body text-primary-dark"
                    dangerouslySetInnerHTML={{ __html: recipe.content }}
                  />
                </div>
              )}

              {/* Ingredients */}
              {!recipe.locked && (
              <div className="mb-12">
                <h2 className="text-h2 text-primary mb-6">Zutaten</h2>
                <div className="bg-white rounded-lg p-8 shadow">
                  <ul className="space-y-4">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-primary-light flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-body text-primary-dark">
                          {ingredient.amount && (
                            <strong className="font-semibold">{ingredient.amount}</strong>
                          )}{' '}
                          {ingredient.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              )}

              {/* Instructions */}
              {!recipe.locked && (
              <div className="mb-12">
                <h2 className="text-h2 text-primary mb-6">Zubereitung</h2>
                <div className="space-y-6">
                  {recipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary text-cream flex items-center justify-center text-h4 font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 pt-2">
                        <p className="text-body text-primary-dark leading-relaxed">
                          {instruction.step}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* Cook's Note */}
              {!recipe.locked && recipe.cooks_note && (
                <div className="bg-primary-light/10 border-l-4 border-primary-light rounded-r-lg p-6 mb-12">
                  <div className="flex gap-4">
                    <svg className="w-6 h-6 text-primary-light flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-h4 text-primary mb-2">Koch-Tipp</h3>
                      <p className="text-body text-primary-dark">{recipe.cooks_note}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Video */}
              {!recipe.locked && videoEmbedUrl && (
                <div className="mb-12">
                  <h2 className="text-h2 text-primary mb-6">Video</h2>
                  <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      src={videoEmbedUrl}
                      title={`${recipe.title} Video`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="lg:col-span-1">
              {/* Nutritional Info */}
              {nutritionalInfoFormatted.length > 0 && (
                <div className="bg-cream rounded-lg p-6 mb-8 sticky top-8">
                  <h3 className="text-h3 text-primary mb-4">Nährwerte pro Portion</h3>
                  <ul className="space-y-3">
                    {nutritionalInfoFormatted.map((info, index) => (
                      <li key={index} className="flex items-center justify-between text-body text-primary-dark border-b border-primary/10 pb-2">
                        <span>{info.split(' ')[1]}</span>
                        <span className="font-semibold">{info.split(' ')[0]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Share/Print Actions */}
              <div className="bg-white rounded-lg p-6 shadow">
                <h3 className="text-h4 text-primary mb-4">Rezept teilen</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => window.print()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-cream rounded-lg text-button hover:bg-primary-dark transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Rezept drucken
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Recipes */}
      <section className="py-8 bg-cream">
        <div className="container">
          <Link
            href="/rezepte"
            className="inline-flex items-center gap-2 text-body text-primary hover:text-primary-light transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Zurück zu allen Rezepten
          </Link>
        </div>
      </section>
    </div>
  )
}
