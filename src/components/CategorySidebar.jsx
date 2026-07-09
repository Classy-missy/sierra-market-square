import React from "react";

const businessTypes = ["Agro-processing", "Retail", "Logistics", "Farming", "Catering"];
const productCategories = ["Tubers", "Vegetables", "Grains", "Fruits", "Spices", "Oils"];

export default function CategorySidebar({ activeFilter, onFilterChange }) {
  return (
    <nav aria-label="Category filters" className="w-full">
      <div className="mb-6">
        <h3 className="font-heading text-lg font-bold text-[#1A1612] mb-3">Business Types</h3>
        <ul className="space-y-1">
          {businessTypes.map((type) => {
            const active = activeFilter?.type === "business" && activeFilter?.value === type;
            return (
              <li key={type}>
                <button
                  onClick={() => onFilterChange({ type: "business", value: type })}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    active
                      ? "bg-[#00A0E3] text-[#F9F7F2] font-medium"
                      : "text-[#1A1612]/70 hover:bg-[#F0EBE0]"
                  }`}
                >
                  {type}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="pt-4 border-t border-[#E8E2D5]">
        <h3 className="font-heading text-lg font-bold text-[#1A1612] mb-3">Product Categories</h3>
        <ul className="space-y-1">
          {productCategories.map((cat) => {
            const active = activeFilter?.type === "category" && activeFilter?.value === cat;
            return (
              <li key={cat}>
                <button
                  onClick={() => onFilterChange({ type: "category", value: cat })}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    active
                      ? "bg-[#2D4F1E] text-[#F9F7F2] font-medium"
                      : "text-[#1A1612]/70 hover:bg-[#F0EBE0]"
                  }`}
                >
                  {cat}
                </button>
              </li>
            );
          })}
        </ul>
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