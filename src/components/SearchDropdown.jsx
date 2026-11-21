import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Star, Plus, Minus, ArrowRight, Store, Sparkles, ChevronRight, Tag, Loader2 } from "lucide-react";
import { searchCatalog } from "../utils/searchUtils";
import { useCart } from "../context/CartContext";
import productService from "../services/productService";

const ROTATING_PLACEHOLDERS = [
  "Search for 'milk'",
  "Search by category",
  "Search by shop",
  "Search groceries, bakery, dairy",
];

export default function SearchDropdown({
  placeholder = "Search products, categories, stores...",
  defaultValue = "",
  onSearchSubmit,
  className = "",
  inputClassName = "",
  showSubmitButton = false,
  autoFocus = false,
}) {
  const [query, setQuery] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const [searchResult, setSearchResult] = useState({
    categories: [],
    products: [],
    stores: [],
    topCategoryMatch: null,
    didYouMean: null,
  });

  const { cart, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Continuous vertical slide placeholder animation (pause ~2s)
  useEffect(() => {
    if (prefersReducedMotion || isFocused || query) return;

    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % ROTATING_PLACEHOLDERS.length);
    }, 2400);

    return () => clearInterval(timer);
  }, [prefersReducedMotion, isFocused, query]);

  useEffect(() => {
    if (defaultValue !== undefined && defaultValue !== query) {
      setQuery(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    let isMounted = true;
    const handler = setTimeout(async () => {
      const q = query.trim();
      if (q.length >= 1) {
        setLoading(true);
        try {
          const res = await productService.getProducts({ search: q, limit: 12 });
          if (isMounted) {
            const apiProducts = res.data || [];
            const searchRes = searchCatalog(q, apiProducts);
            setSearchResult(searchRes);
            setIsOpen(true);
          }
        } catch (err) {
          console.error("Live search dropdown error:", err);
        } finally {
          if (isMounted) setLoading(false);
        }
      } else {
        setSearchResult({
          categories: [],
          products: [],
          stores: [],
          topCategoryMatch: null,
          didYouMean: null,
        });
        setIsOpen(false);
      }
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsOpen(false);
    if (onSearchSubmit) {
      onSearchSubmit(query.trim());
    } else {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleCategoryClick = (catKey) => {
    setIsOpen(false);
    navigate(`/categories?cat=${catKey}&q=${encodeURIComponent(query.trim())}`);
  };

  const handleStoreClick = (storeName) => {
    setIsOpen(false);
    navigate(`/search?store=${encodeURIComponent(storeName)}`);
  };

  const handleProductClick = (prodId) => {
    setIsOpen(false);
    navigate(`/product/${prodId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const hasResults =
    searchResult.categories.length > 0 ||
    searchResult.products.length > 0 ||
    searchResult.stores.length > 0;

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        {/* Search Icon Container (strictly vertically centered) */}
        <div className="absolute left-3.5 sm:left-4 inset-y-0 text-[#16A34A] pointer-events-none flex items-center justify-center z-10">
          <Search size={16} className="shrink-0" />
        </div>

        {/* Animated Rotating Placeholder Overlay (strictly vertically centered with the search icon) */}
        {!query && !isFocused && (
          <div className="absolute left-9 sm:left-10 right-8 inset-y-0 pointer-events-none flex items-center overflow-hidden select-none z-10">
            {prefersReducedMotion ? (
              <span className="text-xs sm:text-sm font-semibold text-slate-400 truncate leading-[20px] flex items-center">
                {placeholder}
              </span>
            ) : (
              <span
                key={placeholderIndex}
                className="text-xs sm:text-sm font-semibold text-slate-400 truncate leading-[20px] flex items-center animate-[slideUp_0.4s_ease-out]"
              >
                {ROTATING_PLACEHOLDERS[placeholderIndex]}
              </span>
            )}
          </div>
        )}

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (query.trim().length >= 1) setIsOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          aria-label="Search products, stores, and categories"
          className={`w-full pl-9 sm:pl-10 pr-6 sm:pr-9 py-2 sm:py-2.5 bg-[#F4F5F8] rounded-full border border-transparent focus:border-[#FEC201] text-xs sm:text-sm font-medium text-[#111925] outline-none placeholder:text-slate-400 transition-all ${inputClassName}`}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 sm:right-3 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-200 transition-colors cursor-pointer z-10"
            aria-label="Clear search"
          >
            <X size={13} />
          </button>
        )}

        {showSubmitButton && (
          <button
            type="submit"
            className="bg-[#FEC201] hover:bg-[#F5B800] text-[#111925] font-extrabold px-5 py-2.5 rounded-full text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ml-2 flex-shrink-0"
          >
            <span>Search</span>
            <ArrowRight size={14} />
          </button>
        )}
      </form>

      {/* Instant Suggestions Dropdown */}
      {isOpen && query.trim().length >= 1 && (
        <div className="absolute top-full -left-12 sm:left-0 sm:right-0 mt-2 w-[calc(100vw-24px)] max-w-sm sm:w-full bg-white border border-[#ECEEF2] rounded-2xl shadow-xl z-[999] overflow-hidden max-h-[75vh] overflow-y-auto divide-y divide-slate-100 text-left transition-all animate-fade-in">
          {/* Typo Correction Banner */}
          {searchResult.didYouMean && (
            <div className="bg-[#FFF8E1] px-4 py-2.5 border-b border-[#ECEEF2] flex items-center justify-between text-xs text-[#111925] font-bold">
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#FEC201]" />
                <span>
                  Showing results for{" "}
                  <strong
                    className="underline cursor-pointer"
                    onClick={() => handleCategoryClick(searchResult.topCategoryMatch?.key)}
                  >
                    {searchResult.didYouMean}
                  </strong>
                </span>
              </div>
            </div>
          )}

          {!hasResults ? (
            <div className="p-6 text-center text-slate-500 space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search size={20} />
              </div>
              <div className="text-sm font-extrabold text-slate-700">No matches found for "{query}"</div>
              <p className="text-xs text-slate-400">Try searching for "Tomatoes", "Atta", "Milk", "Fruits", "Pizza", or "Sabji"</p>
            </div>
          ) : (
            <>
              {/* 1. MATCHED PRODUCTS */}
              {searchResult.products.length > 0 && (
                <div className="p-3">
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#166534] mb-2 px-2 flex items-center justify-between">
                    <span>Products ({searchResult.products.length})</span>
                    <span className="text-slate-400 font-medium">Click to open</span>
                  </div>
                  <div className="space-y-1.5">
                    {searchResult.products.slice(0, 6).map((prod) => {
                      const inCart = cart.find((item) => item.id === prod.id);
                      return (
                        <div
                          key={prod.id}
                          onClick={() => handleProductClick(prod.id)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F4F5F8] transition-colors cursor-pointer group border border-transparent hover:border-[#ECEEF2]"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/60">
                              <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-extrabold text-[#111925] group-hover:text-[#F5B800] truncate">
                                {prod.name}
                              </h4>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mt-0.5">
                                <span className="text-[#111925] font-bold bg-[#F4F5F8] px-1.5 py-0.2 rounded">{prod.categoryName}</span>
                                <span>• {prod.store}</span>
                                <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                                  <Star size={9} className="fill-amber-400 text-amber-400" />
                                  {prod.rating}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                            <div className="text-right">
                              <div className="text-xs font-black text-[#111925]">₹{prod.price}</div>
                              {prod.mrp > prod.price && (
                                <div className="text-[10px] text-slate-400 line-through">₹{prod.mrp}</div>
                              )}
                            </div>

                            {inCart ? (
                              <div className="flex items-center gap-1 bg-[#FFF8E1] border border-[#FEC201] rounded-full p-0.5">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); removeFromCart(prod.id); }}
                                  className="w-5 h-5 rounded-full bg-white text-slate-700 flex items-center justify-center hover:bg-slate-100 cursor-pointer shadow-xs"
                                >
                                  <Minus size={10} />
                                </button>
                                <span className="w-4 text-center text-xs font-black text-[#111925]">{inCart.quantity}</span>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); addToCart(prod); }}
                                  className="w-5 h-5 rounded-full bg-[#FEC201] text-[#111925] flex items-center justify-center hover:bg-[#F5B800] cursor-pointer shadow-xs"
                                >
                                  <Plus size={10} />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); addToCart(prod); }}
                                className="bg-[#FEC201] hover:bg-[#F5B800] text-[#111925] px-3 py-1 rounded-full text-xs font-black transition-colors cursor-pointer shadow-2xs"
                              >
                                ADD
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. MATCHED CATEGORIES */}
              {searchResult.categories.length > 0 && (
                <div className="p-3 bg-slate-50/50">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 px-2">
                    Categories ({searchResult.categories.length})
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {searchResult.categories.slice(0, 4).map((cat) => (
                      <button
                        type="button"
                        key={cat.key}
                        onClick={() => handleCategoryClick(cat.key)}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white hover:bg-[#F4F5F8] border border-[#ECEEF2] text-left transition-colors cursor-pointer group"
                      >
                        <span className="text-base">{cat.icon}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-extrabold text-[#111925] group-hover:text-[#F5B800] truncate">
                            {cat.name}
                          </div>
                          <div className="text-[10px] text-slate-400">Department</div>
                        </div>
                        <ChevronRight size={12} className="ml-auto text-slate-300 group-hover:text-[#111925] shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. MATCHED LOCAL SHOPS & STORES */}
              {searchResult.stores.length > 0 && (
                <div className="p-3">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 px-2">
                    Verified Stores ({searchResult.stores.length})
                  </div>
                  <div className="space-y-1">
                    {searchResult.stores.map((store) => (
                      <button
                        type="button"
                        key={store.id}
                        onClick={() => handleStoreClick(store.name)}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#F4F5F8] transition-colors text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#FFF8E1] text-[#111925] flex items-center justify-center font-bold">
                            <Store size={14} />
                          </div>
                          <div>
                            <div className="text-xs font-extrabold text-[#111925] group-hover:text-[#F5B800]">
                              {store.name}
                            </div>
                            <div className="text-[10px] text-slate-400">{store.category} • Delivery in 15 mins</div>
                          </div>
                        </div>
                        <ChevronRight size={12} className="text-slate-300 group-hover:text-[#111925]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* View all matches footer */}
              <div
                onClick={handleSubmit}
                className="p-3 bg-[#FFF8E1] hover:bg-[#FEC201] text-[#111925] text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>View all results for "{query}"</span>
                <ArrowRight size={14} />
              </div>
            </>
          )}
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes slideUp {
          0% {
            transform: translateY(70%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
