import React from "react";
import { PackageOpen } from "lucide-react";
import Button from "./Button";

/**
 * Shared EmptyState Component
 * Displays centered icon, title, description, and primary CTA
 */
export default function EmptyState({
  icon: Icon = PackageOpen,
  title = "No items found",
  description = "We couldn't find anything matching your request right now.",
  actionLabel = null,
  onAction = null,
  actionHref = null,
  className = "",
}) {
  return (
    <div
      style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
      className={`py-12 px-6 sm:py-16 text-center max-w-md mx-auto flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-[#FFF4DA] text-[#F5B800] flex items-center justify-center mb-4 shadow-xs">
        <Icon size={30} strokeWidth={2} className="text-[#101828]" />
      </div>

      <h3 className="text-lg sm:text-xl font-extrabold text-[#101828] mb-1.5 leading-snug">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-[#667085] leading-relaxed mb-6">
        {description}
      </p>

      {actionLabel && (onAction || actionHref) && (
        <Button
          variant="primary"
          size={40}
          onClick={onAction}
          {...(actionHref ? { as: "a", href: actionHref } : {})}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
