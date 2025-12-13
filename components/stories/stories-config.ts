/**
 * INSTAGRAM STORIES CONFIGURATION
 *
 * Easy-to-edit configuration for your Instagram-style stories.
 * Simply add or remove items from the STORIES array below.
 *
 * How to add a new story:
 * 1. Add your image/video to /public/insta/ folder
 * 2. Add a new object to the STORIES array with:
 *    - id: Unique number
 *    - type: 'image' or 'video'
 *    - media: '/insta/your-filename.jpg' (or .mp4)
 *    - caption: Your story text
 *    - duration: How long to show (in milliseconds)
 *
 * Example:
 * {
 *   id: 4,
 *   type: 'image',
 *   media: '/insta/harvest-2024.jpg',
 *   caption: 'Neue Ernte 2024! Jetzt verfügbar im Shop',
 *   duration: 5000
 * }
 */

export interface Story {
  id: number
  type: 'image' | 'video'
  media: string      // Path to image/video in /public/insta/
  caption: string    // Story caption text
  duration: number   // Display duration in milliseconds
}

/**
 * YOUR STORIES - Edit this array to manage your stories
 * Stories will appear in the order listed below
 */
export const STORIES: Story[] = [
  {
    id: 1,
    type: 'image',
    media: '/insta/story-1.jpg',
    caption: 'Frische Ernte direkt aus Pteleos 🫒',
    duration: 4000
  },
  {
    id: 2,
    type: 'video',
    media: '/insta/story-2.mp4',
    caption: 'Vom Baum zur Flasche - unser Produktionsprozess',
    duration: 10000
  },
  {
    id: 3,
    type: 'image',
    media: '/insta/story-3.mp4',
    caption: 'Premium Bio-Olivenöl - limitierte Ernte 2024 🌿',
    duration: 5000
  },
  {
    id: 4,
    type: 'image',
    media: '/insta/story-4.jpg',
    caption: 'Your caption here',
    duration: 4000
    },
  // Add more stories here...
  // {
  //   id: 4,
  //   type: 'image',
  //   media: '/insta/story-4.jpg',
  //   caption: 'Your caption here',
  //   duration: 5000
  // },
]

/**
 * PROFILE VIDEO CONFIGURATION
 * This is the looping video shown in the sticky profile button
 */
export const PROFILE_VIDEO = '/insta_thumbnail.mp4'

/**
 * PROFILE IMAGE FALLBACK
 * Used as poster/fallback if video doesn't load
 */
export const PROFILE_IMAGE = '/placeholder-stories.jpg'
