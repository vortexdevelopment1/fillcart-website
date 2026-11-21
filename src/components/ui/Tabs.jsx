import React from "react";

/**
 * Shared Tabs Component
 * - Variants: "pill" (rounded-full background), "underline" (clean bottom bar)
 */
export default function Tabs({
  tabs = [], // [{ id: '...', label: '...', count?: number, icon?: Icon }]
  activeTab,
  onChange,
  variant = "pill", // "pill" | "underline"
  className = "",
}) {
  if (variant === "underline") {
    return (
      <div
        role="tablist"
        style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
        className={`flex items-center gap-6 sm:gap-8 border-b-[0.8px] border-[#E7E8E5] overflow-x-auto no-scrollbar ${className}`}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`relative pb-3 text-[14px] font-bold inline-flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
                isActive ? "text-[#101828]" : "text-[#667085] hover:text-[#101828]"
              }`}
            >
              {Icon && <Icon size={16} />}
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    isActive ? "bg-[#FFF4DA] text-[#101828]" : "bg-[#F4F5F8] text-[#667085]"
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#F5B800] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default: Pill variant
  return (
    <div
      role="tablist"
      style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
      className={`inline-flex items-center gap-1.5 bg-[#F4F5F8] p-1 rounded-full border-[0.8px] border-[#E7E8E5] overflow-x-auto no-scrollbar max-w-full ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`h-[34px] px-4 rounded-full text-[13px] font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all duration-150 whitespace-nowrap ${
              isActive
                ? "bg-white text-[#101828] shadow-xs"
                : "text-[#667085] hover:text-[#101828]"
            }`}
          >
            {Icon && <Icon size={15} />}
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                  isActive ? "bg-[#FFF4DA] text-[#101828]" : "bg-white/80 text-[#667085]"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
