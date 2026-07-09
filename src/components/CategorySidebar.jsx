import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { BUSINESS_TYPES, SECTORS, REGIONS, PRODUCT_CATEGORIES } from "@/lib/constants";

function FilterSection({ title, items, filterType, activeFilter, onFilterChange, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between font-heading text-sm font-bold text-[#1A1612] mb-2"
      >
        {title}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
        />
      </button>
      {open && (
        <ul className="space-y-1">
          {items.map((item) => {
            const active = activeFilter?.type === filterType && activeFilter?.value === item;
            return (
              <li key={item}>
                <button
                  onClick={() => onFilterChange({ type: filterType, value: item })}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                    active
                      ? filterType === "category"
                        ? "bg-[#2D4F1E] text-[#F9F7F2] font-medium"
                        : "bg-[#00A0E3] text-[#F9F7F2] font-medium"
                      : "text-[#1A1612]/70 hover:bg-[#F0EBE0]"
                  }`}
                >
                  {item}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function CategorySidebar({ activeFilter, onFilterChange }) {
  return (
    <nav aria-label="Category filters" className="w-full">
      <FilterSection
        title="Business Types"
        items={BUSINESS_TYPES}
        filterType="business"
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
      />
      <div className="border-t border-[#E8E2D5] pt-3">
        <FilterSection
          title="Sectors"
          items={SECTORS}
          filterType="sector"
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
      </div>
      <div className="border-t border-[#E8E2D5] pt-3">
        <FilterSection
          title="Regions"
          items={REGIONS}
          filterType="region"
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
      </div>
      <div className="border-t border-[#E8E2D5] pt-3">
        <FilterSection
          title="Product Categories"
          items={PRODUCT_CATEGORIES}
          filterType="category"
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
      </div>

      {activeFilter && (
        <button
          onClick={() => onFilterChange(null)}
          className="mt-4 w-full px-3 py-2 text-xs text-[#00A0E3] hover:underline font-medium"
        >
          ← Clear filters
        </button>
      )}
    </nav>
  );
}