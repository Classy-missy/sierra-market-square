import React from "react";
import ProductReviews from "@/components/ProductReviews";

export default function ProductCard({ product }) {
  return (
    <div className="group relative bg-[#F9F7F2] rounded-lg overflow-hidden border border-[#E8E2D5] transition-all hover:shadow-[0_8px_30px_rgba(0,160,227,0.12)]">
      <div className="relative overflow-hidden">
        <img
          src={product.image || "https://media.base44.com/images/public/6a4f83dffc6191b5376288ac/904b5eb06_generated_313fffab.png"}
          alt={product.name}
          className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-[#2D4F1E] uppercase tracking-wide">
            {product.category}
          </span>
          <span className="text-xs text-[#1A1612]/50">{product.business_type}</span>
        </div>
        <h3 className="font-heading text-lg font-bold text-[#1A1612] mb-1">{product.name}</h3>
        {product.vendor_name && (
          <p className="text-xs text-[#1A1612]/60 mb-2">by {product.vendor_name}</p>
        )}
        {product.description && (
          <p className="text-xs text-[#1A1612]/50 line-clamp-1 mb-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="font-heading text-xl font-bold text-[#00A0E3]">
            NLe {Number(product.price || 0).toFixed(2)}
          </span>
          <span className="text-xs text-[#1A1612]/50">{product.unit}</span>
        </div>

        <ProductReviews product={product} />
      </div>
    </div>
  );
}