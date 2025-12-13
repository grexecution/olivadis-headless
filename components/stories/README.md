# Instagram Stories Management

## Quick Start

**To add/edit/remove stories, edit this file:**
`components/stories/stories-config.ts`

Everything is centralized in one place for easy management!

## How to Add a New Story

### Step 1: Add Your Media File
Place your image or video in `/public/insta/` folder:
- Images: `.jpg`, `.png`, `.webp`
- Videos: `.mp4`, `.webm`
- Recommended size: 1080×1920 (9:16 aspect ratio for best Instagram look)

### Step 2: Edit the Config
Open `stories-config.ts` and add a new story to the `STORIES` array:

```typescript
{
  id: 4,                                    // Unique number
  type: 'image',                            // 'image' or 'video'
  media: '/insta/your-file.jpg',           // Path to your media file
  caption: 'Your caption text here 🫒',    // Story caption (supports emojis!)
  duration: 5000                            // Display time in milliseconds (5000 = 5 seconds)
}
```

### Step 3: That's it!
The story count badge updates automatically, and your new story appears in the viewer.

## Configuration Options

### Story Types
- **`image`**: Static image (JPG, PNG, WebP)
- **`video`**: Video file (MP4, WebM) - auto-loops

### Duration Guide
- Images: `5000` (5 seconds) is standard
- Videos: Match video length, e.g. `10000` (10 seconds)
- Text-heavy captions: Add 1-2 extra seconds for readability

### Caption Tips
- Keep it short and punchy (Instagram style!)
- Emojis work great: 🫒 🌿 ✨ 🇬🇷
- Max ~100 characters for best readability
- Captions show at the bottom with a gradient overlay

## Profile Video

To change the sticky button profile video:
1. Add your video to `/public/` (e.g. `insta_thumbnail.mp4`)
2. Update `PROFILE_VIDEO` in `stories-config.ts`

The profile video auto-plays in a loop like Instagram!

## Example Stories

```typescript
export const STORIES: Story[] = [
  // Image story
  {
    id: 1,
    type: 'image',
    media: '/insta/harvest-2024.jpg',
    caption: 'Frische Ernte 2024! Jetzt im Shop 🫒',
    duration: 5000
  },

  // Video story
  {
    id: 2,
    type: 'video',
    media: '/insta/production-process.mp4',
    caption: 'Vom Baum zur Flasche 🌿',
    duration: 10000
  },

  // Product announcement
  {
    id: 3,
    type: 'image',
    media: '/insta/new-product.jpg',
    caption: 'Neu: Premium Bio-Olivenöl limitierte Edition ✨',
    duration: 6000
  }
]
```

## Removing Stories

Simply delete the story object from the array in `stories-config.ts`. The badge count updates automatically!

## File Structure

```
components/stories/
├── stories-config.ts       ← EDIT THIS FILE to manage stories
├── stories-button.tsx      (don't edit - auto-reads config)
├── stories-viewer.tsx      (don't edit - auto-reads config)
└── README.md               (you are here!)

public/
├── insta/                  ← ADD YOUR STORY MEDIA HERE
│   ├── story-1.jpg
│   ├── story-2.mp4
│   └── story-3.jpg
└── insta_thumbnail.mp4     ← Profile video for the sticky button
```

## Need Help?

- Stories not showing? Check file paths in `media:` field
- Badge count wrong? It auto-counts from the `STORIES` array length
- Video not playing? Make sure it's `.mp4` format
- Caption not showing? Check the `caption:` field has text

That's all you need! Happy storytelling! 📱✨
