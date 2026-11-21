import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, MapPin, FileText, User, LogOut, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";

export default function ProfileLayout({
  activeTab = "orders",
  pageName = "My Orders",
  children,
}) {
  const { user, logoutUser } = useCart();
  const navigate = useNavigate();

  // Fallback demo user if not logged in
  const displayUser = user || {
    name: "Customer",
    phone: "+91 98765 43210",
    email: "customer@fillcarts.com",
  };

  const userInitial = displayUser.name ? displayUser.name.trim().charAt(0).toUpperCase() : "C";

  // Logout modal state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      if (logoutUser) await logoutUser();
    } catch (e) {
      console.warn("Logout error:", e);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
      navigate("/", { replace: true });
    }
  };

  const menuItems = [
    { id: "orders", label: "My Orders", path: "/profile/orders", icon: ShoppingBag },
    { id: "addresses", label: "Addresses", path: "/profile/addresses", icon: MapPin },
    { id: "prescriptions", label: "My Prescriptions", path: "/profile/prescriptions", icon: FileText },
    { id: "account", label: "Account", path: "/profile/account", icon: User },
  ];

  return (
    <div
      className="bg-[#F6F6F2] min-h-screen text-[#101828] flex flex-col selection:bg-[#FFE9A8] selection:text-[#101828]"
      style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
    >
      <Navbar />

      <main className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Breadcrumb Navigation: 13-14px, #667085, current page #101828 */}
        <nav
          aria-label="Breadcrumb"
          className="text-[13px] sm:text-[14px] text-[#667085] mb-6 flex items-center gap-2 font-medium"
        >
          <Link
            to="/"
            className="hover:text-[#101828] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F5B800] rounded-xs"
          >
            Home
          </Link>
          <span className="text-[#667085]/60" aria-hidden="true">
            /
          </span>
          <Link
            to="/profile/orders"
            className="hover:text-[#101828] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F5B800] rounded-xs"
          >
            Profile
          </Link>
          <span className="text-[#667085]/60" aria-hidden="true">
            /
          </span>
          <span className="text-[#101828] font-bold" aria-current="page">
            {pageName}
          </span>
        </nav>

        {/* Two-column layout: left 288px, right 1fr, gap 24px, items aligned top. Under 860px: 1 column */}
        <div className="flex flex-col min-[860px]:flex-row gap-6 items-start">
          {/* LEFT COLUMN: THREE SEPARATE CARDS with 16px gap */}
          <aside className="w-full min-[860px]:w-[288px] shrink-0 flex flex-col gap-4">
            {/* 1. Profile card */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #ECECE6",
                borderRadius: "20px",
                boxShadow: "0 1px 2px rgba(16,24,40,.04)",
                padding: "24px 20px",
              }}
              className="flex flex-col items-center text-center"
            >
              {/* Centered 72px yellow circle avatar */}
              {displayUser.profile_picture ? (
                <img
                  src={displayUser.profile_picture}
                  alt={displayUser.name || "Customer"}
                  className="w-[72px] h-[72px] rounded-full object-cover border border-[#ECECE6]"
                />
              ) : (
                <div
                  style={{
                    backgroundColor: "#F5B800",
                    color: "#101828",
                    width: "72px",
                    height: "72px",
                    borderRadius: "999px",
                    fontSize: "26px",
                    fontWeight: 800,
                  }}
                  className="flex items-center justify-center shrink-0"
                >
                  {userInitial}
                </div>
              )}

              {/* Name: 18px, 800 */}
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#101828",
                  marginTop: "12px",
                }}
                className="truncate w-full m-0"
              >
                {displayUser.name || "Customer"}
              </h2>

              {/* Phone: 14px, #667085 */}
              <p
                style={{
                  fontSize: "14px",
                  color: "#667085",
                  fontWeight: 500,
                  marginTop: "4px",
                }}
                className="truncate w-full m-0"
              >
                {displayUser.phone || displayUser.email || "No contact info"}
              </p>
            </div>

            {/* 2. Menu card */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #ECECE6",
                borderRadius: "20px",
                boxShadow: "0 1px 2px rgba(16,24,40,.04)",
                padding: "20px 16px",
              }}
              className="flex flex-col"
            >
              {/* Label: MY ACCOUNT (12px, 700, letter-spacing .08em, #667085) */}
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#667085",
                  marginBottom: "8px",
                  paddingLeft: "8px",
                }}
                className="uppercase"
              >
                MY ACCOUNT
              </div>

              {/* Menu items list (horizontally scrollable on mobile/tablet <860px, vertical on desktop) */}
              <nav aria-label="Profile navigation" className="flex flex-row min-[860px]:flex-col gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      aria-current={isActive ? "page" : undefined}
                      style={{
                        minHeight: "44px",
                        borderRadius: "12px",
                        backgroundColor: isActive ? "#FFF4CC" : "transparent",
                        color: isActive ? "#101828" : "#475467",
                        fontSize: "14px",
                        fontWeight: isActive ? 700 : 600,
                        padding: "0 14px",
                      }}
                      className={`flex items-center gap-2.5 sm:gap-3 transition-colors whitespace-nowrap shrink-0 min-[860px]:shrink ${
                        isActive
                          ? ""
                          : "hover:bg-[#F6F6F2] hover:text-[#101828]"
                      } focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F5B800] focus-visible:ring-offset-2`}
                    >
                      <Icon
                        size={18}
                        strokeWidth={1.8}
                        style={{
                          color: isActive ? "#101828" : "#667085",
                        }}
                        className="shrink-0"
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* 3. Logout card */}
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #ECECE6",
                borderRadius: "20px",
                boxShadow: "0 1px 2px rgba(16,24,40,.04)",
                minHeight: "52px",
                padding: "0 20px",
                color: "#B42318",
                fontSize: "15px",
                fontWeight: 700,
              }}
              className="w-full flex items-center gap-3 hover:bg-rose-50/40 transition-colors cursor-pointer text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B42318] focus-visible:ring-offset-2"
            >
              <LogOut size={20} strokeWidth={1.8} className="shrink-0 text-[#B42318]" />
              <span>Logout</span>
            </button>
          </aside>

          {/* RIGHT COLUMN: 1fr */}
          <section className="flex-1 min-w-0 w-full flex flex-col gap-4">
            {children}
          </section>
        </div>
      </main>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[calc(100vw-32px)] sm:max-w-sm p-6 shadow-xl relative text-center border border-[#ECECE6]">
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "999px",
                backgroundColor: "#FDECEC",
                color: "#B42318",
              }}
              className="flex items-center justify-center mx-auto mb-3 border border-rose-200"
            >
              <LogOut size={22} />
            </div>
            <h3 className="text-lg font-extrabold text-[#101828]">Log out of FillCarts?</h3>
            <p className="text-xs text-[#667085] font-medium mt-1 mb-5">
              You will need to sign back in to access your saved orders, cart, and delivery addresses.
            </p>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  height: "44px",
                  borderRadius: "999px",
                  border: "1px solid #D0D5DD",
                  backgroundColor: "#FFFFFF",
                  color: "#101828",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
                className="flex-1 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                style={{
                  height: "44px",
                  borderRadius: "999px",
                  backgroundColor: "#B42318",
                  color: "#FFFFFF",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
                className="flex-1 hover:bg-rose-800 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isLoggingOut ? "Logging out..." : "Yes, Log Out"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
