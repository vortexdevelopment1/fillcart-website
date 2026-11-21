import React from "react";

/**
 * Shared Skeleton Loading Component
 */
export default function Skeleton({
  variant = "text", // "text" | "rectangular" | "circular" | "card"
  width,
  height,
  className = "",
}) {
  if (variant === "card") {
    return (
      <div
        className={`w-full h-[310.1px] rounded-[18px] border-[0.8px] border-[#E7E8E5] p-2 flex flex-col justify-between bg-white animate-pulse select-none ${className}`}
      >
        <div className="w-full aspect-square rounded-[12px] bg-[#F4F5F8]" />
        <div className="space-y-2 mt-3.5">
          <div className="h-3.5 bg-[#F4F5F8] rounded-full w-3/4" />
          <div className="h-2.5 bg-[#F4F5F8] rounded-full w-1/2" />
        </div>
        <div className="mt-auto pt-2 flex items-end justify-between">
          <div className="h-4 bg-[#F4F5F8] rounded-full w-14" />
          <div className="w-[68px] h-[32px] rounded-full bg-[#F4F5F8]" />
        </div>
      </div>
    );
  }

  const baseClasses = "animate-pulse bg-[#F4F5F8]";
  const shapeClasses = {
    text: "rounded-full h-3 w-full",
    rectangular: "rounded-[14px]",
    circular: "rounded-full",
  }[variant] || "rounded-full";

  return (
    <div
      style={{ width, height }}
      className={`${baseClasses} ${shapeClasses} ${className}`}
    />
  );
}
