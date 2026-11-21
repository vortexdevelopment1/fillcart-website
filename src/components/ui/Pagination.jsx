import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Shared Pagination Component
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = "",
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav
      aria-label="Pagination"
      style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
      className={`flex items-center justify-center gap-1.5 select-none ${className}`}
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
        className="w-[36px] h-[36px] rounded-full border-[0.8px] border-[#E7E8E5] bg-white text-[#101828] flex items-center justify-center hover:bg-[#F4F5F8] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`dots-${idx}`} className="w-[36px] h-[36px] flex items-center justify-center text-[#667085] text-xs">
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={`w-[36px] h-[36px] rounded-full text-[13px] font-bold flex items-center justify-center transition-all duration-150 cursor-pointer ${
              p === currentPage
                ? "bg-[#F5B800] text-[#101828] font-extrabold shadow-xs"
                : "bg-white border-[0.8px] border-[#E7E8E5] text-[#101828] hover:bg-[#F4F5F8]"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
        className="w-[36px] h-[36px] rounded-full border-[0.8px] border-[#E7E8E5] bg-white text-[#101828] flex items-center justify-center hover:bg-[#F4F5F8] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
