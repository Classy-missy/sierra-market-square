import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Calendar, Clock, Loader2, Check, User, Mail, MessageSquare } from "lucide-react";

export default function BookingModal({ mentor, isOpen, onClose }) {
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    meeting_date: "",
    meeting_time: "10:00",
    topic: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const buildCalendarLink = () => {
    const start = new Date(`${form.meeting_date}T${form.meeting_time}`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const fmt = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const title = `Mentoring Session with ${mentor.name}`;
    const details = `Topic: ${form.topic || "General mentoring"}\nBooked by: ${form.customer_name} (${form.customer_email})`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent(details)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.customer_name || !form.customer_email || !form.meeting_date) {
      setError("Please fill in your name, email, and a preferred date.");
      return;
    }
    setLoading(true);
    try {
      await base44.entities.Booking.create({
        mentor_id: mentor.id,
        mentor_name: mentor.name,
        mentor_email: mentor.email || "",
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        meeting_date: form.meeting_date,
        meeting_time: form.meeting_time,
        topic: form.topic,
        status: "pending",
      });

      if (mentor.email) {
        try {
          await base44.integrations.Core.SendEmail({
            to: mentor.email,
            subject: `New Mentoring Booking from ${form.customer_name}`,
            body: `Hi ${mentor.name},\n\nYou have a new mentoring session request:\n\n- Entrepreneur: ${form.customer_name}\n- Email: ${form.customer_email}\n- Date: ${form.meeting_date}\n- Time: ${form.meeting_time}\n- Topic: ${form.topic || "General mentoring"}\n\nPlease confirm or reach out to them directly.\n\nSierra Market Glow`,
          });
        } catch (e) {
          console.error("Email failed", e);
        }
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError("");
    setForm({ customer_name: "", customer_email: "", meeting_date: "", meeting_time: "10:00", topic: "" });
    onClose();
  };

  const inputClass = "h-11 border-[#E8E2D5]";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1A1612]/60" onClick={handleClose} />
      <div className="relative bg-[#F9F7F2] rounded-lg border border-[#E8E2D5] shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#F9F7F2] border-b border-[#E8E2D5] px-6 py-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-[#1A1612]">Book a Session</h2>
          <button onClick={handleClose} className="text-[#1A1612]/50 hover:text-[#1A1612]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#00A0E3]/10 mb-4">
                <Check className="w-7 h-7 text-[#00A0E3]" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#1A1612] mb-2">Booking Requested!</h3>
              <p className="text-sm text-[#1A1612]/60 mb-6">
                Your session with {mentor.name} has been requested for {form.meeting_date} at {form.meeting_time}.
                {mentor.email ? " They'll receive an email notification." : ""}
              </p>
              <a
                href={buildCalendarLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#00A0E3] text-[#F9F7F2] px-6 py-3 rounded-md font-medium hover:bg-[#0086C0] transition-colors mb-3"
              >
                <Calendar className="w-4 h-4" /> Add to Google Calendar
              </a>
              <div>
                <Button variant="outline" onClick={handleClose} className="border-[#E8E2D5]">
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-5 p-3 bg-[#F0EBE0] rounded-md">
                <img
                  src={mentor.image || "https://media.base44.com/images/public/6a4f83dffc6191b5376288ac/d8a6b9149_generated_b70b6a63.png"}
                  alt={mentor.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm text-[#1A1612]">{mentor.name}</p>
                  <p className="text-xs text-[#1A1612]/60">{mentor.expertise_areas?.[0] || "Mentor"}</p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[#1A1612]">Your Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1612]/40" />
                    <Input value={form.customer_name} onChange={(e) => handleChange("customer_name", e.target.value)} className={`pl-10 ${inputClass}`} placeholder="Aminata Kamara" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#1A1612]">Your Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1612]/40" />
                    <Input type="email" value={form.customer_email} onChange={(e) => handleChange("customer_email", e.target.value)} className={`pl-10 ${inputClass}`} placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-[#1A1612]">Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1612]/40 z-10" />
                      <Input type="date" value={form.meeting_date} onChange={(e) => handleChange("meeting_date", e.target.value)} className={`pl-10 ${inputClass}`} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#1A1612]">Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1612]/40 z-10" />
                      <Input type="time" value={form.meeting_time} onChange={(e) => handleChange("meeting_time", e.target.value)} className={`pl-10 ${inputClass}`} required />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#1A1612]">Topic (optional)</Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-[#1A1612]/40" />
                    <textarea
                      value={form.topic}
                      onChange={(e) => handleChange("topic", e.target.value)}
                      rows={3}
                      placeholder="What would you like to discuss?"
                      className="w-full pl-10 pr-3 py-2 rounded-md border border-[#E8E2D5] bg-white text-sm text-[#1A1612] focus:outline-none focus:ring-2 focus:ring-[#00A0E3]/30 resize-none"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 bg-[#00A0E3] hover:bg-[#0086C0] font-medium" disabled={loading}>
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Booking...</> : <><Calendar className="w-4 h-4 mr-2" /> Request Session</>}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}