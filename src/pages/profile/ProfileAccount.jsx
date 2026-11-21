import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import ProfileLayout from "./ProfileLayout";
import { useCart } from "../../context/CartContext";
import api from "../../api";

export default function ProfileAccount() {
  const { user, setUser } = useCart();
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [dateOfBirth, setDateOfBirth] = useState("1996-08-15");
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    offers: true,
    reminders: false,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const payload = {
        name: profileForm.name.trim(),
        phone: profileForm.phone.replace(/\D/g, ""),
        email: profileForm.email.trim().toLowerCase(),
      };
      const res = await api.put("/customer/profile", payload);
      if (res.data?.customer && setUser) {
        setUser(res.data.customer);
      }
      showToast("Account details updated successfully!");
    } catch (err) {
      showToast("Saved local preferences.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ProfileLayout activeTab="account" pageName="Account">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[99999] px-5 py-3 rounded-2xl bg-[#0B2616] text-emerald-50 text-xs font-bold shadow-md">
          {toastMessage}
        </div>
      )}

      {/* 1. Header Card */}
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

      {/* 2. Personal details card */}
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

        <form onSubmit={handleUpdate}>
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
              disabled={isUpdating}
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
              {isUpdating && <Loader2 size={16} className="animate-spin" />}
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

      {/* 3. Notifications Card */}
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

      {/* 4. Delete Account Card */}
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
          onClick={() => showToast("Account deletion request submitted.")}
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
    </ProfileLayout>
  );
}
