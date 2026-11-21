import React from "react";
import { Star } from "lucide-react";

/**
 * Shared Rating Component
 */
export default function Rating({
  rating = 0,
  max = 5,
  reviewsCount = null,
  size = 14,
  showNumber = true,
  className = "",
}) {
  return (
    <div
      style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
      className={`inline-flex items-center gap-1.5 select-none ${className}`}
    >
      <div className="flex items-center gap-0.5 text-[#F5B800]">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i + 1 <= Math.round(rating);
          return (
            <Star
              key={i}
              size={size}
              className={filled ? "fill-[#F5B800] text-[#F5B800]" : "text-[#E7E8E5] fill-[#F4F5F8]"}
            />
          );
        })}
      </div>

      {showNumber && (
        <span className="text-[12px] font-bold text-[#101828]">
          {Number(rating).toFixed(1)}
        </span>
      )}

      {typeof reviewsCount === "number" && (
        <span className="text-[11px] text-[#667085]">
          ({reviewsCount})
        </span>
      )}
    </div>
  );
}
