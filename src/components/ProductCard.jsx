import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import ProductReviews from "@/components/ProductReviews";
import AuthPromptModal from "@/components/AuthPromptModal";
import { Loader2 } from "lucide-react";

export default function ProductCard({ product, disableNavigation }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCardClick = async () => {
    if (disableNavigation) return;
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    if (!product.vendor_name) return;
    setLoading(true);
    try {
      const vendors = await base44.entities.Vendor.filter({ business_name: product.vendor_name });
      if (vendors.length > 0) {
        navigate(`/vendors/${vendors[0].id}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const clickable = !disableNavigation;

  return (
    <>
      <div className="group relative bg-[#F9F7F2] rounded-lg overflow-hidden border border-[#E8E2D5] transition-all hover:shadow-[0_8px_30px_rgba(0,160,227,0.12)] hover:border-[#00A0E3]/30">
        <div onClick={clickable ? handleCardClick : undefined} className={clickable ? "cursor-pointer" : ""}>
          <div className="relative overflow-hidden">
            <img
              src={product.image || "https://media.base44.com/images/public/6a4f83dffc6191b5376288ac/904b5eb06_generated_313fffab.png"}
              alt={product.name}
              className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {loading && (
              <div className="absolute inset-0 bg-[#F9F7F2]/60 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-[#00A0E3] animate-spin" />
              </div>
            )}
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
          </div>
        </div>

        <div className="px-4 pb-4">
          <ProductReviews product={product} />
        </div>
      </div>
      <AuthPromptModal isOpen={showAuthPrompt} onClose={() => setShowAuthPrompt(false)} />
    </>
  );
}