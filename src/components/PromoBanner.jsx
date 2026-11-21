import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/**
 * Font weight constant for PromoBanner title.
 * Figma specifies Black / 900 in SF Pro Rounded.
 * Inter 800 is the standard web match; change to 900 if a bolder appearance is desired.
 */
export const TITLE_FONT_WEIGHT = 800;

/**
 * PromoBanner Component (Slide 2 - Pista Green Grocery Banner)
 * 
 * Matches Figma "Banner/Grocery" exactly:
 * - Canvas: 1216px x CAROUSEL_HEIGHT (410px), radius 32px, overflow hidden
 * - Background: linear-gradient(90deg, #D8FFDB 0%, #FFEAD2 50%, #FFDFAE 100%)
 * - Text group: position absolute; left 42px; top 50%; transform translateY(-50%); width 330px (max-width 384px)
 *   · Title: two lines "Groceries for" / "Your Daily Needs", height 96px (2x48px), color #111827
 *     Font: "SF Pro Rounded", "SF Pro Display", Inter, system-ui, sans-serif; 40px/48px, -0.3px tracking, weight 800
 *   · Subtitle: mt 16px, height 40px, Inter 600, 16px/20px, color #374151, 2 lines with <br>
 *   · Button "Shop Now": mt 40px, 147x52px, padding 12px 24px, bg #FBBF24, label Inter 700 16px #111827, NO arrow icon
 * - Image: position absolute; right 0; top -3px; height calc(100% + 6px); width auto; max-width 62%; object-fit contain; object-position right center
 * - Responsive:
 *   · At >= 1200px: exact desktop layout
 *   · 768px-1200px: scales proportionally with CSS transform scale
 *   · < 768px: mobile friendly (title 28px/34px, image behind text at 0.25 opacity, no horizontal overflow)
 */
