# Olivadis Headless Integration Plugin

**Version:** 1.0.0
**Author:** Olivadis
**Requires WordPress:** 6.0 or higher
**Requires PHP:** 7.4 or higher
**License:** GPL v2 or later

## Overview

This plugin integrates your WordPress/WooCommerce installation with a Next.js headless frontend. It provides custom post types for recipes, automatic webhook notifications for content changes, and seamless synchronization between WordPress and your Next.js application.

## What This Plugin Does

### 🍳 Recipe Management System
- Creates custom post type "Rezepte" (Recipes)
- Adds custom taxonomy "Schwierigkeit" (Difficulty levels)
- Registers 10+ Advanced Custom Fields for recipe data
- Exposes recipes via WordPress REST API
- Supports featured images, excerpts, and categories

### 🔔 Automatic Content Synchronization
- **Recipe Webhooks**: Notifies Next.js when recipes are created, updated, or deleted (Instant ISR revalidation <1s)
- **Product Webhooks**: Notifies Next.js when WooCommerce products change (Instant ISR revalidation <1s)
- **Shipping Webhooks**: Triggers Vercel rebuild when shipping settings or tax rates change (~2min full rebuild)

### ⚙️ Admin Settings Page
- Configure Next.js frontend URL
- Set revalidation secret for secure webhooks
- Configure Vercel Deploy Hook URL for automatic rebuilds
- Manual revalidation trigger button

---

## Custom Post Types Created

### Rezepte (Recipes)

The plugin automatically creates a custom post type called **Rezepte** with the following configuration:

**Post Type Identifier:** `rezepte`

**Labels (German):**
- Singular Name: Rezept
- Plural Name: Rezepte
- Menu Name: Rezepte
- Add New: Neues Rezept hinzufügen
- Edit Item: Rezept bearbeiten
- View Item: Rezept ansehen
- Search Items: Rezepte durchsuchen

**Features Enabled:**
- ✅ Title
- ✅ Editor (WYSIWYG content)
- ✅ Thumbnail (Featured Image)
- ✅ Excerpt (Summary/Description)
- ✅ Custom Fields
- ✅ REST API Support

**Settings:**
- Public: Yes
- Hierarchical: No (like posts, not pages)
- Menu Icon: `dashicons-food`
- REST API Base: `/wp-json/wp/v2/rezepte`
- Custom Permalink: `/rezepte/[recipe-slug]`
- Shows in Admin Menu: Yes
- Shows in REST API: Yes
- Searchable: Yes

**Admin Menu Location:**
- Appears in WordPress admin sidebar as "Rezepte"
- Below "Posts" and above "Media"

---

## Custom Taxonomies Created

### Schwierigkeit (Difficulty)

**Taxonomy Identifier:** `schwierigkeit`
**Applies To:** `rezepte` (Recipes post type)

**Default Terms Created:**
1. **Sehr leicht** (Very Easy) - Slug: `sehr-leicht`
2. **Leicht** (Easy) - Slug: `leicht`
3. **Mittel** (Medium) - Slug: `mittel`
4. **Schwer** (Hard) - Slug: `schwer`

**Settings:**
- Hierarchical: Yes (like categories)
- Public: Yes
- Show in REST API: Yes
- Show Admin Column: Yes (shows in recipe list)
- Rewrite: `/schwierigkeit/[term-slug]`

---

## Advanced Custom Fields (ACF)

The plugin requires **Advanced Custom Fields** plugin and automatically creates the following field group when activated.

### Field Group: "Recipe Details"

**Applies To:** All posts where Post Type = `rezepte`

**Position:** Normal (after content editor)

#### Basic Information

| Field Label | Field Name | Type | Description | Required |
|-------------|-----------|------|-------------|----------|
| **Zubereitungszeit** | `prep_time` | Text | Preparation time (e.g., "30 Minuten") | No |
| **Schwierigkeitsgrad** | `difficulty` | Select | Difficulty level | No |
| **Portionen** | `servings` | Number | Number of servings (e.g., 4) | No |
| **Nur für Kunden** | `locked` | True/False | Lock recipe for customers only | No |

