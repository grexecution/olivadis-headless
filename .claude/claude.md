# Olivadis Headless Store - Project Documentation

## Project Overview

This is a headless ecommerce store for **Olivadis.com**, built with modern web technologies to provide a fast, scalable, and maintainable shopping experience.

**IMPORTANT: All website content is in GERMAN (Deutsch).** All UI text, labels, buttons, messages, and content must be in German.

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Content Language**: German (Deutsch)
- **Styling**: Tailwind CSS
- **Backend**: WooCommerce REST API (olivadis.com)
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions + Vercel

## Design System

### Colors (✅ Extracted from Figma)

```typescript
// Primary Colors (Green - Olivadis Brand)
primary: {
  DEFAULT: '#1C4220',  // OLIVADIS-GRÜN (Main brand green)
  dark: '#0B180C',     // Darker shade for text
  light: '#3B6912',    // Accent green for highlights
}

// Secondary Colors (Cream/Beige)
cream: {
  DEFAULT: '#F2E9DB',  // OLIVADIS_COLOR-2 (Main cream)
  light: '#FCFBF7',    // OLIVADIS_SOFT-WHITE (Soft white/cream)
}

// Semantic Colors
background: '#FCFBF7',  // Default page background
foreground: '#1C4220',  // Default text color
```

### Typography (✅ Extracted from Figma)

```typescript
// Font Families
fontFamily: {
  sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'], // Primary font
  serif: ['Lora', 'Georgia', 'serif'],  // For italic brand name in headings
}

// Font Sizes with exact specs from Figma
fontSize: {
  'display': ['88px', { lineHeight: '80.655px', letterSpacing: '-3.52px', fontWeight: '700' }],
  'h1': ['88px', { lineHeight: '80.655px', letterSpacing: '-3.52px', fontWeight: '700' }],
  'h2': ['56px', { lineHeight: '70px', letterSpacing: '-2.24px', fontWeight: '700' }],
  'h3': ['26.642px', { lineHeight: '1.2', letterSpacing: '-0.5328px', fontWeight: '700' }],
  'h4': ['24px', { lineHeight: '1.3', letterSpacing: '-0.48px', fontWeight: '700' }],
  'body-lg': ['20px', { lineHeight: '1.5', letterSpacing: '-0.4px', fontWeight: '500' }],
  'body': ['16px', { lineHeight: '1.5', letterSpacing: '-0.32px', fontWeight: '400' }],
  'body-sm': ['13.321px', { lineHeight: '1.4', letterSpacing: '-0.2664px', fontWeight: '500' }],
  'price': ['24px', { lineHeight: '1.2', letterSpacing: '-0.48px', fontWeight: '700' }],
  'button': ['16.127px', { lineHeight: '1', letterSpacing: '-0.3225px', fontWeight: '700' }],
}

// Font Weights
fontWeight: {
  normal: '400',   // Body text
  medium: '500',   // Emphasized text
  bold: '700',     // Headings, prices, buttons
}
```

### Spacing (✅ Based on 4px base unit)

```typescript
spacing: {
  // Base unit: 4px
  '0.5': '2px',
  '1': '4px',
  '1.5': '6px',
  '2': '8px',
  '2.5': '10px',
  '3': '12px',
  '4': '16px',
  '5': '20px',
  '6': '24px',
  '8': '32px',
  '10': '40px',
  '12': '48px',
  '16': '64px',
  '20': '80px',
  '24': '96px',
  '32': '128px',
}
```

### Breakpoints

```typescript
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1512px',  // Based on Figma design width
}
```

## Pages to Implement (From Figma)

Based on the 7 Figma designs provided:

1. **Homepage** (node-id=214-4566)
   - Hero section
   - Featured products
   - Categories showcase
   - Brand story/about

2. **Shop/Product Listing** (node-id=214-6524)
   - Product grid
   - Filters (category, price, etc.)
   - Sorting options
   - Pagination

3. **Single Product** (node-id=214-5198)
   - Product images gallery
   - Product details
   - Add to cart
   - Related products

