import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getCategoryRoute, getCategoryImage } from "../config/shopByCategory";

/**
 * Reusable CategoryCard Component (Exact Figma Specification)
 * 
 * - Border-radius: 32px (24px on mobile <= 640px)
 * - Padding: 12px (p-3)
 * - Gap: 16px (gap-4)
 * - No border, no shadow (only subtle 2px lift on hover)
 * - Dimensions: Fixed height 178.5px on desktop (min-h-[120px] on mobile), width fills cell (189.17px at 1440px)
 *   -> Proportions 1.06 : 1, NOT square
 * - Background color: Tied strictly to card's POSITION via CSS token --cat-1 .. --cat-12
 * - Upper area: flex 1, image centered, object-fit contain, max 80px tall
 * - Label: Manrope 700, 12px, color #101828, in fixed 2-line 32px height area with vertical centering
 */
export default function CategoryCard({
  category,
  index = 0,
  backendCategories = [],
  className = "",
}) {
  if (!category) return null;

  const position = category.position || index + 1;
  const label = category.label || category.name || "Category";
  const bgColor = category.colorToken || `var(--cat-${position}, ${category.color || "#EDF7E8"})`;

  // Compute link
  const linkTo = category.to || getCategoryRoute(category, backendCategories);

  // Image resolution: Use category.image from config, or backend imageUrl, or fallback
  const fallbackImg = category.image || "/images/home/home-staples.png";
  const initialImg = category.image || category.img || category.imageUrl || getCategoryImage(category, backendCategories);
  const [imgSrc, setImgSrc] = useState(initialImg);

  return (
    <Link
      to={linkTo}
      aria-label={`Shop ${label}`}
      style={{ backgroundColor: bgColor }}
      className={`group flex flex-col items-center justify-between p-3 gap-4 rounded-[24px] sm:rounded-[32px] overflow-hidden no-underline text-center cursor-pointer select-none transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_4px_16px_rgba(16,24,40,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:transform-none min-h-[120px] sm:h-[178.5px] w-full ${className}`}
    >
      {/* 1. Image Area on Top (Flex 1, centered, object-fit contain, max 80px tall) */}
      <div className="flex-1 w-full flex items-center justify-center min-h-0 pt-1">
        <img
          src={imgSrc}
          alt={label}
          width={80}
          height={80}
          loading="lazy"
          decoding="async"
          onError={() => setImgSrc(fallbackImg)}
          className="max-h-[52px] sm:max-h-[80px] w-auto h-auto object-contain transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none select-none"
        />
      </div>

      {/* 2. Label Under Image: Fixed 2-line 32px height, vertically centered */}
      <div className="w-full h-[32px] flex items-center justify-center shrink-0 px-1">
        {category.lines && category.lines.length >= 2 ? (
          <span
            className="font-bold text-[11px] sm:text-[12px] leading-[15px] sm:leading-[16px] text-[#101828] text-center"
            style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
          >
            {category.lines[0]}
            <br />
            {category.lines[1]}
          </span>
        ) : (
          <span
            className="font-bold text-[11px] sm:text-[12px] leading-[15px] sm:leading-[16px] text-[#101828] text-center line-clamp-2"
            style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
          >
            {label}
          </span>
        )}
      </div>
    </Link>
  );
}