**Difficulty Options:**
- Sehr leicht
- Leicht
- Mittel
- Schwer

#### Ingredients Section

| Field Label | Field Name | Type | Sub-Fields |
|-------------|-----------|------|------------|
| **Zutaten** | `ingredients` | Repeater | - |
| ↳ Menge | `quantity` | Text | Amount (e.g., "200g", "2 EL", "1 Prise") |
| ↳ Zutat | `ingredient_text` | Text | Ingredient name |

**Example:**
```
200g - Feta-Käse
2 EL - Olivenöl
1 Prise - Salz
```

#### Instructions & Notes

| Field Label | Field Name | Type | Description |
|-------------|-----------|------|-------------|
| **Anleitung** | `instructions` | WYSIWYG Editor | Step-by-step cooking instructions with rich text formatting |
| **Notiz vom Koch** | `cooks_note` | Textarea | Chef's personal tips, notes, and recommendations |
| **Nährwertangaben** | `nutritional_info` | Textarea | Nutritional information (free-form text) |

#### Media

| Field Label | Field Name | Type | Description |
|-------------|-----------|------|-------------|
| **Video-URL** | `video_url` | URL | YouTube or Vimeo video URL |

### REST API Exposure

All ACF fields are **automatically exposed** in the WordPress REST API:

**Endpoint:**
```
GET /wp-json/wp/v2/rezepte
GET /wp-json/wp/v2/rezepte/{id}
GET /wp-json/wp/v2/rezepte?slug={slug}
```

**Response Format:**
```json
{
  "id": 123,
  "title": {
    "rendered": "Griechischer Feta Aufstrich"
  },
  "slug": "griechischer-feta-aufstrich",
  "acf": {
    "prep_time": "15 Minuten",
    "difficulty": "Leicht",
    "servings": 4,
    "locked": false,
    "ingredients": [
      {
        "quantity": "200g",
        "ingredient_text": "Feta-Käse"
      },
      {
        "quantity": "2 EL",
        "ingredient_text": "Olivenöl"
      }
    ],
    "instructions": "<p>Step 1...</p>",
    "cooks_note": "Tipp: ...",
    "nutritional_info": "Kalorien: 250 kcal",
    "video_url": "https://youtube.com/..."
  }
}
```

---

## Webhook System

The plugin sends automatic webhooks to your Next.js frontend when content changes occur.

### System 1: ISR Revalidation Webhooks (Instant <1s)

These webhooks trigger **Incremental Static Regeneration** in Next.js - pages update instantly without a full rebuild.

#### Recipe Webhooks

**WordPress Hooks Monitored:**
- `save_post_rezepte` - Recipe created or updated
- `before_delete_post` (type: rezepte) - Recipe deleted
- `wp_trash_post` (type: rezepte) - Recipe trashed
- `untrash_post` (type: rezepte) - Recipe restored from trash
- `created_schwierigkeit` - Difficulty term added
- `edited_schwierigkeit` - Difficulty term edited
- `delete_schwierigkeit` - Difficulty term deleted

**Webhook Payload:**
```json
{
  "event": "recipe.created|recipe.updated|recipe.deleted",
  "recipe": {
    "id": 123,
    "slug": "griechischer-feta-aufstrich",
    "title": "Griechischer Feta Aufstrich"
  }
}
```

**Next.js Endpoint:**
```
POST {NEXT_JS_URL}/api/revalidate
Authorization: Bearer {REVALIDATION_SECRET}
```

**Result:** Recipe pages revalidated in <1 second, no rebuild needed

#### Product Webhooks

**WordPress Hooks Monitored:**
- `woocommerce_update_product` - Product updated
- `woocommerce_new_product` - Product created
- `wp_trash_post` (type: product) - Product trashed
- `before_delete_post` (type: product) - Product deleted
- `woocommerce_update_product_variation` - Variation updated
- `woocommerce_product_set_stock` - Stock changed

**Webhook Payload:**
```json
{
  "event": "product.created|product.updated|product.deleted",
  "product": {
    "id": 456,
    "slug": "olivenol-extra-nativ",
    "name": "Olivenöl Extra Nativ"
  }
}
```

