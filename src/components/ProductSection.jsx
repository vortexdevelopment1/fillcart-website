import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RefreshCw } from "lucide-react";
import ProductCard from "./ProductCard";

/**
 * Reusable ProductSection Component (Exact Figma Specification)
 * 
 * Used for "Popular right now", "Home essentials", "Daily care", "Frozen favourites".
 * 
 * - Container: 1216px centered container, padding-top 52px, white background
 * - Header:
 *   - Eyebrow: Manrope 800, 10px/15px, tracking 1.6px, uppercase, #936D00
 *   - Title: Manrope 800, 27px/32.4px, tracking -1.2px, #101828
 *   - View all: Manrope 800, 11px/16.5px, #2F6842 + 12px right arrow
 * - Grid: 6 equal columns with 13px gap (191.825px per card at 1440px desktop)
 * - Responsive: 4 cols at 1024px, scroll-snap row with ~2.4 cards at 768px (card ~160px), ~1.6 cards at 390px
 */
export default function ProductSection({
  id = "popular-section",
  eyebrow = null,
  title = "Popular right now",
  viewAllLink = "/categories",
  viewAllText = "View all products",
  products = [],
  loading = false,
  error = null,
  onRetry = null,
  emptyMessage = "No products available in this section right now.",
  className = "",
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`w-full text-left pt-8 sm:pt-10 lg:pt-[52px] bg-white ${className}`}
    >
      {/* 1. SECTION HEADER (Flex Row Space-Between, 24px Margin to Cards) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-6 gap-3">
        {/* Left Stack: Eyebrow (optional) + 8px gap + Title */}
        <div className={eyebrow ? "flex flex-col gap-1.5 sm:gap-2" : "flex flex-col"}>
          {eyebrow ? (
            <span
              className="uppercase font-extrabold text-[10px] leading-[15px] tracking-[1.6px]"
              style={{
                color: "var(--color-eyebrow, #936D00)",
                fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
              }}
            >
              {eyebrow}
            </span>
          ) : null}
          <h2
            id={`${id}-heading`}
            className="font-extrabold text-[20px] sm:text-[24px] lg:text-[27px] leading-[26px] sm:leading-[30px] lg:leading-[32.4px]"
            style={{
              color: "var(--color-section-title, #101828)",
              fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
              letterSpacing: "-1.2px",
            }}
          >
            {title}
          </h2>
        </div>

        {/* Right: "View all ..." link followed by 12px arrow icon */}
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="inline-flex items-center gap-1 font-extrabold text-[11px] leading-[16.5px] tracking-normal hover:underline focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#2F6842] focus-visible:ring-offset-2 rounded-xs self-start sm:self-end shrink-0"
            style={{
              color: "var(--color-link-view-all, #2F6842)",
              fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
            }}
          >
            <span>{viewAllText}</span>
            <ArrowRight size={12} className="shrink-0" style={{ color: "var(--color-link-view-all, #2F6842)" }} />
          </Link>
        )}
      </div>

      {/* 2. CARDS ROW / GRID */}
      {loading ? (
        /* Loading Skeletons: 6 cards of the exact same size */
        <div className="flex lg:grid gap-3 sm:gap-[13px] overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory lg:grid-cols-4 xl:grid-cols-6 pb-2 lg:pb-0">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="w-[150px] min-w-[150px] sm:w-[176px] sm:min-w-[176px] md:w-[200px] md:min-w-[200px] lg:w-full lg:min-w-0 h-[280px] lg:h-[310.1px] rounded-[18px] border-[0.8px] border-[#E7E8E5] p-2 flex flex-col justify-between bg-white animate-pulse snap-start shrink-0 lg:shrink"
            >
              <div className="w-full aspect-square rounded-[12px] bg-[#F4F5F8]" />
              <div className="space-y-2 mt-3.5">
                <div className="h-3 bg-[#F4F5F8] rounded w-3/4" />
                <div className="h-2.5 bg-[#F4F5F8] rounded w-1/2" />
              </div>
              <div className="mt-auto pt-2 flex items-end justify-between">
                <div className="h-4 bg-[#F4F5F8] rounded w-12" />
                <div className="w-[68px] h-[32px] rounded-full bg-[#F4F5F8]" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error State with Retry Button */
        <div className="p-8 text-center bg-[#F4F5F8] rounded-[24px] border border-[#E7E8E5] space-y-2">
          <p
            className="text-xs text-[#667085]"
            style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
          >
            {error}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="text-xs font-bold text-[#2F6842] hover:underline inline-flex items-center gap-1 cursor-pointer"
              style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
            >
              <RefreshCw size={12} /> Retry
            </button>
          )}
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="p-8 text-center bg-[#F4F5F8] rounded-[24px] border border-[#E7E8E5]">
          <p
            className="text-sm font-bold text-[#101828]"
            style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
          >
            {emptyMessage}
          </p>
        </div>
      ) : (
        /* Exact Product Grid: 6 columns on desktop (191.825px wide), 4 on 1024, scroll on <=768 */
        <div className="flex lg:grid gap-3 sm:gap-[13px] overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory scroll-smooth lg:grid-cols-4 xl:grid-cols-6 pb-2 lg:pb-0">
          {products.slice(0, 6).map((prod) => (
            <div
              key={prod.id || prod.slug || prod._id}
              className="w-[150px] min-w-[150px] sm:w-[176px] sm:min-w-[176px] md:w-[200px] md:min-w-[200px] lg:w-full lg:min-w-0 snap-start shrink-0 lg:shrink"
            >
              <ProductCard product={prod} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
