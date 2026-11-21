import React from "react";
import { Check } from "lucide-react";

/**
 * Shared Checkbox Component
 */
export default function Checkbox({
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
      className={`inline-flex items-start gap-2.5 select-none cursor-pointer group ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <div className="relative flex items-center justify-center shrink-0 mt-0.5">
        <input
          type="checkbox"
          id={inputId}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-[18px] h-[18px] rounded-[5px] border-[0.8px] flex items-center justify-center transition-all duration-150 ${
            checked
              ? "bg-[#F5B800] border-[#F5B800] text-[#101828]"
              : "bg-white border-[#E7E8E5] group-hover:border-[#667085]"
          }`}
        >
          {checked && <Check size={13} strokeWidth={3} className="text-[#101828]" />}
        </div>
      </div>

      {(label || description) && (
        <div className="text-left leading-tight">
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
    </label>
  );
}
