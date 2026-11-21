/**
 * Home Page Hero Banners Configuration
 * Single source of truth for the Home page hero carousel.
 * 
 * - "existing": Renders the current home hero component unchanged.
 * - "promo": Renders <PromoBanner /> with custom background, titleLines, subtitleLines, ctaLabel, ctaTo, image.
 */
export const homeBanners = [
  { id: "home-main", type: "existing" },
  {
    id: "grocery-pista",
    type: "promo",
    background: "linear-gradient(90deg, #D8FFDB 0%, #FFEAD2 50%, #FFDFAE 100%)",
    titleLines: ["Groceries for", "Your Daily Needs"],
    subtitleLines: [
      "Fresh fruits & vegetables, dairy, snacks,",
      "staples and more — all at great prices.",
    ],
    ctaLabel: "Shop Now",
    ctaTo: "/category/grocery",
    image: "/images/banners/grocery-hero-trimmed.png",
  },
];
