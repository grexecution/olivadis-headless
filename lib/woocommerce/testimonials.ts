/**
 * Wall of Love / Testimonials API functions
 */

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_BASE_URL || 'https://olivadis.com'

export interface Testimonial {
  id: number
  date: string
  featured_media: number
  featured_image_url?: string
  slug: string
}

interface WPMediaResponse {
  id: number
  source_url: string
  media_details: {
    width: number
    height: number
  }
}

/**
 * Fetch testimonials (wall of love posts)
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await fetch(`${WP_BASE_URL}/wp-json/wp/v2/wall_of_love?per_page=20&_embed`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      console.error('Failed to fetch testimonials:', response.status)
      return []
    }

    const posts = await response.json()

    // Map posts and extract featured images from _embedded
    const testimonials: Testimonial[] = posts
      .filter((post: any) => post.featured_media > 0)
      .map((post: any) => ({
        id: post.id,
        date: post.date,
        featured_media: post.featured_media,
        featured_image_url: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
        slug: post.slug
      }))
      .filter((t: Testimonial) => t.featured_image_url) // Only include posts with images

    return testimonials
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }
}