4. **Cart** (node-id=214-5682)
   - Cart items list
   - Quantity controls
   - Totals
   - Checkout button

5. **Checkout** (node-id=214-6114)
   - Billing/shipping forms
   - Payment methods
   - Order summary

6. **Account/Profile** (node-id=214-6833)
   - Order history
   - Account details
   - Addresses

7. **Additional Page** (node-id=214-7012)
   - (To be determined from Figma)

## Component Library

### Core Components (✅ Specifications from Figma)

#### Button Component
```typescript
// Primary Button
className="bg-primary text-cream px-2.5 py-1.5 rounded-md text-button font-bold hover:bg-primary-light transition-colors duration-200"

// Variants: primary, secondary, outline
// Sizes: sm (px-2 py-1), md (px-2.5 py-1.5), lg (px-4 py-2)
// States: default, hover, active, disabled
// With icon: Add ArrowRight icon for CTAs
```

#### Typography Components
```typescript
// H1 - Hero Headings (88px)
<h1 className="text-h1 font-sans text-primary-dark">
  Welcome to the <span className="font-serif italic text-primary-light">Olivadis</span> family
</h1>

// H2 - Section Headings (56px)
<h2 className="text-h2 font-sans text-primary-dark">Section Title</h2>

// Body Large - Descriptions (20px)
<p className="text-body-lg text-primary-dark">Large body text</p>

// Price Display (24px)
<span className="text-price text-cream">€26.90</span>
```

#### Card Component
```typescript
// Product Card
- Border Radius: rounded-md or rounded-lg (8-12px)
- Shadow: shadow-md hover:shadow-xl
- Padding: p-4 or p-6
- Background: bg-cream-light or bg-white

// Review Card (from Homepage)
- White background
- Rounded corners
- Star ratings (5 stars)
- User avatar + name
- Review text
```

#### Input Component
```typescript
// Text Input
className="border border-gray-300 rounded-md px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20"

// States: default, focus, error, disabled
// Variants: text, email, number, select, textarea
```

#### Navigation
```typescript
// Header
- Background: bg-primary
- Text: text-cream
- Height: Sticky header
- Logo: Olivadis logo (Gruppe_249 from Figma)

// Pre-Order Banner (Top Bar)
- Background: primary
- Progress bar for pre-orders
- "Shop now" button

// Footer
- Background: bg-primary-dark
- Text: text-cream-light
- Links in cream color
```

#### Product Components
```typescript
// ProductCard
- Product image (rounded)
- Product name (text-h4)
- Price (text-price)
- Add to cart button (primary)
- Badge for special offers

// ProductGrid
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Gap: gap-6
- Responsive layout

// ProductGallery
- Main image display
- Thumbnail navigation
- Image zoom on hover

// AddToCartButton
- Primary button with shopping cart icon
- "Pre-order now" or "Add to Cart" text
```

#### Cart Components
```typescript
// CartItem
- Product thumbnail
- Product name + details
- Quantity controls (- / number / +)
- Price display
- Remove button

// CartSummary
- Subtotal
- Discount display
- Delivery fee
- Total (prominent)
- Promo code input
- "Go to Checkout" button (primary)

// Order Summary (Checkout)
- Similar to cart summary
- Background: bg-cream-light
- Border radius: rounded-lg
```

## File Structure

```
olivadis-headless/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Homepage
│   ├── shop/                  # Shop pages
│   │   ├── page.tsx           # Product listing
│   │   └── [slug]/            # Single product
│   │       └── page.tsx
│   ├── cart/                  # Cart page
│   │   └── page.tsx
│   ├── checkout/              # Checkout flow
│   │   └── page.tsx
│   └── account/               # Account pages
│       └── page.tsx
├── components/                 # React components
│   ├── ui/                    # Base UI components
│   ├── product/               # Product components
│   ├── cart/                  # Cart components
│   └── layout/                # Layout components
├── lib/                       # Utility functions
│   ├── woocommerce.ts        # WooCommerce API client
│   └── cart.ts               # Cart management
├── types/                     # TypeScript types
│   └── woocommerce.ts        # WooCommerce types
└── public/                    # Static assets
```

