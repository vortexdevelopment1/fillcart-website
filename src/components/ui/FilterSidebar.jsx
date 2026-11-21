import React from "react";
import Checkbox from "./Checkbox";
import Radio from "./Radio";
import Switch from "./Switch";
import Chip from "./Chip";

/**
 * Shared FilterSidebar Component (Desktop)
 */
export default function FilterSidebar({
  categories = [],
  selectedCategory = "",
  onSelectCategory,
  priceRanges = [],
  selectedPriceRange = null,
  onSelectPriceRange,
  inStockOnly = false,
  onToggleInStock,
  onReset = null,
  className = "",
}) {
  return (
    <aside
      style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
      className={`w-full lg:w-[260px] bg-white rounded-[18px] border-[0.8px] border-[#E7E8E5] p-5 text-left space-y-6 shrink-0 ${className}`}
    >
      <div className="flex items-center justify-between border-b-[0.8px] border-[#E7E8E5] pb-3.5">
        <h4 className="text-[14px] font-extrabold text-[#101828]">Filters</h4>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] font-bold text-[#2F6842] hover:underline cursor-pointer"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="space-y-3">
          <h5 className="text-[12px] font-extrabold uppercase tracking-wider text-[#667085]">
            Categories
          </h5>
          <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
            {categories.map((cat) => (
              <Radio
                key={cat.id || cat.slug || cat.name}
                name="category-filter"
                value={cat.slug || cat.id}
                checked={selectedCategory === (cat.slug || cat.id)}
                onChange={onSelectCategory}
                label={cat.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Price Ranges */}
      {priceRanges.length > 0 && (
        <div className="space-y-3">
          <h5 className="text-[12px] font-extrabold uppercase tracking-wider text-[#667085]">
            Price Range
          </h5>
          <div className="space-y-2">
            {priceRanges.map((range, idx) => (
              <Radio
                key={idx}
                name="price-filter"
                value={range.value}
                checked={selectedPriceRange === range.value}
                onChange={onSelectPriceRange}
                label={range.label}
              />
            ))}
          </div>
        </div>
      )}

      {/* In Stock Switch */}
      {typeof inStockOnly === "boolean" && (
        <div className="pt-2 border-t-[0.8px] border-[#E7E8E5]">
          <Switch
            checked={inStockOnly}
            onChange={onToggleInStock}
            label="In Stock Only"
            description="Hide sold out items"
          />
        </div>
      )}
    </aside>
  );
}
