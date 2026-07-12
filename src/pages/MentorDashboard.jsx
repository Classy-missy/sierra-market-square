import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Heart, Calendar, Clock, Users, LogOut, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const statusConfig = {
  pending: { icon: AlertCircle, color: "text-[#00A0E3]", bg: "bg-[#00A0E3]/10", label: "Pending" },
  confirmed: { icon: CheckCircle, color: "text-[#2D4F1E]", bg: "bg-[#2D4F1E]/10", label: "Confirmed" },
  cancelled: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", label: "Cancelled" },
};

export default function MentorDashboard() {
  const { user, logout } = useAuth();
  const [mentor, setMentor] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (!user?.email) return;
    base44.entities.Mentor.filter({ email: user.email })
      .then(async (mentors) => {
        if (mentors.length > 0) {
          setMentor(mentors[0]);
          const bks = await base44.entities.Booking.filter({ mentor_email: user.email });
          setBookings(bks);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const updateBookingStatus = async (bookingId, status) => {
    setUpdating(bookingId);
    try {
      await base44.entities.Booking.update(bookingId, { status });
      const updated = await base44.entities.Booking.filter({ mentor_email: user.email });
      setBookings(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
        <div className="w-8 h-8 border-4 border-[#E8E2D5] border-t-[#00A0E3] rounded-full animate-spin" />
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Heart className="w-16 h-16 text-[#1A1612]/20 mx-auto mb-4" />
          <h2 className="font-heading text-xl font-bold text-[#1A1612] mb-2">No Mentor Profile Found</h2>
          <p className="text-sm text-[#1A1612]/60 mb-6">
            You need a mentor profile to access this dashboard. Register as a mentor to get started.
          </p>
          <Link
            to="/register-mentor"
            className="inline-flex items-center gap-2 bg-[#00A0E3] text-[#F9F7F2] px-6 py-3 rounded-md font-medium hover:bg-[#0086C0] transition-colors"
          >
            <Heart className="w-4 h-4" /> Register as Mentor
          </Link>
        </div>
      </div>
    );
  }

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const uniqueBusinesses = new Set(bookings.map((b) => b.customer_email)).size;

  const stats = [
    { label: "Total Sessions", value: bookings.length, icon: Calendar, color: "text-[#00A0E3]" },
    { label: "Pending Requests", value: pendingCount, icon: AlertCircle, color: "text-[#00A0E3]" },
    { label: "Confirmed", value: confirmedCount, icon: CheckCircle, color: "text-[#2D4F1E]" },
    { label: "Businesses Mentored", value: uniqueBusinesses, icon: Users, color: "text-[#2D4F1E]" },
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <div className="bg-[#0D1B2A] text-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-[#00A0E3]" />
            <div>
              <h1 className="font-heading text-lg font-bold">Mentor Dashboard</h1>
              <p className="text-xs text-[#F9F7F2]/60">{mentor.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs text-[#F9F7F2]/70 hover:text-[#00A0E3] transition-colors">View Site</Link>
            <button
              onClick={() => logout()}
              className="flex items-center gap-1 text-xs text-[#F9F7F2]/70 hover:text-[#00A0E3] transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white border border-[#E8E2D5] rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={mentor.image || "https://media.base44.com/images/public/6a4f83dffc6191b5376288ac/d8a6b9149_generated_b70b6a63.png"}
              alt={mentor.name}
              className="w-full md:w-40 h-40 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h2 className="font-heading text-2xl font-bold text-[#1A1612] mb-1">{mentor.name}</h2>
              {mentor.expertise_areas?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {mentor.expertise_areas.map((area, i) => (
                    <span key={i} className="text-xs bg-[#F0EBE0] text-[#1A1612]/70 px-2 py-0.5 rounded-full">{area}</span>
                  ))}
                </div>
              )}
              {mentor.bio && <p className="text-sm text-[#1A1612]/70">{mentor.bio}</p>}
              <div className="mt-3 flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  mentor.availability === "Available" ? "bg-[#2D4F1E]/10 text-[#2D4F1E]" :
                  mentor.availability === "Limited" ? "bg-[#00A0E3]/10 text-[#00A0E3]" :
                  "bg-[#1A1612]/10 text-[#1A1612]/50"
                }`}>
                  {mentor.availability || "Available"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white border border-[#E8E2D5] rounded-lg p-5">
                <Icon className={`w-6 h-6 ${s.color} mb-2`} />
                <p className="font-heading text-2xl font-bold text-[#1A1612]">{s.value}</p>
                <p className="text-xs text-[#1A1612]/60">{s.label}</p>
              </div>
            );
          })}
        </div>

        <h2 className="font-heading text-xl font-bold text-[#1A1612] mb-4">Assigned Business Sessions</h2>

        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const config = statusConfig[booking.status] || statusConfig.pending;
              const StatusIcon = config.icon;
              return (
                <div key={booking.id} className="bg-white border border-[#E8E2D5] rounded-lg p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-[#1A1612]">{booking.customer_name}</h3>
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${config.bg} ${config.color}`}>
                          <StatusIcon className="w-3 h-3" /> {config.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-[#1A1612]/60">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> {booking.meeting_date}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {booking.meeting_time}
                        </span>
                        <span>{booking.customer_email}</span>
                      </div>
                      {booking.topic && (
                        <p className="text-sm text-[#1A1612]/70 mt-2 bg-[#F0EBE0]/50 rounded-md p-2">
                          <span className="font-medium">Topic: </span>{booking.topic}
                        </p>
                      )}
                    </div>
                    {booking.status === "pending" && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => updateBookingStatus(booking.id, "confirmed")}
                          disabled={updating === booking.id}
                          className="flex items-center gap-1 bg-[#2D4F1E] text-[#F9F7F2] px-3 py-2 rounded-md text-xs font-medium hover:bg-[#2D4F1E]/90 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" /> Confirm
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking.id, "cancelled")}
                          disabled={updating === booking.id}
                          className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-2 rounded-md text-xs font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-[#E8E2D5] rounded-lg">
            <Users className="w-12 h-12 text-[#1A1612]/20 mx-auto mb-3" />
            <p className="text-[#1A1612]/50">No booking requests yet. Businesses that book sessions with you will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}