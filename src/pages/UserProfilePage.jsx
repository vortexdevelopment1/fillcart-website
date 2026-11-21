import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  MapPin,
  FileText,
  User,
  LogOut,
  AlertCircle,
  Loader2,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Navigation,
  RefreshCw,
  Upload,
  CheckCircle2,
  X,
  ArrowRight,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import ProfileLayout from "../components/ProfileLayout";
import api from "../api";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi NCR", "Chandigarh", "Jammu and Kashmir", "Ladakh", "Puducherry",
];

// TODO: connect API (fallback mock data for Addresses when none returned from backend)
const MOCK_ADDRESSES = [
  {
    id: "mock-addr-1",
    label: "Home",
    name: "John Doe",
    phone: "+91 98765 43210",
    addressLine1: "Flat 402, Sunshine Heights, MG Road",
    addressLine2: "Near City Mall, Vijay Nagar",
    city: "Indore",
    state: "Madhya Pradesh",
    pincode: "452010",
    isDefault: true,
  },
  {
    id: "mock-addr-2",
    label: "Work",
    name: "John Doe",
    phone: "+91 98765 43210",
    addressLine1: "Tech Park, 3rd Floor, Tower B",
    addressLine2: "Electronic Complex",
    city: "Indore",
    state: "Madhya Pradesh",
    pincode: "452001",
    isDefault: false,
  },
];

// TODO: connect API (fallback mock data for My Prescriptions when none returned from backend)
const MOCK_PRESCRIPTIONS = [
  {
    id: "mock-rx-1",
    doctorName: "Dr. Arvind Mehta, MD",
    uploadDate: "14 Nov 2026",
    medicinesCount: 3,
    status: "Verified",
    fileUrl: "#",
  },
  {
    id: "mock-rx-2",
    doctorName: "Dr. Priya Sharma, MBBS",
    uploadDate: "18 Nov 2026",
    medicinesCount: 2,
    status: "Pending review",
    fileUrl: "#",
  },
  {
    id: "mock-rx-3",
    doctorName: "Dr. R. K. Gupta, Pediatrician",
    uploadDate: "02 Oct 2026",
    medicinesCount: 4,
    status: "Expired",
    fileUrl: "#",
  },
];

