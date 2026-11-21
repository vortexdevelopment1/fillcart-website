/**
 * FillCarts Unified Design Tokens (Single Source of Truth)
 * Derived from the Figma Landing Page Design System
 */

export const THEME = {
  // Brand & Semantic Colors
  colors: {
    // Primary Brand Yellow (Buttons, Add, Cart, Active Highlights)
    primary: "#F5B800",
    primaryHover: "#E0A800",
    primaryActive: "#D49400",
    primaryLight: "#FFF8E1",
    primaryPale: "#FFF4DA", // Highlight panels & active sidebar items

    // Ink & Text
    ink: "#101828", // Headings & body text on light
    inkMuted: "#667085", // Muted secondary text
    inkSubtle: "#8893A3", // Captions & subtle descriptions

    // Surfaces & Backgrounds
    pageBg: "#FFFFFF",
    surfaceSoft: "#F4F5F8", // Inputs, search, neutral chips
    surfaceDark: "#111925", // Footer & dark surfaces
    panelHighlight: "#FFF4DA", // Pale yellow panels

    // Borders (0.8px standard)
    border: "#E7E8E5",
    borderHover: "#D8DBDF",

    // Functional & Feedback
    success: "#16803C",
    discount: "#16803C",
    link: "#2F6842",
    eyebrow: "#936D00",
    logoGold: "#D49400",
    error: "#B42318",
    warning: "#F79009",
    info: "#0284C7",
  },

  // Category Pastel Tints (Strict Figma Mapping)
  categoryTints: {
    grocery: "#EDF7E8",
    dairy: "#EAF5F8",
    meat: "#FCECEC",
    chicken: "#FCECEC",
    electronics: "#F2EFF9",
    stationery: "#FFF1DF",
    beauty: "#FCECF1",
    personal: "#FCECF1",
    home: "#EEF7F5",
    daily: "#EDF3FA",
    fragrance: "#FFF0EA",
    sports: "#F1F4EE",
    pet: "#FFF4DF",
    paan: "#E4FFDF",
    fruits: "#EDF7E8",
    bakery: "#FFF1DF",
    pharmacy: "#EEF7F5",
    food: "#FFF0EA",
  },

  // Highlight Surfaces & Soft Alert Tints
  tints: {
    neutral: "#F4F5F8",
    success: "#EDF7E8",
    warning: "#FFF4DF",
    error: "#FCECEC",
    info: "#EAF5F8",
    highlight: "#FFF4DA",
  },

  // Radii
  radii: {
    card: "18px", // Standard cards with 0.8px border
    panel: "24px", // Panels and section tiles (24px to 32px)
    panelLg: "32px",
    modal: "24px", // Dialogs and modals
    input: "9999px", // Pill inputs, chips, search
    textarea: "12px", // Textarea & dropdown menus
    selectDropdown: "12px",
    pill: "9999px", // Buttons, chips, badges
  },

  // Typography Scale (Tokens)
  typography: {
    fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
    eyebrow: {
      fontSize: "10px",
      fontWeight: 800,
      lineHeight: "15px",
      letterSpacing: "1.6px",
      textTransform: "uppercase",
      color: "#936D00",
    },
    pageTitle: {
      fontSize: "27px",
      fontWeight: 800,
      lineHeight: "32.4px",
      letterSpacing: "-1.2px",
      color: "#101828",
    },
    cardTitle: {
      fontSize: "14px",
      fontWeight: 800,
      lineHeight: "19.6px",
      color: "#101828",
    },
    body: {
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: 1.5,
      color: "#101828",
    },
    caption: {
      fontSize: "11px",
      fontWeight: 400,
      lineHeight: 1.4,
      color: "#667085",
    },
    price: {
      fontSize: "15px",
      fontWeight: 700,
      lineHeight: "22.5px",
      color: "#101828",
    },
    linkAll: {
      fontSize: "11px",
      fontWeight: 800,
      lineHeight: "16.5px",
      color: "#2F6842",
    },
  },

  // Layout & Spacing
  layout: {
    containerMaxWidth: "1216px",
    contentColumnMaxWidth: "720px", // Form and reading column
    gridGapDesktop: "13px",
    gridGapLg: "16px",
    sectionPaddingTop: "52px",
    headerContentGap: "24px",
  },
};

export default THEME;
