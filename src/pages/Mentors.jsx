import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import MentorCard from "@/components/MentorCard";
import { Heart } from "lucide-react";

export default function Mentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Mentor.list()
      .then(setMentors)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#1A1612] mb-2">
          Mentorship Hub
        </h1>
        <p className="text-[#1A1612]/60 max-w-2xl mx-auto leading-relaxed">
          Connect with experienced mentors who guide and empower the next generation of female
          entrepreneurs in Sierra Leone.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#F0EBE0] rounded-lg h-80 animate-pulse" />
          ))}
        </div>
      ) : mentors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-[#1A1612]/50 mb-4">No mentors registered yet.</p>
          <Link
            to="/register-mentor"
            className="inline-flex items-center gap-2 bg-[#00A0E3] text-[#F9F7F2] px-6 py-3 rounded-md font-medium hover:bg-[#0086C0] transition-colors"
          >
            <Heart className="w-4 h-4" /> Become the First Mentor
          </Link>
        </div>
      )}
    </div>
  );
}