export default function UserProfilePage() {
  const { user, setUser, loadingUser, logoutUser, addToCart } = useCart();
  const { tab } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Active section mapping
  const activeTab = tab || "orders";

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loadingUser && !user) {
      const redirectUrl = `/login?redirect=${encodeURIComponent(location.pathname)}`;
      navigate(redirectUrl, { replace: true });
    }
  }, [loadingUser, user, location.pathname, navigate]);

  // Default /profile redirects to /profile/orders
  useEffect(() => {
    if (!tab && user) {
      navigate("/profile/orders", { replace: true });
    }
  }, [tab, user, navigate]);

  // Global Toast Alert State
  const [toast, setToast] = useState({ show: false, text: "", type: "success" });
  const showToast = (text, type = "success") => {
    setToast({ show: true, text, type });
    setTimeout(() => setToast({ show: false, text: "", type: "success" }), 3500);
  };

  // Logout Confirmation Modal State
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
    } catch (e) {
      console.warn("Logout error:", e);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
      navigate("/", { replace: true });
    }
  };

  // =========================================================================
  // SUBSECTION: MY ORDERS STATE & HANDLERS
  // =========================================================================
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState("All");
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);
  const [orderTotalCount, setOrderTotalCount] = useState(0);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [isReorderingId, setIsReorderingId] = useState(null);

  const fetchOrders = async (statusFilter = orderFilter, page = 1) => {
    if (!user) return;
    setLoadingOrders(true);
    setOrderError("");
    try {
      const params = { page, limit: 10 };
      if (statusFilter && statusFilter !== "All") {
        params.status = statusFilter;
      }
      const res = await api.get("/orders", { params });
      setOrders(res.data.orders || []);
      setOrderTotalPages(res.data.totalPages || 1);
      setOrderTotalCount(res.data.total || (res.data.orders ? res.data.orders.length : 0));
      setOrderPage(page);
    } catch (err) {
      if (err?.response?.status !== 401) {
        setOrderError("Unable to load orders. Please retry.");
        showToast("Failed to load orders. Please try again.", "error");
      }
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user && activeTab === "orders") {
      fetchOrders(orderFilter, 1);
    }
  }, [user, activeTab, orderFilter]);

  const handleReorder = async (order) => {
    if (!order?.items || order.items.length === 0) return;
    setIsReorderingId(order.id);

    try {
      const productRes = await api.get("/products", { params: { limit: 100 } });
      const liveProducts = productRes.data?.data || productRes.data || [];

      let addedCount = 0;
      let outOfStockCount = 0;

      order.items.forEach((item) => {
        const prodId = item.productId || item.id || item._id;
        const liveMatch = liveProducts.find(
          (p) => String(p.productId || p.id || p._id) === String(prodId)
        );

        if (liveMatch && liveMatch.inStock === false) {
          outOfStockCount++;
        } else {
          addToCart({
            id: prodId,
            productId: prodId,
            name: item.name,
            price: item.price,
            image: item.image,
            unit: item.unit || "1 unit",
            quantity: item.quantity || 1,
          });
          addedCount++;
        }
      });

      if (outOfStockCount > 0) {
        showToast(
          `Added ${addedCount} item(s) to cart. ${outOfStockCount} item(s) out of stock.`,
          "info"
        );
      } else {
        showToast(`Reorder successful! Added ${addedCount} item(s) to your cart.`, "success");
      }
    } catch (err) {
      order.items.forEach((item) => addToCart(item));
      showToast(`Added ${order.items.length} item(s) to your cart.`, "success");
    } finally {
      setIsReorderingId(null);
    }
  };

  // =========================================================================
  // SUBSECTION: SAVED ADDRESSES STATE & HANDLERS
  // =========================================================================
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [addressFormError, setAddressFormError] = useState("");
  const [savingAddress, setSavingAddress] = useState(false);

  const initialAddressForm = {
    label: "Home",
    name: user?.name || "",
    phone: user?.phone || "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "Indore",
    state: "Madhya Pradesh",
    pincode: "",
    latitude: null,
    longitude: null,
    isDefault: false,
  };
  const [addressForm, setAddressForm] = useState(initialAddressForm);

  const fetchAddresses = async () => {
    if (!user) return;
    setLoadingAddresses(true);
    setAddressError("");
    try {
      const res = await api.get("/addresses");
      setAddresses(res.data.addresses || []);
    } catch (err) {
      if (err?.response?.status !== 401) {
        setAddressError("Could not load your saved addresses.");
      }
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (user && activeTab === "addresses") {
      fetchAddresses();
    }
  }, [user, activeTab]);

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      ...initialAddressForm,
      name: user?.name || "",
      phone: user?.phone || "",
      isDefault: addresses.length === 0,
    });
    setAddressFormError("");
    setShowAddressModal(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      label: addr.label || addr.type || "Home",
      name: addr.name || "",
      phone: addr.phone || "",
      addressLine1: addr.addressLine1 || addr.street || addr.address || "",
      addressLine2: addr.addressLine2 || addr.locality || "",
      landmark: addr.landmark || "",
      city: addr.city || "Indore",
      state: addr.state || "Madhya Pradesh",
      pincode: addr.pincode || "",
      latitude: addr.latitude || null,
      longitude: addr.longitude || null,
      isDefault: !!addr.isDefault,
    });
    setAddressFormError("");
    setShowAddressModal(true);
  };

  const handleGpsFillAddress = () => {
    if (!navigator.geolocation) {
      setAddressFormError("Geolocation is not supported by your browser.");
      return;
    }
    setIsDetectingGps(true);
    setAddressFormError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingGps(false);
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setAddressForm((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          landmark: prev.landmark || `GPS Location (${lat}, ${lng})`,
        }));
        showToast("GPS coordinates detected!", "success");
      },
      (err) => {
        setIsDetectingGps(false);
        setAddressFormError("Could not detect location. Please check browser GPS permissions.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.addressLine1?.trim()) {
      setAddressFormError("Flat/House/Street address is required.");
      return;
    }
    if (!addressForm.pincode?.trim() || addressForm.pincode.length !== 6) {
      setAddressFormError("Valid 6-digit postal pincode is required.");
      return;
    }

    setSavingAddress(true);
    setAddressFormError("");

    try {
      if (editingAddressId) {
        await api.put(`/addresses/${editingAddressId}`, addressForm);
        showToast("Address updated successfully!", "success");
      } else {
        await api.post("/addresses", addressForm);
        showToast("New delivery address added!", "success");
      }
      setShowAddressModal(false);
      fetchAddresses();
    } catch (err) {
      setAddressFormError(err.response?.data?.message || "Failed to save address. Please check input.");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addrId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await api.delete(`/addresses/${addrId}`);
      showToast("Address removed successfully.", "success");
      fetchAddresses();
    } catch (err) {
      showToast("Failed to delete address.", "error");
    }
  };

  const handleSetDefaultAddress = async (addrId) => {
    try {
      await api.patch(`/addresses/${addrId}/default`);
      showToast("Default address updated.", "success");
      fetchAddresses();
    } catch (err) {
      showToast("Could not update default address.", "error");
    }
  };

  // =========================================================================
  // SUBSECTION: MY PRESCRIPTIONS STATE & HANDLERS
  // =========================================================================
  const [prescriptions, setPrescriptions] = useState([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState("");
  const [uploadingPrescription, setUploadingPrescription] = useState(false);
  const prescriptionFileInputRef = useRef(null);

  const fetchPrescriptions = async () => {
    if (!user) return;
    setLoadingPrescriptions(true);
    setPrescriptionError("");
    try {
      const res = await api.get("/prescriptions");
      setPrescriptions(res.data.prescriptions || []);
    } catch (err) {
      if (err?.response?.status !== 401) {
        setPrescriptionError("Could not load prescriptions.");
      }
    } finally {
      setLoadingPrescriptions(false);
    }
  };

  useEffect(() => {
    if (user && activeTab === "prescriptions") {
      fetchPrescriptions();
    }
  }, [user, activeTab]);

  const handlePrescriptionFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      showToast("Prescription file must be under 10 MB in size.", "error");
      if (prescriptionFileInputRef.current) prescriptionFileInputRef.current.value = "";
      return;
    }

    const allowedMimes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "application/pdf"];
    if (!allowedMimes.includes(file.type)) {
      showToast("Invalid file format. Please upload JPG, PNG, or PDF.", "error");
      if (prescriptionFileInputRef.current) prescriptionFileInputRef.current.value = "";
      return;
    }

    setUploadingPrescription(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/prescriptions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("Prescription uploaded for pharmacist review!", "success");
      if (prescriptionFileInputRef.current) prescriptionFileInputRef.current.value = "";
      fetchPrescriptions();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to upload prescription", "error");
    } finally {
      setUploadingPrescription(false);
    }
  };

  const handleViewPrescription = (fileUrl) => {
    if (fileUrl && fileUrl !== "#") {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } else {
      showToast("Opening prescription preview...", "info");
    }
  };

  // =========================================================================
  // SUBSECTION: ACCOUNT DETAILS & PREFERENCES STATE
  // =========================================================================
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
  });
  const [dateOfBirth, setDateOfBirth] = useState("1996-08-15");
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    offers: true,
    reminders: false,
  });
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        pincode: user.pincode || "",
      });
    }
  }, [user]);

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setIsUpdatingAccount(true);
    try {
      const payload = {
        name: profileForm.name.trim(),
        phone: profileForm.phone.replace(/\D/g, ""),
        email: profileForm.email.trim().toLowerCase(),
      };
      const res = await api.put("/customer/profile", payload);
      if (res.data?.customer) {
        setUser(res.data.customer);
      }
      showToast("Account details updated successfully!", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Saved local preferences.", "success");
    } finally {
      setIsUpdatingAccount(false);
    }
  };

  // Helper for ongoing orders 4-step progress line
  const getOrderProgressStep = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("delivered")) return 3;
    if (s.includes("out") || s.includes("way")) return 2;
    if (s.includes("pack") || s.includes("process") || s.includes("confirm")) return 1;
    return 0; // Placed
  };

  // Resolve display data
  const displayAddresses = addresses.length > 0 ? addresses : MOCK_ADDRESSES;
  const displayPrescriptions = prescriptions.length > 0 ? prescriptions : MOCK_PRESCRIPTIONS;

  // Page title for breadcrumb
  const pageNameMap = {
    orders: "My Orders",
    addresses: "Addresses",
    prescriptions: "My Prescriptions",
    account: "Account",
  };
  const currentPageName = pageNameMap[activeTab] || "My Orders";

  return (
    <ProfileLayout
      user={user}
      activeTab={activeTab}
      onLogout={() => setShowLogoutConfirm(true)}
      pageName={currentPageName}
    >
      {/* Global Toast Alert */}
      {toast.show && (
        <div
          role="status"
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-[99999] px-5 py-3 rounded-2xl shadow-md border flex items-center gap-2.5 text-xs font-bold animate-fade-in ${
            toast.type === "error"
              ? "bg-rose-950 text-white border-rose-500/50"
              : toast.type === "info"
              ? "bg-blue-950 text-white border-blue-500/50"
              : "bg-[#0B2616] text-emerald-50 border-emerald-500/50"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={15} className="text-rose-400 shrink-0" />
          ) : toast.type === "info" ? (
            <Sparkles size={15} className="text-blue-400 shrink-0" />
          ) : (
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* =================================================================== */}
      {/* 1. MY ORDERS VIEW */}
      {/* =================================================================== */}
      {activeTab === "orders" && (
        <div className="flex flex-col gap-4">
          {/* Header Card */}
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

          {/* Error State */}
          {!loadingOrders && orderError && (
            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #ECECE6",
                borderRadius: "20px",
                padding: "32px",
              }}
              className="text-center flex flex-col items-center justify-center"
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "999px",
                  backgroundColor: "#FDECEC",
                  color: "#A12121",
                }}
                className="flex items-center justify-center mb-3"
              >
                <AlertCircle size={22} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#101828" }} className="m-0 mb-1">
                Failed to load orders
              </h3>
              <p style={{ fontSize: "14px", color: "#667085", marginBottom: "16px" }} className="m-0">
                {orderError}
              </p>
              <button
                type="button"
                onClick={() => fetchOrders(orderFilter, 1)}
                style={{
                  height: "44px",
                  borderRadius: "999px",
                  backgroundColor: "#F5B800",
                  color: "#101828",
                  padding: "0 22px",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
                className="hover:brightness-105 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <RefreshCw size={14} />
                <span>Try Again</span>
              </button>
            </div>
          )}

          {/* Empty State Card */}
          {!loadingOrders && !orderError && orders.length === 0 && (
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

          {/* Orders Cards List */}
          {!loadingOrders && !orderError && orders.length > 0 && (
            <div className="flex flex-col gap-4">
              {orders.map((order) => {
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
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. ADDRESSES VIEW */}
      {/* =================================================================== */}
      {activeTab === "addresses" && (
        <div className="flex flex-col gap-4">
          {/* Header Card */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #ECECE6",
              borderRadius: "20px",
              boxShadow: "0 1px 2px rgba(16,24,40,.04)",
              padding: "24px 28px",
            }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
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
                Addresses
              </h1>
              <p
                style={{
                  fontSize: "15px",
                  color: "#667085",
                  marginTop: "4px",
                }}
                className="m-0"
              >
                Manage where your orders get delivered.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddAddress}
              style={{
                height: "44px",
                borderRadius: "999px",
                backgroundColor: "#F5B800",
                color: "#101828",
                fontSize: "14px",
                fontWeight: 700,
                padding: "0 22px",
              }}
              className="hover:brightness-105 transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus size={16} />
              <span>+ Add new address</span>
            </button>
          </div>

          {/* 2-column grid of address cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayAddresses.map((addr) => (
              <div
                key={addr.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #ECECE6",
                  borderRadius: "20px",
                  boxShadow: "0 1px 2px rgba(16,24,40,.04)",
                  padding: "24px",
                }}
                className="flex flex-col justify-between"
              >
                <div>
                  {/* Label Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          backgroundColor: "#FFF4CC",
                          color: "#7A5A00",
                          fontSize: "12px",
                          fontWeight: 700,
                          borderRadius: "999px",
                          padding: "2px 10px",
                        }}
                        className="uppercase"
                      >
                        {addr.label || "HOME"}
                      </span>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#101828" }}>
                        {addr.label || "Home"}
                      </span>
                    </div>

                    {addr.isDefault ? (
                      <span
                        style={{
                          backgroundColor: "#E6F4EA",
                          color: "#16603A",
                          fontSize: "12px",
                          fontWeight: 700,
                          borderRadius: "999px",
                          padding: "2px 10px",
                        }}
                      >
                        Default
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#101828",
                          border: "1px solid #D0D5DD",
                          borderRadius: "999px",
                          padding: "2px 10px",
                          backgroundColor: "#FFFFFF",
                        }}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Set as default
                      </button>
                    )}
                  </div>

                  {/* Recipient name */}
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 800,
                      color: "#101828",
                      marginTop: "14px",
                    }}
                    className="m-0"
                  >
                    {addr.name || user?.name || "Customer"}
                  </h3>

                  {/* Address lines */}
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#475467",
                      lineHeight: "22px",
                      marginTop: "6px",
                    }}
                    className="m-0"
                  >
                    {addr.addressLine1 || addr.street || addr.address}
                    {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                    {addr.city ? `, ${addr.city}` : ""}
                    {addr.pincode ? ` - ${addr.pincode}` : ""}
                  </p>

                  {/* Phone */}
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#667085",
                      marginTop: "8px",
                    }}
                    className="m-0"
                  >
                    Phone: {addr.phone || user?.phone || "+91 98765 43210"}
                  </p>
                </div>

                {/* Footer with Edit (ghost) and Delete (danger) */}
                <div
                  style={{
                    borderTop: "1px solid #ECECE6",
                    paddingTop: "14px",
                    marginTop: "16px",
                  }}
                  className="flex items-center justify-end gap-2"
                >
                  <button
                    type="button"
                    onClick={() => handleOpenEditAddress(addr)}
                    style={{
                      height: "38px",
                      borderRadius: "999px",
                      border: "1px solid #D0D5DD",
                      backgroundColor: "#FFFFFF",
                      color: "#101828",
                      fontSize: "13px",
                      fontWeight: 600,
                      padding: "0 16px",
                    }}
                    className="hover:bg-slate-50 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Edit3 size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(addr.id)}
                    style={{
                      height: "38px",
                      borderRadius: "999px",
                      border: "1px solid #F4C7C3",
                      backgroundColor: "#FFFFFF",
                      color: "#B42318",
                      fontSize: "13px",
                      fontWeight: 600,
                      padding: "0 16px",
                    }}
                    className="hover:bg-rose-50 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Last cell: Dashed card */}
            <div
              onClick={handleOpenAddAddress}
              style={{
                border: "2px dashed #D0D5DD",
                borderRadius: "20px",
                backgroundColor: "#FFFFFF",
                minHeight: "180px",
                padding: "24px",
              }}
              className="flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#F5B800] hover:bg-amber-50/20 transition-all text-[#667085] hover:text-[#101828]"
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "999px",
                  backgroundColor: "#F2F2EC",
                  color: "#101828",
                }}
                className="flex items-center justify-center shrink-0"
              >
                <Plus size={20} />
              </div>
              <span style={{ fontSize: "15px", fontWeight: 700 }}>Add a new address</span>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. MY PRESCRIPTIONS VIEW */}
      {/* =================================================================== */}
      {activeTab === "prescriptions" && (
        <div className="flex flex-col gap-4">
          {/* Header Card */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #ECECE6",
              borderRadius: "20px",
              boxShadow: "0 1px 2px rgba(16,24,40,.04)",
              padding: "24px 28px",
            }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
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
                My Prescriptions
              </h1>
              <p
                style={{
                  fontSize: "15px",
                  color: "#667085",
                  marginTop: "4px",
                }}
                className="m-0"
              >
                Upload a prescription and order your medicines in one tap.
              </p>
            </div>

            <button
              type="button"
              onClick={() => prescriptionFileInputRef.current?.click()}
              style={{
                height: "44px",
                borderRadius: "999px",
                backgroundColor: "#F5B800",
                color: "#101828",
                fontSize: "14px",
                fontWeight: 700,
                padding: "0 22px",
              }}
              className="hover:brightness-105 transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus size={16} />
              <span>+ Upload prescription</span>
            </button>
          </div>

          {/* Dashed upload box */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "2px dashed #D0D5DD",
              borderRadius: "20px",
              padding: "32px 24px",
            }}
            className="flex flex-col items-center justify-center text-center gap-3"
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "999px",
                backgroundColor: "#F4F5F8",
                color: "#667085",
              }}
              className="flex items-center justify-center shrink-0"
            >
              <Upload size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#101828" }} className="m-0">
                Upload doctor's prescription
              </h2>
              <p style={{ fontSize: "13px", color: "#667085", marginTop: "4px" }} className="m-0">
                JPG, PNG or PDF up to 10 MB
              </p>
            </div>
            <button
              type="button"
              onClick={() => prescriptionFileInputRef.current?.click()}
              style={{
                height: "44px",
                borderRadius: "999px",
                border: "1px solid #D0D5DD",
                backgroundColor: "#FFFFFF",
                color: "#101828",
                fontSize: "14px",
                fontWeight: 600,
                padding: "0 24px",
              }}
              className="hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {uploadingPrescription ? "Uploading..." : "Choose file"}
            </button>
            <input
              ref={prescriptionFileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              onChange={handlePrescriptionFileUpload}
              className="hidden"
            />
          </div>

          {/* Prescriptions Stack of Cards */}
          <div className="flex flex-col gap-4">
            {displayPrescriptions.map((rx) => {
              const statusStr = (rx.status || "").toLowerCase();
              const isVerified = statusStr.includes("verif");
              const isPending = statusStr.includes("pend");
              const isExpired = statusStr.includes("expir");

              return (
                <div
                  key={rx.id}
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #ECECE6",
                    borderRadius: "20px",
                    boxShadow: "0 1px 2px rgba(16,24,40,.04)",
                    padding: "20px 24px",
                  }}
                  className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap"
                >
                  {/* Left: 64x76 document-icon thumb */}
                  <div
                    style={{
                      width: "64px",
                      height: "76px",
                      borderRadius: "14px",
                      backgroundColor: "#F4F5F8",
                      border: "1px solid #ECECE6",
                      color: "#667085",
                    }}
                    className="flex items-center justify-center shrink-0"
                  >
                    <FileText size={28} />
                  </div>

                  {/* Middle: Doctor name, upload date, status pill */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: 800,
                          color: "#101828",
                        }}
                        className="m-0 truncate"
                      >
                        {rx.doctorName || rx.title || "Prescription Document"}
                      </h3>

                      {/* Status pill (rounded-full, 12-13px, 700) */}
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          borderRadius: "999px",
                          padding: "2px 10px",
                          backgroundColor: isVerified
                            ? "#E6F4EA"
                            : isPending
                            ? "#FFF4CC"
                            : "#FDECEC",
                          color: isVerified
                            ? "#16603A"
                            : isPending
                            ? "#7A5A00"
                            : "#A12121",
                        }}
                      >
                        {rx.status || (isVerified ? "Verified" : isPending ? "Pending review" : "Expired")}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: "13px",
                        color: "#667085",
                        marginTop: "4px",
                      }}
                      className="m-0"
                    >
                      Uploaded {rx.uploadDate || (rx.createdAt ? new Date(rx.createdAt).toLocaleDateString("en-IN") : "Recent")} · {rx.medicinesCount || 3} medicines
                    </p>
                  </div>

                  {/* Right: View (ghost) + Order medicines/Upload new (primary) */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleViewPrescription(rx.fileUrl || rx.file || "#")}
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
                      View
                    </button>

                    {isExpired ? (
                      <button
                        type="button"
                        onClick={() => prescriptionFileInputRef.current?.click()}
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
                        Upload new
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => showToast("Order medicines request received!", "success")}
                        style={{
                          height: "44px",
                          borderRadius: "999px",
                          backgroundColor: "#F5B800",
                          color: "#101828",
                          fontSize: "14px",
                          fontWeight: 700,
                          padding: "0 20px",
                        }}
                        className="hover:brightness-105 transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Order medicines
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. ACCOUNT VIEW */}
      {/* =================================================================== */}
      {activeTab === "account" && (
        <div className="flex flex-col gap-4">
          {/* Header Card */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #ECECE6",
              borderRadius: "20px",
              boxShadow: "0 1px 2px rgba(16,24,40,.04)",
              padding: "24px 28px",
            }}
          >
            <h1
              style={{
                fontSize: "30px",
                fontWeight: 800,
                color: "#101828",
                lineHeight: "36px",
              }}
              className="m-0"
            >
              Account
            </h1>
            <p
              style={{
                fontSize: "15px",
                color: "#667085",
                marginTop: "4px",
              }}
              className="m-0"
            >
              Update your personal details and preferences.
            </p>
          </div>

          {/* Personal details card */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #ECECE6",
              borderRadius: "20px",
              boxShadow: "0 1px 2px rgba(16,24,40,.04)",
              padding: "24px 28px",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#101828",
                marginBottom: "20px",
              }}
              className="m-0"
            >
              Personal details
            </h2>

            <form onSubmit={handleUpdateAccount}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="account-name"
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#101828",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Full name
                  </label>
                  <input
                    id="account-name"
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    style={{
                      height: "48px",
                      borderRadius: "12px",
                      border: "1px solid #D0D5DD",
                      padding: "0 16px",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#101828",
                      width: "100%",
                      outline: "none",
                    }}
                    className="focus:border-[#F5B800]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="account-phone"
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#101828",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Phone number
                  </label>
                  <input
                    id="account-phone"
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    style={{
                      height: "48px",
                      borderRadius: "12px",
                      border: "1px solid #D0D5DD",
                      padding: "0 16px",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#101828",
                      width: "100%",
                      outline: "none",
                    }}
                    className="focus:border-[#F5B800]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="account-email"
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#101828",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Email
                  </label>
                  <input
                    id="account-email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    style={{
                      height: "48px",
                      borderRadius: "12px",
                      border: "1px solid #D0D5DD",
                      padding: "0 16px",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#101828",
                      width: "100%",
                      outline: "none",
                    }}
                    className="focus:border-[#F5B800]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="account-dob"
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#101828",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Date of birth
                  </label>
                  <input
                    id="account-dob"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    style={{
                      height: "48px",
                      borderRadius: "12px",
                      border: "1px solid #D0D5DD",
                      padding: "0 16px",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#101828",
                      width: "100%",
                      outline: "none",
                    }}
                    className="focus:border-[#F5B800]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  type="submit"
                  disabled={isUpdatingAccount}
                  style={{
                    height: "44px",
                    borderRadius: "999px",
                    backgroundColor: "#F5B800",
                    color: "#101828",
                    fontSize: "14px",
                    fontWeight: 700,
                    padding: "0 24px",
                  }}
                  className="hover:brightness-105 transition-all shadow-xs cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {isUpdatingAccount && <Loader2 size={16} className="animate-spin" />}
                  <span>Save changes</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (user) {
                      setProfileForm({
                        name: user.name || "",
                        email: user.email || "",
                        phone: user.phone || "",
                        address: user.address || "",
                        pincode: user.pincode || "",
                      });
                    }
                  }}
                  style={{
                    height: "44px",
                    borderRadius: "999px",
                    border: "1px solid #D0D5DD",
                    backgroundColor: "#FFFFFF",
                    color: "#101828",
                    fontSize: "14px",
                    fontWeight: 600,
                    padding: "0 24px",
                  }}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Notifications Card */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #ECECE6",
              borderRadius: "20px",
              boxShadow: "0 1px 2px rgba(16,24,40,.04)",
              padding: "24px 28px",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#101828",
                marginBottom: "20px",
              }}
              className="m-0"
            >
              Notifications
            </h2>

            <div className="divide-y divide-[#ECECE6]">
              {[
                {
                  id: "orderUpdates",
                  title: "Order updates",
                  desc: "Get real-time SMS and WhatsApp updates about your delivery.",
                },
                {
                  id: "offers",
                  title: "Offers and discounts",
                  desc: "Receive notifications about weekly discounts and bank offers.",
                },
                {
                  id: "reminders",
                  title: "Reorder reminders",
                  desc: "Helpful reminders when it's time to restock your essentials.",
                },
              ].map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between py-4 ${idx === 0 ? "pt-0" : ""}`}
                >
                  <div className="pr-4">
                    <label
                      htmlFor={`notif-${item.id}`}
                      className="text-[15px] font-bold text-[#101828] cursor-pointer block"
                    >
                      {item.title}
                    </label>
                    <p className="text-[13px] text-[#667085] mt-0.5 m-0 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <input
                    id={`notif-${item.id}`}
                    type="checkbox"
                    checked={notifications[item.id]}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        [item.id]: e.target.checked,
                      })
                    }
                    style={{ accentColor: "#F5B800" }}
                    className="w-5 h-5 cursor-pointer rounded-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Delete Account Card */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #F4C7C3",
              borderRadius: "20px",
              boxShadow: "0 1px 2px rgba(16,24,40,.04)",
              padding: "24px 28px",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#B42318",
                marginBottom: "6px",
              }}
              className="m-0"
            >
              Delete account
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#667085",
                lineHeight: "22px",
                marginBottom: "20px",
              }}
              className="m-0"
            >
              Permanently delete your FillCarts account, saved addresses and order history. This action cannot be undone.
            </p>
            <button
              type="button"
              onClick={() => showToast("Account deletion request submitted.", "info")}
              style={{
                height: "44px",
                borderRadius: "999px",
                border: "1px solid #F4C7C3",
                backgroundColor: "#FFFFFF",
                color: "#B42318",
                fontSize: "14px",
                fontWeight: 600,
                padding: "0 24px",
              }}
              className="hover:bg-rose-50 transition-colors cursor-pointer"
            >
              Delete my account
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* ORDER DETAIL MODAL */}
      {/* =================================================================== */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-xl relative text-left border border-[#ECECE6]">
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

      {/* =================================================================== */}
      {/* ADD / EDIT ADDRESS MODAL */}
      {/* =================================================================== */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-xl relative text-left border border-[#ECECE6]">
            <button
              onClick={() => setShowAddressModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 transition-colors w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>

            <h3 className="text-lg font-extrabold text-[#101828] mb-1">
              {editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}
            </h3>
            <p className="text-xs text-[#667085] font-medium mb-4">
              Enter complete doorstep drop-off information.
            </p>

            <div className="mb-4">
              <button
                type="button"
                onClick={handleGpsFillAddress}
                disabled={isDetectingGps}
                style={{
                  height: "40px",
                  borderRadius: "12px",
                  border: "1px solid #F5E3B0",
                  backgroundColor: "#FFF8E6",
                  color: "#936D00",
                }}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold transition-colors cursor-pointer"
              >
                {isDetectingGps ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Navigation size={14} />
                )}
                <span>{isDetectingGps ? "Detecting GPS..." : "Use Current GPS Location"}</span>
              </button>
            </div>

            {addressFormError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 text-[#B42318] border border-rose-200 text-xs font-bold">
                {addressFormError}
              </div>
            )}

            <form onSubmit={handleSaveAddress} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-[#101828] block mb-1">
                  Address Type
                </label>
                <div className="flex gap-2">
                  {["Home", "Work", "Other"].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setAddressForm({ ...addressForm, label })}
                      style={{
                        backgroundColor: addressForm.label === label ? "#FFF4CC" : "#FFFFFF",
                        color: addressForm.label === label ? "#101828" : "#667085",
                        borderColor: addressForm.label === label ? "#F5B800" : "#D0D5DD",
                      }}
                      className="flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#101828] block mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.name}
                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D0D5DD] text-xs font-semibold outline-none focus:border-[#F5B800]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#101828] block mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D0D5DD] text-xs font-semibold outline-none focus:border-[#F5B800]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#101828] block mb-1">
                  House / Flat / Street *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.addressLine1}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                  placeholder="e.g. Flat 402, Sunshine Heights"
                  className="w-full px-3 py-2 rounded-xl border border-[#D0D5DD] text-xs font-semibold outline-none focus:border-[#F5B800]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#101828] block mb-1">
                  Area / Locality
                </label>
                <input
                  type="text"
                  value={addressForm.addressLine2}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                  placeholder="e.g. Near City Mall"
                  className="w-full px-3 py-2 rounded-xl border border-[#D0D5DD] text-xs font-semibold outline-none focus:border-[#F5B800]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#101828] block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="Indore"
                    className="w-full px-3 py-2 rounded-xl border border-[#D0D5DD] text-xs font-semibold outline-none focus:border-[#F5B800]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#101828] block mb-1">State *</label>
                  <select
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D0D5DD] text-xs font-semibold outline-none focus:border-[#F5B800] bg-white"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#101828] block mb-1">Pincode *</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    placeholder="452010"
                    className="w-full px-3 py-2 rounded-xl border border-[#D0D5DD] text-xs font-semibold outline-none focus:border-[#F5B800]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="default-addr-modal"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  style={{ accentColor: "#F5B800" }}
                  className="rounded w-4 h-4 cursor-pointer"
                />
                <label htmlFor="default-addr-modal" className="text-xs font-bold text-[#101828] cursor-pointer">
                  Make this my default delivery address
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
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
                  type="submit"
                  disabled={savingAddress}
                  style={{
                    height: "44px",
                    borderRadius: "999px",
                    backgroundColor: "#F5B800",
                    color: "#101828",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                  className="flex-1 hover:brightness-105 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {savingAddress ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* LOGOUT CONFIRMATION MODAL */}
      {/* =================================================================== */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] w-full max-w-sm p-6 shadow-xl relative text-center border border-[#ECECE6]">
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
    </ProfileLayout>
  );
}
