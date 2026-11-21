import React from "react";

/**
 * Reusable Figma Shopping Bag / Cart Icon (Vector SVG)
 * Exact vectors exported from Figma cart button icon
 * Perfectly centered, follows currentColor, default stroke-width 1.8375
 */
export default function CartIcon({
  size = 20,
  className = "",
  strokeWidth = 1.8375,
  ...props
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="10.5 10 19 21"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* 1. Bag Outline / Body */}
      <path d="M14.75 11.75L12.125 15.25V27.5C12.125 27.9641 12.3094 28.4092 12.6376 28.7374C12.9658 29.0656 13.4109 29.25 13.875 29.25H26.125C26.5891 29.25 27.0342 29.0656 27.3624 28.7374C27.6906 28.4092 27.875 27.9641 27.875 27.5V15.25L25.25 11.75H14.75Z" />
      
      {/* 2. Top Fold Horizontal Line & U-shaped Handles */}
      <path d="M12.125 15.25H27.875M23.5 18.75C23.5 19.6783 23.1313 20.5685 22.4749 21.2249C21.8185 21.8813 20.9283 22.25 20 22.25C19.0717 22.25 18.1815 21.8813 17.5251 21.2249C16.8687 20.5685 16.5 19.6783 16.5 18.75" />
    </svg>
  );
}
