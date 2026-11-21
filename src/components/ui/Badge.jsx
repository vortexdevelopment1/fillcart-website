import React from "react";

/**
 * Shared Badge Component
 * Pill-shaped status indicator (neutral, success, warning, error, info)
 */
export default function Badge({
  children,
  variant = "neutral",
  size = "md", // sm, md
  className = "",
  icon: Icon = null,
}) {
  const variantStyles = {
    neutral: "bg-[#F4F5F8] text-[#101828] border-[#E7E8E5]",
    success: "bg-[#EDF7E8] text-[#16803C] border-[#16803C]/20",
    warning: "bg-[#FFF4DF] text-[#936D00] border-[#936D00]/20",
    error: "bg-[#FCECEC] text-[#B42318] border-[#B42318]/20",
    info: "bg-[#EAF5F8] text-[#0284C7] border-[#0284C7]/20",
    discount: "bg-[#16803C] text-white border-transparent font-extrabold uppercase",
  }[variant] || "bg-[#F4F5F8] text-[#101828] border-[#E7E8E5]";

  const sizeStyles = {
    sm: "px-2 py-[2px] text-[10px] leading-[14px]",
    md: "px-2.5 py-1 text-[11px] leading-[16px]",
  }[size] || "px-2.5 py-1 text-[11px] leading-[16px]";

  return (
    <span
      style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
      className={`inline-flex items-center gap-1 rounded-full border-[0.8px] font-bold select-none ${variantStyles} ${sizeStyles} ${className}`}
    >
      {Icon && <Icon size={size === "sm" ? 11 : 13} className="shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
