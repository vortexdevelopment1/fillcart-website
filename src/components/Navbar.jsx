import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  MapPin, Search, User, ShoppingCart, ChevronDown, X, Navigation,
  Loader2, Check, Store, Bike, Menu, ExternalLink, ArrowRight,
  LayoutGrid, Sparkles, Plus, AlertCircle
} from "lucide-react";
import { useCart } from "../context/CartContext";
import api from "../api";
import SearchDropdown from "./SearchDropdown";
import Logo from "./Logo";
import CartIcon from "./CartIcon";

const VENDOR_URL =
  import.meta.env.VITE_VENDOR_URL ||
  (import.meta.env.PROD
    ? "https://fillcarts-vendor.vercel.app"
    : "http://localhost:5174");

const RIDER_URL =
  import.meta.env.VITE_RIDER_URL ||
  (import.meta.env.PROD
    ? "https://fillcarts-rider.vercel.app"
    : "http://localhost:5175");

export default function Navbar({ onSearchChange }) {
  const { cartCount, user, userLocation, changeLocation } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [addressDropdownOpen, setAddressDropdownOpen] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [customCity, setCustomCity] = useState("");
  const [customArea, setCustomArea] = useState("");
  const [customPincode, setCustomPincode] = useState("");

  // More Categories dropdown state & refs
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [focusedMoreIndex, setFocusedMoreIndex] = useState(-1);
  const moreMenuRef = useRef(null);
  const moreButtonRef = useRef(null);
  const moreDropdownRef = useRef(null);
  const moreItemsRef = useRef([]);
  const moreHoverTimeoutRef = useRef(null);
  const [moreCoords, setMoreCoords] = useState(null);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );

  const location = useLocation();
  const navigate = useNavigate();
  const addressDropdownRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close drawers/dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setAddressDropdownOpen(false);
    setMoreMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close address dropdown & more categories dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (addressDropdownRef.current && !addressDropdownRef.current.contains(e.target)) {
        setAddressDropdownOpen(false);
      }
      const isInsideMore =
        (moreMenuRef.current && moreMenuRef.current.contains(e.target)) ||
        (moreDropdownRef.current && moreDropdownRef.current.contains(e.target));
      if (!isInsideMore) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Keyboard navigation (Esc, Arrow keys) for More dropdown
  useEffect(() => {
    if (!moreMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMoreMenuOpen(false);
        moreButtonRef.current?.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedMoreIndex((prev) => {
          const next = (prev + 1) % moreCategories.length;
          moreItemsRef.current[next]?.focus();
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedMoreIndex((prev) => {
          const next = (prev - 1 + moreCategories.length) % moreCategories.length;
          moreItemsRef.current[next]?.focus();
          return next;
        });
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [moreMenuOpen]);

  // Fetch saved addresses from backend when user is logged in
  useEffect(() => {
    if (user) {
      setLoadingAddresses(true);
      api.get("/addresses")
        .then((res) => {
          const list = res.data.addresses || [];
          setSavedAddresses(list);
          const defaultAddr = list.find((a) => a.isDefault);
          if (defaultAddr && !userLocation?.isUserSelected) {
            changeLocation({
              city: defaultAddr.city || "Delivery",
              area: defaultAddr.addressLine1 || defaultAddr.locality || defaultAddr.street || defaultAddr.city,
              pincode: defaultAddr.pincode,
              state: defaultAddr.state || "India",
              formatted: defaultAddr.address_line || `${defaultAddr.addressLine1}, ${defaultAddr.city}`,
              isGps: false,
              addressId: defaultAddr.id,
              isUserSelected: false,
            });
          }
        })
        .catch((err) => {
          console.warn("Could not fetch delivery addresses:", err.message);
        })
        .finally(() => setLoadingAddresses(false));
    } else {
      setSavedAddresses([]);
    }
  }, [user]);

  // Handle GPS detection
  const handleDetectGps = () => {
    setIsDetectingGps(true);
    setGpsError("");

    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      setIsDetectingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        const gpsLoc = {
          city: "Nearby Location",
          area: `GPS (${lat}, ${lng})`,
          lat,
          lng,
          pincode: "452001",
          formatted: `Lat: ${lat}, Lng: ${lng}`,
          isGps: true,
          isUserSelected: true,
        };
        changeLocation(gpsLoc);
        setIsDetectingGps(false);
        setAddressDropdownOpen(false);
      },
      (err) => {
        console.warn("GPS error:", err);
        setGpsError("Could not access GPS. Please choose a saved address or enter manually.");
        setIsDetectingGps(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectAddress = (addr) => {
    changeLocation({
      city: addr.city || "Delivery Location",
      area: addr.addressLine1 || addr.street || addr.locality || addr.city,
      pincode: addr.pincode || addr.postal_code || "452010",
      state: addr.state || "M.P.",
      lat: addr.lat || addr.latitude,
      lng: addr.lng || addr.longitude,
      formatted: addr.address_line || `${addr.addressLine1}, ${addr.city}`,
      isGps: false,
      addressId: addr.id,
      isUserSelected: true,
    });
    setAddressDropdownOpen(false);
  };

  const handleSaveCustomLocation = (e) => {
    e.preventDefault();
    if (!customCity && !customArea && !customPincode) return;

    changeLocation({
      city: customCity.trim() || "Delivery Location",
      area: customArea.trim() || customCity.trim() || "Indore",
      pincode: customPincode.trim() || "452010",
      state: "India",
      formatted: `${customArea.trim() ? customArea.trim() + ", " : ""}${customCity.trim()} (${customPincode.trim()})`,
      isGps: false,
      isUserSelected: true,
    });

    setCustomCity("");
    setCustomArea("");
    setCustomPincode("");
    setShowLocationModal(false);
    setAddressDropdownOpen(false);
  };

  // Row 2 Navigation links according to Figma specification
  const row2Links = [
    { label: "All", to: "/" },
    { label: "Grocery", to: "/category/grocery" },
    { label: "Dairy", to: "/category/dairy" },
    { label: "Electronics", to: "/category/electronics" },
    { label: "Stationery", to: "/category/stationery" },
    { label: "Beauty", to: "/category/beauty" },
  ];

  const moreCategories = [
    { label: "Chicken, Meat & Fish", to: "/category/chicken-meat-fish" },
    { label: "Home Essentials", to: "/category/home-essentials" },
    { label: "Daily Care", to: "/category/daily-care" },
    { label: "Fragrance & Grooming", to: "/category/fragrance-grooming" },
    { label: "Sports", to: "/category/sports" },
    { label: "Pet Care", to: "/category/pet-care" },
    { label: "Paan Corner", to: "/category/paan-corner" },
  ];

  const isMoreActive = moreCategories.some(
    (c) => location.pathname === c.to || location.pathname.startsWith(`${c.to}/`)
  );

  const updateMoreCoords = useCallback(() => {
    if (moreButtonRef.current) {
      const rect = moreButtonRef.current.getBoundingClientRect();
      const menuWidth = 240;
      let right = window.innerWidth - rect.right;
      if (right < 12) right = 12;
      if (window.innerWidth - right - menuWidth < 12) {
        right = Math.max(12, window.innerWidth - menuWidth - 12);
      }
      setMoreCoords({
        top: Math.round(rect.bottom + 6),
        right: Math.round(right),
      });
    }
  }, []);

  useEffect(() => {
    if (!moreMenuOpen || isDesktop) return;
    updateMoreCoords();

    const handleUpdate = () => {
      updateMoreCoords();
    };

    window.addEventListener("scroll", handleUpdate, { passive: true });
    window.addEventListener("resize", handleUpdate, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleUpdate);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [moreMenuOpen, isDesktop, updateMoreCoords]);

  const handleMoreMouseEnter = () => {
    if (window.innerWidth < 1024) return;
    if (moreHoverTimeoutRef.current) clearTimeout(moreHoverTimeoutRef.current);
    setMoreMenuOpen(true);
  };

  const handleMoreMouseLeave = () => {
    if (window.innerWidth < 1024) return;
    moreHoverTimeoutRef.current = setTimeout(() => {
      setMoreMenuOpen(false);
    }, 150);
  };

  const isActiveLink = (to) => {
    if (to === "/") return location.pathname === "/" && !location.search;
    if (to.includes("?")) {
      const [path, search] = to.split("?");
      return location.pathname === path && location.search.includes(search);
    }
    return location.pathname.startsWith(to);
  };

  const userInitial = user?.name ? user.name.trim().charAt(0).toUpperCase() : "U";

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-xs border-b border-[#ECEEF2]">
      {/* ROW 1: Logo, Deliver To, Wide Search, Login/Profile, Yellow Cart */}
      <div className="max-w-[1216px] mx-auto px-2.5 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-1.5 min-[360px]:gap-2 sm:gap-6">
          
          {/* Logo Mark + Wordmark */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Mobile Hamburger Drawer Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center shrink-0 rounded-xl text-[#111925] hover:bg-[#F4F5F8] transition-colors cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} />
            </button>

            {/* Desktop & Tablet Logo (>= 480px) */}
            <div className="hidden min-[480px]:block shrink-0">
              <Logo size="default" />
            </div>

            {/* Compact Phone Logo (410px - 479px) */}
            <div className="hidden min-[410px]:block min-[480px]:hidden shrink-0">
              <Logo size="sm" />
            </div>

            {/* Phone Logo Mark (< 410px): mark only to ensure location + login + cart fit cleanly */}
            <Link
              to="/"
              className="min-[410px]:hidden inline-flex items-center shrink-0 select-none cursor-pointer"
              aria-label="FillCarts home"
            >
              <img
                src="/images/brand/logo.svg"
                alt="FillCarts"
                width={30}
                height={30}
                className="w-[30px] h-[30px] shrink-0 object-contain"
              />
            </Link>
          </div>

          {/* Delivery Location Selector */}
          <div className="relative shrink-0 min-w-0" ref={addressDropdownRef}>
            <button
              type="button"
              onClick={() => setAddressDropdownOpen(!addressDropdownOpen)}
              className="flex items-center gap-1 sm:gap-2 px-1.5 min-[360px]:px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-[#F4F5F8] transition-colors cursor-pointer text-left group max-w-full"
              aria-expanded={addressDropdownOpen}
              aria-label="Select delivery address"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#F4F5F8] text-[#111925] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MapPin size={14} className="sm:w-[15px] sm:h-[15px]" />
              </div>
              <div className="flex flex-col leading-tight pr-0.5 sm:pr-1 min-w-0">
                <span className="text-[11px] lg:text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                  Deliver to
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#111925] truncate max-w-[45px] min-[360px]:max-w-[65px] min-[400px]:max-w-[90px] sm:max-w-[140px] lg:max-w-[180px]">
                  {userLocation?.area || userLocation?.city || "Indore, 452001"}
                </span>
              </div>
              <ChevronDown
                size={13}
                className={`text-[#111925] transition-transform shrink-0 ${
                  addressDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Address Selection Dropdown */}
            {addressDropdownOpen && (
              <div className="fixed inset-x-4 top-[64px] sm:absolute sm:inset-auto sm:top-full sm:left-0 sm:mt-2 w-auto sm:w-80 max-w-[calc(100vw-32px)] sm:max-w-none bg-white border border-[#ECEEF2] rounded-2xl shadow-2xl z-[999] overflow-hidden text-left animate-fade-in divide-y divide-slate-100 max-h-[80vh] overflow-y-auto">
                {/* GPS Trigger Option */}
                <div className="p-3 bg-slate-50/70">
                  <button
                    type="button"
                    onClick={handleDetectGps}
                    disabled={isDetectingGps}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-[#FFF8E1] border border-[#ECEEF2] text-left transition-colors cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#FFF8E1] text-[#111925] flex items-center justify-center">
                        {isDetectingGps ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#111925] flex items-center gap-1.5">
                          <span>Use Live GPS Location</span>
                          {userLocation?.isGps && (
                            <span className="text-[9px] bg-[#FEC201] text-[#111925] px-1.5 py-0.2 rounded-full font-bold">ACTIVE</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">Detect current GPS position</div>
                      </div>
                    </div>
                    {userLocation?.isGps && <Check size={14} className="text-[#111925] shrink-0" />}
                  </button>
                  {gpsError && (
                    <p className="text-[10px] text-rose-600 font-semibold mt-1 px-1">{gpsError}</p>
                  )}
                </div>

                {/* Saved Addresses Section (Logged-in User) */}
                <div className="p-3 max-h-56 overflow-y-auto space-y-1.5">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 mb-1 flex items-center justify-between">
                    <span>Saved Delivery Addresses</span>
                    {user && (
                      <Link
                        to="/profile/addresses"
                        onClick={() => setAddressDropdownOpen(false)}
                        className="text-[10px] text-[#111925] font-bold hover:underline"
                      >
                        Manage
                      </Link>
                    )}
                  </div>

                  {user ? (
                    loadingAddresses ? (
                      <div className="p-3 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                        <Loader2 size={14} className="animate-spin text-[#FEC201]" />
                        <span>Loading saved addresses...</span>
                      </div>
                    ) : savedAddresses.length > 0 ? (
                      savedAddresses.map((addr) => {
                        const isCurrent =
                          userLocation?.addressId === addr.id ||
                          (!userLocation?.isGps &&
                            userLocation?.area === (addr.addressLine1 || addr.street));
                        return (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => handleSelectAddress(addr)}
                            className={`w-full flex items-start justify-between p-2 rounded-xl text-left transition-colors cursor-pointer border ${
                              isCurrent
                                ? "bg-[#FFF8E1] border-[#FEC201]"
                                : "bg-white hover:bg-slate-50 border-slate-100"
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-black text-[#111925]">{addr.label || "Address"}</span>
                                {addr.isDefault && (
                                  <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-bold">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {addr.addressLine1 || addr.street || addr.address_line}
                              </p>
                              <p className="text-[10px] text-slate-400 font-semibold">
                                {addr.city} {addr.pincode ? `• ${addr.pincode}` : ""}
                              </p>
                            </div>
                            {isCurrent && <Check size={14} className="text-[#111925] shrink-0 mt-0.5" />}
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-3 text-center">
                        <p className="text-xs font-semibold text-slate-600">No saved addresses yet</p>
                        <Link
                          to="/profile/addresses"
                          onClick={() => setAddressDropdownOpen(false)}
                          className="text-xs text-[#111925] font-black underline mt-1 inline-block"
                        >
                          + Add delivery address
                        </Link>
                      </div>
                    )
                  ) : (
                    <div className="p-3 text-center">
                      <p className="text-xs font-semibold text-slate-600">Log in to view saved addresses</p>
                      <Link
                        to="/login"
                        onClick={() => setAddressDropdownOpen(false)}
                        className="text-xs text-[#111925] font-black underline mt-1 inline-block"
                      >
                        Login to FillCarts
                      </Link>
                    </div>
                  )}
                </div>

                {/* Manual Pincode / City trigger */}
                <div className="p-2.5 bg-slate-50 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setAddressDropdownOpen(false);
                      setShowLocationModal(true);
                    }}
                    className="text-xs font-bold text-[#111925] hover:underline cursor-pointer"
                  >
                    Enter pincode or city manually
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Wide Pill Search Bar (Inside Row 1 at >= 1024px) */}
          <div className="hidden lg:flex flex-1 min-w-[200px] max-w-2xl mx-1 lg:mx-4">
            <SearchDropdown
              defaultValue=""
              onSearchSubmit={(val) => {
                if (onSearchChange) onSearchChange(val);
                navigate(`/search?q=${encodeURIComponent(val)}`);
              }}
              inputClassName="bg-[#F4F5F8] border border-transparent focus:border-[#FEC201] rounded-full py-2.5 text-xs sm:text-sm text-[#111925] shadow-none"
            />
          </div>

          {/* Right Action Buttons: Auth/Profile + Yellow Rounded-Square Cart */}
          <div className="flex items-center gap-1 min-[360px]:gap-1.5 sm:gap-3 shrink-0 ml-auto lg:ml-0">
            {/* Login / Profile Button */}
            {user ? (
              <Link
                to="/profile"
                className="w-10 h-10 min-[480px]:w-auto min-[480px]:h-auto flex items-center justify-center gap-2 rounded-full min-[480px]:px-3 py-1.5 text-xs font-bold bg-[#F4F5F8] hover:bg-[#ECEEF2] text-[#111925] transition-colors cursor-pointer min-h-[36px]"
                title="View Profile"
                aria-label="User Profile"
              >
                {user.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt={user.name || "User"}
                    className="w-6 h-6 rounded-full object-cover border border-[#FEC201]"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#FEC201] text-[#111925] flex items-center justify-center text-xs font-black shrink-0">
                    {userInitial}
                  </div>
                )}
                <span className="hidden sm:inline">Profile</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="w-10 h-10 min-[480px]:w-auto min-[480px]:h-auto text-xs sm:text-sm font-bold text-[#111925] hover:text-black min-[480px]:px-4 py-1.5 sm:py-2 rounded-full hover:bg-[#F4F5F8] transition-colors cursor-pointer min-h-[36px] flex items-center justify-center shrink-0"
                title="Login"
                aria-label="Login"
              >
                <User size={20} className="min-[480px]:hidden text-[#111925]" />
                <span className="hidden min-[480px]:inline">Login</span>
              </Link>
            )}

            {/* Cart Button: Exact Figma Yellow Rounded-Square (40px x 41px, 12px radius) with count badge */}
            <Link
              to="/cart"
              className="w-10 h-10 sm:w-[40px] sm:h-[41px] rounded-[10px] sm:rounded-[12px] bg-[#F5B800] hover:bg-[#E5AC00] text-[#0A0A0B] flex items-center justify-center relative transition-all shadow-xs cursor-pointer shrink-0 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-[#111925] focus-visible:ring-offset-2"
              title="Shopping Cart"
              aria-label={`Cart, ${cartCount} items`}
            >
              <CartIcon size={20} className="text-[#0A0A0B]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#FFF9A4] text-[#171717] text-[10px] font-black flex items-center justify-center shadow-xs border border-black/10">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile / Tablet Full-Width Search Bar (< 1024px) */}
        <div className="lg:hidden mt-2 pt-1 border-t border-[#ECEEF2]/70 pb-1">
          <SearchDropdown
            defaultValue=""
            onSearchSubmit={(val) => {
              if (onSearchChange) onSearchChange(val);
              navigate(`/search?q=${encodeURIComponent(val)}`);
            }}
            inputClassName="bg-[#F4F5F8] border border-transparent focus:border-[#FEC201] rounded-full py-2 text-xs text-[#111925]"
          />
        </div>
      </div>

      {/* ROW 2: Text Links (All, Grocery, Dairy, Electronics, Stationery, Beauty, + More) */}
      <nav className="border-t border-[#ECEEF2] bg-white relative z-40">
        <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto no-scrollbar lg:overflow-visible">
          <div className="flex items-center gap-5 sm:gap-7 lg:gap-8 overflow-x-auto no-scrollbar whitespace-nowrap lg:overflow-visible flex-nowrap">
            {row2Links.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `py-2.5 whitespace-nowrap transition-colors relative cursor-pointer text-xs sm:text-sm font-medium border-b-2 ${
                    isActive
                      ? "text-[#101828] font-bold border-[#FBBF24]"
                      : "text-[#6B7280] hover:text-[#101828] border-transparent"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* "More" dropdown trigger with Chevron */}
            <div
              ref={moreMenuRef}
              className="relative py-1 shrink-0"
              onMouseEnter={handleMoreMouseEnter}
              onMouseLeave={handleMoreMouseLeave}
            >
              <button
                ref={moreButtonRef}
                type="button"
                onClick={() => {
                  updateMoreCoords();
                  setMoreMenuOpen((prev) => !prev);
                }}
                aria-haspopup="menu"
                aria-expanded={moreMenuOpen}
                aria-label="More categories menu"
                className={`py-1.5 flex items-center gap-1 whitespace-nowrap transition-colors relative cursor-pointer text-xs sm:text-sm font-medium border-b-2 focus:outline-none ${
                  isMoreActive
                    ? "text-[#101828] font-bold border-[#FBBF24]"
                    : "text-[#6B7280] hover:text-[#101828] border-transparent"
                }`}
              >
                <span>More</span>
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${
                    moreMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {moreMenuOpen && (
                <div
                  ref={moreDropdownRef}
                  role="menu"
                  aria-label="More categories"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "0.8px solid #E7E8E5",
                    borderRadius: "16px",
                    padding: "8px",
                    boxShadow: "0 8px 24px rgba(16, 24, 40, 0.15)",
                    minWidth: "240px",
                    maxWidth: "calc(100vw - 24px)",
                    ...(isDesktop
                      ? {}
                      : {
                          position: "fixed",
                          top: `${moreCoords?.top ?? 140}px`,
                          right: `${moreCoords?.right ?? 16}px`,
                          left: "auto",
                          zIndex: 9999,
                        }),
                  }}
                  className={`flex flex-col bg-white ${
                    isDesktop
                      ? "absolute right-0 top-full mt-1 z-50"
                      : "animate-fade-in"
                  }`}
                >
                  {moreCategories.map((item, idx) => {
                    const isItemActive =
                      location.pathname === item.to ||
                      location.pathname.startsWith(`${item.to}/`);
                    return (
                      <Link
                        key={item.to}
                        ref={(el) => (moreItemsRef.current[idx] = el)}
                        to={item.to}
                        role="menuitem"
                        tabIndex={0}
                        onClick={() => setMoreMenuOpen(false)}
                        style={{
                          padding: "10px 14px",
                          borderRadius: "10px",
                          fontFamily: "'Manrope', sans-serif",
                          color: "#101828",
                          fontSize: "14px",
                          lineHeight: "20px",
                          fontWeight: 600,
                          backgroundColor: isItemActive ? "#FFF4DA" : "transparent",
                        }}
                        className="transition-colors hover:bg-[#FFF4DA] focus:bg-[#FFF4DA] focus:outline-none text-left select-none"
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Manual Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl w-full max-w-[calc(100vw-32px)] sm:max-w-md p-5 sm:p-6 shadow-2xl relative text-left animate-scale-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowLocationModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <h3 className="text-lg font-black text-[#111925] mb-1">Enter Delivery Location</h3>
            <p className="text-xs text-slate-500 font-semibold mb-4">
              Enter your city or 6-digit pincode to find fastest local deliveries
            </p>

            <form onSubmit={handleSaveCustomLocation} className="space-y-3">
              <div>
                <label className="text-[11px] font-extrabold text-slate-600 block mb-1">Area / Landmark</label>
                <input
                  type="text"
                  value={customArea}
                  onChange={(e) => setCustomArea(e.target.value)}
                  placeholder="e.g. Vijay Nagar, Sector 12"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECEEF2] bg-[#F4F5F8] text-xs font-semibold text-[#111925] outline-none focus:border-[#FEC201]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-extrabold text-slate-600 block mb-1">City</label>
                  <input
                    type="text"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    placeholder="e.g. Indore"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECEEF2] bg-[#F4F5F8] text-xs font-semibold text-[#111925] outline-none focus:border-[#FEC201]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold text-slate-600 block mb-1">Pincode (6 digits)</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={customPincode}
                    onChange={(e) => setCustomPincode(e.target.value)}
                    placeholder="e.g. 452010"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECEEF2] bg-[#F4F5F8] text-xs font-semibold text-[#111925] outline-none focus:border-[#FEC201]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="flex-1 border border-[#ECEEF2] hover:bg-slate-50 text-slate-600 font-extrabold py-2.5 rounded-full text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#FEC201] hover:bg-[#F5B800] text-[#111925] font-extrabold py-2.5 rounded-full text-xs transition-colors shadow-sm cursor-pointer"
                >
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between z-10 animate-fade-in overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#ECEEF2] mb-6">
                <Logo size="sm" onClick={() => setMobileMenuOpen(false)} />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-1 mb-6">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 mb-1">
                  Menu
                </div>
                {row2Links.map((link) => (
                  <NavLink
                    key={link.label}
                    to={link.to}
                    end={link.to === "/"}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${
                        isActive
                          ? "text-[#101828] font-bold bg-[#FFF8E1]"
                          : "text-[#111925] font-semibold hover:bg-[#F4F5F8]"
                      }`
                    }
                  >
                    <span>{link.label}</span>
                  </NavLink>
                ))}

                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 pt-3 mb-1">
                  More Categories
                </div>
                {moreCategories.map((cat) => (
                  <NavLink
                    key={cat.label}
                    to={cat.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${
                        isActive
                          ? "text-[#101828] font-bold bg-[#FFF8E1]"
                          : "text-[#111925] font-semibold hover:bg-[#F4F5F8]"
                      }`
                    }
                  >
                    <span>{cat.label}</span>
                  </NavLink>
                ))}
                {user ? (
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-[#111925] bg-[#FFF8E1] transition-colors mt-2"
                  >
                    <User size={16} />
                    <span>My Profile & Orders</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-[#111925] bg-[#FFF8E1] transition-colors mt-2"
                  >
                    <User size={16} />
                    <span>Login / Register</span>
                  </Link>
                )}
              </div>

              <div className="border-t border-[#ECEEF2] pt-4 space-y-2">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 mb-1">
                  Partner with us
                </div>
                <a
                  href={VENDOR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-[#111925] hover:bg-slate-50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Store size={15} />
                    <span>Become a Vendor</span>
                  </span>
                  <ExternalLink size={12} className="text-slate-400" />
                </a>

                <a
                  href={RIDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-[#111925] hover:bg-slate-50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Bike size={15} />
                    <span>Become a Rider</span>
                  </span>
                  <ExternalLink size={12} className="text-slate-400" />
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-[#ECEEF2] text-center">
              <p className="text-[11px] text-slate-400 font-semibold">
                Express Grocery Delivery © {new Date().getFullYear()} FillCarts
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
