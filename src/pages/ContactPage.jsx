import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  ChevronDown,
  CheckCircle2,
  Send,
  Loader2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { contactData } from "../data/contactData";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errors = {};
    const nameTrimmed = formData.fullName.trim();
    if (!nameTrimmed) {
      errors.fullName = "Full name is required";
    }

    const emailTrimmed = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrimmed) {
      errors.email = "Email address is required";
    } else if (!emailRegex.test(emailTrimmed)) {
      errors.email = "Please enter a valid email address";
    }

    const phoneTrimmed = formData.phone.trim();
    if (phoneTrimmed) {
      const cleanPhone = phoneTrimmed.replace(/[\s\-]/g, "");
      const phoneRegex = /^(?:\+91)?[0-9]{10}$/;
      if (!phoneRegex.test(cleanPhone)) {
        errors.phone = "Please enter a valid 10-digit phone number";
      }
    }

    if (!formData.subject) {
      errors.subject = "Please select a subject";
    }

    const messageTrimmed = formData.message.trim();
    if (!messageTrimmed) {
      errors.message = "Message is required";
    } else if (messageTrimmed.length < 10) {
      errors.message = "Message must be at least 10 characters";
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstInvalidField = Object.keys(errors)[0];
      const el = document.getElementById(firstInvalidField);
      if (el) el.focus();
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    // ============================================================
    // TODO: connect to backend later
    // Frontend only simulation: 800ms timer, no network request
    // ============================================================
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setFormErrors({});
    setIsSubmitted(false);
  };

  return (
    <div
      className="contact-page min-h-screen flex flex-col bg-white text-[#111827] selection:bg-[#FFE9A8] selection:text-[#111827] overflow-x-hidden"
      style={{ fontFamily: "var(--font-inter, 'Inter', -apple-system, BlinkMacSystemFont, sans-serif)" }}
    >
      {/* Scoped CSS for Inter Font & Focus Styles */}
      <style>{`
        .contact-page,
        .contact-page h1,
        .contact-page h2,
        .contact-page h3,
        .contact-page p,
        .contact-page span,
        .contact-page label,
        .contact-page input,
        .contact-page select,
        .contact-page textarea,
        .contact-page button,
        .contact-page a {
          font-family: var(--font-inter, 'Inter', -apple-system, BlinkMacSystemFont, sans-serif) !important;
        }

        /* Focus rings matching spec */
        .contact-input:focus {
          border-color: #FBBF24 !important;
          box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.25) !important;
          outline: none !important;
        }

        .contact-input-error:focus {
          border-color: #DC2626 !important;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2) !important;
          outline: none !important;
        }
      `}</style>

      {/* Global Navbar */}
      <Navbar />

      <main className="flex-1 w-full">
        {/* 1. HERO BANNER */}
        <div className="w-full max-w-[1216px] mx-auto px-4 sm:px-6 xl:px-0">
          <div
            className="relative w-full h-[360px] md:h-[405px] rounded-[24px] md:rounded-[32px] overflow-hidden mt-[32px] select-none bg-[#0D182A]"
          >
            {/* Background image filling wrapper */}
            <img
              src="/images/contact/contact-hero-bg.svg"
              alt=""
              className="w-full h-full object-cover object-center pointer-events-none select-none"
              loading="eager"
            />

            {/* Live Text Overlay (Centered, non-intersecting with headset left and envelope right) */}
            {/* a) Eyebrow */}
            <p
              className="absolute text-center text-white font-semibold text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] top-[40px] md:top-[68px] left-1/2 -translate-x-1/2 m-0 z-10 whitespace-nowrap"
            >
              Contact us
            </p>

            {/* b) H1 */}
            <h1
              className="absolute text-center text-white font-extrabold text-[36px] leading-[44px] md:text-[56px] md:leading-[64px] tracking-0 top-[84px] md:top-[120px] left-[16px] md:left-[278px] w-[calc(100%-32px)] md:w-[660px] md:h-[128px] m-0 z-10"
            >
              Let’s Talk.<br />We’re Here to <span className="text-[#FFA000]">Help.</span>
            </h1>

            {/* c) Subtitle */}
            <p
              className="absolute text-center text-white/85 font-normal text-[16px] leading-[24px] md:text-[22px] md:leading-[32px] top-[244px] md:top-[280px] left-[16px] md:left-[308px] w-[calc(100%-32px)] md:w-[600px] md:h-[64px] m-0 z-10"
            >
              Questions about your order or shopping with us?<br className="hidden md:inline" /> We’re just a message away.
            </p>
          </div>
        </div>

        {/* 2. CONTACT SECTION */}
        <section
          aria-label="Contact information and message form"
          className="w-full max-w-[1216px] mx-auto px-4 sm:px-6 xl:px-0 pt-[32px] pb-[56px] md:pt-[40px] md:pb-[72px]"
        >
          {/* 12-Column Grid (Left: 5 cols / 488px, Right: 7 cols / 696px, Gap: 32px) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* 3. LEFT BLOCK: "Get in Touch" */}
            <div className="lg:col-span-5 pt-2 flex flex-col">
              {/* Heading Group */}
              <div className="flex flex-col">
                <h2
                  className="font-extrabold text-[26px] leading-[32px] md:text-[30px] md:leading-[36px] text-[#111827] tracking-[-0.6px] m-0"
                >
                  Get in Touch
                </h2>
                <p className="font-normal text-[14px] leading-[20px] text-[#4B5563] mt-1 m-0">
                  Reach out to us through any of the channels below.
                </p>
              </div>

              {/* 4 Contact Items List */}
              <div className="mt-[28px] flex flex-col">
                {/* Item 1: Email Us */}
                <div className="flex flex-row items-start gap-4 py-6 first:pt-0 border-b border-[#F3F4F6]">
                  <div className="w-[56px] h-[56px] rounded-[16px] bg-[#FFF6E6] flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-[#D97706] stroke-[1.75]" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-[16px] leading-[24px] text-[#111827] m-0">
                      Email Us
                    </h3>
                    <a
                      href={`mailto:${contactData.email}`}
                      className="font-medium text-[14px] leading-[22px] text-[#4B5563] hover:underline focus-visible:outline-2 focus-visible:outline-[#FBBF24] focus-visible:outline-offset-2 rounded-sm mt-0.5"
                    >
                      {contactData.email}
                    </a>
                  </div>
                </div>

                {/* Item 2: Call Us */}
                <div className="flex flex-row items-start gap-4 py-6 border-b border-[#F3F4F6]">
                  <div className="w-[56px] h-[56px] rounded-[16px] bg-[#FFF6E6] flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-[#D97706] stroke-[1.75]" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-[16px] leading-[24px] text-[#111827] m-0">
                      Call Us
                    </h3>
                    <a
                      href={`tel:${contactData.phone.replace(/[^0-9+]/g, "")}`}
                      className="font-semibold text-[14px] leading-[22px] text-[#111827] hover:underline focus-visible:outline-2 focus-visible:outline-[#FBBF24] focus-visible:outline-offset-2 rounded-sm mt-0.5"
                    >
                      {contactData.phone}
                    </a>
                    <p className="font-normal text-[12px] leading-[18px] text-[#6B7280] m-0 mt-0.5">
                      {contactData.hours}
                    </p>
                  </div>
                </div>

                {/* Item 3: Our Address */}
                <div className="flex flex-row items-start gap-4 py-6 border-b border-[#F3F4F6]">
                  <div className="w-[56px] h-[56px] rounded-[16px] bg-[#FFF6E6] flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-[#D97706] stroke-[1.75]" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-[16px] leading-[24px] text-[#111827] m-0">
                      Our Address
                    </h3>
                    <div className="mt-0.5 flex flex-col">
                      {contactData.address.map((line, idx) => (
                        <p key={idx} className="font-normal text-[14px] leading-[23px] text-[#4B5563] m-0">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Item 4: Chat on WhatsApp */}
                <div className="flex flex-row items-start gap-4 py-6 last:pb-0">
                  <div className="w-[56px] h-[56px] rounded-[16px] bg-[#FFF6E6] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-6 h-6 text-[#D97706] stroke-[1.75]" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-[16px] leading-[24px] text-[#111827] m-0">
                      Chat on WhatsApp
                    </h3>
                    <a
                      href={contactData.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[14px] leading-[22px] text-[#111827] hover:underline focus-visible:outline-2 focus-visible:outline-[#FBBF24] focus-visible:outline-offset-2 rounded-sm mt-0.5"
                    >
                      {contactData.whatsapp}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. RIGHT CARD: "Send Us a Message" */}
            <div
              className="lg:col-span-7 bg-white border border-[#E5E7EBCC] rounded-[24px] p-5 sm:p-7 md:p-[36px] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] box-border flex flex-col w-full min-h-[576px]"
            >
              {/* Card Header Group */}
              <div className="flex flex-col mb-[28px]">
                <h2
                  className="font-extrabold text-[26px] leading-[32px] md:text-[30px] md:leading-[36px] text-[#030712] tracking-[-0.6px] m-0"
                >
                  Send Us a Message
                </h2>
                <p className="font-normal text-[14px] leading-[20px] text-[#6B7280] mt-1 m-0">
                  Fill in the details below and our team will get back to you soon.
                </p>
              </div>

              {isSubmitted ? (
                /* Success State (replaces form inside same card, same height) */
                <div
                  className="flex-1 flex flex-col items-center justify-center text-center py-10"
                  aria-live="polite"
                >
                  <div className="w-[56px] h-[56px] rounded-full bg-[#E8F4EA] flex items-center justify-center mb-5 shrink-0">
                    <CheckCircle2 className="w-7 h-7 text-[#16803C]" strokeWidth={2.5} aria-hidden="true" />
                  </div>
                  <h3 className="font-extrabold text-[24px] leading-[32px] text-[#111827] m-0 mb-2">
                    Message sent
                  </h3>
                  <p className="font-normal text-[14px] leading-[22px] text-[#4B5563] max-w-[380px] m-0 mb-6">
                    Thanks for reaching out. Our team will get back to you soon.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="font-bold text-[14px] text-[#111827] hover:text-[#D97706] hover:underline focus-visible:outline-2 focus-visible:outline-[#FBBF24] focus-visible:outline-offset-2 cursor-pointer bg-transparent border-none p-2"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                /* Form */
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  aria-label="Contact form"
                  className="flex flex-col gap-[20px]"
                >
                  {/* Row 1: Full Name & Email Address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-[20px]">
                    {/* Full Name */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="fullName"
                        className="block font-semibold text-[14px] leading-[20px] text-[#1F2937] mb-[6px]"
                      >
                        Full Name <span className="text-[#EF4444] ml-[3px]">*</span>
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.fullName}
                        onChange={handleChange}
                        aria-invalid={!!formErrors.fullName}
                        aria-describedby={formErrors.fullName ? "fullName-error" : undefined}
                        className={`w-full h-[46px] rounded-[12px] bg-white px-[16px] text-[14px] text-[#111827] placeholder:text-[#9CA3AF] transition-colors border ${
                          formErrors.fullName
                            ? "border-[#DC2626] contact-input-error"
                            : "border-[#E5E7EB] contact-input"
                        }`}
                      />
                      {formErrors.fullName && (
                        <p
                          id="fullName-error"
                          className="font-medium text-[12px] leading-[16px] text-[#DC2626] mt-1.5 m-0"
                        >
                          {formErrors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="email"
                        className="block font-semibold text-[14px] leading-[20px] text-[#1F2937] mb-[6px]"
                      >
                        Email Address <span className="text-[#EF4444] ml-[3px]">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        aria-invalid={!!formErrors.email}
                        aria-describedby={formErrors.email ? "email-error" : undefined}
                        className={`w-full h-[46px] rounded-[12px] bg-white px-[16px] text-[14px] text-[#111827] placeholder:text-[#9CA3AF] transition-colors border ${
                          formErrors.email
                            ? "border-[#DC2626] contact-input-error"
                            : "border-[#E5E7EB] contact-input"
                        }`}
                      />
                      {formErrors.email && (
                        <p
                          id="email-error"
                          className="font-medium text-[12px] leading-[16px] text-[#DC2626] mt-1.5 m-0"
                        >
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Phone Number & Subject */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-[20px]">
                    {/* Phone Number */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="phone"
                        className="block font-semibold text-[14px] leading-[20px] text-[#1F2937] mb-[6px]"
                      >
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        aria-invalid={!!formErrors.phone}
                        aria-describedby={formErrors.phone ? "phone-error" : undefined}
                        className={`w-full h-[46px] rounded-[12px] bg-white px-[16px] text-[14px] text-[#111827] placeholder:text-[#9CA3AF] transition-colors border ${
                          formErrors.phone
                            ? "border-[#DC2626] contact-input-error"
                            : "border-[#E5E7EB] contact-input"
                        }`}
                      />
                      {formErrors.phone && (
                        <p
                          id="phone-error"
                          className="font-medium text-[12px] leading-[16px] text-[#DC2626] mt-1.5 m-0"
                        >
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    {/* Subject */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="subject"
                        className="block font-semibold text-[14px] leading-[20px] text-[#1F2937] mb-[6px]"
                      >
                        Subject <span className="text-[#EF4444] ml-[3px]">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          aria-invalid={!!formErrors.subject}
                          aria-describedby={formErrors.subject ? "subject-error" : undefined}
                          className={`w-full h-[46px] rounded-[12px] bg-white pl-[16px] pr-[40px] text-[14px] appearance-none transition-colors cursor-pointer border ${
                            !formData.subject ? "text-[#4B5563]" : "text-[#111827]"
                          } ${
                            formErrors.subject
                              ? "border-[#DC2626] contact-input-error"
                              : "border-[#E5E7EB] contact-input"
                          }`}
                        >
                          <option value="" disabled>
                            Select a topic
                          </option>
                          {contactData.subjectOptions.map((opt) => (
                            <option key={opt} value={opt} className="text-[#111827]">
                              {opt}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="absolute right-[16px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#374151] pointer-events-none"
                          aria-hidden="true"
                        />
                      </div>
                      {formErrors.subject && (
                        <p
                          id="subject-error"
                          className="font-medium text-[12px] leading-[16px] text-[#DC2626] mt-1.5 m-0"
                        >
                          {formErrors.subject}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Message */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="message"
                      className="block font-semibold text-[14px] leading-[20px] text-[#1F2937] mb-[6px]"
                    >
                      Message <span className="text-[#EF4444] ml-[3px]">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      maxLength={500}
                      placeholder="Type your message here..."
                      value={formData.message}
                      onChange={handleChange}
                      aria-invalid={!!formErrors.message}
                      aria-describedby={formErrors.message ? "message-error" : undefined}
                      className={`w-full h-[106px] rounded-[12px] bg-white p-[14px_16px] text-[14px] text-[#111827] placeholder:text-[#9CA3AF] transition-colors resize-none border ${
                        formErrors.message
                          ? "border-[#DC2626] contact-input-error"
                          : "border-[#E5E7EB] contact-input"
                      }`}
                    />
                    <div className="flex items-center justify-between mt-[8px]">
                      {formErrors.message ? (
                        <p
                          id="message-error"
                          className="font-medium text-[12px] leading-[16px] text-[#DC2626] m-0"
                        >
                          {formErrors.message}
                        </p>
                      ) : (
                        <div />
                      )}
                      <span className="font-normal text-[12px] leading-[16px] text-[#9CA3AF] ml-auto">
                        {formData.message.length} / 500
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-[20px] w-full h-[52px] rounded-[12px] bg-[#FBBF24] hover:bg-[#F5B800] text-black font-bold text-[16px] flex items-center justify-center gap-[10px] shadow-[0_4px_6px_-1px_rgba(251,191,36,0.3)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-[#111827] focus-visible:outline-offset-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-[18px] h-[18px] fill-current" aria-hidden="true" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
