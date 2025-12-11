# Olivadis Headless Integration Plugin

WordPress plugin for integrating recipes custom post type with Next.js headless frontend, including automatic revalidation webhooks.

## Features

- **Recipe Custom Post Type**: Full-featured recipe management with German labels
- **Recipe Categories**: Taxonomy for organizing recipes (Aufstriche, Salate, Dips, etc.)
- **Advanced Custom Fields**: All recipe fields registered programmatically
- **REST API**: Custom endpoints for retrieving recipes
- **Automatic Revalidation**: Webhooks trigger Next.js revalidation on content changes
- **Product Integration**: Revalidation hooks for WooCommerce products

## Requirements

- WordPress 6.0+
- PHP 7.4+
- Advanced Custom Fields (ACF) plugin
- WooCommerce (for product integration)

## Installation

1. Upload the `olivadis-headless-integration` folder to `/wp-content/plugins/`
2. Install and activate the Advanced Custom Fields (ACF) plugin
3. Activate the Olivadis Headless Integration plugin
4. Go to **Settings > Olivadis Headless** to configure

## Configuration

### Step 1: Generate Secret Key

1. Go to **Settings > Olivadis Headless**
2. Click "Generate Random Key" to create a secure secret key
3. Copy this key

### Step 2: Configure Next.js

Add the secret key to your Next.js `.env.local` file:

```env
REVALIDATION_SECRET=your-secret-key-here
```

### Step 3: Configure WordPress

1. Enter your Next.js site URL (e.g., `https://olivadis-headless.vercel.app`)
2. Paste the secret key
3. Click "Save Settings"

## Recipe Fields

The plugin registers the following ACF fields for recipes:

### Basic Information
- **Prep Time** (`prep_time`) - Text field (e.g., "5 Minuten")
- **Difficulty** (`difficulty`) - Select field (Sehr leicht, Leicht, Mittel, Schwer)
- **Servings** (`servings`) - Number field

### Ingredients
- **Ingredients** (`ingredients`) - Repeater field
  - `amount` - Amount/quantity (e.g., "100g", "2 EL")
  - `name` - Ingredient name

### Instructions
- **Instructions** (`instructions`) - Repeater field
  - `step` - Step-by-step instructions

### Additional Information
- **Cook's Note** (`cooks_note`) - Textarea (optional tips/notes)
- **Nutritional Info** (`nutritional_info`) - Group field (optional)
  - `calories` - Calories (kcal)
  - `protein` - Protein (g)
  - `carbs` - Carbohydrates (g)
  - `fat` - Fat (g)
  - `fiber` - Fiber (g)
- **Video URL** (`video_url`) - URL field (YouTube/Vimeo)

## REST API Endpoints

### Get All Recipes
```
GET /wp-json/olivadis/v1/recipes
```

**Parameters:**
- `per_page` (optional) - Number of recipes per page (default: 100)
- `page` (optional) - Page number (default: 1)
- `category` (optional) - Filter by category slug

**Response:**
```json
{
  "recipes": [...],
  "total": 10,
  "pages": 1
}
```

### Get Single Recipe
```
GET /wp-json/olivadis/v1/recipes/{slug}
```

**Response:**
```json
{
  "id": 123,
  "title": "Olivenöl Dip",
  "slug": "olivenoel-dip",
  "content": "...",
  "excerpt": "...",
  "date": "2024-01-01T00:00:00",
  "featured_image": {...},
  "categories": [...],
  "prep_time": "5 Minuten",
  "difficulty": "Sehr leicht",
  "servings": 4,
  "ingredients": [...],
  "instructions": [...],
  "cooks_note": "...",
  "nutritional_info": {...},
  "video_url": "..."
}
```

### Get Recipe Categories
```
GET /wp-json/olivadis/v1/recipe-categories
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Aufstriche",
    "slug": "aufstriche",
    "count": 5
  }
]
```

## Automatic Revalidation

The plugin automatically sends webhooks to your Next.js site when:

### Recipe Events
- Recipe created
- Recipe updated
- Recipe deleted
- Recipe trashed
- Recipe category changed

### Product Events (WooCommerce)
- Product created
- Product updated
- Product deleted
- Product trashed
- Product stock changed
- Product variation changed
- Product category changed

### Webhook Payload

```json
{
  "type": "recipe",
  "action": "updated",
  "data": {
    "id": 123,
    "slug": "olivenoel-dip",
    "title": "Olivenöl Dip"
  },
  "timestamp": 1234567890
}
```

## Manual Revalidation

Trigger a full site revalidation from **Settings > Olivadis Headless** by clicking "Trigger Full Site Revalidation".

## Default Recipe Categories

The plugin automatically creates these default categories:

- Aufstriche (aufstriche)
- Salate (salate)
- Dips (dips)
- Vorspeisen (vorspeisen)
- Hauptgerichte (hauptgerichte)
- Desserts (desserts)
- Snacks (snacks)

## Development

### Debug Mode

Enable WordPress debug mode to see webhook logs:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

Webhook logs will appear in `wp-content/debug.log`.

## Troubleshooting

### Webhooks not triggering

1. Check that Next.js URL is correct (no trailing slash)
2. Verify secret key matches in both WordPress and Next.js
3. Enable WP_DEBUG to see webhook logs
4. Check that Next.js `/api/revalidate` endpoint is accessible

### ACF fields not showing

1. Ensure Advanced Custom Fields plugin is installed and activated
2. Check that you're editing a 'rezepte' post type

### REST API not working

1. Check WordPress permalink settings (must not be "Plain")
2. Test endpoint directly in browser
3. Check for conflicting plugins

## Support

For issues or questions, please contact the Olivadis development team.

## License

This plugin is proprietary software for Olivadis.com.

## Changelog

### 1.0.0
- Initial release
- Recipe custom post type
- Recipe categories taxonomy
- ACF field registration
- REST API endpoints
- Automatic revalidation webhooks
- Admin settings page
