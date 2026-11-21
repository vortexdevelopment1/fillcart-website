/**
 * Unified configuration for FillCarts footer & legal pages:
 * - Contact Us (/contact)
 * - How It Works (/how-it-works)
 * - Terms & Conditions (/terms)
 * - Privacy Policy (/privacy)
 *
 * All text values, contact details, FAQ items, step definitions,
 * and legal section copy live here. If any value is empty (""),
 * the corresponding UI element or card will be hidden automatically.
 */

export const CONTACT_PAGE_CONFIG = {
  eyebrow: "WE'RE HERE TO HELP",
  title: "Questions? Talk to a real person.",
  subtext: "Have a question about an order, partner stores, or anything else? Our friendly support team is ready to help you every day.",
  cards: [
    {
      id: "call",
      title: "Call us",
      value: "+1 (800) 555-0199",
      subline: "Mon-Sun from 8am to 10pm",
      href: "tel:+18005550199",
      iconType: "phone",
    },
    {
      id: "email",
      title: "Email us",
      value: "support@fillcarts.com",
      subline: "We usually reply within 2 hours",
      href: "mailto:support@fillcarts.com",
      iconType: "mail",
    },
    {
      id: "visit",
      title: "Visit us",
      value: "100 Market Street, Suite 400",
      subline: "San Francisco, CA 94105",
      href: "https://maps.google.com/?q=100+Market+Street+San+Francisco+CA",
      iconType: "mapPin",
    },
  ],
  topics: [
    { value: "", label: "Select a topic..." },
    { value: "order_issue", label: "Order issue or status" },
    { value: "delivery", label: "Delivery question" },
    { value: "refund", label: "Refund or return" },
    { value: "account", label: "Account & billing" },
    { value: "store_partner", label: "Store or partner inquiry" },
    { value: "other", label: "Other questions" },
  ],
  quickLinks: [
    { label: "Track my order", to: "/profile/orders" },
    { label: "Returns & refunds", to: "/terms#cancellations-refunds" },
    { label: "Become a vendor", to: "/become-vendor" },
    { label: "Become a rider", to: "/become-rider" },
  ],
  supportHours: {
    title: "Support hours",
    hours: "Every day: 8:00 AM – 10:00 PM EST",
  },
  faqEyebrow: "FAQS",
  faqHeading: "Quick answers",
  faqs: [
    {
      id: "faq-1",
      question: "How fast is delivery with FillCarts?",
      answer: "Most deliveries are fulfilled by local partner stores and delivered to your doorstep within 30 to 45 minutes, depending on merchant preparation time and courier availability.",
    },
    {
      id: "faq-2",
      question: "How do I report a missing or damaged item?",
      answer: "You can report any issue directly in your order history under Profile > Orders or contact our customer support team within 24 hours of delivery for an immediate resolution or refund.",
    },
    {
      id: "faq-3",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit and debit cards, digital wallets (Apple Pay, Google Pay), and FillCarts wallet credits for quick one-tap checkout.",
    },
    {
      id: "faq-4",
      question: "Can I modify or cancel my order after placing it?",
      answer: "Orders can be modified or cancelled before the partner store begins preparing and packing your items. Check your live order tracker for instant status updates.",
    },
  ],
};

