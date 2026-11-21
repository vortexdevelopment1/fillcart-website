import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

/**
 * Shared Toast Notification Component
 * Variants: success, error, info, warning
 * 18px radius, 0.8px border
 */
export default function Toast({
  message,
  title = null,
  variant = "success", // success, error, info, warning
  duration = 4000,
  onClose,
  isOpen = true,
  className = "",
}) {
  useEffect(() => {
    if (!isOpen || !duration) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="text-[#16803C] shrink-0" />,
    error: <AlertCircle size={18} className="text-[#B42318] shrink-0" />,
    warning: <AlertTriangle size={18} className="text-[#936D00] shrink-0" />,
    info: <Info size={18} className="text-[#0284C7] shrink-0" />,
  };

  const bgStyles = {
    success: "bg-white border-[#16803C]/30 text-[#101828]",
    error: "bg-white border-[#B42318]/30 text-[#101828]",
    warning: "bg-white border-[#936D00]/30 text-[#101828]",
    info: "bg-white border-[#0284C7]/30 text-[#101828]",
  }[variant] || "bg-white border-[#E7E8E5] text-[#101828]";

  return (
    <div
      role="alert"
      style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
      className={`fixed bottom-5 right-5 z-50 max-w-sm w-full p-4 rounded-[18px] border-[0.8px] shadow-[0_10px_30px_rgba(16,24,40,0.12)] flex items-start gap-3 animate-slide-up text-left ${bgStyles} ${className}`}
    >
      <div className="mt-0.5">{icons[variant] || icons.info}</div>
      <div className="flex-1 min-w-0">
        {title && <h5 className="text-[13px] font-extrabold leading-tight mb-0.5">{title}</h5>}
        <p className="text-[12px] text-[#667085] leading-snug">{message}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="text-[#667085] hover:text-[#101828] p-0.5 rounded-full transition-colors cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
}