## WooCommerce Integration

### API Configuration

The site connects to the existing WooCommerce store at `olivadis.com` using the REST API v3.

Environment variables required:
- `NEXT_PUBLIC_WOOCOMMERCE_URL`: https://olivadis.com
- `WOOCOMMERCE_CONSUMER_KEY`: WooCommerce API consumer key
- `WOOCOMMERCE_CONSUMER_SECRET`: WooCommerce API consumer secret

### Available API Functions

Located in `lib/woocommerce.ts`:

- `getProducts()` - Get all products with filters
- `getProduct(id)` - Get single product
- `getCategories()` - Get product categories
- `getCategory(id)` - Get single category
- `getProductVariations(id)` - Get product variations
- `createOrder()` - Create new order
- `searchProducts()` - Search products

### Cart Management

Located in `lib/cart.ts`:

Client-side cart using localStorage:
- `getCart()` - Get current cart
- `addToCart()` - Add product to cart
- `removeFromCart()` - Remove item
- `updateCartItemQuantity()` - Update quantity
- `clearCart()` - Clear cart
- `calculateCartTotals()` - Calculate totals

## WordPress Plugin Architecture

### Olivadis Headless Integration Plugin

A custom WordPress plugin that integrates the headless Next.js frontend with WordPress backend. The plugin is organized with a modular architecture where each feature has its own dedicated file.

**Location:** `/wordpress-plugin/olivadis-headless-integration/`

### Plugin Structure

```
olivadis-headless-integration/
├── olivadis-headless-integration.php    # Main plugin file
├── includes/
│   ├── class-recipe-post-type.php       # Recipe CPT registration
│   ├── class-recipe-fields.php          # ACF field definitions
│   ├── class-revalidation-hooks.php     # Recipe webhook triggers
│   └── class-product-hooks.php          # Product webhook triggers
├── admin/
│   └── admin-settings.php               # Settings page & UI
└── README.md                            # Plugin documentation
```

### Core Features

#### 1. **Recipe Custom Post Type** (`class-recipe-post-type.php`)

Registers the `rezepte` custom post type with German labels and the following features:
- Custom taxonomy: `rezept_kategorie` (Recipe Categories)
- Default categories: Aufstriche, Salate, Dips, Hauptgerichte, Desserts, Getränke, Beilagen
- REST API enabled for headless consumption
- Supports: title, editor, thumbnail, excerpt, custom-fields
- Archive page enabled at `/rezepte/`

#### 2. **Recipe Custom Fields** (`class-recipe-fields.php`)

Registers ACF field groups programmatically (no ACF JSON required):

**Recipe Details Field Group:**
- `prep_time` (Text) - Preparation time (e.g., "5 Minuten")
- `difficulty` (Select) - Difficulty level: Sehr leicht, Leicht, Mittel, Schwer
- `servings` (Number) - Number of servings

**Ingredients Field Group:**
- `ingredients` (Repeater)
  - `amount` (Text) - Quantity (e.g., "250g")
  - `ingredient` (Text) - Ingredient name

**Instructions Field Group:**
- `instructions` (Repeater)
  - `step` (WYSIWYG) - Step-by-step instruction

**Additional Information:**
- `cooks_note` (Textarea) - Cook's tips and notes
- `nutritional_info` (Group)
  - `calories`, `protein`, `carbs`, `fat`, `fiber` (all Number fields)
- `video_url` (URL) - Optional YouTube/Vimeo URL

All fields are exposed via REST API for Next.js consumption.

#### 3. **Revalidation Webhooks** (`class-revalidation-hooks.php`)

Automatically triggers Next.js ISR (Incremental Static Regeneration) when content changes:

**Recipe Events:**
- `save_post_rezepte` - When recipe is created/updated
- `wp_trash_post` - When recipe is deleted
- `set_object_terms` - When recipe categories change

