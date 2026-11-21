import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductImage } from "../utils/productImages";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Logo from "../components/Logo";
import api from "../api";
import {
  Trash2, Plus, Minus, ShoppingCart, MapPin, CreditCard, Check,
  Truck, Percent, ArrowLeft, AlertCircle, Loader2, Clock, Sparkles, QrCode, X, ChevronRight
} from "lucide-react";

export default function CartPage() {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    cartSavings,
    user
  } = useCart();

  const navigate = useNavigate();

  // Checkout form states
  const [selectedAddress, setSelectedAddress] = useState("profile");
  const [selectedPayment, setSelectedPayment] = useState("upi");

  // Promo code states
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null); // { code, discount, type }
  const [promoError, setPromoError] = useState("");

  // Order flow states
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [dbAddresses, setDbAddresses] = useState([]);
  const [pastItems, setPastItems] = useState([]);

  // Fetch unique items from past orders
  useEffect(() => {
    const loadPastItems = async () => {
      if (user) {
        try {
          const res = await api.get("/orders");
          const ordersList = res.data.orders || [];
          const itemsMap = new Map();
          ordersList.forEach(order => {
            if (Array.isArray(order.items)) {
              order.items.forEach(item => {
                itemsMap.set(item.id, item);
              });
            }
          });
          setPastItems(Array.from(itemsMap.values()));
        } catch (e) {
          if (e?.response?.status !== 401) {
            console.error("Failed to load purchase history", e);
          }
        }
      }
    };
    loadPastItems();
  }, [user]);

  // Fetch user's saved addresses
  useEffect(() => {
    const loadAddresses = async () => {
      if (user) {
        try {
          const res = await api.get("/addresses");
          setDbAddresses(res.data.addresses || []);
          if (res.data.addresses && res.data.addresses.length > 0) {
            setSelectedAddress(res.data.addresses[0].id.toString());
          } else if (user.address) {
            setSelectedAddress("profile");
          }
        } catch (e) {
          if (e?.response?.status !== 401) {
            console.error("Failed to load saved addresses", e);
          }
        }
      }
    };
    loadAddresses();
  }, [user]);

  const finalAddresses = [
    ...(user?.address ? [{
      id: "profile",
      type: "Primary Profile",
      address_line: user.address,
      phone: user.phone || "",
      pincode: user.pincode || ""
    }] : []),
    ...dbAddresses.map(addr => ({
      id: addr.id.toString(),
      type: addr.type,
      address_line: addr.address_line,
      phone: addr.phone,
      pincode: addr.pincode || ""
    }))
  ];

  const deliveryThreshold = 299;
  const standardDeliveryFee = 39;
  const taxesAndHandling = 15;

  // Compute shipping fee
  const isFreeDelivery = cartTotal >= deliveryThreshold || (appliedPromo && appliedPromo.code === "FREEDEL");
  const deliveryFee = cartTotal === 0 ? 0 : (isFreeDelivery ? 0 : standardDeliveryFee);

  // Compute discount
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === "percent") {
      discount = Math.round(cartTotal * (appliedPromo.value / 100));
    } else if (appliedPromo.type === "flat") {
      discount = Math.min(cartTotal, appliedPromo.value);
    }
  }

  const grandTotal = Math.max(0, cartTotal - discount + deliveryFee + taxesAndHandling);
  const totalSavingsAmount = cartSavings + discount + (isFreeDelivery && cartTotal > 0 ? standardDeliveryFee : 0);

  // Apply promo code handler
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError("");
    const cleanCode = promoCode.trim().toUpperCase();

    if (!cleanCode) {
      setPromoError("Please enter a promo code.");
      return;
    }

    if (cleanCode === "FILLCARTS20") {
      setAppliedPromo({ code: "FILLCARTS20", type: "percent", value: 20, description: "20% off on all items" });
      setPromoCode("");
    } else if (cleanCode === "WELCOME100") {
      if (cartTotal >= 500) {
        setAppliedPromo({ code: "WELCOME100", type: "flat", value: 100, description: "Flat ₹100 off on orders above ₹500" });
        setPromoCode("");
      } else {
        setPromoError("This coupon is only applicable for orders above ₹500.");
      }
    } else if (cleanCode === "FREEDEL") {
      setAppliedPromo({ code: "FREEDEL", type: "freedel", value: 0, description: "Free delivery applied" });
      setPromoCode("");
    } else {
      setPromoError("Invalid coupon code. Try 'FILLCARTS20' or 'FREEDEL'.");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  // Place Order handler - Redirects user to App Checkout & QR Code Modal
  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    setShowAppModal(true);
  };

  if (orderSuccess) {
    const chosenAddressObj = finalAddresses.find(a => a.id === selectedAddress);
    return (
      <div className="bg-white min-h-screen text-[#111925] flex flex-col font-sans" style={{ fontFamily: "'Manrope', sans-serif" }}>
        <Navbar />
        <main className="max-w-xl w-full mx-auto px-6 py-16 flex-1 flex flex-col justify-center items-center text-center">
          <div className="bg-white border border-[#ECEEF2] rounded-[32px] p-8 shadow-xl max-w-md w-full animate-[scaleUp_0.3s_ease-out]">
            <div className="flex justify-center mb-6">
              <Logo />
            </div>
            <div className="w-16 h-16 bg-[#FCF4E3] text-[#111925] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FEC201]/40 shadow-inner">
              <Check size={32} strokeWidth={3} className="text-[#111925]" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#111925] mb-2">
              Order Placed!
            </h1>
            <p className="text-sm text-[#6B7280] font-semibold mb-6">
              Thank you for your order. Your delivery is scheduled to arrive at your door in 15 minutes!
            </p>
            <div className="bg-[#F4F5F8] border border-[#ECEEF2] rounded-2xl p-4 text-left space-y-2 mb-8">
              <div className="flex justify-between text-xs font-bold text-[#6B7280]">
                <span>ORDER ID</span>
                <span className="text-[#111925]">#{orderId}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-[#6B7280]">
                <span>DELIVERY TO</span>
                <span className="text-[#111925] text-right truncate max-w-[200px]">{chosenAddressObj?.address_line || user?.address || "Primary Address"}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-[#6B7280]">
                <span>TOTAL PAID</span>
                <span className="text-[#111925] font-extrabold">₹{grandTotal}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                to="/profile?tab=orders"
                className="w-full bg-[#FEC201] hover:bg-[#F5B800] text-[#111925] font-extrabold py-3.5 rounded-full text-xs transition-colors block text-center shadow-md"
              >
                Track Order History
              </Link>
              <Link
                to="/"
                className="w-full border border-[#ECEEF2] hover:bg-[#F4F5F8] text-[#111925] font-extrabold py-3.5 rounded-full text-xs transition-colors block text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-[#111925] font-sans" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <Navbar />

      {/* Breadcrumb / Back button */}
      <div className="bg-white border-b border-[#ECEEF2]">
        <div className="max-w-[1216px] mx-auto px-6 py-3.5 flex items-center gap-3">
          <Link to="/categories" className="flex items-center gap-1.5 text-sm text-[#6B7280] font-bold hover:text-[#111925] transition-colors">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>
      </div>

      <main className="max-w-[1216px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111925] mb-6 sm:mb-8">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white border border-[#ECEEF2] rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto my-8 shadow-sm">
            <div className="flex justify-center mb-6">
              <Logo size="default" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#111925] mb-2">Your cart is empty</h2>
            <p className="text-[#6B7280] mb-8 max-w-sm mx-auto font-medium">
              Looks like you haven't added anything to your cart yet. Browse our categories and grab some fresh items!
            </p>
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 bg-[#FEC201] hover:bg-[#F5B800] text-[#111925] font-extrabold px-8 py-3.5 rounded-full shadow-lg transition-all hover:-translate-y-0.5"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Active Cart State */
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 sm:gap-8 items-start">

            {/* Left Column: Items, Address, Payments */}
            <div className="space-y-6">

              {/* Cart Items List */}
              <div className="bg-white border border-[#ECEEF2] rounded-3xl p-4 sm:p-6 shadow-sm">
                <div className="flex justify-between items-center pb-4 border-b border-[#ECEEF2] mb-4">
                  <h2 className="font-extrabold text-lg text-[#111925] flex items-center gap-2">
                    <ShoppingCart size={20} className="text-[#111925]" />
                    <span>Items in Cart</span>
                    <span className="text-sm font-bold text-[#111925] bg-[#FCF4E3] border border-[#FEC201]/40 px-2.5 py-0.5 rounded-full">{cartCount}</span>
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-xs text-[#6B7280] hover:text-rose-600 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-[#ECEEF2]">
                  {cart.map((item) => (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row lg:flex-row gap-3 sm:gap-4 items-start sm:items-center lg:items-center">
                      <div className="flex items-start gap-3 w-full sm:w-auto sm:flex-1 min-w-0">
                        <div className="w-16 h-16 rounded-xl bg-[#F4F5F8] border border-[#ECEEF2] overflow-hidden shrink-0">
                          <img
                            src={item.img && item.img.startsWith("http") ? item.img : getProductImage(item.name)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-extrabold text-sm text-[#111925] line-clamp-2 sm:line-clamp-1">{item.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-extrabold text-[#111925] font-mono">₹{item.price}</span>
                            {item.mrp && item.mrp > item.price && (
                              <span className="text-xs text-[#6B7280] line-through">₹{item.mrp}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Controls and Price row (stacked below sm, inline on sm/lg) */}
                      <div className="flex items-center justify-between w-full sm:w-auto gap-4 shrink-0 pl-[76px] sm:pl-0">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1.5 bg-[#F4F5F8] border border-[#ECEEF2] rounded-full p-1">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="w-7 h-7 rounded-full bg-white text-[#111925] flex items-center justify-center hover:bg-[#FCF4E3] transition-colors shadow-2xs cursor-pointer"
                          >
                            {item.quantity === 1 ? <Trash2 size={13} className="text-rose-600" /> : <Minus size={13} />}
                          </button>
                          <span className="w-6 text-center text-xs font-black text-[#111925] font-mono">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => addToCart(item)}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="w-7 h-7 rounded-full bg-[#FEC201] text-[#111925] flex items-center justify-center hover:bg-[#F5B800] transition-colors shadow-2xs cursor-pointer font-bold"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        {/* Item Subtotal */}
                        <div className="text-right min-w-[70px]">
                          <span className="text-sm font-black text-[#111925] font-mono">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Buy It Again Section */}
                {user && pastItems.length > 0 && (
                  <div className="bg-white border border-[#ECEEF2] rounded-3xl p-6 shadow-sm mt-6">
                    <h3 className="font-extrabold text-sm text-[#111925] mb-4 flex items-center gap-1.5 uppercase tracking-wide">
                      <Sparkles size={14} className="text-[#FEC201]" /> From Your Purchase History
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {pastItems.slice(0, 4).map((item) => (
                        <div key={item.id} className="border border-[#ECEEF2] rounded-2xl p-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                          <div>
                            <div className="w-full aspect-square rounded-xl bg-[#F4F5F8] overflow-hidden mb-2">
                              <img
                                src={item.img?.startsWith("http") ? item.img : `https://picsum.photos/seed/${item.img || "item"}/150/150`}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h4 className="text-xs font-bold text-[#111925] line-clamp-1">{item.name}</h4>
                            <span className="text-xs font-extrabold text-[#111925] block mt-1 font-mono">₹{item.price}</span>
                          </div>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-full bg-[#FEC201] hover:bg-[#F5B800] text-[#111925] text-[10px] font-extrabold py-2 rounded-full mt-3 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Plus size={10} /> Buy Again
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Address */}
              <div className="bg-white border border-[#ECEEF2] rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-extrabold text-lg text-[#111925] flex items-center gap-2">
                    <MapPin size={20} className="text-[#111925]" />
                    <span>Delivery Address</span>
                  </h2>
                  <Link to="/profile?tab=addresses" className="text-xs text-[#111925] hover:underline font-extrabold flex items-center gap-1">
                    Manage Addresses <ChevronRight size={12} />
                  </Link>
                </div>
                {finalAddresses.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-[#ECEEF2] rounded-2xl">
                    <p className="text-xs text-[#6B7280] font-bold mb-3">No delivery addresses found.</p>
                    <Link to="/profile?tab=addresses" className="bg-[#FEC201] text-[#111925] px-5 py-2 rounded-full text-xs font-bold shadow-xs">
                      Add Address
                    </Link>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {finalAddresses.map((addr) => {
                      const isSelected = selectedAddress === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddress(addr.id)}
                          className={`border rounded-2xl p-4 cursor-pointer relative transition-all ${isSelected
                              ? "border-[#FEC201] bg-[#FCF4E3]/40 ring-1 ring-[#FEC201]"
                              : "border-[#ECEEF2] hover:border-[#FEC201] bg-white"
                            }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isSelected ? "bg-[#FEC201] text-[#111925]" : "bg-[#F4F5F8] text-[#6B7280]"
                              }`}>
                              {addr.type}
                            </span>
                            {isSelected && <Check size={16} className="text-[#111925]" />}
                          </div>
                          <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed font-medium mb-2">{addr.address_line}</p>
                          <span className="text-[11px] text-[#111925] font-extrabold block mb-1">Pincode: {addr.pincode}</span>
                          <span className="text-[11px] text-[#6B7280] font-bold block">{addr.phone}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-[#ECEEF2] rounded-3xl p-6 shadow-sm">
                <h2 className="font-extrabold text-lg text-[#111925] mb-4 flex items-center gap-2">
                  💳 Payment Method
                </h2>
                <div className="space-y-3">
                  {[
                    { id: "upi", label: "UPI (Google Pay / PhonePe / Paytm)", desc: "Pay instantly using your UPI app", icon: Sparkles },
                    { id: "card", label: "Credit or Debit Card", desc: "Visa, Mastercard, RuPay, Maestro", icon: CreditCard },
                    { id: "cod", label: "Cash on Delivery (COD)", desc: "Pay cash/UPI at the time of delivery", icon: MapPin }
                  ].map((pm) => {
                    const isSelected = selectedPayment === pm.id;
                    return (
                      <div
                        key={pm.id}
                        onClick={() => setSelectedPayment(pm.id)}
                        className={`border rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all ${isSelected
                            ? "border-[#FEC201] bg-[#FCF4E3]/40 ring-1 ring-[#FEC201]"
                            : "border-[#ECEEF2] hover:border-[#FEC201] bg-white"
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? "bg-[#FCF4E3] text-[#111925]" : "bg-[#F4F5F8] text-[#6B7280]"
                          }`}>
                          <pm.icon size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-extrabold text-[#111925]">{pm.label}</div>
                          <div className="text-xs text-[#6B7280] font-medium">{pm.desc}</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? "border-[#FEC201] bg-[#FEC201] text-[#111925]" : "border-slate-300 bg-white"
                          }`}>
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Pricing Summary & Promos */}
            <div className="space-y-6 sticky top-24">

              {/* Promo Code Card */}
              <div className="bg-white border border-[#ECEEF2] rounded-3xl p-5 shadow-sm">
                <h3 className="font-extrabold text-sm text-[#111925] mb-3 flex items-center gap-1.5">
                  <Percent size={15} className="text-[#FEC201]" /> Apply Coupon
                </h3>

                {appliedPromo ? (
                  <div className="bg-[#FCF4E3] border border-[#FEC201]/40 rounded-2xl p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-[#111925] flex items-center gap-1">
                        Code <span className="bg-white px-1.5 py-0.5 rounded border border-[#FEC201]">{appliedPromo.code}</span> Applied!
                      </div>
                      <div className="text-[11px] text-[#6B7280] font-semibold mt-0.5">{appliedPromo.description}</div>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="text-xs text-[#6B7280] hover:text-rose-600 font-extrabold ml-2 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. FILLCARTS20"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="bg-[#F4F5F8] border border-[#ECEEF2] rounded-full px-4 py-2 text-sm font-semibold outline-none flex-1 focus:border-[#FEC201] transition-colors uppercase text-[#111925]"
                    />
                    <button
                      type="submit"
                      className="bg-[#FEC201] hover:bg-[#F5B800] text-[#111925] text-xs font-extrabold rounded-full px-5 py-2 transition-colors cursor-pointer shadow-xs"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && (
                  <div className="text-rose-600 text-[11px] font-bold mt-2 flex items-center gap-1">
                    <AlertCircle size={11} /> {promoError}
                  </div>
                )}

                {!appliedPromo && (
                  <div className="mt-3.5 bg-[#F4F5F8] rounded-2xl p-3 border border-[#ECEEF2]">
                    <div className="text-[11px] font-extrabold text-[#111925] uppercase tracking-wider mb-1">Available Coupons</div>
                    <ul className="space-y-1.5 text-xs text-[#6B7280] font-medium">
                      <li className="flex justify-between items-center">
                        <span>🏷️ <strong className="font-bold text-[#111925]">FILLCARTS20</strong> (20% Off)</span>
                        <button
                          onClick={() => { setPromoCode("FILLCARTS20"); setPromoError(""); }}
                          className="text-[10px] font-bold text-[#111925] hover:underline cursor-pointer"
                        >
                          Tap to use
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span>🏷️ <strong className="font-bold text-[#111925]">FREEDEL</strong> (Free delivery)</span>
                        <button
                          onClick={() => { setPromoCode("FREEDEL"); setPromoError(""); }}
                          className="text-[10px] font-bold text-[#111925] hover:underline cursor-pointer"
                        >
                          Tap to use
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Delivery Progress Bar threshold indicator */}
              {!isFreeDelivery && cartTotal > 0 && (
                <div className="bg-[#FCF4E3] border border-[#FEC201]/40 rounded-3xl p-5 shadow-sm text-center">
                  <div className="flex justify-between text-xs font-extrabold text-[#111925] mb-1.5">
                    <span className="flex items-center gap-1">🚚 Delivery Fee: ₹39</span>
                    <span>Add ₹{deliveryThreshold - cartTotal} more for FREE delivery</span>
                  </div>
                  <div className="w-full bg-white h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#FEC201] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (cartTotal / deliveryThreshold) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#6B7280] mt-2 font-semibold">
                    Tip: Add a small snack or drink to waive the delivery charges!
                  </p>
                </div>
              )}

              {/* Bill Details */}
              <div className="bg-white border border-[#ECEEF2] rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-extrabold text-base text-[#111925] border-b border-[#ECEEF2] pb-3">
                  Bill Summary
                </h3>

                <div className="space-y-2.5 text-sm font-semibold text-[#6B7280]">
                  <div className="flex justify-between">
                    <span>Item Total</span>
                    <span className="text-[#111925] font-mono font-bold">₹{cartTotal}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-[#0F8A43] font-bold">
                      <span>Promo Discount</span>
                      <span className="font-mono">-₹{discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Partner Fee</span>
                    <span className="text-[#111925]">
                      {deliveryFee === 0 ? (
                        <span className="text-[#0F8A43] font-bold">FREE</span>
                      ) : (
                        <span className="font-mono">₹{deliveryFee}</span>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Taxes & Handling Charges</span>
                    <span className="text-[#111925] font-mono">₹{taxesAndHandling}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-[#ECEEF2] pt-4 flex justify-between items-center">
                  <span className="font-extrabold text-base text-[#111925]">Grand Total</span>
                  <span className="font-black text-xl text-[#111925] font-mono">₹{grandTotal}</span>
                </div>

                {totalSavingsAmount > 0 && (
                  <div className="bg-[#FCF4E3] text-[#111925] text-xs font-extrabold p-3 rounded-2xl flex items-center gap-2 justify-center border border-[#FEC201]/40">
                    🎉 You save ₹{totalSavingsAmount} on this order!
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full bg-[#FEC201] hover:bg-[#F5B800] disabled:opacity-40 text-[#111925] font-extrabold py-4 rounded-full text-base transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  {isPlacingOrder ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> Processing Checkout...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout · ₹{grandTotal}
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        )}
      </main>

      <Footer />

      {/* App Checkout QR Code Modal */}
      {showAppModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-[999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-[#ECEEF2] rounded-[32px] w-full max-w-[calc(100vw-32px)] sm:max-w-sm p-5 sm:p-6 shadow-2xl relative overflow-hidden text-center max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowAppModal(false)}
              className="absolute top-4 right-4 text-[#6B7280] hover:text-[#111925] transition-colors w-7 h-7 rounded-full bg-[#F4F5F8] flex items-center justify-center cursor-pointer"
            >
              <X size={14} />
            </button>

            {/* Header */}
            <div className="mt-2 mb-5">
              <div className="w-14 h-14 bg-[#FCF4E3] text-[#111925] rounded-full flex items-center justify-center mx-auto mb-3 border border-[#FEC201]/40 shadow-inner">
                <ShoppingCart size={24} />
              </div>
              <h2 className="text-xl font-black text-[#111925] leading-snug">
                Complete Order on Mobile App
              </h2>
              <p className="text-xs text-[#6B7280] font-semibold mt-1.5 max-w-[260px] mx-auto leading-relaxed">
                To guarantee express 15-minute delivery, orders must be checked out through our mobile application.
              </p>
            </div>

            {/* QR Code Container */}
            <div className="bg-[#F4F5F8] border border-[#ECEEF2] rounded-2xl p-4 flex flex-col items-center justify-center mb-4">
              <div className="relative p-3 bg-white border border-[#ECEEF2] rounded-2xl shadow-sm mb-2.5">
                <QrCode size={120} className="text-[#111925]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-[#FEC201] rounded-lg flex items-center justify-center border-2 border-white shadow">
                  <span className="text-[9px] font-black text-[#111925] leading-none">FC</span>
                </div>
              </div>

              <div className="text-xs font-extrabold text-[#111925] mb-0.5">
                Scan with phone camera to open app
              </div>
              <div className="text-[10px] font-semibold text-[#6B7280]">
                Cart Total: <strong className="text-[#111925] font-extrabold font-mono">₹{grandTotal}</strong> ({cartCount} items)
              </div>
            </div>

            {/* Sync Alert message */}
            <div className="bg-[#FCF4E3] text-[#111925] text-xs font-bold p-3.5 rounded-2xl border border-[#FEC201]/40 mb-5 text-left leading-relaxed">
              💡 <strong className="font-extrabold text-[#111925]">Your cart is saved!</strong> Logging into the app using {user?.phone ? `+91 ${user.phone}` : "your phone number"} will automatically sync your cart for instant 15-minute delivery.
            </div>

            {/* Store Download Links */}
            <div className="flex gap-2">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-[#111925] hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-full text-xs transition-colors inline-block cursor-pointer shadow-sm text-center"
              >
                App Store
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-[#FEC201] hover:bg-[#F5B800] text-[#111925] font-extrabold py-3.5 rounded-full text-xs transition-colors inline-block cursor-pointer shadow-md text-center"
              >
                Google Play
              </a>
            </div>

          </div>
        </div>
      )}

      {/* CSS Anim keyframe injection */}
      <style>{`
        @keyframes scaleUp {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

    </div>
  );
}
