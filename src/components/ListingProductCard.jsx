import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Minus, Heart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

/**
 * ListingProductCard Component (Exact Figma Specification for Category Page)
 *
 * - Outer: width 211.5px (fill grid column), min-height ~393.25px, padding 12px,
 *          border-radius 24px, border 1px solid #E5E7EB, background #FFFFFF.
 * - Font: Inter (weights 500, 600, 700)
 * - 1. Image area: 185.5px x 224px, radius 16px, letterbox fill #F3F4F6
 *      - Discount badge: top 12px, left 12px, dark green #166534, pill, Inter 700 12px
 *      - Heart button: top 12px, right 12px, 36x36 white circle, 18px icon
 *      - Rating pill: bottom 8px, left 8px, white pill, amber star, 4.8 (3.5K)
 * - 2. Name: Inter 700, 16px, line-height 24.75px, letter-spacing -0.45px, color #111827
 * - 3. Unit + options: 14px, 500, dot, "N options" 14px 600 blue #2563EB
 * - 4. Discount text: "15% off" in #16803C, Inter 600 14px
 * - 5. Pricing row: Price + Old Price on left, 92.02x40px yellow pill "Add +" on right
 */
export default function ListingProductCard({ product, className = "" }) {
  const { cart, addToCart, removeFromCart } = useCart();
  const wishlistContext = useWishlist ? useWishlist() : null;
  const [localWishlisted, setLocalWishlisted] = useState(false);
  const [localQty, setLocalQty] = useState(0);

  if (!product) return null;

  const id = product.id || product.productId || product._id || product.slug;
  const name = product.name || "Product";
  const slug =
    product.slug ||
    name
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const unit = product.unit || "1 unit";
  const price = Number(product.price || 0);
  const oldPrice = Number(product.oldPrice || product.mrp || 0);
  const discountPercent =
    product.discountPercent ||
    (oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0);

  // Fallback image handling
  const fallbackAsset = "/images/products/placeholder.png";
  const defaultImage = product.image || product.img || fallbackAsset;
  const [imgSrc, setImgSrc] = useState(defaultImage);

  React.useEffect(() => {
    setImgSrc(product.image || product.img || fallbackAsset);
  }, [product.image, product.img]);

  // Cart quantity check
  const cartItem = (cart || []).find(
    (item) =>
      item && (item.id === id || item.productId === id || item._id === id)
  );
  const quantity = cartItem?.quantity ?? localQty;

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
    if (addToCart) {
      addToCart(product);
    }
    setLocalQty((prev) => prev + 1);
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (removeFromCart) {
      removeFromCart(id);
    }
    setLocalQty((prev) => Math.max(0, prev - 1));
  };

  return (
    <article
      style={{
        borderRadius: "24px",
        border: "1px solid #E5E7EB",
        backgroundColor: "#FFFFFF",
        fontFamily: "var(--font-inter, 'Inter', sans-serif)",
      }}
      className={`group w-full max-w-full lg:max-w-[211.5px] min-h-0 lg:min-h-[393.25px] p-2.5 sm:p-3 flex flex-col justify-between overflow-hidden text-left relative transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_4px_16px_rgba(16,24,40,0.08)] select-none ${className}`}
    >
      <div className="flex flex-col flex-1">
        {/* 1. IMAGE AREA: width 185.5px, height 224px, radius 16px, letterbox #F3F4F6 */}
        <div
          style={{
            borderRadius: "16px",
            backgroundColor: "#F3F4F6",
          }}
          className="relative w-full h-[170px] sm:h-[200px] lg:h-[224px] overflow-hidden flex items-center justify-center shrink-0"
        >
          <Link
            to={`/product/${slug}`}
            className="w-full h-full flex items-center justify-center cursor-pointer"
            aria-label={`View details for ${name}`}
          >
            <img
              src={imgSrc}
              alt={name}
              loading="lazy"
              decoding="async"
              onError={() => setImgSrc(fallbackAsset)}
              className="w-full h-full object-cover object-center select-none transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Green Discount Badge (top 12px, left 12px) */}
          {discountPercent > 0 && (
            <div
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                backgroundColor: "#166534",
                borderRadius: "9999px",
                padding: "6px 12px",
                zIndex: 2,
              }}
              className="select-none pointer-events-none"
            >
              <span
                style={{
                  fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                  fontWeight: 700,
                  fontSize: "12px",
                  lineHeight: "1",
                  letterSpacing: "0.5px",
                  color: "#FFFFFF",
                  textTransform: "uppercase",
                  display: "block",
                }}
              >
                {discountPercent}% OFF
              </span>
            </div>
          )}

          {/* Heart Button (top 12px, right 12px): 36x36 circle, white background, 48px touch area */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={
              isWishlisted
                ? `Remove ${name} from wishlist`
                : `Add ${name} to wishlist`
            }
            aria-pressed={isWishlisted}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              zIndex: 2,
            }}
            className="flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#101828] after:absolute after:-inset-1.5 after:content-['']"
          >
            <Heart
              size={18}
              strokeWidth={2}
              className={`transition-colors ${
                isWishlisted
                  ? "fill-[#EF4444] text-[#EF4444]"
                  : "text-[#111827] hover:text-[#EF4444]"
              }`}
            />
          </button>
        </div>

        {/* 2. RATING ROW (below image, above title): amber star, 4.8 (3.5K) */}
        {product.rating && (
          <div className="mt-3 flex items-center gap-1.5 select-none">
            <Star
              size={14}
              className="fill-[#F59E0B] text-[#F59E0B] shrink-0"
            />
            <span
              style={{
                fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                fontWeight: 600,
                fontSize: "13px",
                lineHeight: "16px",
                color: "#111827",
              }}
            >
              {product.rating}
            </span>
            {product.ratingCount && (
              <span
                style={{
                  fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                  fontWeight: 500,
                  fontSize: "13px",
                  lineHeight: "16px",
                  color: "#6B7280",
                }}
              >
                ({product.ratingCount})
              </span>
            )}
          </div>
        )}

        {/* 3. NAME: Inter 700, 16px, line-height 24.75px, letter-spacing -0.45px, color #111827 */}
        <Link
          to={`/product/${slug}`}
          className="block mt-2 group-hover:text-[#B45309] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#111827]"
        >
          <h3
            title={name}
            style={{
              fontFamily: "var(--font-inter, 'Inter', sans-serif)",
              fontWeight: 700,
              fontSize: "16px",
              lineHeight: "22px",
              letterSpacing: "-0.45px",
              color: "#111827",
            }}
            className="line-clamp-1"
          >
            {name}
          </h3>
        </Link>

        {/* 4. UNIT + OPTIONS ROW (gap 8px, height 20px, mt 1.5) */}
        <div
          style={{ height: "20px" }}
          className="mt-1.5 flex items-center gap-2"
        >
          <span
            style={{
              fontFamily: "var(--font-inter, 'Inter', sans-serif)",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "20px",
              letterSpacing: "0px",
              color: "#4B5563",
            }}
          >
            {unit}
          </span>

          {/* Small grey dot (4px, #9CA3AF) */}
          <span
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              backgroundColor: "#9CA3AF",
            }}
            className="shrink-0"
          />

          {/* "N options" link in blue #2563EB */}
          {product.optionsCount && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              style={{
                fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "20px",
                color: "#2563EB",
              }}
              className="hover:underline cursor-pointer p-0 bg-transparent border-0 shrink-0"
            >
              {product.optionsCount}{" "}
              {product.optionsCount === 1 ? "option" : "options"}
            </button>
          )}
        </div>

        {/* 5. DISCOUNT TEXT: "15% off" in green #16803C (Inter 600, 14px, lh 20px) */}
        {discountPercent > 0 && (
          <div className="mt-1" style={{ height: "20px" }}>
            <span
              style={{
                fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "20px",
                color: "#16803C",
                display: "block",
              }}
            >
              {discountPercent}% off
            </span>
          </div>
        )}
      </div>

      {/* 5. PRICING ROW */}
      <div
        style={{
          width: "100%",
          paddingTop: "8px",
        }}
        className="mt-auto min-h-[48px] sm:h-[52px] flex items-center justify-between gap-1"
      >
        {/* LEFT Price Column */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
          }}
          className="flex flex-col justify-center"
        >
          {/* Price "₹34": Inter 700, 16px, lh 24px, ls -0.6px, color #111827 */}
          <span
            style={{
              fontFamily: "var(--font-inter, 'Inter', sans-serif)",
              fontWeight: 700,
              letterSpacing: "-0.6px",
              color: "#111827",
              display: "block",
            }}
            className="text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px]"
          >
            ₹{price}
          </span>

          {/* Old Price "₹40": Inter 600, 14px, lh 20px, color #9CA3AF, line-through */}
          {oldPrice > price && (
            <span
              style={{
                fontFamily: "var(--font-inter, 'Inter', sans-serif)",
                fontWeight: 600,
                fontSize: "12px",
                lineHeight: "16px",
                color: "#9CA3AF",
                textDecoration: "line-through",
                display: "block",
              }}
              className="sm:text-[14px] sm:leading-[20px]"
            >
              ₹{oldPrice}
            </span>
          )}
        </div>

        {/* RIGHT "Add +" Button or Stepper */}
        {quantity === 0 ? (
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${name} to cart`}
            style={{
              borderRadius: "9999px",
              backgroundColor: "#FBBF24",
              boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
              border: 0,
              fontFamily: "var(--font-inter, 'Inter', sans-serif)",
              fontWeight: 700,
              fontSize: "13px",
              lineHeight: "18px",
              color: "#111827",
            }}
            className="w-[70px] min-[380px]:w-[80px] sm:w-[92.02px] lg:w-[92.02px] h-[34px] sm:h-[40px] lg:h-[40px] px-2 sm:px-4 lg:px-6 inline-flex items-center justify-center gap-1 transition-colors duration-150 hover:bg-[#F5B800] active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#101828] focus-visible:ring-offset-2 shrink-0 select-none touch-manipulation"
          >
            <span>Add</span>
            <Plus size={14} strokeWidth={2.5} className="text-[#111827] shrink-0" />
          </button>
        ) : (
          <div
            style={{
              borderRadius: "9999px",
              backgroundColor: "#FBBF24",
              boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
              fontFamily: "var(--font-inter, 'Inter', sans-serif)",
            }}
            className="w-[72px] min-[380px]:w-[80px] sm:w-[92.02px] lg:w-[92.02px] h-[34px] sm:h-[40px] lg:h-[40px] inline-flex items-center justify-between px-1.5 sm:px-2.5 shrink-0 select-none touch-manipulation"
          >
            <button
              type="button"
              onClick={handleRemove}
              aria-label={`Decrease quantity of ${name}`}
              className="w-5 sm:w-6 h-full flex items-center justify-center hover:bg-black/10 rounded-l-full cursor-pointer transition-colors relative after:absolute after:-inset-2 after:content-['']"
            >
              <Minus size={12} strokeWidth={2.5} className="text-[#111827]" />
            </button>
            <span
              style={{
                fontWeight: 700,
                fontSize: "12px",
                color: "#111827",
              }}
              className="px-0.5 sm:text-[13px]"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleAdd}
              aria-label={`Increase quantity of ${name}`}
              className="w-5 sm:w-6 h-full flex items-center justify-center hover:bg-black/10 rounded-r-full cursor-pointer transition-colors relative after:absolute after:-inset-2 after:content-['']"
            >
              <Plus size={12} strokeWidth={2.5} className="text-[#111827]" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
