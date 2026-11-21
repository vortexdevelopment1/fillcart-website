/**
 * Hardcoded data for Product Detail Page (/product/:slug)
 * Serves as single source of truth for product details, gallery, pack sizes,
 * schedule options, reviews, FAQs, and related products.
 */
import { categoryPages, products as categoryProducts } from "./categoryPageData.js";
import { DEFAULT_PRODUCT_IMAGE } from "../config/images.js";
import {
  popularRightNow,
  homeEssentials,
  dailyCare,
  frozenFood,
} from "./homeProductsData.js";
import { getAllProducts, findProductBySlugOrId, toSlug } from "./productLookup.js";

export { toSlug };
export const MAX_THUMBS = 5;

// Default Ratings & Reviews summary & sample reviews
export const defaultReviewsData = {
  average: 4.5,
  totalReviews: "2,348",
  breakdown: [
    { stars: 5, percentage: 75, count: 1761 },
    { stars: 4, percentage: 15, count: 352 },
    { stars: 3, percentage: 6, count: 141 },
    { stars: 2, percentage: 2, count: 47 },
    { stars: 1, percentage: 2, count: 47 },
  ],
  recentReviews: [
    {
      id: "rev-1",
      name: "Ananya Sharma",
      rating: 5,
      date: "14 Nov 2026",
      verified: true,
      text: "Extremely fresh and great quality. Delivered on time and packaging was clean.",
    },
    {
      id: "rev-2",
      name: "Rohit Verma",
      rating: 4,
      date: "10 Nov 2026",
      verified: true,
      text: "Good product, matches description. Value for money purchase.",
    },
    {
      id: "rev-3",
      name: "Pooja Patel",
      rating: 5,
      date: "04 Nov 2026",
      verified: true,
      text: "Always buy this from FillCarts. Never had an issue with quality.",
    },
  ],
};

// Default FAQs
export const defaultFaqsData = [
  {
    q: "How fast is delivery for this product?",
    a: "Orders placed before 6 PM are delivered the same day in our designated delivery windows (typically within 10-30 minutes for quick commerce zones).",
  },
  {
    q: "Can I schedule a recurring delivery for this item?",
    a: "Yes! Use the Schedule & Repeat option to get this product delivered daily, weekly, or monthly with easy pause, skip, or cancel options.",
  },
  {
    q: "What is the return policy?",
    a: "If the product arrives damaged or unsatisfied with quality, contact support within 24 hours for an instant replacement or refund to your wallet.",
  },
];

// Fallback 6 Related Products
export const relatedProducts = [
  {
    id: "rel-1",
    slug: "hydrating-body-lotion",
    name: "Hydrating Body Lotion",
    unit: "250 ml",
    price: 249,
    oldPrice: 299,
    discount: "17% OFF",
    discountPercent: 17,
    image: "/images/products/hydrating-body-lotion.svg",
  },
  {
    id: "rel-2",
    slug: "daily-face-cleanser",
    name: "Daily Face Cleanser",
    unit: "100 ml",
    price: 219,
    oldPrice: 260,
    discount: "16% OFF",
    discountPercent: 16,
    image: "/images/products/daily-face-cleanser.png",
  },
  {
    id: "rel-3",
    slug: "nourishing-shampoo",
    name: "Nourishing Shampoo",
    unit: "340 ml",
    price: 295,
    oldPrice: 340,
    discount: "13% OFF",
    discountPercent: 13,
    image: "/images/products/nourishing-shampoo.png",
  },
  {
    id: "rel-4",
    slug: "fresh-bath-essentials",
    name: "Fresh Bath Essentials",
    unit: "Set of 4",
    price: 449,
    oldPrice: 520,
    discount: "14% OFF",
    discountPercent: 14,
    image: "/images/products/fresh-bath-essentials.png",
  },
  {
    id: "rel-5",
    slug: "everyday-skin-duo",
    name: "Everyday Skin Duo",
    unit: "2 pcs",
    price: 349,
    oldPrice: 410,
    discount: "15% OFF",
    discountPercent: 15,
    image: "/images/products/everyday-skin-duo.png",
  },
  {
    id: "rel-6",
    slug: "personal-care-kit",
    name: "Personal Care Kit",
    unit: "5 pcs",
    price: 499,
    oldPrice: 599,
    discount: "17% OFF",
    discountPercent: 17,
    image: "/images/products/personal-care-kit.svg",
  },
];

/**
 * Common template builder for product overrides
 */
