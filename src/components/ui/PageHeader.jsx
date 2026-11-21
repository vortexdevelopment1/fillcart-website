import React from "react";
import Breadcrumb from "./Breadcrumb";

/**
 * Shared PageHeader Component (Exact Figma Scale)
 * - Eyebrow: Manrope 800, 10px, 15px line-height, 1.6px letter-spacing, #936D00
 * - Title: Manrope 800, 27px, 32.4px line-height, -1.2px letter-spacing, #101828
 * - Subtitle: Manrope 500, 13-14px, #667085
 * - Right action slot
 */
export default function PageHeader({
  eyebrow = null,
  title,
  subtitle = null,
  breadcrumbs = null,
  action = null,
  className = "",
}) {
  return (
    <div
      style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
      className={`w-full text-left space-y-3 ${className}`}
    >
      {breadcrumbs && <Breadcrumb items={breadcrumbs} className="mb-2" />}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          {eyebrow && (
            <span
              className="block font-extrabold text-[10px] leading-[15px] tracking-[1.6px] uppercase"
              style={{ color: "var(--color-eyebrow, #936D00)" }}
            >
              {eyebrow}
            </span>
          )}
          <h1
            className="font-extrabold text-[24px] sm:text-[27px] leading-[30px] sm:leading-[32.4px] text-[#101828]"
            style={{ letterSpacing: "-1.2px" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-[13px] sm:text-[14px] text-[#667085] leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {action && <div className="shrink-0 flex items-center gap-2.5 self-start sm:self-end">{action}</div>}
      </div>
    </div>
  );
}
