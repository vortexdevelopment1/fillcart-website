import React from "react";
import { X } from "lucide-react";

/**
 * Shared Chip Component
 * Interactive pill chip for filters, tags, and category selectors
 */
export default function Chip({
  children,
  active = false,
  onClick = null,
  onRemove = null,
  icon: Icon = null,
  size = "md", // sm (28px), md (32px), lg (36px)
  disabled = false,
  className = "",
}) {
  const sizeClasses = {
    sm: "h-[28px] px-3 text-[11px] gap-1",
    md: "h-[32px] px-3.5 text-[12px] gap-1.5",
    lg: "h-[36px] px-4 text-[13px] gap-2",
  }[size] || "h-[32px] px-3.5 text-[12px] gap-1.5";

  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable && !disabled ? 0 : undefined}
      style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
      className={`inline-flex items-center justify-center rounded-full border-[0.8px] font-bold select-none transition-all duration-150 ${sizeClasses} ${
        active
          ? "bg-[#FFF4DA] border-[#F5B800] text-[#101828] shadow-xs"
          : "bg-[#F4F5F8] border-[#E7E8E5] text-[#101828] hover:bg-[#ECEEF2] hover:border-[#D8DBDF]"
      } ${isClickable && !disabled ? "cursor-pointer active:scale-95" : ""} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {Icon && <Icon size={size === "sm" ? 12 : 14} className="shrink-0" />}
      <span className="truncate">{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove filter"
          className="ml-1 p-0.5 rounded-full hover:bg-black/10 transition-colors"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
