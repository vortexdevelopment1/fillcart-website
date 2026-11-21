import React from "react";

/**
 * Shared Table Component
 * Semantic divider-separated table for orders and account lists
 */
export default function Table({
  headers = [], // ['Order ID', 'Date', 'Total', 'Status', 'Action']
  children,
  className = "",
}) {
  return (
    <div className={`w-full overflow-x-auto rounded-[18px] border-[0.8px] border-[#E7E8E5] bg-white ${className}`}>
      <table
        style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
        className="w-full text-left border-collapse"
      >
        {headers.length > 0 && (
          <thead>
            <tr className="border-b-[0.8px] border-[#E7E8E5] bg-[#F4F5F8]/50">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="px-4 sm:px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-wider text-[#667085]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y-[0.8px] divide-[#E7E8E5] text-[13px] text-[#101828]">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function TableRow({ children, className = "", onClick = null }) {
  return (
    <tr
      onClick={onClick}
      className={`transition-colors hover:bg-[#F4F5F8]/50 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className = "" }) {
  return <td className={`px-4 sm:px-6 py-4 align-middle ${className}`}>{children}</td>;
}
