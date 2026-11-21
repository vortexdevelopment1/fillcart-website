/**
 * Nearby Stores Data
 * 
 * Hardcoded data for the 5 verified neighbourhood stores on FillCarts.
 * UI ONLY: No backend or external API dependencies.
 * Placeholder values in brackets are preserved as per design specifications.
 */

import { DEFAULT_PRODUCT_IMAGE } from "../config/images.js";
import { STORE_IMAGE_MAP } from "../utils/productImages.js";
import { categoryPages } from "./categoryPageData.js";
import { imageMap } from "../config/imageMap.js";

/** Tile image per store section title using imageMap */
export function getSectionTileImage(title) {
  if (!title) return imageMap.categoryTile?.fallback || "/images/categories/category-fallback.png";
  const t = title.trim();
  switch (t) {
    case "Atta, Dal & Rice":
    case "Staples & Grains":
      return imageMap.categoryTile?.attaDalRice || "/images/categories/atta-dal-rice.svg";
    case "Oil, Ghee & Masala":
      return imageMap.categoryTile?.oilGheeMasala || "/images/categories/oil-ghee-masala.svg";
    case "Dry Fruits & Breakfast":
    case "Breakfast & Pantry":
      return imageMap.categoryTile?.dryFruitsBreakfast || "/images/categories/dry-fruits-breakfast.svg";
    case "Fruits & Veggies":
    case "Fresh Vegetables":
    case "Root Vegetables":
    case "Salad Vegetables":
    case "Organic Fruits":
    case "Citrus & Berries":
    case "Leafy Greens":
    case "Leafy & Herbs":
    case "Herbs & Aromatics":
      return imageMap.categoryTile?.fruitsVeggies || "/images/categories/fruits-veggies.svg";
    case "Dairy":
    case "Dairy & Eggs":
      return imageMap.categoryTile?.dairy || "/images/categories/dairy.svg";
    case "Eggs, Meat & Fish":
      return imageMap.categoryTile?.eggsMeatFish || "/images/categories/eggs-meat-fish.svg";
    case "Snacks & Beverages":
    case "Savoury Snacks":
      return imageMap.categoryTile?.snacksBeverages || "/images/categories/snacks-beverages.svg";
    case "Biscuits & Cookies":
    case "Cookies & Biscuits":
    case "Cookies & Snacks":
    case "Biscuits & Spreads":
    case "Packaged Food":
      return imageMap.categoryTile?.biscuitsCookies || "/images/categories/biscuits-cookies.svg";
    case "Cleaning & Laundry":
    case "Home Essentials":
      return imageMap.homeCategoryTile?.homeEssentials || "/images/home/home-beauty.png";
    case "Bath & Body":
    case "Oral & Hygiene":
    case "Personal Care":
    case "Hygiene & Care":
      return imageMap.homeCategoryTile?.dailyCare || "/images/home/home-essentials.png";
    case "Skin & Lip Care":
      return imageMap.homeCategoryTile?.beauty || "/images/home/home-stationery.png";
    default:
      return imageMap.categoryTile?.fallback || "/images/categories/category-fallback.png";
  }
}

