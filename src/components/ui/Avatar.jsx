import React, { useState } from "react";
import { User } from "lucide-react";

/**
 * Shared Avatar Component
 */
export default function Avatar({
  src = null,
  alt = "User Avatar",
  name = "",
  size = 40,
  className = "",
}) {
  const [imgError, setImgError] = useState(false);

  const initials = name
    ? name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
      }}
      className={`rounded-full bg-[#FFF4DA] border-[0.8px] border-[#E7E8E5] flex items-center justify-center overflow-hidden shrink-0 select-none ${className}`}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : initials ? (
        <span className="text-[13px] font-extrabold text-[#101828]">
          {initials}
        </span>
      ) : (
        <User size={size * 0.45} className="text-[#101828]" />
      )}
    </div>
  );
}
