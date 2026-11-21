import React from "react";
import Badge from "./Badge";

/**
 * Shared PriceBlock Component
 * - Price: Manrope 700, 15px (or scalable size)
 * - Old Price: crossed out, #667085
 * - Discount Badge: green pill (#16803C)
 */
export default function PriceBlock({
  price = 0,
  oldPrice = null,
  currency = "₹",
  badge = null,
  size = "md", // sm, md, lg
  className = "",
}) {
  const numPrice = Number(price || 0);
  const numOldPrice = Number(oldPrice || 0);
  const hasDiscount = numOldPrice > numPrice;

  const discountPercent = hasDiscount
    ? Math.round(((numOldPrice - numPrice) / numOldPrice) * 100)
    : 0;

  const discountLabel = badge || (discountPercent > 0 ? `${discountPercent}% OFF` : null);

  const priceSizes = {
    sm: "text-[13px] leading-[18px]",
    md: "text-[15px] leading-[22.5px]",
    lg: "text-[20px] sm:text-[24px] leading-tight",
  }[size] || "text-[15px] leading-[22.5px]";

  const oldPriceSizes = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-[13px]",
  }[size] || "text-[10px]";

  return (
    <div
      style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
      className={`inline-flex items-baseline gap-2 flex-wrap text-left ${className}`}
    >
      <div className="flex items-baseline gap-1.5">
        <span className={`font-bold text-[#101828] ${priceSizes}`}>
          {currency}{numPrice.toLocaleString()}
        </span>

        {hasDiscount && (
          <span className={`line-through text-[#667085] font-medium ${oldPriceSizes}`}>
            {currency}{numOldPrice.toLocaleString()}
          </span>
        )}
      </div>

      {discountLabel && (
        <Badge variant="discount" size="sm">
          {discountLabel}
        </Badge>
      )}
    </div>
  );
}
