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
    caption: 'Endlich ist es so weit: unser erstes Early Harvest Olivenöl “Olivadis jung & wild” ist jetzt für euch verfügbar! Alle Bestandskunden haben bereits Zugriff auf die Bestellseite, im Anschluss daran könnt ihr auch über unseren Onlineshop bestellen 😍🇬🇷🌳☀️',
    duration: 4000
  },
  {
    id: 2,
    type: 'video',
    media: '/insta/story-2.mp4',
    caption: 'Was ist der Unterschied zum Olivadis Olivenöl in der weißen Flasche?\n' +
        '\n' +
        'Olivadis jung & wild ist eine limitierte Editionunseres Olivenöls, für das wir einige unserer Oliven früher als üblich geerntet haben. In den jungen, grünen Oliven stecken besonders viele gesunde Polyphenole und intensive Naturaromen. Deshalb eignet sich dieses besondere Olivenöl für allem für Salate, zum Verfeinern Deiner Gerichte oder zum Beträufeln von ofenfrischem Brot. Wir können Dir unser Olivadis jung & wild wirklich von Herzen empfehlen - diesen puren Geschmack einmal zu erleben solltest Du Dir nicht entgehen lassen ❤️',
    duration: 10000
  },
  {
    id: 3,
    type: 'video',
    media: '/insta/story-3.mp4',
    caption: '✨ Weihnachts-Aperitif mit Stil.\n' +
        'Warmer Camembert, dazu perfekt passender Prosciutto, knusprige Pistazien und ein Schuss fruchtiges Olivenöl, das sofort Weihnachtsstimmung verbreitet.\n' +
        'Eine einfache, aber unwiderstehliche Mischung – ideal, um jedes Weihnachtsessen einzuläuten. 🎄🥂',
    duration: 10000
  },
  {
    id: 4,
    type: 'image',
    media: '/insta/story-4.jpg',
    caption: 'Das perfekt Weihnachtsgeschenk 🎁🎄 Unser frisch gepresstes Early Harvest Olivenöl ist nicht nur geschmacklich ein echter Traum - es kommt in einer hochwertigen Premiumverpackung und macht sich wunderschön als Geschenk unter dem Christbaum. Ihr verschenkt damit echte Qualität und das schönste daran: die Freude darüber ist bei jedem Verwenden unseres Olivenöls spürbar 🥰🎄🎁 Unsere treue Kundin Lisa hat sich heuer ebenfalls dafür entschieden unser Olivenöl zu verschenken und mit Hilfe kleiner Ergänzungen ein wunderschönes Geschenk gezaubert 🎁🤩🎄',
    duration: 5000
  },
  // Add more stories here...
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