**Result:** Product pages revalidated in <1 second, no rebuild needed

### System 2: Vercel Deploy Hook (Full Rebuild ~2min)

These hooks trigger a **full production rebuild** on Vercel - necessary for build-time data synchronization.

#### Shipping & Tax Webhooks

**WordPress Hooks Monitored:**
- `woocommerce_shipping_zone_method_added` - New shipping method added
- `woocommerce_shipping_zone_method_updated` - Shipping method updated
- `woocommerce_shipping_zone_method_deleted` - Shipping method deleted
- `woocommerce_shipping_zone_method_status_toggled` - Method enabled/disabled
- `woocommerce_tax_rate_added` - New tax rate added
- `woocommerce_tax_rate_updated` - Tax rate updated
- `woocommerce_tax_rate_deleted` - Tax rate deleted

**Action:**
1. Plugin detects shipping/tax change
2. Triggers `wp_remote_post()` to Vercel Deploy Hook URL
3. Vercel starts new production deployment
4. Build process runs `node scripts/sync-shipping-rules.js`
5. Script fetches fresh shipping zones/methods/tax rates from WooCommerce API
6. Writes updated data to `lib/woocommerce/shipping-rules.json`
7. Site builds with new shipping calculations

**Result:** Production site rebuilt with fresh shipping rules in ~2 minutes

**Why Full Rebuild?**
Shipping calculations happen client-side (<100ms instant) using pre-fetched JSON data. When shipping settings change, the JSON must be regenerated at build time.

---

## Admin Settings Page

**Location:** WordPress Admin → Settings → Olivadis Headless

### Configuration Fields

| Field | Description | Example Value |
|-------|-------------|---------------|
| **Next.js URL** | Your headless frontend URL (no trailing slash) | `https://olivadis.vercel.app` |
| **Revalidation Secret** | Secret key for webhook authentication | `olivadis_2024_secret_xyz` |
| **Vercel Deploy Hook URL** | Webhook URL for triggering production rebuilds | `https://api.vercel.com/v1/integrations/deploy/prj_xxx` |

### How to Get Vercel Deploy Hook URL

1. Go to your Vercel project dashboard
2. Navigate to: **Settings → Git → Deploy Hooks**
3. Click **"Create Hook"**
   - Name: "Shipping Settings Changed"
   - Branch: `main` (or your production branch)
4. Click **"Create Hook"**
5. **Copy the generated webhook URL** (starts with `https://api.vercel.com/v1/integrations/deploy/`)
6. Paste into WordPress: Settings → Olivadis Headless → Vercel Deploy Hook URL

### Manual Revalidation Button

The settings page includes a **"Trigger Full Site Revalidation"** button that manually sends a revalidation request to your Next.js site.

**Use Cases:**
- Force update all pages after bulk content changes
- Test webhook configuration
- Recover from failed automatic revalidation

---

## File Structure

```
olivadis-headless-integration/
├── olivadis-headless-integration.php   # Main plugin file, constants, activation hooks
├── README.md                           # This documentation file
├── includes/
│   ├── class-recipe-post-type.php     # Registers "Rezepte" custom post type
│   ├── class-recipe-fields.php        # Registers ACF field groups for recipes
│   ├── class-revalidation-hooks.php   # Recipe webhook system (ISR)
│   ├── class-product-hooks.php        # Product webhook system (ISR)
│   └── class-shipping-hooks.php       # Shipping webhook system (Deploy Hook)
└── admin/
    └── admin-settings.php              # Settings page UI and save logic
```

**Total:** 7 PHP files, ~1,200 lines of code

---

## Installation

### Prerequisites

1. **WordPress:** 6.0 or higher
2. **PHP:** 7.4 or higher
3. **WooCommerce:** Required (for product/shipping features)
4. **Advanced Custom Fields (ACF):** **REQUIRED** - Plugin will not work without ACF

### Step 1: Install ACF Plugin

The ACF plugin is a **hard requirement** because this plugin uses ACF functions to register custom fields.

**Install ACF:**
```
WordPress Admin → Plugins → Add New
Search: "Advanced Custom Fields"
Click "Install Now" on "Advanced Custom Fields" by WP Engine
Click "Activate"
```

