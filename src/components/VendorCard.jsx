import React from "react";

export default function VendorCard({ vendor }) {
  return (
    <div className="bg-[#F9F7F2] rounded-lg overflow-hidden border border-[#E8E2D5] hover:shadow-lg transition-shadow">
      <div className="relative overflow-hidden h-48">
        <img
          src={vendor.image || "https://media.base44.com/images/public/6a4f83dffc6191b5376288ac/e30aa9e2a_generated_140002be.png"}
          alt={vendor.business_name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-[#00A0E3] text-[#F9F7F2] text-xs font-medium px-2 py-1 rounded">
          {vendor.business_type}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-heading text-lg font-bold text-[#1A1612] mb-1">{vendor.business_name}</h3>
        {vendor.location && (
          <p className="text-xs text-[#1A1612]/60 mb-2">{vendor.location}</p>
        )}
        {vendor.description && (
          <p className="text-sm text-[#1A1612]/70 line-clamp-2">{vendor.description}</p>
        )}
        {vendor.owner_name && (
          <p className="text-xs text-[#1A1612]/50 mt-2 pt-2 border-t border-[#E8E2D5]">
            Owner: {vendor.owner_name}
          </p>
        )}
      </div>
    </div>
  );
}