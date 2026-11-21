/**
 * Single Product Lookup Helper
 * 
 * Aggregates products from:
 * 1. All Home page sections (popularRightNow, homeEssentials, dailyCare, frozenFood)
 * 2. All Category pages (categoryPages: grocery, dairy, frozen-food, beauty, etc.)
 * 
 * Provides unified search and retrieval for Product Detail pages (/product/:slug)
 * and search dropdowns, ensuring every card on Home and Category pages can be resolved.
 */
import { categoryPages } from "./categoryPageData.js";
import {
  popularRightNow,
  homeEssentials,
  dailyCare,
  frozenFood,
} from "./homeProductsData.js";
import { stores } from "./storesData.js";

/** Helper to convert string to URL-safe slug */
export function toSlug(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns an array of all products across all category pages and home sections.
 * Home products take precedence for matching images and exact card configurations.
 */
export function getAllProducts() {
  const homeProducts = [
    ...popularRightNow,
    ...homeEssentials,
    ...dailyCare,
    ...frozenFood,
  ];

  // Category products
  const categoryProducts = Object.values(categoryPages).flatMap(
    (cat) => cat.products || []
  );

  // Map to deduplicate by slug/id while preserving home product details first
  const productMap = new Map();

  // 1. Add home products first
  for (const prod of homeProducts) {
    const slugKey = prod.slug || toSlug(prod.name);
    if (slugKey && !productMap.has(slugKey)) {
      productMap.set(slugKey, prod);
    }
    if (prod.id && !productMap.has(String(prod.id))) {
      productMap.set(String(prod.id), prod);
    }
  }

  // 2. Add category products
  for (const prod of categoryProducts) {
    const slugKey = prod.slug || toSlug(prod.name);
    if (slugKey && !productMap.has(slugKey)) {
      productMap.set(slugKey, prod);
    }
    if (prod.id && !productMap.has(String(prod.id))) {
      productMap.set(String(prod.id), prod);
    }
  }

  // 3. Add store products
  const storeProducts = (stores || []).flatMap((s) =>
    (s.sections || []).flatMap((sec) => sec.products || [])
  );
  for (const prod of storeProducts) {
    if (!prod) continue;
    const slugKey = prod.slug || toSlug(prod.name);
    if (slugKey && !productMap.has(slugKey)) {
      productMap.set(slugKey, prod);
    }
    if (prod.id && !productMap.has(String(prod.id))) {
      productMap.set(String(prod.id), prod);
    }
  }

  // Return unique list of products
  return Array.from(new Set(productMap.values()));
}

/**
 * Finds a product by its slug or ID across all sources.
 */
export function findProductBySlugOrId(rawSlugOrId) {
  if (!rawSlugOrId) return null;
  const target = String(rawSlugOrId).toLowerCase().trim();
  const all = getAllProducts();

  return (
    all.find((p) => {
      if (String(p.id).toLowerCase() === target) return true;
      if (p.slug && p.slug.toLowerCase() === target) return true;
      if (toSlug(p.name) === target) return true;
      return false;
    }) || null
  );
}
