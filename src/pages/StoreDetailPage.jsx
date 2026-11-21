import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Home,
  ChevronRight,
  Clock,
  Percent,
  ShieldCheck,
  Headphones,
  SlidersHorizontal,
  X,
  ArrowRight,
  ShoppingBag,
  RotateCcw,
  Check,
  Truck,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ListingProductCard from "../components/ListingProductCard";
import CategoryPromoBanners from "../components/CategoryPromoBanners";
import CategoryTile from "../components/CategoryTile";
import { getStore } from "../data/storesData";
import { DEFAULT_PRODUCT_IMAGE } from "../config/images";

/** Helper to safely encode URI without double-encoding */
function safeEncodeURI(path) {
  if (!path) return "";
  try {
    return encodeURI(decodeURI(path));
  } catch {
    return encodeURI(path);
  }
}

/** Helper to parse string rating counts like "1.2K" or numeric counts */
function parseRatingCount(val) {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const str = String(val).trim().toUpperCase();
  if (str.endsWith("K")) {
    return parseFloat(str.slice(0, -1)) * 1000;
  }
  if (str.endsWith("M")) {
    return parseFloat(str.slice(0, -1)) * 1000000;
  }
  const parsed = parseFloat(str.replace(/,/g, ""));
  return isNaN(parsed) ? 0 : parsed;
}

/** Formats rating count for hero: "1.2K" -> "1.2k reviews" */
function formatRatingReviews(count) {
  if (!count) return "0 reviews";
  const str = String(count).trim().toLowerCase();
  return `${str} reviews`;
}

/** Tile background colours palette matching Figma spec */
const TILE_BACKGROUNDS = [
  "#FFF3EB",
  "#FFF8E8",
  "#FFF4E6",
  "#F0F8E8",
  "#F2F3F6",
  "#FFF0F0",
  "#FFF3E9",
  "#FFF3EB",
];

/** Custom Checkbox for Filters Sidebar */
function SidebarCheckbox({ checked, onChange, label, count, id }) {
  return (
    <label
      htmlFor={id}
      style={{
        width: "100%",
        minWidth: 0,
        height: "20px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
        userSelect: "none",
        boxSizing: "border-box",
      }}
      className="group"
    >
      <div
        style={{
          position: "relative",
          width: "18px",
          height: "18px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <div
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "4px",
            border: checked ? "1.5px solid #F59E0B" : "1.5px solid #D1D5DB",
            backgroundColor: checked ? "#F59E0B" : "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s ease",
          }}
          className="peer-focus-visible:ring-2 peer-focus-visible:ring-[#FBBF24] peer-focus-visible:ring-offset-2 group-hover:border-[#9CA3AF]"
        >
          {checked && (
            <svg
              style={{ width: "11px", height: "11px", strokeWidth: 2.5 }}
              className="text-white fill-none stroke-current"
              viewBox="0 0 12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="2.5 6 4.8 8.5 9.5 3.5" />
            </svg>
          )}
        </div>
      </div>
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          fontSize: "14px",
          lineHeight: "20px",
          color: "#374151",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minWidth: 0,
          flex: 1,
        }}
      >
        {label}
        {count !== undefined && ` (${count})`}
      </span>
    </label>
  );
}

/** Sidebar Group Header */
function SidebarGroupLabel({ title }) {
  return (
    <div
      style={{
        width: "100%",
        height: "22px",
        paddingBottom: "6px",
        display: "flex",
        alignItems: "flex-start",
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
          width: "100%",
          height: "16px",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
          fontSize: "12px",
          lineHeight: "16px",
          letterSpacing: "0.6px",
          textTransform: "uppercase",
          color: "#1F2937",
          display: "block",
        }}
      >
        {title}
      </span>
    </div>
  );
}

/** Helper to determine store name typography and pill gap based on character count */
function getHeroNameStyle(name) {
  const len = (name || "").length;
  if (len <= 13) {
    return {
      fontSize: "52px",
      lineHeight: "54.6px",
      letterSpacing: "0.52px",
      pillGap: "24px",
      whiteSpace: "nowrap",
      maxWidth: "none",
    };
  }
  if (len <= 19) {
    return {
      fontSize: "38px",
      lineHeight: "54.6px",
      letterSpacing: "0.38px",
      pillGap: "20px",
      whiteSpace: "nowrap",
      maxWidth: "none",
    };
  }
  // 20 characters or more: wraps to a maximum of 2 lines
  return {
    fontSize: "38px",
    lineHeight: "44px",
    letterSpacing: "0.38px",
    pillGap: "20px",
    whiteSpace: "normal",
    maxWidth: "330px",
  };
}