**Verify ACF is Active:**
- You should see "Custom Fields" in the WordPress admin sidebar
- If not visible, check Plugins → Installed Plugins → Advanced Custom Fields is activated

### Step 2: Install This Plugin

**Option A: Upload via WordPress Admin (Recommended)**

1. Zip the entire `olivadis-headless-integration` folder:
   ```bash
   cd wordpress-plugin/
   zip -r olivadis-headless-integration.zip olivadis-headless-integration/
   ```

2. WordPress Admin → Plugins → Add New
3. Click **"Upload Plugin"**
4. Choose `olivadis-headless-integration.zip`
5. Click **"Install Now"**
6. Click **"Activate Plugin"**

**Option B: Upload via FTP/SFTP**

1. Upload the entire `olivadis-headless-integration/` folder to:
   ```
   /wp-content/plugins/olivadis-headless-integration/
   ```

2. WordPress Admin → Plugins
3. Find **"Olivadis Headless Integration"**
4. Click **"Activate"**

### Step 3: Verify Installation

After activation, verify these items exist:

**✅ Custom Post Type:**
- WordPress Admin sidebar shows "Rezepte" menu item (below Posts)
- Click "Rezepte" → "Add New" to create test recipe

**✅ Settings Page:**
- Settings → Olivadis Headless exists
- Page shows 3 input fields (Next.js URL, Revalidation Secret, Deploy Hook URL)

**✅ ACF Field Group:**
- Custom Fields → Field Groups
- "Recipe Details" field group exists
- Shows 10+ fields (prep_time, difficulty, servings, ingredients, etc.)

### Step 4: Configure Settings

1. Go to **Settings → Olivadis Headless**

2. **Next.js URL:**
   - Enter your production domain (e.g., `https://olivadis.vercel.app`)
   - Or development URL (e.g., `http://localhost:3002`)
   - ⚠️ **No trailing slash!**

3. **Revalidation Secret:**
   - Create a secure random string (e.g., `olivadis_2024_secret_xyz`)
   - Copy this value - you'll need it for Vercel environment variables
   - **Must match exactly** between WordPress and Vercel

4. **Vercel Deploy Hook URL:**
   - Get from Vercel project: Settings → Git → Deploy Hooks
   - Create hook for `main` branch
   - Paste the webhook URL (starts with `https://api.vercel.com/v1/integrations/deploy/`)

5. Click **"Save Changes"**

---

## Next.js Configuration

Your Next.js app must have these environment variables configured in Vercel.

### Required Environment Variables

Add these in **Vercel Dashboard → Settings → Environment Variables:**

```env
# WooCommerce API (for fetching products, orders, shipping)
NEXT_PUBLIC_WOOCOMMERCE_URL=https://olivadis.com
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxx

# Webhook Authentication (must match WordPress setting)
REVALIDATION_SECRET=olivadis_2024_secret_xyz
```

**Where to Get WooCommerce API Keys:**
1. `olivadis.com/wp-admin`
2. WooCommerce → Settings → Advanced → REST API
3. Click "Add Key"
4. Description: "Next.js Headless Frontend"
5. User: Your admin user
6. Permissions: Read/Write
7. Click "Generate API Key"
8. **Copy the Consumer Key and Consumer Secret immediately** (shown only once)

**Important:**
- Select **"Production, Preview, Development"** for all 4 environment variables
- The `REVALIDATION_SECRET` must match exactly between WordPress and Vercel (case-sensitive)

---

## How Content Sync Works

### Example 1: Creating a New Recipe

**You (WordPress Admin):**
1. WordPress → Rezepte → Add New
2. Enter title: "Griechischer Feta Aufstrich"
3. Fill in ACF fields (prep time, difficulty, ingredients, instructions)
4. Upload featured image
5. Click **"Publish"**

**Plugin (Automatic):**
1. Detects `save_post_rezepte` hook firing
2. Retrieves recipe slug: `griechischer-feta-aufstrich`
3. Sends POST request to:
   ```
   POST https://olivadis.vercel.app/api/revalidate
   Authorization: Bearer olivadis_2024_secret_xyz
   Body: {"event": "recipe.created", "recipe": {...}}
   ```

