import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Minus, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

/**
 * Reusable ProductCard Component (Exact Figma Specification)
 * 
 * - Dimensions: Width fills grid cell (191.825px on desktop), fixed height 310.1px
 * - Background: #FFFFFF, Border: 0.8px solid #E7E8E5, Radius: 18px, Padding: 8px
 * - Hover: 2px lift with soft shadow
 * - Interactive navigation to /product/:slug:
 *   · Image link & Name link (real <a>, Tab focus, Enter opens, focus ring 2px #F5B800, offset 2px)
 *   · Whole card clickable (ignores clicks from buttons)
 *   · Add button & Wishlist heart do not navigate (stopPropagation)
 */
export default function ProductCard({ product, className = "" }) {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart } = useCart();
  const wishlistContext = useWishlist ? useWishlist() : null;
  const [localWishlisted, setLocalWishlisted] = useState(false);

  if (!product) return null;

  const id = product.id || product.productId || product._id || product.slug;
  const targetSlug = product.slug || id;
  const name = product.name || "Product";
  const unit = product.unit || "1 unit";
  const price = Number(product.price || 0);
  const oldPrice = Number(product.oldPrice || product.mrp || 0);

  // Compute discount percentage dynamically
  const discountPercent = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const discountLabel = product.badge || (discountPercent > 0 ? `${discountPercent}% OFF` : "");
  const hasDiscount = Boolean(discountLabel);

  // Image source
  const fallbackAsset = "/images/categories/category-fallback.png";
  const defaultImage = product.image || product.img || fallbackAsset;
  const [imgSrc, setImgSrc] = useState(defaultImage);

  // Sync state if product prop changes
  React.useEffect(() => {
    setImgSrc(product.image || product.img || fallbackAsset);
  }, [product.image, product.img]);

  // Cart quantity check
  const cartItem = (cart || []).find(
    (item) => item && (item.id === id || item.productId === id || item._id === id)
  );
  const quantity = cartItem?.quantity || 0;

  // Wishlist check
  const isWishlisted = wishlistContext?.isInWishlist
    ? wishlistContext.isInWishlist(id)
    : localWishlisted;

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlistContext?.toggleWishlist) {
      wishlistContext.toggleWishlist(product);
    } else {
      setLocalWishlisted((prev) => !prev);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromCart(id);
  };

  // Whole card click handler: ignores clicks originating from buttons or links
  const handleCardClick = (e) => {
    if (e.target.closest("button") || e.target.closest("a")) return;
    navigate(`/product/${targetSlug}`);
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        backgroundColor: "var(--product-card-bg, #FFFFFF)",
        borderColor: "var(--product-card-border, #E7E8E5)",
        fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
      }}
      className={`group w-full h-auto min-h-0 lg:h-[310.1px] rounded-[16px] lg:rounded-[18px] border-[0.8px] p-2.5 lg:p-2 flex flex-col justify-between overflow-hidden text-left relative transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_4px_16px_rgba(16,24,40,0.08)] motion-reduce:transition-none motion-reduce:hover:transform-none select-none cursor-pointer ${className}`}
    >
      {/* 1. Upper Area: Image + Product Info */}
      <div className="flex-1 flex flex-col">
        {/* Product Image Container (Square, Radius 12px, Overlays) */}
        <div className="relative w-full aspect-square rounded-[12px] overflow-hidden bg-[#F6F6F2] flex items-center justify-center">
          <Link
            to={`/product/${targetSlug}`}
            aria-label={`View ${name}`}
            className="block w-full h-full rounded-[12px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800] focus-visible:ring-offset-2"
          >
            <img
              src={imgSrc}
              alt={name}
              width={176}
              height={176}
              loading="lazy"
              decoding="async"
              onError={() => setImgSrc(fallbackAsset)}
              className="block w-full h-full object-cover rounded-[12px] select-none transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
            />
          </Link>

          {/* Discount Badge (Top Left) */}
          {hasDiscount && Boolean(discountLabel) && (
            <div
              style={{
                backgroundColor: "var(--product-badge-discount-bg, #16803C)",
                fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
                zIndex: 2,
              }}
              className="absolute top-2 left-2 lg:top-[9px] lg:left-[9px] rounded-full px-2 py-0.5 lg:py-[3px] select-none pointer-events-none"
            >
              <span className="text-[10px] lg:text-[8px] font-extrabold leading-[14px] lg:leading-[12px] tracking-normal uppercase text-white block">
                {discountLabel}
              </span>
            </div>
          )}

          {/* Wishlist Heart Button (Top Right) */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isWishlisted}
            style={{ position: "absolute", zIndex: 2 }}
            className="absolute top-2 right-2 lg:top-[9px] lg:right-[9px] w-8 h-8 rounded-full lg:rounded-[10px] bg-white shadow-xs flex items-center justify-center transition-all hover:bg-white active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800] focus-visible:ring-offset-1 touch-manipulation after:absolute after:-inset-1.5 after:content-['']"
          >
            <Heart
              size={15}
              className={`transition-colors lg:w-4 lg:h-4 ${
                isWishlisted
                  ? "fill-rose-500 text-rose-500"
                  : "text-[#101828] hover:text-rose-500"
              }`}
            />
          </button>
        </div>

        {/* Product Name (~14px under image on desktop, 13-14px font on mobile) */}
        <h3
          title={name}
          style={{
            color: "var(--product-title-color, #101828)",
            fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
          }}
          className="mt-2.5 lg:mt-[14px] text-[13px] sm:text-[13.5px] lg:text-[11px] font-extrabold leading-[18px] lg:leading-[15.4px] tracking-normal truncate block"
        >
          <Link
            to={`/product/${targetSlug}`}
            className="hover:text-[#D49400] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800] focus-visible:ring-offset-2 rounded-xs"
          >
            {name}
          </Link>
        </h3>

        {/* Product Unit Text (~8px under name on desktop, 11-12px on mobile) */}
        <span
          style={{
            color: "var(--product-unit-color, #667085)",
            fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
          }}
          className="mt-1 lg:mt-[8px] text-[11px] lg:text-[9px] font-normal leading-[15px] lg:leading-[13.5px] tracking-normal truncate block"
        >
          {unit}
        </span>
      </div>

      {/* 2. Bottom Row: Price Stack (Left) + Add / Stepper Button (Right) */}
      <div className="mt-auto pt-2 flex items-end justify-between gap-1">
        {/* Left: Price Stack */}
        <div className="flex flex-col justify-end">
          <span
            style={{
              color: "var(--product-price-color, #101828)",
              fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
            }}
            className="text-[15px] sm:text-[16px] lg:text-[15px] font-bold leading-[22px] lg:leading-[22.5px] tracking-normal block"
          >
            ₹{price}
          </span>
          {hasDiscount && (
            <span
              style={{
                color: "var(--product-old-price-color, #667085)",
                fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
              }}
              className="text-[11px] lg:text-[8px] font-normal leading-[14px] lg:leading-[12px] tracking-normal line-through -mt-0.5 block"
            >
              ₹{oldPrice}
            </span>
          )}
        </div>

        {/* Right: Add Button or Stepper (Height 36px on mobile with >=40px tap area, 68x32px on desktop) */}
        {quantity === 0 ? (
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${name} to cart`}
            style={{
              backgroundColor: "var(--product-add-btn-bg, #F5B800)",
              color: "var(--product-add-btn-text, #101828)",
              fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
            }}
            className="w-[72px] lg:w-[68px] h-[36px] lg:h-[32px] rounded-full text-[12px] sm:text-[13px] lg:text-[12px] font-extrabold flex items-center justify-center gap-1 shadow-xs hover:bg-[#E5AC00] active:scale-95 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800] focus-visible:ring-offset-1 select-none touch-manipulation"
          >
            <span>Add</span>
            <Plus size={14} strokeWidth={2.5} className="shrink-0" />
          </button>
        ) : (
          <div
            style={{
              backgroundColor: "var(--product-add-btn-bg, #F5B800)",
              fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
            }}
            className="w-[76px] lg:w-[68px] h-[36px] lg:h-[32px] rounded-full flex items-center justify-between px-1.5 shadow-xs select-none"
          >
            <button
              type="button"
              onClick={handleRemove}
              aria-label={`Decrease ${name} quantity`}
              className="w-7 h-7 lg:w-5 lg:h-5 rounded-full flex items-center justify-center hover:bg-black/10 active:scale-90 transition-all text-[#101828] cursor-pointer focus:outline-none touch-manipulation relative after:absolute after:-inset-2 after:content-['']"
            >
              <Minus size={12} strokeWidth={2.5} />
            </button>
            <span className="text-[12px] lg:text-[11px] font-extrabold text-[#101828]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleAdd}
              aria-label={`Increase ${name} quantity`}
              className="w-7 h-7 lg:w-5 lg:h-5 rounded-full flex items-center justify-center hover:bg-black/10 active:scale-90 transition-all text-[#101828] cursor-pointer focus:outline-none touch-manipulation relative after:absolute after:-inset-2 after:content-['']"
            >
              <Plus size={12} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
