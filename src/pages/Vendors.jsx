import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import VendorCard from "@/components/VendorCard";

const businessTypes = ["All", "SME", "SOHO", "MICRO", "MACRO"];

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [activeType, setActiveType] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Vendor.list()
      .then(setVendors)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeType === "All" ? vendors : vendors.filter((v) => v.business_type === activeType);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#1A1612] mb-2">
        Vendor Directory
      </h1>
      <p className="text-[#1A1612]/60 mb-8">
        Discover businesses powered by female entrepreneurs across Sierra Leone.
      </p>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {businessTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeType === type
                ? "bg-[#00A0E3] text-[#F9F7F2]"
                : "bg-[#F0EBE0] text-[#1A1612]/70 hover:bg-[#E8E2D5]"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#F0EBE0] rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      ) : (
        <p className="text-center py-16 text-[#1A1612]/50">No vendors found in this category.</p>
      )}
    </div>
  );
}