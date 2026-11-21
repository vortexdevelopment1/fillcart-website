import React from "react";

/**
 * Shared Card Component
 * - 18px radius (rounded-[18px])
 * - 0.8px border #E7E8E5
 * - Optional hover lift + soft shadow
 */
export default function Card({
  children,
  hover = false,
  padding = "p-5 sm:p-6",
  className = "",
  onClick = null,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      style={{
        fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
        borderColor: "var(--color-border, #E7E8E5)",
      }}
      className={`bg-white rounded-[18px] border-[0.8px] text-left transition-all duration-200 ${padding} ${
        hover
          ? "hover:-translate-y-[2px] hover:shadow-[0_4px_16px_rgba(16,24,40,0.08)] cursor-pointer motion-reduce:transform-none"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
