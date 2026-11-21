import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FileText,
  Info,
  ReceiptText,
  Truck,
  UserRound,
  Ban,
  Copyright,
  Scale,
  Mail,
  LifeBuoy,
  Database,
  ChartColumn,
  Lock,
  Gavel,
  Fingerprint,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { legal } from "../data/legalData";

const iconMap = {
  FileText,
  Info,
  ReceiptText,
  Truck,
  UserRound,
  Ban,
  Copyright,
  Scale,
  Mail,
  LifeBuoy,
  Database,
  ChartColumn,
  Lock,
};

export default function LegalPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState("terms");
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Set document title according to pathname
  useEffect(() => {
    if (location.pathname === "/privacy") {
      document.title = "Privacy Policy | FillCarts";
    } else {
      document.title = "Terms & Conditions | FillCarts";
    }
  }, [location.pathname]);

  // Smooth scroll helper respecting prefers-reduced-motion and scroll-margin-top
  const scrollToTarget = useCallback((targetId, smooth = true) => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const behavior = !smooth || prefersReducedMotion ? "auto" : "smooth";

    isUserScrollingRef.current = true;
    setActiveId(targetId);

    el.scrollIntoView({ behavior, block: "start" });

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 1000);
  }, []);

  // Handle initial page load and route changes (/terms or /privacy or hash)
  useEffect(() => {
    let target = null;
    if (location.hash) {
      target = location.hash.replace("#", "");
    } else if (location.pathname === "/privacy") {
      target = "privacy";
    } else if (location.pathname === "/terms") {
      target = "terms";
    }

    if (target) {
      // Small timeout to allow DOM layout to complete
      const timer = setTimeout(() => {
        scrollToTarget(target, true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash, scrollToTarget]);

  // Scroll-spy observer for highlighting active sidebar item
  useEffect(() => {
    const trackedIds = [
      "terms",
      "terms-4",
      "terms-6",
      "terms-7",
      "terms-11",
      "terms-12",
      "privacy",
      "privacy-2",
      "privacy-usage",
      "privacy-4",
    ];

    const handleScroll = () => {
      if (isUserScrollingRef.current) return;

      const navOffset = 140; // Approx navbar height (102px) + extra margin
      let currentId = "terms";

      for (const id of trackedIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= navOffset) {
            currentId = id;
          }
        }
      }

      setActiveId(currentId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Handler for menu clicks
  const handleItemClick = (e, item) => {
    if (item.isRoute) {
      // Normal navigation to /contact or /support
      return;
    }

    e.preventDefault();

    if (item.target === "/terms") {
      scrollToTarget("terms", true);
      if (location.pathname !== "/terms") {
        window.history.replaceState(null, "", "/terms");
        document.title = "Terms & Conditions | FillCarts";
      }
    } else if (item.target === "/privacy") {
      scrollToTarget("privacy", true);
      if (location.pathname !== "/privacy") {
        window.history.replaceState(null, "", "/privacy");
        document.title = "Privacy Policy | FillCarts";
      }
    } else if (item.target.startsWith("#")) {
      const targetId = item.target.replace("#", "");
      scrollToTarget(targetId, true);
    }
  };

  // Determine if a menu item is active
  const isItemActive = (item) => {
    if (item.target === "/terms") {
      return (
        activeId === "terms" ||
        activeId.startsWith("terms-") &&
          !["terms-4", "terms-6", "terms-7", "terms-11", "terms-12"].includes(activeId)
      );
    }
    if (item.target === "/privacy") {
      return (
        activeId === "privacy" ||
        activeId === "privacy-1" ||
        activeId === "privacy-3" ||
        activeId === "privacy-5" ||
        activeId === "privacy-6"
      );
    }
    if (item.target.startsWith("#")) {
      const id = item.target.replace("#", "");
      return activeId === id;
    }
    return false;
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-white text-black selection:bg-[#FFE9A8] selection:text-[#101828]"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* 1. NAVBAR */}
      <Navbar />

      <main className="flex-1 w-full overflow-visible">
        {/* 2. HERO (Figma: 1440 x 316, background #111925, directly under Navbar) */}
        <section
          style={{
            backgroundColor: "#111925",
          }}
          className="w-full h-auto md:h-[316px] flex flex-col items-center justify-center text-center px-6 py-12 md:py-0 gap-4"
        >
          {/* Eyebrow */}
          <span
            style={{
              color: "#F8AB18",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "1.2px",
            }}
            className="uppercase"
          >
            LAST UPDATED: {legal.lastUpdated.toUpperCase()}
          </span>

          {/* h1 Title */}
          <h1
            style={{
              fontFamily: "Outfit, sans-serif",
              color: "#FFFFFF",
            }}
            className="text-[30px] md:text-[40px] leading-[38px] md:leading-[48px] font-semibold m-0"
          >
            {legal.hero.title}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              color: "#FFFFFF",
              fontSize: "18px",
              lineHeight: "28px",
              fontWeight: 400,
            }}
            className="text-[16px] md:text-[18px] leading-[26px] md:leading-[28px] max-w-[672px] m-0"
          >
            {legal.hero.subtitle}
          </p>
        </section>

        {/* 3. LAYOUT WRAPPER BELOW HERO */}
        {/* Figma: max-width 1120px, margin 0 auto, padding 80px 0 96px */}
        <div
          className="max-w-[1120px] mx-auto pt-10 md:pt-20 pb-24 px-5 xl:px-0 flex flex-col lg:flex-row gap-8 items-start"
        >
          {/* 4. LEFT MENU */}
          <nav
            aria-label="Legal pages"
            style={{
              backgroundColor: "#FFF6E6",
              borderRadius: "12px",
              padding: "24px 16px",
            }}
            className="w-full lg:w-[256px] shrink-0 flex flex-col lg:sticky lg:top-[126px] lg:max-h-[calc(100vh-150px)] lg:overflow-y-auto"
          >
            {legal.menu.map((group, groupIndex) => (
              <div key={group.group} className="flex flex-col">
                {/* Group Divider if not first group */}
                {groupIndex > 0 && (
                  <div
                    style={{
                      height: "1px",
                      backgroundColor: "#F1DFC0",
                      margin: "16px 0",
                    }}
                  />
                )}

                {/* Group Header */}
                <div className="mb-4">
                  <h2
                    style={{
                      fontSize: "14px",
                      lineHeight: "20px",
                      fontWeight: 600,
                      color: "#1E1E1E",
                      textTransform: "uppercase",
                    }}
                    className="m-0"
                  >
                    {group.group}
                  </h2>
                  <span
                    style={{
                      fontSize: "12px",
                      lineHeight: "16px",
                      fontWeight: 400,
                      color: "#5F5F5F",
                    }}
                  >
                    {group.sub}
                  </span>
                </div>

                {/* Group Items: Under 1024px grid 2-columns, desktop single column with 4px gap */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-1">
                  {group.items.map((item) => {
                    const IconComponent = iconMap[item.icon] || FileText;
                    const active = isItemActive(item);

                    if (item.isRoute) {
                      return (
                        <Link
                          key={item.label}
                          to={item.target}
                          style={{
                            height: "44px",
                            borderRadius: "10px",
                          }}
                          className="px-3 flex items-center gap-3 text-[15px] font-medium text-[#1E1E1E] transition-colors hover:bg-[#FFEFD0] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F8AB18] focus-visible:ring-offset-2"
                        >
                          <IconComponent
                            size={20}
                            strokeWidth={1.75}
                            className="text-[#1E1E1E] shrink-0"
                          />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    }

                    return (
                      <a
                        key={item.label}
                        href={item.target}
                        onClick={(e) => handleItemClick(e, item)}
                        aria-current={active ? "true" : undefined}
                        style={{
                          height: "44px",
                          borderRadius: "10px",
                          backgroundColor: active ? "#FFE7BA" : "transparent",
                          fontWeight: active ? 600 : 500,
                        }}
                        className={`px-3 flex items-center gap-3 text-[15px] text-[#1E1E1E] transition-colors hover:bg-[#FFEFD0] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F8AB18] focus-visible:ring-offset-2 cursor-pointer`}
                      >
                        <IconComponent
                          size={20}
                          strokeWidth={1.75}
                          className="text-[#1E1E1E] shrink-0"
                        />
                        <span className="truncate">{item.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* 5. CONTENT COLUMN (One long column: Terms & Conditions followed by Privacy Policy) */}
          <div
            className="flex-1 min-w-0 overflow-visible break-words"
            style={{
              overflowWrap: "break-word",
            }}
          >
            {/* a) SECTION: TERMS & CONDITIONS */}
            <section
              id="terms"
              style={{
                scrollMarginTop: "126px",
              }}
            >
              {/* Title row */}
              <div
                style={{
                  borderBottom: "1px solid #0052CC",
                }}
                className="flex items-center gap-3 pb-3 mb-8"
              >
                <Gavel size={28} style={{ color: "#F8AB18" }} className="shrink-0" />
                <h2
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    color: "#F8AB18",
                    fontWeight: 500,
                  }}
                  className="text-[24px] md:text-[28px] leading-[32px] md:leading-[36px] m-0"
                >
                  Terms & Conditions
                </h2>
              </div>

              {/* Clauses */}
              <div className="flex flex-col gap-8">
                {legal.terms.map((clause) => (
                  <article
                    key={clause.id}
                    id={clause.id}
                    style={{
                      scrollMarginTop: "126px",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "Outfit, sans-serif",
                        color: "#191C1E",
                        fontWeight: 600,
                      }}
                      className="text-[17px] md:text-[18px] leading-[26px] m-0"
                    >
                      {clause.title}
                    </h3>
                    {clause.paragraphs.map((p, idx) => (
                      <p
                        key={idx}
                        style={{
                          fontSize: "16px",
                          lineHeight: "26px",
                          fontWeight: 400,
                          color: "#000000",
                          marginTop: "8px",
                        }}
                        className="m-0 mt-2"
                      >
                        {p}
                      </p>
                    ))}
                  </article>
                ))}
              </div>
            </section>

            {/* b) SECTION: PRIVACY POLICY (Margin-top 96px) */}
            <section
              id="privacy"
              style={{
                scrollMarginTop: "126px",
                marginTop: "96px",
              }}
            >
              {/* Title row */}
              <div
                style={{
                  borderBottom: "1px solid #0052CC",
                }}
                className="flex items-center gap-3 pb-3 mb-8"
              >
                <Fingerprint size={28} style={{ color: "#F8AB18" }} className="shrink-0" />
                <h2
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    color: "#F8AB18",
                    fontWeight: 500,
                  }}
                  className="text-[24px] md:text-[28px] leading-[32px] md:leading-[36px] m-0"
                >
                  Privacy Policy
                </h2>
              </div>

              {/* Clauses */}
              <div className="flex flex-col gap-8">
                {legal.privacy.map((clause) => (
                  <article
                    key={clause.id}
                    id={clause.id}
                    style={{
                      scrollMarginTop: "126px",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "Outfit, sans-serif",
                        color: "#191C1E",
                        fontWeight: 600,
                      }}
                      className="text-[17px] md:text-[18px] leading-[26px] m-0"
                    >
                      {clause.title}
                    </h3>

                    {clause.paragraphs?.map((p, idx) => (
                      <p
                        key={idx}
                        style={{
                          fontSize: "16px",
                          lineHeight: "26px",
                          fontWeight: 400,
                          color: "#000000",
                          marginTop: "8px",
                        }}
                        className="m-0 mt-2"
                      >
                        {p}
                      </p>
                    ))}

                    {/* Bullet list if present */}
                    {clause.bullets && clause.bullets.length > 0 && (
                      <ul
                        style={{
                          fontSize: "16px",
                          lineHeight: "26px",
                          color: "#000000",
                          paddingLeft: "20px",
                          marginTop: "8px",
                        }}
                        className="list-disc flex flex-col gap-1.5"
                      >
                        {clause.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    )}

                    {/* Info Cards (Clause 2) */}
                    {clause.cards && clause.cards.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {clause.cards.map((card) => (
                          <div
                            key={card.id}
                            id={card.id}
                            style={{
                              border: "1px solid #E5E7EB",
                              borderRadius: "8px",
                              padding: "16px",
                              backgroundColor: "#FFFFFF",
                              scrollMarginTop: "126px",
                            }}
                            className="flex flex-col gap-2"
                          >
                            <h4
                              style={{
                                fontFamily: "Outfit, sans-serif",
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#0B3A6B",
                              }}
                              className="m-0"
                            >
                              {card.title}
                            </h4>
                            <p
                              style={{
                                fontSize: "13px",
                                lineHeight: "20px",
                                fontWeight: 400,
                                color: "#475467",
                              }}
                              className="m-0"
                            >
                              {card.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* 6. FOOTER */}
      <Footer />
    </div>
  );
}
