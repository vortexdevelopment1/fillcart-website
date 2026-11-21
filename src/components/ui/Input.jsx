import React from "react";
import { X } from "lucide-react";

/**
 * Shared Input Component
 * Pill-shaped (rounded-full), bg #F4F5F8, border 0.8px #E7E8E5, focus ring #F5B800
 */
export default function Input({
  label = null,
  error = null,
  helperText = null,
  prefixIcon: PrefixIcon = null,
  suffixIcon: SuffixIcon = null,
  clearable = false,
  onClear = null,
  value,
  onChange,
  disabled = false,
  required = false,
  id,
  className = "",
  containerClassName = "",
  size = 40,
  ...props
}) {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const heightClasses = {
    32: "h-[32px] text-[12px] px-3.5",
    40: "h-[40px] text-[13px] px-4",
    48: "h-[48px] text-[15px] px-5",
  }[size] || "h-[40px] text-[13px] px-4";

  return (
    <div className={`w-full text-left ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[12px] font-bold text-[#101828] mb-1.5"
          style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
        >
          {label} {required && <span className="text-[#B42318]">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {PrefixIcon && (
          <div className="absolute left-3.5 pointer-events-none text-[#667085]">
            <PrefixIcon size={size === 32 ? 14 : size === 40 ? 17 : 20} />
          </div>
        )}

        <input
          id={inputId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          style={{
            fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
          }}
          className={`w-full rounded-full bg-[#F4F5F8] border-[0.8px] transition-all duration-150 text-[#101828] placeholder-[#667085] focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#F5B800] focus:border-[#F5B800] disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? "border-[#B42318] focus:ring-[#B42318] focus:border-[#B42318]" : "border-[#E7E8E5]"
          } ${PrefixIcon ? "pl-10" : ""} ${
            SuffixIcon || (clearable && value) ? "pr-10" : ""
          } ${heightClasses} ${className}`}
          {...props}
        />

        {clearable && value && !disabled && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear input"
            className="absolute right-3.5 text-[#667085] hover:text-[#101828] transition-colors p-0.5 rounded-full hover:bg-slate-200"
          >
            <X size={14} />
          </button>
        )}

        {SuffixIcon && (!clearable || !value) && (
          <div className="absolute right-3.5 pointer-events-none text-[#667085]">
            <SuffixIcon size={size === 32 ? 14 : size === 40 ? 17 : 20} />
          </div>
        )}
      </div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-[11px] font-semibold text-[#B42318]"
          style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
        >
          {error}
        </p>
      ) : helperText ? (
        <p
          id={helperId}
          className="mt-1.5 text-[11px] text-[#667085]"
          style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
