import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBasket, Store, Heart, ArrowRight, Users, MapPin } from "lucide-react";

const FEATURE_IMG = "https://media.base44.com/images/public/6a4f83dffc6191b5376288ac/e30aa9e2a_generated_140002be.png";

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-14">
        <h1 className="font-heading text-3xl md:text-5xl font-bold text-[#1A1612] mb-4">
          About Sierra Market <span className="text-[#00A0E3]">Glow</span>
        </h1>
        <p className="text-base md:text-lg text-[#1A1612]/70 max-w-3xl mx-auto leading-relaxed">
          A digital marketplace bridging local women entrepreneurs with the community.
          We empower women-led businesses across Sierra Leone by providing a platform to sell
          produce, connect with mentors, and grow sustainably — supported by UN Women.
        </p>
      </div>

      {/* What we do */}
      <div className="bg-white border border-[#E8E2D5] rounded-lg p-6 md:p-8 mb-10">
        <h2 className="font-heading text-2xl font-bold text-[#1A1612] mb-4">What We Do</h2>
        <p className="text-sm text-[#1A1612]/70 leading-relaxed mb-4">
          Sierra Market Glow connects farmers, artisans, and women entrepreneurs directly with
          customers across Sierra Leone. Our platform removes middlemen, increases profit margins
          for vendors, and gives customers access to fresh, locally-sourced products — all while
          fostering a mentorship ecosystem where experienced professionals guide emerging
          entrepreneurs.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="flex flex-col items-center text-center p-4 bg-[#F0EBE0] rounded-lg">
            <ShoppingBasket className="w-8 h-8 text-[#00A0E3] mb-2" />
            <h3 className="font-semibold text-sm text-[#1A1612]">Marketplace</h3>
            <p className="text-xs text-[#1A1612]/60 mt-1">Browse and buy fresh produce and artisanal goods</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-[#F0EBE0] rounded-lg">
            <Store className="w-8 h-8 text-[#00A0E3] mb-2" />
            <h3 className="font-semibold text-sm text-[#1A1612]">Vendor Hub</h3>
            <p className="text-xs text-[#1A1612]/60 mt-1">Women list their businesses and reach new customers</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-[#F0EBE0] rounded-lg">
            <Heart className="w-8 h-8 text-[#2D4F1E] mb-2" />
            <h3 className="font-semibold text-sm text-[#1A1612]">Mentorship</h3>
            <p className="text-xs text-[#1A1612]/60 mt-1">Experienced mentors guide emerging entrepreneurs</p>
          </div>
        </div>
      </div>

      {/* For Customers */}
      <div className="bg-white border border-[#E8E2D5] rounded-lg p-6 md:p-8 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#00A0E3]/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-[#00A0E3]" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#1A1612]">For Customers</h2>
        </div>
        <p className="text-sm text-[#1A1612]/70 leading-relaxed mb-4">
          Shop directly from women-led businesses across Sierra Leone. Browse fresh produce,
          artisanal goods, and more — all in one place.
        </p>
        <ul className="space-y-2 text-sm text-[#1A1612]/70">
          <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#00A0E3] flex-shrink-0 mt-0.5" /> Browse products on the homepage and filter by category, region, or business type</li>
          <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#00A0E3] flex-shrink-0 mt-0.5" /> Click any product to see all items from that vendor</li>
          <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#00A0E3] flex-shrink-0 mt-0.5" /> Leave reviews and ratings on products you've tried</li>
          <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#00A0E3] flex-shrink-0 mt-0.5" /> Contact vendors directly via WhatsApp, email, or their website</li>
          <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#00A0E3] flex-shrink-0 mt-0.5" /> Register for free to unlock full product browsing and vendor details</li>
        </ul>
        <Link to="/register-customer" className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-[#00A0E3] hover:underline">
          Register as Customer <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* For Vendors */}
      <div className="bg-white border border-[#E8E2D5] rounded-lg p-6 md:p-8 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#00A0E3]/10 flex items-center justify-center">
            <Store className="w-5 h-5 text-[#00A0E3]" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#1A1612]">For Vendors</h2>
        </div>
        <p className="text-sm text-[#1A1612]/70 leading-relaxed mb-4">
          List your business, showcase your products, and reach customers across Sierra Leone.
          Grow your income with direct-to-consumer sales.
        </p>
        <ul className="space-y-2 text-sm text-[#1A1612]/70">
          <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#00A0E3] flex-shrink-0 mt-0.5" /> Register your business with photos, description, and contact details</li>
          <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#00A0E3] flex-shrink-0 mt-0.5" /> Add and manage your product catalog</li>
          <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#00A0E3] flex-shrink-0 mt-0.5" /> Get discovered by customers filtering by category, region, or business type</li>
          <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#00A0E3] flex-shrink-0 mt-0.5" /> Connect with WhatsApp, email, and website links on your vendor page</li>
          <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#00A0E3] flex-shrink-0 mt-0.5" /> Request a mentor to get guidance on growing your business</li>
        </ul>
        <Link to="/register-vendor" className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-[#00A0E3] hover:underline">
          Register as Vendor <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* For Mentors */}
      <div className="bg-white border border-[#E8E2D5] rounded-lg p-6 md:p-8 mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#2D4F1E]/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-[#2D4F1E]" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#1A1612]">For Mentors</h2>
        </div>
        <p className="text-sm text-[#1A1612]/70 leading-relaxed mb-4">
          Share your expertise and empower the next generation of female entrepreneurs in Sierra Leone.
        </p>
        <ul className="space-y-2 text-sm text-[#1A1612]/70">
          <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#00A0E3] flex-shrink-0 mt-0.5" /> Create a mentor profile with your expertise areas and bio</li>
          <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#00A0E3] flex-shrink-0 mt-0.5" /> Receive booking requests from vendors and entrepreneurs</li>
          <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#00A0E3] flex-shrink-0 mt-0.5" /> Schedule sessions with an integrated calendar booking system</li>
          <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#00A0E3] flex-shrink-0 mt-0.5" /> Set your availability status (Available, Limited, or Full)</li>
          <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#00A0E3] flex-shrink-0 mt-0.5" /> Get email notifications when someone books a session with you</li>
        </ul>
        <Link to="/register-mentor" className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-[#00A0E3] hover:underline">
          Register as Mentor <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* CTA */}
      <div className="bg-[#1A1612] rounded-lg p-8 text-center">
        <h2 className="font-heading text-2xl font-bold text-[#F9F7F2] mb-2">
          Ready to Get Started?
        </h2>
        <p className="text-sm text-[#F9F7F2]/70 mb-6 max-w-xl mx-auto">
          Join Sierra Market Glow today and be part of a community empowering women entrepreneurs
          across Sierra Leone.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/register-customer" className="px-6 py-2.5 bg-[#00A0E3] text-[#F9F7F2] rounded-md text-sm font-medium hover:bg-[#0086C0] transition-colors">
            Join as Customer
          </Link>
          <Link to="/register-vendor" className="px-6 py-2.5 bg-[#F9F7F2] text-[#1A1612] rounded-md text-sm font-medium hover:bg-[#F0EBE0] transition-colors">
            Join as Vendor
          </Link>
          <Link to="/register-mentor" className="px-6 py-2.5 border border-[#F9F7F2]/30 text-[#F9F7F2] rounded-md text-sm font-medium hover:bg-[#F9F7F2]/10 transition-colors">
            Join as Mentor
          </Link>
        </div>
      </div>
    </div>
  );
}