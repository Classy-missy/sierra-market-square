import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import VendorForm from "@/components/admin/VendorForm";
import ProductForm from "@/components/admin/ProductForm";
import { Store, Package, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function AdminDashboard() {
  const [tab, setTab] = useState("vendors");
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  const loadData = async () => {
    try {
      const [v, p] = await Promise.all([
        base44.entities.Vendor.list(),
        base44.entities.Product.list(),
      ]);
      setVendors(v);
      setProducts(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const tabs = [
    { id: "vendors", label: "Vendors", icon: Store },
    { id: "products", label: "Products", icon: Package },
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      {/* Admin header */}
      <div className="bg-[#1A1612] text-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-[#00A0E3]" />
            <div>
              <h1 className="font-heading text-lg font-bold">Admin Dashboard</h1>
              <p className="text-xs text-[#F9F7F2]/60">{user?.email || "Administrator"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs text-[#F9F7F2]/70 hover:text-[#00A0E3] transition-colors">
              View Site
            </Link>
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
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-[#E8E2D5] rounded-lg p-5">
            <Store className="w-6 h-6 text-[#00A0E3] mb-2" />
            <p className="font-heading text-2xl font-bold text-[#1A1612]">{loading ? "—" : vendors.length}</p>
            <p className="text-xs text-[#1A1612]/60">Total Vendors</p>
          </div>
          <div className="bg-white border border-[#E8E2D5] rounded-lg p-5">
            <Package className="w-6 h-6 text-[#2D4F1E] mb-2" />
            <p className="font-heading text-2xl font-bold text-[#1A1612]">{loading ? "—" : products.length}</p>
            <p className="text-xs text-[#1A1612]/60">Total Products</p>
          </div>
          <div className="bg-white border border-[#E8E2D5] rounded-lg p-5 hidden sm:block">
            <LayoutDashboard className="w-6 h-6 text-[#00A0E3] mb-2" />
            <p className="font-heading text-2xl font-bold text-[#1A1612]">Admin</p>
            <p className="text-xs text-[#1A1612]/60">Full Access</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form panel */}
          <div>
            <div className="flex gap-2 mb-6">
              {tabs.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      tab === t.id
                        ? "bg-[#00A0E3] text-[#F9F7F2]"
                        : "bg-white text-[#1A1612]/70 border border-[#E8E2D5] hover:bg-[#F0EBE0]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    Add {t.label.slice(0, -1)}
                  </button>
                );
              })}
            </div>

            <div className="bg-white border border-[#E8E2D5] rounded-lg p-6">
              {tab === "vendors" ? (
                <VendorForm onCreated={loadData} />
              ) : (
                <ProductForm onCreated={loadData} />
              )}
            </div>
          </div>

          {/* Records panel */}
          <div>
            <h2 className="font-heading text-xl font-bold text-[#1A1612] mb-6">
              {tab === "vendors" ? "Current Vendors" : "Current Products"}
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white border border-[#E8E2D5] rounded-lg h-20 animate-pulse" />
                ))
              ) : tab === "vendors" ? (
                vendors.map((v) => (
                  <div key={v.id} className="bg-white border border-[#E8E2D5] rounded-lg p-4 flex items-center gap-3">
                    <img
                      src={v.image || "https://media.base44.com/images/public/6a4f83dffc6191b5376288ac/e30aa9e2a_generated_140002be.png"}
                      alt={v.business_name}
                      className="w-14 h-14 rounded-md object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm text-[#1A1612] truncate">{v.business_name}</h3>
                      <p className="text-xs text-[#1A1612]/60 truncate">{v.business_type} · {v.location || "No location"}</p>
                    </div>
                    <span className="text-xs bg-[#F0EBE0] text-[#1A1612]/70 px-2 py-1 rounded-full flex-shrink-0">
                      {v.owner_name || "—"}
                    </span>
                  </div>
                ))
              ) : (
                products.map((p) => (
                  <div key={p.id} className="bg-white border border-[#E8E2D5] rounded-lg p-4 flex items-center gap-3">
                    <img
                      src={p.image || "https://media.base44.com/images/public/6a4f83dffc6191b5376288ac/904b5eb06_generated_313fffab.png"}
                      alt={p.name}
                      className="w-14 h-14 rounded-md object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm text-[#1A1612] truncate">{p.name}</h3>
                      <p className="text-xs text-[#1A1612]/60 truncate">{p.category} · {p.vendor_name || "No vendor"}</p>
                    </div>
                    <span className="font-heading font-bold text-sm text-[#00A0E3] flex-shrink-0">
                      NLe {Number(p.price || 0).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}