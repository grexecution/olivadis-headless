# Recipe Stories - User Guide

Instagram-style recipe story previews at the top of the `/rezepte` page.

## Overview

Recipe stories appear as circular previews with gradient borders (like Instagram). Each recipe can have multiple story frames (images/videos). When clicked, they open in a fullscreen viewer with a "Rezept öffnen" button that links to the full recipe page.

## File Structure

```
/public/recipe-stories/     ← Store all recipe story media here
  └── feta-preview.jpg      ← Preview image (square, 1:1 ratio)
  └── feta-story-1.mp4      ← Story video
  └── feta-story-2.jpg      ← Story image

/components/stories/
  ├── recipe-stories-config.ts      ← Add your stories here
  ├── recipe-stories-preview.tsx    ← Preview component (don't edit)
  └── recipe-stories-viewer.tsx     ← Viewer component (don't edit)
```

## How to Add a Recipe Story

### Step 1: Prepare Your Media Files

1. **Preview Image** (required):
   - Square ratio (1:1) recommended
   - Example: 500x500px or 1000x1000px
   - Use high-quality image of the finished dish
   - Name it clearly: `recipe-name-preview.jpg`

2. **Story Frames** (1 or more):
   - **Images**: JPG or PNG, vertical format (9:16) works best
   - **Videos**: MP4, H.264 codec, vertical format (1080x1920) recommended
   - Keep videos under 15 seconds for best UX
   - Name them clearly: `recipe-name-story-1.mp4`, `recipe-name-story-2.jpg`

### Step 2: Upload Media

1. Upload all files to `/public/recipe-stories/`
2. Files are auto-served at `/recipe-stories/filename.ext`

### Step 3: Add to Configuration

Open `components/stories/recipe-stories-config.ts` and add your entry:

```typescript
export const RECIPE_STORIES: RecipeStory[] = [
  {
    id: 'feta-aufstrich',                          // Unique ID (use recipe slug)
    recipeSlug: 'griechischer-feta-aufstrich',     // Recipe URL slug
    recipeName: 'Feta Aufstrich',                  // Display name (short)
    previewImage: '/recipe-stories/feta-preview.jpg', // Preview circle image
    stories: [
      {
        type: 'video',                             // 'image' or 'video'
        media: '/recipe-stories/feta-story-1.mp4', // File path
        caption: 'Cremiger griechischer Feta Aufstrich\n\nPerfekt zu frischem Brot!', // Optional
        duration: 5000                             // Only for images (ms)
      },
      {
        type: 'image',
        media: '/recipe-stories/feta-story-2.jpg',
        caption: 'Fertig in nur 10 Minuten!',
        duration: 5000                             // 5 seconds
      }
    ]
  },
  // Add more recipe stories here...
];
```

## Configuration Options

### RecipeStory Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (use recipe slug) |
| `recipeSlug` | string | Yes | Recipe URL slug (e.g., `griechischer-feta-aufstrich`) |
| `recipeName` | string | Yes | Display name under preview circle |
| `previewImage` | string | Yes | Path to preview image |
| `stories` | array | Yes | Array of story frames (1 or more) |

### Story Frame Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | 'image' or 'video' | Yes | Media type |
| `media` | string | Yes | Path to media file |
| `caption` | string | No | Text overlay at bottom of story |
| `duration` | number | For images | Display time in milliseconds (default: 5000) |

## Tips & Best Practices

### Preview Images
- **Square ratio** (1:1) looks best in circles
- **High contrast** - use bright, colorful dish photos
- **Close-up shots** work better than wide angles
- **600x600px** minimum, 1000x1000px recommended

### Story Content
- **Mix media types** - combine images and videos for variety
- **Keep it short** - 3-5 story frames per recipe is ideal
- **Show process** - ingredient prep, cooking steps, final result
- **Add captions** - explain what's happening or add tips

### Captions
- Use `\n` for line breaks: `'Line 1\n\nLine 2'`
- Keep text short and readable
- Emoji work great: 🫒 🔥 ✨ 🍴
- Bottom of screen has "Rezept öffnen" button - leave space

### Video Guidelines
- **Format**: MP4 with H.264 codec
- **Aspect ratio**: 9:16 (vertical) recommended, 1:1 or 16:9 also work
- **Resolution**: 1080x1920 for vertical, 1080x1080 for square
- **Duration**: 5-15 seconds per video
- **File size**: Keep under 5MB for fast loading
- **Sound**: Videos are muted (visual content only)

### Performance
- **Compress images** - use tools like TinyPNG or Squoosh
- **Optimize videos** - use Handbrake or similar (H.264, CRF 23)
- **Lazy loading** - stories only load when user clicks
- **Preloading** - next story preloads automatically

## Examples

### Single-Frame Image Story

```typescript
{
  id: 'greek-salad',
  recipeSlug: 'griechischer-salat',
  recipeName: 'Griechischer Salat',
  previewImage: '/recipe-stories/salad-preview.jpg',
  stories: [
    {
      type: 'image',
      media: '/recipe-stories/salad-final.jpg',
      caption: 'Frisch, knackig, gesund! 🥗',
      duration: 6000
    }
  ]
}
```

### Multi-Frame Video + Image Story

```typescript
{
  id: 'olive-tapenade',
  recipeSlug: 'schwarze-oliventapenade',
  recipeName: 'Oliventapenade',
  previewImage: '/recipe-stories/tapenade-preview.jpg',
  stories: [
    {
      type: 'video',
      media: '/recipe-stories/tapenade-prep.mp4',
      caption: 'Oliven grob hacken 🔪',
      duration: 5000 // Ignored for videos
    },
    {
      type: 'video',
      media: '/recipe-stories/tapenade-blend.mp4',
      caption: 'Im Mixer pürieren ⚡',
      duration: 5000
    },
    {
      type: 'image',
      media: '/recipe-stories/tapenade-serve.jpg',
      caption: 'Mit Brot servieren 🍞\n\nPerfekter Snack!',
      duration: 7000
    }
  ]
}
```

## Troubleshooting

**Stories don't appear on page:**
- Check that `RECIPE_STORIES` array is not empty
- Component only renders if array has at least 1 entry

**Image doesn't load:**
- Verify file is in `/public/recipe-stories/` folder
- Check path starts with `/recipe-stories/` (not `public/recipe-stories/`)
- Check file extension matches (`.jpg` vs `.jpeg`)

**Video doesn't play:**
- Ensure MP4 with H.264 codec
- Try re-encoding with Handbrake (Web optimized preset)
- Check file size (large files may timeout)

**Preview circle looks stretched:**
- Use square (1:1) images for previews
- Crop image before uploading

**Caption not showing line breaks:**
- Use `\n` in caption text: `'Line 1\n\nLine 2'`
- Don't use `<br>` tags (they won't render)

**"Rezept öffnen" button goes to 404:**
- Check `recipeSlug` matches exact recipe URL
- Recipe must exist at `/rezepte/{slug}`

## Questions?

This component reuses the same architecture as the main Instagram stories feature. For technical details, see `components/stories/README.md`.
