import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import CategorySidebar from "@/components/CategorySidebar";
import ProductCard from "@/components/ProductCard";
import VendorCard from "@/components/VendorCard";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    image: "https://media.base44.com/images/public/6a4f83dffc6191b5376288ac/aa9cd5121_generated_image.png",
    title: "Empowering Women Led Businesses",
    subtitle: "Fresh produce from local farmers, delivered from earth to your table.",
  },
  {
    image: "https://media.base44.com/images/public/6a4f83dffc6191b5376288ac/ab911ceac_generated_image.png",
    title: "Empowering Women Led Businesses",
    subtitle: "Beautiful fabrics and textiles crafted by women entrepreneurs across Sierra Leone.",
  },
  {
    image: "https://media.base44.com/images/public/6a4f83dffc6191b5376288ac/3c8356de4_generated_image.png",
    title: "Empowering Women Led Businesses",
    subtitle: "From farming to edtech — women are leading innovation in every sector.",
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    try {
      const [prods, vends] = await Promise.all([
        base44.entities.Product.list(),
        base44.entities.Vendor.list(),
      ]);
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

  const goToSlide = (idx) => setCurrentSlide((idx + SLIDES.length) % SLIDES.length);

  return (
    <div>
      {/* Hero Carousel */}
      <section className="relative h-[65vh] min-h-[450px] overflow-hidden">
        {SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1A1612]/40 via-[#1A1612]/30 to-[#1A1612]/70" />
          </div>
        ))}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 max-w-3xl">
            <h1 className="font-heading text-3xl md:text-6xl font-bold text-[#F9F7F2] mb-4">
              Empowering Women Led <span className="text-[#00A0E3]">Businesses</span>
            </h1>
            <p className="text-sm md:text-lg text-[#F9F7F2]/80 mb-6 leading-relaxed">
              {SLIDES[currentSlide].subtitle}
            </p>
            <a
              href="#marketplace"
              className="inline-block bg-[#00A0E3] text-[#F9F7F2] font-medium px-8 py-3 rounded-md hover:bg-[#0086C0] transition-colors"
            >
              Explore the Market
            </a>
          </div>
        </div>

        {/* Carousel arrows */}
        <button
          onClick={() => goToSlide(currentSlide - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#F9F7F2]/20 backdrop-blur-sm flex items-center justify-center text-[#F9F7F2] hover:bg-[#F9F7F2]/30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => goToSlide(currentSlide + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#F9F7F2]/20 backdrop-blur-sm flex items-center justify-center text-[#F9F7F2] hover:bg-[#F9F7F2]/30 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide ? "w-8 bg-[#00A0E3]" : "w-2 bg-[#F9F7F2]/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Marketplace */}
      <section id="marketplace" className="max-w-7xl mx-auto px-4 py-12">
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-[#F0EBE0] rounded-md text-sm font-medium text-[#1A1612]"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filter Categories
          </button>
          {sidebarOpen && (
            <div className="mt-4 p-4 bg-[#F9F7F2] border border-[#E8E2D5] rounded-lg relative">
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-2 right-2 text-[#1A1612]/50"
              >
                <X className="w-4 h-4" />
              </button>
              <CategorySidebar
                activeFilter={activeFilter}
                onFilterChange={(f) => {
                  setActiveFilter(f);
                  setSidebarOpen(false);
                }}
              />
            </div>
          )}
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

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-[#F0EBE0] rounded-lg h-80 animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-[#1A1612]/50">No products found in this category.</p>
              </div>
            )}

            {/* Featured vendors */}
            {vendors.length > 0 && !activeFilter && (
              <div className="mt-16">
                <h2 className="font-heading text-2xl font-bold text-[#1A1612] mb-6">
                  Featured Vendors
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vendors.slice(0, 3).map((vendor) => (
                    <VendorCard key={vendor.id} vendor={vendor} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}