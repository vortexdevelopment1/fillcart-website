/**
 * Daily Care Products Configuration (Exact Figma Specifications)
 * 
 * 6 products in strict Figma sequence:
 * 1. Hydrating Body Lotion, 250 ml, ₹249, old price ₹299 (17% OFF)
 * 2. Daily Face Cleanser, 100 ml, ₹219, old price ₹260 (16% OFF)
 * 3. Nourishing Shampoo, 340 ml, ₹295, old price ₹340 (13% OFF)
 * 4. Fresh Bath Essentials, Set of 4, ₹449, old price ₹520 (14% OFF)
 * 5. Everyday Skin Duo, 2 pcs, ₹349, old price ₹410 (15% OFF)
 * 6. Personal Care Kit, 5 pcs, ₹499, old price ₹599 (17% OFF)
 * 
 * Discounts are calculated dynamically by <ProductCard />:
 * Math.round(((oldPrice - price) / oldPrice) * 100)
 */

export const DAILY_CARE_PRODUCTS = [
  {
    id: "daily-lotion",
    slug: "hydrating-body-lotion",
    name: "Hydrating Body Lotion",
    unit: "250 ml",
    price: 249,
    oldPrice: 299,
    image: "/images/products/hydrating-body-lotion.svg",
    categoryKey: "daily",
  },
  {
    id: "daily-cleanser",
    slug: "daily-face-cleanser",
    name: "Daily Face Cleanser",
    unit: "100 ml",
    price: 219,
    oldPrice: 260,
    image: "/images/products/daily-face-cleanser.png",
    categoryKey: "daily",
  },
  {
    id: "daily-shampoo",
    slug: "nourishing-shampoo",
    name: "Nourishing Shampoo",
    unit: "340 ml",
    price: 295,
    oldPrice: 340,
    image: "/images/products/nourishing-shampoo.png",
    categoryKey: "daily",
  },
  {
    id: "daily-bath-essentials",
    slug: "fresh-bath-essentials",
    name: "Fresh Bath Essentials",
    unit: "Set of 4",
    price: 449,
    oldPrice: 520,
    image: "/images/products/fresh-bath-essentials.png",
    categoryKey: "daily",
  },
  {
    id: "daily-skin-duo",
    slug: "everyday-skin-duo",
    name: "Everyday Skin Duo",
    unit: "2 pcs",
    price: 349,
    oldPrice: 410,
    image: "/images/products/everyday-skin-duo.png",
    categoryKey: "daily",
  },
  {
    id: "daily-personal-kit",
    slug: "personal-care-kit",
    name: "Personal Care Kit",
    unit: "5 pcs",
    price: 499,
    oldPrice: 599,
    image: "/images/products/personal-care-kit.svg",
    categoryKey: "daily",
  },
];
