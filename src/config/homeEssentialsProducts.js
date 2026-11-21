/**
 * Home Essentials Products Configuration (Exact Figma Specifications)
 * 
 * 6 products in strict Figma sequence:
 * 1. Ultra Clean Detergent, 1 kg, ₹285, old price ₹320 (11% OFF)
 * 2. Citrus Surface Cleaner, 500 ml, ₹129, old price ₹159 (19% OFF)
 * 3. Natural Cleaning Spray, 450 ml, ₹179, old price ₹210 (15% OFF)
 * 4. Glass Cleaner, 500 ml, ₹115, old price ₹135 (15% OFF)
 * 5. Home Care Kit, 4 pcs, ₹399, old price ₹475 (16% OFF)
 * 6. Kitchen Scrub Pads, Pack of 3, ₹89, old price ₹110 (19% OFF)
 * 
 * Discounts are calculated dynamically by <ProductCard />:
 * Math.round(((oldPrice - price) / oldPrice) * 100)
 */

export const HOME_ESSENTIALS_PRODUCTS = [
  {
    id: "home-detergent",
    slug: "ultra-clean-detergent",
    name: "Ultra Clean Detergent",
    unit: "1 kg",
    price: 285,
    oldPrice: 320,
    image: "/images/products/product-detergent.png",
    categoryKey: "home",
  },
  {
    id: "home-surface-cleaner",
    slug: "citrus-surface-cleaner",
    name: "Citrus Surface Cleaner",
    unit: "500 ml",
    price: 129,
    oldPrice: 159,
    image: "/images/products/citrus-surface-cleaner.svg",
    categoryKey: "home",
  },
  {
    id: "home-cleaning-spray",
    slug: "natural-cleaning-spray",
    name: "Natural Cleaning Spray",
    unit: "450 ml",
    price: 179,
    oldPrice: 210,
    image: "/images/products/natural-cleaning-spray.svg",
    categoryKey: "home",
  },
  {
    id: "home-glass-cleaner",
    slug: "glass-cleaner",
    name: "Glass Cleaner",
    unit: "500 ml",
    price: 115,
    oldPrice: 135,
    image: "/images/products/glass-cleaner.svg",
    categoryKey: "home",
  },
  {
    id: "home-care-kit",
    slug: "home-care-kit",
    name: "Home Care Kit",
    unit: "4 pcs",
    price: 399,
    oldPrice: 475,
    image: "/images/products/home-care-kit.svg",
    categoryKey: "home",
  },
  {
    id: "home-scrub-pads",
    slug: "kitchen-scrub-pads",
    name: "Kitchen Scrub Pads",
    unit: "Pack of 3",
    price: 89,
    oldPrice: 110,
    image: "/images/products/kitchen-scrub-pads.svg",
    categoryKey: "home",
  },
];
