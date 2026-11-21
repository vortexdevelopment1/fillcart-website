import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Store, Users, MapPin, TrendingUp, ShieldCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/**
 * AboutPage Component
 * 
 * Pixel-faithful reproduction of Figma export (1440px desktop frame + responsive tablet & mobile):
 * 1. Global Container: 1216px max-width, Inter font family throughout.
 * 2. Section 1 (Hero): 1216x405px, radius 32px, navy #111925 background with /images/about/about-hero-bg.svg.
 *    Centered text: "About us" (32px), "Making Everyday Shopping Easier" (56px, "Easier" in #F59E0B),
 *    paragraph (24px/32px).
 * 3. Section 2 (Our Story): Two columns (left photo 527x393px with interactive hover animation:
 *    default tilted -1.5deg with 3px yellow edge; hover straight 0deg with -55px/-22px #FFB800 accent
 *    block and animated 78px #B45309 heading line).
 * 4. Section 3 (Our Purpose): Header with #B45309 accent line + 4 dark gradient stat cards (286x302px)
 *    with icon tiles (76x76px) and clipped decorative geometric shapes.
 * 5. Section 4 (Become a Partner): 1216x385px dark card (#111925) with left text + "Partner With Us"
 *    pill button, right handshake illustration (465x297px).
 * 6. Section 5 (Why Partner With Partner): Centered heading flanked by 70px yellow lines + 4 feature columns
 *    with 68x68px warm icon tiles and 1px #E5E7EB vertical dividers.
 */
/**
 * Three-person outline icon matching Figma's exact "Happy Customers" icon
 */