/** Resolves store cover and logo using imageMap with fallback to hardcoded URLs */
export function resolveStoreMedia(store) {
  if (!store) return { cover: "", logo: "" };
  const slug = store.slug || "";
  const camelSlug = slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

  // Check imageMap.storeCover: if key exists in imageMap.storeCover, use its value
  let mappedCover = undefined;
  if (imageMap.storeCover) {
    if (slug in imageMap.storeCover) {
      mappedCover = imageMap.storeCover[slug];
    } else if (camelSlug in imageMap.storeCover) {
      mappedCover = imageMap.storeCover[camelSlug];
    } else if (slug.includes("fresh-mart") || slug.includes("fresh-market") || slug.includes("freshmart")) {
      mappedCover = imageMap.storeCover["fresh-mart-supermarket"] ?? imageMap.storeCover.freshMarket;
    } else if (slug.includes("daily")) {
      mappedCover = imageMap.storeCover["daily-needs-express"] ?? imageMap.storeCover["daily-needs"];
    } else if (slug.includes("indore")) {
      mappedCover = imageMap.storeCover["indore-grocery"];
    } else if (slug.includes("sharma")) {
      mappedCover = imageMap.storeCover["sharma-super-store"];
    } else if (slug.includes("city-mart")) {
      mappedCover = imageMap.storeCover["city-mart"];
    } else if (slug.includes("bakery")) {
      mappedCover = imageMap.storeCover["city-artisan-bakery"] ?? imageMap.storeCover["city-mart"];
    } else if (slug.includes("green") || slug.includes("organic")) {
      mappedCover = imageMap.storeCover["green-leaf-farm-organics"] ?? imageMap.storeCover["indore-grocery"];
    } else if (slug.includes("pharmacy") || slug.includes("medplus") || slug.includes("wellness")) {
      mappedCover = imageMap.storeCover["medplus-pharmacy-wellness"] ?? imageMap.storeCover["sharma-super-store"];
    }
  }

  // Check imageMap.storeLogo: if key exists in imageMap.storeLogo, use its value
  let mappedLogo = undefined;
  if (imageMap.storeLogo) {
    if (slug in imageMap.storeLogo) {
      mappedLogo = imageMap.storeLogo[slug];
    } else if (camelSlug in imageMap.storeLogo) {
      mappedLogo = imageMap.storeLogo[camelSlug];
    } else if (slug.includes("fresh-mart") || slug.includes("fresh-market") || slug.includes("freshmart")) {
      mappedLogo = imageMap.storeLogo["fresh-mart-supermarket"] ?? imageMap.storeLogo.freshMarket;
    } else if (slug.includes("daily")) {
      mappedLogo = imageMap.storeLogo["daily-needs-express"] ?? imageMap.storeLogo["daily-needs"];
    } else if (slug.includes("indore")) {
      mappedLogo = imageMap.storeLogo["indore-grocery"];
    } else if (slug.includes("sharma")) {
      mappedLogo = imageMap.storeLogo["sharma-super-store"];
    } else if (slug.includes("city-mart")) {
      mappedLogo = imageMap.storeLogo["city-mart"];
    } else if (slug.includes("bakery")) {
      mappedLogo = imageMap.storeLogo["city-artisan-bakery"] ?? imageMap.storeLogo["city-mart"];
    } else if (slug.includes("green") || slug.includes("organic")) {
      mappedLogo = imageMap.storeLogo["green-leaf-farm-organics"] ?? imageMap.storeLogo["indore-grocery"];
    } else if (slug.includes("pharmacy") || slug.includes("medplus") || slug.includes("wellness")) {
      mappedLogo = imageMap.storeLogo["medplus-pharmacy-wellness"] ?? imageMap.storeLogo["sharma-super-store"];
    }
  }

  const rawCover = mappedCover !== undefined ? mappedCover : (store.cover && !String(store.cover).includes("unsplash.com") ? store.cover : null);
  const rawLogo = mappedLogo ? mappedLogo : (store.logo && !String(store.logo).includes("unsplash.com") ? store.logo : rawCover);

  const cover = rawCover ? encodeURI(rawCover) : "";
  const logo = rawLogo ? encodeURI(rawLogo) : cover;

  return { cover, logo };
}

// Helper to find existing product from categoryPages
function findExistingCategoryProduct(slug) {
  for (const cat of Object.values(categoryPages)) {
    if (Array.isArray(cat.products)) {
      const found = cat.products.find((p) => p.slug === slug);
      if (found) return found;
    }
  }
  return null;
}

export const FRESH_MART_BEST_SELLERS = [
      {
        id: "store-fresh-mart-capsicum-green",
        slug: "capsicum-green",
        name: "Capsicum (Green)",
        image: "/images/products/green-capsicum.svg",
        unit: "500 g",
        optionsCount: 2,
        rating: 4.8,
        ratingCount: "2.4K",
        discountPercent: 16,
        price: 48,
        oldPrice: 60,
        inStock: true,
        brand: "Fresh Mart",
        badge: "16% OFF",
      },
      {
        id: "store-fresh-mart-carrot",
        slug: "carrot",
        name: "Carrot",
        image: "/images/products/fresh-carrots.svg",
        unit: "500 g",
        optionsCount: 2,
        rating: 4.7,
        ratingCount: "3.1K",
        discountPercent: 16,
        price: 32,
        oldPrice: 38,
        inStock: true,
        brand: "Fresh Mart",
        badge: "16% OFF",
      },
      {
        id: "store-fresh-mart-cauliflower",
        slug: "cauliflower",
        name: "Cauliflower",
        image: "/images/products/fresh-cauliflower.svg",
        unit: "1 pc",
        optionsCount: 1,
        rating: 4.5,
        ratingCount: "1.8K",
        discountPercent: 15,
        price: 56,
        oldPrice: 66,
        inStock: true,
        brand: "Fresh Mart",
        badge: "15% OFF",
      },
      {
        id: "store-fresh-mart-cucumber",
        slug: "cucumber",
        name: "Cucumber",
        image: "/images/products/cucumber.png",
        unit: "500 g",
        optionsCount: 2,
        rating: 4.7,
        ratingCount: "2.2K",
        discountPercent: 12,
        price: 28,
        oldPrice: 32,
        inStock: true,
        brand: "Fresh Mart",
        badge: "12% OFF",
      },
    ];

