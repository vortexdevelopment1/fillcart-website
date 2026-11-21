import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * Reusable CategoryHeroBanner Component
 * 
 * Exact Figma Specification:
 * - Background: linear-gradient(90deg, #FFDDB7 0%, #FFEAD2 50%, #FFDFAE 100%)
 * - Title:
 *     Line 1: "Groceries for" (Inter 700, 40px/48px, #000000)
 *     Line 2: "Your" + yellow pill "Daily Needs" (#FBBF24, padding 4px 16px, radius 25px, height 56px)
 * - Subtitle: Inter 600 16px/20px, #374151, 2 lines
 * - CTA Button: height 52px, padding 12px 24px, radius 9999px, bg #FBBF24, box-shadow 0px 1px 2px 0px #0000000D,
 *               label Inter 700 16px #111827 + ArrowRight icon (20px)
 * - Right image: object-fit contain, aligned right, height 100%
 */
export default function CategoryHeroBanner({
  hero = {},
  height,
  className = "",
  ctaUrl = "/category/grocery",
  onCtaClick,
  tabIndex = 0,
}) {
  const titleLine1 = hero.titleLine1 || hero.line1 || "Groceries for";
  const titleLine2 = hero.titleLine2 || hero.prefix || "Your";
  const titleHighlight = hero.titleHighlight || hero.highlight || "Daily Needs";
  const subtitle =
    hero.subtitle ||
    "Fresh fruits & vegetables, dairy, snacks, staples and more — all at great prices.";
  const imageSrc = hero.image || "/images/banners/category-hero.svg";
  const ctaLabel = hero.ctaLabel || "Shop Now";

  return (
    <section
      aria-label={hero.title || "Category Hero Banner"}
      style={{
        background: "linear-gradient(90deg, #FFDDB7 0%, #FFEAD2 50%, #FFDFAE 100%)",
        height: height || undefined,
      }}
      className={`w-full max-w-[1216px] mx-auto rounded-[16px] sm:rounded-[20px] lg:rounded-[32px] overflow-hidden relative select-none box-border flex flex-row items-center justify-between p-[12px] pr-0 min-[360px]:p-[14px] min-[360px]:pr-0 md:pl-[28px] md:py-[22px] md:pr-0 lg:p-0 gap-[6px] lg:gap-0 ${
        !height
          ? "min-h-[176px] min-[360px]:min-h-[188px] min-[480px]:min-h-[220px] md:min-h-[250px] lg:min-h-0 lg:h-[360px]"
          : ""
      } ${className}`}
    >
      {/* Left Content Column (flex 1, min-w-0, vertically centered, desktop max-w-[560px]) */}
      <div className="relative z-10 flex flex-col justify-center items-start flex-1 min-w-0 p-0 lg:pl-[48px] lg:py-10 lg:pr-8 lg:max-w-[560px] lg:w-auto lg:shrink-0">
        {/* TITLE BLOCK */}
        <div className="flex flex-col text-left">
          {/* Line 1 */}
          <span
            style={{
              fontFamily: "var(--font-inter, 'Inter', sans-serif)",
              letterSpacing: "0px",
              color: "#000000",
            }}
            className="font-extrabold text-[15px] leading-[18px] min-[360px]:text-[17px] min-[360px]:leading-[21px] min-[480px]:text-[22px] min-[480px]:leading-[26px] md:text-[28px] md:leading-[34px] lg:text-[40px] lg:leading-[48px] whitespace-normal sm:whitespace-nowrap"
          >
            {titleLine1}
          </span>

          {/* Line 2 with Yellow Pill */}
          <div className="flex items-center gap-1 min-[360px]:gap-1.5 sm:gap-2 lg:gap-3 mt-0.5 min-[360px]:mt-1 flex-wrap sm:flex-nowrap">
            <span
              style={{
                fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                letterSpacing: "0px",
                color: "#000000",
              }}
              className="font-extrabold text-[15px] leading-[18px] min-[360px]:text-[17px] min-[360px]:leading-[21px] min-[480px]:text-[22px] min-[480px]:leading-[26px] md:text-[28px] md:leading-[34px] lg:text-[40px] lg:leading-[48px] whitespace-normal sm:whitespace-nowrap"
            >
              {titleLine2}
            </span>

            {/* YELLOW PILL: Auto-hugs text, scales smoothly with title font */}
            <span
              style={{
                backgroundColor: "#FBBF24",
                color: "#000000",
                fontFamily: "var(--font-inter, 'Inter', sans-serif)",
              }}
              className="font-extrabold text-[15px] leading-[18px] min-[360px]:text-[17px] min-[360px]:leading-[21px] min-[480px]:text-[22px] min-[480px]:leading-[26px] md:text-[28px] md:leading-[34px] lg:text-[40px] lg:leading-[48px] h-[22px] min-[360px]:h-[26px] min-[480px]:h-[32px] md:h-[40px] lg:h-[56px] px-1.5 min-[360px]:px-2 md:px-3 lg:px-4 rounded-[11px] min-[360px]:rounded-[13px] min-[480px]:rounded-[16px] md:rounded-[20px] lg:rounded-[25px] inline-flex items-center justify-center whitespace-nowrap shadow-xs"
            >
              {titleHighlight}
            </span>
          </div>
        </div>

        {/* SUBTITLE */}
        <div className="w-full max-w-[340px] lg:max-w-[460px] mt-1 min-[360px]:mt-1.5 min-[480px]:mt-2 md:mt-2.5 lg:mt-4 text-left">
          <p
            style={{
              fontFamily: "var(--font-inter, 'Inter', sans-serif)",
              letterSpacing: "0px",
              color: "#374151",
              margin: 0,
            }}
            className="font-medium text-[11px] leading-[15px] min-[360px]:text-[12px] min-[360px]:leading-[16px] min-[480px]:text-[13px] min-[480px]:leading-[18px] md:text-[14px] md:leading-[19px] lg:text-[16px] lg:leading-[20px] line-clamp-3 lg:line-clamp-none"
          >
            {subtitle}
          </p>
        </div>

        {/* CTA BUTTON ("Shop Now" + ArrowRight icon) */}
        {onCtaClick ? (
          <button
            type="button"
            onClick={onCtaClick}
            tabIndex={tabIndex}
            style={{
              borderRadius: "9999px",
              backgroundColor: "#FBBF24",
              boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
              border: 0,
              cursor: "pointer",
            }}
            className="mt-2 min-[360px]:mt-2.5 min-[480px]:mt-3 lg:mt-6 h-[32px] min-[360px]:h-[36px] md:h-[40px] lg:h-[52px] px-3 min-[360px]:px-3.5 sm:px-4 md:px-5 lg:px-6 rounded-full bg-[#FBBF24] hover:bg-[#F59E0B] active:scale-95 transition-all text-[#111827] font-bold text-[12px] min-[360px]:text-[13px] min-[480px]:text-[14px] md:text-[15px] lg:text-[16px] inline-flex items-center justify-center gap-1.5 min-[360px]:gap-2 lg:gap-[10px] shadow-xs shrink-0 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111827] focus-visible:ring-offset-2"
          >
            <span
              style={{
                fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                whiteSpace: "nowrap",
              }}
            >
              {ctaLabel}
            </span>
            <ArrowRight className="w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4 sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5 text-[#111827] shrink-0" strokeWidth={2.5} />
          </button>
        ) : (
          <Link
            to={ctaUrl}
            tabIndex={tabIndex}
            style={{
              borderRadius: "9999px",
              backgroundColor: "#FBBF24",
              boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
              border: 0,
              cursor: "pointer",
            }}
            className="mt-2 min-[360px]:mt-2.5 min-[480px]:mt-3 lg:mt-6 h-[32px] min-[360px]:h-[36px] md:h-[40px] lg:h-[52px] px-3 min-[360px]:px-3.5 sm:px-4 md:px-5 lg:px-6 rounded-full bg-[#FBBF24] hover:bg-[#F59E0B] active:scale-95 transition-all text-[#111827] font-bold text-[12px] min-[360px]:text-[13px] min-[480px]:text-[14px] md:text-[15px] lg:text-[16px] inline-flex items-center justify-center gap-1.5 min-[360px]:gap-2 lg:gap-[10px] shadow-xs shrink-0 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111827] focus-visible:ring-offset-2"
          >
            <span
              style={{
                fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                whiteSpace: "nowrap",
              }}
            >
              {ctaLabel}
            </span>
            <ArrowRight className="w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4 sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5 text-[#111827] shrink-0" strokeWidth={2.5} />
          </Link>
        )}
      </div>

      {/* Right Side Hero Image Block: Contain, aspect 1.4, vertically centered (50% phones, 46% tablets, absolute desktop) */}
      <div
        className="relative z-0 flex-none self-center shrink-0 w-[50%] md:w-[46%] m-0 p-0 pr-0 h-auto aspect-[7/5] lg:aspect-auto lg:w-auto lg:max-w-[582px] lg:h-full lg:absolute lg:right-0 lg:top-0 lg:bottom-0 overflow-hidden pointer-events-none select-none flex items-center justify-end"
      >
        <img
          src={imageSrc}
          alt={hero.title || "Category banner"}
          loading="eager"
          decoding="async"
          onError={(e) => {
            if (!e.target.src.endsWith("/images/banners/category-hero.svg")) {
              e.target.src = "/images/banners/category-hero.svg";
            }
          }}
          className="block w-full h-full object-contain object-right pointer-events-none select-none"
        />
      </div>
    </section>
  );
}
