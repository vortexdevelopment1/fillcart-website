import React, { useState } from "react";
import { Bike, DollarSign, Clock, Shield, ArrowRight, ExternalLink, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PageHeader, Card, Input, Select, Button, Badge } from "../components/ui";

export default function BecomeRiderPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    vehicleType: "bike",
    city: "",
    hasLicense: "yes",
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
          eyebrow="RIDE WITH FILLCARTS"
          title="Become a Delivery Partner"
          subtitle="Earn on your own schedule. Join FillCarts fast-growing rider community and earn weekly payouts with attractive incentives."
          breadcrumbs={[
            { label: "Partner", href: "#" },
            { label: "Become a Rider" },
          ]}
          action={
            <a
              href="http://localhost:5175"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-[40px] px-5 rounded-full bg-[#101828] text-white font-bold text-[13px] hover:bg-[#111925] transition-colors shadow-xs"
            >
              <span>Go to Rider App</span>
              <ExternalLink size={14} />
            </a>
          }
        />

        {/* 3-Column Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card className="space-y-2 bg-[#FFF4DA]/40 border-[#F5B800]/30">
            <div className="w-10 h-10 rounded-full bg-[#FFF4DA] text-[#936D00] flex items-center justify-center mb-3">
              <DollarSign size={20} />
            </div>
            <h3 className="font-extrabold text-[15px] text-[#101828]">Competitive Weekly Pay</h3>
            <p className="text-[12px] sm:text-[13px] text-[#667085] leading-relaxed">
              Earn per order plus bonus surge incentives during peak hours and rainy days directly into your account.
            </p>
          </Card>

          <Card className="space-y-2 bg-[#EDF7E8]/40 border-[#16803C]/20">
            <div className="w-10 h-10 rounded-full bg-[#EDF7E8] text-[#16803C] flex items-center justify-center mb-3">
              <Clock size={20} />
            </div>
            <h3 className="font-extrabold text-[15px] text-[#101828]">Flexible Working Hours</h3>
            <p className="text-[12px] sm:text-[13px] text-[#667085] leading-relaxed">
              Choose your own shifts — full-time, part-time, or weekend only. You are in complete control of your time.
            </p>
          </Card>

          <Card className="space-y-2 bg-[#EAF5F8]/40 border-[#0284C7]/20">
            <div className="w-10 h-10 rounded-full bg-[#EAF5F8] text-[#0284C7] flex items-center justify-center mb-3">
              <Shield size={20} />
            </div>
            <h3 className="font-extrabold text-[15px] text-[#101828]">Insurance & Safety Gear</h3>
            <p className="text-[12px] sm:text-[13px] text-[#667085] leading-relaxed">
              Free accidental medical insurance cover and FillCarts branded gear provided upon onboarding.
            </p>
          </Card>
        </div>

        {/* Form Container (720px readable column) */}
        <div className="max-w-[720px] mx-auto w-full">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="border-b-[0.8px] border-[#E7E8E5] pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Bike size={20} className="text-[#F5B800]" />
                <h2 className="text-lg sm:text-xl font-extrabold text-[#101828]">
                  Rider Partner Application
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#667085]">
                Quick registration. Start delivering orders and earning within 48 hours.
              </p>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#EDF7E8] text-[#16803C] flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-[#101828]">Application Received!</h3>
                  <p className="text-xs sm:text-sm text-[#667085] max-w-md mx-auto">
                    Congratulations! Your application has been logged. Our dispatch team will reach out at <strong className="text-[#101828]">{formData.phone || "your number"}</strong> for document verification.
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <a
                    href="http://localhost:5175"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 h-[40px] px-6 rounded-full bg-[#F5B800] text-[#101828] font-extrabold text-sm hover:bg-[#E0A800]"
                  >
                    <span>Open Rider Portal</span>
                    <ExternalLink size={14} />
                  </a>
                  <Button variant="secondary" size={40} onClick={() => setSubmitted(false)}>
                    Submit Another Application
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name (as per Aadhaar)"
                    placeholder="e.g. Amit Sharma"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                  <Input
                    label="Mobile Number"
                    placeholder="10-digit mobile number"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    placeholder="amit@example.com"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <Input
                    label="City of Preference"
                    placeholder="e.g. Jaipur"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Vehicle Available"
                    placeholder="Choose your vehicle"
                    value={formData.vehicleType}
                    onChange={(val) => setFormData({ ...formData, vehicleType: val })}
                    options={[
                      { value: "bike", label: "Motorcycle / Bike" },
                      { value: "scooter", label: "Scooter / Scooty" },
                      { value: "ev", label: "Electric Vehicle (EV)" },
                      { value: "bicycle", label: "Bicycle / Cycle" },
                    ]}
                  />
                  <Select
                    label="Valid Driving License?"
                    placeholder="Select"
                    value={formData.hasLicense}
                    onChange={(val) => setFormData({ ...formData, hasLicense: val })}
                    options={[
                      { value: "yes", label: "Yes, I have a valid DL" },
                      { value: "learning", label: "Learning License" },
                      { value: "no", label: "No (Bicycle only)" },
                    ]}
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    size={48}
                    loading={loading}
                  >
                    Submit Rider Application
                  </Button>
                </div>

                <p className="text-[11px] text-[#667085] text-center">
                  By submitting, you agree to FillCarts Delivery Partner Terms & Privacy Policy.
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