/** Verified Pill (102x30, #2563EB, Inter 600 14px, white, thin Check icon) */
function VerifiedPill({ className = "", style = {} }) {
  return (
    <span
      className={`inline-flex items-center justify-center h-[30px] px-[14px] rounded-full bg-[#2563EB] text-white text-[14px] font-semibold select-none whitespace-nowrap shrink-0 shadow-xs ${className}`}
      style={{
        backgroundColor: "#2563EB",
        height: "30px",
        padding: "0 14px",
        borderRadius: "999px",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        fontSize: "14px",
        lineHeight: "30px",
        color: "#FFFFFF",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxSizing: "border-box",
        userSelect: "none",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <span>Verified</span>
      <Check size={14} strokeWidth={2.5} color="#FFFFFF" style={{ marginLeft: "4px" }} />
    </span>
  );
}

/** Open Now Pill (111x30, #00FF55, 10px black dot, 8px gap, text "Open Now" 14px/22px #000000) */
function OpenNowPill({ isOpen = true }) {
  if (!isOpen) {
    return (
      <span
        style={{
          width: "111px",
          height: "30px",
          borderRadius: "9999px",
          backgroundColor: "#9CA3AF",
          padding: "4px 12px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "22px",
            color: "#000000",
            letterSpacing: 0,
          }}
        >
          Closed
        </span>
      </span>
    );
  }

  return (
    <span
      style={{
        width: "111px",
        height: "30px",
        borderRadius: "9999px",
        backgroundColor: "#00FF55",
        padding: "4px 12px",
        display: "inline-flex",
        alignItems: "center",
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "87px",
          height: "22px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "#000000",
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "22px",
            color: "#000000",
            letterSpacing: 0,
            whiteSpace: "nowrap",
          }}
        >
          Open Now
        </span>
      </div>
    </span>
  );
}

/** STORE HERO (1216 x 331 at 1440px desktop) */
function StoreHero({ store }) {
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setLogoError(false);
  }, [store?.logo, store?.slug]);

  // Delivery string clean up: replace hyphens with en-dash
  const rawDelivery = store.deliveryTime || "15–20 min";
  const deliveryClean = rawDelivery.replace("-", "–");
  const deliveryText = deliveryClean.toLowerCase().includes("delivery")
    ? deliveryClean
    : `${deliveryClean} delivery`;

  // Free delivery text
  const freeDeliveryText = `Free delivery over ₹${store.freeDeliveryAbove || 199}`;

  // Long name detection and styling helper
  const storeName = store.name || "Store";
  const nameStyle = getHeroNameStyle(storeName);

  // Fallback initials for logo
  const initials = (store.logoText || storeName.slice(0, 2)).toUpperCase();

  return (
    <div
      style={{
        backgroundColor: "#111925",
        borderRadius: "32px",
        fontFamily: "'Inter', sans-serif",
      }}
      className="relative w-full min-h-[331px] overflow-hidden select-none flex flex-col justify-between"
    >
      {/* Background Cover Photo (Desktop >=1024px: absolute right-0 top-0 bottom-0 width 655px object-cover) */}
      {store.cover ? (
        <img
          src={safeEncodeURI(store.cover)}
          alt=""
          aria-hidden="true"
          className="hidden lg:block absolute right-0 top-0 bottom-0 w-[655px] h-full object-cover object-center pointer-events-none select-none"
        />
      ) : null}

      {/* Dark Card (Desktop >=1024px: relative lg:w-[672px] min-h-[331px] padding 40px) */}
      <div
        style={{
          backgroundColor: "#111925",
          borderRadius: "32px",
          boxSizing: "border-box",
        }}
        className="relative w-full lg:w-[672px] min-h-[331px] p-[24px] sm:p-[28px] lg:p-[40px] flex flex-col justify-between z-10"
      >
        {/* TOP GROUP: Logo + Text Column */}
        <div className="flex flex-row gap-[20px] sm:gap-[24px] lg:gap-[28px] items-start w-full">
          {/* Logo (112x112, radius 20px, object-cover; under 768px: 80x80 radius 16px) */}
          <div className="w-[80px] h-[80px] lg:w-[112px] lg:h-[112px] rounded-[16px] lg:rounded-[20px] overflow-hidden shrink-0 bg-[#FFF4DA] flex items-center justify-center select-none shadow-sm">
            {store.logo && !logoError ? (
              <img
                src={safeEncodeURI(store.logo)}
                alt={storeName}
                onError={() => setLogoError(true)}
                className="w-full h-full object-cover object-center block"
              />
            ) : (
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 800,
                  color: "#936D00",
                }}
                className="text-[24px] lg:text-[32px]"
              >
                {initials}
              </span>
            )}
          </div>

          {/* Text Column (starts at left 180px on desktop = 40 + 112 + 28; width 452px) */}
          <div className="flex-1 min-w-0 lg:w-[452px] flex flex-col">
            {/* a) Eyebrow: Inter 600, 14.5px / 22.48px, tracking 1.6px, uppercase, #D3DCD6 */}
            <div
              style={{
                width: "fit-content",
                maxWidth: "100%",
                minHeight: "23px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "14.5px",
                lineHeight: "22.48px",
                letterSpacing: "1.6px",
                textTransform: "uppercase",
                color: "#D3DCD6",
                overflow: "visible",
                boxSizing: "border-box",
              }}
              className="whitespace-normal md:whitespace-nowrap"
            >
              {store.eyebrow || "YOUR EVERYDAY GROCERY"}
            </div>

            {/* b) NAME + VERIFIED ROW (flex, align-items center, gap to pill; top 71px, min-height 54.6px) */}
            <div
              style={{
                marginTop: "8.5px",
                minHeight: "54.6px",
                display: "flex",
                alignItems: "center",
                gap: nameStyle.pillGap,
              }}
              className="flex-wrap md:flex-nowrap"
            >
              <h1
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 600,
                  letterSpacing: nameStyle.letterSpacing,
                  color: "#FBBF24",
                  whiteSpace: nameStyle.whiteSpace,
                  maxWidth: nameStyle.maxWidth,
                  margin: 0,
                  minWidth: 0,
                  flex: "0 1 auto",
                  verticalAlign: "middle",
                  boxSizing: "border-box",
                  "--hero-name-size": nameStyle.fontSize,
                  "--hero-name-lh": nameStyle.lineHeight,
                }}
                className="text-[34px] leading-[40px] md:[font-size:var(--hero-name-size)] md:[line-height:var(--hero-name-lh)]"
              >
                {storeName}
              </h1>

              {/* Verified Pill is ALWAYS in this row, flex-shrink 0, never in the pills row */}
              {store.verified && (
                <div className="shrink-0 flex items-center">
                  <VerifiedPill />
                </div>
              )}
            </div>

            {/* c) PILLS ROW (Open Now + Rating text; starts 20px below name row; height 30px) */}
            <div
              style={{
                marginTop: "20px",
                height: "30px",
                display: "flex",
                alignItems: "center",
              }}
              className="flex-wrap md:flex-nowrap"
            >
              {/* Open Now Pill */}
              <OpenNowPill isOpen={store.isOpen !== false} />

              {/* Rating Text: "★ 4.9 (1.2k reviews)" */}
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#FFFFFF",
                  whiteSpace: "nowrap",
                  marginLeft: "16px",
                }}
                className="flex items-center"
              >
                {`★ ${store.rating || "4.9"} (${formatRatingReviews(store.ratingCount || "1.2K")})`}
              </div>
            </div>

            {/* d) Tags Line (14px below pills row) */}
            <div
              style={{
                marginTop: "14px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "24px",
                color: "#FFFFFF",
                whiteSpace: "normal",
              }}
              className="text-[14px] sm:text-[16px]"
            >
              {store.tags}
            </div>
          </div>
        </div>

        {/* BOTTOM BLOCK: Divider (592px, 243px from hero top) + Delivery Row (padding-top 23px) */}
        <div className="w-full mt-6 lg:mt-[29px]">
          {/* Divider: 1px solid #384049 */}
          <div
            style={{
              width: "100%",
              height: "1px",
              backgroundColor: "#384049",
            }}
          />

          {/* Delivery Row: padding-top 23px, line-height 24px, Inter 18px, white */}
          <div
            style={{
              paddingTop: "23px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "18px",
              lineHeight: "24px",
              color: "#FFFFFF",
            }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-4 text-[16px] lg:text-[18px]"
          >
            <span style={{ fontWeight: 600 }}>{deliveryText}</span>
            <span style={{ fontWeight: 400 }}>{freeDeliveryText}</span>
          </div>
        </div>
      </div>

      {/* Cover Photo for Small Screens (<1024px: positioned below dark card, 220px high) */}
      {store.cover ? (
        <div className="block lg:hidden w-full h-[220px] overflow-hidden rounded-b-[32px]">
          <img
            src={store.cover}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center block"
          />
        </div>
      ) : null}
    </div>
  );
}