function buildOverride({
  name,
  slug,
  unit,
  price,
  oldPrice,
  image,
  rating = 4.8,
  reviewsCount = "2,348",
  boughtThisWeek = "5K+ bought this week", // TEMP DEFAULT
  tagline = "Fresh & Farm Sourced", // TEMP DEFAULT
  brand = "Local",
  sectionKey = "popular",
  highlights = [
    { title: "Premium Quality", sub: "100% genuine and verified product", icon: "check" }, // TEMP DEFAULT
    { title: "Safe & Hygienic", sub: "Strict quality control tested", icon: "shield" }, // TEMP DEFAULT
    { title: "Satisfaction Assured", sub: "Easy returns and replacement", icon: "book" }, // TEMP DEFAULT
  ],
  info = [
    ["Type", "Standard"], // TEMP DEFAULT
    ["Net Quantity", unit],
    ["Storage", "Store in a cool, dry place"], // TEMP DEFAULT
    ["Shelf Life", "Refer to package"], // TEMP DEFAULT
    ["Country of Origin", "India"],
  ],
}) {
  const discountPercent = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const saveAmount = Math.max(0, oldPrice - price);
  const saveText = saveAmount > 0 ? `Save ₹${saveAmount} (${discountPercent}%)` : "";

  return {
    id: slug,
    name,
    slug,
    unit,
    tagline, // TEMP DEFAULT
    badge: discountPercent > 0 ? `${discountPercent}% OFF` : "",
    rating,
    reviewsCount,
    boughtThisWeek, // TEMP DEFAULT
    price,
    oldPrice,
    saveText,
    packSizes: [
      { label: unit, price, oldPrice },
    ],
    gallery: [image], // 1 image shows single thumb, no "+N" tile
    about: "[Product description to be added.]",
    highlights, // TEMP DEFAULT
    info,
    delivery: {
      headline: "Get it by",
      highlight: "Today, 7–9 PM", // TEMP DEFAULT
      sub: "Free delivery on orders above ₹499", // TEMP DEFAULT
    },
    schedule: {
      date: "23 Nov 2026 · 7–9 PM", // TEMP DEFAULT
      frequencies: ["Daily", "Weekly", "Monthly", "Custom"],
      selected: "Weekly",
      repeatDefault: true,
      everyText: "Every Monday · 7–9 PM",
      note: "Skip, pause or cancel anytime.",
    },
    seller: {
      name: brand || "Fresh Store Direct", // TEMP DEFAULT
      rating: "4.8",
      orders: "12,450+ orders",
      badge: "Verified Local Merchant",
    },
    brand,
    sectionKey,
  };
}

/**
 * Product Overrides Map
 * Contains structured overrides for Tomato reference + EVERY Home page product.
 */
