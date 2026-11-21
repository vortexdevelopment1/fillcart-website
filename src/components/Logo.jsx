import React from "react";
import { Link } from "react-router-dom";

/**
 * Reusable FillCarts Logo Component (Figma Specification)
 * 
 * - Mark: /images/brand/logo.svg at 36px height (width auto, width & height attributes from SVG viewBox 0 0 38 38)
 * - Wordmark: "FillCarts" live text in Manrope, weight 800, size 24px, line-height 31.5px, letter-spacing -1px
 *   - "Fill": --color-logo-text (#101828) on light / white onDark
 *   - "Carts": --color-logo-accent (#D49400) (darker logo gold token, not primary yellow)
 * - Layout: Flex row, vertically centered, mark first, 8px gap, wordmark next
 * - Variants: "default" | "onDark"
 */
export default function Logo({
  variant = "default",
  size = "default",
  className = "",
  to = "/",
  onClick,
}) {
  const isOnDark = variant === "onDark";
  const fillColor = isOnDark ? "#FFFFFF" : "var(--color-logo-text, #101828)";
  const cartsColor = "var(--color-logo-accent, #D49400)";

  let markHeight = 36;
  let fontSize = 24;
  let lineHeight = 31.5;

  if (size === "sm") {
    markHeight = 28;
    fontSize = 18;
    lineHeight = 24;
  } else if (size === "lg") {
    markHeight = 44;
    fontSize = 28;
    lineHeight = 36;
  } else if (typeof size === "number") {
    markHeight = size;
    fontSize = Math.round((size / 36) * 24);
    lineHeight = Math.round((size / 36) * 31.5 * 10) / 10;
  }

  return (
    <Link
      to={to}
      onClick={onClick}
      aria-label="FillCarts home"
      className={`inline-flex items-center gap-2 group select-none transition-opacity hover:opacity-95 cursor-pointer ${className}`}
    >
      {/* 1. Mark: SVG logo referenced directly from /images/brand/logo.svg (viewBox 38x38) */}
      <img
        src="/images/brand/logo.svg"
        alt=""
        width={38}
        height={38}
        className="shrink-0"
        style={{
          height: `${markHeight}px`,
          width: "auto",
          aspectRatio: "1/1",
        }}
      />

      {/* 2. Wordmark: Two-color live text "FillCarts" (Fill + Carts with no space between) */}
      <span
        style={{
          fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
          fontWeight: 800,
          fontSize: `${fontSize}px`,
          lineHeight: `${lineHeight}px`,
          letterSpacing: "-1px",
        }}
        className="inline-flex items-baseline"
      >
        <span style={{ color: fillColor }}>Fill</span><span style={{ color: cartsColor }}>Carts</span>
      </span>
    </Link>
  );
}
