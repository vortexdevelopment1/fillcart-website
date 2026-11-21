/**
 * Shop By Category Configuration (Exact Figma Specifications)
 * 
 * - Exactly 12 cards in this precise order
 * - Row 1: Cards 1 to 6
 * - Row 2: Cards 7 to 12
 * - Background color is strictly tied to POSITION (1 to 12) via CSS tokens --cat-1 .. --cat-12
 * - No name mapping, no cycling
 */

export const SHOP_BY_CATEGORY = [
  // --- ROW 1 (Cards 1 to 6) ---
  {
    position: 1,
    label: "Grocery",
    slug: "grocery",
    image: "/images/home/home-staples.png",
    color: "#EDF7E8",
    colorToken: "var(--cat-1, #EDF7E8)",
    lines: null,
  },
  {
    position: 2,
    label: "Dairy",
    slug: "dairy",
    image: "/images/home/home-dairy.png",
    color: "#EAF5F8",
    colorToken: "var(--cat-2, #EAF5F8)",
    lines: null,
  },
  {
    position: 3,
    // Space before comma as in Figma: "Chicken , Meat"
    label: "Chicken , Meat & Fish",
    slug: "chicken-meat-fish",
    alternateSlugs: ["meat", "chicken", "fish", "chicken-meat"],
    image: "/images/home/home-pet-care.png",
    color: "#FCECEC",
    colorToken: "var(--cat-3, #FCECEC)",
    lines: ["Chicken , Meat", "& Fish"],
  },
  {
    position: 4,
    label: "Electronics",
    slug: "electronics",
    image: "/images/home/home-meat.png",
    color: "#F2EFF9",
    colorToken: "var(--cat-4, #F2EFF9)",
    lines: null,
  },
  {
    position: 5,
    label: "Stationery",
    slug: "stationery",
    image: "/images/home/home-electronics.png",
    color: "#FFF1DF",
    colorToken: "var(--cat-5, #FFF1DF)",
    lines: null,
  },
  {
    position: 6,
    label: "Beauty",
    slug: "beauty",
    alternateSlugs: ["personal", "personal-care"],
    image: "/images/home/home-stationery.png",
    color: "#FCECF1",
    colorToken: "var(--cat-6, #FCECF1)",
    lines: null,
  },

  // --- ROW 2 (Cards 7 to 12) ---
  {
    position: 7,
    label: "Home Essentials",
    slug: "home-essentials",
    alternateSlugs: ["home", "household"],
    image: "/images/home/home-beauty.png",
    color: "#EEF7F5",
    colorToken: "var(--cat-7, #EEF7F5)",
    lines: null,
  },
  {
    position: 8,
    label: "Daily Care",
    slug: "daily-care",
    alternateSlugs: ["daily", "personal"],
    image: "/images/home/home-essentials.png",
    color: "#EDF3FA",
    colorToken: "var(--cat-8, #EDF3FA)",
    lines: null,
  },
  {
    position: 9,
    label: "Fragrance & Grooming",
    slug: "fragrance-grooming",
    alternateSlugs: ["fragrance", "grooming"],
    image: "/images/home/home-daily-care.png",
    color: "#FFF0EA",
    colorToken: "var(--cat-9, #FFF0EA)",
    lines: ["Fragrance &", "Grooming"],
  },
  {
    position: 10,
    label: "Sports",
    slug: "sports",
    alternateSlugs: ["fitness"],
    image: "/images/home/home-paan-corner.png",
    color: "#F1F4EE",
    colorToken: "var(--cat-10, #F1F4EE)",
    lines: null,
  },
  {
    position: 11,
    label: "Pet Care",
    slug: "pet-care",
    alternateSlugs: ["pet", "pets"],
    image: "/images/home/home-sports.png",
    color: "#FFF4DF",
    colorToken: "var(--cat-11, #FFF4DF)",
    lines: null,
  },
  {
    position: 12,
    label: "Paan Corner",
    slug: "paan-corner",
    alternateSlugs: ["paan"],
    image: "/images/home/home-fragrance.png",
    color: "#E4FFDF",
    colorToken: "var(--cat-12, #E4FFDF)",
    lines: null,
  },
];

/**
 * Resolves the route for a category card based on backend data:
 * - If a category from existing data matches label or slug, use that real id or route.
 * - If none matches, link to the existing all-categories page with label as search filter.
 */
export function getCategoryRoute(card) {
  if (!card) return "/category/grocery";
  if (card.slug) {
    return `/category/${card.slug.toLowerCase()}`;
  }
  return "/category/grocery";
}

/**
 * Resolves the image for a category card:
 * - Uses card's configured image from Figma specifications
 * - Or category's own image URL from backend data if present
 * - Otherwise falls back to /images/home/home-staples.png
 */
export function getCategoryImage(card, backendCategories = []) {
  const fallback = card?.image || "/images/home/home-staples.png";
  if (!card) return fallback;

  if (card.image) {
    return card.image;
  }

  const targetSlug = (card.slug || "").toLowerCase();
  const targetLabel = (card.label || "").toLowerCase();

  const matched = (backendCategories || []).find((b) => {
    const bKey = (b.key || b.slug || b.id || "").toLowerCase();
    const bName = (b.name || "").toLowerCase();

    if (bKey === targetSlug || bName === targetLabel) return true;
    if (card.alternateSlugs && card.alternateSlugs.includes(bKey)) return true;
    return false;
  });

  if (matched && (matched.img || matched.imageUrl || matched.image)) {
    const img = matched.img || matched.imageUrl || matched.image;
    if (!img.includes("unsplash.com")) {
      return img;
    }
  }

  return fallback;
}
