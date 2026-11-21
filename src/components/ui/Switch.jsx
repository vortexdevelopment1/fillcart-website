import React from "react";

/**
 * Shared Switch (Toggle) Component
 */
export default function Switch({
  checked = false,
  onChange,
  label = null,
  description = null,
  disabled = false,
  id,
  className = "",
}) {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <label
      htmlFor={inputId}
      className={`inline-flex items-center justify-between gap-3 select-none cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {(label || description) && (
        <div className="text-left">
          {label && (
            <span
              style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
              className="text-[13px] font-bold text-[#101828] block"
            >
              {label}
            </span>
          )}
          {description && (
            <span
              style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
              className="text-[11px] text-[#667085] block mt-0.5"
            >
              {description}
            </span>
          )}
        </div>
      )}

      <div className="relative inline-flex items-center shrink-0">
        <input
          type="checkbox"
          id={inputId}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-[42px] h-[24px] rounded-full transition-colors duration-200 ease-in-out border-[0.8px] ${
            checked ? "bg-[#F5B800] border-[#F5B800]" : "bg-[#F4F5F8] border-[#E7E8E5]"
          }`}
        >
          <div
            className={`w-[18px] h-[18px] rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out mt-[2px] ml-[2px] ${
              checked ? "translate-x-[18px]" : "translate-x-0"
            }`}
          />
        </div>
      </div>
    </label>
  );
}