export const FRESH_MART_SECTIONS = [
      {
        id: "atta-dal-rice",
        title: "Atta, Dal & Rice",
        tileImage: getSectionTileImage("Atta, Dal & Rice"),
        products: [
          findExistingCategoryProduct("aashirvaad-atta") || {
            id: "store-fm-aashirvaad-atta",
            slug: "aashirvaad-atta",
            name: "Aashirvaad Shuddh Chakki Atta",
            image: "/images/products/whole-wheat-atta-flour.svg",
            unit: "5 kg",
            optionsCount: 2,
            rating: 4.9,
            ratingCount: "2.1K",
            discountPercent: 13,
            price: 235,
            oldPrice: 270,
            inStock: true,
            brand: "Aashirvaad",
          },
          findExistingCategoryProduct("basmati-rice") || {
            id: "store-fm-basmati-rice",
            slug: "basmati-rice",
            name: "Fortune Royal Basmati Rice",
            image: "/images/products/royal-basmati-rice.svg",
            unit: "5 kg",
            optionsCount: 2,
            rating: 4.8,
            ratingCount: "1.8K",
            discountPercent: 17,
            price: 349,
            oldPrice: 420,
            inStock: true,
            brand: "Fortune",
          },
          findExistingCategoryProduct("toor-dal") || {
            id: "store-fm-toor-dal",
            slug: "toor-dal",
            name: "Tata Sampann Toor Dal",
            image: "/images/products/toor-dal-pulses.svg",
            unit: "1 kg",
            optionsCount: 1,
            rating: 4.8,
            ratingCount: "1.4K",
            discountPercent: 15,
            price: 165,
            oldPrice: 195,
            inStock: true,
            brand: "Tata Sampann",
          },
          findExistingCategoryProduct("sugar") || {
            id: "store-fm-sugar",
            slug: "sugar",
            name: "Refined Pure Sugar",
            image: "/images/products/refined-pure-sugar.svg",
            unit: "1 kg",
            optionsCount: 1,
            rating: 4.6,
            ratingCount: "980",
            discountPercent: 13,
            price: 48,
            oldPrice: 55,
            inStock: true,
            brand: "Madhur",
          },
          findExistingCategoryProduct("tata-salt") || {
            id: "store-fm-tata-salt",
            slug: "tata-salt",
            name: "Tata Salt Vacuum Evaporated",
            image: "/images/products/tata-salt.svg",
            unit: "1 kg",
            optionsCount: 1,
            rating: 4.9,
            ratingCount: "3.2K",
            discountPercent: 7,
            price: 28,
            oldPrice: 30,
            inStock: true,
            brand: "Tata",
          },
        ],
      },
      {
        id: "oil-ghee-masala",
        title: "Oil, Ghee & Masala",
        tileImage: getSectionTileImage("Oil, Ghee & Masala"),
        products: [
          findExistingCategoryProduct("fortune-sunflower-oil") || {
            id: "store-fm-sunflower-oil",
            slug: "fortune-sunflower-oil",
            name: "Fortune Refined Sunflower Oil",
            image: "/images/products/fortune-sunflower-oil.svg",
            unit: "1 L",
            optionsCount: 2,
            rating: 4.7,
            ratingCount: "2.5K",
            discountPercent: 16,
            price: 135,
            oldPrice: 160,
            inStock: true,
            brand: "Fortune",
          },
          findExistingCategoryProduct("pure-ghee") || {
            id: "store-fm-pure-ghee",
            slug: "pure-ghee",
            name: "Pure Cow Desi Ghee",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "500 ml",
            optionsCount: 2,
            rating: 4.9,
            ratingCount: "2.0K",
            discountPercent: 10,
            price: 385,
            oldPrice: 430,
            inStock: true,
            brand: "Amul",
          },
          {
            id: "store-fm-turmeric-powder",
            slug: "turmeric-powder",
            name: "Everest Turmeric Powder",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "200 g",
            optionsCount: 1,
            rating: 4.8,
            ratingCount: "1.1K",
            discountPercent: 14,
            price: 62,
            oldPrice: 72,
            inStock: true,
            brand: "Everest",
          },
          {
            id: "store-fm-red-chilli",
            slug: "red-chilli-powder",
            name: "Everest Kashmiri Lal Mirch",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "100 g",
            optionsCount: 1,
            rating: 4.7,
            ratingCount: "950",
            discountPercent: 13,
            price: 85,
            oldPrice: 98,
            inStock: true,
            brand: "Everest",
          },
          {
            id: "store-fm-garam-masala",
            slug: "garam-masala",
            name: "Catch Super Garam Masala",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "100 g",
            optionsCount: 1,
            rating: 4.8,
            ratingCount: "820",
            discountPercent: 13,
            price: 78,
            oldPrice: 90,
            inStock: true,
            brand: "Catch",
          },
        ],
      },
      {
        id: "dry-fruits-breakfast",
        title: "Dry Fruits & Breakfast",
        tileImage: getSectionTileImage("Dry Fruits & Breakfast"),
        products: [
          {
            id: "store-fm-corn-flakes",
            slug: "corn-flakes",
            name: "Kellogg's Corn Flakes Original",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "475 g",
            optionsCount: 1,
            rating: 4.8,
            ratingCount: "1.9K",
            discountPercent: 16,
            price: 185,
            oldPrice: 220,
            inStock: true,
            brand: "Kellogg's",
          },
          {
            id: "store-fm-quaker-oats",
            slug: "quaker-oats",
            name: "Quaker Rolled Oats",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "1 kg",
            optionsCount: 1,
            rating: 4.7,
            ratingCount: "1.5K",
            discountPercent: 16,
            price: 190,
            oldPrice: 225,
            inStock: true,
            brand: "Quaker",
          },
          {
            id: "store-fm-california-almonds",
            slug: "california-almonds",
            name: "Premium California Almonds",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "500 g",
            optionsCount: 2,
            rating: 4.8,
            ratingCount: "2.2K",
            discountPercent: 16,
            price: 420,
            oldPrice: 499,
            inStock: true,
            brand: "Nutraj",
          },
          {
            id: "store-fm-whole-cashews",
            slug: "whole-cashews",
            name: "Premium Whole Cashews W320",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "250 g",
            optionsCount: 1,
            rating: 4.7,
            ratingCount: "1.3K",
            discountPercent: 16,
            price: 260,
            oldPrice: 310,
            inStock: true,
            brand: "Nutraj",
          },
          {
            id: "store-fm-dabur-honey",
            slug: "dabur-honey",
            name: "Dabur 100% Pure Honey",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "500 g",
            optionsCount: 1,
            rating: 4.8,
            ratingCount: "2.8K",
            discountPercent: 17,
            price: 199,
            oldPrice: 240,
            inStock: true,
            brand: "Dabur",
          },
        ],
      },
      {
        id: "fruits-veggies",
        title: "Fruits & Veggies",
        tileImage: getSectionTileImage("Fruits & Veggies"),
        products: [
          findExistingCategoryProduct("capsicum-green") || {
            id: "store-fm-capsicum-green",
            slug: "capsicum-green",
            name: "Capsicum (Green)",
            image: "/images/products/green-capsicum.svg",
            unit: "500 g",
            optionsCount: 2,
            rating: 4.8,
            ratingCount: "2.4K",
            discountPercent: 16,
            price: 48,
            oldPrice: 60,
            inStock: true,
            brand: "Fresh Mart",
          },
          findExistingCategoryProduct("carrot") || {
            id: "store-fm-carrot",
            slug: "carrot",
            name: "Carrot",
            image: "/images/products/fresh-carrots.svg",
            unit: "500 g",
            optionsCount: 2,
            rating: 4.7,
            ratingCount: "3.1K",
            discountPercent: 16,
            price: 32,
            oldPrice: 38,
            inStock: true,
            brand: "Fresh Mart",
          },
          findExistingCategoryProduct("cauliflower") || {
            id: "store-fm-cauliflower",
            slug: "cauliflower",
            name: "Cauliflower",
            image: "/images/products/fresh-cauliflower.svg",
            unit: "1 pc",
            optionsCount: 1,
            rating: 4.5,
            ratingCount: "1.8K",
            discountPercent: 15,
            price: 56,
            oldPrice: 66,
            inStock: true,
            brand: "Fresh Mart",
          },
          findExistingCategoryProduct("cucumber") || {
            id: "store-fm-cucumber",
            slug: "cucumber",
            name: "Cucumber",
            image: "/images/products/cucumber.png",
            unit: "500 g",
            optionsCount: 2,
            rating: 4.7,
            ratingCount: "2.2K",
            discountPercent: 12,
            price: 28,
            oldPrice: 32,
            inStock: true,
            brand: "Fresh Mart",
          },
          findExistingCategoryProduct("tomato") || {
            id: "store-fm-tomato",
            slug: "tomato",
            name: "Tomato",
            image: "/images/products/fresh-tomato.svg",
            unit: "500 g",
            optionsCount: 2,
            rating: 4.8,
            ratingCount: "3.5K",
            discountPercent: 15,
            price: 34,
            oldPrice: 40,
            inStock: true,
            brand: "Fresh Mart",
          },
          findExistingCategoryProduct("potato") || {
            id: "store-fm-potato",
            slug: "potato",
            name: "Potato",
            image: "/images/products/potato.png",
            unit: "1 kg",
            optionsCount: 1,
            rating: 4.7,
            ratingCount: "2.9K",
            discountPercent: 12,
            price: 26,
            oldPrice: 30,
            inStock: true,
            brand: "Fresh Mart",
          },
          findExistingCategoryProduct("onion") || {
            id: "store-fm-onion",
            slug: "onion",
            name: "Red Onion",
            image: "/images/products/fresh-red-onion.svg",
            unit: "1 kg",
            optionsCount: 1,
            rating: 4.5,
            ratingCount: "3.1K",
            discountPercent: 15,
            price: 32,
            oldPrice: 38,
            inStock: true,
            brand: "Fresh Mart",
          },
        ],
      },
      {
        id: "dairy",
        title: "Dairy",
        tileImage: getSectionTileImage("Dairy"),
        products: [
          findExistingCategoryProduct("amul-taaza-milk") || {
            id: "store-fm-amul-taaza-milk",
            slug: "amul-taaza-milk",
            name: "Amul Taaza Toned Milk",
            image: "/images/products/product-milk.svg",
            unit: "1 L",
            optionsCount: 2,
            rating: 4.9,
            ratingCount: "3.6K",
            discountPercent: 4,
            price: 54,
            oldPrice: 56,
            inStock: true,
            brand: "Amul",
          },
          findExistingCategoryProduct("amul-butter") || {
            id: "store-fm-amul-butter",
            slug: "amul-butter",
            name: "Amul Butter",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "500 g",
            optionsCount: 2,
            rating: 4.9,
            ratingCount: "2.7K",
            discountPercent: 4,
            price: 275,
            oldPrice: 285,
            inStock: true,
            brand: "Amul",
          },
          findExistingCategoryProduct("fresh-paneer") || {
            id: "store-fm-fresh-paneer",
            slug: "fresh-paneer",
            name: "Fresh Soft Malai Paneer",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "200 g",
            optionsCount: 1,
            rating: 4.8,
            ratingCount: "2.1K",
            discountPercent: 12,
            price: 92,
            oldPrice: 105,
            inStock: true,
            brand: "Amul",
          },
          findExistingCategoryProduct("fresh-curd-dahi") || {
            id: "store-fm-fresh-curd-dahi",
            slug: "fresh-curd-dahi",
            name: "Fresh Curd (Dahi)",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "400 g",
            optionsCount: 1,
            rating: 4.7,
            ratingCount: "1.4K",
            discountPercent: 13,
            price: 35,
            oldPrice: 40,
            inStock: true,
            brand: "Mother Dairy",
          },
          findExistingCategoryProduct("amul-cheese-slices") || {
            id: "store-fm-cheese-slices",
            slug: "amul-cheese-slices",
            name: "Processed Cheese Slices",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "200 g",
            optionsCount: 1,
            rating: 4.8,
            ratingCount: "1.9K",
            discountPercent: 12,
            price: 145,
            oldPrice: 165,
            inStock: true,
            brand: "Amul",
          },
        ],
      },
      {
        id: "eggs-meat-fish",
        title: "Eggs, Meat & Fish",
        tileImage: getSectionTileImage("Eggs, Meat & Fish"),
        products: [
          findExistingCategoryProduct("farm-eggs") || {
            id: "store-fm-farm-eggs",
            slug: "farm-eggs",
            name: "Farm Fresh White Eggs",
            image: "/images/products/product-eggs.png",
            unit: "Pack of 6",
            optionsCount: 2,
            rating: 4.8,
            ratingCount: "2.6K",
            discountPercent: 13,
            price: 52,
            oldPrice: 60,
            inStock: true,
            brand: "Eggoz",
          },
          findExistingCategoryProduct("chicken-curry-cut") || {
            id: "store-fm-chicken-curry-cut",
            slug: "chicken-curry-cut",
            name: "Fresh Chicken Curry Cut",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "500 g",
            optionsCount: 1,
            rating: 4.8,
            ratingCount: "1.9K",
            discountPercent: 15,
            price: 165,
            oldPrice: 195,
            inStock: true,
            brand: "Fresh Mart",
          },
          findExistingCategoryProduct("chicken-breast-boneless") || {
            id: "store-fm-chicken-breast",
            slug: "chicken-breast-boneless",
            name: "Fresh Chicken Breast Boneless",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "450 g",
            optionsCount: 1,
            rating: 4.9,
            ratingCount: "1.6K",
            discountPercent: 14,
            price: 210,
            oldPrice: 245,
            inStock: true,
            brand: "Fresh Mart",
          },
          findExistingCategoryProduct("mutton-curry-cut") || {
            id: "store-fm-mutton-curry-cut",
            slug: "mutton-curry-cut",
            name: "Fresh Mutton Curry Cut",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "500 g",
            optionsCount: 1,
            rating: 4.7,
            ratingCount: "820",
            discountPercent: 13,
            price: 420,
            oldPrice: 480,
            inStock: true,
            brand: "Fresh Mart",
          },
          findExistingCategoryProduct("rohu-fish-cleaned") || {
            id: "store-fm-rohu-fish",
            slug: "rohu-fish-cleaned",
            name: "Fresh Rohu Fish Cleaned Steaks",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "500 g",
            optionsCount: 1,
            rating: 4.6,
            ratingCount: "710",
            discountPercent: 13,
            price: 199,
            oldPrice: 230,
            inStock: true,
            brand: "Fresh Mart",
          },
        ],
      },
      {
        id: "snacks-beverages",
        title: "Snacks & Beverages",
        tileImage: getSectionTileImage("Snacks & Beverages"),
        products: [
          findExistingCategoryProduct("maggi-noodles") || {
            id: "store-fm-maggi-noodles",
            slug: "maggi-noodles",
            name: "Maggi 2-Minute Masala Noodles",
            image: "/images/products/instant-noodles.svg",
            unit: "4-Pack",
            optionsCount: 2,
            rating: 4.9,
            ratingCount: "3.4K",
            discountPercent: 13,
            price: 56,
            oldPrice: 64,
            inStock: true,
            brand: "Maggi",
          },
          findExistingCategoryProduct("tata-tea-gold") || {
            id: "store-fm-tata-tea-gold",
            slug: "tata-tea-gold",
            name: "Tata Tea Gold Rich Taste",
            image: "/images/products/tata-tea-gold.svg",
            unit: "500 g",
            optionsCount: 1,
            rating: 4.8,
            ratingCount: "2.1K",
            discountPercent: 13,
            price: 295,
            oldPrice: 340,
            inStock: true,
            brand: "Tata",
          },
          {
            id: "store-fm-orange-juice",
            slug: "orange-juice",
            name: "Real Fruit Power Orange Juice",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "1 L",
            optionsCount: 1,
            rating: 4.7,
            ratingCount: "1.4K",
            discountPercent: 15,
            price: 110,
            oldPrice: 130,
            inStock: true,
            brand: "Real",
          },
          {
            id: "store-fm-potato-chips",
            slug: "potato-chips",
            name: "Lay's Classic Salted Potato Chips",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "115 g",
            optionsCount: 1,
            rating: 4.6,
            ratingCount: "2.5K",
            discountPercent: 20,
            price: 40,
            oldPrice: 50,
            inStock: true,
            brand: "Lay's",
          },
          {
            id: "store-fm-cold-coffee",
            slug: "cold-coffee",
            name: "Nescafe Iced Latte Cold Coffee",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "180 ml",
            optionsCount: 1,
            rating: 4.7,
            ratingCount: "1.2K",
            discountPercent: 14,
            price: 60,
            oldPrice: 70,
            inStock: true,
            brand: "Nescafe",
          },
        ],
      },
      {
        id: "biscuits-cookies",
        title: "Biscuits & Cookies",
        tileImage: getSectionTileImage("Biscuits & Cookies"),
        products: [
          {
            id: "store-fm-parle-g",
            slug: "parle-g",
            name: "Parle-G Gold Glucose Biscuits",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "1 kg",
            optionsCount: 1,
            rating: 4.8,
            ratingCount: "2.8K",
            discountPercent: 12,
            price: 115,
            oldPrice: 130,
            inStock: true,
            brand: "Parle",
          },
          {
            id: "store-fm-good-day-cashew",
            slug: "good-day-cashew",
            name: "Britannia Good Day Cashew Cookies",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "600 g",
            optionsCount: 1,
            rating: 4.8,
            ratingCount: "2.3K",
            discountPercent: 17,
            price: 120,
            oldPrice: 145,
            inStock: true,
            brand: "Britannia",
          },
          {
            id: "store-fm-bourbon",
            slug: "bourbon-chocolate",
            name: "Britannia Bourbon Chocolate Cream",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "300 g",
            optionsCount: 1,
            rating: 4.8,
            ratingCount: "1.9K",
            discountPercent: 17,
            price: 75,
            oldPrice: 90,
            inStock: true,
            brand: "Britannia",
          },
          {
            id: "store-fm-oreo",
            slug: "oreo-original",
            name: "Cadbury Oreo Vanilla Cream Sandwich",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "300 g",
            optionsCount: 1,
            rating: 4.9,
            ratingCount: "3.1K",
            discountPercent: 15,
            price: 85,
            oldPrice: 100,
            inStock: true,
            brand: "Cadbury",
          },
          {
            id: "store-fm-digestive",
            slug: "nutri-choice-digestive",
            name: "Britannia NutriChoice Hi-Fibre Digestive",
            image: DEFAULT_PRODUCT_IMAGE,
            unit: "1 kg",
            optionsCount: 1,
            rating: 4.7,
            ratingCount: "1.7K",
            discountPercent: 17,
            price: 195,
            oldPrice: 235,
            inStock: true,
            brand: "Britannia",
          },
        ],
      },
    ];

