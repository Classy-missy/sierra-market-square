import React from "react";
import { BUSINESS_TYPES, SECTORS, REGIONS, PRODUCT_CATEGORIES } from "@/lib/constants";

function FilterSelect({ label, items, value, onChange, placeholder }) {
  return (
    <div className="mb-4">
      <label className="block font-heading text-sm font-bold text-[#1A1612] mb-1.5">{label}</label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full h-10 px-3 rounded-md border border-[#E8E2D5] bg-white text-sm text-[#1A1612] focus:outline-none focus:ring-2 focus:ring-[#00A0E3]/30 focus:border-[#00A0E3]"
      >
        <option value="">{placeholder}</option>
        {items.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
    </div>
  );
}

export default function CategorySidebar({ activeFilter, onFilterChange }) {
  const getValue = (type) =>
    activeFilter?.type === type ? activeFilter.value : "";
  const handleChange = (type) => (value) =>
    onFilterChange(value ? { type, value } : null);

  return (
    <nav aria-label="Category filters" className="w-full">
      <FilterSelect
        label="Business Types"
        items={BUSINESS_TYPES}
        value={getValue("business")}
        onChange={handleChange("business")}
        placeholder="All business types"
      />
      <FilterSelect
        label="Categories"
        items={SECTORS}
        value={getValue("sector")}
        onChange={handleChange("sector")}
        placeholder="All sectors"
      />
      <FilterSelect
        label="Sierra Leone Regions"
        items={REGIONS}
        value={getValue("region")}
        onChange={handleChange("region")}
        placeholder="All regions"
      />
      <FilterSelect
        label="Product Type"
        items={PRODUCT_CATEGORIES}
        value={getValue("category")}
        onChange={handleChange("category")}
        placeholder="All categories"
      />

      {activeFilter && (
        <button
          onClick={() => onFilterChange(null)}
          className="mt-2 w-full px-3 py-2 text-xs text-[#00A0E3] hover:underline font-medium"
        >
          ← Clear filters
        </button>
      )}
    </nav>
  );
}