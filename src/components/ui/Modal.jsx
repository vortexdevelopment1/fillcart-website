import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * Shared Modal Component
 * - 24px radius (rounded-[24px])
 * - Backdrop blur
 * - Escape key & outside click listeners
 * - Accessible dialog role
 */
export default function Modal({
  isOpen = false,
  onClose,
  title = null,
  description = null,
  children,
  maxWidth = "max-w-lg", // max-w-sm, max-w-md, max-w-lg, max-w-xl
  showClose = true,
  className = "",
}) {
  const modalRef = useRef(null);

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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={modalRef}
        style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
        className={`w-full ${maxWidth} bg-white rounded-[24px] border-[0.8px] border-[#E7E8E5] p-6 sm:p-7 shadow-[0_20px_50px_rgba(16,24,40,0.15)] animate-scale-up relative text-left overflow-hidden ${className}`}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              {title && (
                <h3
                  id="modal-title"
                  className="text-lg sm:text-xl font-extrabold text-[#101828] leading-tight"
                >
                  {title}
                </h3>
              )}
              {description && (
                <p id="modal-description" className="text-xs sm:text-sm text-[#667085] mt-1">
                  {description}
                </p>
              )}
            </div>

            {showClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="w-8 h-8 rounded-full bg-[#F4F5F8] text-[#667085] hover:text-[#101828] hover:bg-slate-200 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