**Next.js (Automatic):**
1. Receives webhook at `/api/revalidate`
2. Verifies `Authorization` header matches `REVALIDATION_SECRET`
3. Calls `revalidatePath('/rezepte')`
4. Calls `revalidatePath('/rezepte/griechischer-feta-aufstrich')`
5. Returns `{ revalidated: true }`

**Result:**
- Recipe page appears on frontend in **<1 second**
- No manual deployment needed
- No full rebuild required
- Free, instant ISR revalidation

### Example 2: Updating Product Price

**You (WordPress Admin):**
1. WooCommerce → Products → Edit "Olivenöl Extra Nativ"
2. Change price: €24.99 → €19.99
3. Click **"Update"**

**Plugin (Automatic):**
1. Detects `woocommerce_update_product` hook
2. Sends revalidation webhook to Next.js
3. Logs: "Product revalidation triggered for olivenol-extra-nativ"

**Next.js (Automatic):**
1. Revalidates `/shop`
2. Revalidates `/product/olivenol-extra-nativ`

**Result:**
- New price shows on frontend in **<1 second**
- Shop and product pages updated instantly

### Example 3: Changing Shipping Settings

**You (WordPress Admin):**
1. WooCommerce → Settings → Shipping → Zones
2. Select "Austria" zone
3. Edit "Free Shipping" method
4. Change minimum order amount: €79 → €99
5. Click **"Save changes"**

**Plugin (Automatic):**
1. Detects `woocommerce_shipping_zone_method_updated` hook
2. Sends POST request to Vercel Deploy Hook URL:
   ```
   POST https://api.vercel.com/v1/integrations/deploy/prj_xxx
   ```
3. Logs: "Vercel rebuild triggered due to shipping settings change"

**Vercel (Automatic):**
1. Receives Deploy Hook request
2. Starts new production deployment
3. Runs build command: `npm run build`
4. Build runs prebuild script: `node scripts/sync-shipping-rules.js`
5. Script fetches fresh shipping zones from WooCommerce API:
   ```bash
   GET https://olivadis.com/wp-json/wc/v3/shipping/zones
   ```
6. Writes updated rules to `lib/woocommerce/shipping-rules.json`:
   ```json
   {
     "AT": {
       "freeShippingThreshold": 99,
       "flatRate": 5.99,
       "taxRate": 0.10
     }
   }
   ```
7. Builds site with new JSON file
8. Deploys to production

**Result:**
- Cart calculations use new €99 threshold
- Production site updated in **~2 minutes**
- All automatic, zero manual intervention

---

## Troubleshooting

### ACF Fields Not Showing in Recipe Editor

**Symptoms:**
- You can create recipes but don't see prep time, difficulty, ingredients fields
- ACF field group missing

**Fixes:**
1. **Verify ACF is installed and activated:**
   - WordPress → Plugins → Installed Plugins
   - "Advanced Custom Fields" should show "Active"
   - If not, click "Activate"

2. **Check field group exists:**
   - Custom Fields → Field Groups
   - Look for "Recipe Details" field group
   - If missing, deactivate and reactivate this plugin to re-create it

3. **Clear cache:**
   - If using caching plugin (WP Rocket, W3 Total Cache, etc.)
   - Clear all cache
   - Try again

### Webhooks Not Triggering

**Symptoms:**
- You update a recipe but Next.js site doesn't update
- Products change but shop page shows old data

**Debugging Steps:**

1. **Enable WordPress Debug Mode:**
   Edit `wp-config.php`:
   ```php
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   ```

2. **Check Debug Log:**
   View `wp-content/debug.log` for messages like:
   ```
   ✅ Olivadis Headless: Revalidation triggered successfully for recipe: griechischer-feta-aufstrich
   ❌ Olivadis Headless: Revalidation failed: 401 Unauthorized
   ```

3. **Verify Settings:**
   - Settings → Olivadis Headless
   - Next.js URL is correct (no trailing slash, no typos)
   - Revalidation Secret matches Vercel `REVALIDATION_SECRET` exactly (case-sensitive)

