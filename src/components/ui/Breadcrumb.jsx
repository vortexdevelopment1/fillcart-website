import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

/**
 * Shared Breadcrumb Component
 * items: [{ label: 'Home', href: '/' }, { label: 'Category', href: '/category' }, { label: 'Current' }]
 */
export default function Breadcrumb({ items = [], className = "" }) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
      className={`flex items-center text-[12px] text-[#667085] flex-wrap gap-1.5 ${className}`}
    >
      <Link
        to="/"
        className="inline-flex items-center gap-1 hover:text-[#101828] transition-colors focus:outline-hidden focus-visible:underline"
      >
        <Home size={13} />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight size={12} className="text-[#667085]/60 shrink-0" />
            {isLast || !item.href ? (
              <span className="font-bold text-[#101828] truncate max-w-[200px]" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="hover:text-[#101828] transition-colors truncate max-w-[150px] focus:outline-hidden focus-visible:underline"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
