import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, UserRound, Phone, Mail, MapPin,
  Lock, CheckCircle2, ShieldCheck, Sparkles, Eye, EyeOff
} from "lucide-react";
import api from "../api";
import Logo from "../components/Logo";

const getErrorMessage = (err) => {
  const responseData = err?.response?.data;
  if (typeof responseData === "string") return responseData;
  if (responseData && typeof responseData === "object") {
    return responseData.message || "Something went wrong on the server.";
  }
  return err?.message || "Failed to create customer profile.";
};

export default function CustomerRegistrationPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    address: "",
    pincode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "name"
          ? value.replace(/[^a-zA-Z\s]/g, "")
          : name === "phone"
            ? value.replace(/\D/g, "").slice(0, 10)
            : name === "email"
              ? value.replace(/[^a-zA-Z0-9._%+-@]/g, "")
              : name === "pincode"
                ? value.replace(/\D/g, "").slice(0, 6)
                : value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.address.trim() ||
      !form.pincode.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (form.name.trim().length < 2) {
      setError("Full Name must contain at least 2 letters.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError("Mobile Number must be exactly 10 digits (no letters or symbols).");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email format (e.g. name@gmail.com).");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      setError("Pincode must be exactly 6 digits.");
      return;
    }

    if (form.address.trim().length < 5) {
      setError("Please enter a complete delivery address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post("/register-customer", {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        password: form.password,
        address: form.address.trim(),
        pincode: form.pincode.trim(),
      });

      setSuccess(res.data.message || "Account registered successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#111925] flex flex-col justify-between font-sans overflow-x-hidden" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-[#ECEEF2] py-3.5 sm:py-4 px-4 sm:px-6">
        <div className="max-w-[1216px] mx-auto flex items-center justify-between">
          <Logo />

          <Link
            to="/login"
            className="text-[11px] sm:text-xs font-bold text-[#111925] bg-[#F4F5F8] hover:bg-[#ECEEF2] border border-[#ECEEF2] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors"
          >
            Already Have Account? Login
          </Link>
        </div>
      </header>

      {/* CENTER REGISTRATION CONTAINER */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-8 sm:py-10">
        <div className="max-w-lg w-full bg-white border border-[#ECEEF2] rounded-3xl p-5 sm:p-8 shadow-xl space-y-5 sm:space-y-6 text-left relative">
          
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#111925] bg-[#FFF8E1] px-3.5 py-1.5 rounded-full border border-[#FEC201]/40 mb-1">
              <Sparkles size={13} className="text-[#FEC201]" /> Create Account
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#111925]">
              Join the FillCarts Ecosystem
            </h1>
            <p className="text-xs text-[#6B7280] font-medium max-w-sm mx-auto">
              Get instant 15-minute delivery from your favourite local kiranas & morning daily subscriptions.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 rounded-2xl flex items-center gap-2">
              <span className="shrink-0 font-black">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-[#EDF7E8] border border-[#ECEEF2] text-[#0F8A43] text-xs font-extrabold p-3.5 rounded-2xl flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#0F8A43] shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 text-xs">
            {/* Full Name */}
            <div>
              <label className="block font-bold text-[#111925] mb-1">Full Name *</label>
              <div className="relative flex items-center">
                <UserRound size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="e.g. Ramesh Patel"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-[#F4F5F8] border border-[#ECEEF2] rounded-full pl-10 pr-4 py-2.5 sm:py-3 text-xs font-semibold text-[#111925] focus:outline-none focus:border-[#FEC201] transition-all"
                />
              </div>
            </div>

            {/* Mobile & Email Grid */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#111925] mb-1">Mobile Number *</label>
                <div className="relative flex items-center">
                  <Phone size={16} className="absolute left-3.5 text-slate-400" />
                  <input
                    required
                    type="tel"
                    name="phone"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full bg-[#F4F5F8] border border-[#ECEEF2] rounded-full pl-10 pr-4 py-2.5 sm:py-3 text-xs font-semibold text-[#111925] focus:outline-none focus:border-[#FEC201] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#111925] mb-1">Email Address *</label>
                <div className="relative flex items-center">
                  <Mail size={16} className="absolute left-3.5 text-slate-400" />
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-[#F4F5F8] border border-[#ECEEF2] rounded-full pl-10 pr-4 py-2.5 sm:py-3 text-xs font-semibold text-[#111925] focus:outline-none focus:border-[#FEC201] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Password with Visibility Toggle */}
            <div>
              <label className="block font-bold text-[#111925] mb-1">Account Password *</label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-[#F4F5F8] border border-[#ECEEF2] rounded-full pl-10 pr-10 py-2.5 sm:py-3 text-xs font-semibold text-[#111925] focus:outline-none focus:border-[#FEC201] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Address & Pincode */}
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-[#111925] mb-1">Primary Delivery Address *</label>
                <div className="relative flex items-start">
                  <MapPin size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <textarea
                    required
                    rows={2}
                    name="address"
                    placeholder="House / Flat No., Street, Locality..."
                    value={form.address}
                    onChange={handleChange}
                    className="w-full bg-[#F4F5F8] border border-[#ECEEF2] rounded-2xl pl-10 pr-4 py-2.5 sm:py-3 text-xs font-semibold text-[#111925] focus:outline-none focus:border-[#FEC201] transition-all resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#111925] mb-1">Delivery Pincode *</label>
                <input
                  required
                  type="text"
                  name="pincode"
                  placeholder="6-digit Pincode (e.g. 452010)"
                  value={form.pincode}
                  onChange={handleChange}
                  className="w-full bg-[#F4F5F8] border border-[#ECEEF2] rounded-full px-4 py-2.5 sm:py-3 text-xs font-semibold text-[#111925] focus:outline-none focus:border-[#FEC201] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FEC201] hover:bg-[#F5B800] disabled:opacity-50 disabled:cursor-not-allowed text-[#111925] font-extrabold text-xs py-3.5 rounded-full shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#111925] border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Customer Account</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-[#ECEEF2] text-center">
            <p className="text-xs text-[#6B7280] font-medium">
              Already registered?{" "}
              <Link to="/login" className="text-[#111925] font-extrabold hover:underline">
                Sign In Instead
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer Copyright */}
      <footer className="py-4 text-center text-xs text-[#6B7280] border-t border-[#ECEEF2]">
        © {new Date().getFullYear()} FillCarts. Safe & Encrypted Customer Registration.
      </footer>
    </div>
  );
}
