import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

/**
 * Reusable Footer Component (Exact Figma Specification)
 * 
 * - Full-width background: #111925
 * - Container: 1216px centered container
 * - Padding: 56px top padding, 56px between link area and bottom bar
 * - Top Area: 5-column CSS grid (359px 207px 207px 207px 1fr ~236px) with no gap on desktop
 * - Column 1 (Brand):
 *   - <Logo variant="onDark" /> (mark ~38px, "Fill" in white, "Carts" in #D49400)
 *   - Description (12px/17px, #8893A3, max 240px wide for 2-line wrap)
 *   - Social buttons: 30px rounded-10px squares, 1px border white/12, labels: "ig", "f", "x" in Manrope 700 11px #D8DDE5
 * - Columns 2-4 (Links):
 *   - Heading: Manrope 700, 13px, white
 *   - 32px below heading, stacked with 24px pitch (Manrope 400 12px/16px, color #828C9C, hover white)
 *   - Shop: Groceries, Dairy, Home essentials, Offers
 *   - Help: Track an order, FAQs, Contact us, Returns
 *   - Company: About FillCarts, Partner stores, Careers, Press
 * - Column 5 (Get the app):
 *   - Heading: Manrope 700 13px white
 *   - "Your everyday cart, now in your pocket." (11px, #828C9C)
 *   - Badges: Google Play & App Store (112x33px each, 12px gap)
 * - Bottom Bar:
 *   - 1px divider border-white/10
 *   - 50px height, items vertically centered
 *   - Left: dynamic copyright © YYYY FillCarts. All rights reserved. (10px, #788596 meeting 4.5:1 contrast)
 *   - Right: Privacy policy & Terms & conditions (10px, 22px gap, hover lighter)
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      aria-label="Site Footer"
      className="w-full text-left"
      style={{
        backgroundColor: "var(--footer-bg, #111925)",
        fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
      }}
    >
      <div className="max-w-[1216px] w-full mx-auto px-4 sm:px-6 xl:px-0 pt-[56px]">
        {/* TOP AREA: 6-COLUMN GRID */}
        <nav
          aria-label="Footer Navigation"
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[330px_145px_145px_155px_155px_1fr] items-start gap-6 sm:gap-8 md:gap-6 lg:gap-8 xl:gap-0"
        >
          {/* COLUMN 1: BRAND */}
          <div className="col-span-2 md:col-span-2 lg:col-span-4 xl:col-span-1 pr-4">
            <Logo variant="onDark" />

            <p
              className="mt-[18px] text-[12px] leading-[17px] max-w-[240px]"
              style={{
                color: "var(--footer-desc, #8893A3)",
                fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
              }}
            >
              Your everyday shopping partner. Fresh finds, trusted stores and quick delivery.
            </p>

            {/* Social Buttons: 30px rounded-10px, 8px gap */}
            <div className="mt-[24px] flex items-center gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-[30px] h-[30px] rounded-[10px] border border-white/12 bg-transparent flex items-center justify-center font-bold text-[11px] leading-none transition-colors duration-150 hover:border-white hover:text-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#111925]"
                style={{
                  color: "var(--footer-social-text, #D8DDE5)",
                  fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
                }}
              >
                ig
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-[30px] h-[30px] rounded-[10px] border border-white/12 bg-transparent flex items-center justify-center font-bold text-[11px] leading-none transition-colors duration-150 hover:border-white hover:text-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#111925]"
                style={{
                  color: "var(--footer-social-text, #D8DDE5)",
                  fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
                }}
              >
                f
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="w-[30px] h-[30px] rounded-[10px] border border-white/12 bg-transparent flex items-center justify-center font-bold text-[11px] leading-none transition-colors duration-150 hover:border-white hover:text-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#111925]"
                style={{
                  color: "var(--footer-social-text, #D8DDE5)",
                  fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
                }}
              >
                x
              </a>
            </div>
          </div>

          {/* COLUMN 2: SHOP */}
          <div>
            <h3
              className="font-bold text-[13px] leading-[18px] text-white"
              style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
            >
              Shop
            </h3>
            <ul className="mt-[32px] flex flex-col gap-[8px]">
              <li>
                <Link
                  to="/category/grocery"
                  className="font-normal text-[12px] leading-[16px] transition-colors duration-150 hover:text-white focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-xs"
                  style={{ color: "var(--footer-text, #828C9C)" }}
                >
                  Groceries
                </Link>
              </li>
              <li>
                <Link
                  to="/category/dairy"
                  className="font-normal text-[12px] leading-[16px] transition-colors duration-150 hover:text-white focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-xs"
                  style={{ color: "var(--footer-text, #828C9C)" }}
                >
                  Dairy
                </Link>
              </li>
              <li>
                <Link
                  to="/category/home-essentials"
                  className="font-normal text-[12px] leading-[16px] transition-colors duration-150 hover:text-white focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-xs"
                  style={{ color: "var(--footer-text, #828C9C)" }}
                >
                  Home essentials
                </Link>
              </li>
              <li>
                <Link
                  to="/category/offers"
                  className="font-normal text-[12px] leading-[16px] transition-colors duration-150 hover:text-white focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-xs"
                  style={{ color: "var(--footer-text, #828C9C)" }}
                >
                  Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: HELP */}
          <div>
            <h3
              className="font-bold text-[13px] leading-[18px] text-white"
              style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
            >
              Help
            </h3>
            <ul className="mt-[32px] flex flex-col gap-[8px]">
              <li>
                <Link
                  to="/profile"
                  className="font-normal text-[12px] leading-[16px] transition-colors duration-150 hover:text-white focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-xs"
                  style={{ color: "var(--footer-text, #828C9C)" }}
                >
                  Track an order
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="font-normal text-[12px] leading-[16px] transition-colors duration-150 hover:text-white focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-xs"
                  style={{ color: "var(--footer-text, #828C9C)" }}
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="font-normal text-[12px] leading-[16px] transition-colors duration-150 hover:text-white focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-xs"
                  style={{ color: "var(--footer-text, #828C9C)" }}
                >
                  Contact us
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="font-normal text-[12px] leading-[16px] transition-colors duration-150 hover:text-white focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-xs"
                  style={{ color: "var(--footer-text, #828C9C)" }}
                >
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: COMPANY */}
          <div>
            <h3
              className="font-bold text-[13px] leading-[18px] text-white"
              style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
            >
              Company
            </h3>
            <ul className="mt-[32px] flex flex-col gap-[8px]">
              <li>
                <Link
                  to="/about"
                  className="font-normal text-[12px] leading-[16px] transition-colors duration-150 hover:text-white focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-xs"
                  style={{ color: "var(--footer-text, #828C9C)" }}
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="font-normal text-[12px] leading-[16px] transition-colors duration-150 hover:text-white focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-xs"
                  style={{ color: "var(--footer-text, #828C9C)" }}
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="font-normal text-[12px] leading-[16px] transition-colors duration-150 hover:text-white focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-xs"
                  style={{ color: "var(--footer-text, #828C9C)" }}
                >
                  Contact us
                </Link>
              </li>
              <li>
                <Link
                  to="/stores"
                  className="font-normal text-[12px] leading-[16px] transition-colors duration-150 hover:text-white focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-xs"
                  style={{ color: "var(--footer-text, #828C9C)" }}
                >
                  Partner stores
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="font-normal text-[12px] leading-[16px] transition-colors duration-150 hover:text-white focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-xs"
                  style={{ color: "var(--footer-text, #828C9C)" }}
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="font-normal text-[12px] leading-[16px] transition-colors duration-150 hover:text-white focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-xs"
                  style={{ color: "var(--footer-text, #828C9C)" }}
                >
                  Terms & conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="font-normal text-[12px] leading-[16px] transition-colors duration-150 hover:text-white focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-xs"
                  style={{ color: "var(--footer-text, #828C9C)" }}
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="font-normal text-[12px] leading-[16px] transition-colors duration-150 hover:text-white focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-xs"
                  style={{ color: "var(--footer-text, #828C9C)" }}
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 5: PARTNER */}
          <div>
            <h3
              className="font-bold text-[13px] leading-[18px] text-white"
              style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
            >
              Partner
            </h3>
            <ul className="mt-[32px] flex flex-col gap-[8px]">
              <li>
                <Link
                  to="/become-vendor"
                  className="font-normal text-[12px] leading-[16px] transition-colors duration-150 hover:text-white focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-xs"
                  style={{ color: "var(--footer-text, #828C9C)" }}
                >
                  Become a vendor
                </Link>
              </li>
              <li>
                <Link
                  to="/become-rider"
                  className="font-normal text-[12px] leading-[16px] transition-colors duration-150 hover:text-white focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-xs"
                  style={{ color: "var(--footer-text, #828C9C)" }}
                >
                  Become a rider
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 6: GET THE APP */}
          <div className="w-full">
            <h3
              className="font-bold text-[13px] leading-[18px] text-white"
              style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
            >
              Get the app
            </h3>
            <p
              className="mt-[12px] text-[11px] leading-[16px]"
              style={{
                color: "var(--footer-text, #828C9C)",
                fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
              }}
            >
              Your everyday cart, now in your pocket.
            </p>

            {/* Badges: Google Play & App Store (112x33 each, 12px gap) */}
            <div className="mt-[18px] flex items-center gap-[12px] flex-wrap sm:flex-nowrap">
              <a
                href="#google-play"
                aria-label="GET IT ON Google Play"
                className="w-[112px] h-[33px] shrink-0 rounded-[5px] overflow-hidden transition-opacity hover:opacity-90 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
              >
                <img
                  src="/images/icons/google-play-badge.svg"
                  alt="GET IT ON Google Play"
                  width={112}
                  height={33}
                  loading="lazy"
                  decoding="async"
                  className="w-[112px] h-[33px] block select-none"
                />
              </a>
              <a
                href="#app-store"
                aria-label="Download on the App Store"
                className="w-[112px] h-[33px] shrink-0 rounded-[5px] overflow-hidden transition-opacity hover:opacity-90 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
              >
                <img
                  src="/images/icons/app-store-badge.svg"
                  alt="Download on the App Store"
                  width={112}
                  height={33}
                  loading="lazy"
                  decoding="async"
                  className="w-[112px] h-[33px] block select-none"
                />
              </a>
            </div>
          </div>
        </nav>

        {/* BOTTOM BAR (56px space from links, 1px divider, 50px height) */}
        <div
          className="mt-[56px] min-h-[50px] py-4 sm:py-0 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 select-none"
          style={{
            borderColor: "var(--footer-divider, rgba(255, 255, 255, 0.1))",
          }}
        >
          {/* Left Copyright */}
          <div
            className="text-[10px] leading-[15px]"
            style={{
              color: "var(--footer-copyright, #788596)",
              fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
            }}
          >
            © {currentYear} FillCarts. All rights reserved.
          </div>

          {/* Right Legal Links (22px gap) */}
          <div className="flex items-center gap-[22px]">
            <Link
              to="/privacy"
              className="text-[10px] leading-[15px] transition-colors duration-150 hover:text-[#D8DDE5] focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-xs"
              style={{
                color: "var(--footer-copyright, #788596)",
                fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
              }}
            >
              Privacy policy
            </Link>
            <Link
              to="/terms"
              className="text-[10px] leading-[15px] transition-colors duration-150 hover:text-[#D8DDE5] focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-xs"
              style={{
                color: "var(--footer-copyright, #788596)",
                fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
              }}
            >
              Terms & conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
