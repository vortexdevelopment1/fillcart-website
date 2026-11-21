import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { imageMap } from "../config/imageMap";

/** Helper to safely encode URI without double encoding */
function safeEncodeURI(path) {
  if (!path) return "";
  try {
    return encodeURI(decodeURI(path));
  } catch {
    return encodeURI(path);
  }
}

/**
 * CategoryPromoBanners Component (Exact Figma Specification)
 * 
 * - 2-column grid, gap 20px (each 443px wide x 152px high at 906px container width), margin-top 36px
 * - Border-radius 32px, overflow hidden, no border, no shadow
 * - Under 1024px: 1 column (gap 16px)
 * - Under 560px: image height 110px, title 20px / 28px, button height 36px
 * 
 * Banner 1 ("Daily Essentials"):
 * - Background: linear-gradient(90deg, #F2FAEE 0%, #E9F8E2 100%)
 * - Content padding-left 16px, padding-top 16px
 * - Title: Inter 700, 24px / 32px (20px / 28px on <560px), max-width 215px
 *   Line 1: "Daily Essentials" in #000000
 *   Line 2: "at the Best Prices" in #00A22E
 * - Button "Shop Now →": height 36px, padding 0 20px, rounded-full, bg #08631B, text white Inter 600 14px, arrow icon 16px (gap 8px)
 *   Sits 100px from top / 16px from bottom
 *   Link: /category/home-essentials
 * - Image: imageMap.promoBanner.dailyEssentials (/images/banners/banner-cleaning-supplies.png, width ~224px, height ~143px)
 * 
 * Banner 2 ("Deals of the Day"):
 * - Background: linear-gradient(90deg, #FDEEE3 0%, #FEF2EA 40%, #FDEFDE 100%)
 * - Content padding-left 12px, padding-top 16px
 * - Title: Inter 700, 24px / 32px (20px / 28px on <560px), max-width 230px
 *   Line 1: "Deals of the Day" in #000000
 *   Line 2: "Up to 20% OFF" in #A20D00
 * - Button "Explore Deals →": same style, bg #FF7D00, ~149px wide
 *   Link: /category/offers
 * - Image: imageMap.promoBanner.dealsOfTheDay (/images/banners/banner-vegetable-basket.png, right 0, bottom 4px, width ~200px, height ~142px)
 */
export default function CategoryPromoBanners({ className = "" }) {
  const dailyImg = safeEncodeURI(imageMap.promoBanner?.dailyEssentials || "/images/banners/banner-cleaning-supplies.png");
  const dealsImg = safeEncodeURI(imageMap.promoBanner?.dealsOfTheDay || "/images/banners/deals-of-the-day.svg");

  return (
    <div
      id="category-promo-banners"
      style={{
        marginTop: "36px",
        fontFamily: "'Inter', sans-serif",
      }}
      className={`w-full grid grid-cols-1 lg:grid-cols-2 gap-[16px] lg:gap-[20px] ${className}`}
    >
      {/* Banner 1: Daily Essentials */}
      <div
        style={{
          borderRadius: "32px",
          background: "linear-gradient(90deg, #F2FAEE 0%, #E9F8E2 100%)",
          border: "none",
          boxShadow: "none",
        }}
        className="relative w-full h-[152px] overflow-hidden select-none"
      >
        {/* Vector SVG curve for bottom darker green shape (infinitely crisp at any zoom) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 443 152"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="greenCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#CCE5BD" />
              <stop offset="50%" stopColor="#BEE4AB" />
              <stop offset="100%" stopColor="#A8DA94" />
            </linearGradient>
          </defs>
          <path
            d="M 0,137 C 120,137 210,126 310,118 C 360,114 410,110 443,110 L 443,152 L 0,152 Z"
            fill="url(#greenCurveGrad)"
          />
        </svg>

        {/* Super-retina illustration on the right */}
        <img
          src={dailyImg}
          alt=""
          aria-hidden="true"
          className="absolute right-0 top-0 bottom-0 h-full w-auto max-w-[240px] object-contain object-right pointer-events-none select-none z-[1]"
        />

        {/* Content Overlay */}
        <div className="relative z-10 w-full h-full box-border pl-[16px] pt-[16px]">
          {/* Title */}
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              maxWidth: "215px",
              margin: 0,
            }}
            className="text-[20px] leading-[28px] sm:text-[24px] sm:leading-[32px] tracking-normal"
          >
            <span style={{ color: "#000000" }} className="block">Daily Essentials</span>
            <span style={{ color: "#00A22E" }} className="block">at the Best Prices</span>
          </h2>

          {/* Button */}
          <Link
            to="/category/home-essentials"
            aria-label="Shop daily essentials at the best prices"
            style={{
              position: "absolute",
              top: "100px",
              left: "16px",
              height: "36px",
              padding: "0 20px",
              borderRadius: "999px",
              backgroundColor: "#08631B",
              color: "#FFFFFF",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              boxSizing: "border-box",
              cursor: "pointer",
            }}
            className="hover:opacity-95 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#08631B] focus-visible:ring-offset-2"
          >
            <span>Shop Now</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Banner 2: Deals of the Day */}
      <div
        style={{
          borderRadius: "32px",
          border: "none",
          boxShadow: "none",
        }}
        className="relative w-full h-[152px] overflow-hidden select-none"
      >
        {/* Background Image: Whole card background from /images/banners/deals-of-the-day.svg */}
        <img
          src={dealsImg}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            zIndex: 0,
            pointerEvents: "none",
            display: "block",
          }}
        />

        {/* Content Overlay */}
        <div className="relative z-10 w-full h-full box-border pl-[12px] pt-[16px]">
          {/* Title */}
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              maxWidth: "230px",
              margin: 0,
            }}
            className="text-[20px] leading-[28px] sm:text-[24px] sm:leading-[32px] tracking-normal"
          >
            <span style={{ color: "#000000" }} className="block">Deals of the Day</span>
            <span style={{ color: "#A20D00" }} className="block">Up to 20% OFF</span>
          </h2>

          {/* Button */}
          <Link
            to="/category/offers"
            aria-label="Explore deals of the day"
            style={{
              position: "absolute",
              top: "100px",
              left: "12px",
              height: "36px",
              padding: "0 20px",
              borderRadius: "999px",
              backgroundColor: "#FF7D00",
              color: "#FFFFFF",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              boxSizing: "border-box",
              cursor: "pointer",
            }}
            className="hover:opacity-95 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7D00] focus-visible:ring-offset-2"
          >
            <span>Explore Deals</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