export default function PromoBanner({
  banner = {},
  isActive = true,
  scale: externalScale,
  isMobile: externalIsMobile,
  carouselHeight = 410,
}) {
  const containerRef = useRef(null);
  const [internalScale, setInternalScale] = useState(1);
  const [internalIsMobile, setInternalIsMobile] = useState(false);

  useEffect(() => {
    if (externalScale !== undefined && externalIsMobile !== undefined) return;
    if (!containerRef.current) return;

    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      if (width < 768) {
        setInternalIsMobile(true);
        setInternalScale(1);
      } else {
        setInternalIsMobile(false);
        if (width >= 1200) {
          setInternalScale(1);
        } else {
          setInternalScale(width / 1216);
        }
      }
    };

    handleResize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [externalScale, externalIsMobile]);

  const scale = externalScale !== undefined ? externalScale : internalScale;
  const isMobile = externalIsMobile !== undefined ? externalIsMobile : internalIsMobile;

  const {
    background = "linear-gradient(90deg, #D8FFDB 0%, #FFEAD2 50%, #FFDFAE 100%)",
    image = "/images/banners/grocery-hero-trimmed.png",
    ctaTo = "/category/grocery",
    ctaLabel = "Shop Now",
  } = banner;

  return (
    <div
      ref={containerRef}
      style={{
        background,
        borderRadius: "32px",
        overflow: "hidden",
        position: "relative",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
      }}
      className="w-full h-full select-none"
    >
      {isMobile ? (
        /* Mobile Layout (< 768px): proportionate text, padding and button scaled so nothing is cut off */
        <div className="relative w-full h-full p-3 sm:p-6 flex flex-col justify-center items-start overflow-hidden">
          {/* Text Group */}
          <div className="relative z-10 flex flex-col items-start max-w-[72%] sm:max-w-[65%]">
            {/* Title */}
            <h2
              style={{
                margin: 0,
                fontFamily: '"SF Pro Rounded", "SF Pro Display", Inter, system-ui, sans-serif',
                fontWeight: TITLE_FONT_WEIGHT,
                color: "#111827",
              }}
              className="text-[12px] min-[360px]:text-[14px] sm:text-[22px] leading-[15px] min-[360px]:leading-[18px] sm:leading-[26px] tracking-[-0.3px]"
            >
              <span className="block">Groceries for</span>
              <span className="block">Your Daily Needs</span>
            </h2>

            {/* Subtitle */}
            <p
              style={{
                margin: 0,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                color: "#374151",
              }}
              className="mt-1 sm:mt-2 text-[9px] min-[360px]:text-[10px] sm:text-[13px] leading-[12px] min-[360px]:leading-[14px] sm:leading-[18px] line-clamp-2"
            >
              Fresh fruits, vegetables, dairy, snacks &amp; staples.
            </p>

            {/* Shop Now Button */}
            <Link
              to={ctaTo}
              tabIndex={isActive ? 0 : -1}
              aria-label={ctaLabel}
              style={{
                fontFamily: "'Inter', sans-serif",
                boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
              }}
              className="mt-1.5 min-[360px]:mt-2 sm:mt-4 h-[24px] min-[360px]:h-[28px] sm:h-[40px] px-2.5 min-[360px]:px-3.5 sm:px-5 rounded-full bg-[#FBBF24] hover:bg-[#F5B800] text-[#111827] font-bold text-[9px] min-[360px]:text-[11px] sm:text-[14px] inline-flex items-center justify-center transition-all shadow-xs active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]"
            >
              {ctaLabel}
            </Link>
          </div>

          {/* Background Illustration on Mobile (right-anchored, scaled) */}
          {image && (
            <img
              src={image}
              alt=""
              aria-hidden="true"
              className="absolute right-1 sm:right-3 bottom-1 sm:bottom-2 h-auto max-h-[85%] max-w-[32%] sm:max-w-[40%] object-contain object-right-bottom pointer-events-none select-none z-0 opacity-80 sm:opacity-90"
            />
          )}
        </div>
      ) : (
        /* Desktop & Tablet Layout (>= 768px): Fixed 1216xCAROUSEL_HEIGHT canvas scaled via CSS transform */
        <div
          data-testid="promo-banner-canvas"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "1216px",
            height: `${carouselHeight}px`,
            transformOrigin: "0 0",
            transform: scale !== 1 ? `scale(${scale})` : "none",
            pointerEvents: "auto",
          }}
        >
          {/* Text Group: left 42px; top 50%; transform translateY(-50%); width 330px; max-width 384px */}
          <div
            data-testid="promo-banner-text-group"
            style={{
              position: "absolute",
              left: "42px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "330px",
              maxWidth: "384px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              zIndex: 10,
            }}
          >
            {/* Title: 2 lines "Groceries for" / "Your Daily Needs", height 96px (2x48px), color #111827 */}
            <h2
              data-testid="promo-banner-title"
              style={{
                margin: 0,
                height: "96px",
                fontFamily: '"SF Pro Rounded", "SF Pro Display", Inter, system-ui, sans-serif',
                fontSize: "40px",
                lineHeight: "48px",
                letterSpacing: "-0.3px",
                fontWeight: TITLE_FONT_WEIGHT,
                color: "#111827",
              }}
            >
              <span style={{ display: "block", whiteSpace: "nowrap" }}>Groceries for</span>
              <span style={{ display: "block", whiteSpace: "nowrap" }}>Your Daily Needs</span>
            </h2>

            {/* Subtitle: margin-top 16px; height 40px; Inter 600, 16px/20px, color #374151 */}
            <p
              data-testid="promo-banner-subtitle"
              style={{
                margin: 0,
                marginTop: "16px",
                height: "40px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "16px",
                lineHeight: "20px",
                letterSpacing: "0px",
                fontWeight: 600,
                color: "#374151",
              }}
            >
              Fresh fruits &amp; vegetables, dairy, snacks,
              <br />
              staples and more — all at great prices.
            </p>

            {/* Button "Shop Now": margin-top 40px; width 147px; height 52px; padding 12px 24px; bg #FBBF24 */}
            <Link
              to={ctaTo}
              data-testid="promo-banner-button"
              tabIndex={isActive ? 0 : -1}
              aria-label={ctaLabel}
              style={{
                marginTop: "40px",
                width: "147px",
                height: "52px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "9999px",
                backgroundColor: "#FBBF24",
                boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "16px",
                color: "#111827",
                textDecoration: "none",
                boxSizing: "border-box",
              }}
              className="transition-colors hover:bg-[#F5B800] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111827] focus-visible:ring-offset-2 active:scale-[0.98]"
            >
              {ctaLabel}
            </Link>
          </div>

          {/* Right Image (Trimmed Grocery Hero): right 0; top -3px; height calc(100% + 6px); width auto; max-width 62%; object-fit contain; object-position right center; pointer-events none */}
          {image && (
            <img
              src={image}
              data-testid="promo-banner-image"
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                right: 0,
                top: "-3px",
                height: "calc(100% + 6px)",
                width: "auto",
                maxWidth: "62%",
                objectFit: "contain",
                objectPosition: "right center",
                pointerEvents: "none",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
