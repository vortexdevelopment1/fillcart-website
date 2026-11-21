import React from "react";
import { Link } from "react-router-dom";
import { Star, Clock, ChevronRight } from "lucide-react";

/**
 * Reusable StoreCard Component (Exact Figma Specification)
 * 
 * - Dimensions: Width fills grid cell (230.4px at 1440 desktop), Height 167.25px
 * - Style: Background #FFFFFF, Border 0.8px solid #E6E8E5, Radius 18px, Overflow hidden
 * - Hover: 2px lift with soft shadow, visible focus ring
 * - Row 1 (Cover Photo): 104px tall (~62% of card height), object-fit cover
 *   - Delivery time pill on photo: white rounded-full pill (22px tall, 10px h-padding) at bottom-right (10px from edges)
 *   - Small clock icon (~11px, dark #101828), text in Manrope 700, 10px, color #101828 (e.g. "12 min")
 * - Row 2 (Info Area): ~63.25px tall, 14px horizontal padding
 *   - Store name: Manrope 700, 13px, color #101828, single line with ellipsis
 *   - Rating & distance row: yellow star (~10px), rating bold 9px, dot separator, distance 9px muted gray (#6B7280)
 *   - Right chevron: small right chevron (~14px, muted gray #9CA3AF), vertically centered
 * - Data rules: Missing field -> hide only that element (no fake values)
 */
export default function StoreCard({ store, className = "" }) {
  if (!store) return null;

  const name = store.name || store.storeName || "Store";
  const cover =
    store.coverImageUrl ||
    store.coverImage ||
    store.img ||
    "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&auto=format&fit=crop&q=80";

  // Data Rules: Only display if real data exists. No fake values!
  const deliveryTime = store.deliveryTimeEstimate || store.deliveryTime || null;
  const rating =
    store.rating != null && Number(store.rating) > 0
      ? Number(store.rating).toFixed(1)
      : null;
  const distance =
    store.distance ||
    (store.distanceKm != null ? `${Number(store.distanceKm).toFixed(1)} km` : null);

  const storeSlug =
    store.slug ||
    (name ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : "");
  const targetUrl = storeSlug ? `/store/${storeSlug}` : `/stores`;

  return (
    <Link
      to={targetUrl}
      aria-label={`${name}${rating ? `, rated ${rating}` : ""}${distance ? `, ${distance}` : ""}${deliveryTime ? `, delivers in ${deliveryTime}` : ""}`}
      className={`group block w-[200px] min-w-[200px] sm:w-[230.4px] sm:min-w-[230.4px] max-w-[230.4px] xl:w-full xl:min-w-0 xl:max-w-none shrink-0 xl:shrink snap-start h-[167.25px] bg-[#FFFFFF] rounded-[18px] border-[0.8px] border-[#E6E8E5] overflow-hidden text-left relative transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_4px_16px_rgba(16,24,40,0.08)] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F5B800] focus-visible:ring-offset-2 ${className}`}
      style={{
        fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
      }}
    >
      {/* Row 1: Cover Photo (104px tall, approx 62% of card height) */}
      <div className="relative w-full h-[104px] overflow-hidden bg-[#F4F5F8]">
        <img
          src={cover}
          alt={name}
          width={230}
          height={104}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Delivery Time Pill on photo (bottom-right: 10px from edges) */}
        {deliveryTime && (
          <span className="absolute bottom-[10px] right-[10px] bg-white text-[#101828] h-[22px] px-[10px] rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.12)] flex items-center gap-1 pointer-events-none">
            <Clock size={11} className="text-[#101828] shrink-0" />
            <span
              className="font-bold text-[10px] leading-none text-[#101828]"
              style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
            >
              {deliveryTime}
            </span>
          </span>
        )}
      </div>

      {/* Row 2: Info Area (~63.25px tall, 14px horizontal padding) */}
      <div className="h-[63.25px] px-[14px] flex items-center justify-between w-full">
        {/* Left Text Block */}
        <div className="flex flex-col justify-center gap-[4px] min-w-0 pr-2">
          {/* Store Name: Manrope weight 700, 13px, color #101828, single line with ellipsis */}
          <h3
            className="font-bold text-[13px] leading-tight text-[#101828] truncate group-hover:text-[#2F6842] transition-colors"
            title={name}
            style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
          >
            {name}
          </h3>

          {/* Rating, dot separator, distance */}
          {(rating || distance) && (
            <div className="flex items-center gap-1.5 text-[9px] leading-none">
              {rating && (
                <div className="flex items-center gap-0.5">
                  <Star size={10} className="fill-[#F5B800] text-[#F5B800] shrink-0" />
                  <span
                    className="font-bold text-[#101828]"
                    style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
                  >
                    {rating}
                  </span>
                </div>
              )}

              {rating && distance && (
                <span className="text-[#9CA3AF] text-[8px] leading-none">•</span>
              )}

              {distance && (
                <span
                  className="font-medium text-[#6B7280]"
                  style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
                >
                  {distance}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right Chevron: small right chevron (~14px, muted gray) vertically centered */}
        <ChevronRight
          size={14}
          className="text-[#9CA3AF] group-hover:text-[#101828] transition-colors shrink-0"
        />
      </div>
    </Link>
  );
}
