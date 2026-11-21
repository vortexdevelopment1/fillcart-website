import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "./Button";

/**
 * Shared ErrorState Component
 */
export default function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while loading this content. Please try again.",
  onRetry = null,
  className = "",
}) {
  return (
    <div
      style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
      className={`py-10 px-6 text-center max-w-md mx-auto flex flex-col items-center justify-center rounded-[24px] bg-[#FCECEC]/50 border-[0.8px] border-[#B42318]/20 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#FCECEC] text-[#B42318] flex items-center justify-center mb-3">
        <AlertCircle size={24} />
      </div>

      <h4 className="text-base sm:text-lg font-extrabold text-[#101828] mb-1">
        {title}
      </h4>

      <p className="text-xs sm:text-sm text-[#667085] leading-relaxed mb-5">
        {message}
      </p>

      {onRetry && (
        <Button
          variant="secondary"
          size={32}
          icon={RefreshCw}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
