import React, { useState, useRef, useEffect } from "react";

/**
 * Shared DropdownMenu Component
 * Floating menu with 12px radius, border 0.8px #E7E8E5, soft shadow
 */
export default function DropdownMenu({
  trigger,
  items = [], // [{ label: '...', icon?: Icon, onClick: () => {}, danger?: boolean, divider?: boolean }]
  align = "right", // "left" | "right"
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

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

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
          style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
          className={`absolute z-50 mt-2 w-52 rounded-[12px] bg-white border-[0.8px] border-[#E7E8E5] p-1.5 shadow-[0_10px_25px_rgba(16,24,40,0.1)] animate-scale-up ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item, idx) => {
            if (item.divider) {
              return <div key={`div-${idx}`} className="my-1 border-t-[0.8px] border-[#E7E8E5]" />;
            }
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                role="menuitem"
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg text-left transition-colors cursor-pointer ${
                  item.danger
                    ? "text-[#B42318] hover:bg-[#FCECEC]"
                    : "text-[#101828] hover:bg-[#F4F5F8]"
                }`}
              >
                {Icon && <Icon size={16} className="shrink-0" />}
                <span className="truncate font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
