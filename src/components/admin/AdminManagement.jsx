import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, UserPlus, Loader2, CheckCircle, XCircle } from "lucide-react";

export default function AdminManagement({ users, onInvited }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const admins = (users || []).filter((u) => u.role === "admin");

  const handleInvite = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter an email address.");
      return;
    }

    setLoading(true);
    try {
      await base44.users.inviteUser(trimmed, "admin");
      setSuccess(`Invitation sent to ${trimmed}.`);
      setEmail("");
      if (onInvited) onInvited();
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to send invitation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border border-[#E8E2D5] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-1">
          <UserPlus className="w-5 h-5 text-[#00A0E3]" />
          <h3 className="font-heading text-lg font-bold text-[#1A1612]">Invite a New Admin</h3>
        </div>
        <p className="text-sm text-[#1A1612]/60 mb-5">
          Send an email invitation to grant someone administrator access. They'll receive a link to set up their account.
        </p>

        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="admin-email">Admin Email Address</Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading} className="bg-[#00A0E3] hover:bg-[#0086C0] text-[#F9F7F2]">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Send Invite
              </>
            )}
          </Button>
        </form>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-sm text-red-600">
            <XCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 flex items-center gap-2 text-sm text-[#2D4F1E]">
            <CheckCircle className="w-4 h-4" />
            {success}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-[#00A0E3]" />
          <h3 className="font-heading text-lg font-bold text-[#1A1612]">Current Admins</h3>
        </div>
        <div className="bg-white border border-[#E8E2D5] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F0EBE0] text-[#1A1612]/70">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-[#1A1612]/50">
                      No admins found.
                    </td>
                  </tr>
                ) : (
                  admins.map((a) => (
                    <tr key={a.id} className="border-t border-[#E8E2D5] hover:bg-[#F9F7F2]">
                      <td className="px-4 py-3 font-medium text-[#1A1612]">{a.full_name || "—"}</td>
                      <td className="px-4 py-3 text-[#1A1612]/70">{a.email}</td>
                      <td className="px-4 py-3 text-[#1A1612]/70">
                        {a.created_date ? new Date(a.created_date).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}