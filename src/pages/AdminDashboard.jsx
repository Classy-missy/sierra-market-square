import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import VendorForm from "@/components/admin/VendorForm";
import ProductForm from "@/components/admin/ProductForm";
import { exportToCSV } from "@/lib/exportUtils";
import { Store, Package, Users, Heart, LogOut, LayoutDashboard, Download, Plus, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function AdminDashboard() {
  const [tab, setTab] = useState("vendors");
  const [addTab, setAddTab] = useState("vendors");
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);
  const { user, logout } = useAuth();

  const loadData = async () => {
    try {
      const [v, p, m, u] = await Promise.all([
        base44.entities.Vendor.list(),
        base44.entities.Product.list(),
        base44.entities.Mentor.list(),
        base44.entities.User.list(),
      ]);
      setVendors(v);
      setProducts(p);
      setMentors(m);
      setUsers(u);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = [
    { label: "Total Vendors", value: loading ? "—" : vendors.length, icon: Store, color: "text-[#00A0E3]" },
    { label: "Total Products", value: loading ? "—" : products.length, icon: Package, color: "text-[#2D4F1E]" },
    { label: "Total Mentors", value: loading ? "—" : mentors.length, icon: Heart, color: "text-[#00A0E3]" },
    { label: "Total Customers", value: loading ? "—" : users.length, icon: Users, color: "text-[#2D4F1E]" },
  ];

  const tabs = [
    { id: "vendors", label: "Vendors", icon: Store },
    { id: "products", label: "Products", icon: Package },
    { id: "customers", label: "Customers", icon: Users },
    { id: "mentors", label: "Mentors", icon: Heart },
    { id: "add", label: "Add New", icon: Plus },
  ];

  const exportConfigs = {
    vendors: {
      filename: "vendors_report.csv",
      columns: [
        { label: "Business Name", key: "business_name" },
        { label: "Business Type", key: "business_type" },
        { label: "Sector", key: "sector" },
        { label: "Region", key: "region" },
        { label: "Owner", key: "owner_name" },
        { label: "Location", key: "location" },
        { label: "Phone", key: "phone" },
        { label: "Email", key: "email" },
      ],
      data: vendors,
    },
    products: {
      filename: "products_report.csv",
      columns: [
        { label: "Product Name", key: "name" },
        { label: "Category", key: "category" },
        { label: "Price (NLe)", key: "price" },
        { label: "Stock", key: "stock" },
        { label: "Unit", key: "unit" },
        { label: "Vendor", key: "vendor_name" },
        { label: "Business Type", key: "business_type" },
        { label: "Sector", key: "sector" },
        { label: "Region", key: "region" },
      ],
      data: products,
    },
    customers: {
      filename: "customers_report.csv",
      columns: [
        { label: "Name", key: "full_name" },
        { label: "Email", key: "email" },
        { label: "Role", key: "role" },
        { label: "Joined", value: (u) => (u.created_date ? new Date(u.created_date).toLocaleDateString() : "") },
      ],
      data: users,
    },
    mentors: {
      filename: "mentors_report.csv",
      columns: [
        { label: "Name", key: "name" },
        { label: "Expertise", value: (m) => (m.expertise_areas || []).join("; ") },
        { label: "Email", key: "email" },
        { label: "Phone", key: "phone" },
        { label: "Availability", key: "availability" },
      ],
      data: mentors,
    },
  };

  const toggleMentorApproval = async (mentorId, currentApproved) => {
    setApproving(mentorId);
    try {
      await base44.entities.Mentor.update(mentorId, { approved: !currentApproved });
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setApproving(null);
    }
  };

  const handleExport = (tabId) => {
    const config = exportConfigs[tabId];
    if (config) exportToCSV(config.data, config.filename, config.columns);
  };

  const handleExportAll = () => {
    Object.values(exportConfigs).forEach((config) => {
      exportToCSV(config.data, config.filename, config.columns);
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <div className="bg-[#0D1B2A] text-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-[#00A0E3]" />
            <div>
              <h1 className="font-heading text-lg font-bold">Admin Dashboard</h1>
              <p className="text-xs text-[#F9F7F2]/60">{user?.email || "Administrator"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleExportAll}
              className="flex items-center gap-1.5 text-xs font-medium text-[#F9F7F2]/70 hover:text-[#00A0E3] transition-colors"
            >
              <Download className="w-4 h-4" /> Export All Reports
            </button>
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

        <div className="flex gap-2 mb-6 border-b border-[#E8E2D5] pb-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-t-md text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "bg-[#00A0E3] text-[#F9F7F2]"
                    : "text-[#1A1612]/70 hover:bg-[#F0EBE0]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === "add" ? (
          <div className="bg-white border border-[#E8E2D5] rounded-lg p-6">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setAddTab("vendors")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  addTab === "vendors"
                    ? "bg-[#00A0E3] text-[#F9F7F2]"
                    : "bg-white text-[#1A1612]/70 border border-[#E8E2D5] hover:bg-[#F0EBE0]"
                }`}
              >
                <Store className="w-4 h-4" /> Add Vendor
              </button>
              <button
                onClick={() => setAddTab("products")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  addTab === "products"
                    ? "bg-[#00A0E3] text-[#F9F7F2]"
                    : "bg-white text-[#1A1612]/70 border border-[#E8E2D5] hover:bg-[#F0EBE0]"
                }`}
              >
                <Package className="w-4 h-4" /> Add Product
              </button>
            </div>
            {addTab === "vendors" ? (
              <VendorForm onCreated={loadData} />
            ) : (
              <ProductForm onCreated={loadData} />
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl font-bold text-[#1A1612] capitalize">
                {tab === "customers" ? "Registered Customers" : `Current ${tab}`}
              </h2>
              <button
                onClick={() => handleExport(tab)}
                disabled={loading}
                className="flex items-center gap-2 bg-[#00A0E3] text-[#F9F7F2] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#0086C0] transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" /> Export {tab} (CSV)
              </button>
            </div>

            <div className="bg-white border border-[#E8E2D5] rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-[#1A1612]/50">Loading...</div>
              ) : tab === "vendors" ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#F0EBE0] text-[#1A1612]/70">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium">Business Name</th>
                        <th className="text-left px-4 py-3 font-medium">Type</th>
                        <th className="text-left px-4 py-3 font-medium">Sector</th>
                        <th className="text-left px-4 py-3 font-medium">Region</th>
                        <th className="text-left px-4 py-3 font-medium">Owner</th>
                        <th className="text-left px-4 py-3 font-medium">Phone</th>
                        <th className="text-left px-4 py-3 font-medium">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendors.map((v) => (
                        <tr key={v.id} className="border-t border-[#E8E2D5] hover:bg-[#F9F7F2]">
                          <td className="px-4 py-3 font-medium text-[#1A1612]">
                            <Link to={`/vendors/${v.id}`} className="text-[#00A0E3] hover:underline">
                              {v.business_name}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-[#1A1612]/70">{v.business_type}</td>
                          <td className="px-4 py-3 text-[#1A1612]/70">{v.sector || "—"}</td>
                          <td className="px-4 py-3 text-[#1A1612]/70">{v.region || "—"}</td>
                          <td className="px-4 py-3 text-[#1A1612]/70">{v.owner_name || "—"}</td>
                          <td className="px-4 py-3 text-[#1A1612]/70">{v.phone || "—"}</td>
                          <td className="px-4 py-3 text-[#1A1612]/70">{v.email || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : tab === "products" ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#F0EBE0] text-[#1A1612]/70">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium">Product Name</th>
                        <th className="text-left px-4 py-3 font-medium">Category</th>
                        <th className="text-left px-4 py-3 font-medium">Price (NLe)</th>
                        <th className="text-left px-4 py-3 font-medium">Stock</th>
                        <th className="text-left px-4 py-3 font-medium">Vendor</th>
                        <th className="text-left px-4 py-3 font-medium">Type</th>
                        <th className="text-left px-4 py-3 font-medium">Region</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id} className="border-t border-[#E8E2D5] hover:bg-[#F9F7F2]">
                          <td className="px-4 py-3 font-medium text-[#1A1612]">{p.name}</td>
                          <td className="px-4 py-3 text-[#1A1612]/70">{p.category}</td>
                          <td className="px-4 py-3 font-bold text-[#00A0E3]">{Number(p.price || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-[#1A1612]/70">{p.stock ?? "—"}</td>
                          <td className="px-4 py-3 text-[#1A1612]/70">{p.vendor_name || "—"}</td>
                          <td className="px-4 py-3 text-[#1A1612]/70">{p.business_type}</td>
                          <td className="px-4 py-3 text-[#1A1612]/70">{p.region || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : tab === "customers" ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#F0EBE0] text-[#1A1612]/70">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium">Name</th>
                        <th className="text-left px-4 py-3 font-medium">Email</th>
                        <th className="text-left px-4 py-3 font-medium">Role</th>
                        <th className="text-left px-4 py-3 font-medium">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-t border-[#E8E2D5] hover:bg-[#F9F7F2]">
                          <td className="px-4 py-3 font-medium text-[#1A1612]">{u.full_name || "—"}</td>
                          <td className="px-4 py-3 text-[#1A1612]/70">{u.email}</td>
                          <td className="px-4 py-3 text-[#1A1612]/70">{u.role}</td>
                          <td className="px-4 py-3 text-[#1A1612]/70">{u.created_date ? new Date(u.created_date).toLocaleDateString() : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#F0EBE0] text-[#1A1612]/70">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium">Name</th>
                        <th className="text-left px-4 py-3 font-medium">Expertise</th>
                        <th className="text-left px-4 py-3 font-medium">Email</th>
                        <th className="text-left px-4 py-3 font-medium">Phone</th>
                        <th className="text-left px-4 py-3 font-medium">Availability</th>
                        <th className="text-left px-4 py-3 font-medium">Status</th>
                        <th className="text-left px-4 py-3 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mentors.map((m) => (
                        <tr key={m.id} className="border-t border-[#E8E2D5] hover:bg-[#F9F7F2]">
                          <td className="px-4 py-3 font-medium text-[#1A1612]">{m.name}</td>
                          <td className="px-4 py-3 text-[#1A1612]/70">{(m.expertise_areas || []).join(", ") || "—"}</td>
                          <td className="px-4 py-3 text-[#1A1612]/70">{m.email || "—"}</td>
                          <td className="px-4 py-3 text-[#1A1612]/70">{m.phone || "—"}</td>
                          <td className="px-4 py-3 text-[#1A1612]/70">{m.availability || "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${m.approved ? "bg-[#2D4F1E]/10 text-[#2D4F1E]" : "bg-[#00A0E3]/10 text-[#00A0E3]"}`}>
                              {m.approved ? "Approved" : "Pending"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleMentorApproval(m.id, m.approved)}
                              disabled={approving === m.id}
                              className={`flex items-center gap-1 text-sm font-medium ${
                                m.approved ? "text-red-500 hover:underline" : "text-[#2D4F1E] hover:underline"
                              } disabled:opacity-50`}
                            >
                              {approving === m.id ? (
                                "..."
                              ) : m.approved ? (
                                <><XCircle className="w-4 h-4" /> Revoke</>
                              ) : (
                                <><CheckCircle className="w-4 h-4" /> Approve</>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}