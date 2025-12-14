/**
 * Recipe Stories Configuration
 *
 * Add recipe story previews here. Each recipe can have one or more story frames.
 * Stories will appear at the top of the /rezepte page.
 *
 * File structure:
 * - Add story images/videos to /public/recipe-stories/
 * - Preview images should be square (1:1 ratio) for best results
 *
 * How to add a new recipe story:
 * 1. Add media files to /public/recipe-stories/
 * 2. Add entry to RECIPE_STORIES array below
 * 3. Story will auto-appear on rezepte page
 */

export interface RecipeStory {
  id: string;
  recipeSlug: string; // URL slug to link to recipe (e.g., "griechischer-feta-aufstrich")
  recipeName: string; // Display name (e.g., "Griechischer Feta Aufstrich")
  previewImage: string; // Square preview image for the story circle
  stories: {
    type: 'image' | 'video';
    media: string; // Path to image or video file
    caption?: string; // Optional caption overlay
    duration?: number; // Duration in ms for images (videos use actual duration)
  }[];
}

/**
 * Recipe Stories Array
 *
 * Each recipe story appears as a circle at the top of /rezepte page.
 * Click to view story, then click "Rezept öffnen" to see full recipe.
 */
export const RECIPE_STORIES: RecipeStory[] = [
  {
    id: 'greek-salad',
    recipeSlug: 'griechischer-feta-aufstrich',
    recipeName: 'Griechischer Salat',
    previewImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop',
    stories: [
      {
        type: 'image',
        media: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1080&h=1920&fit=crop',
        caption: 'Frischer griechischer Salat\n\nMit Olivenöl und Feta 🥗',
        duration: 5000
      }
    ]
  },
  {
    id: 'bruschetta',
    recipeSlug: 'griechischer-feta-aufstrich',
    recipeName: 'Bruschetta',
    previewImage: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=400&fit=crop',
    stories: [
      {
        type: 'image',
        media: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=1080&h=1920&fit=crop',
        caption: 'Knuspriges Bruschetta\n\nPerfekt als Vorspeise! 🍞',
        duration: 5000
      }
    ]
  },
  {
    id: 'pasta',
    recipeSlug: 'griechischer-feta-aufstrich',
    recipeName: 'Pasta mit Olivenöl',
    previewImage: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop',
    stories: [
      {
        type: 'image',
        media: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=1080&h=1920&fit=crop',
        caption: 'Pasta mit Premium Olivenöl\n\nEinfach & köstlich 🍝',
        duration: 5000
      }
    ]
  },
  {
    id: 'hummus',
    recipeSlug: 'griechischer-feta-aufstrich',
    recipeName: 'Cremiger Hummus',
    previewImage: 'https://images.unsplash.com/photo-1590702575524-f896de1c2ceb?w=400&h=400&fit=crop',
    stories: [
      {
        type: 'image',
        media: 'https://images.unsplash.com/photo-1590702575524-f896de1c2ceb?w=1080&h=1920&fit=crop',
        caption: 'Hausgemachter Hummus\n\nMit Olivadis Olivenöl verfeinert',
        duration: 5000
      }
    ]
  },
  {
    id: 'tzatziki',
    recipeSlug: 'griechischer-feta-aufstrich',
    recipeName: 'Tzatziki',
    previewImage: 'https://images.unsplash.com/photo-1628863353691-0071c8c1874c?w=400&h=400&fit=crop',
    stories: [
      {
        type: 'image',
        media: 'https://images.unsplash.com/photo-1628863353691-0071c8c1874c?w=1080&h=1920&fit=crop',
        caption: 'Erfrischender Tzatziki\n\nDer Klassiker aus Griechenland 🥒',
        duration: 5000
      }
    ]
  },
  {
    id: 'grilled-veggies',
    recipeSlug: 'griechischer-feta-aufstrich',
    recipeName: 'Gegrilltes Gemüse',
    previewImage: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&h=400&fit=crop',
    stories: [
      {
        type: 'image',
        media: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=1080&h=1920&fit=crop',
        caption: 'Gegrilltes Gemüse\n\nMit Olivenöl mariniert 🍆',
        duration: 5000
      }
    ]
  },
  {
    id: 'caprese',
    recipeSlug: 'griechischer-feta-aufstrich',
    recipeName: 'Caprese Salat',
    previewImage: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&h=400&fit=crop',
    stories: [
      {
        type: 'image',
        media: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=1080&h=1920&fit=crop',
        caption: 'Caprese Salat\n\nTomate, Mozzarella, Basilikum 🍅',
        duration: 5000
      }
    ]
  },
  {
    id: 'focaccia',
    recipeSlug: 'griechischer-feta-aufstrich',
    recipeName: 'Focaccia',
    previewImage: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&h=400&fit=crop',
    stories: [
      {
        type: 'image',
        media: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=1080&h=1920&fit=crop',
        caption: 'Hausgemachte Focaccia\n\nMit Rosmarin und Olivenöl',
        duration: 5000
      }
    ]
  },
];
