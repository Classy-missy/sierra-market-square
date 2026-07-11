import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, Check, Store } from "lucide-react";
import { BUSINESS_TYPES, SECTORS, REGIONS } from "@/lib/constants";

export default function VendorForm({ onCreated }) {
  const [form, setForm] = useState({
    business_name: "",
    business_type: "SME",
    sector: "Retail & Trading",
    region: "Western Area",
    description: "",
    location: "",
    phone: "",
    email: "",
    whatsapp: "",
    website: "",
    owner_name: "",
    image: "",
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      handleChange("image", file_url);
    } catch {
      setError("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.business_name || !form.business_type) {
      setError("Business name and type are required.");
      return;
    }
    setLoading(true);
    try {
      await base44.entities.Vendor.create(form);
      setSuccess(true);
      setForm({
        business_name: "",
        business_type: "SME",
        sector: "Retail & Trading",
        region: "Western Area",
        description: "",
        location: "",
        phone: "",
        email: "",
        whatsapp: "",
        website: "",
        owner_name: "",
        image: "",
      });
      onCreated?.();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to create vendor.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "h-11 border-[#E8E2D5]";
  const selectClass = "w-full h-11 px-3 rounded-md border border-[#E8E2D5] bg-white text-sm text-[#1A1612]";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> Vendor created successfully!
        </div>
      )}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[#1A1612]">Business Name *</Label>
          <Input value={form.business_name} onChange={(e) => handleChange("business_name", e.target.value)} className={inputClass} placeholder="e.g. Freetown Garri Processors" required />
        </div>
        <div className="space-y-2">
          <Label className="text-[#1A1612]">Business Type *</Label>
          <select value={form.business_type} onChange={(e) => handleChange("business_type", e.target.value)} className={selectClass}>
            {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[#1A1612]">Category</Label>
          <select value={form.sector} onChange={(e) => handleChange("sector", e.target.value)} className={selectClass}>
            {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-[#1A1612]">Region</Label>
          <select value={form.region} onChange={(e) => handleChange("region", e.target.value)} className={selectClass}>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[#1A1612]">Description</Label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
          placeholder="Describe the business..."
          className="w-full px-3 py-2 rounded-md border border-[#E8E2D5] bg-white text-sm text-[#1A1612] focus:outline-none focus:ring-2 focus:ring-[#00A0E3]/30 resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[#1A1612]">Business Image</Label>
        <div className="flex items-center gap-3">
          {form.image ? (
            <img src={form.image} alt="Preview" className="w-16 h-16 rounded-md object-cover border border-[#E8E2D5]" />
          ) : (
            <div className="w-16 h-16 rounded-md bg-[#F0EBE0] flex items-center justify-center">
              <Store className="w-6 h-6 text-[#1A1612]/40" />
            </div>
          )}
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#F0EBE0] rounded-md text-sm font-medium text-[#1A1612] hover:bg-[#E8E2D5] transition-colors">
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : form.image ? "Change" : "Upload Image"}
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[#1A1612]">Owner Name</Label>
          <Input value={form.owner_name} onChange={(e) => handleChange("owner_name", e.target.value)} className={inputClass} placeholder="e.g. Aminata Kamara" />
        </div>
        <div className="space-y-2">
          <Label className="text-[#1A1612]">Location</Label>
          <Input value={form.location} onChange={(e) => handleChange("location", e.target.value)} className={inputClass} placeholder="e.g. Freetown, Western Area" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[#1A1612]">Phone</Label>
          <Input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} className={inputClass} placeholder="+232 76 123 456" />
        </div>
        <div className="space-y-2">
          <Label className="text-[#1A1612]">WhatsApp Number</Label>
          <Input value={form.whatsapp} onChange={(e) => handleChange("whatsapp", e.target.value)} className={inputClass} placeholder="+232 76 123 456" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[#1A1612]">Email</Label>
          <Input value={form.email} onChange={(e) => handleChange("email", e.target.value)} type="email" className={inputClass} placeholder="business@example.com" />
        </div>
        <div className="space-y-2">
          <Label className="text-[#1A1612]">Website</Label>
          <Input value={form.website} onChange={(e) => handleChange("website", e.target.value)} className={inputClass} placeholder="www.example.com" />
        </div>
      </div>

      <Button type="submit" className="w-full h-11 bg-[#00A0E3] hover:bg-[#0086C0] font-medium" disabled={loading || uploading}>
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...</> : "Add Vendor"}
      </Button>
    </form>
  );
}