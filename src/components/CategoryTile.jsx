import React from "react";
import { Link } from "react-router-dom";

/**
 * 9 Palette background colours by position (1-indexed in Figma spec, repeat for more):
 * 1 #FFF3EB, 2 #FFF8E8, 3 #FFF4E6, 4 #F0F8E8, 5 #F2F3F6,
 * 6 #FFF0F0, 7 #FFF3E9, 8 #FFF3E9, 9 #FFF3E9
 */
export const TILE_BACKGROUNDS = [
  "#FFF3EB",
  "#FFF8E8",
  "#FFF4E6",
  "#F0F8E8",
  "#F2F3F6",
  "#FFF0F0",
  "#FFF3E9",
  "#FFF3E9",
  "#FFF3E9",
];

/** Safe URI encoder avoiding double-encoding */
function safeEncodeURI(path) {
  if (!path) return "";
  try {
    return encodeURI(decodeURI(path));
  } catch {
    return encodeURI(path);
  }
}

/**
 * Reusable CategoryTile Component (Exact Figma Specification)
 * 
 * - Size: width 168.4px, height 148.5px (in 5-col grid at 906px), radius 32px, overflow hidden, no border, no shadow
 * - Image: position absolute; top 26px; left 50%; transform translateX(-50%); width 96px; height auto; display block;
 *   no CSS transform scale, no filter, no mix-blend-mode, natural aspect ratio.
 * - Label: position absolute; left 0; right 0; top 87px; height 36px; flex centered; text-align center;
 *   Inter 700, 13px / 18px, #0B1326, max-width 96px, text-wrap: balance.
 * - States:
 *   - Normal: no shadow
 *   - Hover: box-shadow 0 6px 16px rgba(16,24,40,0.08), nothing moves
 *   - Selected: box-shadow 0 0 0 2px #F5B800, aria-pressed="true"
 *   - Focus-visible: 2px #F5B800 outline, offset 2px
 * - Responsive < 560px:
 *   - Tile: aspect-ratio 168.4 / 148.5, radius 24px-32px
 *   - Image: width 72px, top 18px-20px
 *   - Label: top 66px, font 12px / 16px
 */
export default function CategoryTile({
  title,
  image,
  index = 0,
  isSelected = false,
  onClick,
  to,
  className = "",
  ariaLabel,
}) {
  const bg = TILE_BACKGROUNDS[index % TILE_BACKGROUNDS.length];
  const encodedImg = safeEncodeURI(image || "/images/categories/category-fallback.png");
  const labelText = title || "Category";

  const sharedStyle = {
    backgroundColor: bg,
    boxShadow: isSelected ? "0 0 0 2px #F5B800" : "none",
    border: "none",
  };

  const commonClasses = `group relative w-full lg:w-[168.4px] h-[148.5px] rounded-[32px] overflow-hidden select-none cursor-pointer outline-none transition-shadow duration-150 ${
    isSelected
      ? ""
      : "hover:shadow-[0_6px_16px_rgba(16,24,40,0.08)]"
  } focus-visible:outline-2 focus-visible:outline-[#F5B800] focus-visible:outline-offset-2 ${className}`;

  const content = (
    <>
      {/* SVG Illustration: top 26px, left 50% (translateX(-50%)), width 96px, height auto */}
      <img
        src={encodedImg}
        alt=""
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 top-[18px] sm:top-[26px] w-[72px] sm:w-[96px] h-auto block pointer-events-none select-none"
        style={{
          maxWidth: "none",
        }}
      />

      {/* Label: top 87px (top 66px under 560px), height 36px, centered, Inter 700 13px / 18px, max-width 96px, text-wrap: balance */}
      <div
        className="absolute left-0 right-0 top-[66px] sm:top-[87px] h-[32px] sm:h-[36px] flex items-center justify-center px-1 pointer-events-none"
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            color: "#0B1326",
            maxWidth: "96px",
            margin: "0 auto",
            textWrap: "balance",
          }}
          className="text-[12px] leading-[16px] sm:text-[13px] sm:leading-[18px] text-center block"
        >
          {labelText}
        </span>
      </div>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        aria-label={ariaLabel || `Shop ${labelText}`}
        style={sharedStyle}
        className={`${commonClasses} no-underline block`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || `Shop ${labelText}`}
      aria-pressed={isSelected ? "true" : "false"}
      style={sharedStyle}
      className={commonClasses}
    >
      {content}
    </button>
  );
}
