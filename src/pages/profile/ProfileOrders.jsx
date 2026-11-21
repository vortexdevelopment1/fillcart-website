import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  AlertCircle,
  Loader2,
  RefreshCw,
  X,
  ArrowRight,
} from "lucide-react";
import ProfileLayout from "./ProfileLayout";
import { useCart } from "../../context/CartContext";
import api from "../../api";

// TODO: connect API (fallback mock data for Orders when none returned from backend)
const MOCK_ORDERS = [
  {
    id: "ord-101",
    orderId: "FC-84920",
    vendorName: "City Artisan Bakery",
    createdAt: new Date().toISOString(),
    status: "Processing",
    total: 450,
    items: [
      { name: "Sourdough Bread Loaf", quantity: 1, price: 180, image: "" },
      { name: "Almond Croissant", quantity: 2, price: 135, image: "" },
    ],
    itemSummary: "Sourdough Bread Loaf, Almond Croissant",
  },
  {
    id: "ord-102",
    orderId: "FC-78392",
    vendorName: "Fresh Mart Supermarket",
    createdAt: "2026-11-15T10:30:00.000Z",
    status: "Delivered",
    total: 780,
    items: [
      { name: "Farm Fresh Cow Milk 1L", quantity: 2, price: 68, image: "" },
      { name: "Whole Wheat Atta 5kg", quantity: 1, price: 245, image: "" },
      { name: "Organic Honey 500g", quantity: 1, price: 399, image: "" },
    ],
    itemSummary: "Farm Fresh Cow Milk 1L, Whole Wheat Atta 5kg, Organic Honey",
  },
  {
    id: "ord-103",
    orderId: "FC-62911",
    vendorName: "MedPlus Pharmacy & Wellness",
    createdAt: "2026-11-02T14:15:00.000Z",
    status: "Cancelled",
    total: 320,
    items: [
      { name: "Paracetamol 650mg Strip", quantity: 2, price: 60, image: "" },
      { name: "Vitamin C Chewable Tablets", quantity: 1, price: 200, image: "" },
    ],
    itemSummary: "Paracetamol 650mg, Vitamin C Tablets",
  },
];

