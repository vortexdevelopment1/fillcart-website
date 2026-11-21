import React, { useState, useMemo, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Plus,
  Minus,
  ChevronRight,
  ChevronDown,
  ShoppingBag,
  ArrowRight,
  Heart,
  Truck,
  Store,
  Check,
  Shield,
  BookOpen,
  Maximize2,
  X,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ImageViewer from "../components/ImageViewer";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import {
  getProductDetail,
  relatedProducts,
  defaultReviewsData,
  defaultFaqsData,
  MAX_THUMBS,
} from "../data/productDetailData";

export default function ProductDetailPage() {
  const { slug: rawSlug, id: rawId } = useParams();
  const slugOrId = rawSlug || rawId;
  const navigate = useNavigate();

  const { cart, addToCart, removeFromCart } = useCart();
  const wishlistContext = useWishlist ? useWishlist() : null;

  // Retrieve structured product detail from productDetailData
  const product = useMemo(() => {
    return getProductDetail(slugOrId);
  }, [slugOrId]);

  // Gallery state
  const [activeThumbIdx, setActiveThumbIdx] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerStartIndex, setViewerStartIndex] = useState(0);
  const [mainTouchStartX, setMainTouchStartX] = useState(null);

  // Pack size selection state
  const [selectedPackIdx, setSelectedPackIdx] = useState(0);

  // Schedule subscription states
  const [repeatDelivery, setRepeatDelivery] = useState(true);
  const [selectedFreq, setSelectedFreq] = useState("Weekly");
  const [scheduleDate, setScheduleDate] = useState("23 Nov 2026 · 7–9 PM");

  // Local Wishlist state
  const [localWishlisted, setLocalWishlisted] = useState(false);

  // Tabs state: "details" | "reviews" | "faqs"
  const [activeTab, setActiveTab] = useState("details");

  // FAQ accordion open states
  const [openFaqId, setOpenFaqId] = useState(null);

  // Reset pack size and active thumbnail when product changes
  useEffect(() => {
    setActiveThumbIdx(0);
    setSelectedPackIdx(0);
    setSelectedFreq("Weekly");
    setRepeatDelivery(true);
    window.scrollTo(0, 0);
  }, [slugOrId]);

  // If product not found
  if (!product) {
    return (
      <div className="bg-white min-h-screen text-[#101828] flex flex-col font-sans">
        <Navbar />
        <main className="grow flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center p-8 border border-[#E2E8F0] rounded-[24px] bg-[#F8FAFC]">
            <h1
              style={{
                fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                fontWeight: 700,
                fontSize: "24px",
                color: "#0F172A",
              }}
            >
              Product Not Found
            </h1>
            <p
              style={{
                fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                fontSize: "14px",
                color: "#64748B",
              }}
              className="mt-2"
            >
              We couldn't find the product you're looking for. Please browse our
              fresh catalogue.
            </p>
            <Link
              to="/groceries"
              className="mt-6 inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#FBBF24] font-bold text-sm text-[#111827] hover:bg-[#F5B800] transition-colors"
            >
              Back to Groceries
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Active pack size object
  const currentPackSize =
    product.packSizes && product.packSizes[selectedPackIdx]
      ? product.packSizes[selectedPackIdx]
      : { label: product.unit, price: product.price, oldPrice: product.oldPrice };

  const currentPrice = currentPackSize.price;
  const currentOldPrice = currentPackSize.oldPrice;
  const currentSaveAmount = Math.max(0, currentOldPrice - currentPrice);
  const currentDiscountPercent =
    currentOldPrice > currentPrice
      ? Math.round(((currentOldPrice - currentPrice) / currentOldPrice) * 100)
      : 0;

  const saveText =
    currentSaveAmount > 0
      ? `Save ₹${currentSaveAmount} (${currentDiscountPercent}%)`
      : "";

  // Active gallery image
  const galleryImages =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image || "/images/products/placeholder.png"];

  const activeImage = galleryImages[activeThumbIdx] || galleryImages[0];

  // Cart quantity check for this specific product and pack size
  const productId = `${product.slug || product.name}-${currentPackSize.label}`;
  const cartItem = (cart || []).find(
    (item) => item && (item.id === productId || item.id === product.id)
  );
  const quantity = cartItem?.quantity || 0;

  // Wishlist state check
  const isWishlisted = wishlistContext?.isInWishlist
    ? wishlistContext.isInWishlist(product.slug || product.id)
    : localWishlisted;

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlistContext?.toggleWishlist) {
      wishlistContext.toggleWishlist(product);
    } else {
      setLocalWishlisted((prev) => !prev);
    }
  };

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart({
        id: productId,
        name: `${product.name} (${currentPackSize.label})`,
        price: currentPrice,
        oldPrice: currentOldPrice,
        image: activeImage,
        unit: currentPackSize.label,
      });
    }
  };

  const handleRemoveFromCart = () => {
    if (removeFromCart) {
      removeFromCart(productId);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  // Frequency text mapping
  const frequencyText = useMemo(() => {
    switch (selectedFreq) {
      case "Daily":
        return "Every day · 7–9 PM";
      case "Weekly":
        return "Every Monday · 7–9 PM";
      case "Monthly":
        return "Every month · 7–9 PM";
      case "Custom":
      default:
        return "Custom schedule";
    }
  }, [selectedFreq]);

  return (
    <div
      style={{ fontFamily: "var(--font-inter, 'Inter', sans-serif)" }}
      className="bg-white min-h-screen text-[#101828] flex flex-col antialiased selection:bg-[#FDE68A]"
    >
      {/* 1. Standard Navbar */}
      <Navbar />

      <main className="grow pb-24 lg:pb-0">
        <div className="max-w-[1216px] w-full mx-auto px-4 sm:px-6 xl:px-0 py-6 md:py-8">

          {/* Top section responsive styling */}
          <style>{`
            @media (min-width: 1200px) {
              .pdp-top-grid {
                display: grid !important;
                grid-template-columns: 559px 263.5px 263.5px !important;
                grid-template-rows: 487px !important;
                column-gap: 32px !important;
                align-items: stretch !important;
                height: 487px !important;
              }
              .pdp-top-col {
                grid-column: auto !important;
                height: 487px !important;
                min-height: 0 !important;
                box-sizing: border-box !important;
              }
            }
            @media (max-width: 1199px) {
              .pdp-top-grid {
                height: auto !important;
                grid-template-rows: auto !important;
              }
              .pdp-top-col {
                height: auto !important;
                min-height: 0 !important;
                box-sizing: border-box !important;
              }
            }
          `}</style>

          {/* 3. MAIN DETAIL CARD (width 1216px, padding 32px on desktop, 16px on mobile) */}
          <section
            id="pdp-main-detail-card"
            style={{
              width: "100%",
              maxWidth: "1216px",
              borderRadius: "24px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #F1F5F9",
              boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
              boxSizing: "border-box",
              height: "auto",
            }}
            className="w-full relative p-4 sm:p-6 lg:p-8"
            aria-label={`${product.name} detail card`}
          >
            {/* Grid of 12 columns (width 1152px, gap 32px, fixed 487px height at >=1200px) */}
            <div className="pdp-top-grid grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

              {/* a) GALLERY: columns 1-6 (width 559px, height 487px on desktop, full width on mobile) */}
              <div
                className="pdp-top-col w-full max-w-full lg:max-w-[559px] lg:col-span-6 flex flex-col-reverse lg:flex-row gap-3 lg:gap-4 items-center lg:items-start"
              >
                {/* Thumbnails Row (horizontal row on mobile, width 56px vertical on desktop) */}
                <div
                  style={{ boxSizing: "border-box" }}
                  className="flex lg:flex-col gap-3 shrink-0 overflow-x-auto lg:overflow-visible py-1 lg:py-0 w-full lg:w-[56px] no-scrollbar justify-start"
                >
                  {galleryImages.slice(0, MAX_THUMBS).map((img, idx) => {
                    const isPlusNTile =
                      idx === MAX_THUMBS - 1 && galleryImages.length > MAX_THUMBS;
                    const plusNCount = galleryImages.length - MAX_THUMBS;
                    const isActive = idx === activeThumbIdx;

                    if (isPlusNTile) {
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setViewerStartIndex(idx);
                            setIsViewerOpen(true);
                          }}
                          aria-label={`View all ${galleryImages.length} photos`}
                          style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "12px",
                            border: isActive
                              ? "2px solid #FBBF24"
                              : "1px solid #E2E8F0",
                            backgroundColor: isActive ? "#FFFBEB" : "#FFFFFF",
                            padding: "2px",
                            boxSizing: "border-box",
                            position: "relative",
                          }}
                          className="overflow-hidden flex items-center justify-center shrink-0 cursor-pointer transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24]"
                        >
                          <img
                            src={img}
                            alt={`${product.name} thumb ${idx + 1}`}
                            className="w-full h-full object-cover rounded-[9px]"
                          />
                          {/* +N Overlay */}
                          <div
                            style={{
                              position: "absolute",
                              top: "2px",
                              left: "2px",
                              right: "2px",
                              bottom: "2px",
                              borderRadius: "9px",
                              backgroundColor: "rgba(16, 24, 40, 0.70)",
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 800,
                              fontSize: "15px",
                              color: "#FFFFFF",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            +{plusNCount}
                          </div>
                        </button>
                      );
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveThumbIdx(idx)}
                        aria-label={`Show image ${idx + 1} of ${galleryImages.length}`}
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "12px",
                          border: isActive
                            ? "2px solid #FBBF24"
                            : "1px solid #E2E8F0",
                          backgroundColor: isActive ? "#FFFBEB" : "#FFFFFF",
                          padding: "2px",
                          boxSizing: "border-box",
                        }}
                        className="overflow-hidden flex items-center justify-center shrink-0 cursor-pointer transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24]"
                      >
                        <img
                          src={img}
                          alt={`${product.name} thumb ${idx + 1}`}
                          className="w-full h-full object-cover rounded-[9px]"
                        />
                      </button>
                    );
                  })}
                </div>

                {/* MAIN IMAGE BOX: width 487px, height 487px, radius 16px, background #F8FAFC */}
                <div
                  id="pdp-main-image-box"
                  onClick={() => {
                    setViewerStartIndex(activeThumbIdx);
                    setIsViewerOpen(true);
                  }}
                  onTouchStart={(e) => {
                    if (galleryImages.length > 1) {
                      setMainTouchStartX(e.touches[0].clientX);
                    }
                  }}
                  onTouchEnd={(e) => {
                    if (mainTouchStartX !== null && galleryImages.length > 1) {
                      const dx = mainTouchStartX - e.changedTouches[0].clientX;
                      if (Math.abs(dx) >= 50) {
                        if (dx > 0) {
                          setActiveThumbIdx((prev) => (prev + 1) % galleryImages.length);
                        } else {
                          setActiveThumbIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
                        }
                      }
                      setMainTouchStartX(null);
                    }
                  }}
                  style={{
                    borderRadius: "16px",
                    border: "1px solid rgba(241, 245, 249, 0.8)",
                    backgroundColor: "#F8FAFC",
                    boxSizing: "border-box",
                    cursor: "zoom-in",
                  }}
                  className="relative flex items-center justify-center shrink-0 overflow-hidden w-full max-w-full lg:max-w-[487px] aspect-[4/3] lg:aspect-auto lg:h-[487px] p-3 sm:p-4 lg:p-6"
                >
                  {/* Photo container with specified drop shadows */}
                  <img
                    src={activeImage}
                    alt={product.name}
                    style={{
                      filter:
                        "drop-shadow(0px 20px 26px rgba(0, 0, 0, 0.03)) drop-shadow(0px 8px 10px rgba(0, 0, 0, 0.08))",
                    }}
                    className="w-full h-full max-w-[371.44px] max-h-[413.95px] object-contain select-none transition-transform duration-300 hover:scale-105"
                  />

                  {/* Photo Counter Pill: bottom-left 16px inset, #101828B3, Inter 700 12px, padding 6px 12px, radius 999px */}
                  {galleryImages.length > 1 && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "16px",
                        left: "16px",
                        backgroundColor: "rgba(16, 24, 40, 0.70)",
                        borderRadius: "999px",
                        padding: "6px 12px",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: "12px",
                        color: "#FFFFFF",
                        lineHeight: 1,
                        zIndex: 10,
                        pointerEvents: "none",
                      }}
                    >
                      {activeThumbIdx + 1} / {galleryImages.length}
                    </div>
                  )}

                  {/* Heart button (top 16px, right 16px): 36x36 circle */}
                  <button
                    type="button"
                    onClick={handleToggleWishlist}
                    aria-label={
                      isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                    }
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                      boxSizing: "border-box",
                    }}
                    className="flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24]"
                  >
                    <Heart
                      size={18}
                      strokeWidth={2}
                      className={
                        isWishlisted
                          ? "fill-[#EF4444] text-[#EF4444]"
                          : "text-[#64748B] hover:text-[#EF4444]"
                      }
                    />
                  </button>

                  {/* Expand button (bottom 16px, right 16px): 32x32 circle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewerStartIndex(activeThumbIdx);
                      setIsViewerOpen(true);
                    }}
                    aria-label="View full size image"
                    style={{
                      position: "absolute",
                      bottom: "16px",
                      right: "16px",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                      boxSizing: "border-box",
                    }}
                    className="flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer z-10 text-[#64748B] hover:text-[#0F172A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24]"
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>

              {/* b) PRODUCT INFO: columns 7-9 (width 263.5px on desktop, full width below lg) */}
              <div
                className="pdp-top-col w-full max-w-full lg:max-w-[263.5px] lg:col-span-3 flex flex-col justify-between"
              >
                {/* TOP GROUP: gap 16px (badge, title, reviews, price, pack size) */}
                <div className="flex flex-col gap-4">
                  {/* 1. BADGE ROW: width 263.5px, height 27px */}
                  <div
                    style={{ width: "100%", height: "27px", boxSizing: "border-box" }}
                    className="flex items-center"
                  >
                    {product.badge && (
                      <span
                        style={{
                          height: "25px",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          backgroundColor: "#059669",
                          fontWeight: 700,
                          fontSize: "12px",
                          lineHeight: "16px",
                          color: "#FFFFFF",
                          letterSpacing: "0.5px",
                          boxSizing: "border-box",
                          margin: 0,
                        }}
                        className="inline-flex items-center uppercase select-none"
                      >
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* 2. TITLE BLOCK: width 263.5px, min-height 60px, height auto, gap 4px */}
                  <div
                    style={{ width: "100%", minHeight: "60px", boxSizing: "border-box" }}
                    className="flex flex-col gap-1"
                  >
                    <h1
                      style={{
                        fontWeight: 700,
                        fontSize: "28px",
                        lineHeight: "32px",
                        letterSpacing: "-0.5px",
                        color: "#0F172A",
                        margin: 0,
                      }}
                      className="line-clamp-2"
                    >
                      {product.name}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-[#64748B]">
                      <span style={{ fontWeight: 500, fontSize: "14px", lineHeight: "20px", margin: 0 }}>
                        {currentPackSize.label}
                      </span>
                      <span
                        style={{
                          width: "1px",
                          height: "14px",
                          backgroundColor: "#CBD5E1",
                        }}
                      />
                      <span style={{ fontWeight: 500, fontSize: "14px", lineHeight: "20px", margin: 0 }}>
                        {product.tagline || "Fresh & Farm Sourced"}
                      </span>
                    </div>
                  </div>

                  {/* 3. REVIEW BOX: width 263.5px, height 36px */}
                  <div
                    style={{ width: "100%", height: "36px", boxSizing: "border-box" }}
                    className="flex items-center gap-2 select-none"
                  >
                    <Star
                      size={14}
                      className="fill-[#F59E0B] text-[#F59E0B] shrink-0"
                    />
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "13px",
                        lineHeight: "16px",
                        color: "#0F172A",
                        margin: 0,
                      }}
                    >
                      {product.rating}
                    </span>
                    <span
                      style={{
                        fontWeight: 500,
                        fontSize: "12px",
                        lineHeight: "16px",
                        color: "#64748B",
                        margin: 0,
                      }}
                    >
                      ({product.reviewsCount} reviews)
                    </span>
                    <span
                      style={{
                        width: "1px",
                        height: "12px",
                        backgroundColor: "#CBD5E1",
                      }}
                    />
                    <span
                      style={{
                        fontWeight: 500,
                        fontSize: "12px",
                        lineHeight: "16px",
                        color: "#64748B",
                        margin: 0,
                      }}
                    >
                      {product.boughtThisWeek}
                    </span>
                  </div>

                  {/* 4. PRICE BOX: width 263.5px, height 45px */}
                  <div
                    style={{ width: "100%", height: "45px", boxSizing: "border-box" }}
                    className="flex items-center gap-2.5"
                  >
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: "32px",
                        lineHeight: "40px",
                        letterSpacing: "-1px",
                        color: "#0F172A",
                        margin: 0,
                      }}
                    >
                      ₹{currentPrice}
                    </span>
                    {currentOldPrice > currentPrice && (
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "16px",
                          lineHeight: "20px",
                          color: "#94A3B8",
                          textDecoration: "line-through",
                          margin: 0,
                        }}
                      >
                        ₹{currentOldPrice}
                      </span>
                    )}
                    {saveText && (
                      <span
                        style={{
                          backgroundColor: "#ECFDF5",
                          border: "1px solid #A7F3D0",
                          color: "#059669",
                          fontWeight: 600,
                          fontSize: "12px",
                          lineHeight: "16px",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          boxSizing: "border-box",
                          margin: 0,
                        }}
                        className="whitespace-nowrap"
                      >
                        {saveText}
                      </span>
                    )}
                  </div>

                  {/* 5. PACK SIZE: width 263.5px on desktop, with 16px margin-bottom */}
                  <div
                    style={{ width: "100%", boxSizing: "border-box" }}
                    className="flex flex-col justify-between min-h-[74px] mb-4"
                  >
                    <label
                      style={{
                        fontWeight: 600,
                        fontSize: "13px",
                        lineHeight: "18px",
                        color: "#475569",
                        margin: 0,
                      }}
                    >
                      Pack Size
                    </label>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${Math.min(
                          product.packSizes?.length || 1,
                          3
                        )}, 1fr)`,
                        gap: "8px",
                      }}
                    >
                      {product.packSizes?.map((pack, idx) => {
                        const isSelected = idx === selectedPackIdx;
                        return (
                          <button
                            key={pack.label}
                            type="button"
                            onClick={() => setSelectedPackIdx(idx)}
                            aria-pressed={isSelected}
                            style={{
                              height: "36px",
                              borderRadius: "8px",
                              border: isSelected
                                ? "1px solid #FBBF24"
                                : "1px solid #E2E8F0",
                              backgroundColor: isSelected ? "#FFFBEB" : "#FFFFFF",
                              color: isSelected ? "#B45309" : "#334155",
                              fontWeight: 600,
                              fontSize: "13px",
                              lineHeight: "18px",
                              padding: 0,
                              boxSizing: "border-box",
                            }}
                            className="flex items-center justify-center cursor-pointer transition-colors hover:border-[#FBBF24]"
                          >
                            {pack.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* BOTTOM GROUP: Add to Cart (48px) + Buy Now (50px), gap 10px, mt-auto (Desktop only, hidden below lg) */}
                <div
                  style={{ width: "100%", boxSizing: "border-box" }}
                  className="mt-auto flex flex-col gap-[10px] max-lg:hidden"
                >
                  {/* Add to Cart button / Stepper */}
                  {quantity === 0 ? (
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      style={{
                        width: "100%",
                        height: "48px",
                        padding: 0,
                        borderRadius: "12px",
                        backgroundColor: "#FBBF24",
                        boxShadow: "0px 1px 2px 0px #FDE68A",
                        fontWeight: 700,
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: "#111827",
                        boxSizing: "border-box",
                      }}
                      className="inline-flex items-center justify-center gap-2 cursor-pointer transition-colors hover:bg-[#F5B800] active:scale-[0.98]"
                    >
                      <span>Add to Cart</span>
                      <ShoppingBag size={16} className="text-[#111827]" />
                    </button>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "48px",
                        borderRadius: "12px",
                        backgroundColor: "#FBBF24",
                        boxShadow: "0px 1px 2px 0px #FDE68A",
                        boxSizing: "border-box",
                      }}
                      className="inline-flex items-center justify-between px-4 select-none"
                    >
                      <button
                        type="button"
                        onClick={handleRemoveFromCart}
                        aria-label="Decrease quantity"
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 cursor-pointer"
                      >
                        <Minus size={16} className="text-[#111827]" />
                      </button>
                      <span className="font-bold text-sm text-[#111827] leading-[20px]">
                        {quantity} in cart
                      </span>
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        aria-label="Increase quantity"
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 cursor-pointer"
                      >
                        <Plus size={16} className="text-[#111827]" />
                      </button>
                    </div>
                  )}

                  {/* Buy Now button */}
                  <button
                    id="pdp-buy-now-btn"
                    type="button"
                    onClick={handleBuyNow}
                    style={{
                      width: "100%",
                      height: "50px",
                      padding: 0,
                      borderRadius: "12px",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #FDE68A",
                      fontWeight: 700,
                      fontSize: "14px",
                      lineHeight: "20px",
                      color: "#111827",
                      boxSizing: "border-box",
                    }}
                    className="inline-flex items-center justify-center gap-2 cursor-pointer transition-colors hover:bg-[#FFFBEB] active:scale-[0.98]"
                  >
                    <span>Buy Now</span>
                    <ArrowRight size={16} className="text-[#111827]" />
                  </button>
                </div>
              </div>

              {/* c) RIGHT COLUMN: columns 10-12 (width 263.5px on desktop, full width below lg) */}
              <div
                className="pdp-top-col w-full max-w-full lg:max-w-[263.5px] lg:col-span-3 flex flex-col gap-3"
              >
                {/* 1. DELIVERY BOX ("Get it by"): width 263.5px, height 68px, padding 12px */}
                <div
                  id="pdp-delivery-box"
                  style={{
                    width: "100%",
                    height: "68px",
                    padding: "12px",
                    borderRadius: "16px",
                    backgroundColor: "#FFFEF1",
                    boxSizing: "border-box",
                  }}
                  className="flex items-center justify-between border border-[#FEF3C7] shrink-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        backgroundColor: "#FEF3C7",
                        boxSizing: "border-box",
                      }}
                      className="flex items-center justify-center shrink-0 text-[#F59E0B]"
                    >
                      <Truck size={20} />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: "13px",
                            lineHeight: "16px",
                            color: "#0F172A",
                            margin: 0,
                          }}
                        >
                          {product.delivery?.headline || "Get it by"}
                        </span>
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: "13px",
                            lineHeight: "16px",
                            color: "#059669",
                            margin: 0,
                          }}
                        >
                          {product.delivery?.highlight || "Today, 7–9 PM"}
                        </span>
                      </div>
                      <span
                        style={{
                          fontWeight: 500,
                          fontSize: "11px",
                          lineHeight: "14px",
                          color: "#64748B",
                          margin: 0,
                        }}
                      >
                        {product.delivery?.sub || "Free delivery on orders above ₹499"}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#94A3B8] shrink-0" />
                </div>

                {/* 2. SCHEDULE DELIVERY CARD: width 263.5px, height 339px (fixed when repeat on, auto when off) */}
                <div
                  id="pdp-schedule-card"
                  style={{
                    width: "100%",
                    height: repeatDelivery ? "339px" : "auto",
                    padding: "12px",
                    borderRadius: "16px",
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                    border: "1px solid #F1F5F9",
                    boxSizing: "border-box",
                  }}
                  className="flex flex-col gap-2 justify-between shrink-0"
                >
                  {/* Child 1: Title "Schedule delivery" (height 20px, 13px / line-height 20px) */}
                  <span
                    style={{
                      height: "20px",
                      fontWeight: 700,
                      fontSize: "13px",
                      lineHeight: "20px",
                      color: "#334155",
                      margin: 0,
                      boxSizing: "border-box",
                      display: "block",
                    }}
                  >
                    Schedule delivery
                  </span>

                  {/* Child 2: Date field (height 32px, font 12px, line-height 16px, padding 0 12px) */}
                  <button
                    type="button"
                    style={{
                      height: "32px",
                      borderRadius: "8px",
                      backgroundColor: "#F1F5F9",
                      padding: "0 12px",
                      fontWeight: 500,
                      fontSize: "12px",
                      lineHeight: "16px",
                      color: "#334155",
                      boxSizing: "border-box",
                      margin: 0,
                    }}
                    className="w-full flex items-center justify-between cursor-pointer hover:bg-[#E2E8F0] transition-colors"
                  >
                    <span>{scheduleDate}</span>
                    <ChevronDown size={14} className="text-[#64748B]" />
                  </button>

                  {/* Child 3: Repeat row wrapper: border-top 1px, pt 8px, row height 22px, total height 31px */}
                  <div
                    style={{
                      height: "31px",
                      borderTop: "1px solid #F1F5F9",
                      paddingTop: "8px",
                      boxSizing: "border-box",
                      margin: 0,
                    }}
                    className="flex items-center justify-between"
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "13px",
                        lineHeight: "20px",
                        color: "#0F172A",
                        margin: 0,
                      }}
                    >
                      Repeat delivery
                    </span>

                    {/* Toggle switch 36x20 */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={repeatDelivery}
                      onClick={() => setRepeatDelivery((prev) => !prev)}
                      style={{
                        width: "36px",
                        height: "20px",
                        borderRadius: "9999px",
                        backgroundColor: repeatDelivery ? "#059669" : "#CBD5E1",
                        padding: "2px",
                        boxSizing: "border-box",
                        margin: 0,
                      }}
                      className="relative inline-flex items-center cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]"
                    >
                      <span
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          backgroundColor: "#FFFFFF",
                          transform: repeatDelivery
                            ? "translateX(16px)"
                            : "translateX(0)",
                        }}
                        className="inline-block transition-transform duration-200 shadow-xs"
                      />
                    </button>
                  </div>

                  {/* Child 4: Subtext (height 16px, 12px / line-height 16px) */}
                  <p
                    style={{
                      height: "16px",
                      fontWeight: 500,
                      fontSize: "12px",
                      lineHeight: "16px",
                      color: "#64748B",
                      margin: 0,
                      boxSizing: "border-box",
                    }}
                  >
                    Subscribe to get this product regularly.
                  </p>

                  {/* Frequency buttons & subscription summary (hidden when toggle off) */}
                  {repeatDelivery && (
                    <>
                      {/* Child 5: Frequency 2x2 grid (height 72px: 2 rows of 32px + gap 8px) */}
                      <div
                        style={{
                          height: "72px",
                          gap: "8px",
                          boxSizing: "border-box",
                          margin: 0,
                        }}
                        className="grid grid-cols-2"
                      >
                        {["Daily", "Weekly", "Monthly", "Custom"].map((freq) => {
                          const isSelected = freq === selectedFreq;
                          return (
                            <button
                              key={freq}
                              type="button"
                              onClick={() => setSelectedFreq(freq)}
                              style={{
                                height: "32px",
                                borderRadius: "8px",
                                border: isSelected
                                  ? "1px solid #059669"
                                  : "1px solid #E2E8F0",
                                backgroundColor: isSelected
                                  ? "#059669"
                                  : "#FFFFFF",
                                color: isSelected ? "#FFFFFF" : "#334155",
                                fontWeight: 600,
                                fontSize: "12px",
                                lineHeight: "16px",
                                padding: 0,
                                boxSizing: "border-box",
                                margin: 0,
                              }}
                              className="flex items-center justify-center cursor-pointer transition-colors"
                            >
                              {freq}
                            </button>
                          );
                        })}
                      </div>

                      {/* Child 6: Subscription box (height 72px, padding 10px 12px, 3 lines of 12px / lh 16px) */}
                      <div
                        style={{
                          height: "72px",
                          backgroundColor: "#F8FAFC",
                          borderRadius: "8px",
                          padding: "10px 12px",
                          boxSizing: "border-box",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          gap: "2px",
                          margin: 0,
                        }}
                      >
                        {/* Line 1: Your subscription bold */}
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: "12px",
                            lineHeight: "16px",
                            color: "#0F172A",
                            margin: 0,
                            display: "block",
                          }}
                        >
                          Your subscription
                        </span>

                        {/* Line 2: Product + pack size */}
                        <span
                          style={{
                            fontWeight: 500,
                            fontSize: "12px",
                            lineHeight: "16px",
                            color: "#334155",
                            margin: 0,
                            display: "block",
                          }}
                          className="truncate"
                        >
                          {product.name} · {currentPackSize.label} x 1
                        </span>

                        {/* Line 3: Frequency text on left, Price on right */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontSize: "12px",
                            lineHeight: "16px",
                            margin: 0,
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 500,
                              fontSize: "12px",
                              lineHeight: "16px",
                              color: "#475569",
                              margin: 0,
                            }}
                            className="truncate"
                          >
                            {frequencyText}
                          </span>
                          <span
                            aria-label={`Per delivery ₹${currentPrice}`}
                            style={{
                              fontWeight: 700,
                              fontSize: "14px",
                              lineHeight: "16px",
                              color: "#0F172A",
                              margin: 0,
                              flexShrink: 0,
                            }}
                          >
                            ₹{currentPrice}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Child 7: Footer note (height 16px, 12px / line-height 16px) */}
                  <span
                    style={{
                      height: "16px",
                      fontWeight: 500,
                      fontSize: "12px",
                      lineHeight: "16px",
                      color: "#64748B",
                      margin: 0,
                      boxSizing: "border-box",
                      display: "block",
                    }}
                  >
                    Skip, pause or cancel anytime.
                  </span>
                </div>

                {/* 3. SELLER BOX: width 263.5px, height 56px, padding 10px 12px */}
                <div
                  id="pdp-seller-box"
                  style={{
                    width: "100%",
                    height: "56px",
                    padding: "10px 12px",
                    borderRadius: "16px",
                    backgroundColor: "#FFFEF1",
                    boxSizing: "border-box",
                    margin: 0,
                  }}
                  className="flex items-center justify-between border border-[#FEF3C7] shrink-0"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        backgroundColor: "#FEF3C7",
                        boxSizing: "border-box",
                      }}
                      className="flex items-center justify-center shrink-0 text-[#F59E0B]"
                    >
                      <Store size={18} />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span
                          style={{
                            fontWeight: 500,
                            fontSize: "12px",
                            lineHeight: "16px",
                            color: "#64748B",
                            margin: 0,
                          }}
                        >
                          Sold by
                        </span>
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: "12px",
                            lineHeight: "16px",
                            color: "#0F172A",
                            margin: 0,
                          }}
                        >
                          {product.seller?.name || "FreshMart"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] leading-[14px] text-[#64748B] m-0">
                        <Star
                          size={11}
                          className="fill-[#F59E0B] text-[#F59E0B]"
                        />
                        <span style={{ fontSize: "11px", lineHeight: "14px", margin: 0 }}>
                          {product.seller?.rating || "4.6"} (
                          {product.seller?.ratingsCount || "8.2k+ ratings"})
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#94A3B8] shrink-0" />
                </div>
              </div>
            </div>
          </section>

          {/* 4. TABS (margin-top 32px) */}
          <div
            style={{
              borderBottom: "1px solid #E2E8F0",
              gap: "28px",
              paddingBottom: "12px",
            }}
            className="mt-8 flex items-center overflow-x-auto"
            role="tablist"
            aria-label="Product detailed information tabs"
          >
            <button
              type="button"
              role="tab"
              id="tab-details"
              aria-controls="panel-details"
              aria-selected={activeTab === "details"}
              onClick={() => setActiveTab("details")}
              style={{
                fontWeight: activeTab === "details" ? 700 : 600,
                fontSize: "14px",
                color: activeTab === "details" ? "#F5B800" : "#475569",
                borderBottom:
                  activeTab === "details" ? "2px solid #F5B800" : "none",
                paddingBottom: "12px",
                marginBottom: "-13px",
              }}
              className="cursor-pointer transition-colors whitespace-nowrap"
            >
              Product Details
            </button>

            <button
              type="button"
              role="tab"
              id="tab-reviews"
              aria-controls="panel-reviews"
              aria-selected={activeTab === "reviews"}
              onClick={() => setActiveTab("reviews")}
              style={{
                fontWeight: activeTab === "reviews" ? 700 : 600,
                fontSize: "14px",
                color: activeTab === "reviews" ? "#F5B800" : "#475569",
                borderBottom:
                  activeTab === "reviews" ? "2px solid #F5B800" : "none",
                paddingBottom: "12px",
                marginBottom: "-13px",
              }}
              className="cursor-pointer transition-colors whitespace-nowrap"
            >
              Ratings & Reviews ({product.reviewsCount})
            </button>

            <button
              type="button"
              role="tab"
              id="tab-faqs"
              aria-controls="panel-faqs"
              aria-selected={activeTab === "faqs"}
              onClick={() => setActiveTab("faqs")}
              style={{
                fontWeight: activeTab === "faqs" ? 700 : 600,
                fontSize: "14px",
                color: activeTab === "faqs" ? "#F5B800" : "#475569",
                borderBottom:
                  activeTab === "faqs" ? "2px solid #F5B800" : "none",
                paddingBottom: "12px",
                marginBottom: "-13px",
              }}
              className="cursor-pointer transition-colors whitespace-nowrap"
            >
              FAQs
            </button>
          </div>

          {/* 5. TAB PANELS */}
          {/* TAB 1: PRODUCT DETAILS PANEL */}
          {activeTab === "details" && (
            <div
              id="panel-details"
              role="tabpanel"
              aria-labelledby="tab-details"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #F1F5F9",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
                columnGap: "32px",
              }}
              className="mt-6 grid grid-cols-1 md:grid-cols-2 relative"
            >
              {/* LEFT: About this Product */}
              <div className="flex flex-col gap-6 md:pr-4">
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#0F172A",
                  }}
                >
                  About this Product
                </h3>
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "#475569",
                  }}
                >
                  {product.about}
                </p>

                {/* 3 highlight chips in a row (gap 12px) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {product.highlights?.map((hl, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: "#ECFDF5",
                        borderRadius: "12px",
                        padding: "12px",
                      }}
                      className="flex items-start gap-2.5"
                    >
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          backgroundColor: "#FFFFFF",
                        }}
                        className="flex items-center justify-center shrink-0 text-[#059669]"
                      >
                        {hl.icon === "check" && <Check size={14} strokeWidth={2.5} />}
                        {hl.icon === "shield" && <Shield size={14} strokeWidth={2.5} />}
                        {hl.icon === "book" && <BookOpen size={14} strokeWidth={2.5} />}
                        {!["check", "shield", "book"].includes(hl.icon) && (
                          <Check size={14} strokeWidth={2.5} />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: "12px",
                            color: "#0F172A",
                          }}
                        >
                          {hl.title}
                        </span>
                        <span
                          style={{
                            fontWeight: 400,
                            fontSize: "11px",
                            color: "#64748B",
                            lineHeight: "15px",
                          }}
                        >
                          {hl.sub}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Middle vertical divider on desktop */}
              <div
                style={{
                  width: "1px",
                  backgroundColor: "#F1F5F9",
                }}
                className="hidden md:block absolute top-8 bottom-8 left-1/2 -translate-x-1/2"
              />

              {/* RIGHT: Product Information */}
              <div className="flex flex-col gap-6 md:pl-4 mt-6 md:mt-0">
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#0F172A",
                  }}
                >
                  Product Information
                </h3>

                {/* Table with 1px border and alternate backgrounds */}
                <div
                  style={{
                    border: "1px solid #F1F5F9",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                  className="w-full flex flex-col"
                >
                  {product.info?.map(([label, val], idx) => {
                    const isEven = idx % 2 === 0;
                    const isLast = idx === (product.info.length - 1);
                    return (
                      <div
                        key={label}
                        style={{
                          height: "44px",
                          display: "grid",
                          gridTemplateColumns: "40% 1fr",
                          alignItems: "center",
                          backgroundColor: isEven ? "#F8FAFC" : "#FFFFFF",
                          borderBottom: isLast ? "none" : "1px solid #E9EDF3",
                          padding: "0 16px",
                          fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 500,
                            fontSize: "13px",
                            color: "#64748B",
                          }}
                        >
                          {label}
                        </span>
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: "13px",
                            color: "#0F172A",
                            textAlign: "left",
                          }}
                          className="truncate"
                        >
                          {val}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RATINGS & REVIEWS PANEL */}
          {activeTab === "reviews" && (
            <div
              id="panel-reviews"
              role="tabpanel"
              aria-labelledby="tab-reviews"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #F1F5F9",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
              }}
              className="mt-6 flex flex-col gap-8"
            >
              {/* Summary Header */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-6 border-b border-[#F1F5F9]">
                <div className="md:col-span-4 flex flex-col items-center md:items-start">
                  <div className="flex items-baseline gap-2">
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: "48px",
                        color: "#0F172A",
                      }}
                    >
                      {product.reviewsData?.average || product.rating}
                    </span>
                    <span className="text-[#64748B] text-lg font-bold">/ 5</span>
                  </div>
                  <div className="flex items-center gap-1 my-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={18}
                        className="fill-[#F59E0B] text-[#F59E0B]"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#64748B] font-medium">
                    Based on {product.reviewsData?.totalReviews || product.reviewsCount} customer reviews
                  </span>
                </div>

                <div className="md:col-span-8 flex flex-col gap-2">
                  {product.reviewsData?.breakdown?.map((b) => (
                    <div key={b.stars} className="flex items-center gap-3 text-xs">
                      <span className="w-12 font-bold text-[#334155]">
                        {b.stars} Star
                      </span>
                      <div className="flex-1 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <div
                          style={{ width: `${b.percentage}%` }}
                          className="h-full bg-[#F59E0B] rounded-full"
                        />
                      </div>
                      <span className="w-10 text-right text-[#64748B]">
                        {b.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="flex flex-col gap-6">
                {product.reviewsData?.reviews?.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-[16px] bg-[#F8FAFC] border border-[#F1F5F9] flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#0F172A]">
                          {rev.author}
                        </span>
                        {rev.verified && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#059669]">
                            <CheckCircle2 size={13} /> Verified Purchase
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#94A3B8]">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          className={
                            star <= rev.rating
                              ? "fill-[#F59E0B] text-[#F59E0B]"
                              : "text-[#CBD5E1]"
                          }
                        />
                      ))}
                    </div>

                    <h4 className="font-bold text-sm text-[#0F172A] mt-1">
                      {rev.title}
                    </h4>
                    <p className="text-sm text-[#475569] leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FAQS PANEL */}
          {activeTab === "faqs" && (
            <div
              id="panel-faqs"
              role="tabpanel"
              aria-labelledby="tab-faqs"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #F1F5F9",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
              }}
              className="mt-6 flex flex-col gap-3"
            >
              {product.faqsData?.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="border border-[#F1F5F9] rounded-[16px] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        size={16}
                        className={`text-[#64748B] transition-transform ${isOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-sm text-[#475569] leading-relaxed bg-[#F8FAFC]">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 6. "YOU MAY ALSO LIKE" (margin-top 48px) */}
          <section
            style={{ width: "100%" }}
            className="mt-12"
            aria-label="Related products recommendations"
          >
            <h2
              style={{
                fontWeight: 800,
                fontSize: "22px",
                lineHeight: "28px",
                letterSpacing: "-0.5px",
                color: "#0F172A",
              }}
            >
              You May Also Like
            </h2>

            {/* Row of 6 compact cards (gap 12px, scroll-snap) */}
            <div className="mt-4 flex gap-3 overflow-x-auto pb-4 pt-1 snap-x no-scrollbar">
              {relatedProducts.map((rel) => {
                return (
                  <article
                    key={rel.id}
                    style={{
                      width: "189px",
                      minWidth: "189px",
                      borderRadius: "16px",
                      border: "1px solid #F1F5F9",
                      padding: "8px",
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
                    }}
                    className="flex flex-col justify-between group snap-start transition-transform hover:-translate-y-1"
                  >
                    <div className="flex flex-col">
                      {/* Image Box (aspect-ratio 1 / 0.95, radius 12px) */}
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "1 / 0.95",
                          borderRadius: "12px",
                          backgroundColor: "#F8FAFC",
                        }}
                        className="relative overflow-hidden flex items-center justify-center shrink-0"
                      >
                        <Link
                          to={`/product/${rel.slug}`}
                          className="w-full h-full flex items-center justify-center cursor-pointer"
                        >
                          <img
                            src={rel.image}
                            alt={rel.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </Link>

                        {/* Discount Badge top-left */}
                        <div
                          style={{
                            position: "absolute",
                            top: "8px",
                            left: "8px",
                            backgroundColor: "#059669",
                            borderRadius: "6px",
                            padding: "3px 6px",
                          }}
                          className="select-none pointer-events-none"
                        >
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: "9px",
                              color: "#FFFFFF",
                              textTransform: "uppercase",
                              display: "block",
                            }}
                          >
                            {rel.discount}
                          </span>
                        </div>

                        {/* Heart button top-right (28x28 white circle) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          aria-label={`Save ${rel.name}`}
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            backgroundColor: "#FFFFFF",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                          }}
                          className="flex items-center justify-center cursor-pointer transition-transform hover:scale-105 text-[#64748B] hover:text-[#EF4444]"
                        >
                          <Heart size={14} />
                        </button>
                      </div>

                      {/* Product Name (Inter 700, 12px, line-height 16px, min-height 32px) */}
                      <Link
                        to={`/product/${rel.slug}`}
                        className="block mt-2 hover:text-[#B45309] transition-colors"
                      >
                        <h4
                          style={{
                            fontWeight: 700,
                            fontSize: "12px",
                            lineHeight: "16px",
                            color: "#0F172A",
                            minHeight: "32px",
                          }}
                          className="line-clamp-2"
                        >
                          {rel.name}
                        </h4>
                      </Link>

                      {/* Unit (Inter 500, 10px, #94A3B8) */}
                      <span
                        style={{
                          fontWeight: 500,
                          fontSize: "10px",
                          color: "#94A3B8",
                        }}
                        className="mt-0.5 block"
                      >
                        {rel.unit}
                      </span>
                    </div>

                    {/* Price Row: left price + old price; right yellow "Add +" pill */}
                    <div className="flex items-center justify-between mt-2 pt-1">
                      <div className="flex flex-col">
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: "15px",
                            color: "#0F172A",
                          }}
                        >
                          ₹{rel.price}
                        </span>
                        <span
                          style={{
                            fontWeight: 500,
                            fontSize: "10px",
                            color: "#94A3B8",
                            textDecoration: "line-through",
                          }}
                        >
                          ₹{rel.oldPrice}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (addToCart) {
                            addToCart({
                              id: rel.id,
                              name: rel.name,
                              price: rel.price,
                              oldPrice: rel.oldPrice,
                              image: rel.image,
                              unit: rel.unit,
                            });
                          }
                        }}
                        style={{
                          height: "28px",
                          padding: "0 14px",
                          borderRadius: "9999px",
                          backgroundColor: "#FBBF24",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                          fontWeight: 700,
                          fontSize: "11px",
                          color: "#111827",
                        }}
                        className="inline-flex items-center justify-center cursor-pointer transition-colors hover:bg-[#F5B800] active:scale-95"
                      >
                        Add +
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {/* Mobile Sticky Bottom Action Bar (< 1024px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8F0] p-3 shadow-lg flex gap-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))]">
        <button
          type="button"
          onClick={handleAddToCart}
          style={{
            height: "46px",
            borderRadius: "12px",
            backgroundColor: "#FBBF24",
            fontWeight: 700,
            fontSize: "13px",
            color: "#111827",
          }}
          className="flex-1 flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
        >
          <span>{quantity > 0 ? `In Cart (${quantity})` : "Add to Cart"}</span>
          <ShoppingBag size={15} />
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          style={{
            height: "46px",
            borderRadius: "12px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #FDE68A",
            fontWeight: 700,
            fontSize: "13px",
            color: "#111827",
          }}
          className="flex-1 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <span>Buy Now</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Image Viewer Lightbox Modal */}
      {isViewerOpen && (
        <ImageViewer
          images={galleryImages}
          startIndex={viewerStartIndex}
          alt={product.name}
          productLabel={`${product.name} · ${currentPackSize.label}`}
          onClose={() => setIsViewerOpen(false)}
        />
      )}

      {/* 7. Standard Footer */}
      <Footer />
    </div>
  );
}
