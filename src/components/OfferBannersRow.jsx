import React from "react";
import { Link } from "react-router-dom";

/**
 * OfferBannersRow Component (Exact Figma Specification)
 * 
 * - Placed directly below "Shop from nearby stores" with 40px top margin
 * - Flex row left-aligned in standard 1216px container (total ~906.5px width, space to right remains empty)
 * - Gap: 13px
 * - Each banner:
 *   - Desktop: width 293.5px, height 116px (fixed)
 *   - Border-radius: 32px (rounded-[32px])
 *   - Padding: 20px
 *   - Overflow: hidden, no border, no shadow
 *   - 2px hover lift with focus ring (disabled for prefers-reduced-motion)
 * - Banner 1 (Bank Offers):
 *   - Gradient: linear-gradient(101.26deg, #FFE0E3 26.67%, #FFB4E2 95.61%)
 *   - PAY SMART (Manrope 700 8px/12px, letter-spacing 1px, #667085)
 *   - Bank offers (Manrope 700 15px/22.5px, letter-spacing -0.4px, #9C000E)
 *   - Up to 10% off (Manrope 500 10px/14px, #667085)
 *   - Image: /images/home/home-pharma.png (100px wide, bottom-right anchored, partially cropped by banner edge)
 * - Banner 2 (Wallet Cashback):
 *   - Background: #FFF4DA (flat)
 *   - REWARDS (Manrope 700 8px/12px, letter-spacing 1px, #667085)
 *   - Wallet cashback (Manrope 700 15px/22.5px, letter-spacing -0.4px, #FF9F53)
 *   - Get up to ₹100 back (Manrope 500 10px/14px, #667085)
 *   - Image: /images/home/home-wellness.png (64px wide, vertically centered, 20px from right edge, uncropped)
 * - Banner 3 (Combo Offer):
 *   - Full banner image: /images/home/home-organic.png (object-cover, object-center, includes COMBO OFFER badge, no overlaid text)
 */
export default function OfferBannersRow({ loading = false, className = "" }) {
  if (loading) {
    return (
      <section aria-label="Special Offers Loading" className={`w-full text-left !mt-[40px] ${className}`}>
        <div className="flex items-center justify-start gap-[13px] overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory py-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-[293.5px] min-w-[293.5px] max-w-[293.5px] h-[116px] rounded-[32px] bg-[#F4F5F8] animate-pulse shrink-0 snap-start"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Special Offers" className={`w-full text-left !mt-[40px] ${className}`}>
      {/* 3 Banners Row: Left-aligned, 13px gap, NOT stretched across container */}
      <div className="flex items-center justify-start gap-[13px] overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory scroll-smooth py-1">
        
        {/* BANNER 1: BANK OFFERS */}
        <Link
          to="/offers/payment#bank-offers"
          aria-label="View bank offers"
          className="w-[293.5px] min-w-[293.5px] max-w-[293.5px] h-[116px] rounded-[32px] p-[20px] flex items-center justify-between overflow-hidden relative shrink-0 snap-start select-none no-underline transition-transform duration-200 hover:-translate-y-[2px] motion-reduce:transition-none motion-reduce:hover:transform-none cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F5B800] focus-visible:ring-offset-2"
          style={{
            background: "var(--banner-bank-bg, linear-gradient(101.26deg, #FFE0E3 26.67%, #FFB4E2 95.61%))",
            fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
          }}
        >
          {/* Left Text Block */}
          <div className="flex flex-col justify-center gap-1 z-10 select-none max-w-[160px]">
            <span
              className="uppercase font-bold text-[8px] leading-[12px] tracking-[1px]"
              style={{
                color: "var(--banner-label-color, #667085)",
                fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
              }}
            >
              PAY SMART
            </span>
            <h3
              className="font-bold text-[15px] leading-[22.5px] tracking-[-0.4px] m-0"
              style={{
                color: "var(--banner-bank-title, #9C000E)",
                fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
              }}
            >
              Bank offers
            </h3>
            <span
              className="font-medium text-[10px] leading-[14px]"
              style={{
                color: "var(--banner-subtitle-color, #667085)",
                fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
              }}
            >
              Up to 10% off
            </span>
          </div>

          {/* Right Bank Cards Image (Red Kotak card + Purple card): Anchored bottom right */}
          <img
            src="/offer-bank-cards.png"
            alt=""
            width={130}
            height={78}
            loading="lazy"
            decoding="async"
            className="w-[125px] sm:w-[130px] h-auto object-contain select-none pointer-events-none absolute -right-[2px] -bottom-[4px]"
          />
        </Link>

        {/* BANNER 2: WALLET CASHBACK */}
        <Link
          to="/offers/payment#wallet-cashback"
          aria-label="View wallet cashback offers"
          className="w-[293.5px] min-w-[293.5px] max-w-[293.5px] h-[116px] rounded-[32px] p-[20px] flex items-center justify-between overflow-hidden relative shrink-0 snap-start select-none no-underline transition-transform duration-200 hover:-translate-y-[2px] motion-reduce:transition-none motion-reduce:hover:transform-none cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F5B800] focus-visible:ring-offset-2"
          style={{
            backgroundColor: "var(--banner-wallet-bg, #FFF4DA)",
            fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
          }}
        >
          {/* Left Text Block */}
          <div className="flex flex-col justify-center gap-1 z-10 select-none max-w-[160px]">
            <span
              className="uppercase font-bold text-[8px] leading-[12px] tracking-[1px]"
              style={{
                color: "var(--banner-label-color, #667085)",
                fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
              }}
            >
              REWARDS
            </span>
            <h3
              className="font-bold text-[15px] leading-[22.5px] tracking-[-0.4px] m-0"
              style={{
                color: "var(--banner-wallet-title, #FF9F53)",
                fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
              }}
            >
              Wallet cashback
            </h3>
            <span
              className="font-medium text-[10px] leading-[14px]"
              style={{
                color: "var(--banner-subtitle-color, #667085)",
                fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
              }}
            >
              Get up to ₹100 back
            </span>
          </div>

          {/* Right Wallet Image: Centered vertically, 20px from right edge, uncropped */}
          <img
            src="/images/home/home-wellness.png"
            alt=""
            width={64}
            height={68}
            loading="lazy"
            decoding="async"
            className="w-[64px] h-auto object-contain select-none pointer-events-none absolute right-[20px] top-1/2 -translate-y-1/2"
          />
        </Link>

        {/* BANNER 3: COMBO OFFER */}
        <Link
          to="/category/offers"
          aria-label="View combo offers"
          className="w-[293.5px] min-w-[293.5px] max-w-[293.5px] h-[116px] rounded-[32px] overflow-hidden relative shrink-0 snap-start select-none no-underline transition-transform duration-200 hover:-translate-y-[2px] motion-reduce:transition-none motion-reduce:hover:transform-none cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F5B800] focus-visible:ring-offset-2"
        >
          <img
            src="/images/home/home-organic.png"
            alt="Combo offer"
            width={294}
            height={116}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center select-none"
          />
        </Link>

      </div>
    </section>
  );
}