export const HOW_IT_WORKS_CONFIG = {
  eyebrow: "HOW IT WORKS",
  title: "Local stores, delivered fast.",
  subtext: "Order fresh groceries, daily essentials, and household goods from your favorite neighborhood stores. Delivered to your doorstep in minutes.",
  illustrationImage: "", // Empty string displays the placeholder illustration box
  stepsEyebrow: "4 SIMPLE STEPS",
  stepsHeading: "From tap to doorstep",
  steps: [
    {
      number: "01",
      title: "Search or browse",
      description: "Explore nearby grocery stores, bakeries, and markets. Find fresh produce, pantry staples, and household favorites.",
      iconType: "search",
    },
    {
      number: "02",
      title: "Add to cart",
      description: "Pick your items with real-time inventory and deals. Add special notes or substitute preferences with one tap.",
      iconType: "cart",
    },
    {
      number: "03",
      title: "Store packs it",
      description: "Your local merchant hand-selects the freshest items and carefully packages them for quick, safe delivery.",
      iconType: "package",
    },
    {
      number: "04",
      title: "Delivered to you",
      description: "A nearby courier picks up your package and delivers it straight to your doorstep with real-time live tracking.",
      iconType: "truck",
    },
  ],
  audienceEyebrow: "BUILT FOR EVERYONE",
  audienceHeading: "One platform, three ways to join",
  audiences: [
    {
      id: "shoppers",
      title: "For shoppers",
      tagline: "Convenience at your fingertips",
      description: "Get essentials and grocery orders delivered in under an hour from stores you already love.",
      ctaText: "Start shopping",
      to: "/",
    },
    {
      id: "stores",
      title: "For stores",
      tagline: "Grow your local customer base",
      description: "Expand your reach without high tech overhead. Reach thousands of eager local shoppers.",
      ctaText: "Become a vendor",
      to: "/become-vendor",
    },
    {
      id: "riders",
      title: "For riders",
      tagline: "Flexible work on your schedule",
      description: "Deliver orders with fair pay, flexible schedules, and fast weekly payouts.",
      ctaText: "Become a rider",
      to: "/become-rider",
    },
  ],
  cta: {
    heading: "Ready to fill your cart?",
    subtext: "Order fresh groceries and local essentials delivered directly to your doorstep today.",
    buttonText: "Start shopping",
    to: "/",
  },
};

export const TERMS_CONFIG = {
  lastUpdated: "November 2026",
  eyebrow: "LEGAL",
  title: "Terms & Conditions",
  summary: "Welcome to FillCarts. These Terms & Conditions govern your access to and use of our website, mobile application, and delivery services. By accessing or using FillCarts, you agree to be bound by these terms. If you do not agree, please do not use our platform.",
  sections: [
    {
      id: "acceptance-of-terms",
      number: "01",
      title: "Acceptance of terms",
      paragraphs: [
        "[placeholder] By accessing or using the FillCarts platform, website, or mobile applications, you confirm that you have read, understood, and agreed to be bound by these Terms and Conditions along with our Privacy Policy.",
        "[placeholder] If you are entering into this agreement on behalf of a legal entity, you represent and warrant that you possess full legal authority to bind that entity to these conditions.",
      ],
    },
    {
      id: "using-fillcarts",
      number: "02",
      title: "Using FillCarts",
      paragraphs: [
        "[placeholder] FillCarts connects customers with independent local retail stores, merchants, and third-party delivery couriers. FillCarts is a technology platform that facilitates order placement and fulfillment.",
        "[placeholder] You agree to use our services exclusively for lawful purposes and in strict accordance with all applicable municipal, provincial, and national laws.",
      ],
    },
    {
      id: "accounts",
      number: "03",
      title: "Accounts",
      paragraphs: [
        "[placeholder] To access core platform features, you must maintain an active personal user account. You agree to provide true, accurate, and complete registration details and keep them updated.",
        "[placeholder] You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
      ],
    },
    {
      id: "orders-payments",
      number: "04",
      title: "Orders & payments",
      paragraphs: [
        "[placeholder] All product listings, pricing, and availability are provided by partner merchants. Placing an order constitutes an offer to purchase the specified items.",
        "[placeholder] Payment must be completed using an approved payment method at the time of order confirmation. All charges, taxes, and service fees will be itemized prior to checkout.",
      ],
    },
    {
      id: "delivery",
      number: "05",
      title: "Delivery",
      paragraphs: [
        "[placeholder] Estimated delivery windows are approximate and subject to traffic, merchant preparation delays, and weather conditions. Couriers will deliver to the address specified in your order.",
        "[placeholder] You agree to provide accurate delivery instructions and ensure an authorized recipient is available to receive perishable or age-restricted items.",
      ],
    },
    {
      id: "cancellations-refunds",
      number: "06",
      title: "Cancellations & refunds",
      paragraphs: [
        "[placeholder] Orders can be cancelled free of charge before the partner merchant begins preparing the items. Once preparation or fulfillment has commenced, cancellation fees may apply.",
        "[placeholder] In the event of missing, defective, or incorrect items, please contact customer support within 24 hours of delivery to initiate a review and receive a refund or replacement credit.",
      ],
    },
    {
      id: "liability",
      number: "07",
      title: "Liability",
      paragraphs: [
        "[placeholder] To the fullest extent permitted by applicable law, FillCarts and its affiliates shall not be liable for any indirect, punitive, or consequential damages resulting from your use of the service.",
        "[placeholder] Quality, freshness, labeling, and safety of grocery items remain the direct legal responsibility of the selling merchant store.",
      ],
    },
    {
      id: "changes-to-terms",
      number: "08",
      title: "Changes to these terms",
      paragraphs: [
        "[placeholder] FillCarts reserves the right to revise or amend these Terms & Conditions at any time. When modifications are published, the 'Last updated' date above will be updated accordingly.",
        "[placeholder] Your continued usage of FillCarts following the publication of revisions constitutes acceptance of the amended terms.",
      ],
    },
  ],
};

