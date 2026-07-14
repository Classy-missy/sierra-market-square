import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Package, Plus, Save, Loader2, LogOut, Pencil, Clock } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import VendorProfileEdit from "@/components/VendorProfileEdit";

export default function VendorDashboard() {
  const { user, logout } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [saving, setSaving] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "Vegetables",
    price: "",
    stock: "",
    unit: "per bag",
    description: "",
    image: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    base44.entities.Vendor.filter({ created_by_id: user.id })
      .then(async (vendors) => {
        // Prefer the vendor whose email matches the user's account email
        // (their personal profile). Admins create seed data under their own
        // created_by_id, so created_by_id alone would pick seed data.
        const myVendor = vendors.find((v) => v.email === user.email) || vendors[0];
        if (myVendor) {
          setVendor(myVendor);
          const prods = await base44.entities.Product.filter({ vendor_name: myVendor.business_name });
          setProducts(prods);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.name || !form.price) {
      setFormError("Product name and price are required.");
      return;
    }
    setFormLoading(true);
    try {
      await base44.entities.Product.create({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        vendor_name: vendor.business_name,
        business_type: vendor.business_type,
        sector: vendor.sector,
        region: vendor.region,
      });
      const updated = await base44.entities.Product.filter({ vendor_name: vendor.business_name });
      setProducts(updated);
      setForm({ name: "", category: "Vegetables", price: "", stock: "", unit: "per bag", description: "", image: "" });
      setShowForm(false);
    } catch (err) {
      setFormError(err.message || "Failed to add product.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleSaveEdit = async (productId) => {
    setSaving(productId);
    try {
      const vals = editValues[productId];
      await base44.entities.Product.update(productId, {
        price: Number(vals.price),
        stock: Number(vals.stock),
      });
      const updated = await base44.entities.Product.filter({ vendor_name: vendor.business_name });
      setProducts(updated);
      setEditValues((p) => {
        const copy = { ...p };
        delete copy[productId];
        return copy;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  const startEdit = (product) => {
    setEditValues((p) => ({
      ...p,
      [product.id]: { price: product.price, stock: product.stock || 0 },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
        <Loader2 className="w-8 h-8 text-[#00A0E3] animate-spin" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Store className="w-16 h-16 text-[#1A1612]/20 mx-auto mb-4" />
          <h2 className="font-heading text-xl font-bold text-[#1A1612] mb-2">No Vendor Profile Found</h2>
          <p className="text-sm text-[#1A1612]/60 mb-6">
            You need a vendor profile to access this dashboard. Register your business to get started.
          </p>
          <Link
            to="/register-vendor"
            className="inline-flex items-center gap-2 bg-[#00A0E3] text-[#F9F7F2] px-6 py-3 rounded-md font-medium hover:bg-[#0086C0] transition-colors"
          >
            <Store className="w-4 h-4" /> Register as Vendor
          </Link>
        </div>
      </div>
    );
  }

  if (!vendor.approved) {
    return (
      <div className="min-h-screen bg-[#F9F7F2]">
        <div className="bg-[#0D1B2A] text-[#F9F7F2]">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Store className="w-5 h-5 text-[#00A0E3]" />
              <div>
                <h1 className="font-heading text-lg font-bold">Vendor Dashboard</h1>
                <p className="text-xs text-[#F9F7F2]/60">{vendor.business_name}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="flex items-center gap-1 text-xs text-[#F9F7F2]/70 hover:text-[#00A0E3] transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00A0E3]/10 mb-4">
            <Clock className="w-8 h-8 text-[#00A0E3]" />
          </div>
          <h2 className="font-heading text-xl font-bold text-[#1A1612] mb-2">Pending Admin Approval</h2>
          <p className="text-sm text-[#1A1612]/60 mb-6">
            Thank you for registering your business. An administrator needs to approve your vendor profile before you can access your dashboard and start listing products.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#00A0E3] text-[#F9F7F2] px-6 py-3 rounded-md font-medium hover:bg-[#0086C0] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <div className="bg-[#0D1B2A] text-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Store className="w-5 h-5 text-[#00A0E3]" />
            <div>
              <h1 className="font-heading text-lg font-bold">Vendor Dashboard</h1>
              <Link to={`/vendors/${vendor.id}`} className="text-xs text-[#F9F7F2]/60 hover:text-[#00A0E3] transition-colors">
                {vendor.business_name}
              </Link>
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
        {/* Business Profile */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-[#00A0E3]" />
            <h2 className="font-heading text-xl font-bold text-[#1A1612]">Business Profile</h2>
          </div>
          {!editingProfile && (
            <button
              onClick={() => setEditingProfile(true)}
              className="flex items-center gap-2 bg-[#00A0E3] text-[#F9F7F2] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#0086C0] transition-colors"
            >
              <Pencil className="w-4 h-4" /> Edit Profile
            </button>
          )}
        </div>

        {editingProfile ? (
          <div className="mb-8">
            <VendorProfileEdit
              vendor={vendor}
              onSaved={(updated) => {
                setVendor(updated);
                setEditingProfile(false);
              }}
              onCancel={() => setEditingProfile(false)}
            />
          </div>
        ) : (
          <div className="bg-white border border-[#E8E2D5] rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={vendor.image || "https://media.base44.com/images/public/6a4f83dffc6191b5376288ac/e30aa9e2a_generated_140002be.png"}
                alt={vendor.business_name}
                className="w-full md:w-40 h-40 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#00A0E3] text-[#F9F7F2] text-xs font-medium px-2 py-1 rounded">{vendor.business_type}</span>
                  <span className="bg-[#F0EBE0] text-[#1A1612]/70 text-xs font-medium px-2 py-1 rounded">{vendor.sector}</span>
                </div>
                <h2 className="font-heading text-2xl font-bold text-[#1A1612] mb-1">{vendor.business_name}</h2>
                {vendor.owner_name && <p className="text-sm text-[#1A1612]/60">Owned by {vendor.owner_name}</p>}
                {vendor.description && <p className="text-sm text-[#1A1612]/70 mt-2">{vendor.description}</p>}
                <div className="flex gap-4 mt-3 text-xs text-[#1A1612]/60">
                  <span>{vendor.region}</span>
                  {vendor.phone && <span>{vendor.phone}</span>}
                  {vendor.email && <span>{vendor.email}</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#00A0E3]" />
            <h2 className="font-heading text-xl font-bold text-[#1A1612]">My Products</h2>
            <span className="text-sm text-[#1A1612]/50">({products.length})</span>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-[#00A0E3] text-[#F9F7F2] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#0086C0] transition-colors"
          >
            <Plus className="w-4 h-4" /> {showForm ? "Cancel" : "Add Product"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-[#E8E2D5] rounded-lg p-6 mb-8">
            {formError && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">{formError}</div>}
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#1A1612]">Product Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border-[#E8E2D5]" placeholder="e.g. Fresh Cassava" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[#1A1612]">Category</Label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full h-9 rounded-md border border-[#E8E2D5] bg-transparent px-3 text-sm"
                >
                  {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[#1A1612]">Price (NLe) *</Label>
                <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border-[#E8E2D5]" placeholder="0.00" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[#1A1612]">Stock Quantity</Label>
                <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border-[#E8E2D5]" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#1A1612]">Unit</Label>
                <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="border-[#E8E2D5]" placeholder="per bag" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-[#1A1612]">Description</Label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full rounded-md border border-[#E8E2D5] bg-transparent px-3 py-2 text-sm"
                  placeholder="Brief product description"
                />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="bg-[#00A0E3] hover:bg-[#0086C0]" disabled={formLoading}>
                  {formLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...</> : "Add Product"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {products.length > 0 ? (
          <div className="bg-white border border-[#E8E2D5] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F0EBE0] text-[#1A1612]/70">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Product</th>
                    <th className="text-left px-4 py-3 font-medium">Category</th>
                    <th className="text-left px-4 py-3 font-medium">Price (NLe)</th>
                    <th className="text-left px-4 py-3 font-medium">Stock</th>
                    <th className="text-left px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const isEditing = !!editValues[p.id];
                    return (
                      <tr key={p.id} className="border-t border-[#E8E2D5] hover:bg-[#F9F7F2]">
                        <td className="px-4 py-3 font-medium text-[#1A1612]">{p.name}</td>
                        <td className="px-4 py-3 text-[#1A1612]/70">{p.category}</td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <Input
                              type="number"
                              step="0.01"
                              value={editValues[p.id].price}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  [p.id]: { ...editValues[p.id], price: e.target.value },
                                })
                              }
                              className="h-8 w-24 border-[#E8E2D5]"
                            />
                          ) : (
                            <span className="font-bold text-[#00A0E3]">{Number(p.price || 0).toFixed(2)}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <Input
                              type="number"
                              value={editValues[p.id].stock}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  [p.id]: { ...editValues[p.id], stock: e.target.value },
                                })
                              }
                              className="h-8 w-20 border-[#E8E2D5]"
                            />
                          ) : (
                            <span className="text-[#1A1612]/70">{p.stock ?? 0}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <button
                              onClick={() => handleSaveEdit(p.id)}
                              disabled={saving === p.id}
                              className="flex items-center gap-1 text-[#00A0E3] hover:underline text-sm font-medium"
                            >
                              {saving === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => startEdit(p)}
                              className="text-[#00A0E3] hover:underline text-sm font-medium"
                            >
                              Edit Stock/Price
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-[#E8E2D5] rounded-lg">
            <Package className="w-12 h-12 text-[#1A1612]/20 mx-auto mb-3" />
            <p className="text-[#1A1612]/50 mb-4">No products listed yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 text-[#00A0E3] hover:underline font-medium text-sm"
            >
              <Plus className="w-4 h-4" /> Add your first product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}