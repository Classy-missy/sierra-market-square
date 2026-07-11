import React from "react";
import { Link } from "react-router-dom";
import { X, User, Store, Heart, LogIn } from "lucide-react";

export default function AuthPromptModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1A1612]/60" onClick={onClose} />
      <div className="relative bg-[#F9F7F2] rounded-lg border border-[#E8E2D5] shadow-2xl w-full max-w-md p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#1A1612]/50 hover:text-[#1A1612]"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#00A0E3]/10 mb-3">
            <User className="w-7 h-7 text-[#00A0E3]" />
          </div>
          <h2 className="font-heading text-xl font-bold text-[#1A1612] mb-1">
            Sign Up or Log In
          </h2>
          <p className="text-sm text-[#1A1612]/60">
            Create an account or log in to continue browsing vendor products.
          </p>
        </div>
        <div className="space-y-2">
          <Link
            to="/login"
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-md border border-[#00A0E3] bg-[#00A0E3]/5 hover:bg-[#00A0E3]/10 transition-colors"
          >
            <LogIn className="w-5 h-5 text-[#00A0E3] flex-shrink-0" />
            <span className="font-semibold text-sm text-[#1A1612]">Log In</span>
          </Link>
          <Link
            to="/register-customer"
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-md border border-[#E8E2D5] hover:bg-[#F0EBE0] transition-colors"
          >
            <User className="w-5 h-5 text-[#00A0E3] flex-shrink-0" />
            <div>
              <div className="font-semibold text-sm text-[#1A1612]">Register as Customer</div>
              <p className="text-xs text-[#1A1612]/60">Shop fresh produce and support local women</p>
            </div>
          </Link>
          <Link
            to="/register-vendor"
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-md border border-[#E8E2D5] hover:bg-[#F0EBE0] transition-colors"
          >
            <Store className="w-5 h-5 text-[#00A0E3] flex-shrink-0" />
            <div>
              <div className="font-semibold text-sm text-[#1A1612]">Register as Vendor</div>
              <p className="text-xs text-[#1A1612]/60">List your business and reach new customers</p>
            </div>
          </Link>
          <Link
            to="/register-mentor"
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-md border border-[#E8E2D5] hover:bg-[#F0EBE0] transition-colors"
          >
            <Heart className="w-5 h-5 text-[#2D4F1E] flex-shrink-0" />
            <div>
              <div className="font-semibold text-sm text-[#1A1612]">Register as Mentor</div>
              <p className="text-xs text-[#1A1612]/60">Share your expertise and empower others</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}