4. **Test Manually:**
   Click **"Trigger Full Site Revalidation"** button in settings
   - If successful: "Revalidation triggered successfully!"
   - If failed: Error message shows problem (wrong URL, wrong secret, etc.)

5. **Check Next.js Logs:**
   - Vercel Dashboard → Your Project → Deployments → Latest
   - View Runtime Logs
   - Look for `/api/revalidate` requests
   - Should show 200 OK or error details

### Vercel Deploy Hook Not Triggering

**Symptoms:**
- You change shipping settings but production site still shows old thresholds
- Cart calculations don't update after changing tax rates

**Debugging:**

1. **Check Settings:**
   - Settings → Olivadis Headless → Vercel Deploy Hook URL
   - URL should start with `https://api.vercel.com/v1/integrations/deploy/`
   - No trailing slash, no extra spaces

2. **Check Debug Log:**
   `wp-content/debug.log` should show:
   ```
   ✅ Olivadis Headless: Vercel rebuild triggered due to shipping settings change
   ```
   Or error:
   ```
   ❌ Olivadis Headless: Vercel Deploy Hook URL not configured
   ❌ Olivadis Headless: Failed to trigger Vercel rebuild: [HTTP error]
   ```

3. **Verify Deploy Hook in Vercel:**
   - Vercel → Project → Settings → Git → Deploy Hooks
   - Check hook exists and is for correct branch (`main`)
   - Try creating new hook if existing one seems broken

4. **Test Manually:**
   Use curl to test deploy hook:
   ```bash
   curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_xxx
   ```
   Should return JSON: `{"job": {"id": "...", "state": "PENDING"}}`

### REST API Not Working

**Symptoms:**
- Next.js can't fetch recipes
- `/wp-json/wp/v2/rezepte` returns 404

**Fixes:**

1. **Check Permalink Settings:**
   - Settings → Permalinks
   - Must **NOT** be "Plain"
   - Use "Post name" or "Custom Structure" (e.g., `/%postname%/`)
   - Click "Save Changes" to flush rewrite rules

2. **Flush Rewrite Rules:**
   - Deactivate plugin
   - Reactivate plugin
   - This re-registers custom post type and flushes permalinks

3. **Test Endpoint:**
   Visit in browser:
   ```
   https://olivadis.com/wp-json/wp/v2/rezepte
   ```
   Should return JSON array of recipes

4. **Check .htaccess:**
   If on Apache, ensure `.htaccess` file exists and has WordPress rewrite rules

---

## Support

For issues, questions, or feature requests:

1. Check this README's Troubleshooting section
2. Enable WordPress debug mode and check `wp-content/debug.log`
3. Check Vercel deployment logs
4. Review `SHIPPING-SYNC-README.md` for shipping-specific issues
5. Contact Olivadis development team

---

## Changelog

### Version 1.0.0 (2024-12-12)

**Initial Release**

- ✅ Custom post type: Rezepte (Recipes)
- ✅ Custom taxonomy: Schwierigkeit (Difficulty)
- ✅ ACF field groups: 10+ recipe fields (prep time, difficulty, servings, ingredients, instructions, notes, video)
- ✅ Recipe webhooks: Instant ISR revalidation on create/update/delete
- ✅ Product webhooks: Instant ISR revalidation on WooCommerce product changes
- ✅ Shipping webhooks: Automatic Vercel rebuilds on shipping/tax changes
- ✅ Admin settings page: Configure Next.js URL, revalidation secret, deploy hook URL
- ✅ REST API: Full recipe data exposed via `/wp-json/wp/v2/rezepte`
- ✅ Manual revalidation: Trigger button for testing/recovery
- ✅ Locked recipes: ACF field for customer-only recipe access
- ✅ Debug logging: WordPress debug.log integration for troubleshooting

---

## License

GPL v2 or later

---

## Credits

**Built for:** Olivadis - Premium Greek Olive Oil from Pteleos, Thessaly

**Website:** [olivadis.com](https://olivadis.com)

**Headless Frontend:** Next.js 15 with App Router, TypeScript, Tailwind CSS
