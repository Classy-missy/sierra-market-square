import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, Check, Package } from "lucide-react";

const productCategories = ["Tubers", "Vegetables", "Grains", "Fruits", "Spices", "Oils"];
const businessTypes = ["Agro-processing", "Retail", "Logistics", "Farming", "Catering"];

export default function ProductForm({ onCreated }) {
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "Vegetables",
    price: "",
    unit: "per bag",
    description: "",
    vendor_name: "",
    business_type: "Retail",
    image: "",
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    base44.entities.Vendor.list().then(setVendors).catch(() => {});
  }, []);

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

  const handleVendorChange = (vendorName) => {
    const vendor = vendors.find((v) => v.business_name === vendorName);
    handleChange("vendor_name", vendorName);
    if (vendor) handleChange("business_type", vendor.business_type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.category || !form.price) {
      setError("Name, category, and price are required.");
      return;
    }
    setLoading(true);
    try {
      await base44.entities.Product.create({ ...form, price: Number(form.price) });
      setSuccess(true);
      setForm({
        name: "",
        category: "Vegetables",
        price: "",
        unit: "per bag",
        description: "",
        vendor_name: "",
        business_type: "Retail",
        image: "",
      });
      onCreated?.();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "h-11 border-[#E8E2D5]";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> Product created successfully!
        </div>
      )}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[#1A1612]">Product Name *</Label>
          <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} className={inputClass} placeholder="e.g. White Garri" required />
        </div>
        <div className="space-y-2">
          <Label className="text-[#1A1612]">Product Category *</Label>
          <select
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full h-11 px-3 rounded-md border border-[#E8E2D5] bg-white text-sm text-[#1A1612]"
          >
            {productCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[#1A1612]">Product Image</Label>
        <div className="flex items-center gap-3">
          {form.image ? (
            <img src={form.image} alt="Preview" className="w-16 h-16 rounded-md object-cover border border-[#E8E2D5]" />
          ) : (
            <div className="w-16 h-16 rounded-md bg-[#F0EBE0] flex items-center justify-center">
              <Package className="w-6 h-6 text-[#1A1612]/40" />
            </div>
          )}
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#F0EBE0] rounded-md text-sm font-medium text-[#1A1612] hover:bg-[#E8E2D5] transition-colors">
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : form.image ? "Change" : "Upload Image"}
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-[#1A1612]">Price (NLe) *</Label>
          <Input value={form.price} onChange={(e) => handleChange("price", e.target.value)} type="number" step="0.01" className={inputClass} placeholder="25.00" required />
        </div>
        <div className="space-y-2">
          <Label className="text-[#1A1612]">Unit</Label>
          <Input value={form.unit} onChange={(e) => handleChange("unit", e.target.value)} className={inputClass} placeholder="per 5kg bag" />
        </div>
        <div className="space-y-2">
          <Label className="text-[#1A1612]">Business Type</Label>
          <select
            value={form.business_type}
            onChange={(e) => handleChange("business_type", e.target.value)}
            className="w-full h-11 px-3 rounded-md border border-[#E8E2D5] bg-white text-sm text-[#1A1612]"
          >
            {businessTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[#1A1612]">Vendor</Label>
        <select
          value={form.vendor_name}
          onChange={(e) => handleVendorChange(e.target.value)}
          className="w-full h-11 px-3 rounded-md border border-[#E8E2D5] bg-white text-sm text-[#1A1612]"
        >
          <option value="">— Select vendor (optional) —</option>
          {vendors.map((v) => <option key={v.id} value={v.business_name}>{v.business_name}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        <Label className="text-[#1A1612]">Description</Label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
          placeholder="Describe the product..."
          className="w-full px-3 py-2 rounded-md border border-[#E8E2D5] bg-white text-sm text-[#1A1612] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/30 resize-none"
        />
      </div>

      <Button type="submit" className="w-full h-11 bg-[#D95D39] hover:bg-[#C04E2E] font-medium" disabled={loading || uploading}>
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...</> : "Add Product"}
      </Button>
    </form>
  );
}