/**
* Popular Products Configuration (Exact Figma Specifications)
* 
* Exactly 6 items for the "Popular right now" section:
* 1. Fresh Royal Apples (4 pcs • 600–700 g, ₹149, old ₹169) -> 12% OFF
* 2. Farm Fresh Milk (1 L, ₹68, old ₹72) -> 6% OFF
* 3. Whole Wheat Bread (400 g, ₹45, old ₹50) -> 10% OFF
* 4. Free Range Eggs (12 pcs, ₹82, old ₹90) -> 9% OFF
* 5. Ultra Clean Detergent (1 kg, ₹285, old ₹320) -> 11% OFF
* 6. Pure Sunflower Oil (1 L, ₹165, old ₹180) -> 8% OFF
*/

export const POPULAR_PRODUCTS = [
  {
    id: "pop-apples",
    slug: "fresh-royal-apples",
    name: "Fresh Royal Apples",
    unit: "4 pcs • 600–700 g",
    price: 149,
    oldPrice: 169,
    image: "/images/products/product-apples.svg",
    categoryKey: "grocery",
  },
  {
    id: "pop-milk",
    slug: "farm-fresh-milk",
    name: "Farm Fresh Milk",
    unit: "1 L",
    price: 68,
    oldPrice: 72,
    image: "/images/products/product-milk.svg",
    categoryKey: "dairy",
  },
  {
    id: "pop-bread",
    slug: "whole-wheat-bread",
    name: "Whole Wheat Bread",
    unit: "400 g",
    price: 45,
    oldPrice: 50,
    image: "/images/products/product-bread.png",
    categoryKey: "grocery",
  },
  {
    id: "pop-eggs",
    slug: "free-range-eggs",
    name: "Free Range Eggs",
    unit: "12 pcs",
    price: 82,
    oldPrice: 90,
    image: "/images/products/product-eggs.png",
    categoryKey: "dairy",
  },
  {
    id: "pop-detergent",
    slug: "ultra-clean-detergent",
    name: "Ultra Clean Detergent",
    unit: "1 kg",
    price: 285,
    oldPrice: 320,
    image: "/images/products/product-detergent.png",
    categoryKey: "home",
  },
  {
    id: "pop-oil",
    slug: "pure-sunflower-oil",
    name: "Pure Sunflower Oil",
    unit: "1 L",
    price: 165,
    oldPrice: 180,
    image: "/images/products/product-oil.png",
    categoryKey: "grocery",
  },
];