**WordPress Actions:**
- Sends POST request to `{NEXT_JS_URL}/api/revalidate`
- Includes authentication via `x-revalidate-secret` header
- Payload includes: `action`, `slug`, `post_id`, `categories`

**Supported Actions:**
- `recipe.created`
- `recipe.updated`
- `recipe.deleted`
- `recipe.category_updated`

#### 4. **Product Webhooks** (`class-product-hooks.php`)

Triggers revalidation for WooCommerce product changes:

**Product Events:**
- Product created/updated/deleted
- Product stock changed
- Product variation updated
- Product category/tag changed

**WordPress Actions:**
- `woocommerce_new_product`
- `woocommerce_update_product`
- `woocommerce_delete_product`
- `woocommerce_product_set_stock`
- `woocommerce_update_product_variation`

**Supported Actions:**
- `product.created`
- `product.updated`
- `product.deleted`
- `product.stock_changed`

#### 5. **Admin Settings Page** (`admin-settings.php`)

WordPress admin interface at **Settings > Olivadis Headless**:

**Configuration Options:**
- Next.js Site URL (e.g., `https://olivadis-headless.vercel.app`)
- Revalidation Secret Key (must match `REVALIDATION_SECRET` in Next.js)

**Features:**
- Manual revalidation trigger button
- Status dashboard showing:
  - Connection status to Next.js
  - Recent webhook activity
  - Configuration validation
  - Setup instructions

**Settings Stored:**
- `olivadis_nextjs_url` - Next.js frontend URL
- `olivadis_revalidation_secret` - Secret key for authentication

### Plugin Dependencies

- **Required:**
  - WordPress 5.0+
  - Advanced Custom Fields (ACF) 5.0+ or ACF Pro
  - WooCommerce 3.0+ (for product hooks)

- **Optional:**
  - WP REST API (included in WP 4.7+)

### Installation

1. Upload plugin to `/wp-content/plugins/olivadis-headless-integration/`
2. Install and activate Advanced Custom Fields (ACF) plugin
3. Activate "Olivadis Headless Integration" plugin
4. Navigate to Settings > Olivadis Headless
5. Configure Next.js URL and Revalidation Secret
6. Test connection using manual revalidation button

### Next.js Integration

The plugin integrates with the following Next.js files:

**API Routes:**
- `app/api/revalidate/route.ts` - Receives webhook POST requests

**Recipe Pages:**
- `app/rezepte/page.tsx` - Recipe listing page
- `app/rezepte/[slug]/page.tsx` - Single recipe page

**API Functions:**
- `lib/woocommerce/recipes.ts` - Fetches recipes from WordPress REST API

**Types:**
- `types/recipe.ts` - TypeScript interfaces for recipe data

### Environment Variables

Add to `.env.local` and Vercel:
```bash
REVALIDATION_SECRET=your-secret-key-here
```

This must match the secret configured in WordPress Admin > Settings > Olivadis Headless.

### Webhook Flow

```
WordPress Change → Plugin Hook → HTTP POST → Next.js API → Revalidate Path → Fresh Build
```

**Example:**
1. Editor creates new recipe "Griechischer Salat" in WordPress
2. Plugin detects `save_post_rezepte` action
3. Plugin sends POST to `https://olivadis-headless.vercel.app/api/revalidate`
   - Payload: `{ action: "recipe.created", slug: "griechischer-salat" }`
   - Header: `x-revalidate-secret: your-secret-key`
4. Next.js validates secret
5. Next.js revalidates `/rezepte` and `/rezepte/griechischer-salat`
6. Fresh content appears on frontend within seconds

### Security

- All webhook requests require secret authentication
- Secret validation prevents unauthorized revalidation
- WordPress sanitizes all POST data before sending
- Next.js validates all incoming webhook payloads

### Logging & Debugging

Plugin logs all webhook triggers to:
- WordPress debug.log (when `WP_DEBUG` enabled)
- Admin settings page shows recent webhook activity
- Console logs in browser (admin settings page)

