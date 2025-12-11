# Olivadis Headless Store - Setup Guide

Welcome to the Olivadis headless ecommerce store! This guide will help you get started.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure WooCommerce API

1. Go to your WordPress Admin: `https://olivadis.com/wp-admin`
2. Navigate to: **WooCommerce > Settings > Advanced > REST API**
3. Click **"Add Key"**
4. Fill in the details:
   - **Description**: "Headless Store"
   - **User**: Select your admin user
   - **Permissions**: Read/Write
5. Click **"Generate API Key"**
6. Copy your **Consumer Key** and **Consumer Secret**

### 3. Create Environment File

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your WooCommerce credentials:

```env
# Your WordPress/WooCommerce site URL
WP_BASE_URL=https://olivadis.com

# WooCommerce REST API Credentials (from step 2)
WOO_CONSUMER_KEY=ck_your_actual_consumer_key_here
WOO_CONSUMER_SECRET=cs_your_actual_consumer_secret_here
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your store!

## 📁 Project Structure

```
olivadis-headless/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Homepage
│   ├── shop/                # Shop listing page
│   ├── product/[slug]/      # Single product pages
│   ├── checkout/            # Checkout flow
│   └── api/                 # API routes
├── components/              # React components
│   ├── cart/               # Cart components
│   ├── product/            # Product components
│   ├── checkout/           # Checkout components
│   └── ui/                 # UI components (Button, Input, etc.)
├── lib/                    # Utilities and contexts
│   ├── woocommerce/        # WooCommerce API integration
│   ├── cart-context.tsx    # Cart state management
│   └── currency-context.tsx # Currency management
└── types/                  # TypeScript type definitions
```

## 🎨 Design System

The site uses the Olivadis design system with:

### Colors
- **Primary Green**: `#1C4220` (Olivadis-Grün)
- **Primary Light**: `#3B6912` (Accent green)
- **Primary Dark**: `#0B180C` (Dark text)
- **Cream**: `#F2E9DB` (Secondary color)
- **Cream Light**: `#FCFBF7` (Background)

### Typography
- **Font Sans**: Helvetica Neue, Helvetica, Arial
- **Font Serif**: Lora (for italic brand name in headings)

Use Tailwind classes:
- `text-h1` - Hero headings (88px)
- `text-h2` - Section headings (56px)
- `text-h3` - Card titles (26.6px)
- `text-h4` - Smaller headings (24px)
- `text-body` - Default text (16px)
- `text-body-lg` - Large text (20px)
- `text-body-sm` - Small text (13.3px)
- `text-price` - Product prices (24px)
- `text-button` - Button labels (16.1px)

## 🛒 Features

### Implemented
- ✅ Product catalog with WooCommerce integration
- ✅ Shopping cart (client-side, localStorage)
- ✅ Product variations support
- ✅ Checkout flow
- ✅ Order creation via WooCommerce API
- ✅ Responsive design
- ✅ Olivadis brand design system
- ✅ Server-side rendering with Next.js 15

### Pages
- **Home** (`/`) - Hero section, featured products, story
- **Shop** (`/shop`) - Product listing grid
- **Product** (`/product/[slug]`) - Single product details
- **Checkout** (`/checkout`) - Billing, shipping, order review
- **Order Success** (`/checkout/success`) - Order confirmation

## 🔧 Development

### Build for Production

```bash
npm run build
```

### Run Production Build

```bash
npm start
```

### Type Check

```bash
npm run type-check
```

### Lint

```bash
npm run lint
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `WP_BASE_URL`
   - `WOO_CONSUMER_KEY`
   - `WOO_CONSUMER_SECRET`
4. Deploy!

### Environment Variables for Production

Make sure to set these in your hosting platform:

```env
WP_BASE_URL=https://olivadis.com
WOO_CONSUMER_KEY=ck_...
WOO_CONSUMER_SECRET=cs_...
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 📦 WooCommerce Requirements

Your WooCommerce store should have:

1. **REST API enabled** (Settings > Advanced > REST API)
2. **Products published** with:
   - Name, description, price
   - At least one product image
   - Stock status configured
3. **Shipping methods configured** (optional, for checkout)
4. **Payment methods configured** (PayPal, Stripe, etc.)

## 🎯 Next Steps

After setup, you can:

1. **Customize the design** - Edit `tailwind.config.ts`
2. **Add more products** - Manage in WordPress admin
3. **Configure shipping** - Set up shipping zones in WooCommerce
4. **Add payment methods** - Configure in WooCommerce settings
5. **Customize pages** - Edit files in `app/` directory

## 🐛 Troubleshooting

### "WooCommerce credentials not configured"

- Check your `.env.local` file
- Make sure you're using `WP_BASE_URL`, `WOO_CONSUMER_KEY`, and `WOO_CONSUMER_SECRET`
- Restart your dev server after changing env variables

### Products not showing

- Verify products are published in WooCommerce
- Check WooCommerce API credentials are correct
- Check browser console for API errors

### Cart not persisting

- Cart uses localStorage - make sure it's enabled in your browser
- Check browser console for errors

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [WooCommerce REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Support

For issues or questions:
- Check `STYLEGUIDE.md` for design system details
- Check `components/checkout/README.md` for checkout documentation
- Review `.claude/CLAUDE.md` for project architecture

---

**Ready to sell amazing olive oil! 🫒**