export const stores = [
  {
    slug: "fresh-mart-supermarket",
    name: "FreshMart",
    eyebrow: "YOUR EVERYDAY GROCERY",
    tags: "Grocery · Vegetables · Daily Needs",
    area: "[Area]", // TEMP DEFAULT
    city: "[City]", // TEMP DEFAULT
    cover: imageMap.storeCover["fresh-mart-supermarket"],
    logo: imageMap.storeLogo["fresh-mart-supermarket"],
    verified: true,
    logoText: "FM",
    rating: 4.8,
    ratingCount: "1.2K",
    deliveryTime: "12 min",
    distance: "0.8 km",
    minOrder: 149,
    freeDeliveryAbove: 199,
    isOpen: true, // TEMP DEFAULT
    openUntil: "11 PM",
    hours: "7 AM – 11 PM",
    licenceLabel: "FSSAI licence",
    offers: [
      { title: "10% off up to ₹[50]", sub: "Use code STORE10" }, // TEMP DEFAULT
      { title: "Free delivery", sub: "On orders above ₹399" }, // TEMP DEFAULT
      { title: "Bank offer", sub: "Up to 10% off with [Bank]" }, // TEMP DEFAULT
    ],
    about: "[Short description of the store: what it sells, how long it has been in the neighbourhood and what makes it special.]", // TEMP DEFAULT
    address: "[Shop no., street, area, city, PIN]", // TEMP DEFAULT
    phone: "[Phone number]", // TEMP DEFAULT
    licence: "[Licence number]", // TEMP DEFAULT
    ratingBars: [82, 12, 4, 1, 1], // TEMP DEFAULT
    reviews: [
      { name: "[Customer name]", text: "[Sample review text.]", rating: 5 }, // TEMP DEFAULT
      { name: "[Customer name]", text: "[Sample review text.]", rating: 5 }, // TEMP DEFAULT
    ],
    bestSellers: FRESH_MART_BEST_SELLERS,
    sections: FRESH_MART_SECTIONS,
  },
  {
    slug: "daily-needs-express",
    name: "Daily Needs",
    eyebrow: "HOUSEHOLD & ESSENTIALS",
    tags: "Groceries · Daily Needs · Essentials",
    area: "[Area]", // TEMP DEFAULT
    city: "[City]", // TEMP DEFAULT
    cover: imageMap.storeCover["daily-needs-express"],
    logo: imageMap.storeLogo["daily-needs-express"],
    verified: true,
    logoText: "DN",
    rating: 4.7,
    ratingCount: "1.1K",
    deliveryTime: "18 min",
    distance: "1.2 km",
    freeDeliveryAbove: 299,
    bestSellers: FRESH_MART_BEST_SELLERS,
    sections: FRESH_MART_SECTIONS,
  },
  {
    slug: "indore-grocery",
    name: "Indore Grocery",
    eyebrow: "FRESH & ESSENTIALS",
    tags: "Grocery · Daily Essentials",
    area: "[Area]", // TEMP DEFAULT
    city: "[City]", // TEMP DEFAULT
    cover: imageMap.storeCover["indore-grocery"],
    logo: imageMap.storeLogo["indore-grocery"],
    verified: true,
    logoText: "IG",
    rating: 4.9,
    ratingCount: "1.5K",
    deliveryTime: "20 min",
    distance: "1.5 km",
    freeDeliveryAbove: 249,
    bestSellers: FRESH_MART_BEST_SELLERS,
    sections: FRESH_MART_SECTIONS,
  },
  {
    slug: "sharma-super-store",
    name: "Sharma Super Store",
    eyebrow: "LOCAL & ORGANIC PRODUCE",
    tags: "Organic · Fruits · Vegetables",
    area: "[Area]", // TEMP DEFAULT
    city: "[City]", // TEMP DEFAULT
    cover: imageMap.storeCover["sharma-super-store"],
    logo: imageMap.storeLogo["sharma-super-store"],
    verified: true,
    logoText: "SS",
    rating: 4.6,
    ratingCount: "1.9K",
    deliveryTime: "24 min",
    distance: "1.9 km",
    freeDeliveryAbove: 199,
    bestSellers: FRESH_MART_BEST_SELLERS,
    sections: FRESH_MART_SECTIONS,
  },
  {
    slug: "city-mart",
    name: "City Mart",
    eyebrow: "FRESH FROM THE MARKET",
    tags: "Fruits · Vegetables · Market",
    area: "[Area]", // TEMP DEFAULT
    city: "[City]", // TEMP DEFAULT
    cover: imageMap.storeCover["city-mart"],
    logo: imageMap.storeLogo["city-mart"],
    verified: true,
    logoText: "CM",
    rating: 4.7,
    ratingCount: "2.3K",
    deliveryTime: "28 min",
    distance: "2.3 km",
    freeDeliveryAbove: 199,
    bestSellers: FRESH_MART_BEST_SELLERS,
    sections: FRESH_MART_SECTIONS,
  },
  {
    slug: "green-leaf-farm-organics",
    name: "Green Leaf Farm Organics",
    eyebrow: "FARM FRESH & ORGANIC",
    tags: "Organic · Fruits · Vegetables",
    area: "[Area]", // TEMP DEFAULT
    city: "[City]", // TEMP DEFAULT
    cover: imageMap.storeCover["green-leaf-farm-organics"],
    logo: imageMap.storeLogo["green-leaf-farm-organics"],
    verified: true,
    logoText: "GL",
    rating: 4.8,
    ratingCount: "1.4K",
    deliveryTime: "20 min",
    distance: "1.5 km",
    freeDeliveryAbove: 249,
    bestSellers: FRESH_MART_BEST_SELLERS,
    sections: FRESH_MART_SECTIONS,
  },
  {
    slug: "medplus-pharmacy-wellness",
    name: "MedPlus Pharmacy & Wellness",
    eyebrow: "PHARMACY & WELLNESS",
    tags: "Medicines · Wellness · Personal Care",
    area: "[Area]", // TEMP DEFAULT
    city: "[City]", // TEMP DEFAULT
    cover: imageMap.storeCover["medplus-pharmacy-wellness"],
    logo: imageMap.storeLogo["medplus-pharmacy-wellness"],
    verified: true,
    logoText: "MP",
    rating: 4.6,
    ratingCount: "2.1K",
    deliveryTime: "24 min",
    distance: "1.9 km",
    freeDeliveryAbove: 199,
    bestSellers: FRESH_MART_BEST_SELLERS,
    sections: FRESH_MART_SECTIONS,
  },
  {
    slug: "city-artisan-bakery",
    name: "City Artisan Bakery",
    eyebrow: "FRESH FROM THE OVEN",
    tags: "Bakery · Bread · Cakes · Snacks",
    area: "[Area]", // TEMP DEFAULT
    city: "[City]", // TEMP DEFAULT
    cover: imageMap.storeCover["city-artisan-bakery"],
    logo: imageMap.storeLogo["city-artisan-bakery"],
    verified: true,
    logoText: "CA",
    rating: 4.7,
    ratingCount: "890",
    deliveryTime: "28 min",
    distance: "2.3 km",
    freeDeliveryAbove: 199,
    bestSellers: FRESH_MART_BEST_SELLERS,
    sections: FRESH_MART_SECTIONS,
  },
];

