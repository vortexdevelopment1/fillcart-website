import React, { useRef } from "react";

/**
 * Shared OTPInput Component
 * Supports 4 or 6 digits with auto-focus advance, backspace, and paste support
 */
export default function OTPInput({
  length = 6,
  value = "",
  onChange,
  disabled = false,
  error = null,
  className = "",
}) {
  const inputRefs = useRef([]);

  const digits = Array.from({ length }).map((_, i) => value[i] || "");

  const handleChange = (index, e) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) {
      // Clear this digit
      const nextDigits = [...digits];
      nextDigits[index] = "";
      onChange?.(nextDigits.join(""));
      return;
    }

    const lastChar = val[val.length - 1];
    const nextDigits = [...digits];
    nextDigits[index] = lastChar;
    const newOtp = nextDigits.join("");
    onChange?.(newOtp);

    // Auto advance
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasted) {
      onChange?.(pasted);
      const nextFocus = Math.min(pasted.length, length - 1);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center gap-2 sm:gap-3" onPaste={handlePaste}>
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            disabled={disabled}
            value={digits[index]}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
            className={`w-11 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-[14px] bg-[#F4F5F8] border-[0.8px] transition-all duration-150 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#F5B800] focus:border-[#F5B800] disabled:opacity-50 ${
              error ? "border-[#B42318] text-[#B42318]" : "border-[#E7E8E5] text-[#101828]"
            }`}
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-[12px] font-semibold text-[#B42318] text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
