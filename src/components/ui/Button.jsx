import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Shared Button Component
 * - Variants: primary (#F5B800), secondary (outlined), ghost, danger (#B42318)
 * - Sizes: 32 (sm), 40 (md), 48 (lg)
 * - Pill-shaped (rounded-full), Manrope font
 */
export default function Button({
  children,
  variant = "primary",
  size = 40,
  loading = false,
  disabled = false,
  icon: Icon = null,
  iconPosition = "left",
  fullWidth = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) {
  const isDisabled = disabled || loading;

  const sizeClasses = {
    32: "h-[32px] px-3.5 text-[12px] gap-1.5",
    40: "h-[40px] px-5 text-[13px] gap-2",
    48: "h-[48px] px-6 text-[15px] gap-2.5",
  }[size] || "h-[40px] px-5 text-[13px] gap-2";

  const variantClasses = {
    primary:
      "bg-[#F5B800] text-[#101828] font-extrabold hover:bg-[#E0A800] active:bg-[#D49400] shadow-xs hover:shadow-sm focus-visible:ring-[#101828]",
    secondary:
      "bg-white border-[0.8px] border-[#E7E8E5] text-[#101828] font-bold hover:bg-[#F4F5F8] active:bg-[#ECEEF2] focus-visible:ring-[#101828]",
    ghost:
      "bg-transparent text-[#101828] font-bold hover:bg-[#F4F5F8] active:bg-[#ECEEF2] focus-visible:ring-[#101828]",
    danger:
      "bg-[#B42318] text-white font-bold hover:bg-[#912014] active:bg-[#7A1B10] focus-visible:ring-[#B42318]",
    outlineDanger:
      "bg-white border-[0.8px] border-[#B42318] text-[#B42318] font-bold hover:bg-[#FCECEC] focus-visible:ring-[#B42318]",
  }[variant] || variantClasses.primary;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-150 select-none cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none motion-reduce:transition-none ${sizeClasses} ${variantClasses} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin shrink-0" size={size === 32 ? 14 : size === 40 ? 16 : 18} />
      ) : Icon && iconPosition === "left" ? (
        <Icon className="shrink-0" size={size === 32 ? 14 : size === 40 ? 16 : 18} />
      ) : null}
      
      <span className="truncate">{children}</span>

      {!loading && Icon && iconPosition === "right" ? (
        <Icon className="shrink-0" size={size === 32 ? 14 : size === 40 ? 16 : 18} />
      ) : null}
    </button>
  );
}
