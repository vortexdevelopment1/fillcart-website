import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StoreCard from "../components/StoreCard";
import { Store, Star, Clock, MapPin, Search, RefreshCw, AlertCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import productService from "../services/productService";

export default function ShopsPage() {
  const { userLocation } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadShops = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (userLocation?.lat != null) params.lat = userLocation.lat;
      if (userLocation?.lng != null) params.lng = userLocation.lng;
      if (activeCategory !== "all") params.category = activeCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await productService.getShops(params);
      if (res.success) {
        setShops(res.data || []);
      } else {
        setError(res.error || "Failed to load stores");
      }
    } catch (err) {
      setError(err.message || "Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShops();
  }, [userLocation?.lat, userLocation?.lng, activeCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadShops();
  };

  const categories = [
    { key: "all", label: "All Stores" },
    { key: "Groceries", label: "Groceries" },
    { key: "Bakery", label: "Bakery" },
    { key: "Organics", label: "Organics" },
    { key: "Medicines", label: "Pharmacy" },
    { key: "Pet", label: "Pet Supplies" },
    { key: "Electronics", label: "Electronics" },
    { key: "Food", label: "Food & Fast Food" },
  ];

  return (
    <div className="bg-white text-[#111925] min-h-screen flex flex-col font-sans" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <Navbar />

      <main className="flex-1 max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-4 font-semibold">
          <Link to="/" className="hover:text-[#111925] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#111925] font-bold">Local Stores</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b border-[#ECEEF2]">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#6B7280] block mb-1">
              AROUND THE CORNER
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111925] tracking-tight">
              Local Stores Near You
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">
              Delivering to: <span className="font-bold text-[#111925]">{userLocation?.formatted || userLocation?.area || "Your Area"}</span>
            </p>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search store name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F4F5F8] border border-[#ECEEF2] rounded-full text-[#111925] placeholder:text-[#6B7280] focus:outline-none focus:border-[#FEC201] transition-all"
            />
            <Search size={15} className="absolute left-3.5 top-3 text-[#6B7280]" />
          </form>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => {
                if (c.key === "all") {
                  searchParams.delete("category");
                } else {
                  searchParams.set("category", c.key);
                }
                setSearchParams(searchParams);
              }}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeCategory === c.key
                  ? "bg-[#FEC201] text-[#111925] font-extrabold shadow-xs"
                  : "bg-[#F4F5F8] text-[#111925] border border-[#ECEEF2] hover:bg-[#FCF4E3]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Content Grid / States */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className="w-full rounded-2xl border border-[#ECEEF2] p-2.5 bg-white animate-pulse space-y-2.5">
                <div className="h-[136px] bg-[#F4F5F8] rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white border border-rose-100 rounded-3xl p-10 text-center max-w-md mx-auto my-12 space-y-4">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={26} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#111925]">Could not load stores</h3>
              <p className="text-xs text-[#6B7280] font-medium mt-1">{error}</p>
            </div>
            <button
              onClick={loadShops}
              className="bg-[#FEC201] hover:bg-[#F5B800] text-[#111925] font-extrabold px-6 py-2.5 rounded-full text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <RefreshCw size={13} /> Try Again
            </button>
          </div>
        ) : shops.length === 0 ? (
          <div className="bg-white border border-[#ECEEF2] rounded-3xl p-10 sm:p-14 text-center max-w-md mx-auto my-12 space-y-4">
            <div className="w-16 h-16 bg-[#FCF4E3] text-[#111925] rounded-full flex items-center justify-center mx-auto">
              <Store size={28} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#111925]">No stores found</h3>
              <p className="text-xs text-[#6B7280] font-medium mt-1">
                No verified stores deliver to this location yet. Try picking a different location or check back soon.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {shops.map((shop) => (
              <StoreCard key={shop.id || shop._id || shop.slug} store={shop} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