/** FEATURE STRIP (1216 x 66px, border-radius 18px, bg #F7F6F3, 4 equal items) */
function FeatureStrip({ store }) {
  // Format delivery time for sub text
  const rawDelivery = store.deliveryTime || "15–20 min";
  const cleanDelivery = rawDelivery.replace("-", "–");
  const deliverySub = cleanDelivery.toLowerCase().includes("min")
    ? cleanDelivery.replace(/mins?/i, "mins")
    : `${cleanDelivery} mins`;

  const items = [
    {
      icon: <Truck size={32} className="text-[#087B1C] shrink-0" strokeWidth={1.75} />,
      title: "Quick Delivery",
      sub: deliverySub,
    },
    {
      icon: <Percent size={32} className="text-[#087B1C] shrink-0" strokeWidth={1.75} />,
      title: "Great Prices",
      sub: "Everyday low prices",
    },
    {
      icon: <ShieldCheck size={32} className="text-[#087B1C] shrink-0" strokeWidth={1.75} />,
      title: "Quality Assured",
      sub: "Fresh & trusted products",
    },
    {
      icon: <Headphones size={32} className="text-[#087B1C] shrink-0" strokeWidth={1.75} />,
      title: "Easy Support",
      sub: "Quick help & returns",
    },
  ];

  return (
    <section
      aria-label="Store Benefits"
      style={{
        backgroundColor: "#F7F6F3",
        borderRadius: "18px",
        fontFamily: "'Inter', sans-serif",
      }}
      className="w-full max-w-[1216px] mx-auto min-h-[66px] flex flex-wrap lg:flex-nowrap items-center select-none overflow-hidden"
    >
      {items.map((item, idx) => (
        <div
          key={item.title}
          style={{
            borderColor: "#CCCAC5",
          }}
          className={`flex-1 min-w-[240px] lg:min-w-0 h-[66px] px-4 flex items-center justify-center gap-3 lg:gap-4 ${
            idx < items.length - 1 ? "lg:border-r border-[#CCCAC5]" : ""
          }`}
        >
          {item.icon}
          <div className="flex flex-col text-left">
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "14px",
                lineHeight: "20px",
                color: "#0B1326",
              }}
            >
              {item.title}
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: "13px",
                lineHeight: "18px",
                color: "#4C5364",
              }}
            >
              {item.sub}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}



