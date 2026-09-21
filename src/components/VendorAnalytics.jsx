import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Eye, TrendingUp, ShoppingBag, DollarSign, Loader2, Plus, Package } from "lucide-react";

export default function VendorAnalytics({ vendor, products }) {
  const [views, setViews] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [saleLoading, setSaleLoading] = useState(false);
  const [saleError, setSaleError] = useState("");

  const [saleForm, setSaleForm] = useState({
    product_id: "",
    quantity: 1,
    customer_name: "",
  });

  useEffect(() => {
    if (!vendor?.business_name) return;
    setLoading(true);
    Promise.all([
      base44.entities.ProductView.filter({ vendor_name: vendor.business_name }, "-created_date", 200).catch(() => []),
      base44.entities.Sale.filter({ vendor_name: vendor.business_name }, "-created_date", 200).catch(() => []),
    ])
      .then(([viewData, saleData]) => {
        setViews(viewData);
        setSales(saleData);
      })
      .finally(() => setLoading(false));
  }, [vendor]);

  const selectedProduct = products.find((p) => p.id === saleForm.product_id);
  const saleTotal = selectedProduct ? Number(selectedProduct.price) * Number(saleForm.quantity || 0) : 0;

  const handleRecordSale = async (e) => {
    e.preventDefault();
    setSaleError("");
    if (!saleForm.product_id) {
      setSaleError("Please select a product.");
      return;
    }
    if (!saleForm.quantity || Number(saleForm.quantity) <= 0) {
      setSaleError("Quantity must be at least 1.");
      return;
    }
    setSaleLoading(true);
    try {
      const product = selectedProduct;
      await base44.entities.Sale.create({
        product_id: product.id,
        product_name: product.name,
        vendor_name: vendor.business_name,
        quantity: Number(saleForm.quantity),
        unit_price: Number(product.price),
        total_price: saleTotal,
        customer_name: saleForm.customer_name || "Walk-in Customer",
      });
      const updated = await base44.entities.Sale.filter({ vendor_name: vendor.business_name }, "-created_date", 200);
      setSales(updated);
      setSaleForm({ product_id: "", quantity: 1, customer_name: "" });
      setShowSaleForm(false);
    } catch (err) {
      setSaleError(err.message || "Failed to record sale.");
    } finally {
      setSaleLoading(false);
    }
  };

  // Compute stats
  const totalViews = views.length;
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total_price || 0), 0);
  const totalUnitsSold = sales.reduce((sum, s) => sum + Number(s.quantity || 0), 0);

  // Views per product
  const viewCounts = {};
  views.forEach((v) => {
    const key = v.product_name || "Unknown";
    viewCounts[key] = (viewCounts[key] || 0) + 1;
  });
  const chartData = Object.entries(viewCounts)
    .map(([name, count]) => ({ name: name.length > 15 ? name.slice(0, 13) + "…" : name, views: count }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  const recentSales = sales.slice(0, 5);

  const stats = [
    { label: "Product Views", value: totalViews, icon: Eye, color: "text-[#00A0E3]", bg: "bg-[#00A0E3]/10" },
    { label: "Total Sales", value: totalSales, icon: ShoppingBag, color: "text-[#2D4F1E]", bg: "bg-[#2D4F1E]/10" },
    { label: "Units Sold", value: totalUnitsSold, icon: Package, color: "text-[#00A0E3]", bg: "bg-[#00A0E3]/10" },
    { label: "Revenue (NLe)", value: totalRevenue.toFixed(2), icon: TrendingUp, color: "text-[#2D4F1E]", bg: "bg-[#2D4F1E]/10" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#00A0E3] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white border border-[#E8E2D5] rounded-lg p-5">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="font-heading text-2xl font-bold text-[#1A1612]">{s.value}</p>
              <p className="text-xs text-[#1A1612]/60">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Views chart + Record sale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#E8E2D5] rounded-lg p-6">
          <h3 className="font-heading text-lg font-bold text-[#1A1612] mb-1">Product Views</h3>
          <p className="text-xs text-[#1A1612]/60 mb-5">How many times customers have viewed your products</p>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E2D5" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#1A1612" }} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fill: "#1A1612" }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "#F9F7F2", border: "1px solid #E8E2D5", borderRadius: 8, fontSize: 12 }}
                  cursor={{ fill: "rgba(0, 160, 227, 0.1)" }}
                />
                <Bar dataKey="views" fill="#00A0E3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Eye className="w-10 h-10 text-[#1A1612]/20 mb-2" />
              <p className="text-sm text-[#1A1612]/50">No product views yet. Your products will appear here once customers start browsing.</p>
            </div>
          )}
        </div>

        <div className="bg-white border border-[#E8E2D5] rounded-lg p-6">
          {!showSaleForm ? (
            <div className="flex flex-col items-center justify-center text-center h-full">
              <div className="w-12 h-12 rounded-full bg-[#2D4F1E]/10 flex items-center justify-center mb-3">
                <DollarSign className="w-6 h-6 text-[#2D4F1E]" />
              </div>
              <h3 className="font-heading text-lg font-bold text-[#1A1612] mb-1">Record a Sale</h3>
              <p className="text-xs text-[#1A1612]/60 mb-4">Log a sale to track your revenue and stay on top of your business.</p>
              <Button
                onClick={() => setShowSaleForm(true)}
                className="bg-[#2D4F1E] hover:bg-[#243f18] text-[#F9F7F2]"
              >
                <Plus className="w-4 h-4" /> Record Sale
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRecordSale} className="space-y-4">
              <h3 className="font-heading text-lg font-bold text-[#1A1612]">Record a Sale</h3>
              {saleError && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{saleError}</div>}
              <div className="space-y-1.5">
                <Label className="text-[#1A1612]">Product *</Label>
                <select
                  value={saleForm.product_id}
                  onChange={(e) => setSaleForm({ ...saleForm, product_id: e.target.value })}
                  className="w-full h-9 rounded-md border border-[#E8E2D5] bg-transparent px-3 text-sm"
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} — NLe {Number(p.price).toFixed(2)}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[#1A1612]">Quantity *</Label>
                <Input
                  type="number"
                  min="1"
                  value={saleForm.quantity}
                  onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })}
                  className="border-[#E8E2D5]"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[#1A1612]">Customer Name</Label>
                <Input
                  value={saleForm.customer_name}
                  onChange={(e) => setSaleForm({ ...saleForm, customer_name: e.target.value })}
                  className="border-[#E8E2D5]"
                  placeholder="Walk-in Customer"
                />
              </div>
              {selectedProduct && (
                <div className="flex items-center justify-between bg-[#00A0E3]/5 rounded-lg px-4 py-3">
                  <span className="text-sm text-[#1A1612]/70">Total</span>
                  <span className="font-heading text-lg font-bold text-[#00A0E3]">NLe {saleTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex gap-2">
                <Button type="submit" disabled={saleLoading} className="bg-[#2D4F1E] hover:bg-[#243f18] text-[#F9F7F2] flex-1">
                  {saleLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Sale"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowSaleForm(false)} className="border-[#E8E2D5]">
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Recent sales */}
      <div className="bg-white border border-[#E8E2D5] rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8E2D5]">
          <h3 className="font-heading text-lg font-bold text-[#1A1612]">Recent Sales</h3>
        </div>
        {recentSales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F0EBE0] text-[#1A1612]/70">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Product</th>
                  <th className="text-left px-4 py-3 font-medium">Customer</th>
                  <th className="text-left px-4 py-3 font-medium">Qty</th>
                  <th className="text-left px-4 py-3 font-medium">Total</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((s) => (
                  <tr key={s.id} className="border-t border-[#E8E2D5] hover:bg-[#F9F7F2]">
                    <td className="px-4 py-3 font-medium text-[#1A1612]">{s.product_name}</td>
                    <td className="px-4 py-3 text-[#1A1612]/70">{s.customer_name || "—"}</td>
                    <td className="px-4 py-3 text-[#1A1612]/70">{s.quantity}</td>
                    <td className="px-4 py-3 font-bold text-[#00A0E3]">NLe {Number(s.total_price || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-[#1A1612]/70">{s.created_date ? new Date(s.created_date).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <ShoppingBag className="w-10 h-10 text-[#1A1612]/20 mb-2" />
            <p className="text-sm text-[#1A1612]/50">No sales recorded yet. Click "Record Sale" to log your first one.</p>
          </div>
        )}
      </div>
    </div>
  );
}