import React from "react";

/**
 * Shared Textarea Component
 * 12px radius (rounded-xl), bg #F4F5F8, border 0.8px #E7E8E5, focus ring #F5B800
 */
export default function Textarea({
  label = null,
  error = null,
  helperText = null,
  value,
  onChange,
  disabled = false,
  required = false,
  rows = 4,
  id,
  className = "",
  containerClassName = "",
  ...props
}) {
  const generatedId = React.useId();
  const textareaId = id || generatedId;
  const errorId = `${textareaId}-error`;
  const helperId = `${textareaId}-helper`;

  return (
    <div className={`w-full text-left ${containerClassName}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-[12px] font-bold text-[#101828] mb-1.5"
          style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
        >
          {label} {required && <span className="text-[#B42318]">*</span>}
        </label>
      )}

      <textarea
        id={textareaId}
        rows={rows}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
        className={`w-full rounded-[12px] bg-[#F4F5F8] border-[0.8px] p-3 text-[13px] transition-all duration-150 text-[#101828] placeholder-[#667085] focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#F5B800] focus:border-[#F5B800] disabled:opacity-50 disabled:cursor-not-allowed resize-y ${
          error ? "border-[#B42318] focus:ring-[#B42318] focus:border-[#B42318]" : "border-[#E7E8E5]"
        } ${className}`}
        {...props}
      />

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
