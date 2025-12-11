# Olivadis Headless Store

A modern, headless ecommerce store for Olivadis built with Next.js, TypeScript, and WooCommerce.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: WooCommerce REST API
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions + Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- WooCommerce API credentials from olivadis.com

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd olivadis-headless
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your WooCommerce API credentials.

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Building

Build the project for production:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Project Structure

```
olivadis-headless/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── lib/                    # Utility functions and API clients
├── types/                  # TypeScript type definitions
├── public/                 # Static assets
└── .github/workflows/      # GitHub Actions CI/CD
```

## CI/CD

This project uses:
- **GitHub Actions** for automated testing and type checking
- **Vercel** for continuous deployment

### GitHub Actions Workflow

The CI pipeline runs on every push and pull request:
1. Lint check (ESLint)
2. Type check (TypeScript)
3. Build verification

### Vercel Deployment

- Automatically deploys on push to `main` branch
- Preview deployments for pull requests
- Environment variables managed in Vercel dashboard

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_WOOCOMMERCE_URL`: Your WooCommerce site URL (e.g., https://olivadis.com)
- `WOOCOMMERCE_CONSUMER_KEY`: WooCommerce REST API consumer key
- `WOOCOMMERCE_CONSUMER_SECRET`: WooCommerce REST API consumer secret

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure tests pass and types check
4. Submit a pull request

## License

Private - All rights reserved
