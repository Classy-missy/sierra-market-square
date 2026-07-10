import React, { useState } from "react";
import { Calendar } from "lucide-react";
import BookingModal from "@/components/BookingModal";

const availabilityStyles = {
  Available: "bg-[#2D4F1E] text-[#F9F7F2]",
  Limited: "bg-[#00A0E3] text-[#F9F7F2]",
  Full: "bg-[#1A1612] text-[#F9F7F2]/60",
};

export default function MentorCard({ mentor }) {
  const availClass = availabilityStyles[mentor.availability] || availabilityStyles.Available;
  const [bookingOpen, setBookingOpen] = useState(false);
  const isFull = mentor.availability === "Full";

  return (
    <>
      <div className="bg-[#F9F7F2] rounded-lg overflow-hidden border border-[#E8E2D5] hover:shadow-lg transition-shadow flex flex-col">
        <div className="relative overflow-hidden h-64">
          <img
            src={mentor.image || "https://media.base44.com/images/public/6a4f83dffc6191b5376288ac/d8a6b9149_generated_b70b6a63.png"}
            alt={mentor.name}
            className="w-full h-full object-cover"
          />
          <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium ${availClass}`}>
            {mentor.availability || "Available"}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-heading text-lg font-bold text-[#1A1612] mb-2">{mentor.name}</h3>
          {mentor.expertise_areas?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {mentor.expertise_areas.slice(0, 3).map((area, i) => (
                <span
                  key={i}
                  className="text-xs bg-[#F0EBE0] text-[#1A1612]/70 px-2 py-0.5 rounded-full"
                >
                  {area}
                </span>
              ))}
            </div>
          )}
          {mentor.bio && (
            <p className="text-sm text-[#1A1612]/70 line-clamp-3 flex-1">{mentor.bio}</p>
          )}
          <button
            onClick={() => setBookingOpen(true)}
            disabled={isFull}
            className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
              isFull
                ? "bg-[#E8E2D5] text-[#1A1612]/40 cursor-not-allowed"
                : "bg-[#00A0E3] text-[#F9F7F2] hover:bg-[#0086C0]"
            }`}
          >
            <Calendar className="w-4 h-4" />
            {isFull ? "Currently Unavailable" : "Book a Session"}
          </button>
        </div>
      </div>
      <BookingModal mentor={mentor} isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}