Next.js logs all revalidation events to:
- Server console (visible in Vercel logs)
- Includes timestamp, action, affected paths

## Recipe System

### Recipe Pages

The recipe system consists of two main pages matching the existing olivadis.com design:

#### 1. Recipe Listing (`/rezepte`)

**Features:**
- Grid layout (1/2/3 columns responsive)
- Category filter tabs (All, Aufstriche, Salate, Dips, etc.)
- Recipe cards displaying:
  - Featured image
  - Recipe title
  - Prep time with clock icon
  - Difficulty level with badge
  - Servings count
- Hover effects with shadow elevation
- All text in German

**Implementation:**
- `app/rezepte/page.tsx`
- Fetches recipes via `getRecipes()` from WordPress REST API
- Server-side rendering with ISR revalidation
- Responsive grid using Tailwind

#### 2. Single Recipe (`/rezepte/[slug]`)

**Features:**
- Hero image with title overlay
- Recipe meta cards (prep time, difficulty, servings)
- Ingredients list with checkboxes
- Numbered step-by-step instructions
- Cook's note section (highlighted in cream background)
- Nutritional information sidebar
- Video embed (YouTube/Vimeo) if provided
- Print recipe button
- Breadcrumb navigation
- Related recipes section
- All text in German

**Implementation:**
- `app/rezepte/[slug]/page.tsx`
- Fetches single recipe via `getRecipe(slug)`
- Server-side rendering with ISR
- SEO metadata generation
- Structured data for rich snippets

### Recipe API Functions

Located in `lib/woocommerce/recipes.ts`:

```typescript
// Get all recipes with optional category filter
getRecipes(category?: string): Promise<Recipe[]>

// Get single recipe by slug
getRecipe(slug: string): Promise<Recipe>

// Get all recipe categories
getRecipeCategories(): Promise<RecipeCategory[]>

// Helper functions
formatPrepTime(minutes: number): string
getDifficultyLabel(level: string): string
calculateServingMultiplier(original: number, desired: number): number
```

### Recipe Types

Located in `types/recipe.ts`:

```typescript
interface Recipe {
  id: number
  slug: string
  title: string
  content: string
  excerpt: string
  featured_image: RecipeImage | null
  categories: RecipeCategory[]
  acf: {
    prep_time: string
    difficulty: string
    servings: number
    ingredients: RecipeIngredient[]
    instructions: RecipeInstruction[]
    cooks_note: string
    nutritional_info: NutritionalInfo
    video_url: string
  }
}
```

## Development Workflow

### Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Git Workflow

1. Create feature branch from `main`
2. Make changes
3. Run linting and type checking
4. Commit with descriptive message
5. Push and create PR
6. CI runs automatically
7. Deploy preview available via Vercel
8. Merge to `main` for production deployment

## CI/CD Pipeline

### GitHub Actions

Located in `.github/workflows/ci.yml`:

Runs on every push and PR:
1. **Lint Check** - ESLint validation
2. **Type Check** - TypeScript compilation
3. **Build** - Next.js build verification

### Vercel Deployment

- **Production**: Automatic deployment on push to `main`
- **Preview**: Automatic preview deployments for PRs
- **Environment**: Environment variables managed in Vercel dashboard

## Next Steps

1. **Extract Design Tokens from Figma**
   - Colors, typography, spacing
   - Component specifications
   - Layout patterns

2. **Build UI Component Library**
   - Button, Input, Card components
   - Navigation components
   - Product components

3. **Implement Pages**
   - Homepage
   - Product listing
   - Single product
   - Cart
   - Checkout
   - Account

4. **Add Features**
   - Search functionality
   - Filtering and sorting
   - User authentication
   - Order management
   - Payment integration

5. **Optimize**
   - Image optimization
   - SEO meta tags
   - Performance monitoring
   - Analytics integration

## Notes

- The project uses Next.js App Router (not Pages Router)
- All components should use TypeScript
- Styling with Tailwind CSS utility classes
- WooCommerce backend remains unchanged
- This is a frontend-only implementation (headless)
