import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useParams, useSearchParams, Navigate } from "react-router-dom";
import {
  SlidersHorizontal,
  X,
  ArrowRight,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ListingProductCard from "../components/ListingProductCard";
import CategoryHeroBanner from "../components/CategoryHeroBanner";
import CategoryTile from "../components/CategoryTile";
import { imageMap } from "../config/imageMap";
import {
  categoryPages,
  commonDiscountFilters,
  commonAvailability,
} from "../data/categoryPageData";
import { DEFAULT_HERO_IMAGE, DEFAULT_PRODUCT_IMAGE } from "../config/images";

/** 8 Grocery "Shop by Category" tiles in exact Figma order */
const GROCERY_TILES = [
  { id: "atta-dal-rice", title: "Atta, Dal & Rice", image: imageMap.categoryTile.attaDalRice },
  { id: "oil-ghee-masala", title: "Oil, Ghee & Masala", image: imageMap.categoryTile.oilGheeMasala },
  { id: "dry-fruits-breakfast", title: "Dry Fruits & Breakfast", image: imageMap.categoryTile.dryFruitsBreakfast },
  { id: "fruits-veggies", title: "Fruits & Veggies", image: imageMap.categoryTile.fruitsVeggies },
  { id: "dairy", title: "Dairy", image: imageMap.categoryTile.dairy },
  { id: "eggs-meat-fish", title: "Eggs, Meat & Fish", image: imageMap.categoryTile.eggsMeatFish },
  { id: "snacks-beverages", title: "Snacks & Beverages", image: imageMap.categoryTile.snacksBeverages },
  { id: "biscuits-cookies", title: "Biscuits & Cookies", image: imageMap.categoryTile.biscuitsCookies },
];

function mapTileToSubcategory(tileTitle) {
  switch (tileTitle) {
    case "Atta, Dal & Rice":
      return "Atta & Grains";
    case "Oil, Ghee & Masala":
      return "Oil & Ghee";
    case "Dry Fruits & Breakfast":
      return "Breakfast & Cereals";
    case "Fruits & Veggies":
      return "Fruits & Vegetables";
    case "Dairy":
      return "All Groceries";
    case "Eggs, Meat & Fish":
      return "All Groceries";
    case "Snacks & Beverages":
      return "Snacks & Namkeen";
    case "Biscuits & Cookies":
      return "Snacks & Namkeen";
    default:
      return "All Groceries";
  }
}

/** Helper to convert string to slug */
function toSlug(name) {
  return (name || "")
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/** Reusable custom checkbox for sidebar filters matching exact Figma specs */
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
          fontFamily: "var(--font-inter, 'Inter', sans-serif)",
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

/** Group Label matching exact Figma specification: width 100%, height 16px in 22px wrapper */
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
          fontFamily: "var(--font-inter, 'Inter', sans-serif)",
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

export default function CategoryListingPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const productsSectionRef = useRef(null);

  const rawKey = (slug || searchParams.get("cat") || "grocery").toLowerCase();

  // If slug is provided but unknown, redirect to /category/grocery
  if (slug && !categoryPages[rawKey]) {
    return <Navigate to="/category/grocery" replace />;
  }

  const currentCategory = categoryPages[rawKey] || categoryPages.grocery;

  // Filter States
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    currentCategory.subcategories[0]
  );
  const [selectedCategoryTile, setSelectedCategoryTile] = useState(null);
  const [maxPrice, setMaxPrice] = useState(
    currentCategory.priceRange?.max || 1000
  );
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [availabilityState, setAvailabilityState] = useState({
    inStock: true,
    outOfStock: false,
  });
  const [sortBy, setSortBy] = useState("Popularity");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sidebar inner scroll container ref & bottom fade state
  const sidebarScrollRef = useRef(null);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const handleSidebarScroll = useCallback(() => {
    const el = sidebarScrollRef.current;
    if (!el) return;
    const hasMore = el.scrollHeight - el.scrollTop - el.clientHeight > 8;
    setCanScrollDown(hasMore);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSidebarScroll();
    }, 50);
    window.addEventListener("resize", handleSidebarScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleSidebarScroll);
    };
  }, [handleSidebarScroll, currentCategory, showAllBrands]);

  // When category changes (slug), scroll to top and reset all filters
  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedSubcategory(currentCategory.subcategories[0]);
    setSelectedCategoryTile(null);
    setMaxPrice(currentCategory.priceRange?.max || 1000);
    setSelectedBrands([]);
    setShowAllBrands(false);
    setSelectedDiscounts([]);
    setAvailabilityState({
      inStock: true,
      outOfStock: false,
    });
    setSortBy("Popularity");
  }, [rawKey, currentCategory]);

  // Close mobile drawer on Escape and prevent body scrolling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && mobileFilterOpen) {
        setMobileFilterOpen(false);
      }
    };
    if (mobileFilterOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileFilterOpen]);

  // Toggle brand checkbox
  const handleBrandToggle = (brandName) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName)
        ? prev.filter((b) => b !== brandName)
        : [...prev, brandName]
    );
  };

  // Toggle discount checkbox
  const handleDiscountToggle = (label) => {
    setSelectedDiscounts((prev) =>
      prev.includes(label)
        ? prev.filter((d) => d !== label)
        : [...prev, label]
    );
  };

  // Clear all filters: restores default state
  const handleClearAll = () => {
    setMaxPrice(currentCategory.priceRange?.max || 1000);
    setSelectedBrands([]);
    setSelectedDiscounts([]);
    setAvailabilityState({
      inStock: true,
      outOfStock: false,
    });
    setSelectedSubcategory(currentCategory.subcategories[0]);
    setSortBy("Popularity");
  };

  // Scroll to products
  const handleShopNowClick = () => {
    if (productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    let result = [...(currentCategory.products || [])];

    // 1. Subcategory filter
    const isAll =
      !selectedSubcategory ||
      selectedSubcategory === currentCategory.subcategories[0];
    if (!isAll) {
      if (currentCategory.slug === "offers") {
        result = result.filter(
          (p) =>
            p.sourceCategory?.toLowerCase() === selectedSubcategory.toLowerCase()
        );
      } else {
        result = result.filter(
          (p) =>
            p.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase()
        );
      }
    }

    // 2. Price filter
    result = result.filter((p) => Number(p.price) <= Number(maxPrice));

    // 3. Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // 4. Discount filter
    if (selectedDiscounts.length > 0) {
      result = result.filter((p) => {
        return selectedDiscounts.some((discLabel) => {
          if (discLabel.includes("10%")) return (p.discountPercent || 0) >= 10;
          if (discLabel.includes("15%")) return (p.discountPercent || 0) >= 15;
          if (discLabel.includes("20%")) return (p.discountPercent || 0) >= 20;
          if (discLabel.includes("Buy 1")) return (p.discountPercent || 0) >= 15;
          return true;
        });
      });
    }

    // 5. Availability filter
    if (availabilityState.inStock && !availabilityState.outOfStock) {
      result = result.filter((p) => p.inStock === true);
    } else if (!availabilityState.inStock && availabilityState.outOfStock) {
      result = result.filter((p) => p.inStock === false);
    }

    // 6. Sorting
    switch (sortBy) {
      case "Price: Low to High":
        result.sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "Discount":
        result.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
        break;
      case "Popularity":
      default:
        // maintain default category ordering
        break;
    }

    return result;
  }, [
    currentCategory,
    selectedSubcategory,
    maxPrice,
    selectedBrands,
    selectedDiscounts,
    availabilityState,
    sortBy,
  ]);

  // Dynamic Brand List & Counts (Computed directly from currentCategory.products)
  const validBrands = useMemo(() => {
    const prods = currentCategory.products || [];
    const countsMap = {};
    prods.forEach((p) => {
      if (p.brand) {
        countsMap[p.brand] = (countsMap[p.brand] || 0) + 1;
      }
    });

    const preferredOrder = [
      "boAt", "Mi", "Realme", "Philips", "Local",
      "Amul", "Aashirvaad", "Fortune", "Tata Sampann", "Saffola",
      "Mother Dairy", "Nestlé", "Epigamia",
      "Classmate", "Camlin", "Cello", "Faber-Castell",
      "Nivea", "Dove", "Himalaya", "Mamaearth"
    ];

    const list = Object.entries(countsMap)
      .filter(([_, count]) => count > 0)
      .map(([name, count]) => ({ name, count }));

    list.sort((a, b) => {
      const idxA = preferredOrder.indexOf(a.name);
      const idxB = preferredOrder.indexOf(b.name);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return b.count - a.count || a.name.localeCompare(b.name);
    });

    return list;
  }, [currentCategory]);

  const displayedBrands = useMemo(() => {
    return showAllBrands ? validBrands : validBrands.slice(0, 5);
  }, [validBrands, showAllBrands]);

  // Dynamic Discount Filters & Counts (Computed directly from currentCategory.products)
  const computedDiscountFilters = useMemo(() => {
    const prods = currentCategory.products || [];
    const defs = [
      { label: "10% and above", count: prods.filter((p) => (p.discountPercent || 0) >= 10).length },
      { label: "15% and above", count: prods.filter((p) => (p.discountPercent || 0) >= 15).length },
      { label: "20% and above", count: prods.filter((p) => (p.discountPercent || 0) >= 20).length },
      { label: "Buy 1 Get 1", count: prods.filter((p) => (p.discountPercent || 0) >= 25).length },
    ];
    return defs.filter((d) => d.count > 0);
  }, [currentCategory]);

  // Dynamic Availability & Counts (Computed directly from currentCategory.products)
  const computedAvailability = useMemo(() => {
    const prods = currentCategory.products || [];
    const inStockCount = prods.filter((p) => p.inStock === true).length;
    const outOfStockCount = prods.filter((p) => p.inStock === false).length;
    const list = [];
    if (inStockCount > 0) {
      list.push({ label: "In Stock", inStock: true, count: inStockCount });
    }
    if (outOfStockCount > 0) {
      list.push({ label: "Out of Stock", inStock: false, count: outOfStockCount });
    }
    return list;
  }, [currentCategory]);

  const heroData = currentCategory.hero || {};

  return (
    <div className="bg-white min-h-screen text-[#101828] flex flex-col font-sans">
      <Navbar />

      <main className="grow">
        <div className="max-w-[1216px] mx-auto px-4 sm:px-6 xl:px-0 py-6">
          {/* 2. Hero Banner (Reusable CategoryHeroBanner) */}
          <CategoryHeroBanner
            hero={heroData}
            onCtaClick={handleShopNowClick}
          />

          {/* 3. Below Hero: 2 Columns (LEFT sidebar 286px sticky, RIGHT product area 918px, column-gap 12px) */}
          <div
            ref={productsSectionRef}
            style={{
              maxWidth: "1216px",
              width: "100%",
              marginTop: "24px",
              columnGap: "12px",
              alignItems: "start",
            }}
            className="mx-auto flex flex-col lg:grid lg:grid-cols-[286px_918px] lg:items-start"
          >
            {/* Mobile Filter Trigger Button (< 1024px) */}
            <div className="w-full lg:hidden flex items-center justify-between pb-3 mb-2 border-b border-[#E7E8E5]">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E7E8E5] bg-white font-bold text-xs text-[#101828] shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F5B800] hover:bg-[#F9FAFB] active:scale-95 transition-all"
                aria-label="Open Filters and Categories"
              >
                <SlidersHorizontal size={14} className="text-[#101828]" />
                <span>Filters & Categories</span>
              </button>
              <span className="text-[12px] font-medium text-[#667085]">
                {filteredProducts.length} of {currentCategory.totalProducts || currentCategory.products.length} Products
              </span>
            </div>

            {/* LEFT SIDEBAR (Desktop 286px sticky) */}
            <aside
              id="category-left-sidebar"
              style={{
                width: "286px",
                minWidth: "286px",
                maxWidth: "286px",
                padding: "12px",
                borderRadius: "16px",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 0 4px 0 rgba(0,0,0,0.25), 0 0 2px 0 rgba(0,0,0,0.1)",
                position: "sticky",
                top: "122px",
                alignSelf: "start",
                height: "fit-content",
                maxHeight: "calc(100dvh - 138px)",
                overflow: "hidden",
                zIndex: 1,
                boxSizing: "border-box",
                fontFamily: "var(--font-inter, 'Inter', sans-serif)",
              }}
              className="max-lg:hidden! hidden lg:flex lg:flex-col relative select-none shrink-0"
            >
              {/* Inner Scroll Container (holds Categories card and Filters card with 24px gap) */}
              <div
                ref={sidebarScrollRef}
                onScroll={handleSidebarScroll}
                style={{
                  flex: "1 1 0%",
                  minHeight: 0,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                  overflowY: "auto",
                  overflowX: "hidden",
                  overscrollBehavior: "auto",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#D1D5DB transparent",
                  scrollbarGutter: "stable",
                  boxSizing: "border-box",
                }}
                className="sidebar-inner-scroll"
              >
                {/* CARD 1: SUBCATEGORIES */}
                <div
                  style={{
                    width: "100%",
                    minWidth: 0,
                    boxSizing: "border-box",
                    padding: "20px",
                    borderRadius: "12px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #F3F4F6",
                    boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                      fontWeight: 700,
                      fontSize: "20px",
                      lineHeight: "28px",
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    Categories
                  </h2>
                  <nav
                    aria-label="Subcategories"
                    style={{ display: "flex", flexDirection: "column", width: "100%" }}
                  >
                    {currentCategory.subcategories.map((subcat) => {
                      const isActive = selectedSubcategory === subcat;
                      return (
                        <button
                          key={subcat}
                          type="button"
                          onClick={() => setSelectedSubcategory(subcat)}
                          aria-current={isActive ? "true" : undefined}
                          style={{
                            fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                            fontWeight: isActive ? 700 : 500,
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: isActive ? "#C2410C" : "#4B5563",
                            backgroundColor: isActive ? "#FFF7ED" : "transparent",
                            padding: "10px 16px",
                            borderRadius: "10px",
                            textAlign: "left",
                            width: "100%",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            border: "none",
                            cursor: "pointer",
                            transition: "background-color 0.15s ease",
                          }}
                          className={!isActive ? "hover:bg-[#F9FAFB]" : ""}
                        >
                          {subcat}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* CARD 2: FILTERS */}
                <div
                  style={{
                    width: "100%",
                    minWidth: 0,
                    boxSizing: "border-box",
                    padding: "20px",
                    borderRadius: "12px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #F3F4F6",
                    boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  {/* Header */}
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
                        fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                        fontWeight: 700,
                        fontSize: "16px",
                        lineHeight: "24px",
                        letterSpacing: "0px",
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
                        min={currentCategory.priceRange?.min || 0}
                        max={currentCategory.priceRange?.max || 1000}
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
                        fontFamily: "var(--font-inter, 'Inter', sans-serif)",
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

                  {/* BRAND (Hidden if category has no brands with >0 products) */}
                  {displayedBrands.length > 0 && (
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
                            id={`brand-${b.name}`}
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
                            fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                            fontWeight: 600,
                            fontSize: "13px",
                            lineHeight: "20px",
                            color: "#D97706",
                            textDecoration: "none",
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

                  {/* DISCOUNT (Only show rows with count > 0) */}
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

                  {/* AVAILABILITY (Only show rows with count > 0) */}
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
                                [av.inStock ? "inStock" : "outOfStock"]:
                                  e.target.checked,
                              }))
                            }
                            label={av.label}
                            count={av.count}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CLEAR ALL button */}
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
                      fontFamily: "var(--font-inter, 'Inter', sans-serif)",
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
                    className="hover:bg-[#FFFBEB] focus-visible:ring-2 focus-visible:ring-[#FBBF24] focus-visible:ring-offset-2 outline-none"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Bottom Fade Overlay (56px, visible while more content to scroll) */}
              {canScrollDown && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    left: "12px",
                    right: "12px",
                    height: "56px",
                    pointerEvents: "none",
                    background: "linear-gradient(to bottom, rgba(255, 255, 255, 0), #FFFFFF)",
                    borderBottomLeftRadius: "12px",
                    borderBottomRightRadius: "12px",
                    zIndex: 10,
                  }}
                />
              )}
            </aside>

            {/* RIGHT PRODUCT AREA (Desktop 918px, Full Width below lg) */}
            <section
              className="w-full min-w-0 max-w-full lg:w-[918px] lg:max-w-[918px] lg:flex-none flex flex-col"
            >
              {/* BLOCK A: Shop by Category (Grocery Category Page) */}
              {currentCategory.slug === "grocery" && (
                <section aria-label="Shop by Category" className="w-full mb-10">
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
                    style={{ marginTop: "6px" }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-start w-full"
                  >
                    {GROCERY_TILES.map((tile, idx) => {
                      const isSelected = selectedCategoryTile === tile.id;
                      return (
                        <CategoryTile
                          key={tile.id}
                          title={tile.title}
                          image={tile.image}
                          index={idx}
                          isSelected={isSelected}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedCategoryTile(null);
                              setSelectedSubcategory(currentCategory.subcategories[0]);
                            } else {
                              setSelectedCategoryTile(tile.id);
                              const mapped = mapTileToSubcategory(tile.title);
                              if (mapped && currentCategory.subcategories.includes(mapped)) {
                                setSelectedSubcategory(mapped);
                              }
                            }
                          }}
                        />
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Top Row: Title + count (left) and Sort By (right) - gap to grid 16px */}
              <div
                style={{ marginBottom: "16px" }}
                className="flex items-center justify-between flex-wrap gap-4"
              >
                <div className="flex items-baseline gap-2">
                  <h2 className="text-[18px] font-[800] text-[#101828]">
                    {selectedSubcategory === currentCategory.subcategories[0]
                      ? currentCategory.title
                      : selectedSubcategory}
                  </h2>
                  <span className="text-[13px] text-[#667085] font-normal">
                    ({currentCategory.totalProducts || currentCategory.products.length} Products)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="sort-select"
                    className="text-[13px] font-[600] text-[#667085]"
                  >
                    Sort By:
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-[#E7E8E5] rounded-full px-4 py-1.5 text-[13px] font-[700] text-[#101828] bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F5B800] shadow-2xs"
                  >
                    <option value="Popularity">Popularity</option>
                    <option value="Price: Low to High">Price low to high</option>
                    <option value="Price: High to Low">Price high to low</option>
                    <option value="Discount">Discount</option>
                  </select>
                </div>
              </div>

              {/* Product Grid: 4 columns of 211.5px with 24px gap on desktop, 2 cols on phones, 3 on tablets */}
              {filteredProducts.length > 0 ? (
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 justify-between lg:[grid-template-columns:repeat(4,211.5px)] w-full"
                >
                  {filteredProducts.map((product) => (
                    <ListingProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-[#F9FAFB] rounded-3xl border border-dashed border-[#E5E7EB]">
                  <ShoppingBag size={48} className="text-[#9CA3AF] mb-3" />
                  <h3 className="text-base font-bold text-[#111827]">
                    No products found
                  </h3>
                  <p className="text-sm text-[#6B7280] max-w-sm mt-1 mb-4">
                    Try adjusting your filters or price range to find what you are looking for.
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
          </div>
        </div>
      </main>

      {/* Mobile Filters and Categories Drawer (< 1024px) */}
      {mobileFilterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter products"
          className="fixed inset-0 z-50 lg:hidden flex"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMobileFilterOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel from Left */}
          <div
            style={{
              width: "min(320px, 90vw)",
            }}
            className="relative h-full bg-white shadow-2xl flex flex-col z-10 overflow-y-auto p-4 animate-slide-right sidebar-thin-scrollbar font-sans"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6] shrink-0">
              <h3
                style={{
                  fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                  fontWeight: 700,
                  fontSize: "16px",
                  color: "#111827",
                }}
              >
                Filters & Categories
              </h3>
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
              {/* Drawer Categories */}
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                    fontWeight: 700,
                    fontSize: "12px",
                    letterSpacing: "0.6px",
                  }}
                  className="text-[#1F2937] uppercase block mb-2"
                >
                  CATEGORIES
                </span>
                <div className="flex flex-col gap-1">
                  {currentCategory.subcategories.map((subcat) => {
                    const isActive = selectedSubcategory === subcat;
                    return (
                      <button
                        key={subcat}
                        type="button"
                        onClick={() => {
                          setSelectedSubcategory(subcat);
                          setMobileFilterOpen(false);
                        }}
                        style={{
                          fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                          fontWeight: isActive ? 700 : 500,
                          fontSize: "13px",
                          color: isActive ? "#C2410C" : "#4B5563",
                          backgroundColor: isActive ? "#FFF7ED" : "transparent",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          textAlign: "left",
                        }}
                        className="transition-colors"
                      >
                        {subcat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <hr className="border-t border-[#F3F4F6]" />

              {/* Drawer Price Range */}
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                    fontWeight: 700,
                    fontSize: "12px",
                    letterSpacing: "0.6px",
                  }}
                  className="text-[#1F2937] uppercase block mb-2"
                >
                  PRICE RANGE
                </span>
                <input
                  type="range"
                  min={currentCategory.priceRange?.min || 0}
                  max={currentCategory.priceRange?.max || 1000}
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
              {displayedBrands.length > 0 && (
                <>
                  <hr className="border-t border-[#F3F4F6]" />
                  <div>
                    <span
                      style={{
                        fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                        fontWeight: 700,
                        fontSize: "12px",
                        letterSpacing: "0.6px",
                      }}
                      className="text-[#1F2937] uppercase block mb-2"
                    >
                      BRAND
                    </span>
                    <div className="flex flex-col gap-2">
                      {displayedBrands.map((b) => (
                        <SidebarCheckbox
                          key={b.name}
                          id={`drawer-brand-${b.name}`}
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

              {/* Drawer Discount */}
              {computedDiscountFilters.length > 0 && (
                <>
                  <hr className="border-t border-[#F3F4F6]" />
                  <div>
                    <span
                      style={{
                        fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                        fontWeight: 700,
                        fontSize: "12px",
                        letterSpacing: "0.6px",
                      }}
                      className="text-[#1F2937] uppercase block mb-2"
                    >
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
                    <span
                      style={{
                        fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                        fontWeight: 700,
                        fontSize: "12px",
                        letterSpacing: "0.6px",
                      }}
                      className="text-[#1F2937] uppercase block mb-2"
                    >
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
                              [av.inStock ? "inStock" : "outOfStock"]:
                                e.target.checked,
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
            </div>

            {/* Drawer Actions */}
            <div className="mt-auto pt-4 flex gap-2 border-t border-[#F3F4F6]">
              <button
                type="button"
                onClick={handleClearAll}
                className="flex-1 py-2.5 rounded-full border border-[#FBBF24] text-[13px] font-bold text-[#111827] hover:bg-[#FFFBEB] transition-colors"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-full bg-[#F5B800] text-[13px] font-bold text-[#111827] hover:bg-[#E0A800] transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
