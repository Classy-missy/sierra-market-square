import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, X, Upload } from "lucide-react";
import { BUSINESS_TYPES, SECTORS, REGIONS } from "@/lib/constants";

export default function VendorProfileEdit({ vendor, onSaved, onCancel }) {
  const [form, setForm] = useState({
    business_name: vendor.business_name || "",
    business_type: vendor.business_type || "SME",
    sector: vendor.sector || "Retail & Trading",
    region: vendor.region || "Western Area",
    description: vendor.description || "",
    image: vendor.image || "",
    location: vendor.location || "",
    phone: vendor.phone || "",
    email: vendor.email || "",
    website: vendor.website || "",
    whatsapp: vendor.whatsapp || "",
    owner_name: vendor.owner_name || "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm((p) => ({ ...p, image: file_url }));
    } catch (err) {
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.business_name.trim()) {
      setError("Business name is required.");
      return;
    }
    setSaving(true);
    try {
      const updated = await base44.entities.Vendor.update(vendor.id, form);
      onSaved?.(updated);
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "border-[#E8E2D5] focus:border-[#00A0E3]";
  const labelClass = "text-[#1A1612]";

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E8E2D5] rounded-lg p-6 space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
      )}

      {/* Profile Image */}
      <div className="flex items-center gap-4">
        <img
          src={form.image || "https://media.base44.com/images/public/6a4f83dffc6191b5376288ac/e30aa9e2a_generated_140002be.png"}
          alt="Business"
          className="w-20 h-20 rounded-lg object-cover border border-[#E8E2D5]"
        />
        <div>
          <Label className={labelClass}>Profile Image</Label>
          <p className="text-xs text-[#1A1612]/50 mb-2">Update your business photo</p>
          <label className="inline-flex items-center gap-2 px-3 py-2 bg-[#F0EBE0] rounded-md text-sm font-medium text-[#1A1612] hover:bg-[#E8E2D5] cursor-pointer transition-colors">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading..." : "Upload Image"}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className={labelClass}>Business Name *</Label>
          <Input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} className={inputClass} required />
        </div>
        <div className="space-y-2">
          <Label className={labelClass}>Owner Name</Label>
          <Input value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} className={inputClass} />
        </div>
        <div className="space-y-2">
          <Label className={labelClass}>Business Type</Label>
          <select
            value={form.business_type}
            onChange={(e) => setForm({ ...form, business_type: e.target.value })}
            className="w-full h-9 rounded-md border border-[#E8E2D5] bg-transparent px-3 text-sm"
          >
            {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label className={labelClass}>Sector</Label>
          <select
            value={form.sector}
            onChange={(e) => setForm({ ...form, sector: e.target.value })}
            className="w-full h-9 rounded-md border border-[#E8E2D5] bg-transparent px-3 text-sm"
          >
            {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label className={labelClass}>Region</Label>
          <select
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
            className="w-full h-9 rounded-md border border-[#E8E2D5] bg-transparent px-3 text-sm"
          >
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label className={labelClass}>Location</Label>
          <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} placeholder="City, town, or address" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className={labelClass}>Description</Label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full rounded-md border border-[#E8E2D5] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A0E3]/30"
          placeholder="Describe your business..."
        />
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="font-heading text-sm font-bold text-[#1A1612] mb-3">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className={labelClass}>Phone</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+232 ..." />
          </div>
          <div className="space-y-2">
            <Label className={labelClass}>WhatsApp</Label>
            <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className={inputClass} placeholder="+232 ..." />
          </div>
          <div className="space-y-2">
            <Label className={labelClass}>Email</Label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="business@example.com" />
          </div>
          <div className="space-y-2">
            <Label className={labelClass}>Website</Label>
            <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className={inputClass} placeholder="https://..." />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" className="bg-[#00A0E3] hover:bg-[#0086C0]" disabled={saving || uploading}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          <X className="w-4 h-4 mr-2" /> Cancel
        </Button>
      </div>
    </form>
  );
}