/**
 * Retrieves a store by its slug
 */
export function getStore(slug) {
  if (!slug) return null;
  const target = String(slug).toLowerCase().trim();
  let directMatch = stores.find((s) => s.slug.toLowerCase() === target);
  let store = directMatch;
  if (!store) {
    if (target === "fresh-market" || target === "fresh-mart" || target === "freshmart") {
      store = stores.find((s) => s.slug === "fresh-mart-supermarket");
    } else if (target === "daily-needs") {
      store = stores.find((s) => s.slug === "daily-needs-express");
    } else if (target === "green-leaf-farm-organics" || target === "organic-greens") {
      store = stores.find((s) => s.slug === "green-leaf-farm-organics" || s.slug === "indore-grocery");
    } else if (target === "medplus-pharmacy-wellness" || target === "wellness-corner-pharmacy") {
      store = stores.find((s) => s.slug === "medplus-pharmacy-wellness" || s.slug === "sharma-super-store");
    } else if (target === "city-artisan-bakery") {
      store = stores.find((s) => s.slug === "city-artisan-bakery" || s.slug === "city-mart");
    }
  }
  if (!store) return null;

  const { cover, logo } = resolveStoreMedia(store);
  return {
    ...store,
    cover,
    logo,
    sections: (store.sections || []).map((sec) => ({
      ...sec,
      tileImage: sec.tileImage || getSectionTileImage(sec.title),
    })),
  };
}
