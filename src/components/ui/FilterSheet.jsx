import React from "react";
import Drawer from "./Drawer";
import FilterSidebar from "./FilterSidebar";
import Button from "./Button";

/**
 * Shared FilterSheet Component (Mobile Bottom Sheet Filter)
 */
export default function FilterSheet({
  isOpen = false,
  onClose,
  ...filterProps
}) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Filter Products">
      <div className="space-y-4">
        <FilterSidebar className="!w-full !border-0 !p-0 !rounded-none" {...filterProps} />
        <div className="pt-4 border-t-[0.8px] border-[#E7E8E5]">
          <Button variant="primary" fullWidth size={40} onClick={onClose}>
            Apply Filters
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
