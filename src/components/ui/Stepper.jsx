import React from "react";
import { Check } from "lucide-react";

/**
 * Shared Stepper Component
 * Supports "horizontal" (checkout flow) and "vertical" (order tracking timeline)
 */
export default function Stepper({
  steps = [], // [{ id: 1, label: '...', description?: '...', time?: '...' }]
  activeStep = 1,
  orientation = "horizontal", // "horizontal" | "vertical"
  className = "",
}) {
  if (orientation === "vertical") {
    return (
      <div
        style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
        className={`space-y-6 text-left relative pl-2 ${className}`}
      >
        {steps.map((step, idx) => {
          const isDone = step.id < activeStep;
          const isCurrent = step.id === activeStep;
          const isLast = idx === steps.length - 1;

          return (
            <div key={step.id} className="relative flex items-start gap-4">
              {/* Connecting line */}
              {!isLast && (
                <div
                  className={`absolute left-[15px] top-[30px] bottom-[-24px] w-[2px] transition-colors ${
                    isDone ? "bg-[#16803C]" : "bg-[#E7E8E5]"
                  }`}
                />
              )}

              {/* Step indicator node */}
              <div
                className={`w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 z-10 transition-all font-bold text-xs ${
                  isDone
                    ? "bg-[#16803C] text-white shadow-xs"
                    : isCurrent
                    ? "bg-[#F5B800] text-[#101828] ring-4 ring-[#FFF4DA]"
                    : "bg-[#F4F5F8] text-[#667085] border-[0.8px] border-[#E7E8E5]"
                }`}
              >
                {isDone ? <Check size={14} strokeWidth={3} /> : step.id}
              </div>

              {/* Step content */}
              <div className="flex-1 pt-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h5
                    className={`text-[13px] sm:text-[14px] font-bold ${
                      isCurrent ? "text-[#101828] font-extrabold" : isDone ? "text-[#101828]" : "text-[#667085]"
                    }`}
                  >
                    {step.label}
                  </h5>
                  {step.time && (
                    <span className="text-[11px] text-[#667085] font-medium">{step.time}</span>
                  )}
                </div>
                {step.description && (
                  <p className="text-[12px] text-[#667085] mt-0.5 leading-snug">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal Stepper (for Checkout)
  return (
    <div
      style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
      className={`w-full flex items-center justify-between relative ${className}`}
    >
      {steps.map((step, idx) => {
        const isDone = step.id < activeStep;
        const isCurrent = step.id === activeStep;
        const isLast = idx === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1.5 z-10 shrink-0">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isDone
                    ? "bg-[#16803C] text-white"
                    : isCurrent
                    ? "bg-[#F5B800] text-[#101828] ring-4 ring-[#FFF4DA] font-extrabold"
                    : "bg-[#F4F5F8] text-[#667085] border-[0.8px] border-[#E7E8E5]"
                }`}
              >
                {isDone ? <Check size={16} strokeWidth={3} /> : step.id}
              </div>
              <span
                className={`text-[11px] sm:text-[12px] whitespace-nowrap ${
                  isCurrent ? "font-extrabold text-[#101828]" : isDone ? "font-bold text-[#101828]" : "text-[#667085]"
                }`}
              >
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div
                className={`flex-1 h-[2px] mx-2 sm:mx-4 transition-colors -mt-5 ${
                  isDone ? "bg-[#16803C]" : "bg-[#E7E8E5]"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