function UsersThree({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="7" r="3" />
      <path d="M7 19v-1a5 5 0 0 1 10 0v1" />
      <path d="M5.5 9.5a2.5 2.5 0 0 1 0-4" />
      <path d="M2 18v-1a4 4 0 0 1 3.5-3.5" />
      <path d="M18.5 5.5a2.5 2.5 0 0 1 0 4" />
      <path d="M18.5 13.5A4 4 0 0 1 22 17v1" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <div
      className="about-page min-h-screen flex flex-col bg-white text-[#101828] selection:bg-[#FFE9A8] selection:text-[#101828] overflow-x-hidden"
      style={{ fontFamily: "var(--font-inter, 'Inter', -apple-system, BlinkMacSystemFont, sans-serif)" }}
    >
      {/* Scoped CSS for Interactive Hover & Inter Font Guarantee */}
      <style>{`
        .about-page,
        .about-page h1,
        .about-page h2,
        .about-page h3,
        .about-page p,
        .about-page span,
        .about-page button,
        .about-page a {
          font-family: var(--font-inter, 'Inter', -apple-system, BlinkMacSystemFont, sans-serif) !important;
        }

        /* Our Story Interactive Hover */
        .story-yellow-shape {
          transform: translate(-14px, -10px) rotate(0deg);
          transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }
        .story-photo {
          transform: rotate(0deg);
          transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }
        .story-heading-line {
          width: 78px;
          height: 2px;
        }

        @media (min-width: 640px) and (max-width: 1023px) {
          .story-yellow-shape {
            transform: translate(-30px, -14px) rotate(0deg);
          }
        }

        @media (min-width: 1024px) and (hover: hover) {
          .story-photo {
            transform: rotate(-1deg);
          }
          .story-yellow-shape {
            transform: translate(3px, 3px) rotate(-1deg);
          }

          .about-story-row:hover .story-photo {
            transform: rotate(0deg);
          }
          .about-story-row:hover .story-yellow-shape {
            transform: translate(-55px, -22px) rotate(0deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .story-yellow-shape,
          .story-photo {
            transition: none !important;
          }
        }
      `}</style>

      {/* 1. Global Navbar */}
      <Navbar />

      <main className="flex-1 w-full pb-16 lg:pb-[60px]">
        {/* Main 1216px Container */}
        <div className="max-w-[1216px] mx-auto px-4 sm:px-6 xl:px-0 pt-6 sm:pt-8 lg:pt-[103px]">

          {/* ========================================================================= */}
          {/* SECTION 1: HERO BANNER */}
          {/* ========================================================================= */}
          <section
            aria-label="About FillCarts Hero"
            className="w-full rounded-[24px] sm:rounded-[32px] overflow-hidden relative select-none bg-[#111925] text-white"
          >
            {/* Desktop & Tablet Background Layout */}
            <div className="hidden sm:block relative w-full h-[360px] lg:h-[405px]">
              {/* Background SVG Artwork (groceries left, FC bag right) */}
              <img
                src="/images/about/about-hero-bg.svg"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
              />

              {/* Centered HTML Text Block */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
                <span className="font-bold text-[24px] leading-[32px] lg:text-[32px] lg:leading-[40px] tracking-[-1px] text-white">
                  About us
                </span>

                <h1 className="mt-2 lg:mt-3 font-extrabold text-[40px] leading-[48px] lg:text-[56px] lg:leading-[64px] max-w-[497px] text-white">
                  Making Everyday <br className="hidden sm:inline" />
                  Shopping <span className="text-[#F59E0B]">Easier</span>
                </h1>

                <p className="mt-3 lg:mt-4 font-normal text-[18px] leading-[26px] lg:text-[24px] lg:leading-[32px] text-white/90 max-w-[620px]">
                  Your everyday essentials, all in one place — making shopping simpler, faster, and more convenient.
                </p>
              </div>
            </div>

            {/* Mobile Layout (< 640px) */}
            <div className="sm:hidden flex flex-col items-center text-center pt-8 px-4 pb-0 bg-[#111925]">
              <span className="font-bold text-[20px] leading-[28px] tracking-[-0.5px] text-white">
                About us
              </span>

              <h1 className="mt-2 font-extrabold text-[32px] leading-[40px] text-white">
                Making Everyday <br />
                Shopping <span className="text-[#F59E0B]">Easier</span>
              </h1>

              <p className="mt-3 font-normal text-[15px] leading-[22px] text-white/90 max-w-[95%]">
                Your everyday essentials, all in one place — making shopping simpler, faster, and more convenient.
              </p>

              {/* Bottom image strip on mobile */}
              <div className="w-full mt-4">
                <img
                  src="/images/about/about-hero-bg.svg"
                  alt="FillCarts Grocery Delivery"
                  className="w-full h-auto object-contain block pointer-events-none select-none"
                />
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 2: OUR STORY (Interactive Hover State on Desktop) */}
          {/* ========================================================================= */}
          <section
            aria-label="Our Story"
            className="about-story-row mt-10 sm:mt-12 lg:mt-[40px] min-h-0 lg:min-h-[553px] flex items-center py-4 lg:py-6 cursor-default"
          >
            <div className="w-full grid grid-cols-1 lg:grid-cols-[527px_1fr] gap-8 lg:gap-10 xl:gap-[50px] items-center">

              {/* Left Column: Story Photo with Yellow Accent Shape */}
              <div className="relative flex justify-center lg:justify-start">
                <div className="relative w-full max-w-[527px] aspect-[527/393]">
                  {/* Yellow Rounded Shape Behind Photo */}
                  <div
                    aria-hidden="true"
                    className="story-yellow-shape absolute inset-0 w-full h-full rounded-[24px] sm:rounded-[32px] bg-[#FFB800] z-0 pointer-events-none"
                  />

                  {/* Main Photo Container */}
                  <div className="story-photo relative z-10 w-full h-full rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
                    <img
                      src="/images/about/our-story-photo.jpg"
                      alt="FillCarts local shopping community story"
                      className="w-full h-full object-cover object-center block select-none"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Story Text */}
              <div className="flex flex-col items-start lg:max-w-[584px] lg:pl-2">
                {/* Heading with Brown/Amber Line */}
                <div className="flex items-center gap-4">
                  <h2 className="font-bold text-[32px] sm:text-[36px] lg:text-[40px] leading-[40px] text-[#111827]">
                    Our Story
                  </h2>
                  {/* Line next to heading */}
                  <span
                    aria-hidden="true"
                    className="story-heading-line w-[78px] h-[2px] bg-[#B45309] rounded-full inline-block shrink-0"
                  />
                </div>

                {/* Paragraphs */}
                <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-5 text-[#4B5563] font-normal text-[16px] sm:text-[18px] lg:text-[20px] leading-[26px] sm:leading-[28px]">
                  <p>
                    FillCarts was created with a simple idea — to make local shopping more convenient, accessible and reliable for everyone. We understand that people love their nearby stores, but busy schedules, distance and everyday commitments can sometimes make visiting them difficult.
                  </p>
                  <p>
                    We believe local stores are an important part of every community. They provide familiar products, personal service and convenience to neighbourhoods. Through FillCarts, we want to help these businesses reach more customers, improve their online visibility and grow their businesses.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 3: OUR PURPOSE */}
          {/* ========================================================================= */}
          <section
            aria-label="Our Purpose"
            className="mt-12 sm:mt-16 lg:mt-[100px]"
          >
            {/* Header Block */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[16px] sm:text-[18px] lg:text-[20px] tracking-wider text-[#B45309] uppercase">
                  OUR PURPOSE
                </span>
                <span
                  aria-hidden="true"
                  className="w-[80px] sm:w-[100px] h-[2px] bg-[#B45309] rounded-full"
                />
              </div>

              <h2 className="mt-3 sm:mt-4 font-extrabold text-[28px] sm:text-[34px] lg:text-[40px] leading-[36px] sm:leading-[42px] lg:leading-[48px] text-[#111827]">
                Building a better shopping experience
              </h2>

              <p className="mt-3 sm:mt-4 font-normal text-[16px] sm:text-[18px] lg:text-[20px] leading-[24px] sm:leading-[28px] text-[#4B5563] max-w-[840px]">
                At FillCarts, we connect you with local stores and everyday essentials, making shopping simple, reliable, and more accessible for your community.
              </p>
            </div>

            {/* Stat Cards Grid (4 cards, 2 columns on >=360px phones, 2x2 on tablets, 4 columns on desktop) */}
            <div className="mt-8 sm:mt-10 grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-4 gap-3 min-[360px]:gap-3 sm:gap-5 lg:gap-6">

              {/* CARD 1: 50K+ Products Available */}
              <div
                style={{
                  background: "linear-gradient(115.2deg, #131827 9.6%, #232531 57.6%, #342B29 89.6%)",
                }}
                className="relative rounded-[24px] sm:rounded-[32px] pt-[20px] pl-[16px] sm:pt-[28px] sm:pl-[24px] lg:pt-[38px] lg:pl-8 pb-5 sm:pb-6 lg:pb-8 pr-4 sm:pr-6 lg:pr-8 min-h-[190px] sm:min-h-[240px] lg:h-[302px] overflow-hidden flex flex-col select-none shadow-sm"
              >
                {/* Decorative Shape: Yellow Rounded Rect SVG at bottom-right corner */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 285.75 302"
                  preserveAspectRatio="xMaxYMax slice"
                  className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
                >
                  <rect
                    x="59"
                    y="236"
                    width="554"
                    height="310"
                    rx="200"
                    ry="200"
                    fill="#F4B322"
                  />
                </svg>

                {/* Content */}
                <div className="relative z-10">
                  <div className="w-[52px] h-[52px] sm:w-[64px] sm:h-[64px] lg:w-[76px] lg:h-[76px] rounded-[14px] sm:rounded-[16px] lg:rounded-[20px] bg-[#59452A] flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#F4B322] stroke-[1.5]" />
                  </div>
                </div>

                <div className="relative z-10 flex flex-col mt-2.5 sm:mt-3 lg:mt-[14px]">
                  <span className="font-bold text-[28px] leading-[32px] sm:text-[36px] sm:leading-[40px] lg:text-[40px] lg:leading-[40px] text-white">
                    50K+
                  </span>
                  <span className="font-normal text-[13px] leading-[18px] sm:text-[15px] sm:leading-[22px] lg:text-[16px] lg:leading-[24px] text-white/90 mt-1 sm:mt-1.5 lg:mt-2">
                    Products Available
                  </span>
                </div>
              </div>

              {/* CARD 2: 2,000+ Local Stores */}
              <div
                style={{
                  background: "linear-gradient(115.2deg, #131827 9.6%, #232531 57.6%, #342B29 89.6%)",
                }}
                className="relative rounded-[24px] sm:rounded-[32px] pt-[20px] pl-[16px] sm:pt-[28px] sm:pl-[24px] lg:pt-[38px] lg:pl-8 pb-5 sm:pb-6 lg:pb-8 pr-4 sm:pr-6 lg:pr-8 min-h-[190px] sm:min-h-[240px] lg:h-[302px] overflow-hidden flex flex-col select-none shadow-sm"
              >
                {/* Decorative Shape: Gold Ellipse Curve */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute select-none rounded-[50%]"
                  style={{
                    position: "absolute",
                    left: "47px",
                    top: "-157.5px",
                    width: "530px",
                    height: "310px",
                    borderRadius: "50%",
                    background: "#B18435",
                    transform: "rotate(15deg)",
                    transformOrigin: "center",
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div className="w-[52px] h-[52px] sm:w-[64px] sm:h-[64px] lg:w-[76px] lg:h-[76px] rounded-[14px] sm:rounded-[16px] lg:rounded-[20px] bg-[#59452A] flex items-center justify-center shrink-0">
                    <Store className="w-[30px] h-[30px] sm:w-[38px] sm:h-[38px] lg:w-[44px] lg:h-[44px] text-[#F4B322] stroke-[1.5]" />
                  </div>
                </div>

                <div className="relative z-10 flex flex-col mt-2.5 sm:mt-3 lg:mt-[14px]">
                  <span className="font-bold text-[28px] leading-[32px] sm:text-[36px] sm:leading-[40px] lg:text-[40px] lg:leading-[40px] text-white">
                    2,000+
                  </span>
                  <span className="font-normal text-[13px] leading-[18px] sm:text-[15px] sm:leading-[22px] lg:text-[16px] lg:leading-[24px] text-white/90 mt-1 sm:mt-1.5 lg:mt-2">
                    Local Stores
                  </span>
                </div>
              </div>

              {/* CARD 3: 1L+ Happy Customers */}
              <div
                style={{
                  background: "linear-gradient(115.2deg, #131827 9.6%, #232531 57.6%, #342B29 89.6%)",
                }}
                className="relative rounded-[24px] sm:rounded-[32px] pt-[20px] pl-[16px] sm:pt-[28px] sm:pl-[24px] lg:pt-[38px] lg:pl-8 pb-5 sm:pb-6 lg:pb-8 pr-4 sm:pr-6 lg:pr-8 min-h-[190px] sm:min-h-[240px] lg:h-[302px] overflow-hidden flex flex-col select-none shadow-sm"
              >
                {/* Decorative Shape: Yellow Rounded Rect SVG at bottom-right corner */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 285.75 302"
                  preserveAspectRatio="xMaxYMax slice"
                  className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
                >
                  <rect
                    x="59"
                    y="236"
                    width="530"
                    height="310"
                    rx="200"
                    ry="200"
                    fill="#F4B322"
                  />
                </svg>

                {/* Content */}
                <div className="relative z-10">
                  <div className="w-[52px] h-[52px] sm:w-[64px] sm:h-[64px] lg:w-[76px] lg:h-[76px] rounded-[14px] sm:rounded-[16px] lg:rounded-[20px] bg-[#59452A] flex items-center justify-center shrink-0">
                    <UsersThree className="w-[31px] h-[31px] sm:w-[39px] sm:h-[39px] lg:w-[46px] lg:h-[46px] text-[#F4B322]" />
                  </div>
                </div>

                <div className="relative z-10 flex flex-col mt-2.5 sm:mt-3 lg:mt-[14px]">
                  <span className="font-bold text-[28px] leading-[32px] sm:text-[36px] sm:leading-[40px] lg:text-[40px] lg:leading-[40px] text-white">
                    1L+
                  </span>
                  <span className="font-normal text-[13px] leading-[18px] sm:text-[15px] sm:leading-[22px] lg:text-[16px] lg:leading-[24px] text-white/90 mt-1 sm:mt-1.5 lg:mt-2">
                    Happy Customers
                  </span>
                </div>
              </div>

              {/* CARD 4: 10+ Delivery Cities */}
              <div
                style={{
                  background: "linear-gradient(115.2deg, #131827 9.6%, #232531 57.6%, #342B29 89.6%)",
                }}
                className="relative rounded-[24px] sm:rounded-[32px] pt-[20px] pl-[16px] sm:pt-[28px] sm:pl-[24px] lg:pt-[38px] lg:pl-8 pb-5 sm:pb-6 lg:pb-8 pr-4 sm:pr-6 lg:pr-8 min-h-[190px] sm:min-h-[240px] lg:h-[302px] overflow-hidden flex flex-col select-none shadow-sm"
              >
                {/* Decorative Shape: Grey Ellipse Curve */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute select-none rounded-[50%]"
                  style={{
                    position: "absolute",
                    left: "47px",
                    top: "-157.5px",
                    width: "530px",
                    height: "310px",
                    borderRadius: "50%",
                    background: "#797979",
                    transform: "rotate(15deg)",
                    transformOrigin: "center",
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div className="w-[52px] h-[52px] sm:w-[64px] sm:h-[64px] lg:w-[76px] lg:h-[76px] rounded-[14px] sm:rounded-[16px] lg:rounded-[20px] bg-[#59452A] flex items-center justify-center shrink-0">
                    <MapPin className="w-[31px] h-[31px] sm:w-[39px] sm:h-[39px] lg:w-[46px] lg:h-[46px] text-[#F4B322] stroke-[1.5]" />
                  </div>
                </div>

                <div className="relative z-10 flex flex-col mt-2.5 sm:mt-3 lg:mt-[14px]">
                  <span className="font-bold text-[28px] leading-[32px] sm:text-[36px] sm:leading-[40px] lg:text-[40px] lg:leading-[40px] text-white">
                    10+
                  </span>
                  <span className="font-normal text-[13px] leading-[18px] sm:text-[15px] sm:leading-[22px] lg:text-[16px] lg:leading-[24px] text-white/90 mt-1 sm:mt-1.5 lg:mt-2">
                    Delivery Cities
                  </span>
                </div>
              </div>

            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 4: BECOME A PARTNER */}
          {/* ========================================================================= */}
          <section
            aria-label="Become a Partner"
            className="mt-12 sm:mt-16 lg:mt-[76px]"
          >
            <div className="w-full bg-[#111925] rounded-[24px] sm:rounded-[32px] relative overflow-hidden p-6 sm:p-10 lg:p-0 lg:h-[385px] flex flex-col lg:flex-row items-center justify-between">

              {/* Left Content */}
              <div className="w-full lg:max-w-[619px] lg:pl-12 lg:py-12 flex flex-col items-start z-10">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[14px] sm:text-[16px] lg:text-[18px] tracking-wider text-white uppercase">
                    PARTNER WITH US
                  </span>
                  <span
                    aria-hidden="true"
                    className="w-[50px] sm:w-[70px] h-[2px] bg-white rounded-full"
                  />
                </div>

                <h2 className="mt-3 sm:mt-4 font-extrabold text-[36px] sm:text-[48px] lg:text-[64px] leading-[44px] sm:leading-[56px] lg:leading-[72px] text-white">
                  Become a Partner
                </h2>

                <p className="mt-3 sm:mt-4 font-normal text-[16px] sm:text-[18px] lg:text-[20px] leading-[24px] sm:leading-[28px] text-white/90 max-w-[560px]">
                  We're proud to work with local stores and vendors, helping them grow while giving you faster, more reliable access to everyday essentials.
                </p>

                <div className="mt-6 sm:mt-8 w-full sm:w-auto">
                  <Link
                    to="/become-vendor"
                    className="w-full sm:w-auto inline-flex items-center justify-center h-[52px] sm:h-[56px] px-8 rounded-full bg-[#FFB800] hover:bg-[#F5A600] active:scale-95 transition-all text-[#111925] font-bold text-[16px] shadow-sm select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB800] focus-visible:ring-offset-2"
                  >
                    Partner With Us
                  </Link>
                </div>
              </div>

              {/* Right Handshake Illustration */}
              <div className="w-full lg:w-auto mt-6 lg:mt-0 flex justify-center lg:justify-end lg:pr-8 lg:absolute lg:right-6 lg:top-1/2 lg:-translate-y-1/2 z-0">
                <img
                  src="/images/about/partnership-handshake.svg"
                  alt="Partnership handshake"
                  className="w-[80%] max-w-[340px] sm:max-w-[420px] lg:max-w-[465px] h-auto object-contain block pointer-events-none select-none"
                />
              </div>

            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 5: WHY PARTNER */}
          {/* ========================================================================= */}
          <section
            aria-label="Why Partner With Partner"
            className="mt-14 sm:mt-20 lg:mt-[156px]"
          >
            {/* Centered Heading with Yellow Flanking Lines */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 text-center">
              <span
                aria-hidden="true"
                className="w-[32px] sm:w-[50px] lg:w-[70px] h-[2px] bg-[#FFB800] rounded-full shrink-0"
              />
              <h2 className="font-bold text-[26px] sm:text-[34px] lg:text-[40px] leading-[34px] sm:leading-[44px] lg:leading-[48px] text-[#111827] whitespace-normal sm:whitespace-nowrap">
                Why Partner With Partner
              </h2>
              <span
                aria-hidden="true"
                className="w-[32px] sm:w-[50px] lg:w-[70px] h-[2px] bg-[#FFB800] rounded-full shrink-0"
              />
            </div>

            {/* 4 Feature Columns */}
            {/* Desktop: 4 columns with thin 1px #E5E7EB dividers. Tablet: 2x2 grid. Phone: 1 column rows. */}
            <div className="mt-10 sm:mt-12 lg:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-[#E5E7EB]">

              {/* Feature 1 */}
              <div className="flex flex-row sm:flex-col items-start gap-4 sm:gap-0 lg:px-6 xl:px-7 first:pl-0">
                <div className="w-[56px] h-[56px] sm:w-[68px] sm:h-[68px] rounded-[16px] bg-[#FFF1D6] flex items-center justify-center shrink-0">
                  <Store size={32} className="text-[#F59E0B] stroke-[1.75]" />
                </div>
                <div className="flex flex-col">
                  <h3 className="sm:mt-5 font-bold text-[18px] leading-[24px] text-[#111827]">
                    Reach More Customers
                  </h3>
                  <p className="mt-1.5 sm:mt-2 font-normal text-[15px] sm:text-[16px] leading-[22px] sm:leading-[24px] text-[#6B7280]">
                    Get discovered by thousands of local shoppers looking for everyday essentials.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-row sm:flex-col items-start gap-4 sm:gap-0 lg:px-6 xl:px-7">
                <div className="w-[56px] h-[56px] sm:w-[68px] sm:h-[68px] rounded-[16px] bg-[#FFF1D6] flex items-center justify-center shrink-0">
                  <TrendingUp size={32} className="text-[#F59E0B] stroke-[1.75]" />
                </div>
                <div className="flex flex-col">
                  <h3 className="sm:mt-5 font-bold text-[18px] leading-[24px] text-[#111827]">
                    Grow Your Sales
                  </h3>
                  <p className="mt-1.5 sm:mt-2 font-normal text-[15px] sm:text-[16px] leading-[22px] sm:leading-[24px] text-[#6B7280]">
                    List your products, manage your inventory and increase your business visibility.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-row sm:flex-col items-start gap-4 sm:gap-0 lg:px-6 xl:px-7">
                <div className="w-[56px] h-[56px] sm:w-[68px] sm:h-[68px] rounded-[16px] bg-[#FFF1D6] flex items-center justify-center shrink-0">
                  <ShieldCheck size={32} className="text-[#F59E0B] stroke-[1.75]" />
                </div>
                <div className="flex flex-col">
                  <h3 className="sm:mt-5 font-bold text-[18px] leading-[24px] text-[#111827]">
                    Trusted & Secure
                  </h3>
                  <p className="mt-1.5 sm:mt-2 font-normal text-[15px] sm:text-[16px] leading-[22px] sm:leading-[24px] text-[#6B7280]">
                    Enjoy a reliable platform, secure transactions and full support at every step.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-row sm:flex-col items-start gap-4 sm:gap-0 lg:px-6 xl:px-7 last:pr-0">
                <div className="w-[56px] h-[56px] sm:w-[68px] sm:h-[68px] rounded-[16px] bg-[#FFF1D6] flex items-center justify-center shrink-0">
                  <Users size={32} className="text-[#F59E0B] stroke-[1.75]" />
                </div>
                <div className="flex flex-col">
                  <h3 className="sm:mt-5 font-bold text-[18px] leading-[24px] text-[#111827]">
                    Be Part of a Bigger Community
                  </h3>
                  <p className="mt-1.5 sm:mt-2 font-normal text-[15px] sm:text-[16px] leading-[22px] sm:leading-[24px] text-[#6B7280]">
                    Work with a growing network of local stores, vendors and supporting partners.
                  </p>
                </div>
              </div>

            </div>
          </section>

        </div>
      </main>

      {/* Global Footer (Unchanged) */}
      <Footer />
    </div>
  );
}