export default function ProfileOrders() {
  const { user, addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState("All");
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [isReorderingId, setIsReorderingId] = useState(null);

  const fetchOrders = async (statusFilter = orderFilter) => {
    setLoadingOrders(true);
    setOrderError("");
    try {
      const params = { page: 1, limit: 10 };
      if (statusFilter && statusFilter !== "All") {
        params.status = statusFilter;
      }
      const res = await api.get("/orders", { params });
      setOrders(res.data?.orders || []);
    } catch (err) {
      if (err?.response?.status !== 401) {
        setOrderError("Unable to load orders. Showing offline preview.");
      }
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders(orderFilter);
  }, [user, orderFilter]);

  const handleReorder = async (order) => {
    if (!order?.items || order.items.length === 0) return;
    setIsReorderingId(order.id);

    try {
      order.items.forEach((item) => {
        addToCart({
          id: item.productId || item.id || Math.random().toString(),
          name: item.name,
          price: item.price,
          image: item.image,
          unit: item.unit || "1 unit",
          quantity: item.quantity || 1,
        });
      });
    } catch (err) {
      console.warn("Reorder error:", err);
    } finally {
      setIsReorderingId(null);
    }
  };

  // 4-step progress tracker for ongoing orders
  const getOrderProgressStep = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("delivered")) return 3;
    if (s.includes("out") || s.includes("way")) return 2;
    if (s.includes("pack") || s.includes("process") || s.includes("confirm")) return 1;
    return 0; // Placed
  };

  // Determine display orders (fallback to mock if empty)
  const displayOrders = orders.length > 0 ? orders : MOCK_ORDERS;
  const filteredOrders = displayOrders.filter((order) => {
    if (orderFilter === "All") return true;
    if (orderFilter === "Ongoing") {
      return ["Placed", "Confirmed", "Processing", "Packed", "Out for delivery", "On the way"].includes(order.status);
    }
    if (orderFilter === "Delivered") return order.status === "Delivered";
    if (orderFilter === "Cancelled") return order.status === "Cancelled";
    return true;
  });

  return (
    <ProfileLayout activeTab="orders" pageName="My Orders">
      {/* 1. Header Card */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #ECECE6",
          borderRadius: "20px",
          boxShadow: "0 1px 2px rgba(16,24,40,.04)",
          padding: "24px 28px",
        }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: 800,
              color: "#101828",
              lineHeight: "36px",
            }}
            className="m-0"
          >
            My Orders
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "#667085",
              marginTop: "4px",
            }}
            className="m-0"
          >
            Track ongoing orders and reorder your favorites.
          </p>
        </div>

        {/* Pill switch tabs: container bg #F2F2EC, padding 4px, rounded-full */}
        <div
          role="tablist"
          aria-label="Order status filter"
          style={{
            backgroundColor: "#F2F2EC",
            padding: "4px",
            borderRadius: "999px",
          }}
          className="inline-flex items-center gap-1 self-start md:self-auto overflow-x-auto no-scrollbar"
        >
          {["All", "Ongoing", "Delivered", "Cancelled"].map((tabLabel) => {
            const isSelected = orderFilter === tabLabel;
            return (
              <button
                key={tabLabel}
                role="tab"
                aria-selected={isSelected}
                type="button"
                onClick={() => setOrderFilter(tabLabel)}
                style={{
                  backgroundColor: isSelected ? "#101828" : "transparent",
                  color: isSelected ? "#FFFFFF" : "#475467",
                  borderRadius: "999px",
                  padding: "6px 16px",
                  fontSize: "13px",
                  fontWeight: isSelected ? 700 : 600,
                }}
                className={`transition-colors cursor-pointer whitespace-nowrap ${
                  isSelected ? "shadow-xs" : "hover:text-[#101828]"
                } focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F5B800]`}
              >
                {tabLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loadingOrders && (
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #ECECE6",
            borderRadius: "20px",
            padding: "32px",
          }}
          className="flex flex-col items-center justify-center gap-3"
        >
          <Loader2 size={30} className="animate-spin text-[#F5B800]" />
          <p style={{ fontSize: "14px", color: "#667085", fontWeight: 600 }}>
            Loading your orders...
          </p>
        </div>
      )}

      {/* Empty State Card */}
      {!loadingOrders && filteredOrders.length === 0 && (
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #ECECE6",
            borderRadius: "20px",
            boxShadow: "0 1px 2px rgba(16,24,40,.04)",
            padding: "48px 24px",
          }}
          className="text-center flex flex-col items-center justify-center"
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "999px",
              backgroundColor: "#FFF4CC",
              color: "#101828",
            }}
            className="flex items-center justify-center mb-4"
          >
            <ShoppingBag size={26} />
          </div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: "#101828",
              marginBottom: "6px",
            }}
            className="m-0"
          >
            No orders yet
          </h3>
          <p
            style={{
              fontSize: "14px",
              color: "#667085",
              maxWidth: "380px",
              marginBottom: "24px",
              lineHeight: "22px",
            }}
            className="m-0"
          >
            When you order groceries or essentials from local stores, they will appear here so you can track delivery and reorder anytime.
          </p>
          <Link
            to="/"
            style={{
              height: "44px",
              borderRadius: "999px",
              backgroundColor: "#F5B800",
              color: "#101828",
              padding: "0 24px",
              fontSize: "14px",
              fontWeight: 700,
            }}
            className="hover:brightness-105 transition-all shadow-xs inline-flex items-center gap-2"
          >
            <span>Start shopping</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {/* Orders List */}
      {!loadingOrders && filteredOrders.length > 0 && (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => {
            const isOngoing = ["Placed", "Confirmed", "Processing", "Packed", "Out for delivery", "On the way"].includes(order.status);
            const isDelivered = order.status === "Delivered";
            const isCancelled = order.status === "Cancelled";

            const progressStep = getOrderProgressStep(order.status);
            const formattedDate = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Recent order";

            return (
              <article
                key={order.id || order.orderId}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #ECECE6",
                  borderRadius: "20px",
                  boxShadow: "0 1px 2px rgba(16,24,40,.04)",
                  padding: "24px 28px",
                }}
                className="flex flex-col gap-4"
              >
                {/* Row 1: Order #<id> + Date/Store + Status pill */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2
                      style={{
                        fontSize: "16px",
                        fontWeight: 800,
                        color: "#101828",
                      }}
                      className="m-0 leading-tight"
                    >
                      Order #{order.orderId || order.id}
                    </h2>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#667085",
                        marginTop: "3px",
                      }}
                      className="m-0"
                    >
                      {formattedDate}
                      {order.vendorName ? ` · ${order.vendorName}` : ""}
                    </p>
                  </div>

                  {/* Status Pill (rounded-full, 12-13px, 700) */}
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      borderRadius: "999px",
                      padding: "3px 12px",
                      backgroundColor: isDelivered
                        ? "#E6F4EA"
                        : isCancelled
                        ? "#FDECEC"
                        : "#FFF4CC",
                      color: isDelivered
                        ? "#16603A"
                        : isCancelled
                        ? "#A12121"
                        : "#7A5A00",
                    }}
                    className="inline-flex items-center gap-1.5 shrink-0"
                  >
                    {isOngoing && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7A5A00] animate-pulse" />
                    )}
                    {order.status || "Confirmed"}
                  </span>
                </div>

                {/* Ongoing Orders: 4-step progress line (Placed, Packed, On the way, Delivered) */}
                {isOngoing && (
                  <div className="w-full my-1 py-2">
                    <div className="flex items-center justify-between relative px-3 sm:px-6">
                      {/* Background track */}
                      <div className="absolute top-[14px] left-[32px] sm:left-[48px] right-[32px] sm:right-[48px] h-[3px] bg-[#E4E4DC] -z-0" />
                      {/* Progress track */}
                      <div
                        className="absolute top-[14px] left-[32px] sm:left-[48px] h-[3px] bg-[#F5B800] transition-all duration-300 -z-0"
                        style={{
                          width:
                            progressStep === 0
                              ? "0%"
                              : progressStep === 1
                              ? "33%"
                              : progressStep === 2
                              ? "66%"
                              : "100%",
                        }}
                      />

                      {[
                        { label: "Placed", index: 0 },
                        { label: "Packed", index: 1 },
                        { label: "On the way", index: 2 },
                        { label: "Delivered", index: 3 },
                      ].map((st) => {
                        const isCompleted = progressStep > st.index;
                        const isCurrent = progressStep === st.index;

                        return (
                          <div
                            key={st.label}
                            className="flex flex-col items-center relative z-10"
                          >
                            <div
                              style={{
                                backgroundColor:
                                  isCompleted || isCurrent ? "#F5B800" : "#E4E4DC",
                                color: "#101828",
                              }}
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-extrabold transition-all ${
                                isCurrent ? "ring-4 ring-[#FFF4CC]" : ""
                              }`}
                            >
                              {isCompleted ? "✓" : st.index + 1}
                            </div>
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: 600,
                                color: isCurrent || isCompleted ? "#101828" : "#667085",
                                marginTop: "6px",
                              }}
                            >
                              {st.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Row 2: Item tiles (56px rounded squares with image/initials) + item names text */}
                <div className="flex items-center gap-3.5 flex-wrap sm:flex-nowrap">
                  {order.items && order.items.length > 0 ? (
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 shrink-0">
                      {order.items.slice(0, 4).map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "12px",
                            border: "1px solid #ECECE6",
                            backgroundColor: "#F4F5F8",
                          }}
                          className="relative overflow-hidden flex items-center justify-center shrink-0"
                          title={`${item.name} (x${item.quantity || 1})`}
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="text-xs font-bold text-[#667085]">
                              {(item.name || "Item").slice(0, 2).toUpperCase()}
                            </span>
                          )}
                          {(item.quantity || 1) > 1 && (
                            <span
                              style={{
                                backgroundColor: "#101828",
                                color: "#FFFFFF",
                                fontSize: "10px",
                                fontWeight: 700,
                                borderRadius: "999px",
                                padding: "1px 5px",
                              }}
                              className="absolute bottom-1 right-1 leading-tight"
                            >
                              x{item.quantity}
                            </span>
                          )}
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div
                          style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "12px",
                            border: "1px solid #ECECE6",
                            backgroundColor: "#F2F2EC",
                            color: "#475467",
                            fontSize: "12px",
                            fontWeight: 700,
                          }}
                          className="flex items-center justify-center shrink-0"
                        >
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "12px",
                        border: "1px solid #ECECE6",
                        backgroundColor: "#F4F5F8",
                      }}
                      className="flex items-center justify-center shrink-0 text-xs font-bold text-[#667085]"
                    >
                      FC
                    </div>
                  )}

                  {/* Item names summary */}
                  <div className="flex-1 min-w-[180px]">
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#101828",
                        lineHeight: "20px",
                      }}
                      className="m-0 line-clamp-2"
                    >
                      {order.itemSummary ||
                        (order.items && order.items.map((it) => it.name).join(", ")) ||
                        "Grocery & Household Essentials"}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#667085",
                        marginTop: "3px",
                      }}
                      className="m-0"
                    >
                      {order.items?.length || 1} {order.items?.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>

                {/* Footer (border-top 1px #ECECE6): Total on left, buttons on right */}
                <div
                  style={{
                    borderTop: "1px solid #ECECE6",
                    paddingTop: "16px",
                    marginTop: "4px",
                  }}
                  className="flex items-center justify-between flex-wrap gap-3"
                >
                  {/* Left: Total or refund note */}
                  <div>
                    {isCancelled ? (
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#667085",
                        }}
                      >
                        Refund processed to original payment method
                      </span>
                    ) : (
                      <div className="flex items-baseline gap-1.5">
                        <span style={{ fontSize: "13px", color: "#667085", fontWeight: 500 }}>
                          Total
                        </span>
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: 800,
                            color: "#101828",
                          }}
                        >
                          ₹{order.total}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right buttons: View details (ghost) + Reorder or Track order (primary) */}
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedOrderDetails(order)}
                      style={{
                        height: "44px",
                        borderRadius: "999px",
                        border: "1px solid #D0D5DD",
                        backgroundColor: "#FFFFFF",
                        color: "#101828",
                        fontSize: "14px",
                        fontWeight: 600,
                        padding: "0 20px",
                      }}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      View details
                    </button>

                    {isOngoing ? (
                      <button
                        type="button"
                        onClick={() => setSelectedOrderDetails(order)}
                        style={{
                          height: "44px",
                          borderRadius: "999px",
                          backgroundColor: "#F5B800",
                          color: "#101828",
                          fontSize: "14px",
                          fontWeight: 700,
                          padding: "0 20px",
                        }}
                        className="hover:brightness-105 transition-all shadow-xs cursor-pointer"
                      >
                        Track order
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleReorder(order)}
                        disabled={isReorderingId === order.id}
                        style={{
                          height: "44px",
                          borderRadius: "999px",
                          backgroundColor: "#F5B800",
                          color: "#101828",
                          fontSize: "14px",
                          fontWeight: 700,
                          padding: "0 20px",
                        }}
                        className="hover:brightness-105 transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isReorderingId === order.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : null}
                        <span>Reorder</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ORDER DETAIL MODAL */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[calc(100vw-32px)] sm:max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-xl relative text-left border border-[#ECECE6]">
            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 transition-colors w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>

            <div className="pb-4 border-b border-[#ECECE6] mb-4">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#936D00]">
                {selectedOrderDetails.vendorName || "FillCarts Fresh Market"}
              </span>
              <h2 className="text-xl font-extrabold text-[#101828] mt-0.5">
                Order #{selectedOrderDetails.orderId || selectedOrderDetails.id}
              </h2>
              <p className="text-xs text-[#667085] font-medium">
                Placed on {new Date(selectedOrderDetails.createdAt).toLocaleString("en-IN")}
              </p>
            </div>

            {/* Items List */}
            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#667085] mb-2">
                Order Items ({selectedOrderDetails.items?.length || 0})
              </h4>
              <div className="divide-y divide-[#ECECE6] border border-[#ECECE6] rounded-[14px] overflow-hidden bg-white">
                {selectedOrderDetails.items?.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs font-bold">
                    <div className="min-w-0 pr-2">
                      <div className="text-[#101828] truncate text-sm">{item.name}</div>
                      <div className="text-[11px] text-[#667085] font-medium mt-0.5">
                        Qty: {item.quantity || 1} {item.unit ? `· ${item.unit}` : ""}
                      </div>
                    </div>
                    <div className="text-[#101828] font-extrabold shrink-0 text-sm">
                      ₹{(item.price || 0) * (item.quantity || 1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-[#F6F6F2] rounded-[14px] p-4 space-y-2 text-xs font-semibold mb-5 border border-[#ECECE6]">
              <div className="flex justify-between text-[#667085]">
                <span>Items Subtotal</span>
                <span>₹{selectedOrderDetails.subtotal || selectedOrderDetails.total}</span>
              </div>
              <div className="flex justify-between text-[#667085]">
                <span>Delivery Fee</span>
                <span>{selectedOrderDetails.deliveryFee === 0 ? "FREE" : `₹${selectedOrderDetails.deliveryFee || 0}`}</span>
              </div>
              <div className="border-t border-[#ECECE6] pt-2 flex justify-between text-sm font-extrabold text-[#101828]">
                <span>Total Amount</span>
                <span>₹{selectedOrderDetails.total}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOrderDetails(null)}
              style={{
                height: "44px",
                borderRadius: "999px",
                backgroundColor: "#F5B800",
                color: "#101828",
                fontSize: "14px",
                fontWeight: 700,
              }}
              className="w-full hover:brightness-105 transition-all shadow-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </ProfileLayout>
  );
}
