import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, User, Heart, Globe, Shield, Store } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const navItems = [
  { label: "Home", path: "/" },
  { label: "Vendor", path: "/vendors" },
  { label: "Mentors", path: "/mentors" }];


  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#F9F7F2] border-b border-[#E8E2D5]">
      {/* Pre-header with UN Women logo */}
      <div className="bg-[#1A1612] text-[#F9F7F2] px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a
            href="https://www.unwomen.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2">
            
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/83/UN_WOMEN_Logo.svg"
              alt="UN Women"
              className="h-5"
              onError={(e) => {e.target.style.display = 'none';}} />
            
            <span className="text-xs font-bold tracking-wide hidden">UN Women Partner</span>
          </a>
          <span className="hidden sm:inline text-xs text-[#F9F7F2]/60">
            Empowering Women Entrepreneurs in Sierra Leone
          </span>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1">
          <span className="font-heading text-2xl font-bold text-[#1A1612]">Sierra Leone Market </span>
          <span className="font-heading text-2xl font-bold text-[#00A0E3]">Square</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) =>
          <Link
            key={item.path}
            to={item.path}
            className={`text-sm font-medium transition-colors ${
            isActive(item.path) ? "text-[#00A0E3]" : "text-[#1A1612] hover:text-[#00A0E3]"}`
            }>
            
              {item.label}
            </Link>
          )}

          {isAdmin &&
          <Link
            to="/admin"
            className="flex items-center gap-1 text-sm font-medium text-[#00A0E3] hover:text-[#0086C0]">
            
              <Shield className="w-4 h-4" /> Admin
            </Link>
          }

          {/* Register dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setRegisterOpen(true)}
            onMouseLeave={() => setRegisterOpen(false)}>
            
            <button className="flex items-center gap-1 text-sm font-medium text-[#1A1612] hover:text-[#00A0E3]">
              Register <ChevronDown className="w-4 h-4" />
            </button>
            {registerOpen &&
            <div className="absolute top-full right-0 pt-2 z-50">
                <div className="bg-[#F9F7F2] border border-[#E8E2D5] rounded-lg shadow-xl w-72 overflow-hidden">
                  <Link
                  to="/register-customer"
                  className="flex items-center gap-3 p-4 hover:bg-[#F0EBE0] transition-colors border-b border-[#E8E2D5]">
                  
                    <User className="w-5 h-5 text-[#00A0E3] flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm text-[#1A1612]">Join as Customer</div>
                      <p className="text-xs text-[#1A1612]/70">Shop fresh produce and support local women</p>
                    </div>
                  </Link>
                  <Link
                  to="/register-vendor"
                  className="flex items-center gap-3 p-4 hover:bg-[#F0EBE0] transition-colors border-b border-[#E8E2D5]">
                  
                    <Store className="w-5 h-5 text-[#00A0E3] flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm text-[#1A1612]">Join as Vendor</div>
                      <p className="text-xs text-[#1A1612]/70">List your business and reach new customers</p>
                    </div>
                  </Link>
                  <Link
                  to="/register-mentor"
                  className="flex items-center gap-3 p-4 hover:bg-[#F0EBE0] transition-colors">
                  
                    <Heart className="w-5 h-5 text-[#2D4F1E] flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm text-[#1A1612]">Join as Mentor</div>
                      <p className="text-xs text-[#1A1612]/70">Share your expertise and empower others</p>
                    </div>
                  </Link>
                </div>
              </div>
            }
          </div>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-[#1A1612]" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen &&
      <div className="md:hidden border-t border-[#E8E2D5] px-4 py-4 space-y-3 bg-[#F9F7F2]">
          {navItems.map((item) =>
        <Link
          key={item.path}
          to={item.path}
          onClick={() => setMobileOpen(false)}
          className={`block text-sm font-medium ${
          isActive(item.path) ? "text-[#00A0E3]" : "text-[#1A1612]"}`
          }>
          
              {item.label}
            </Link>
        )}
          {isAdmin &&
        <Link
          to="/admin"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-1 py-1 text-sm font-medium text-[#00A0E3]">
          
              <Shield className="w-4 h-4" /> Admin Dashboard
            </Link>
        }
          <div className="pt-3 border-t border-[#E8E2D5]">
            <p className="text-xs font-semibold text-[#1A1612]/50 mb-2 uppercase tracking-wide">Register</p>
            <Link
            to="/register-customer"
            onClick={() => setMobileOpen(false)}
            className="block py-1 text-sm font-medium text-[#1A1612]">
            
              Join as Customer
            </Link>
            <Link
            to="/register-vendor"
            onClick={() => setMobileOpen(false)}
            className="block py-1 text-sm font-medium text-[#1A1612]">
            
              Join as Vendor
            </Link>
            <Link
            to="/register-mentor"
            onClick={() => setMobileOpen(false)}
            className="block py-1 text-sm font-medium text-[#1A1612]">
            
              Join as Mentor
            </Link>
          </div>
        </div>
      }
    </header>);

}