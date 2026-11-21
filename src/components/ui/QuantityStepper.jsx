import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";

/**
 * Shared QuantityStepper Component
 * Matches the product card and cart specification:
 * - Pill shape (rounded-full)
 * - Yellow active buttons (#F5B800)
 */
export default function QuantityStepper({
  quantity = 0,
  onIncrement,
  onDecrement,
  onRemove = null,
  min = 0,
  max = 99,
  size = "md", // sm (28px), md (32px), lg (40px)
  className = "",
}) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  const heightClass = isSm ? "h-[28px]" : isLg ? "h-[40px]" : "h-[32px]";
  const btnSize = isSm ? "w-[26px] h-[26px]" : isLg ? "w-[36px] h-[36px]" : "w-[30px] h-[30px]";
  const iconSize = isSm ? 12 : isLg ? 16 : 14;
  const textSize = isSm ? "text-[11px]" : isLg ? "text-[15px]" : "text-[13px]";

  const showTrash = quantity === 1 && Boolean(onRemove);

  return (
    <div
      style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
      className={`inline-flex items-center justify-between bg-[#F4F5F8] border-[0.8px] border-[#E7E8E5] rounded-full p-0.5 select-none ${heightClass} ${className}`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (showTrash) onRemove();
          else onDecrement?.();
        }}
        disabled={quantity <= min && !showTrash}
        aria-label={showTrash ? "Remove item" : "Decrease quantity"}
        className={`${btnSize} rounded-full bg-white text-[#101828] hover:bg-slate-200 active:scale-95 flex items-center justify-center transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0`}
      >
        {showTrash ? (
          <Trash2 size={iconSize} className="text-[#B42318]" />
        ) : (
          <Minus size={iconSize} strokeWidth={2.5} />
        )}
      </button>

      <span className={`px-2.5 font-extrabold text-[#101828] text-center min-w-[24px] ${textSize}`}>
        {quantity}
      </span>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onIncrement?.();
        }}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className={`${btnSize} rounded-full bg-[#F5B800] text-[#101828] hover:bg-[#E0A800] active:scale-95 flex items-center justify-center transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0`}
      >
        <Plus size={iconSize} strokeWidth={2.5} />
      </button>
    </div>
  );
}
