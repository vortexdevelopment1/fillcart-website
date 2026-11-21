import React, { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Shared Drawer / Bottom Sheet Component
 * - Bottom sheet on mobile / side panel on desktop (position: 'bottom' | 'right')
 * - 24px top radius for bottom sheet
 */
export default function Drawer({
  isOpen = false,
  onClose,
  title = null,
  children,
  position = "bottom", // 'bottom' | 'right'
  className = "",
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isBottom = position === "bottom";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
        className={`bg-white shadow-[0_-10px_30px_rgba(16,24,40,0.15)] flex flex-col text-left transition-all ${
          isBottom
            ? "w-full max-h-[85vh] mt-auto rounded-t-[24px] border-t-[0.8px] border-[#E7E8E5] animate-slide-up"
            : "w-full sm:w-[420px] h-full ml-auto rounded-l-[24px] border-l-[0.8px] border-[#E7E8E5] animate-slide-left"
        } ${className}`}
      >
        {/* Handle for bottom sheet */}
        {isBottom && (
          <div className="w-12 h-1.5 bg-[#E7E8E5] rounded-full mx-auto mt-3 mb-1 shrink-0" />
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-[0.8px] border-[#E7E8E5] shrink-0">
          <h3 className="text-base sm:text-lg font-extrabold text-[#101828] truncate">
            {title || "Options"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="w-8 h-8 rounded-full bg-[#F4F5F8] text-[#667085] hover:text-[#101828] flex items-center justify-center cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">{children}</div>
      </div>
    </div>
  );
}
