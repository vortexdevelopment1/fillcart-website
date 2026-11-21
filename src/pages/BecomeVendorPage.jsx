import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Store, TrendingUp, ShieldCheck, Zap, ArrowRight, ExternalLink, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PageHeader, Card, Input, Select, Button, Badge } from "../components/ui";

export default function BecomeVendorPage() {
  const [formData, setFormData] = useState({
    storeName: "",
    ownerName: "",
    phone: "",
    email: "",
    category: "",
    city: "",
    address: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="bg-white min-h-screen text-[#101828] font-sans flex flex-col" style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}>
      <Navbar />

      <main className="flex-1 max-w-[1216px] w-full mx-auto px-4 sm:px-6 xl:px-0 py-8 sm:py-12 space-y-12">
        {/* Header */}
        <PageHeader
          eyebrow="PARTNER WITH FILLCARTS"
          title="Become a Vendor Partner"
          subtitle="Expand your retail store with FillCarts. Reach thousands of local customers with instant 10-minute grocery delivery."
          breadcrumbs={[
            { label: "Partner", href: "#" },
            { label: "Become a Vendor" },
          ]}
          action={
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-[40px] px-5 rounded-full bg-[#101828] text-white font-bold text-[13px] hover:bg-[#111925] transition-colors shadow-xs"
            >
              <span>Go to Vendor App</span>
              <ExternalLink size={14} />
            </a>
          }
        />

        {/* 3-Column Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card className="space-y-2 bg-[#EDF7E8]/40 border-[#16803C]/20">
            <div className="w-10 h-10 rounded-full bg-[#EDF7E8] text-[#16803C] flex items-center justify-center mb-3">
              <TrendingUp size={20} />
            </div>
            <h3 className="font-extrabold text-[15px] text-[#101828]">Higher Sales Volume</h3>
            <p className="text-[12px] sm:text-[13px] text-[#667085] leading-relaxed">
              Boost daily orders with instant exposure to active buyers in your store’s delivery radius.
            </p>
          </Card>

          <Card className="space-y-2 bg-[#FFF4DA]/40 border-[#F5B800]/30">
            <div className="w-10 h-10 rounded-full bg-[#FFF4DA] text-[#936D00] flex items-center justify-center mb-3">
              <Zap size={20} />
            </div>
            <h3 className="font-extrabold text-[15px] text-[#101828]">Fast 10-Min Delivery</h3>
            <p className="text-[12px] sm:text-[13px] text-[#667085] leading-relaxed">
              Our dedicated rider fleet picks up from your counter and delivers straight to doorsteps.
            </p>
          </Card>

          <Card className="space-y-2 bg-[#EAF5F8]/40 border-[#0284C7]/20">
            <div className="w-10 h-10 rounded-full bg-[#EAF5F8] text-[#0284C7] flex items-center justify-center mb-3">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-extrabold text-[15px] text-[#101828]">Daily Payouts & Support</h3>
            <p className="text-[12px] sm:text-[13px] text-[#667085] leading-relaxed">
              Transparent payments directly to your bank account with dedicated vendor support 7 days a week.
            </p>
          </Card>
        </div>

        {/* Form Container (720px readable column) */}
        <div className="max-w-[720px] mx-auto w-full">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="border-b-[0.8px] border-[#E7E8E5] pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Store size={20} className="text-[#F5B800]" />
                <h2 className="text-lg sm:text-xl font-extrabold text-[#101828]">
                  Partner Store Registration
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#667085]">
                Fill out the form below and our onboarding team will verify your store within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#EDF7E8] text-[#16803C] flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-[#101828]">Application Submitted!</h3>
                  <p className="text-xs sm:text-sm text-[#667085] max-w-md mx-auto">
                    Thank you for applying to partner with FillCarts. Our city store manager will call you at <strong className="text-[#101828]">{formData.phone || "your number"}</strong> to complete documentation.
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <a
                    href="http://localhost:5174"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 h-[40px] px-6 rounded-full bg-[#F5B800] text-[#101828] font-extrabold text-sm hover:bg-[#E0A800]"
                  >
                    <span>Open Vendor Portal</span>
                    <ExternalLink size={14} />
                  </a>
                  <Button variant="secondary" size={40} onClick={() => setSubmitted(false)}>
                    Register Another Store
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Store / Business Name"
                    placeholder="e.g. Fresh Daily Supermarket"
                    required
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  />
                  <Input
                    label="Owner / Contact Person"
                    placeholder="e.g. Ramesh Kumar"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Mobile Number"
                    placeholder="10-digit mobile number"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <Input
                    label="Email Address"
                    placeholder="store@example.com"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Store Category"
                    placeholder="Select store category"
                    value={formData.category}
                    onChange={(val) => setFormData({ ...formData, category: val })}
                    options={[
                      { value: "grocery", label: "Grocery & Staples" },
                      { value: "dairy", label: "Dairy & Chilled Foods" },
                      { value: "fruits", label: "Fruits & Vegetables" },
                      { value: "meat", label: "Meat & Poultry" },
                      { value: "bakery", label: "Bakery & Snacks" },
                      { value: "stationery", label: "Stationery & Books" },
                      { value: "pharmacy", label: "Pharmacy & Wellness" },
                    ]}
                  />
                  <Input
                    label="City / Pincode"
                    placeholder="e.g. Jaipur, 302020"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                <Input
                  label="Complete Shop Address"
                  placeholder="Shop number, market, road, nearby landmark"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    size={48}
                    loading={loading}
                  >
                    Submit Vendor Application
                  </Button>
                </div>

                <p className="text-[11px] text-[#667085] text-center">
                  By submitting, you agree to FillCarts Vendor Terms & Conditions and Privacy Policy.
                </p>
              </form>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
