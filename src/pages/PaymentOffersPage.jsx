import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  CreditCard,
  Wallet,
  Copy,
  Check,
  Tag,
  ShoppingCart,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { bankOffers, walletOffers } from "../data/paymentOffersData";

export default function PaymentOffersPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("all-offers");
  const [copiedCode, setCopiedCode] = useState(null);
  const [liveAnnouncement, setLiveAnnouncement] = useState("");

  const hasBankOffers = Array.isArray(bankOffers) && bankOffers.length > 0;
  const hasWalletOffers = Array.isArray(walletOffers) && walletOffers.length > 0;

  // Measure sticky navbar height + 16px offset
  const getNavOffset = useCallback(() => {
    const header = document.querySelector("header");
    return (header ? header.offsetHeight : 106) + 16;
  }, []);

  const scrollToElement = useCallback(
    (el, smooth = true) => {
      if (!el) return;
      const offset = getNavOffset();
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({
        top: Math.max(0, top),
        behavior: smooth ? "smooth" : "auto",
      });
    },
    [getNavOffset]
  );

  // Handle hash scrolling on route change or hash change
  useEffect(() => {
    const handleScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const targetId = hash.replace(/^#/, "");
        if (targetId === "all-offers") {
          const topEl = document.getElementById("offers-content-start");
          if (topEl) {
            scrollToElement(topEl, true);
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          setActiveTab("all-offers");
        } else {
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            scrollToElement(targetEl, true);
            setActiveTab(targetId);
          }
        }
      } else {
        window.scrollTo(0, 0);
        setActiveTab("all-offers");
      }
    };

    const timer = setTimeout(handleScroll, 80);
    window.addEventListener("hashchange", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", handleScroll);
    };
  }, [location.pathname, location.hash, scrollToElement]);

  // IntersectionObserver: active tab follows section in view
  useEffect(() => {
    const bankSection = document.getElementById("bank-offers");
    const walletSection = document.getElementById("wallet-cashback");
    const sections = [
      { id: "bank-offers", el: bankSection },
      { id: "wallet-cashback", el: walletSection },
    ].filter((s) => s.el);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // When near top of page, set "all-offers"
        if (window.pageYOffset < 280) {
          setActiveTab("all-offers");
          return;
        }

        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          const navOffset = getNavOffset();
          intersecting.sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top - navOffset) -
              Math.abs(b.boundingClientRect.top - navOffset)
          );
          setActiveTab(intersecting[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-120px 0px -40% 0px",
        threshold: [0.1, 0.4],
      }
    );

    sections.forEach((s) => observer.observe(s.el));
    return () => observer.disconnect();
  }, [hasBankOffers, hasWalletOffers, getNavOffset]);

  // Tab click handler
  const handleTabClick = (e, tabId) => {
    e.preventDefault();
    if (tabId === "all-offers") {
      const topEl = document.getElementById("offers-content-start");
      if (topEl) {
        scrollToElement(topEl, true);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      setActiveTab("all-offers");
      window.history.pushState(null, "", window.location.pathname);
    } else {
      const targetEl = document.getElementById(tabId);
      if (targetEl) {
        scrollToElement(targetEl, true);
        setActiveTab(tabId);
        window.history.pushState(null, "", `#${tabId}`);
      }
    }
  };

  // Copy code with clipboard API & textarea fallback
  const handleCopyCode = (code) => {
    const announceSuccess = () => {
      setCopiedCode(code);
      setLiveAnnouncement(`Code ${code} copied`);
      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(code)
        .then(announceSuccess)
        .catch(() => fallbackCopy(code, announceSuccess));
    } else {
      fallbackCopy(code, announceSuccess);
    }
  };

  const fallbackCopy = (text, callback) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      if (successful) {
        callback();
      }
    } catch {
      // Ignore
    }
  };

  // Render Offer Card
  const renderOfferCard = (offer, type) => {
    const isBank = type === "bank";
    const titleColor = isBank ? "#9C000E" : "#FF9F53";
    const topGradient = isBank
      ? "linear-gradient(101deg, #FFE0E3 20%, #FFB4E2 100%)"
      : "linear-gradient(101deg, #FFF4DA 20%, #FFE2B0 100%)";
    const labelText = isBank ? "PAY SMART" : "REWARDS";
    const IconComponent = isBank ? CreditCard : Wallet;
    const isCopied = copiedCode === offer.code;

    return (
      <article
        key={offer.id || offer.code}
        style={{
          border: "0.8px solid #E7E8E5",
          borderRadius: "24px",
          fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
        }}
        className="bg-white overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md"
      >
        {/* Top Area: height 104px, padding 22px 24px, gradient background */}
        <div
          style={{
            height: "104px",
            padding: "22px 24px",
            background: topGradient,
            boxSizing: "border-box",
          }}
          className="flex items-center justify-between shrink-0"
        >
          {/* Left: label + headline */}
          <div className="flex flex-col justify-center min-w-0 pr-2">
            <span
              style={{
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "1.6px",
                color: "#667085",
              }}
              className="uppercase leading-tight"
            >
              {labelText}
            </span>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 800,
                letterSpacing: "-0.6px",
                color: titleColor,
              }}
              className="mt-1 leading-tight truncate"
            >
              {offer.headline}
            </span>
          </div>

          {/* Right: 48x48 icon box, radius 16px, background #FFFFFFB3 */}
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "16px",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
            }}
            className="flex items-center justify-center shrink-0 shadow-xs"
          >
            <IconComponent size={22} style={{ color: titleColor }} strokeWidth={2.2} />
          </div>
        </div>

        {/* Body: padding 20px 24px 22px, gap 14px */}
        <div
          style={{ padding: "20px 24px 22px" }}
          className="flex flex-col gap-[14px] flex-1 justify-between"
        >
          {/* Upper details group */}
          <div className="flex flex-col gap-[14px]">
            {/* Offer / Card Name */}
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 800,
                color: "#101828",
              }}
              className="m-0 leading-snug"
            >
              {offer.name}
            </h3>

            {/* Details lines with 6px yellow dot */}
            {Array.isArray(offer.details) && offer.details.length > 0 && (
              <div className="flex flex-col gap-2">
                {offer.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "999px",
                        backgroundColor: "#F5B800",
                      }}
                      className="shrink-0"
                    />
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#475467",
                      }}
                      className="leading-tight"
                    >
                      {detail}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* CODE BOX: border 1.5px dashed #F5E3B0, background #FFF8E6, radius 14px */}
            <div
              style={{
                border: "1.5px dashed #F5E3B0",
                backgroundColor: "#FFF8E6",
                borderRadius: "14px",
                padding: "10px 10px 10px 16px",
              }}
              className="flex items-center justify-between gap-2"
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  color: "#101828",
                }}
                className="font-mono tracking-wider select-all truncate"
              >
                {offer.code}
              </span>

              {/* Yellow pill button "Copy" / "Copied" */}
              <button
                type="button"
                onClick={() => handleCopyCode(offer.code)}
                aria-label={`Copy coupon code ${offer.code}`}
                style={{
                  backgroundColor: "#F5B800",
                  color: "#101828",
                  fontSize: "12px",
                  fontWeight: 800,
                  padding: "8px 14px",
                  borderRadius: "999px",
                }}
                className="flex items-center gap-1.5 shrink-0 cursor-pointer transition-transform active:scale-95 hover:brightness-105 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#101828] focus-visible:ring-offset-2"
              >
                {isCopied ? (
                  <>
                    <Check size={14} className="stroke-[2.5]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} className="stroke-[2.5]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer row: Valid till + View T&C */}
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#667085",
            }}
            className="flex items-center justify-between pt-2 border-t border-[#F2F4F7]"
          >
            <span>Valid till {offer.validTill}</span>
            <Link
              to={offer.termsUrl || "/terms"}
              style={{ color: "#2F6842" }}
              className="font-bold hover:underline transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#2F6842] rounded-xs"
            >
              View T&C
            </Link>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div
      style={{
        fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
        color: "#101828",
      }}
      className="min-h-screen flex flex-col bg-[#FFFFFF]"
    >
      {/* Screen Reader Announcement for Clipboard */}
      <div aria-live="polite" className="sr-only">
        {liveAnnouncement}
      </div>

      <Navbar />

      <main className="flex-1 w-full">
        {/* b) HEADER BAND */}
        <section
          style={{
            background: "linear-gradient(180deg, #FFF6DB, #FFFBF0)",
            borderBottom: "0.8px solid #F5E3B0",
          }}
          className="w-full px-6 sm:px-12 lg:px-[112px] pt-[28px] pb-[36px] sm:pb-[44px]"
        >
          <div className="max-w-[1216px] mx-auto flex flex-col gap-[18px]">
            {/* Breadcrumb: Home / Payment offers */}
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-[12px] font-semibold text-[#667085]">
                <li>
                  <Link
                    to="/"
                    className="hover:text-[#101828] transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#101828] rounded-xs"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-[#98A2B3]">
                  /
                </li>
                <li aria-current="page" className="text-[#101828]">
                  Payment offers
                </li>
              </ol>
            </nav>

            {/* Eyebrow */}
            <span
              style={{
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "1.6px",
                color: "#936D00",
              }}
              className="uppercase leading-none"
            >
              PAYMENT OFFERS
            </span>

            {/* H1 */}
            <h1
              style={{
                letterSpacing: "-1.6px",
              }}
              className="font-extrabold text-[32px] sm:text-[38px] md:text-[44px] leading-[40px] sm:leading-[46px] md:leading-[52px] text-[#101828] m-0"
            >
              Bank offers &amp;{" "}
              <span style={{ color: "#D49400" }}>wallet cashback</span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: "16px",
                lineHeight: "26px",
                fontWeight: 500,
                color: "#475467",
                maxWidth: "600px",
              }}
              className="m-0"
            >
              Save more on every order when you pay with selected banks and wallets.
            </p>

            {/* Tab Switch Track */}
            <div className="pt-2">
              <div
                role="tablist"
                aria-label="Payment Offer Categories"
                style={{
                  backgroundColor: "#FFE9A8",
                  borderRadius: "999px",
                  padding: "4px",
                }}
                className="inline-flex items-center gap-1 max-w-full overflow-x-auto no-scrollbar"
              >
                {/* Tab: All offers */}
                <a
                  href="#all-offers"
                  role="tab"
                  aria-selected={activeTab === "all-offers"}
                  aria-current={activeTab === "all-offers" ? "page" : undefined}
                  onClick={(e) => handleTabClick(e, "all-offers")}
                  style={{
                    backgroundColor: activeTab === "all-offers" ? "#F5B800" : "transparent",
                    color: "#101828",
                    fontWeight: activeTab === "all-offers" ? 800 : 600,
                    padding: "10px 18px",
                    fontSize: "13px",
                    borderRadius: "999px",
                  }}
                  className="whitespace-nowrap transition-colors select-none cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#101828] focus-visible:ring-offset-2"
                >
                  All offers
                </a>

                {/* Tab: Bank offers */}
                {hasBankOffers && (
                  <a
                    href="#bank-offers"
                    role="tab"
                    aria-selected={activeTab === "bank-offers"}
                    aria-current={activeTab === "bank-offers" ? "page" : undefined}
                    onClick={(e) => handleTabClick(e, "bank-offers")}
                    style={{
                      backgroundColor: activeTab === "bank-offers" ? "#F5B800" : "transparent",
                      color: "#101828",
                      fontWeight: activeTab === "bank-offers" ? 800 : 600,
                      padding: "10px 18px",
                      fontSize: "13px",
                      borderRadius: "999px",
                    }}
                    className="whitespace-nowrap transition-colors select-none cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#101828] focus-visible:ring-offset-2"
                  >
                    Bank offers
                  </a>
                )}

                {/* Tab: Wallet cashback */}
                {hasWalletOffers && (
                  <a
                    href="#wallet-cashback"
                    role="tab"
                    aria-selected={activeTab === "wallet-cashback"}
                    aria-current={activeTab === "wallet-cashback" ? "page" : undefined}
                    onClick={(e) => handleTabClick(e, "wallet-cashback")}
                    style={{
                      backgroundColor: activeTab === "wallet-cashback" ? "#F5B800" : "transparent",
                      color: "#101828",
                      fontWeight: activeTab === "wallet-cashback" ? 800 : 600,
                      padding: "10px 18px",
                      fontSize: "13px",
                      borderRadius: "999px",
                    }}
                    className="whitespace-nowrap transition-colors select-none cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#101828] focus-visible:ring-offset-2"
                  >
                    Wallet cashback
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Anchor marker for top of list */}
        <div id="offers-content-start" className="w-full h-0" />

        {/* c) BODY: padding 56px 112px 72px; flex column; gap 56px */}
        <div className="w-full px-6 sm:px-12 lg:px-[112px] pt-[40px] sm:pt-[56px] pb-[72px]">
          <div className="max-w-[1216px] mx-auto flex flex-col gap-[48px] sm:gap-[56px]">
            {/* 1. BANK OFFERS SECTION */}
            {hasBankOffers && (
              <section
                id="bank-offers"
                aria-labelledby="heading-bank-offers"
                style={{ scrollMarginTop: "126px" }}
                className="w-full flex flex-col gap-6"
              >
                {/* Section Header */}
                <div className="flex flex-col gap-1 text-left">
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      letterSpacing: "1.6px",
                      color: "#936D00",
                    }}
                    className="uppercase leading-none"
                  >
                    PAY SMART
                  </span>
                  <h2
                    id="heading-bank-offers"
                    style={{
                      fontSize: "26px",
                      fontWeight: 800,
                      letterSpacing: "-0.9px",
                      color: "#101828",
                    }}
                    className="mt-1 leading-snug"
                  >
                    Bank offers
                  </h2>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#667085",
                    }}
                    className="m-0"
                  >
                    Extra savings on credit and debit cards.
                  </p>
                </div>

                {/* 3 Equal Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bankOffers.map((offer) => renderOfferCard(offer, "bank"))}
                </div>
              </section>
            )}

            {/* 2. WALLET CASHBACK SECTION */}
            {hasWalletOffers && (
              <section
                id="wallet-cashback"
                aria-labelledby="heading-wallet-cashback"
                style={{ scrollMarginTop: "126px" }}
                className="w-full flex flex-col gap-6"
              >
                {/* Section Header */}
                <div className="flex flex-col gap-1 text-left">
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      letterSpacing: "1.6px",
                      color: "#936D00",
                    }}
                    className="uppercase leading-none"
                  >
                    REWARDS
                  </span>
                  <h2
                    id="heading-wallet-cashback"
                    style={{
                      fontSize: "26px",
                      fontWeight: 800,
                      letterSpacing: "-0.9px",
                      color: "#101828",
                    }}
                    className="mt-1 leading-snug"
                  >
                    Wallet cashback
                  </h2>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#667085",
                    }}
                    className="m-0"
                  >
                    Get cashback in your wallet on eligible orders.
                  </p>
                </div>

                {/* 3 Equal Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {walletOffers.map((offer) => renderOfferCard(offer, "wallet"))}
                </div>
              </section>
            )}

            {/* If both lists are empty */}
            {!hasBankOffers && !hasWalletOffers && (
              <div
                style={{
                  border: "0.8px solid #E7E8E5",
                  borderRadius: "24px",
                  padding: "48px 24px",
                }}
                className="w-full text-center bg-[#F9FAFB]"
              >
                <p className="text-[15px] font-semibold text-[#667085]">
                  No payment offers currently active. Check back soon!
                </p>
              </div>
            )}

            {/* 3. "HOW TO USE AN OFFER" PANEL */}
            <section
              aria-labelledby="heading-how-to-use"
              style={{
                backgroundColor: "#F9FAFB",
                border: "0.8px solid #E7E8E5",
                borderRadius: "24px",
                padding: "32px 36px",
              }}
              className="w-full flex flex-col gap-[22px]"
            >
              <h2
                id="heading-how-to-use"
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                  color: "#101828",
                }}
                className="m-0"
              >
                How to use an offer
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                {/* STEP 1 */}
                <div className="flex flex-col gap-2 items-start text-left">
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "14px",
                      backgroundColor: "#FFF4DA",
                    }}
                    className="flex items-center justify-center shrink-0 mb-1"
                  >
                    <Tag size={20} style={{ color: "#936D00" }} strokeWidth={2.2} />
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      color: "#D49400",
                    }}
                    className="uppercase leading-tight"
                  >
                    STEP 1
                  </span>
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: 800,
                      color: "#101828",
                    }}
                    className="m-0 leading-tight"
                  >
                    Pick an offer
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      lineHeight: "20px",
                      fontWeight: 500,
                      color: "#475467",
                    }}
                    className="m-0"
                  >
                    Copy the code of the offer you like.
                  </p>
                </div>

                {/* STEP 2 */}
                <div className="flex flex-col gap-2 items-start text-left">
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "14px",
                      backgroundColor: "#FFF4DA",
                    }}
                    className="flex items-center justify-center shrink-0 mb-1"
                  >
                    <ShoppingCart size={20} style={{ color: "#936D00" }} strokeWidth={2.2} />
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      color: "#D49400",
                    }}
                    className="uppercase leading-tight"
                  >
                    STEP 2
                  </span>
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: 800,
                      color: "#101828",
                    }}
                    className="m-0 leading-tight"
                  >
                    Add items to cart
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      lineHeight: "20px",
                      fontWeight: 500,
                      color: "#475467",
                    }}
                    className="m-0"
                  >
                    Shop as usual and go to checkout.
                  </p>
                </div>

                {/* STEP 3 */}
                <div className="flex flex-col gap-2 items-start text-left">
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "14px",
                      backgroundColor: "#FFF4DA",
                    }}
                    className="flex items-center justify-center shrink-0 mb-1"
                  >
                    <CheckCircle2 size={20} style={{ color: "#936D00" }} strokeWidth={2.2} />
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      color: "#D49400",
                    }}
                    className="uppercase leading-tight"
                  >
                    STEP 3
                  </span>
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: 800,
                      color: "#101828",
                    }}
                    className="m-0 leading-tight"
                  >
                    Pay and save
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      lineHeight: "20px",
                      fontWeight: 500,
                      color: "#475467",
                    }}
                    className="m-0"
                  >
                    Apply the code and pay with the eligible bank or wallet.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. SMALL NOTE */}
            <p
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#667085",
              }}
              className="text-center m-0 leading-relaxed px-4"
            >
              Offers are valid for a limited time and subject to the bank or wallet partner's terms. See our{" "}
              <Link
                to="/terms"
                style={{ color: "#2F6842" }}
                className="font-bold hover:underline transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#2F6842] rounded-xs"
              >
                Terms &amp; conditions
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
