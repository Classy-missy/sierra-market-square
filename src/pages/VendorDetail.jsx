import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import ProductCard from "@/components/ProductCard";
import { MessageCircle, Mail, Globe, MapPin, ArrowLeft, Package } from "lucide-react";

export default function VendorDetail() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    base44.entities.Vendor.get(id)
      .then(async (v) => {
        setVendor(v);
        const matched = await base44.entities.Product.filter({
          vendor_name: v.business_name,
        });
        setProducts(matched);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-[#F0EBE0] rounded mb-6" />
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="w-full md:w-1/3 h-64 bg-[#F0EBE0] rounded-lg" />
            <div className="flex-1 space-y-3">
              <div className="h-8 bg-[#F0EBE0] rounded w-2/3" />
              <div className="h-4 bg-[#F0EBE0] rounded w-1/3" />
              <div className="h-4 bg-[#F0EBE0] rounded w-full" />
              <div className="h-4 bg-[#F0EBE0] rounded w-5/6" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#F0EBE0] rounded-lg h-80" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-[#1A1612]/60 mb-4">Vendor not found.</p>
        <Link to="/vendors" className="text-[#00A0E3] hover:underline font-medium">
          ← Back to Vendors
        </Link>
      </div>
    );
  }

  const whatsappNum = vendor.whatsapp || vendor.phone;
  const cleanNum = whatsappNum ? whatsappNum.replace(/[^\d+]/g, "").replace(/^0/, "+232") : "";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <Link
        to="/vendors"
        className="inline-flex items-center gap-2 text-sm text-[#1A1612]/60 hover:text-[#00A0E3] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Vendors
      </Link>

      {/* Vendor header */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-10">
        <div className="w-full md:w-80 h-64 flex-shrink-0 rounded-lg overflow-hidden border border-[#E8E2D5]">
          <img
            src={vendor.image || "https://media.base44.com/images/public/6a4f83dffc6191b5376288ac/e30aa9e2a_generated_140002be.png"}
            alt={vendor.business_name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#00A0E3] text-[#F9F7F2] text-xs font-medium px-2 py-1 rounded">
              {vendor.business_type}
            </span>
            {vendor.sector && (
              <span className="bg-[#F0EBE0] text-[#1A1612]/70 text-xs font-medium px-2 py-1 rounded">
                {vendor.sector}
              </span>
            )}
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#1A1612] mb-2">
            {vendor.business_name}
          </h1>

          {vendor.owner_name && (
            <p className="text-sm text-[#1A1612]/60 mb-3">
              Owned by {vendor.owner_name}
            </p>
          )}

          {vendor.description && (
            <p className="text-sm text-[#1A1612]/70 leading-relaxed mb-4 max-w-2xl">
              {vendor.description}
            </p>
          )}

          <div className="flex flex-wrap gap-4 text-sm">
            {vendor.location && (
              <span className="inline-flex items-center gap-1.5 text-[#1A1612]/60">
                <MapPin className="w-4 h-4 text-[#00A0E3]" /> {vendor.location}
              </span>
            )}
            {vendor.region && (
              <span className="inline-flex items-center gap-1.5 text-[#1A1612]/60">
                <MapPin className="w-4 h-4 text-[#00A0E3]" /> {vendor.region}
              </span>
            )}
          </div>

          {/* Contact links */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            {cleanNum && (
              <a
                href={`https://wa.me/${cleanNum.replace(/^\+/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#25D366] hover:underline"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            )}
            {vendor.email && (
              <a
                href={`mailto:${vendor.email}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00A0E3] hover:underline"
              >
                <Mail className="w-4 h-4" /> Email
              </a>
            )}
            {vendor.website && (
              <a
                href={vendor.website.startsWith("http") ? vendor.website : `https://${vendor.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00A0E3] hover:underline"
              >
                <Globe className="w-4 h-4" /> Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Products section */}
      <div className="border-t border-[#E8E2D5] pt-8">
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-5 h-5 text-[#00A0E3]" />
          <h2 className="font-heading text-xl font-bold text-[#1A1612]">
            Products from {vendor.business_name}
          </h2>
          {products.length > 0 && (
            <span className="text-sm text-[#1A1612]/50 ml-1">({products.length})</span>
          )}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#F0EBE0]/50 rounded-lg">
            <Package className="w-10 h-10 text-[#1A1612]/20 mx-auto mb-3" />
            <p className="text-[#1A1612]/50">
              No products listed yet from this vendor.
            </p>
            <Link
              to="/vendors"
              className="inline-block mt-4 text-[#00A0E3] hover:underline font-medium text-sm"
            >
              Browse other vendors →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}