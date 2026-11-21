import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

/**
 * Shared Select Component
 * - Pill-shaped trigger button (h-[40px], rounded-full, bg #F4F5F8)
 * - 12px radius dropdown panel (rounded-[12px], border 0.8px #E7E8E5, soft shadow)
 */
export default function Select({
  label = null,
  error = null,
  helperText = null,
  options = [], // [{ value: '...', label: '...' }]
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  required = false,
  size = 40,
  className = "",
  containerClassName = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val) => {
    onChange?.(val);
    setIsOpen(false);
  };

  const heightClasses = {
    32: "h-[32px] text-[12px] px-3.5",
    40: "h-[40px] text-[13px] px-4",
    48: "h-[48px] text-[15px] px-5",
  }[size] || "h-[40px] text-[13px] px-4";

  return (
    <div ref={containerRef} className={`relative w-full text-left ${containerClassName}`}>
      {label && (
        <label
          className="block text-[12px] font-bold text-[#101828] mb-1.5"
          style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
        >
          {label} {required && <span className="text-[#B42318]">*</span>}
        </label>
      )}

      {/* Pill Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
        className={`w-full rounded-full bg-[#F4F5F8] border-[0.8px] flex items-center justify-between text-left transition-all duration-150 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#F5B800] focus:border-[#F5B800] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? "border-[#B42318]" : "border-[#E7E8E5]"
        } ${heightClasses} ${className}`}
      >
        <span className={`truncate ${selectedOption ? "text-[#101828] font-medium" : "text-[#667085]"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-[#667085] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* 12px Dropdown Menu Panel */}
      {isOpen && (
        <div
          role="listbox"
          style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
          className="absolute z-50 left-0 right-0 mt-1.5 max-h-60 overflow-y-auto rounded-[12px] bg-white border-[0.8px] border-[#E7E8E5] p-1.5 shadow-[0_10px_25px_rgba(16,24,40,0.1)] animate-scale-up"
        >
          {options.length === 0 ? (
            <div className="py-3 px-3 text-center text-[12px] text-[#667085]">No options</div>
          ) : (
            options.map((option) => {
              const isSelected = String(option.value) === String(value);
              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={`flex items-center justify-between px-3 py-2 text-[13px] rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#FFF4DA] text-[#101828] font-bold"
                      : "text-[#101828] hover:bg-[#F4F5F8]"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check size={14} className="text-[#101828] shrink-0 ml-2" />}
                </div>
              );
            })
          )}
        </div>
      )}

      {error ? (
        <p role="alert" className="mt-1.5 text-[11px] font-semibold text-[#B42318]">
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1.5 text-[11px] text-[#667085]">{helperText}</p>
      ) : null}
    </div>
  );
}