/** MAIN STORE DETAIL PAGE */
export default function StoreDetailPage() {
  const { slug } = useParams();
  const store = useMemo(() => getStore(slug), [slug]);

  // Set document title
  useEffect(() => {
    if (store) {
      document.title = `${store.name} | FillCarts`;
    } else {
      document.title = `Store not found | FillCarts`;
    }
  }, [store]);

  // Flatten all products of this store
  const allStoreProducts = useMemo(() => {
    if (!store || !store.sections) return [];
    const prods = [];
    const shortBrandFallback = (() => {
      if (store?.slug === "city-artisan-bakery") return "City Artisan";
      if (store?.slug === "green-leaf-farm-organics") return "Green Leaf";
      if (store?.slug === "daily-needs-express") return "Daily Needs";
      if (store?.slug === "medplus-pharmacy-wellness") return "MedPlus";
      return store?.name || "Store Brand";
    })();

    store.sections.forEach((sec) => {
      if (Array.isArray(sec.products)) {
        sec.products.forEach((p) => {
          prods.push({
            ...p,
            sectionId: sec.id,
            sectionTitle: sec.title,
            brand: p.brand || shortBrandFallback,
          });
        });
      }
    });
    return prods;
  }, [store]);

  // Compute store's max price rounded up to next 100
  const maxPriceCeil = useMemo(() => {
    if (allStoreProducts.length === 0) return 1000;
    const highest = Math.max(...allStoreProducts.map((p) => Number(p.price || 0)));
    return Math.max(100, Math.ceil(highest / 100) * 100);
  }, [allStoreProducts]);

  // State
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [maxPrice, setMaxPrice] = useState(maxPriceCeil);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [availabilityState, setAvailabilityState] = useState({
    inStock: true,
    outOfStock: false,
  });
  const [viewMode, setViewMode] = useState("best-sellers"); // 'best-sellers' | 'all'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync max price when store changes
  useEffect(() => {
    setMaxPrice(maxPriceCeil);
    setSelectedSectionId(null);
    setSelectedBrands([]);
    setShowAllBrands(false);
    setSelectedDiscounts([]);
    setAvailabilityState({ inStock: true, outOfStock: false });
    setViewMode("best-sellers");
  }, [store, maxPriceCeil]);

  // Ref for smooth scroll
  const productsBlockRef = useRef(null);

  // Computed brand counts for THIS store
  const validBrands = useMemo(() => {
    const brandMap = {};
    allStoreProducts.forEach((p) => {
      const b = p.brand;
      if (b) {
        brandMap[b] = (brandMap[b] || 0) + 1;
      }
    });
    return Object.entries(brandMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [allStoreProducts]);

  const displayedBrands = useMemo(() => {
    return showAllBrands ? validBrands : validBrands.slice(0, 5);
  }, [validBrands, showAllBrands]);

  // Computed discount counts for THIS store
  const computedDiscountFilters = useMemo(() => {
    const d10 = allStoreProducts.filter((p) => Number(p.discountPercent || 0) >= 10).length;
    const d15 = allStoreProducts.filter((p) => Number(p.discountPercent || 0) >= 15).length;
    const d20 = allStoreProducts.filter((p) => Number(p.discountPercent || 0) >= 20).length;
    const bogo = allStoreProducts.filter(
      (p) => Boolean(p.isBogo) || String(p.badge || "").toLowerCase().includes("bogo")
    ).length;

    const list = [];
    if (d10 > 0) list.push({ label: "10% and above", count: d10, minDiscount: 10 });
    if (d15 > 0) list.push({ label: "15% and above", count: d15, minDiscount: 15 });
    if (d20 > 0) list.push({ label: "20% and above", count: d20, minDiscount: 20 });
    if (bogo > 0) list.push({ label: "Buy 1 Get 1", count: bogo, isBogo: true });
    return list;
  }, [allStoreProducts]);

  // Computed availability counts for THIS store
  const computedAvailability = useMemo(() => {
    const inCount = allStoreProducts.filter((p) => p.inStock === true).length;
    const outCount = allStoreProducts.filter((p) => p.inStock === false).length;
    const list = [];
    if (inCount > 0) list.push({ label: "In Stock", inStock: true, count: inCount });
    if (outCount > 0) list.push({ label: "Out of Stock", inStock: false, count: outCount });
    return list;
  }, [allStoreProducts]);

  // Check if any filter is active
  const isAnyFilterActive = useMemo(() => {
    const isCategoryActive = selectedSectionId !== null;
    const isPriceActive = Number(maxPrice) < maxPriceCeil;
    const isBrandActive = validBrands.length >= 2 && selectedBrands.length > 0;
    const isDiscountActive = selectedDiscounts.length > 0;
    const isAvailActive = !availabilityState.inStock || availabilityState.outOfStock;
    return isCategoryActive || isPriceActive || isBrandActive || isDiscountActive || isAvailActive;
  }, [
    selectedSectionId,
    maxPrice,
    maxPriceCeil,
    selectedBrands,
    selectedDiscounts,
    availabilityState,
  ]);

  // Best Sellers (uses store.bestSellers if provided, else computed from allStoreProducts)
  const bestSellers = useMemo(() => {
    if (Array.isArray(store?.bestSellers) && store.bestSellers.length > 0) {
      return store.bestSellers;
    }
    const sorted = [...allStoreProducts].sort((a, b) => {
      const cntDiff = parseRatingCount(b.ratingCount) - parseRatingCount(a.ratingCount);
      if (cntDiff !== 0) return cntDiff;
      return (Number(b.rating) || 0) - (Number(a.rating) || 0);
    });
    return sorted.slice(0, 4);
  }, [allStoreProducts, store]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let result = [...allStoreProducts];

    // Category section filter
    if (selectedSectionId) {
      result = result.filter((p) => p.sectionId === selectedSectionId);
    }

    // Price filter
    result = result.filter((p) => Number(p.price || 0) <= Number(maxPrice));

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // Discount filter
    if (selectedDiscounts.length > 0) {
      result = result.filter((p) => {
        const discount = Number(p.discountPercent || 0);
        return selectedDiscounts.some((label) => {
          if (label === "10% and above") return discount >= 10;
          if (label === "15% and above") return discount >= 15;
          if (label === "20% and above") return discount >= 20;
          if (label === "Buy 1 Get 1")
            return Boolean(p.isBogo) || String(p.badge || "").toLowerCase().includes("bogo");
          return false;
        });
      });
    }

    // Availability filter
    if (availabilityState.inStock && !availabilityState.outOfStock) {
      result = result.filter((p) => p.inStock === true);
    } else if (!availabilityState.inStock && availabilityState.outOfStock) {
      result = result.filter((p) => p.inStock === false);
    } else if (!availabilityState.inStock && !availabilityState.outOfStock) {
      result = [];
    }

    return result;
  }, [allStoreProducts, selectedSectionId, maxPrice, selectedBrands, selectedDiscounts, availabilityState]);

  // Products to render
  const productsToRender = useMemo(() => {
    if (isAnyFilterActive) {
      return filteredProducts;
    }
    if (viewMode === "all") {
      return allStoreProducts;
    }
    return bestSellers;
  }, [isAnyFilterActive, filteredProducts, viewMode, allStoreProducts, bestSellers]);

  // Active section title
  const activeSectionTitle = useMemo(() => {
    if (!selectedSectionId) return null;
    const sec = (store?.sections || []).find((s) => s.id === selectedSectionId);
    return sec ? sec.title : null;
  }, [store, selectedSectionId]);

  // Handlers
  const handleTileClick = (sectionId) => {
    setSelectedSectionId((prev) => (prev === sectionId ? null : sectionId));
    // Smooth scroll to product block with scroll margin
    if (productsBlockRef.current) {
      productsBlockRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBrandToggle = (b) => {
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((item) => item !== b) : [...prev, b]
    );
  };

  const handleDiscountToggle = (label) => {
    setSelectedDiscounts((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const handleClearAll = () => {
    setSelectedSectionId(null);
    setMaxPrice(maxPriceCeil);
    setSelectedBrands([]);
    setSelectedDiscounts([]);
    setAvailabilityState({ inStock: true, outOfStock: false });
    setViewMode("best-sellers");
  };

  // Unknown Store State
  if (!store) {
    return (
      <div
        style={{ fontFamily: "'Inter', sans-serif" }}
        className="bg-white min-h-screen text-[#101828] flex flex-col"
      >
        <Navbar />
        <main className="grow flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#FFFBEB] text-[#F59E0B] flex items-center justify-center mb-4">
              <ShoppingBag size={32} />
            </div>
            <h1 className="text-2xl font-bold text-[#111827]">Store not found</h1>
            <p className="mt-2 text-sm text-[#4B5563]">
              We couldn&apos;t find the store you are looking for. It may have moved or is temporarily unavailable.
            </p>
            <Link
              to="/stores"
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F5B800] text-[#101828] font-bold text-sm hover:bg-[#E0A800] transition-colors"
            >
              <span>View All Stores</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="bg-white min-h-screen text-[#101828] flex flex-col"
    >
      <Navbar />

      <main className="grow">
        {/* Page Container: max-w 1216px, margin 0 auto */}
        <div className="max-w-[1216px] mx-auto px-4 sm:px-6 xl:px-0 py-6">
          {/* 1. Breadcrumb: House icon + "Home > Grocery" matching Figma */}
          <nav aria-label="Breadcrumb" className="mb-6 select-none">
            <ol className="flex items-center flex-wrap gap-2 text-[14px] leading-[20px] text-[#6B7280]">
              <li className="flex items-center gap-1.5">
                <Link
                  to="/"
                  className="hover:text-[#111827] transition-colors flex items-center gap-1 text-[#6B7280]"
                  aria-label="Home"
                >
                  <Home size={16} className="text-[#6B7280]" />
                  <span>Home</span>
                </Link>
              </li>
              <li aria-hidden="true" className="text-[#9CA3AF]">
                <ChevronRight size={14} />
              </li>
              <li aria-current="page">
                <span className="font-semibold text-[#111827]">
                  {store.category || "Grocery"}
                </span>
              </li>
            </ol>
          </nav>

          {/* 2. Store Hero (1216 x 331px) */}
          <StoreHero store={store} />

          {/* 3. Feature Strip (32px gap below Hero) */}
          <div style={{ marginTop: "32px" }}>
            <FeatureStrip store={store} />
          </div>

          {/* 4. Main Grid (32px gap below Feature Strip; 286px sidebar + 906px right column, 24px gap) */}
          <div
            style={{
              marginTop: "32px",
              columnGap: "24px",
              alignItems: "start",
            }}
            className="flex flex-col lg:grid lg:grid-cols-[286px_1fr] w-full"
          >
            {/* Mobile Filter Button (< 1024px) */}
            <div className="w-full lg:hidden flex items-center justify-between pb-3 mb-4 border-b border-[#E7E8E5]">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E7E8E5] bg-white font-bold text-xs text-[#101828] shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F5B800] hover:bg-[#F9FAFB]"
                aria-label="Open Filters"
              >
                <SlidersHorizontal size={14} className="text-[#101828]" />
                <span>Filters</span>
                {isAnyFilterActive && (
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B] inline-block" />
                )}
              </button>
              <span className="text-[12px] font-medium text-[#667085]">
                {productsToRender.length} Products
              </span>
            </div>

            {/* LEFT COLUMN: Sticky Filters Sidebar (286px, only Filters card with double border) */}
            <aside
              id="store-filters-sidebar"
              style={{
                width: "286px",
                minWidth: "286px",
                maxWidth: "286px",
                boxSizing: "border-box",
                padding: "20px",
                borderRadius: "16px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #F3F4F6",
                boxShadow: "0 0 4px 0 rgba(0,0,0,0.25), 0 0 2px 0 rgba(0,0,0,0.1)",
                position: "sticky",
                top: "122px",
                alignSelf: "start",
                height: "fit-content",
                maxHeight: "calc(100dvh - 138px)",
                overflowY: "auto",
                zIndex: 1,
              }}
              className="max-lg:hidden! hidden lg:flex lg:flex-col gap-6 select-none shrink-0"
            >
              {/* Sidebar Header */}
              <div
                style={{
                  width: "100%",
                  height: "33px",
                  paddingBottom: "8px",
                  borderBottom: "1px solid #F3F4F6",
                  display: "flex",
                  alignItems: "center",
                  boxSizing: "border-box",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#111827",
                    margin: 0,
                  }}
                >
                  Filters
                </h2>
              </div>

              {/* PRICE RANGE */}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  boxSizing: "border-box",
                }}
              >
                <SidebarGroupLabel title="PRICE RANGE" />
                <div style={{ width: "100%", height: "18px", display: "flex", alignItems: "center" }}>
                  <input
                    type="range"
                    min={0}
                    max={maxPriceCeil}
                    step={10}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="category-range-slider w-full"
                    aria-label="Filter products by maximum price"
                  />
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: "12px",
                    lineHeight: "16px",
                    color: "#1F2937",
                    boxSizing: "border-box",
                  }}
                >
                  <span>₹0</span>
                  <span>₹{Number(maxPrice).toLocaleString()}</span>
                </div>
              </div>

              {/* BRAND */}
              {validBrands.length >= 2 && (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    boxSizing: "border-box",
                  }}
                >
                  <SidebarGroupLabel title="BRAND" />
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
                    {displayedBrands.map((b) => (
                      <SidebarCheckbox
                        key={b.name}
                        id={`brand-${b.name.replace(/\s+/g, "-")}`}
                        checked={selectedBrands.includes(b.name)}
                        onChange={() => handleBrandToggle(b.name)}
                        label={b.name}
                        count={b.count}
                      />
                    ))}
                  </div>
                  {validBrands.length > 5 && (
                    <button
                      type="button"
                      onClick={() => setShowAllBrands((prev) => !prev)}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: "13px",
                        lineHeight: "20px",
                        color: "#D97706",
                        textAlign: "left",
                        cursor: "pointer",
                        padding: 0,
                        backgroundColor: "transparent",
                        border: "none",
                        marginTop: "2px",
                      }}
                      className="hover:opacity-85"
                    >
                      {showAllBrands ? "- View Less" : "+ View More"}
                    </button>
                  )}
                </div>
              )}

              {/* DISCOUNT */}
              {computedDiscountFilters.length > 0 && (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    boxSizing: "border-box",
                  }}
                >
                  <SidebarGroupLabel title="DISCOUNT" />
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
                    {computedDiscountFilters.map((df) => (
                      <SidebarCheckbox
                        key={df.label}
                        id={`discount-${df.label.replace(/\s+/g, "-")}`}
                        checked={selectedDiscounts.includes(df.label)}
                        onChange={() => handleDiscountToggle(df.label)}
                        label={df.label}
                        count={df.count}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* AVAILABILITY */}
              {computedAvailability.length > 0 && (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    paddingBottom: "8px",
                    boxSizing: "border-box",
                  }}
                >
                  <SidebarGroupLabel title="AVAILABILITY" />
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
                    {computedAvailability.map((av) => (
                      <SidebarCheckbox
                        key={av.label}
                        id={`availability-${av.label.replace(/\s+/g, "-")}`}
                        checked={
                          av.inStock
                            ? availabilityState.inStock
                            : availabilityState.outOfStock
                        }
                        onChange={(e) =>
                          setAvailabilityState((prev) => ({
                            ...prev,
                            [av.inStock ? "inStock" : "outOfStock"]: e.target.checked,
                          }))
                        }
                        label={av.label}
                        count={av.count}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* CLEAR ALL Button */}
              <button
                type="button"
                onClick={handleClearAll}
                style={{
                  width: "100%",
                  height: "34px",
                  padding: "8px 0",
                  borderRadius: "9999px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #FBBF24",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: "13px",
                  lineHeight: "18px",
                  color: "#111827",
                  textAlign: "center",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background-color 0.15s ease",
                  boxSizing: "border-box",
                }}
                className="hover:bg-[#FFFBEB] focus-visible:ring-2 focus-visible:ring-[#F5B800] focus-visible:ring-offset-2 outline-none"
              >
                Clear All
              </button>
            </aside>

            {/* RIGHT COLUMN: 906px at 1440px desktop */}
            <div className="w-full min-w-0 max-w-full flex flex-col">
              {/* BLOCK A: Shop by Category */}
              {store.sections && store.sections.length > 0 && (
                <section aria-label="Shop by Category" className="w-full">
                  <h2
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      fontSize: "24px",
                      lineHeight: "32px",
                      color: "#0B1326",
                      margin: 0,
                    }}
                  >
                    Shop by Category
                  </h2>

                  {/* 5-Column Grid with 16px gap, each tile 168.4px x 148.5px at 906px */}
                  <div
                    style={{
                      marginTop: "6px",
                    }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-start w-full"
                  >
                    {store.sections.map((section, idx) => (
                      <CategoryTile
                        key={section.id}
                        title={section.title}
                        image={section.tileImage}
                        index={idx}
                        isSelected={selectedSectionId === section.id}
                        onClick={() => handleTileClick(section.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* BLOCK B: Best Sellers / Products Grid (48px gap below Shop by Category) */}
              <section
                ref={productsBlockRef}
                id="store-products-block"
                style={{
                  marginTop: "48px",
                  scrollMarginTop: "122px",
                }}
                className="w-full"
                aria-label="Products"
              >
                {/* Header Row: space-between, margin-bottom 18px */}
                <div
                  style={{
                    marginBottom: "18px",
                  }}
                  className="flex items-center justify-between flex-wrap gap-2"
                >
                  {/* Left: Title + count */}
                  <div className="flex items-center gap-2">
                    <h2
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: "20px",
                        lineHeight: "28px",
                        color: "#0B1326",
                        margin: 0,
                      }}
                      className="flex items-center gap-1.5"
                    >
                      {isAnyFilterActive ? (
                        <span>
                          {activeSectionTitle || "Filtered products"} ({filteredProducts.length})
                        </span>
                      ) : viewMode === "all" ? (
                        <span>All Products ({allStoreProducts.length})</span>
                      ) : (
                        <>
                          <span>Best Sellers</span>
                          <span role="img" aria-label="Fire" style={{ fontSize: "20px" }}>
                            🔥
                          </span>
                        </>
                      )}
                    </h2>
                  </div>

                  {/* Right: "View All →" / "Show best sellers" (Hidden when filters/tiles active) */}
                  {!isAnyFilterActive && (
                    <button
                      type="button"
                      onClick={() =>
                        setViewMode((prev) => (prev === "best-sellers" ? "all" : "best-sellers"))
                      }
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: "#059669",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                      className="inline-flex items-center gap-1 hover:underline"
                    >
                      <span>{viewMode === "best-sellers" ? "View All" : "Show best sellers"}</span>
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>

                {/* Accessible live region for filter counts */}
                <div aria-live="polite" className="sr-only">
                  {`Showing ${productsToRender.length} products`}
                </div>

                {/* Product Grid: 4 columns of 211.5px with 20px gap at 906px */}
                {productsToRender.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5 justify-start w-full lg:[grid-template-columns:repeat(4,211.5px)]">
                    {productsToRender.map((product) => (
                      <ListingProductCard key={product.id || product.slug} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-[#F9FAFB] rounded-3xl border border-dashed border-[#E5E7EB]">
                    <ShoppingBag size={48} className="text-[#9CA3AF] mb-3" />
                    <h3 className="text-base font-bold text-[#111827]">
                      No products match these filters
                    </h3>
                    <p className="text-sm text-[#6B7280] max-w-sm mt-1 mb-4">
                      Try resetting your price range or unchecking selected filters.
                    </p>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#F5B800] text-xs font-bold text-[#101828] hover:bg-[#E0A800] transition-colors"
                    >
                      <RotateCcw size={14} />
                      <span>Clear All Filters</span>
                    </button>
                  </div>
                )}
              </section>

              {/* BLOCK C: Two Promo Banners (36px gap below Products block) */}
              <CategoryPromoBanners />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filters Drawer (< 1024px) */}
      {mobileFilterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter products"
          className="fixed inset-0 z-50 lg:hidden flex"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div
            style={{ width: "min(320px, 90vw)" }}
            className="relative h-full bg-white shadow-2xl flex flex-col z-10 overflow-y-auto p-4 font-['Inter']"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6] shrink-0">
              <h3 className="font-bold text-base text-[#111827]">Filters</h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F4F5F8] text-[#111827] cursor-pointer"
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 flex flex-col gap-6">
              {/* Drawer Price Range */}
              <div>
                <span className="font-bold text-xs uppercase tracking-wider text-[#1F2937] block mb-2">
                  PRICE RANGE
                </span>
                <input
                  type="range"
                  min={0}
                  max={maxPriceCeil}
                  step={10}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="category-range-slider w-full"
                />
                <div className="flex justify-between items-center text-xs font-bold text-[#1F2937] mt-2">
                  <span>₹0</span>
                  <span>₹{Number(maxPrice).toLocaleString()}</span>
                </div>
              </div>

              {/* Drawer Brands */}
              {validBrands.length >= 2 && (
                <>
                  <hr className="border-t border-[#F3F4F6]" />
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider text-[#1F2937] block mb-2">
                      BRAND
                    </span>
                    <div className="flex flex-col gap-2">
                      {displayedBrands.map((b) => (
                        <SidebarCheckbox
                          key={b.name}
                          id={`drawer-brand-${b.name.replace(/\s+/g, "-")}`}
                          checked={selectedBrands.includes(b.name)}
                          onChange={() => handleBrandToggle(b.name)}
                          label={b.name}
                          count={b.count}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Drawer Discounts */}
              {computedDiscountFilters.length > 0 && (
                <>
                  <hr className="border-t border-[#F3F4F6]" />
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider text-[#1F2937] block mb-2">
                      DISCOUNT
                    </span>
                    <div className="flex flex-col gap-2">
                      {computedDiscountFilters.map((df) => (
                        <SidebarCheckbox
                          key={df.label}
                          id={`drawer-discount-${df.label.replace(/\s+/g, "-")}`}
                          checked={selectedDiscounts.includes(df.label)}
                          onChange={() => handleDiscountToggle(df.label)}
                          label={df.label}
                          count={df.count}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Drawer Availability */}
              {computedAvailability.length > 0 && (
                <>
                  <hr className="border-t border-[#F3F4F6]" />
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider text-[#1F2937] block mb-2">
                      AVAILABILITY
                    </span>
                    <div className="flex flex-col gap-2">
                      {computedAvailability.map((av) => (
                        <SidebarCheckbox
                          key={av.label}
                          id={`drawer-avail-${av.label.replace(/\s+/g, "-")}`}
                          checked={
                            av.inStock
                              ? availabilityState.inStock
                              : availabilityState.outOfStock
                          }
                          onChange={(e) =>
                            setAvailabilityState((prev) => ({
                              ...prev,
                              [av.inStock ? "inStock" : "outOfStock"]: e.target.checked,
                            }))
                          }
                          label={av.label}
                          count={av.count}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              <hr className="border-t border-[#F3F4F6]" />

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="flex-1 py-2.5 rounded-full border border-[#FBBF24] font-bold text-xs text-[#111827] hover:bg-[#FFFBEB]"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-2.5 rounded-full bg-[#F5B800] font-bold text-xs text-[#101828] hover:bg-[#E0A800]"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
