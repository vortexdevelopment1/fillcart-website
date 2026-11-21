import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ShoppingBag,
  Wallet,
  RotateCcw,
  Truck,
  User,
  Search,
  X,
  ChevronDown,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle2,
  LifeBuoy,
  Send,
  HelpCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { faqCategories, supportContact } from "../data/faqData";

/** Helper to render category icon */
function getCategoryIcon(iconName, isActive) {
  const iconProps = {
    size: 20,
    className: isActive ? "text-[#101828]" : "text-[#936D00]",
  };

  switch (iconName) {
    case "bag":
      return <ShoppingBag {...iconProps} />;
    case "wallet":
      return <Wallet {...iconProps} />;
    case "refresh":
      return <RotateCcw {...iconProps} />;
    case "truck":
      return <Truck {...iconProps} />;
    case "user":
    default:
      return <User {...iconProps} />;
  }
}

/** Helper to highlight matched query words */
function HighlightText({ text, query }) {
  if (!query || !query.trim()) return <span>{text}</span>;

  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            style={{ backgroundColor: "#FFE9A8", color: "#101828" }}
            className="rounded-[3px] px-[2px] py-[1px] font-bold"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export default function SupportPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Category state
  const paramCategory = searchParams.get("category");
  const [activeCategoryId, setActiveCategoryId] = useState(() => {
    if (paramCategory && faqCategories.some((c) => c.id === paramCategory)) {
      return paramCategory;
    }
    return faqCategories[0]?.id || "orders";
  });

  // Search input state
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const searchInputRef = useRef(null);

  // Accordion state (single open item per view)
  const [openItemId, setOpenItemId] = useState(() => {
    const initialCat = faqCategories.find((c) => c.id === activeCategoryId);
    return initialCat?.items[0]?.id || "";
  });

  // Local feedback state: { [itemId]: boolean }
  const [feedbackGiven, setFeedbackGiven] = useState({});

  // Ticket Modal & Live Chat Drawer state
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showLiveChatDrawer, setShowLiveChatDrawer] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "Orders & Delivery",
    orderId: "",
    description: "",
  });
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // Live Chat simulation state
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      text: "Hello! Welcome to FillCarts Support. How can we help you today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Sync category with URL if category param changes
  useEffect(() => {
    if (paramCategory && faqCategories.some((c) => c.id === paramCategory)) {
      setActiveCategoryId(paramCategory);
      const cat = faqCategories.find((c) => c.id === paramCategory);
      setOpenItemId(cat?.items[0]?.id || "");
    }
  }, [paramCategory]);

  // Sync search query from URL
  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Handle Search Input Change & Update URL without history spam
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set("q", val);
      setOpenItemId(""); // start with clean state
    } else {
      newParams.delete("q");
      const currentCat = faqCategories.find((c) => c.id === activeCategoryId);
      setOpenItemId(currentCat?.items[0]?.id || "");
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleClearSearch = () => {
    handleSearchChange("");
    searchInputRef.current?.focus();
  };

  const handlePopularChipClick = (text) => {
    handleSearchChange(text);
  };

  // Switch category
  const handleSelectCategory = (catId) => {
    setActiveCategoryId(catId);
    const cat = faqCategories.find((c) => c.id === catId);
    setOpenItemId(cat?.items[0]?.id || "");

    // Clear search if switching category
    if (searchQuery) {
      setSearchQuery("");
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("q");
      newParams.set("category", catId);
      setSearchParams(newParams, { replace: true });
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("category", catId);
      setSearchParams(newParams, { replace: true });
    }
  };

  // Keyboard navigation for tablist
  const handleTabKeyDown = (e, index) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (index + 1) % faqCategories.length;
      handleSelectCategory(faqCategories[nextIndex].id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex =
        (index - 1 + faqCategories.length) % faqCategories.length;
      handleSelectCategory(faqCategories[prevIndex].id);
    }
  };

  // Filtered results across all categories
  const isSearchMode = searchQuery.trim().length > 0;
  const searchResults = useMemo(() => {
    if (!isSearchMode) return [];
    const q = searchQuery.trim().toLowerCase();

    const matches = [];
    faqCategories.forEach((cat) => {
      cat.items.forEach((item) => {
        if (
          item.q.toLowerCase().includes(q) ||
          item.a.toLowerCase().includes(q)
        ) {
          matches.push({
            ...item,
            categoryLabel: cat.label,
            categoryId: cat.id,
          });
        }
      });
    });
    return matches;
  }, [searchQuery, isSearchMode]);

  const activeCategory =
    faqCategories.find((c) => c.id === activeCategoryId) || faqCategories[0];

  // Ticket submission handler
  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
      alert("Please fill in subject and description.");
      return;
    }
    setTicketSubmitted(true);
  };

  // Chat message send handler
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");

    setTimeout(() => {
      let botReply =
        "Thank you for contacting FillCarts support. A specialist is reviewing your account details and will connect in 30 seconds.";
      const lower = userText.toLowerCase();
      if (lower.includes("track") || lower.includes("order")) {
        botReply =
          "You can track your order live under 'My Orders' in your profile. Your rider is currently fulfilling your delivery!";
      } else if (lower.includes("refund")) {
        botReply =
          "Refunds for eligible cancellations are credited to your original payment method within 3-5 business days.";
      } else if (lower.includes("cancel")) {
        botReply =
          "Orders can be cancelled before store preparation begins. You can check order status in your profile.";
      }
      setChatMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    }, 700);
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-white text-[#101828] selection:bg-[#FFE9A8] selection:text-[#101828]"
      style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
    >
      <Navbar />

      <main className="flex-1 w-full">
        {/* 1. HERO SECTION (Full width, gradient) */}
        <section
          style={{
            background: "linear-gradient(180deg, #FFF6DB 0%, #FFFBF0 100%)",
            borderBottom: "0.8px solid #F5E3B0",
          }}
          className="w-full px-5 sm:px-8 md:px-12 lg:px-[112px] pt-[40px] sm:pt-[56px] pb-[36px] sm:pb-[48px] flex flex-col items-center text-center gap-4"
        >
          {/* Eyebrow */}
          <div
            style={{
              color: "#936D00",
              letterSpacing: "1.6px",
            }}
            className="text-[10px] font-extrabold uppercase"
          >
            HELP CENTRE
          </div>

          {/* h1 Title */}
          <h1
            style={{
              letterSpacing: "-1.8px",
            }}
            className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] md:text-[46px] md:leading-[54px] font-extrabold text-[#101828]"
          >
            How can we <span style={{ color: "#D49400" }}>help you?</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[15px] sm:text-[16px] leading-[24px] sm:leading-[26px] font-medium text-[#475467] max-w-[560px]">
            Find quick answers about orders, payments, returns and delivery, or get
            in touch with our team.
          </p>

          {/* SEARCH BAR (640px, rounded-full, border, yellow button) */}
          <div
            role="search"
            style={{
              border: "0.8px solid #F5E3B0",
              boxShadow: "0 4px 14px rgba(245, 184, 0, 0.12)",
            }}
            className="w-full max-w-[640px] h-[56px] bg-white rounded-full pl-[18px] sm:pl-[22px] pr-[8px] flex items-center gap-3 transition-shadow focus-within:ring-2 focus-within:ring-[#F5B800]"
          >
            <Search size={18} className="text-[#667085] shrink-0" aria-hidden="true" />

            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  handleClearSearch();
                }
              }}
              placeholder="Search for answers, e.g. “refund”"
              className="flex-1 bg-transparent border-none outline-none text-[14px] font-semibold text-[#101828] placeholder-[#98A2B3]"
              aria-label="Search FAQ answers"
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#667085] hover:bg-slate-100 transition-colors cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800]"
                aria-label="Clear search query"
              >
                <X size={16} />
              </button>
            )}

            {/* Search Action Pill Button */}
            <button
              type="button"
              onClick={() => searchInputRef.current?.focus()}
              style={{
                backgroundColor: "#F5B800",
                color: "#101828",
              }}
              className="rounded-full px-[18px] sm:px-[24px] py-[11px] text-[13px] font-extrabold leading-none hover:bg-[#e5ac00] transition-colors cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#101828]"
            >
              <span className="hidden sm:inline">Search</span>
              <Search size={15} className="sm:hidden" />
            </button>
          </div>

          {/* POPULAR CHIPS ROW */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-1 text-[12px] font-bold">
            <span className="text-[#667085]">Popular:</span>
            {[
              "Track my order",
              "Cancel an order",
              "Refund status",
              "Change address",
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handlePopularChipClick(chip)}
                style={{
                  border: "0.8px solid #F5E3B0",
                }}
                className="bg-white hover:bg-[#FFF4DA] text-[#101828] rounded-full px-[14px] py-[7px] text-[12px] font-bold transition-colors cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800]"
              >
                {chip}
              </button>
            ))}
          </div>
        </section>

        {/* 2. CATEGORY CARDS (Hidden active state during search) */}
        <section className="w-full px-5 sm:px-8 md:px-12 lg:px-[112px] pt-[36px] sm:pt-[48px]">
          <div className="max-w-[1216px] mx-auto">
            <div
              role="tablist"
              aria-label="FAQ Categories"
              className="flex lg:grid lg:grid-cols-5 gap-[13px] overflow-x-auto pb-2 lg:pb-0 scrollbar-none snap-x snap-mandatory"
              style={{ scrollbarWidth: "none" }}
            >
              {faqCategories.map((cat, idx) => {
                const isActive = !isSearchMode && activeCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    role="tab"
                    id={`tab-${cat.id}`}
                    aria-controls={`panel-${cat.id}`}
                    aria-selected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => handleSelectCategory(cat.id)}
                    onKeyDown={(e) => handleTabKeyDown(e, idx)}
                    style={{
                      border: isActive
                        ? "1.5px solid #F5B800"
                        : "0.8px solid #E7E8E5",
                      backgroundColor: isActive ? "#FFF4DA" : "#FFFFFF",
                      borderRadius: "18px",
                    }}
                    className="min-w-[168px] flex-1 p-[20px] flex flex-col gap-[12px] text-left transition-all hover:border-[#F5E3B0] cursor-pointer snap-start focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800] focus-visible:ring-offset-2"
                  >
                    {/* Icon Box */}
                    <div
                      style={{
                        backgroundColor: isActive ? "#F5B800" : "#FFF4DA",
                        borderRadius: "14px",
                      }}
                      className="w-[44px] h-[44px] flex items-center justify-center shrink-0 transition-colors"
                    >
                      {getCategoryIcon(cat.icon, isActive)}
                    </div>

                    {/* Title & Count */}
                    <div>
                      <div className="text-[15px] font-extrabold text-[#101828] leading-snug">
                        {cat.label}
                      </div>
                      <div className="text-[12px] font-semibold text-[#667085] mt-1">
                        {cat.items.length} questions
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. MAIN GRID (Accordion on Left, Dark Sticky Box on Right) */}
        <section className="w-full px-5 sm:px-8 md:px-12 lg:px-[112px] pt-[32px] sm:pt-[40px] pb-[72px]">
          <div className="max-w-[1216px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-[32px] items-start">
            {/* LEFT ACCORDION COLUMN */}
            <div className="flex flex-col gap-[12px]">
              {/* Header row */}
              <div className="flex items-end justify-between border-b border-[#E7E8E5] pb-3 mb-2">
                <div>
                  <h2
                    style={{ letterSpacing: "-0.8px" }}
                    className="text-[22px] sm:text-[24px] font-extrabold text-[#101828] leading-tight"
                  >
                    {isSearchMode
                      ? `Results for “${searchQuery}”`
                      : activeCategory.label}
                  </h2>
                  <p className="text-[13px] font-semibold text-[#667085] mt-1">
                    {isSearchMode
                      ? "Search across all FAQ categories"
                      : activeCategory.subtitle}
                  </p>
                </div>

                <span
                  aria-live="polite"
                  style={{ color: "#2F6842" }}
                  className="text-[12px] font-extrabold whitespace-nowrap shrink-0"
                >
                  {isSearchMode
                    ? `${searchResults.length} ${
                        searchResults.length === 1 ? "result" : "results"
                      }`
                    : `${activeCategory.items.length} questions`}
                </span>
              </div>

              {/* SEARCH RESULTS MODE */}
              {isSearchMode ? (
                searchResults.length > 0 ? (
                  <div className="space-y-[12px]">
                    {searchResults.map((item) => {
                      const isOpen = openItemId === item.id;
                      const hasFeedback = feedbackGiven[item.id];
                      return (
                        <div
                          key={item.id}
                          style={{
                            border: isOpen
                              ? "1.5px solid #F5B800"
                              : "0.8px solid #E7E8E5",
                            backgroundColor: isOpen ? "#FFF4DA" : "#FFFFFF",
                            borderRadius: "18px",
                          }}
                          className="p-[20px] sm:p-[20px_24px] transition-all overflow-hidden"
                        >
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={`answer-${item.id}`}
                            onClick={() =>
                              setOpenItemId(isOpen ? "" : item.id)
                            }
                            className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800] rounded-xs"
                          >
                            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
                              {/* Category pill */}
                              <span
                                style={{
                                  backgroundColor: "#FFF4DA",
                                  color: "#936D00",
                                }}
                                className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shrink-0 border border-[#F5E3B0]"
                              >
                                {item.categoryLabel}
                              </span>

                              <span className="text-[15px] font-extrabold text-[#101828] leading-snug">
                                <HighlightText text={item.q} query={searchQuery} />
                              </span>
                            </div>

                            {/* Chevron Circle */}
                            <div
                              style={{
                                backgroundColor: isOpen ? "#F5B800" : "#F4F5F8",
                              }}
                              className={`w-[28px] h-[28px] rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            >
                              <ChevronDown
                                size={16}
                                className={isOpen ? "text-[#101828]" : "text-[#475467]"}
                              />
                            </div>
                          </button>

                          {/* Answer Region */}
                          {isOpen && (
                            <div
                              id={`answer-${item.id}`}
                              role="region"
                              aria-label={item.q}
                              className="pt-3 mt-3 border-t border-[#F5E3B0]/60 space-y-3"
                            >
                              <p className="text-[14px] leading-[23px] font-medium text-[#475467] max-w-[680px]">
                                {item.a}
                              </p>

                              {/* Feedback row */}
                              <div className="pt-2 flex items-center gap-2.5 text-[12px] font-bold">
                                {hasFeedback ? (
                                  <span
                                    style={{ color: "#2F6842" }}
                                    className="font-extrabold"
                                  >
                                    Thanks for your feedback!
                                  </span>
                                ) : (
                                  <>
                                    <span className="text-[#667085]">
                                      Was this helpful?
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setFeedbackGiven((prev) => ({
                                          ...prev,
                                          [item.id]: true,
                                        }))
                                      }
                                      style={{ border: "0.8px solid #F5E3B0" }}
                                      className="bg-white hover:bg-[#FFF8E6] text-[#101828] rounded-full px-[16px] py-[6px] text-[12px] font-extrabold cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800]"
                                    >
                                      Yes
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setFeedbackGiven((prev) => ({
                                          ...prev,
                                          [item.id]: true,
                                        }))
                                      }
                                      style={{ border: "0.8px solid #F5E3B0" }}
                                      className="bg-white hover:bg-[#FFF8E6] text-[#101828] rounded-full px-[16px] py-[6px] text-[12px] font-extrabold cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800]"
                                    >
                                      No
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Empty state for search */
                  <div
                    style={{
                      backgroundColor: "#FFF8E6",
                      border: "0.8px solid #F5E3B0",
                      borderRadius: "20px",
                    }}
                    className="p-10 text-center flex flex-col items-center gap-3"
                  >
                    <div
                      style={{
                        backgroundColor: "#FFF4DA",
                        borderRadius: "16px",
                      }}
                      className="w-12 h-12 flex items-center justify-center text-[#936D00] mb-1"
                    >
                      <HelpCircle size={24} />
                    </div>

                    <h3 className="text-[18px] font-extrabold text-[#101828]">
                      No answers found for “{searchQuery}”
                    </h3>
                    <p className="text-[14px] font-medium text-[#667085] max-w-sm">
                      Try a different word or search query, or raise a ticket with
                      our resolution team.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setShowTicketModal(true);
                        setTicketSubmitted(false);
                      }}
                      style={{
                        backgroundColor: "#F5B800",
                        color: "#101828",
                      }}
                      className="mt-2 rounded-full px-6 py-3 text-[13px] font-extrabold hover:bg-[#e5ac00] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#101828]"
                    >
                      Raise a support ticket
                    </button>
                  </div>
                )
              ) : (
                /* REGULAR CATEGORY ACCORDION VIEW */
                <div
                  id={`panel-${activeCategory.id}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${activeCategory.id}`}
                  className="space-y-[12px]"
                >
                  {activeCategory.items.map((item) => {
                    const isOpen = openItemId === item.id;
                    const hasFeedback = feedbackGiven[item.id];
                    return (
                      <div
                        key={item.id}
                        style={{
                          border: isOpen
                            ? "1.5px solid #F5B800"
                            : "0.8px solid #E7E8E5",
                          backgroundColor: isOpen ? "#FFF4DA" : "#FFFFFF",
                          borderRadius: "18px",
                        }}
                        className="p-[18px_20px] sm:p-[20px_24px] transition-all overflow-hidden"
                      >
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={`answer-${item.id}`}
                          onClick={() => setOpenItemId(isOpen ? "" : item.id)}
                          className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800] rounded-xs"
                        >
                          <span className="text-[15px] font-extrabold text-[#101828] leading-snug">
                            {item.q}
                          </span>

                          {/* 28px Circle with Chevron */}
                          <div
                            style={{
                              backgroundColor: isOpen ? "#F5B800" : "#F4F5F8",
                            }}
                            className={`w-[28px] h-[28px] rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          >
                            <ChevronDown
                              size={16}
                              className={isOpen ? "text-[#101828]" : "text-[#475467]"}
                            />
                          </div>
                        </button>

                        {/* Open Answer Region */}
                        {isOpen && (
                          <div
                            id={`answer-${item.id}`}
                            role="region"
                            aria-label={item.q}
                            className="pt-3 mt-3 border-t border-[#F5E3B0]/60 space-y-3"
                          >
                            <p className="text-[14px] leading-[23px] font-medium text-[#475467] max-w-[680px]">
                              {item.a}
                            </p>

                            {/* Feedback Row */}
                            <div className="pt-2 flex items-center gap-2.5 text-[12px] font-bold">
                              {hasFeedback ? (
                                <span
                                  style={{ color: "#2F6842" }}
                                  className="font-extrabold"
                                >
                                  Thanks for your feedback!
                                </span>
                              ) : (
                                <>
                                  <span className="text-[#667085]">
                                    Was this helpful?
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setFeedbackGiven((prev) => ({
                                        ...prev,
                                        [item.id]: true,
                                      }))
                                    }
                                    style={{ border: "0.8px solid #F5E3B0" }}
                                    className="bg-white hover:bg-[#FFF8E6] text-[#101828] rounded-full px-[16px] py-[6px] text-[12px] font-extrabold cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800]"
                                  >
                                    Yes
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setFeedbackGiven((prev) => ({
                                        ...prev,
                                        [item.id]: true,
                                      }))
                                    }
                                    style={{ border: "0.8px solid #F5E3B0" }}
                                    className="bg-white hover:bg-[#FFF8E6] text-[#101828] rounded-full px-[16px] py-[6px] text-[12px] font-extrabold cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800]"
                                  >
                                    No
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT DARK ASIDE (#111925, Sticky, 360px wide) */}
            <aside
              style={{
                backgroundColor: "#111925",
                borderRadius: "24px",
                position: "sticky",
                top: "130px",
              }}
              className="w-full p-[28px] flex flex-col text-white shadow-xl self-start"
            >
              {/* Eyebrow */}
              <div
                style={{
                  color: "#F5B800",
                  letterSpacing: "1.6px",
                }}
                className="text-[10px] font-extrabold uppercase mb-1"
              >
                STILL NEED HELP?
              </div>

              {/* Title */}
              <h3
                style={{ letterSpacing: "-0.7px" }}
                className="text-[22px] font-extrabold text-white mb-3"
              >
                Talk to our team
              </h3>

              {/* Row 1: Live Chat */}
              <div className="border-t border-[#263040] py-[16px] flex items-center justify-between gap-[14px]">
                <div className="flex items-center gap-[14px]">
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                    }}
                    className="w-[40px] h-[40px] flex items-center justify-center shrink-0"
                  >
                    <MessageCircle size={18} className="text-[#F5B800]" />
                  </div>
                  <div>
                    <div className="text-[14px] font-extrabold text-white leading-tight">
                      Live chat
                    </div>
                    <div className="text-[12px] font-semibold text-[#98A2B3] mt-0.5">
                      {supportContact.chatLabel}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowLiveChatDrawer(true)}
                  style={{ color: "#F5B800" }}
                  className="text-[12px] font-extrabold hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800] rounded-xs"
                >
                  Chat now
                </button>
              </div>

              {/* Row 2: Call Us */}
              <div className="border-t border-[#263040] py-[16px] flex items-center justify-between gap-[14px]">
                <div className="flex items-center gap-[14px]">
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                    }}
                    className="w-[40px] h-[40px] flex items-center justify-center shrink-0"
                  >
                    <Phone size={18} className="text-[#F5B800]" />
                  </div>
                  <div>
                    <div className="text-[14px] font-extrabold text-white leading-tight">
                      Call us
                    </div>
                    <div className="text-[12px] font-semibold text-[#98A2B3] mt-0.5">
                      {supportContact.phone}
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${supportContact.phone.replace(/[^0-9+]/g, "")}`}
                  style={{ color: "#F5B800" }}
                  className="text-[12px] font-extrabold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800] rounded-xs"
                >
                  Call
                </a>
              </div>

              {/* Row 3: Email Us */}
              <div className="border-t border-[#263040] py-[16px] flex items-center justify-between gap-[14px]">
                <div className="flex items-center gap-[14px]">
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                    }}
                    className="w-[40px] h-[40px] flex items-center justify-center shrink-0"
                  >
                    <Mail size={18} className="text-[#F5B800]" />
                  </div>
                  <div>
                    <div className="text-[14px] font-extrabold text-white leading-tight">
                      Email us
                    </div>
                    <div className="text-[12px] font-semibold text-[#98A2B3] mt-0.5">
                      {supportContact.email}
                    </div>
                  </div>
                </div>

                <a
                  href={`mailto:${supportContact.email}`}
                  style={{ color: "#F5B800" }}
                  className="text-[12px] font-extrabold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800] rounded-xs"
                >
                  Write
                </a>
              </div>

              {/* Raise a Support Ticket Button */}
              <button
                type="button"
                onClick={() => {
                  setShowTicketModal(true);
                  setTicketSubmitted(false);
                }}
                style={{
                  backgroundColor: "#F5B800",
                  color: "#101828",
                  borderRadius: "999px",
                }}
                className="mt-[14px] w-full py-[14px] text-[14px] font-extrabold leading-none hover:bg-[#e5ac00] transition-colors cursor-pointer text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111925]"
              >
                Raise a support ticket
              </button>
            </aside>
          </div>
        </section>
      </main>

      <Footer />

      {/* EXISTING TICKET MODAL FLOW (PRESERVED) */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 bg-[#111925]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#E7E8E5] rounded-[24px] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#936D00] bg-[#FFF4DA] px-2 py-0.5 rounded border border-[#F5E3B0] inline-block mb-1">
                  Ticket Desk
                </span>
                <h3 className="font-extrabold text-lg text-[#101828]">
                  Raise Support Ticket
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTicketModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800]"
                aria-label="Close ticket modal"
              >
                <X size={16} />
              </button>
            </div>

            {ticketSubmitted ? (
              <div className="bg-[#FFF8E6] border border-[#F5E3B0] rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#F5B800] text-[#101828] flex items-center justify-center mx-auto font-bold">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="text-base font-extrabold text-[#101828]">
                  Support Ticket Created! 🎉
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  Ticket{" "}
                  <strong>
                    #TKT-{Math.floor(100000 + Math.random() * 900000)}
                  </strong>{" "}
                  has been registered. Our resolution officer will respond
                  within 2 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  style={{ backgroundColor: "#F5B800", color: "#101828" }}
                  className="font-extrabold text-xs px-6 py-2.5 rounded-full shadow-sm cursor-pointer mt-2"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-extrabold text-[#101828] mb-1">
                    Issue Category *
                  </label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, category: e.target.value })
                    }
                    className="w-full bg-[#FFFFFF] border border-slate-200 rounded-xl px-3 py-2 font-bold text-xs focus:outline-none focus:border-[#F5B800] cursor-pointer"
                  >
                    <option>Orders &amp; Delivery</option>
                    <option>Payments &amp; Refunds</option>
                    <option>Return &amp; Replacement</option>
                    <option>Account &amp; Settings</option>
                    <option>Other Query</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-extrabold text-[#101828] mb-1">
                      Ticket Subject *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Delayed refund for Order #9021"
                      value={ticketForm.subject}
                      onChange={(e) =>
                        setTicketForm({
                          ...ticketForm,
                          subject: e.target.value,
                        })
                      }
                      className="w-full bg-[#FFFFFF] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#F5B800]"
                    />
                  </div>

                  <div>
                    <label className="block font-extrabold text-[#101828] mb-1">
                      Order ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SUB-ORD-9021"
                      value={ticketForm.orderId}
                      onChange={(e) =>
                        setTicketForm({
                          ...ticketForm,
                          orderId: e.target.value,
                        })
                      }
                      className="w-full bg-[#FFFFFF] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#F5B800]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-[#101828] mb-1">
                    Problem Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide details about your issue..."
                    value={ticketForm.description}
                    onChange={(e) =>
                      setTicketForm({
                        ...ticketForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-[#FFFFFF] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#F5B800]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ backgroundColor: "#F5B800", color: "#101828" }}
                    className="font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md cursor-pointer hover:bg-[#e5ac00]"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* EXISTING LIVE CHAT DRAWER SIMULATION (PRESERVED) */}
      {showLiveChatDrawer && (
        <div className="fixed inset-0 z-50 bg-[#111925]/60 backdrop-blur-xs flex items-end sm:items-center justify-end sm:justify-center p-0 sm:p-4 overflow-hidden">
          <div className="bg-white border border-[#E7E8E5] rounded-t-3xl sm:rounded-3xl max-w-md w-full h-[85dvh] sm:h-[520px] max-h-[90vh] shadow-2xl flex flex-col justify-between overflow-hidden text-left overscroll-contain">
            {/* Drawer Header */}
            <div className="bg-[#111925] text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center font-bold">
                  <MessageCircle size={16} />
                </div>
                <div>
                  <div className="font-extrabold text-xs">FillCarts Live Support</div>
                  <div className="text-[10px] text-emerald-200 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />{" "}
                    Online (24/7 Desk)
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowLiveChatDrawer(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close live chat"
              >
                <X size={15} />
              </button>
            </div>

            {/* Messages Body */}
            <div className="p-4 overflow-y-auto flex-1 space-y-3 text-xs bg-[#FFFFFF]">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 leading-relaxed font-semibold ${
                      msg.sender === "user"
                        ? "bg-[#F5B800] text-[#101828] rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-2xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Form */}
            <form
              onSubmit={handleSendChatMessage}
              className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                placeholder="Type your question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#F5B800]"
              />
              <button
                type="submit"
                style={{ backgroundColor: "#F5B800", color: "#101828" }}
                className="p-2.5 rounded-xl shadow-xs shrink-0 cursor-pointer hover:bg-[#e5ac00]"
                aria-label="Send chat message"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
