import React from "react";
import { MessageCircle, Mail, Globe } from "lucide-react";

export default function VendorCard({ vendor }) {
  const whatsappNum = vendor.whatsapp || vendor.phone;
  const cleanNum = whatsappNum ? whatsappNum.replace(/[^\d+]/g, "").replace(/^0/, "+232") : "";
  const hasContact = vendor.email || cleanNum || vendor.website;

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

        {hasContact && (
          <div className="mt-3 pt-3 border-t border-[#E8E2D5] flex items-center gap-3">
            {cleanNum && (
              <a
                href={`https://wa.me/${cleanNum.replace(/^\+/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-[#25D366] hover:underline"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            )}
            {vendor.email && (
              <a
                href={`mailto:${vendor.email}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#00A0E3] hover:underline"
              >
                <Mail className="w-4 h-4" /> Email
              </a>
            )}
            {vendor.website && (
              <a
                href={vendor.website.startsWith("http") ? vendor.website : `https://${vendor.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-[#00A0E3] hover:underline"
              >
                <Globe className="w-4 h-4" /> Website
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}