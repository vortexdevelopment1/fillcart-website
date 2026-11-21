import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Star,
  Eye,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Store,
  CheckCircle2,
  Search,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
  Loader2,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { getProductImage } from "../utils/productImages";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { user, loadingUser, addToCart, cart, setShowLoginModal } = useCart();
  const { wishlist, removeFromWishlist, fetchWishlist, loading } = useWishlist();

  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [toastMsg, setToastMsg] = useState("");

  // Always fetch fresh wishlist from MongoDB on page load
  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user, fetchWishlist]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg("");
    }, 3000);
  };

  const handleAddToCart = (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    addToCart(product);
    triggerToast(`Added ${product.name} to Cart! 🛒`);
  };

  const handleRemove = async (productId, productName, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    await removeFromWishlist(productId);
    triggerToast(`Removed ${productName || "item"} from Wishlist`);
  };

  // Filter items by category & search term
  const filteredWishlist = wishlist.filter((item) => {
    if (!item) return false;
    const matchesSearch =
      !searchFilter.trim() ||
      item.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.store?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.categoryName?.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      (item.categoryKey || "").toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Extract unique categories in wishlist
  const availableCategories = Array.from(
    new Set(wishlist.map((item) => item.categoryKey || "grocery"))
  );

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-[#111925]" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <Navbar searchPlaceholder="Search products in your wishlist..." />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111925] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#FEC201]/30 animate-bounce">
          <CheckCircle2 size={18} className="text-[#FEC201]" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-[1216px] w-full mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-[#6B7280]">
          <Link to="/" className="hover:text-[#111925] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#111925] font-bold">My Wishlist</span>
        </nav>

        {/* Page Hero Header */}
        <div className="bg-[#FCF4E3] border border-[#FEC201]/30 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 z-10">
            <div className="inline-flex items-center gap-2 bg-white text-rose-600 border border-rose-100 px-3 py-1 rounded-full text-xs font-black">
              <Heart size={14} className="fill-rose-500 text-rose-500" />
              <span>SAVED COLLECTION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111925] tracking-tight">
              My Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] font-semibold max-w-xl">
              All your favorite groceries, daily essentials, and fresh staples saved for instant re-ordering.
            </p>
          </div>

          <div className="flex items-center gap-3 z-10 self-start md:self-auto">
            <div className="bg-white border border-[#ECEEF2] rounded-2xl px-4 py-3 text-center">
              <span className="block text-xl font-black text-[#111925]">
                {wishlist.length}
              </span>
              <span className="text-[10px] font-extrabold uppercase text-[#6B7280] tracking-wider">
                {wishlist.length === 1 ? "Item" : "Items"} Saved
              </span>
            </div>

            {wishlist.length > 0 && (
              <button
                onClick={() => {
                  wishlist.forEach((prod) => addToCart(prod));
                  triggerToast(`Added all ${wishlist.length} items to your cart! 🛒`);
                }}
                className="bg-[#FEC201] hover:bg-[#F5B800] text-[#111925] font-black text-xs px-5 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <ShoppingCart size={15} />
                <span>Move All to Cart</span>
              </button>
            )}
          </div>
        </div>

        {/* Loading Spinner / Skeleton State */}
        {loadingUser || (loading && wishlist.length === 0) ? (
          <div className="bg-white border border-[#ECEEF2] rounded-3xl p-16 text-center max-w-md mx-auto shadow-xs space-y-4 my-8">
            <Loader2 size={36} className="animate-spin text-[#FEC201] mx-auto" />
            <p className="text-xs font-bold text-[#6B7280]">Loading your saved wishlist items from MongoDB...</p>
          </div>
        ) : !user ? (
          /* Unauthenticated View */
          <div className="bg-white border border-[#ECEEF2] rounded-3xl p-10 sm:p-14 text-center max-w-lg mx-auto shadow-sm space-y-4 my-8">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto border border-rose-100 shadow-inner">
              <Heart size={32} className="fill-rose-500" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black text-[#111925]">
                Login to View Your Wishlist
              </h2>
              <p className="text-xs text-[#6B7280] font-semibold max-w-xs mx-auto">
                Save items across your devices, get notified on price drops, and quickly order your staples.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/login"
                className="bg-[#FEC201] hover:bg-[#F5B800] text-[#111925] font-extrabold px-6 py-3 rounded-full text-xs transition-all shadow-md inline-flex items-center justify-center gap-2"
              >
                <span>Login to Your Account</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/categories"
                className="border border-[#ECEEF2] bg-[#F4F5F8] hover:bg-[#ECEEF2] text-[#111925] font-extrabold px-6 py-3 rounded-full text-xs transition-all inline-flex items-center justify-center"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : wishlist.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-dashed border-[#ECEEF2] rounded-3xl p-10 sm:p-16 text-center max-w-md mx-auto space-y-4 shadow-xs my-8">
            <div className="w-16 h-16 bg-[#FCF4E3] text-[#111925] rounded-3xl flex items-center justify-center mx-auto border border-[#FEC201]/30 shadow-inner">
              <ShoppingBag size={32} />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg sm:text-xl font-black text-[#111925]">
                Your Wishlist is Empty
              </h2>
              <p className="text-xs text-[#6B7280] font-medium max-w-xs mx-auto leading-relaxed">
                You haven't saved any items yet. Explore fresh daily farm produce, dairy, bakery, and snacks to bookmark them!
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/categories"
                className="bg-[#FEC201] hover:bg-[#F5B800] text-[#111925] font-extrabold text-xs px-6 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Sparkles size={15} />
                <span>Explore Products Now</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Populated Wishlist View */
          <div className="space-y-5">
            {/* Filter & Search Bar */}
            <div className="bg-white border border-[#ECEEF2] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
              <div className="relative w-full sm:w-72">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter by name, store..."
                  className="w-full pl-9 pr-3.5 py-2 bg-[#F4F5F8] border border-[#ECEEF2] rounded-full text-xs font-semibold text-[#111925] placeholder:text-[#6B7280] focus:outline-none focus:border-[#FEC201] transition-colors"
                />
              </div>

              {availableCategories.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === "all"
                        ? "bg-[#FEC201] text-[#111925]"
                        : "bg-[#F4F5F8] text-[#111925] hover:bg-[#FCF4E3]"
                    }`}
                  >
                    All ({wishlist.length})
                  </button>
                  {availableCategories.map((catKey) => {
                    const count = wishlist.filter(
                      (item) => (item.categoryKey || "grocery") === catKey
                    ).length;
                    return (
                      <button
                        key={catKey}
                        onClick={() => setSelectedCategory(catKey)}
                        className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-colors capitalize cursor-pointer ${
                          selectedCategory === catKey
                            ? "bg-[#FEC201] text-[#111925]"
                            : "bg-[#F4F5F8] text-[#111925] hover:bg-[#FCF4E3]"
                        }`}
                      >
                        {catKey} ({count})
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Product Cards Grid */}
            {filteredWishlist.length === 0 ? (
              <div className="bg-white border border-[#ECEEF2] rounded-2xl p-8 text-center text-xs text-[#6B7280] font-semibold">
                No wishlist products match your filter "{searchFilter}".
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {filteredWishlist.map((item) => {
                  const targetId = item.productId || item.id || String(item._id);
                  const prodImage =
                    item.img ||
                    item.image ||
                    getProductImage(item.name, item.categoryKey || "grocery");
                  const inCart = cart.find(
                    (c) =>
                      c &&
                      (c.id === targetId ||
                        c.productId === targetId ||
                        c._id === targetId)
                  );
                  const discountPct =
                    item.mrp && item.mrp > item.price
                      ? Math.round(((item.mrp - item.price) / item.mrp) * 100)
                      : 0;

                  return (
                    <div
                      key={targetId}
                      className="bg-white border border-[#ECEEF2] hover:border-[#FEC201] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative"
                    >
                      {/* Top Badges & Remove Button */}
                      <div className="relative aspect-square bg-[#F4F5F8] overflow-hidden flex items-center justify-center p-3">
                        <img
                          src={prodImage}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />

                        {/* Deep Green Discount Offer Pill */}
                        {discountPct > 0 && (
                          <span className="absolute top-2 left-2 bg-[#0F8A43] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                            {discountPct}% OFF
                          </span>
                        )}

                        {/* Rating Pill */}
                        {item.rating && (
                          <span className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs text-[#111925] text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-2xs flex items-center gap-0.5">
                            <Star
                              size={10}
                              className="fill-[#FEC201] text-[#FEC201]"
                            />
                            {item.rating}
                          </span>
                        )}

                        {/* Remove from Wishlist Trash Button */}
                        <button
                          type="button"
                          onClick={(e) => handleRemove(targetId, item.name, e)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-rose-50 border border-[#ECEEF2] hover:border-rose-200 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer shadow-xs z-10"
                          title="Remove from Wishlist"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Product Content Details */}
                      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between text-left">
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-semibold text-[#6B7280] mb-0.5">
                            <span className="truncate flex items-center gap-1">
                              <Store size={10} className="text-[#111925]" />
                              {item.store || "Fresh Mart"}
                            </span>
                            <span>{item.unit || "1 Pack"}</span>
                          </div>

                          <h3 className="font-extrabold text-xs sm:text-sm text-[#111925] line-clamp-2 leading-snug group-hover:text-[#F5B800] transition-colors">
                            {item.name}
                          </h3>
                        </div>

                        {/* Pricing and Action Buttons */}
                        <div className="mt-3 pt-2.5 border-t border-[#ECEEF2] space-y-2">
                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="text-base sm:text-lg font-black text-[#111925]">
                                ₹{item.price}
                              </span>
                              {item.mrp && item.mrp > item.price && (
                                <span className="text-xs text-[#6B7280] line-through font-semibold ml-1.5">
                                  ₹{item.mrp}
                                </span>
                              )}
                            </div>
                            {item.inStock === false && (
                              <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                                Out of Stock
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            {/* View Product Button */}
                            <Link
                              to={`/product/${targetId}`}
                              className="w-full py-2 px-2 rounded-full text-[11px] font-extrabold bg-[#F4F5F8] hover:bg-[#FCF4E3] border border-[#ECEEF2] hover:border-[#FEC201] text-[#111925] transition-all flex items-center justify-center gap-1 text-center"
                            >
                              <Eye size={12} />
                              <span>View</span>
                            </Link>

                            {/* Add/Move to Cart Button */}
                            <button
                              type="button"
                              onClick={(e) => handleAddToCart(item, e)}
                              className="w-full py-2 px-2 rounded-full text-[11px] font-extrabold bg-[#FEC201] hover:bg-[#F5B800] text-[#111925] shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <ShoppingCart size={12} />
                              <span>{inCart ? "In Cart" : "Add"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Value Props Footer Banner */}
        <div className="bg-white border border-[#ECEEF2] rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-2xs text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FCF4E3] text-[#111925] flex items-center justify-center shrink-0">
              <Zap size={18} />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#111925]">
                15-Minute Local Delivery
              </h4>
              <p className="text-[11px] text-[#6B7280] font-semibold">
                Delivered straight from nearest verified stores
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#111925]">
                100% Quality Guaranteed
              </h4>
              <p className="text-[11px] text-[#6B7280] font-semibold">
                Daily fresh checks on every grocery item
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#111925]">
                Best Local Deals
              </h4>
              <p className="text-[11px] text-[#6B7280] font-semibold">
                Verified fair local supermarket pricing
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
