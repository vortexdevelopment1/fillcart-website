# FillCarts Customer Frontend

Standalone React + Vite frontend for the FillCarts customer-facing web application.

## Quick Start

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env`:

```env
VITE_API_URL=
VITE_GOOGLE_CLIENT_ID=
VITE_VENDOR_URL=
VITE_RIDER_URL=
```

## Architecture & Folder Structure

- `public/images/`: Organized public assets structured into kebab-case subfolders:
  - `brand/`: Brand logos (`logo.svg`, etc.)
  - `banners/`: Promotional and hero banners
  - `categories/`: Category illustrations and tiles
  - `home/`: Home category carousel images
  - `stores/`: Store storefronts and logos
  - `products/`: Product catalog images
  - `offers/`: Payment and banking promo graphics
  - `about/`: About us photos and graphics
  - `contact/`: Contact page assets
  - `icons/`: Store badges and cart buttons
- `src/config/imageMap.js`: Single source of truth for all image URLs in the application.
- `src/data/`: All catalog data, stores, sections, categories, and content currently hardcoded for fast UI rendering.
  - `storesData.js`: Store list and catalog for neighbourhood stores (including Fresh Mart reference template).
  - `categoryPageData.js`: Category page hierarchy, subcategories, and filters.
  - `homeProductsData.js`: Home sections and featured products.
- `src/components/`: Reusable modular components matching the Figma design system.
- `src/pages/`: Route pages for customer app (`/store/:slug`, `/stores`, `/category/:slug`, `/product/:slug`, profile, legal, checkout, etc.).
