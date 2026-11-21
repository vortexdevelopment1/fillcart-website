import React from "react";

/**
 * Shared Radio Component
 */
export default function Radio({
  checked = false,
  onChange,
  value,
  name,
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
          type="radio"
          id={inputId}
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={() => onChange?.(value)}
          className="sr-only"
        />
        <div
          className={`w-[18px] h-[18px] rounded-full border-[0.8px] flex items-center justify-center transition-all duration-150 ${
            checked
              ? "border-[#F5B800] bg-white"
              : "bg-white border-[#E7E8E5] group-hover:border-[#667085]"
          }`}
        >
          {checked && <div className="w-[10px] h-[10px] rounded-full bg-[#F5B800]" />}
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
