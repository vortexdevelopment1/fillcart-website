import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Shared IconButton Component
 * Pill/circle shaped with mandatory aria-label for accessibility
 */
export default function IconButton({
  icon: Icon,
  "aria-label": ariaLabel,
  variant = "secondary",
  size = 40,
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) {
  if (!ariaLabel) {
    console.warn("IconButton: aria-label is required for accessibility.");
  }

  const isDisabled = disabled || loading;

  const sizeClasses = {
    32: "w-[32px] h-[32px] min-w-[32px] min-h-[32px]",
    40: "w-[40px] h-[40px] min-w-[40px] min-h-[40px]",
    48: "w-[48px] h-[48px] min-w-[48px] min-h-[48px]",
  }[size] || "w-[40px] h-[40px]";

  const iconSizes = {
    32: 15,
    40: 18,
    48: 22,
  }[size] || 18;

  const variantClasses = {
    primary:
      "bg-[#F5B800] text-[#101828] hover:bg-[#E0A800] active:bg-[#D49400] focus-visible:ring-[#101828]",
    secondary:
      "bg-white border-[0.8px] border-[#E7E8E5] text-[#101828] hover:bg-[#F4F5F8] active:bg-[#ECEEF2] focus-visible:ring-[#101828]",
    ghost:
      "bg-transparent text-[#101828] hover:bg-[#F4F5F8] active:bg-[#ECEEF2] focus-visible:ring-[#101828]",
    danger:
      "bg-[#B42318] text-white hover:bg-[#912014] active:bg-[#7A1B10] focus-visible:ring-[#B42318]",
  }[variant] || variantClasses.secondary;

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      disabled={isDisabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-150 select-none cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed motion-reduce:transition-none ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={iconSizes} />
      ) : Icon ? (
        <Icon size={iconSizes} />
      ) : null}
    </button>
  );
}
