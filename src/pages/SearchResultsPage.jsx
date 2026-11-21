import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { Star, Sparkles, ShoppingBag, Layers, ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import productService, { CATEGORIES } from "../services/productService";
import { searchCatalog, filterAndSortProducts, getSimilarProducts } from "../utils/searchUtils";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("cat") || "all";

  const { cart } = useCart();
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [matchingProducts, setMatchingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch search products from backend MongoDB API
  useEffect(() => {
    let isMounted = true;
    const fetchSearchData = async () => {
      setLoading(true);
      try {
        const [searchRes, generalRes] = await Promise.all([
          productService.getProducts({
            search: query,
            category: categoryFilter,
            limit: 100
          }),
          productService.getProducts({ limit: 50 })
        ]);

        if (isMounted) {
          const matched = searchRes.data || [];
          setMatchingProducts(matched);
          setAllProducts(generalRes.data || []);
        }
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSearchData();
    return () => { isMounted = false; };
  }, [query, categoryFilter]);

  // Perform instant fuzzy catalog search for category suggestions
  const searchResults = useMemo(() => {
    return searchCatalog(query, allProducts);
  }, [query, allProducts]);

  // Similar Products Recommendations
  const similarProducts = useMemo(() => {
    return getSimilarProducts(matchingProducts, allProducts, query);
  }, [matchingProducts, allProducts, query]);

  // Matching or Similar Categories for search query
  const relatedCategories = useMemo(() => {
    if (!query) return CATEGORIES.slice(0, 5);
    if (searchResults.categories && searchResults.categories.length > 0) {
      return searchResults.categories;
    }
    return CATEGORIES.slice(0, 5);
  }, [query, searchResults]);

  return (
    <div className="bg-white min-h-screen text-[#111925] flex flex-col font-sans" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* Universal Sticky Top Header Navbar */}
      <Navbar searchPlaceholder="Search for items (e.g. Tomato, Milk, Paneer, Atta)..." />

      {/* SEARCH HEADER */}
      <section className="bg-white border-b border-[#ECEEF2] py-4 sm:py-5">
        <div className="max-w-[1216px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#111925] tracking-tight">
                {query ? `Search Results for "${query}"` : "Explore Catalog"}
              </h1>
              <p className="text-xs text-[#6B7280] font-semibold mt-0.5">
                {matchingProducts.length} product{matchingProducts.length === 1 ? "" : "s"} ready for instant 15-30 min delivery
              </p>
            </div>

            {searchResults.didYouMean && query && (
              <div className="flex items-center gap-1.5 bg-[#FCF4E3] border border-[#FEC201]/40 px-3 py-1.5 rounded-full text-xs font-bold text-[#111925]">
                <Sparkles size={14} className="text-[#111925]" />
                <span>Did you mean <button onClick={() => navigate(`/search?q=${encodeURIComponent(searchResults.didYouMean)}`)} className="underline font-black cursor-pointer">"{searchResults.didYouMean}"</button>?</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MAIN PRODUCTS & SIMILAR CATEGORIES PAGE CONTENT */}
      <main className="max-w-[1216px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 flex-1 w-full">

        {/* 1. EXACT MATCHING PRODUCTS GRID (TOP SECTION) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-[#111925] flex items-center gap-2">
              <Sparkles size={18} className="text-[#FEC201]" />
              Exact Product Matches ({matchingProducts.length})
            </h2>
            {query && (
              <span className="text-xs font-bold text-[#111925] bg-[#FCF4E3] px-2.5 py-0.5 rounded-full border border-[#FEC201]/40">
                Direct Matches
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-[#ECEEF2] rounded-2xl p-3 animate-pulse space-y-3">
                  <div className="aspect-square bg-[#F4F5F8] rounded-xl" />
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : matchingProducts.length === 0 ? (
            <div className="bg-white border border-[#ECEEF2] rounded-3xl p-10 text-center max-w-md mx-auto my-6 space-y-3 shadow-xs">
              <div className="w-14 h-14 bg-[#FCF4E3] text-[#111925] rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-base font-extrabold text-[#111925]">No direct products found for "{query}"</h3>
              <p className="text-xs text-[#6B7280] font-medium">
                Try searching for "Tomatoes", "Milk", "Atta", "Paneer", "Rice", or "Burger".
              </p>
              <Link
                to="/categories"
                className="inline-block bg-[#FEC201] hover:bg-[#F5B800] text-[#111925] font-extrabold px-6 py-2.5 rounded-full text-xs transition-colors cursor-pointer shadow-xs"
              >
                Browse All Categories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
              {matchingProducts.map((p) => (
                <ProductCard key={p.id || p.productId || p._id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* 2. SIMILAR CATEGORIES SECTION */}
        {relatedCategories.length > 0 && (
          <section className="bg-white border border-[#ECEEF2] rounded-3xl p-5 sm:p-6 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#111925] flex items-center gap-2">
                <Layers size={18} className="text-[#111925]" />
                Similar Categories You Might Like
              </h3>
              <Link to="/categories" className="text-xs font-extrabold text-[#111925] hover:text-[#F5B800] flex items-center gap-1">
                View All Categories <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {relatedCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/search?cat=${cat.key}&q=${encodeURIComponent(query)}`)}
                  className="flex items-center gap-2.5 p-2.5 bg-white hover:bg-[#FCF4E3]/30 border border-[#ECEEF2] hover:border-[#FEC201] rounded-2xl transition-all group text-left cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#F4F5F8] shrink-0">
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-extrabold text-[#111925] group-hover:text-[#F5B800] block truncate">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-[#6B7280] font-semibold">{cat.count}+ items</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 3. SIMILAR & RELATED PRODUCTS SECTION */}
        {similarProducts.length > 0 && (
          <section className="pt-4 border-t border-[#ECEEF2] space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-extrabold text-[#111925] flex items-center gap-2">
                <Sparkles size={16} className="text-[#FEC201]" />
                Similar & Related Products
              </h2>
              <span className="text-xs font-bold text-[#6B7280]">Frequently bought together</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {similarProducts.map((sp) => (
                <ProductCard key={sp.id || sp.productId || sp._id} product={sp} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