export const PRIVACY_CONFIG = {
  lastUpdated: "November 2026",
  eyebrow: "LEGAL",
  title: "Privacy Policy",
  summary: "Your privacy is important to us. This Privacy Policy explains what personal information FillCarts collects, how we use it, when we share it with partner stores and couriers, and your rights regarding your data.",
  sections: [
    {
      id: "information-we-collect",
      number: "01",
      title: "Information we collect",
      paragraphs: [
        "[placeholder] We collect details you provide directly during account registration, profile management, and checkout, including your name, contact phone number, email address, delivery addresses, and payment information.",
        "[placeholder] We also collect automated technical information, including device type, operating system, IP address, browsing behavior, and approximate geolocation to ensure accurate delivery routing.",
      ],
    },
    {
      id: "how-we-use-it",
      number: "02",
      title: "How we use it",
      paragraphs: [
        "[placeholder] We use collected information to fulfill orders, process secure transactions, coordinate courier delivery, provide responsive customer support, and communicate essential service notices.",
        "[placeholder] Aggregated, de-identified data is analyzed to enhance app performance, improve inventory recommendations, and optimize merchant logistics.",
      ],
    },
    {
      id: "sharing-with-stores-riders",
      number: "03",
      title: "Sharing with stores & riders",
      paragraphs: [
        "[placeholder] To process and fulfill your orders, we share necessary order details—such as customer first name, delivery address, and ordered items—with assigned partner merchants and couriers.",
        "[placeholder] We never sell your personal information to third parties. Data is shared with certified third-party service providers solely to execute platform services.",
      ],
    },
    {
      id: "cookies",
      number: "04",
      title: "Cookies",
      paragraphs: [
        "[placeholder] FillCarts uses first-party and third-party cookies and tracking technologies to maintain session authentication, remember user preferences, and measure traffic analytics.",
        "[placeholder] You can manage cookie preferences directly through your browser settings, although disabling necessary cookies may impact platform functionality.",
      ],
    },
    {
      id: "your-choices",
      number: "05",
      title: "Your choices",
      paragraphs: [
        "[placeholder] You have the right to access, rectify, or request deletion of your personal account data at any time via your account profile settings or by contacting our privacy team.",
        "[placeholder] You may opt out of marketing communications at any point while continuing to receive essential transactional order updates.",
      ],
    },
    {
      id: "data-security",
      number: "06",
      title: "Data security",
      paragraphs: [
        "[placeholder] We implement industry-standard encryption, firewalls, and secure socket layers to safeguard personal data against unauthorized access, loss, or disclosure.",
        "[placeholder] Although we maintain rigorous safeguards, no Internet data transmission can be guaranteed completely immune from interference; please maintain a secure password.",
      ],
    },
    {
      id: "contact",
      number: "07",
      title: "Contact",
      paragraphs: [
        "[placeholder] If you have questions, inquiries, or complaints concerning our privacy practices or data handling, please contact our Data Protection Office.",
        "[placeholder] Reach us via email at privacy@fillcarts.com or submit a message through our Contact Us page.",
      ],
    },
  ],
};
