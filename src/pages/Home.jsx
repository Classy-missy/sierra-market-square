import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import CategorySidebar from "@/components/CategorySidebar";
import ProductCard from "@/components/ProductCard";
import VendorCard from "@/components/VendorCard";
import { SlidersHorizontal, X } from "lucide-react";

const HERO_IMG = "https://media.base44.com/images/public/6a4f83dffc6191b5376288ac/e30aa9e2a_generated_140002be.png";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prods, vends] = await Promise.all([
      base44.entities.Product.list(),
      base44.entities.Vendor.list()]
      );
      setProducts(prods);
      setVendors(vends);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!activeFilter) return true;
    if (activeFilter.type === "category") return p.category === activeFilter.value;
    if (activeFilter.type === "business") return p.business_type === activeFilter.value;
    if (activeFilter.type === "sector") return p.sector === activeFilter.value;
    if (activeFilter.type === "region") return p.region === activeFilter.value;
    return true;
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] overflow-hidden">
        <img src={HERO_IMG} alt="Sierra Leone market" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1612]/40 via-[#1A1612]/30 to-[#1A1612]/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 max-w-3xl">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-[#F9F7F2] mb-4">Empowering , Radiance

            </h1>
            <p className="text-base md:text-lg text-[#F9F7F2]/80 mb-6 leading-relaxed">
              Discover the bounty of Sierra Leone's female entrepreneurs — fresh produce,
              artisanal goods, and the glow of empowered communities.
            </p>
            <a
              href="#marketplace"
              className="inline-block bg-[#00A0E3] text-[#F9F7F2] font-medium px-8 py-3 rounded-md hover:bg-[#0086C0] transition-colors">
              
              Explore the Market
            </a>
          </div>
        </div>
      </section>

      {/* Marketplace */}
      <section id="marketplace" className="max-w-7xl mx-auto px-4 py-12">
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-[#F0EBE0] rounded-md text-sm font-medium text-[#1A1612]">
            
            <SlidersHorizontal className="w-4 h-4" /> Filter Categories
          </button>
          {sidebarOpen &&
          <div className="mt-4 p-4 bg-[#F9F7F2] border border-[#E8E2D5] rounded-lg relative">
              <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-2 right-2 text-[#1A1612]/50">
              
                <X className="w-4 h-4" />
              </button>
              <CategorySidebar
              activeFilter={activeFilter}
              onFilterChange={(f) => {
                setActiveFilter(f);
                setSidebarOpen(false);
              }} />
            
            </div>
          }
        </div>

        <div className="flex gap-8">
          {/* Sidebar - desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-[#F9F7F2] border border-[#E8E2D5] rounded-lg p-4">
              <CategorySidebar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-bold text-[#1A1612]">
                {activeFilter ? activeFilter.value : "All Products"}
              </h2>
              <span className="text-sm text-[#1A1612]/50">{filteredProducts.length} items</span>
            </div>

            {loading ?
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) =>
              <div key={i} className="bg-[#F0EBE0] rounded-lg h-80 animate-pulse" />
              )}
              </div> :
            filteredProducts.length > 0 ?
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) =>
              <ProductCard key={product.id} product={product} />
              )}
              </div> :

            <div className="text-center py-16">
                <p className="text-[#1A1612]/50">No products found in this category.</p>
              </div>
            }

            {/* Featured vendors */}
            {vendors.length > 0 && !activeFilter &&
            <div className="mt-16">
                <h2 className="font-heading text-2xl font-bold text-[#1A1612] mb-6">
                  Featured Vendors
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vendors.slice(0, 3).map((vendor) =>
                <VendorCard key={vendor.id} vendor={vendor} />
                )}
                </div>
              </div>
            }
          </div>
        </div>
      </section>
    </div>);

}