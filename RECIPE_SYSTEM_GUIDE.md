# Olivadis Recipe System - Complete Guide

This guide covers the complete recipe system implementation for Olivadis headless store, including WordPress plugin and Next.js frontend.

## Overview

The recipe system consists of two main parts:

1. **WordPress Plugin** - Manages recipes, fields, and triggers revalidation webhooks
2. **Next.js Frontend** - Displays recipes with beautiful German-language pages

## Table of Contents

- [WordPress Plugin Setup](#wordpress-plugin-setup)
- [Next.js Configuration](#nextjs-configuration)
- [Recipe Fields](#recipe-fields)
- [Pages Created](#pages-created)
- [API Endpoints](#api-endpoints)
- [Automatic Revalidation](#automatic-revalidation)
- [Usage Guide](#usage-guide)
- [Troubleshooting](#troubleshooting)

---

## WordPress Plugin Setup

### 1. Install the Plugin

1. Upload the `wordpress-plugin/olivadis-headless-integration` folder to your WordPress site:
   ```
   /wp-content/plugins/olivadis-headless-integration/
   ```

2. Install required dependency:
   - Install and activate **Advanced Custom Fields (ACF)** plugin from WordPress.org

3. Activate the **Olivadis Headless Integration** plugin from WordPress Admin > Plugins

### 2. Configure Plugin Settings

1. Go to **Settings > Olivadis Headless** in WordPress Admin

2. Generate a secret key:
   - Click "Generate Random Key" button
   - Copy the generated key

3. Enter your Next.js site URL:
   - Production: `https://olivadis-headless.vercel.app`
   - Development: `http://localhost:3000`

4. Paste the secret key in the "Revalidation Secret Key" field

5. Click "Save Settings"

### 3. Plugin Structure

```
wordpress-plugin/olivadis-headless-integration/
├── olivadis-headless-integration.php    # Main plugin file
├── includes/
│   ├── class-recipe-post-type.php       # Recipe custom post type
│   ├── class-recipe-fields.php          # ACF fields registration
│   ├── class-revalidation-hooks.php     # Recipe revalidation hooks
│   └── class-product-hooks.php          # Product revalidation hooks
├── admin/
│   └── admin-settings.php               # Admin settings page
└── README.md                            # Plugin documentation
```

---

## Next.js Configuration

### 1. Environment Variables

Add to your `.env.local` file:

```env
# WordPress/WooCommerce URL
WP_BASE_URL=https://olivadis.com

# WooCommerce API Credentials
WOO_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WOO_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Revalidation Secret (must match WordPress plugin setting)
REVALIDATION_SECRET=your-secret-key-here
```

### 2. Vercel Environment Variables

For production deployment, add these variables in Vercel Dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the same variables as above
4. Deploy

---

## Recipe Fields

### Basic Information
- **Prep Time** (`prep_time`) - e.g., "5 Minuten", "30 Minuten"
- **Difficulty** (`difficulty`) - Select: Sehr leicht, Leicht, Mittel, Schwer
- **Servings** (`servings`) - Number field

### Ingredients
- **Ingredients** (`ingredients`) - Repeater field
  - `amount` - Quantity (e.g., "100g", "2 EL", "1 Prise")
  - `name` - Ingredient name

### Instructions
- **Instructions** (`instructions`) - Repeater field
  - `step` - Step-by-step instruction text

### Additional
- **Cook's Note** (`cooks_note`) - Optional tips/notes (Textarea)
- **Nutritional Info** (`nutritional_info`) - Optional group field
  - `calories` - Calories (kcal)
  - `protein` - Protein (g)
  - `carbs` - Carbohydrates (g)
  - `fat` - Fat (g)
  - `fiber` - Fiber (g)
- **Video URL** (`video_url`) - YouTube or Vimeo URL (optional)

### Recipe Categories
Default categories created automatically:
- Aufstriche
- Salate
- Dips
- Vorspeisen
- Hauptgerichte
- Desserts
- Snacks

---

## Pages Created

### 1. Recipe Listing Page
**URL:** `/rezepte`

**Features:**
- Grid layout with recipe cards
- Filter by category
- Recipe image, title, prep time, difficulty
- Responsive design (1 col mobile, 2 col tablet, 3 col desktop)
- German text throughout

**File:** `app/rezepte/page.tsx`

### 2. Single Recipe Page
**URL:** `/rezepte/[slug]`

**Features:**
- Hero image with title overlay
- Recipe meta (prep time, difficulty, servings)
- Ingredients list with checkmarks
- Step-by-step instructions with numbered steps
- Cook's note section (if available)
- Nutritional information sidebar (if available)
- Video embed (if available)
- Print button
- Back to recipes link

**File:** `app/rezepte/[slug]/page.tsx`

### 3. Revalidation API Route
**URL:** `/api/revalidate`

**Purpose:** Receives webhooks from WordPress to trigger page revalidation

**File:** `app/api/revalidate/route.ts`

---

## API Endpoints

### WordPress REST API

#### Get All Recipes
```
GET /wp-json/olivadis/v1/recipes
```

**Parameters:**
- `per_page` (optional) - Number of recipes (default: 100)
- `page` (optional) - Page number (default: 1)
- `category` (optional) - Filter by category slug

#### Get Single Recipe
```
GET /wp-json/olivadis/v1/recipes/{slug}
```

#### Get Recipe Categories
```
GET /wp-json/olivadis/v1/recipe-categories
```

### Next.js API Functions

Located in `lib/woocommerce/recipes.ts`:

```typescript
// Get all recipes
const recipes = await getRecipes({ per_page: 100 })

// Get single recipe
const recipe = await getRecipe('olivenoel-dip')

// Get recipe categories
const categories = await getRecipeCategories()

// Get recipes by category
const recipes = await getRecipesByCategory('aufstriche')

// Search recipes
const results = await searchRecipes('olivenöl')

// Get featured recipes
const featured = await getFeaturedRecipes(3)
```

---

## Automatic Revalidation

### How It Works

1. Content changes in WordPress (recipe/product created, updated, deleted)
2. WordPress plugin sends webhook to Next.js `/api/revalidate` endpoint
3. Next.js revalidates affected pages
4. Users see updated content without manual rebuild

### Events Triggering Revalidation

**Recipe Events:**
- Recipe created → Revalidates `/rezepte` and `/rezepte/[slug]`
- Recipe updated → Revalidates `/rezepte` and `/rezepte/[slug]`
- Recipe deleted → Revalidates `/rezepte` and `/rezepte/[slug]`
- Recipe category changed → Revalidates `/rezepte`

**Product Events:**
- Product created/updated → Revalidates `/shop` and `/product/[slug]`
- Product stock changed → Revalidates `/shop` and `/product/[slug]`
- Product deleted → Revalidates `/shop`

### Manual Revalidation

Trigger full site revalidation:
1. Go to **Settings > Olivadis Headless** in WordPress
2. Click "Trigger Full Site Revalidation" button

---

## Usage Guide

### Creating a Recipe

1. Go to **Rezepte > Neu hinzufügen** in WordPress Admin

2. Enter recipe details:
   - Title
   - Content (description)
   - Featured image

3. Fill in recipe fields:
   - Zubereitungszeit: "15 Minuten"
   - Schwierigkeit: Select from dropdown
   - Portionen: Enter number

4. Add ingredients:
   - Click "Zutat hinzufügen"
   - Enter amount and ingredient name
   - Repeat for all ingredients

5. Add preparation steps:
   - Click "Schritt hinzufügen"
   - Enter step description
   - Repeat for all steps

6. Optional fields:
   - Koch-Notiz: Add tips or notes
   - Nährwerte: Add nutritional information
   - Video URL: Add YouTube/Vimeo link

7. Assign categories (Aufstriche, Salate, etc.)

8. Publish the recipe

9. The recipe will automatically appear on your Next.js site within 60 seconds

### Testing Revalidation

1. Create or update a recipe in WordPress
2. Check WordPress debug log (if WP_DEBUG enabled)
3. Visit your Next.js site and verify the recipe appears
4. Check Vercel logs for revalidation events

---

## Troubleshooting

### Recipe Not Appearing on Next.js Site

**Check:**
1. Is the recipe published (not draft)?
2. Is ACF plugin installed and activated?
3. Are all required fields filled?
4. Check WordPress debug log for API errors

**Solution:**
- Manually trigger revalidation from WordPress settings
- Check Next.js build logs for errors
- Verify WordPress REST API is accessible

### Revalidation Not Working

**Check:**
1. Secret key matches in WordPress and Next.js
2. Next.js URL is correct (no trailing slash)
3. `/api/revalidate` endpoint is accessible
4. WordPress can make external HTTP requests

**Debug:**
```bash
# Enable WordPress debug mode
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);

# Check /wp-content/debug.log for webhook logs
```

### Images Not Loading

**Check:**
1. Featured image is set in WordPress
2. Image file exists and is accessible
3. Next.js Image component configuration
4. CORS settings if images from different domain

**Solution:**
```typescript
// Add to next.config.ts
images: {
  domains: ['olivadis.com'],
}
```

### Video Not Embedding

**Check:**
1. URL is valid YouTube or Vimeo link
2. Video is public (not private)
3. Video embed function in recipes.ts

**Supported formats:**
- YouTube: `https://www.youtube.com/watch?v=xxxxx`
- YouTube short: `https://youtu.be/xxxxx`
- Vimeo: `https://vimeo.com/xxxxx`

### Category Filter Not Working

**Check:**
1. Recipes are assigned to categories
2. Category slug is correct in URL
3. WordPress taxonomy is registered correctly

---

## Design System

The recipe pages use Olivadis design system:

**Colors:**
- Primary Green: `#1C4220`
- Cream: `#F2E9DB`
- Background: `#FCFBF7`

**Typography:**
- Headings: Helvetica Neue Bold
- Body: Helvetica Neue Regular
- German language throughout

**Components:**
- Cards with rounded corners
- Difficulty badges with color coding
- Step-by-step numbered instructions
- Icon system for meta information

---

## Performance

### Caching Strategy

- Recipe listing: Revalidated every 60 seconds
- Single recipe: Revalidated on-demand via webhooks
- Static generation for all recipe pages
- Incremental Static Regeneration (ISR)

### Image Optimization

- Next.js Image component with automatic optimization
- Responsive images with `sizes` prop
- Lazy loading for below-fold images
- WebP format when supported

---

## Future Enhancements

Potential improvements:

1. **Search functionality** - Full-text search for recipes
2. **Recipe ratings** - User rating system
3. **Comments** - User comments on recipes
4. **Print styling** - CSS for printer-friendly layout
5. **Recipe schema** - JSON-LD structured data for SEO
6. **Related recipes** - Show similar recipes
7. **Shopping list** - Generate shopping list from ingredients
8. **Meal planner** - Weekly meal planning feature

---

## Support

For issues or questions:
- Check this guide first
- Review plugin README: `wordpress-plugin/olivadis-headless-integration/README.md`
- Check WordPress and Vercel logs
- Contact development team

---

## License

This system is proprietary software for Olivadis.com.

---

## Files Reference

### WordPress Plugin Files
- `/wordpress-plugin/olivadis-headless-integration/olivadis-headless-integration.php`
- `/wordpress-plugin/olivadis-headless-integration/includes/class-recipe-post-type.php`
- `/wordpress-plugin/olivadis-headless-integration/includes/class-recipe-fields.php`
- `/wordpress-plugin/olivadis-headless-integration/includes/class-revalidation-hooks.php`
- `/wordpress-plugin/olivadis-headless-integration/includes/class-product-hooks.php`
- `/wordpress-plugin/olivadis-headless-integration/admin/admin-settings.php`

### Next.js Files
- `/types/recipe.ts` - TypeScript types
- `/lib/woocommerce/recipes.ts` - API functions
- `/app/api/revalidate/route.ts` - Revalidation endpoint
- `/app/rezepte/page.tsx` - Recipe listing page
- `/app/rezepte/[slug]/page.tsx` - Single recipe page
