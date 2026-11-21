/**
 * pagesContent.js
 * Source of truth for About Us page.
 * (Terms & Conditions and Privacy Policy have migrated to src/data/legalData.js)
 */

export const aboutContent = {
  heroEyebrow: "ABOUT FILLCARTS",
  heroTitleLine1: "Your neighbourhood,",
  heroTitleLine2: "delivered to your door.",
  heroParagraph: "FillCarts brings the stores you already trust onto one app, so groceries, daily needs and more reach you in minutes.",
  heroImage: "", // Optional path in public/ (e.g. "/images/about/about-hero.jpg"). Left empty so placeholder shows as requested.
  stats: [
    { number: "[500]+", label: "Local stores" },
    { number: "[10,000]+", label: "Products" },
    { number: "[30] min", label: "Average delivery" },
    { number: "[12]", label: "Neighbourhoods served" }
  ],
  storyEyebrow: "OUR STORY",
  storyHeading: "Why we started FillCarts",
  storyParagraph1: "[Short story: the problem you saw, for example that good local stores were hard to reach online and customers had to wait or travel.]",
  storyParagraph2: "[What FillCarts does today: connects customers, stores and delivery partners in one simple app, starting with [city].]",
  storyImage: "", // Optional path in public/. Left empty so placeholder shows as requested.
  valuesEyebrow: "WHAT WE STAND FOR",
  valuesHeading: "Built on four simple ideas",
  values: [
    {
      icon: "Store",
      title: "Local first",
      text: "We help neighbourhood stores reach customers who live next door."
    },
    {
      icon: "Zap",
      title: "Fast and reliable",
      text: "Orders are packed nearby and delivered quickly, with live updates."
    },
    {
      icon: "Users",
      title: "Fair for everyone",
      text: "Fair earnings for stores and riders, and no surprise charges for you."
    },
    {
      icon: "Tag",
      title: "Honest pricing",
      text: "Clear prices and offers. What you see is what you pay."
    }
  ],
  ctaHeading: "Run a store or want to deliver?",
  ctaSubtitle: "Join FillCarts and grow with your neighbourhood.",
  ctaVendorLabel: "Become a vendor",
  ctaVendorTo: "/become-vendor",
  ctaRiderLabel: "Become a rider",
  ctaRiderTo: "/become-rider"
};