export const productOverrides = {
  // ---- Tomato Reference (Existing) ----
  tomato: {
    id: "tomato",
    name: "Tomato - Local",
    slug: "tomato",
    unit: "500 g",
    tagline: "Farm Fresh · Direct Sourced",
    badge: "15% OFF",
    rating: 4.8,
    reviewsCount: "2,348",
    boughtThisWeek: "10K+ bought this week",
    price: 34,
    oldPrice: 40,
    saveText: "Save ₹6 (15%)",
    packSizes: [
      { label: "500 g", price: 34, oldPrice: 40 },
      { label: "1 kg", price: 65, oldPrice: 78 },
      { label: "2 kg", price: 125, oldPrice: 150 },
    ],
    gallery: [
      "/product-tomato.svg",
      "/product-tomato.svg",
      "/product-tomato.svg",
      "/product-tomato.svg",
      "/product-tomato.svg",
      "/product-tomato.svg",
      "/product-tomato.svg",
      "/product-tomato.svg",
      "/product-tomato.svg",
    ],
    about: "Locally grown, hand-picked firm red tomatoes. Fresh harvest delivered straight from farm gates to your kitchen within hours.",
    highlights: [
      { title: "Farm Fresh", sub: "Harvested within 24 hours", icon: "check" },
      { title: "Zero Residue", sub: "Clean & safely washed", icon: "shield" },
      { title: "Quality Check", sub: "Graded for freshness", icon: "book" },
    ],
    info: [
      ["Type", "Vegetable"],
      ["Net Quantity", "500 g"],
      ["Storage", "Keep in a cool and dry place"],
      ["Shelf Life", "3–5 days (Refrigeration recommended)"],
      ["Country of Origin", "India"],
    ],
    delivery: {
      headline: "Get it by",
      highlight: "Today, 7–9 PM",
      sub: "Free delivery on orders above ₹499",
    },
    schedule: {
      date: "23 Nov 2026 · 7–9 PM",
      frequencies: ["Daily", "Weekly", "Monthly", "Custom"],
      selected: "Weekly",
      repeatDefault: true,
      everyText: "Every Monday · 7–9 PM",
      note: "Skip, pause or cancel anytime.",
    },
    seller: {
      name: "Fresh Farm Produce Ltd.",
      rating: "4.9",
      orders: "15,200+ orders",
      badge: "Top Rated Fresh Seller",
    },
    sectionKey: "grocery",
  },

  // ---- Popular right now ----
  "fresh-royal-apples": buildOverride({
    name: "Fresh Royal Apples",
    slug: "fresh-royal-apples",
    unit: "4 pcs • 600–700 g",
    price: 149,
    oldPrice: 169,
    image: "/images/products/product-apples.svg",
    rating: 4.8,
    reviewsCount: "2.4K",
    boughtThisWeek: "8K+ bought this week", // TEMP DEFAULT
    tagline: "Crisp & Juicy Orchard Apples", // TEMP DEFAULT
    brand: "Fresh Orchards",
    sectionKey: "popular",
    highlights: [
      { title: "Orchard Fresh", sub: "Directly sourced from Shimla", icon: "check" }, // TEMP DEFAULT
      { title: "Naturally Sweet", sub: "Crisp texture & rich aroma", icon: "shield" }, // TEMP DEFAULT
      { title: "Hand Graded", sub: "Zero bruises and wax-free", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Fresh Fruit"], // TEMP DEFAULT
      ["Net Quantity", "4 pcs • 600–700 g"],
      ["Storage", "Store in refrigerator for best crispness"], // TEMP DEFAULT
      ["Shelf Life", "7–10 days"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),

  "farm-fresh-milk": buildOverride({
    name: "Farm Fresh Milk",
    slug: "farm-fresh-milk",
    unit: "1 L",
    price: 68,
    oldPrice: 72,
    image: "/images/products/product-milk.svg",
    rating: 4.9,
    reviewsCount: "4.1K",
    boughtThisWeek: "15K+ bought this week", // TEMP DEFAULT
    tagline: "Pasteurized & Homogenized Full Cream Milk", // TEMP DEFAULT
    brand: "Amul",
    sectionKey: "popular",
    highlights: [
      { title: "Pure Dairy", sub: "No preservatives or adulterants", icon: "check" }, // TEMP DEFAULT
      { title: "Nutrient Rich", sub: "High in natural calcium & protein", icon: "shield" }, // TEMP DEFAULT
      { title: "Cold Chain", sub: "Maintained below 4°C at all times", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Dairy"], // TEMP DEFAULT
      ["Net Quantity", "1 L"],
      ["Storage", "Keep refrigerated at 4°C or below"], // TEMP DEFAULT
      ["Shelf Life", "2 days from delivery"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),

  "whole-wheat-bread": buildOverride({
    name: "Whole Wheat Bread",
    slug: "whole-wheat-bread",
    unit: "400 g",
    price: 45,
    oldPrice: 50,
    image: "/images/products/product-bread.png",
    rating: 4.7,
    reviewsCount: "1.8K",
    boughtThisWeek: "6K+ bought this week", // TEMP DEFAULT
    tagline: "100% Whole Grain Daily Bakery", // TEMP DEFAULT
    brand: "Britannia",
    sectionKey: "popular",
    highlights: [
      { title: "100% Atta", sub: "Zero refined flour (maida)", icon: "check" }, // TEMP DEFAULT
      { title: "High Fiber", sub: "Soft texture for healthy breakfast", icon: "shield" }, // TEMP DEFAULT
      { title: "Freshly Baked", sub: "Daily dispatch from bakery", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Bakery"], // TEMP DEFAULT
      ["Net Quantity", "400 g"],
      ["Storage", "Store in a cool and dry place"], // TEMP DEFAULT
      ["Shelf Life", "4–5 days"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),

  "free-range-eggs": buildOverride({
    name: "Free Range Eggs",
    slug: "free-range-eggs",
    unit: "12 pcs",
    price: 82,
    oldPrice: 90,
    image: "/images/products/product-eggs.png",
    rating: 4.8,
    reviewsCount: "3.2K",
    boughtThisWeek: "9K+ bought this week", // TEMP DEFAULT
    tagline: "Farm Clean & Protein Packed", // TEMP DEFAULT
    brand: "Farm Fresh",
    sectionKey: "popular",
    highlights: [
      { title: "Cage Free", sub: "Healthy pasture-raised hens", icon: "check" }, // TEMP DEFAULT
      { title: "High Protein", sub: "Golden yolks with rich nutrients", icon: "shield" }, // TEMP DEFAULT
      { title: "UV Sanitized", sub: "Grade A shell quality", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Poultry"], // TEMP DEFAULT
      ["Net Quantity", "12 pcs"],
      ["Storage", "Refrigeration recommended"], // TEMP DEFAULT
      ["Shelf Life", "14–21 days"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),

  "ultra-clean-detergent": buildOverride({
    name: "Ultra Clean Detergent",
    slug: "ultra-clean-detergent",
    unit: "1 kg",
    price: 285,
    oldPrice: 320,
    image: "/images/products/product-detergent.png",
    rating: 4.7,
    reviewsCount: "1.5K",
    boughtThisWeek: "4K+ bought this week", // TEMP DEFAULT
    tagline: "Tough Stain Removal & Color Protection", // TEMP DEFAULT
    brand: "Surf Excel",
    sectionKey: "home-essentials",
    highlights: [
      { title: "Deep Clean", sub: "Enzyme powered stain lifting", icon: "check" }, // TEMP DEFAULT
      { title: "Fabric Care", sub: "Prevents color fading", icon: "shield" }, // TEMP DEFAULT
      { title: "Fresh Fragrance", sub: "Long-lasting floral scent", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Laundry Detergent"], // TEMP DEFAULT
      ["Net Quantity", "1 kg"],
      ["Storage", "Store in a dry location"], // TEMP DEFAULT
      ["Shelf Life", "24 months"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),

  "pure-sunflower-oil": buildOverride({
    name: "Pure Sunflower Oil",
    slug: "pure-sunflower-oil",
    unit: "1 L",
    price: 165,
    oldPrice: 180,
    image: "/images/products/product-oil.png",
    rating: 4.8,
    reviewsCount: "2.9K",
    boughtThisWeek: "7K+ bought this week", // TEMP DEFAULT
    tagline: "Light & Healthy Everyday Cooking Oil", // TEMP DEFAULT
    brand: "Fortune",
    sectionKey: "popular",
    highlights: [
      { title: "Heart Healthy", sub: "Enriched with Vitamins A & D", icon: "check" }, // TEMP DEFAULT
      { title: "Low Absorb", sub: "Light on food & easy to digest", icon: "shield" }, // TEMP DEFAULT
      { title: "Triple Refined", sub: "Clean high smoke point", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Edible Oil"], // TEMP DEFAULT
      ["Net Quantity", "1 L"],
      ["Storage", "Store away from direct sunlight"], // TEMP DEFAULT
      ["Shelf Life", "9 months"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),

  // ---- Home essentials ----
  "citrus-surface-cleaner": buildOverride({
    name: "Citrus Surface Cleaner",
    slug: "citrus-surface-cleaner",
    unit: "500 ml",
    price: 129,
    oldPrice: 159,
    image: "/images/products/citrus-surface-cleaner.svg",
    rating: 4.6,
    reviewsCount: "1.1K",
    boughtThisWeek: "3K+ bought this week", // TEMP DEFAULT
    tagline: "99.9% Germ Protection & Sparkling Citrus Shine", // TEMP DEFAULT
    brand: "Lizol",
    sectionKey: "home-essentials",
    highlights: [
      { title: "Disinfectant", sub: "Kills 99.9% illness-causing germs", icon: "check" }, // TEMP DEFAULT
      { title: "Streak Free", sub: "Safe on tiles, marble & granite", icon: "shield" }, // TEMP DEFAULT
      { title: "Zesty Citrus", sub: "Deodorizes with natural lemon fragrance", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Floor & Surface Cleaner"], // TEMP DEFAULT
      ["Net Quantity", "500 ml"],
      ["Storage", "Keep container tightly closed"], // TEMP DEFAULT
      ["Shelf Life", "24 months"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),

  "natural-cleaning-spray": buildOverride({
    name: "Natural Cleaning Spray",
    slug: "natural-cleaning-spray",
    unit: "450 ml",
    price: 179,
    oldPrice: 210,
    image: "/images/products/natural-cleaning-spray.svg",
    rating: 4.7,
    reviewsCount: "850",
    boughtThisWeek: "2K+ bought this week", // TEMP DEFAULT
    tagline: "Eco-Friendly Multi-Surface Spray", // TEMP DEFAULT
    brand: "Colin",
    sectionKey: "home-essentials",
    highlights: [
      { title: "Plant Derived", sub: "Biodegradable natural surfactants", icon: "check" }, // TEMP DEFAULT
      { title: "Child & Pet Safe", sub: "Non-toxic & harsh chemical free", icon: "shield" }, // TEMP DEFAULT
      { title: "Multi-Surface", sub: "Perfect for countertops and tables", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Multi-Surface Spray"], // TEMP DEFAULT
      ["Net Quantity", "450 ml"],
      ["Storage", "Store at room temperature"], // TEMP DEFAULT
      ["Shelf Life", "18 months"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),

  "glass-cleaner": buildOverride({
    name: "Glass Cleaner",
    slug: "glass-cleaner",
    unit: "500 ml",
    price: 115,
    oldPrice: 135,
    image: "/images/products/glass-cleaner.svg",
    rating: 4.8,
    reviewsCount: "2.3K",
    boughtThisWeek: "5K+ bought this week", // TEMP DEFAULT
    tagline: "Shine Boosters for Mirrors & Glass", // TEMP DEFAULT
    brand: "Colin",
    sectionKey: "home-essentials",
    highlights: [
      { title: "Zero Residue", sub: "Crystal clear streak-free finish", icon: "check" }, // TEMP DEFAULT
      { title: "Fast Action", sub: "Dissolves grease & fingerprint marks", icon: "shield" }, // TEMP DEFAULT
      { title: "Anti-Dust", sub: "Repels dust settlement for days", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Glass Cleaner"], // TEMP DEFAULT
      ["Net Quantity", "500 ml"],
      ["Storage", "Store away from heat and open flame"], // TEMP DEFAULT
      ["Shelf Life", "24 months"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),

  "home-care-kit": buildOverride({
    name: "Home Care Kit",
    slug: "home-care-kit",
    unit: "4 pcs",
    price: 399,
    oldPrice: 475,
    image: "/images/products/home-care-kit.svg",
    rating: 4.9,
    reviewsCount: "940",
    boughtThisWeek: "2.5K+ bought this week", // TEMP DEFAULT
    tagline: "Complete Household Cleaning Bundle", // TEMP DEFAULT
    brand: "Local",
    sectionKey: "home-essentials",
    highlights: [
      { title: "All-in-One", sub: "Floor, glass, dishwash & scrub bundle", icon: "check" }, // TEMP DEFAULT
      { title: "Value Pack", sub: "Save up to 16% over individual items", icon: "shield" }, // TEMP DEFAULT
      { title: "Family Protection", sub: "Comprehensive hygiene solution", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Cleaning Kit"], // TEMP DEFAULT
      ["Net Quantity", "4 pcs"],
      ["Storage", "Store in a dry cool place"], // TEMP DEFAULT
      ["Shelf Life", "24 months"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),

  "kitchen-scrub-pads": buildOverride({
    name: "Kitchen Scrub Pads",
    slug: "kitchen-scrub-pads",
    unit: "Pack of 3",
    price: 89,
    oldPrice: 110,
    image: "/images/products/kitchen-scrub-pads.svg",
    rating: 4.6,
    reviewsCount: "1.7K",
    boughtThisWeek: "4K+ bought this week", // TEMP DEFAULT
    tagline: "Heavy Duty Cookware & Utensil Scrubbers", // TEMP DEFAULT
    brand: "Scotch-Brite",
    sectionKey: "home-essentials",
    highlights: [
      { title: "Durable Fiber", sub: "Resists shredding and odor buildup", icon: "check" }, // TEMP DEFAULT
      { title: "Stain Removal", sub: "Tough on burnt stains, gentle on hands", icon: "shield" }, // TEMP DEFAULT
      { title: "Multi-Pack", sub: "Long-lasting pack of 3 pads", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Kitchen Accessory"], // TEMP DEFAULT
      ["Net Quantity", "Pack of 3"],
      ["Storage", "Wash and dry after each use"], // TEMP DEFAULT
      ["Shelf Life", "Reusable"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),

  // ---- Daily care ----
  "hydrating-body-lotion": buildOverride({
    name: "Hydrating Body Lotion",
    slug: "hydrating-body-lotion",
    unit: "250 ml",
    price: 249,
    oldPrice: 299,
    image: "/images/products/hydrating-body-lotion.svg",
    rating: 4.8,
    reviewsCount: "3.5K",
    boughtThisWeek: "8K+ bought this week", // TEMP DEFAULT
    tagline: "48-Hour Deep Moisture for Smooth Skin", // TEMP DEFAULT
    brand: "Nivea",
    sectionKey: "daily-care",
    highlights: [
      { title: "Deep Moisture", sub: "Enriched with natural shea butter", icon: "check" }, // TEMP DEFAULT
      { title: "Fast Absorbing", sub: "Non-greasy lightweight formula", icon: "shield" }, // TEMP DEFAULT
      { title: "Dermatologically Tested", sub: "Suitable for all skin types", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Body Care"], // TEMP DEFAULT
      ["Net Quantity", "250 ml"],
      ["Storage", "Store below 30°C"], // TEMP DEFAULT
      ["Shelf Life", "30 months"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),

  "daily-face-cleanser": buildOverride({
    name: "Daily Face Cleanser",
    slug: "daily-face-cleanser",
    unit: "100 ml",
    price: 219,
    oldPrice: 260,
    image: "/images/products/daily-face-cleanser.png",
    rating: 4.7,
    reviewsCount: "2.1K",
    boughtThisWeek: "6K+ bought this week", // TEMP DEFAULT
    tagline: "Gentle Neem & Aloe Vera Purifying Wash", // TEMP DEFAULT
    brand: "Himalaya",
    sectionKey: "daily-care",
    highlights: [
      { title: "Herbal Actives", sub: "Neem and turmeric purify pores", icon: "check" }, // TEMP DEFAULT
      { title: "Soap Free", sub: "Non-drying pH balanced formula", icon: "shield" }, // TEMP DEFAULT
      { title: "Acne Control", sub: "Helps prevent daily breakouts", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Facial Care"], // TEMP DEFAULT
      ["Net Quantity", "100 ml"],
      ["Storage", "Store in a cool dry place"], // TEMP DEFAULT
      ["Shelf Life", "24 months"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),

  "nourishing-shampoo": buildOverride({
    name: "Nourishing Shampoo",
    slug: "nourishing-shampoo",
    unit: "340 ml",
    price: 295,
    oldPrice: 340,
    image: "/images/products/nourishing-shampoo.png",
    rating: 4.6,
    reviewsCount: "1.9K",
    boughtThisWeek: "5K+ bought this week", // TEMP DEFAULT
    tagline: "Intense Moisture & Damage Repair Formula", // TEMP DEFAULT
    brand: "Dove",
    sectionKey: "daily-care",
    highlights: [
      { title: "Nutritive Serum", sub: "Revives dry and damaged strands", icon: "check" }, // TEMP DEFAULT
      { title: "Smooth & Silky", sub: "Tangle-free hair wash after wash", icon: "shield" }, // TEMP DEFAULT
      { title: "Daily Gentle", sub: "Mild enough for everyday use", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Hair Care"], // TEMP DEFAULT
      ["Net Quantity", "340 ml"],
      ["Storage", "Store away from direct heat"], // TEMP DEFAULT
      ["Shelf Life", "24 months"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),

  "fresh-bath-essentials": buildOverride({
    name: "Fresh Bath Essentials",
    slug: "fresh-bath-essentials",
    unit: "Set of 4",
    price: 449,
    oldPrice: 520,
    image: "/images/products/fresh-bath-essentials.png",
    rating: 4.8,
    reviewsCount: "1.2K",
    boughtThisWeek: "3.5K+ bought this week", // TEMP DEFAULT
    tagline: "Refreshing Aromatherapy Body & Bath Kit", // TEMP DEFAULT
    brand: "Local",
    sectionKey: "daily-care",
    highlights: [
      { title: "Complete Set", sub: "Body wash, loofah, bar soap & oil", icon: "check" }, // TEMP DEFAULT
      { title: "Relaxing Scent", sub: "Infused with botanical extracts", icon: "shield" }, // TEMP DEFAULT
      { title: "Skin Friendly", sub: "Paraben free & nourishing", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Bath & Body Set"], // TEMP DEFAULT
      ["Net Quantity", "Set of 4"],
      ["Storage", "Keep dry when not in use"], // TEMP DEFAULT
      ["Shelf Life", "24 months"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),

  "everyday-skin-duo": buildOverride({
    name: "Everyday Skin Duo",
    slug: "everyday-skin-duo",
    unit: "2 pcs",
    price: 349,
    oldPrice: 410,
    image: "/images/products/everyday-skin-duo.png",
    rating: 4.7,
    reviewsCount: "1.4K",
    boughtThisWeek: "4K+ bought this week", // TEMP DEFAULT
    tagline: "Brightening Day Serum & Night Cream Combo", // TEMP DEFAULT
    brand: "Garnier",
    sectionKey: "daily-care",
    highlights: [
      { title: "Vitamin C Boost", sub: "Evens out tone and dark spots", icon: "check" }, // TEMP DEFAULT
      { title: "24h Glow", sub: "Hydrating gel cream texture", icon: "shield" }, // TEMP DEFAULT
      { title: "Tested Formula", sub: "Non-comedogenic & dermatologist approved", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Skincare Duo"], // TEMP DEFAULT
      ["Net Quantity", "2 pcs"],
      ["Storage", "Store in a cool dark place"], // TEMP DEFAULT
      ["Shelf Life", "36 months"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),

  "personal-care-kit": buildOverride({
    name: "Personal Care Kit",
    slug: "personal-care-kit",
    unit: "5 pcs",
    price: 499,
    oldPrice: 599,
    image: "/images/products/personal-care-kit.svg",
    rating: 4.9,
    reviewsCount: "820",
    boughtThisWeek: "2K+ bought this week", // TEMP DEFAULT
    tagline: "Essential Grooming & Wellness Bundle", // TEMP DEFAULT
    brand: "Local",
    sectionKey: "daily-care",
    highlights: [
      { title: "Head to Toe", sub: "Includes face, body and hair essentials", icon: "check" }, // TEMP DEFAULT
      { title: "Travel Friendly", sub: "TSA approved packaging included", icon: "shield" }, // TEMP DEFAULT
      { title: "Top Rated", sub: "Consistent 4.9 customer satisfaction", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Personal Care Kit"], // TEMP DEFAULT
      ["Net Quantity", "5 pcs"],
      ["Storage", "Store in pouch provided"], // TEMP DEFAULT
      ["Shelf Life", "24 months"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),

  // ---- Frozen food ----
  "classic-french-fries": buildOverride({
    name: "Classic French Fries",
    slug: "classic-french-fries",
    unit: "500 g",
    price: 145,
    oldPrice: 175,
    image: "/images/products/classic-french-fries.svg",
    rating: 4.8,
    reviewsCount: "3.1K",
    boughtThisWeek: "10K+ bought this week", // TEMP DEFAULT
    tagline: "Crispy Golden Restaurant Style Fries", // TEMP DEFAULT
    brand: "McCain",
    sectionKey: "frozen-food",
    highlights: [
      { title: "Ready in 3 Mins", sub: "Deep fry, air fry or bake crisp", icon: "check" }, // TEMP DEFAULT
      { title: "100% Real Potato", sub: "Selected quality Russet potatoes", icon: "shield" }, // TEMP DEFAULT
      { title: "Zero Trans Fat", sub: "Cholesterol free & lightly salted", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Frozen Snack"], // TEMP DEFAULT
      ["Net Quantity", "500 g"],
      ["Storage", "Store below -18°C in freezer"], // TEMP DEFAULT
      ["Shelf Life", "12 months"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),

  "garden-green-peas": buildOverride({
    name: "Garden Green Peas",
    slug: "garden-green-peas",
    unit: "500 g",
    price: 119,
    oldPrice: 140,
    image: "/images/products/garden-green-peas.svg",
    rating: 4.7,
    reviewsCount: "2.5K",
    boughtThisWeek: "8K+ bought this week", // TEMP DEFAULT
    tagline: "Sweet & Tender Farm Picked Green Peas", // TEMP DEFAULT
    brand: "Amul",
    sectionKey: "frozen-food",
    highlights: [
      { title: "IQF Frozen", sub: "Individually quick frozen for freshness", icon: "check" }, // TEMP DEFAULT
      { title: "No Preservatives", sub: "100% natural color and taste", icon: "shield" }, // TEMP DEFAULT
      { title: "Sweet & Tender", sub: "Harvested at peak maturity", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Frozen Vegetable"], // TEMP DEFAULT
      ["Net Quantity", "500 g"],
      ["Storage", "Keep frozen at -18°C"], // TEMP DEFAULT
      ["Shelf Life", "12 months"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),

  "mixed-vegetables": buildOverride({
    name: "Mixed Vegetables",
    slug: "mixed-vegetables",
    unit: "500 g",
    price: 135,
    oldPrice: 160,
    image: "/images/products/mixed-vegetables.svg",
    rating: 4.6,
    reviewsCount: "1.8K",
    boughtThisWeek: "5K+ bought this week", // TEMP DEFAULT
    tagline: "Peas, Carrots, Sweet Corn & Green Beans Blend", // TEMP DEFAULT
    brand: "Vadilal",
    sectionKey: "frozen-food",
    highlights: [
      { title: "Nutrient Locked", sub: "Flash frozen right after harvest", icon: "check" }, // TEMP DEFAULT
      { title: "Ready to Cook", sub: "Peeled and diced convenience", icon: "shield" }, // TEMP DEFAULT
      { title: "Versatile Mix", sub: "Ideal for curries, fried rice & soup", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Frozen Vegetable Blend"], // TEMP DEFAULT
      ["Net Quantity", "500 g"],
      ["Storage", "Keep frozen at -18°C"], // TEMP DEFAULT
      ["Shelf Life", "12 months"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),

  "margherita-pizza": buildOverride({
    name: "Margherita Pizza",
    slug: "margherita-pizza",
    unit: "300 g",
    price: 229,
    oldPrice: 275,
    image: "/images/products/margherita-pizza.png",
    rating: 4.9,
    reviewsCount: "4.2K",
    boughtThisWeek: "12K+ bought this week", // TEMP DEFAULT
    tagline: "Thin Crust Real Mozzarella & Herb Tomato Sauce", // TEMP DEFAULT
    brand: "Amul",
    sectionKey: "frozen-food",
    highlights: [
      { title: "100% Mozzarella", sub: "Rich creamy cheese pull", icon: "check" }, // TEMP DEFAULT
      { title: "Oven or Tawa", sub: "Bakes to perfection in 8 minutes", icon: "shield" }, // TEMP DEFAULT
      { title: "Authentic Crust", sub: "Hand-stretched artisan sourdough", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Frozen Ready Meal"], // TEMP DEFAULT
      ["Net Quantity", "300 g"],
      ["Storage", "Store frozen at -18°C"], // TEMP DEFAULT
      ["Shelf Life", "9 months"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),

  "vanilla-sprinkle-cone": buildOverride({
    name: "Vanilla Sprinkle Cone",
    slug: "vanilla-sprinkle-cone",
    unit: "4 pcs",
    price: 199,
    oldPrice: 235,
    image: "/images/products/vanilla-sprinkle-cone.png",
    rating: 4.8,
    reviewsCount: "2.9K",
    boughtThisWeek: "7K+ bought this week", // TEMP DEFAULT
    tagline: "Crunchy Waffle Cone with Rich Vanilla & Chocolate Dip", // TEMP DEFAULT
    brand: "Vadilal",
    sectionKey: "frozen-food",
    highlights: [
      { title: "Crunchy Tip", sub: "Chocolate filled waffle cone bottom", icon: "check" }, // TEMP DEFAULT
      { title: "Real Dairy Cream", sub: "Silky smooth vanilla ice cream", icon: "shield" }, // TEMP DEFAULT
      { title: "Family Pack", sub: "4 individually wrapped cones", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Ice Cream & Desserts"], // TEMP DEFAULT
      ["Net Quantity", "4 pcs"],
      ["Storage", "Keep frozen below -18°C"], // TEMP DEFAULT
      ["Shelf Life", "6 months"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),

  "ready-meal-bowl": buildOverride({
    name: "Ready Meal Bowl",
    slug: "ready-meal-bowl",
    unit: "350 g",
    price: 189,
    oldPrice: 225,
    image: "/images/products/ready-meal-bowl.png",
    rating: 4.5,
    reviewsCount: "1.1K",
    boughtThisWeek: "3K+ bought this week", // TEMP DEFAULT
    tagline: "Chef Curated Instant Gourmet Meal", // TEMP DEFAULT
    brand: "Local",
    sectionKey: "frozen-food",
    highlights: [
      { title: "Microwave Ready", sub: "Heat for 4 minutes and enjoy", icon: "check" }, // TEMP DEFAULT
      { title: "Balanced Meal", sub: "Protein, carbs and fragrant gravy", icon: "shield" }, // TEMP DEFAULT
      { title: "No Artificial Colors", sub: "Wholesome authentic ingredients", icon: "book" }, // TEMP DEFAULT
    ],
    info: [
      ["Type", "Ready to Eat"], // TEMP DEFAULT
      ["Net Quantity", "350 g"],
      ["Storage", "Keep frozen below -18°C"], // TEMP DEFAULT
      ["Shelf Life", "6 months"], // TEMP DEFAULT
      ["Country of Origin", "India"],
    ],
  }),
};

/**
 * Returns full product detail for a given slug or id.
 * Uses unified single product lookup (productLookup.js) and computes contextual
 * "You may also like" related products from the same section or category.
 */
export function getProductDetail(rawSlugOrId) {
  if (!rawSlugOrId) return null;

  const targetSlug = toSlug(rawSlugOrId);

  // Helper to compute related products from same section/category
  const getContextualRelated = (currentProd, sectionKey) => {
    let candidates = [];

    // 1. From Home section if applicable
    if (sectionKey === "popular") candidates = popularRightNow;
    else if (sectionKey === "home-essentials") candidates = homeEssentials;
    else if (sectionKey === "daily-care") candidates = dailyCare;
    else if (sectionKey === "frozen-food") candidates = frozenFood;

    // 2. From Category if applicable
    if (!candidates.length && currentProd?.categorySlug && categoryPages[currentProd.categorySlug]) {
      candidates = categoryPages[currentProd.categorySlug].products || [];
    }

    // Filter out current product
    const filtered = candidates.filter(
      (p) => toSlug(p.slug || p.name) !== targetSlug && String(p.id) !== String(currentProd.id)
    );

    // Map to related card format
    const mapped = filtered.map((p) => {
      const pPrice = Number(p.price || 0);
      const pOld = Number(p.oldPrice || pPrice);
      const disc = pOld > pPrice ? Math.round(((pOld - pPrice) / pOld) * 100) : 0;
      return {
        id: p.id || p.slug,
        slug: p.slug || toSlug(p.name),
        name: p.name,
        unit: p.unit || "1 unit",
        price: pPrice,
        oldPrice: pOld,
        discount: disc > 0 ? `${disc}% OFF` : "",
        discountPercent: disc,
        image: p.image || DEFAULT_PRODUCT_IMAGE,
      };
    });

    // Supplement with fallback related if fewer than 6, excluding current
    if (mapped.length < 6) {
      for (const rel of relatedProducts) {
        if (rel.slug !== targetSlug && !mapped.some((m) => m.slug === rel.slug)) {
          mapped.push(rel);
        }
        if (mapped.length >= 6) break;
      }
    }

    return mapped.slice(0, 6);
  };

  // 1. Check exact overrides
  if (productOverrides[targetSlug]) {
    const override = productOverrides[targetSlug];
    return {
      ...override,
      reviewsData: defaultReviewsData,
      faqsData: defaultFaqsData,
      relatedProducts: getContextualRelated(override, override.sectionKey),
    };
  }

  // 2. Unified lookup across all categories and home sections
  const baseProduct = findProductBySlugOrId(rawSlugOrId);

  if (!baseProduct) {
    return null;
  }

  const name = baseProduct.name;
  const unit = baseProduct.unit || "500 g";
  const price = Number(baseProduct.price || 0);
  const oldPrice = Number(baseProduct.oldPrice || price);
  const discountPercent =
    baseProduct.discountPercent ||
    (oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0);

  const saveAmount = Math.max(0, oldPrice - price);
  const saveText =
    saveAmount > 0
      ? `Save ₹${saveAmount} (${discountPercent}%)`
      : "";

  const mainImg = baseProduct.image || DEFAULT_PRODUCT_IMAGE;

  // Build standard pack sizes
  const packSizes = [
    { label: unit, price, oldPrice },
  ];

  // Standard gallery (repeat up to 5 times)
  const gallery = [mainImg, mainImg, mainImg, mainImg, mainImg];

  const sectionKey = baseProduct.section || baseProduct.categorySlug;

  return {
    id: baseProduct.id || baseProduct.slug,
    name,
    slug: baseProduct.slug || toSlug(name),
    unit,
    tagline: "Fresh & Farm Sourced", // TEMP DEFAULT
    badge: discountPercent > 0 ? `${discountPercent}% OFF` : "",
    rating: baseProduct.rating || 4.5,
    reviewsCount: baseProduct.ratingCount
      ? baseProduct.ratingCount.replace(/[^0-9Kk,]/g, "")
      : "1,850",
    boughtThisWeek: "10K+ bought this week", // TEMP DEFAULT
    price,
    oldPrice,
    saveText,
    packSizes,
    gallery,
    about: "[Product description to be added.]",
    highlights: [
      { title: "Quality Sourced", sub: "Strict quality control tested", icon: "check" }, // TEMP DEFAULT
      { title: "Safe & Hygienic", sub: "Handled with care and food-grade packaging", icon: "shield" }, // TEMP DEFAULT
      { title: "Best Value", sub: "Great price with quick doorstep delivery", icon: "book" }, // TEMP DEFAULT
    ], // TEMP DEFAULT
    info: [
      ["Net Quantity", unit],
      ["Country of Origin", "India"],
    ],
    delivery: {
      headline: "Get it by",
      highlight: "Today, 7–9 PM", // TEMP DEFAULT
      sub: "Free delivery on orders above ₹499", // TEMP DEFAULT
    },
    schedule: {
      date: "23 Nov 2026 · 7–9 PM", // TEMP DEFAULT
      frequencies: ["Daily", "Weekly", "Monthly", "Custom"],
      selected: "Weekly",
      repeatDefault: true,
      everyText: "Every Monday · 7–9 PM",
      note: "Skip, pause or cancel anytime.",
    },
    seller: {
      name: baseProduct.brand || "Fresh Store Direct", // TEMP DEFAULT
      rating: "4.8",
      orders: "12,450+ orders",
      badge: "Verified Local Merchant",
    },
    reviewsData: defaultReviewsData,
    faqsData: defaultFaqsData,
    relatedProducts: getContextualRelated(baseProduct, sectionKey),
  };
}
