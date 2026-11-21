import React, { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, X, Navigation, Loader2 } from "lucide-react";
import ProfileLayout from "./ProfileLayout";
import { useCart } from "../../context/CartContext";
import api from "../../api";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi NCR", "Chandigarh", "Jammu and Kashmir", "Ladakh", "Puducherry",
];

// TODO: connect API (fallback mock addresses when none returned from backend)
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

export default function ProfileAddresses() {
  const { user } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [addressFormError, setAddressFormError] = useState("");
  const [savingAddress, setSavingAddress] = useState(false);

  const initialForm = {
    label: "Home",
    name: user?.name || "",
    phone: user?.phone || "",
    addressLine1: "",
    addressLine2: "",
    city: "Indore",
    state: "Madhya Pradesh",
    pincode: "",
    isDefault: false,
  };
  const [addressForm, setAddressForm] = useState(initialForm);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/addresses");
      if (res.data?.addresses?.length > 0) {
        setAddresses(res.data.addresses);
      }
    } catch (err) {
      // Offline / unauthenticated fallback to mock
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      ...initialForm,
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
      label: addr.label || "Home",
      name: addr.name || "",
      phone: addr.phone || "",
      addressLine1: addr.addressLine1 || addr.address || "",
      addressLine2: addr.addressLine2 || "",
      city: addr.city || "Indore",
      state: addr.state || "Madhya Pradesh",
      pincode: addr.pincode || "",
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
          addressLine2: prev.addressLine2 || `GPS (${lat}, ${lng})`,
        }));
      },
      () => {
        setIsDetectingGps(false);
        setAddressFormError("Could not detect location. Please check browser permissions.");
      },
      { timeout: 10000 }
    );
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.addressLine1?.trim()) {
      setAddressFormError("House / Flat / Street address is required.");
      return;
    }
    setSavingAddress(true);
    try {
      if (editingAddressId) {
        await api.put(`/addresses/${editingAddressId}`, addressForm);
      } else {
        await api.post("/addresses", addressForm);
      }
      setShowAddressModal(false);
      fetchAddresses();
    } catch (err) {
      // Local fallback update for mock addresses
      if (editingAddressId) {
        setAddresses((prev) =>
          prev.map((a) => (a.id === editingAddressId ? { ...a, ...addressForm } : a))
        );
      } else {
        const newAddr = { ...addressForm, id: `local-${Date.now()}` };
        setAddresses((prev) => [...prev, newAddr]);
      }
      setShowAddressModal(false);
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await api.delete(`/addresses/${id}`);
      fetchAddresses();
    } catch (err) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleSetDefault = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  const displayAddresses = addresses.length > 0 ? addresses : MOCK_ADDRESSES;

  return (
    <ProfileLayout activeTab="addresses" pageName="Addresses">
      {/* 1. Header Card */}
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
          <span>Add new address</span>
        </button>
      </div>

      {/* 2. 2-column grid of address cards */}
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
                    onClick={() => handleSetDefault(addr.id)}
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

      {/* Modal for adding/editing address */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[calc(100vw-32px)] sm:max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-xl relative text-left border border-[#ECECE6]">
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
    </ProfileLayout>
  );
}
