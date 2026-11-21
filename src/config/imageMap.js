/**
 * FillCarts Image Map Configuration
 * Single source of truth for all mapped image assets across the application.
 * UI ONLY project: values are public asset paths served from public/.
 * 
 * Keys with confirmed matching files are set to their public path.
 * Keys where no local matching file exists are explicitly set to null.
 */

export const imageMap = {
  // 1. STORE COVERS & STORE LOGOS
  storeCover: {
    // 5 Figma sequence stores
    "fresh-mart-supermarket": "/images/stores/fresh-mart-supermarket-cover.png",
    freshmart: "/images/stores/freshmart-cover.png",
    "fresh-mart": "/images/stores/fresh-mart-supermarket-cover.png",
    "fresh-market": "/images/stores/fresh-mart-supermarket-cover.png",
    freshMarket: "/images/stores/fresh-mart-supermarket-cover.png",

    "daily-needs-express": "/images/stores/daily-needs-express-cover.png",
    "daily-needs": "/images/stores/daily-needs-cover.png",
    dailyFreshOrganics: "/images/stores/daily-needs-express-cover.png",
    "daily-fresh-organics": "/images/stores/daily-needs-express-cover.png",

    "indore-grocery": "/images/stores/indore-grocery-cover.png",
    "green-leaf-farm-organics": "/images/stores/green-leaf-farm-organics-cover.png",
    organicGreens: "/images/stores/green-leaf-farm-organics-cover.png",
    "organic-greens": "/images/stores/green-leaf-farm-organics-cover.png",

    "sharma-super-store": "/images/stores/sharma-super-store-cover.png",
    "medplus-pharmacy-wellness": "/images/stores/medplus-pharmacy-wellness-cover.png",
    wellnessCornerPharmacy: "/images/stores/medplus-pharmacy-wellness-cover.png",
    "wellness-corner-pharmacy": "/images/stores/medplus-pharmacy-wellness-cover.png",

    "city-mart": "/images/stores/city-mart-cover.png",
    "city-artisan-bakery": "/images/stores/city-artisan-bakery-cover.png",
    cityArtisanBakery: "/images/stores/city-artisan-bakery-cover.png",
  },
  storeLogo: {
    "fresh-mart-supermarket": "/images/stores/fresh-mart-logo.svg",
    freshmart: "/images/stores/fresh-mart-logo.svg",
    "fresh-market": "/images/stores/fresh-mart-logo.svg",
    "fresh-mart": "/images/stores/fresh-mart-logo.svg",
    freshMarket: "/images/stores/fresh-mart-logo.svg",

    "daily-needs-express": "/images/stores/daily-needs-express-cover.png",
    "daily-needs": "/images/stores/daily-needs-cover.png",
    dailyFreshOrganics: "/images/stores/daily-needs-express-cover.png",
    "daily-fresh-organics": "/images/stores/daily-needs-express-cover.png",

    "indore-grocery": "/images/stores/indore-grocery-cover.png",
    "green-leaf-farm-organics": "/images/stores/green-leaf-farm-organics-cover.png",
    organicGreens: "/images/stores/green-leaf-farm-organics-cover.png",
    "organic-greens": "/images/stores/green-leaf-farm-organics-cover.png",

    "sharma-super-store": "/images/stores/sharma-super-store-cover.png",
    "medplus-pharmacy-wellness": "/images/stores/medplus-pharmacy-wellness-cover.png",
    wellnessCornerPharmacy: "/images/stores/medplus-pharmacy-wellness-cover.png",
    "wellness-corner-pharmacy": "/images/stores/medplus-pharmacy-wellness-cover.png",

    "city-mart": "/images/stores/city-mart-cover.png",
    "city-artisan-bakery": "/images/stores/city-artisan-bakery-cover.png",
    cityArtisanBakery: "/images/stores/city-artisan-bakery-cover.png",
  },

  // 2. CATEGORY TILES (Store Detail Page & Category Page - SVG Assets)
  categoryTile: {
    attaDalRice: "/images/categories/atta-dal-rice.svg",
    oilGheeMasala: "/images/categories/oil-ghee-masala.svg",
    dryFruitsBreakfast: "/images/categories/dry-fruits-breakfast.svg",
    fruitsVeggies: "/images/categories/fruits-veggies.svg",
    dairy: "/images/categories/dairy.svg",
    eggsMeatFish: "/images/categories/eggs-meat-fish.svg",
    snacksBeverages: "/images/categories/snacks-beverages.svg",
    biscuitsCookies: "/images/categories/biscuits-cookies.svg",
    fallback: "/images/categories/category-fallback.png",
  },

  // 3. HOME PAGE "SHOP BY CATEGORY" TILES (12 Figma Specified Cards)
  homeCategoryTile: {
    grocery: "/images/home/home-staples.png",
    dairy: "/images/home/home-dairy.png",
    chickenMeatFish: "/images/home/home-pet-care.png",
    electronics: "/images/home/home-meat.png",
    stationery: "/images/home/home-electronics.png",
    beauty: "/images/home/home-stationery.png",
    homeEssentials: "/images/home/home-beauty.png",
    dailyCare: "/images/home/home-essentials.png",
    fragranceGrooming: "/images/home/home-daily-care.png",
    sports: "/images/home/home-paan-corner.png",
    petCare: "/images/home/home-sports.png",
    paanCorner: "/images/home/home-fragrance.png",
  },

  // 4. PROMO BANNERS
  promoBanner: {
    dailyEssentials: "/images/banners/banner-cleaning-supplies.png",
    dealsOfTheDay: "/images/banners/deals-of-the-day.svg",
  },

  // 5. PAYMENT & SPECIAL OFFERS BANNERS
  offerBanner: {
    bankOffers: "/images/offers/offer-bank-cards.png",
    bankCardRed: "/images/home/home-frozen-food.png",
    bankCardPurple: "/images/home/home-pharma.png",
    walletCashback: "/images/home/home-wellness.png",
    walletCashbackAlt: "/images/offers/offer-wallet.png",
    comboOffer: "/images/home/home-organic.png",
  },

  // 6. HERO BANNERS & PAGE BACKGROUNDS
  hero: {
    home: "/images/banners/hero-banner.svg",
    categoryGrocery: "/images/banners/category-hero.svg",
    about: "/images/about/about-hero-bg.svg",
    aboutHeroPhoto: "/images/about/about-hero.jpg",
    contact: "/images/contact/contact-hero-bg.svg",
    riderPartner: "/images/stores/rider-partner-hero.jpg",
    ourStory: "/images/about/our-story-photo.jpg",
  },

  // 7. PRODUCT DEFAULTS & SPECIFIC PRODUCTS
  productDefault: "/images/products/placeholder.png",

  productImage: {
    // Staples & Grains
    atta: "/images/products/whole-wheat-atta-flour.svg",
    basmatiRice: "/images/products/royal-basmati-rice.svg",
    toorDal: "/images/products/toor-dal-pulses.svg",
    cookingOil: "/images/products/fortune-sunflower-oil.svg",
    sugar: "/images/products/refined-pure-sugar.svg",
    salt: "/images/products/tata-salt.svg",
    tea: "/images/products/tata-tea-gold.svg",
    instantNoodles: "/images/products/instant-noodles.svg",

    // Fruits & Vegetables
    tomato: "/images/products/fresh-tomato.svg",
    tomatoesOnVine: "/images/products/tomatoes-on-vine.svg",
    redOnion: "/images/products/fresh-red-onion.svg",
    potato: "/images/products/potato.png",
    carrot: "/images/products/fresh-carrots.svg",
    banana: "/images/products/fresh-banana-robusta.svg",
    capsicum: "/images/products/green-capsicum.svg",
    cauliflower: "/images/products/fresh-cauliflower.svg",
    cucumber: "/images/products/cucumber.png",
    greenPeas: "/images/products/garden-green-peas.png",
    apples: "/images/products/product-apples.svg",

    // Dairy & Bakery
    milk: "/images/products/product-milk.svg",
    eggs: "/images/products/product-eggs.png",
    bread: "/images/products/product-bread.png",
    oilBottle: "/images/products/product-oil.png",

    // Cleaning & Home Care
    citrusCleaner: "/images/products/citrus-surface-cleaner.png",
    naturalCleaningSpray: "/images/products/natural-cleaning-spray.png",
    glassCleaner: "/images/products/glass-cleaner.png",
    laundryDetergent: "/images/products/product-detergent.png",
    homeCareKit: "/images/products/home-care-kit.png",
    personalCareKit: "/images/products/personal-care-kit.png",
    kitchenScrubPads: "/images/products/kitchen-scrub-pads.png",

    // Personal Care & Grooming
    dailyFaceCleanser: "/images/products/daily-face-cleanser.png",
    everydaySkinDuo: "/images/products/everyday-skin-duo.png",
    freshBathEssentials: "/images/products/fresh-bath-essentials.png",
    hydratingBodyLotion: "/images/products/hydrating-body-lotion.png",
    nourishingShampoo: "/images/products/nourishing-shampoo.png",

    // Chill / Frozen Zone
    frenchFries: "/images/products/classic-french-fries.png",
    margheritaPizza: "/images/products/margherita-pizza.png",
    mixedVegetables: "/images/products/mixed-vegetables.png",
    readyMealBowl: "/images/products/ready-meal-bowl.png",
    iceCreamCone: "/images/products/vanilla-sprinkle-cone.png",
  },

  // 8. BRAND ICONS & APP BADGES
  brand: {
    logo: "/images/brand/logo.svg",
    logoYellow: "/Yellow theme logo.svg",
    cartButton: "/images/icons/cart-button.svg",
    googlePlay: "/images/icons/google-play-badge.svg",
    appStore: "/images/icons/app-store-badge.svg",
    favicon: "/favicon.ico",
  },
};

export default imageMap;
