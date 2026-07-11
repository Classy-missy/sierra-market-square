import React from "react";
import { Link } from "react-router-dom";
import { Globe, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0D1B2A] text-[#F9F7F2]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-3">
              Sierra Market <span className="text-[#00A0E3]">Glow</span>
            </h3>
            <p className="text-sm text-[#F9F7F2]/70 mb-4 leading-relaxed">
              A digital ecosystem bridging the earth's bounty and global empowerment for female
              entrepreneurs in Sierra Leone.
            </p>
            <a
              href="https://www.unwomen.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2">
              
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/83/UN_WOMEN_Logo.svg"
                alt="UN Women"
                className="h-5 mx-10"
                onError={(e) => {e.target.style.display = 'none';}} />
              
              <span className="text-xs font-semibold">UN Women Partner</span>
            </a>
          </div>

          {/* Market links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wide">Our Farmers</h4>
            <ul className="space-y-2 text-sm text-[#F9F7F2]/70">
              <li><Link to="/vendors" className="hover:text-[#00A0E3] transition-colors">Vendor Directory</Link></li>
              <li><Link to="/" className="hover:text-[#00A0E3] transition-colors">Browse Products</Link></li>
              <li><Link to="/vendors" className="hover:text-[#00A0E3] transition-colors">Business Types</Link></li>
              <li><Link to="/register-customer" className="hover:text-[#00A0E3] transition-colors">Sustainability Impact</Link></li>
            </ul>
          </div>

          {/* Mentorship links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wide">Mentorship</h4>
            <ul className="space-y-2 text-sm text-[#F9F7F2]/70">
              <li><Link to="/mentors" className="hover:text-[#00A0E3] transition-colors">Mentor Directory</Link></li>
              <li><Link to="/register-mentor" className="hover:text-[#00A0E3] transition-colors">Become a Mentor</Link></li>
              <li><Link to="/vendors" className="hover:text-[#00A0E3] transition-colors">Vendor Support</Link></li>
              <li><Link to="/register-customer" className="hover:text-[#00A0E3] transition-colors">Community</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wide">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-[#F9F7F2]/70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#00A0E3]" /> sierraleone.comms@unwomen.org
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#00A0E3]" /> +232 76 123 456
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#00A0E3]" /> Freetown, Sierra Leone
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#F9F7F2]/20 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#F9F7F2]/50">© 2026 Sierra Market Glow. All rights reserved.</p>
          <p className="text-xs text-[#F9F7F2]/50">Powered by UN Women · Empowering Women Entrepreneurs</p>
        </div>
      </div>
    </footer>);

}