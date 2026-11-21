import React from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  PackageCheck,
  Truck,
  ArrowRight,
  ShoppingBag,
  Store,
  Bike,
  Sparkles,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HOW_IT_WORKS_CONFIG } from "../config/footerPages";

export default function HowItWorksPage() {
  const getStepIcon = (iconType) => {
    switch (iconType) {
      case "search":
        return <Search className="w-5 h-5 text-[#936D00]" />;
      case "cart":
        return <ShoppingCart className="w-5 h-5 text-[#936D00]" />;
      case "package":
        return <PackageCheck className="w-5 h-5 text-[#936D00]" />;
      case "truck":
        return <Truck className="w-5 h-5 text-[#936D00]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#936D00]" />;
    }
  };

  const getAudienceIcon = (id) => {
    switch (id) {
      case "shoppers":
        return <ShoppingBag className="w-5 h-5 text-[#101828]" />;
      case "stores":
        return <Store className="w-5 h-5 text-[#101828]" />;
      case "riders":
        return <Bike className="w-5 h-5 text-[#101828]" />;
      default:
        return <ShoppingBag className="w-5 h-5 text-[#101828]" />;
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#101828] flex flex-col font-sans">
      <Navbar />

      <main className="grow">
        <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {/* 1. Breadcrumb: Home / How it works */}
          <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
            <ol className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#667085]">
              <li>
                <Link
                  to="/"
                  className="text-[#667085] hover:text-[#101828] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-[#98A2B3] select-none">
                /
              </li>
              <li aria-current="page" className="font-medium text-[#101828]">
                How it works
              </li>
            </ol>
          </nav>

          {/* 2. Hero Panel */}
          <section className="bg-[#FFF4DA] rounded-[32px] p-6 sm:p-8 md:p-[48px] border border-[#F2DEB0]/60 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-[560px]">
              <span className="block text-[10px] font-extrabold tracking-[1.6px] uppercase text-[#936D00]">
                {HOW_IT_WORKS_CONFIG.eyebrow}
              </span>
              <h1 className="mt-2 text-[30px] sm:text-[40px] font-extrabold leading-[1.15] tracking-[-1.2px] text-[#101828]">
                {HOW_IT_WORKS_CONFIG.title}
              </h1>
              <p className="mt-3 text-[14px] sm:text-[15px] leading-[24px] text-[#667085]">
                {HOW_IT_WORKS_CONFIG.subtext}
              </p>
              <div className="mt-6 sm:mt-8">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#F5B800] hover:bg-[#E0A800] text-[#101828] font-bold text-[14px] transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-[#F5B800] focus:ring-offset-2"
                >
                  Shop now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right illustration container: 440x240 radius-24 white box */}
            {HOW_IT_WORKS_CONFIG.illustrationImage ? (
              <div className="w-full max-w-[440px] h-[240px] rounded-[24px] bg-white border border-[#E7E8E5] overflow-hidden shadow-xs flex items-center justify-center">
                <img
                  src={HOW_IT_WORKS_CONFIG.illustrationImage}
                  alt="How FillCarts works illustration"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full max-w-[440px] h-[240px] rounded-[24px] bg-white border-2 border-dashed border-[#E7E8E5] p-6 flex flex-col items-center justify-center text-center shadow-xs">
                <div className="w-[52px] h-[52px] rounded-[16px] bg-[#FFF4DA] flex items-center justify-center mb-3">
                  <PackageCheck className="w-6 h-6 text-[#936D00]" />
                </div>
                <h4 className="font-bold text-[14px] text-[#101828]">
                  From Store to Doorstep
                </h4>
                <p className="text-[12px] text-[#667085] mt-1 max-w-[280px]">
                  Fresh local items picked with care and delivered straight to your home in minutes.
                </p>
              </div>
            )}
          </section>

          {/* 3. 4 Simple Steps */}
          <section className="mt-12 sm:mt-16">
            <span className="block text-[10px] font-extrabold tracking-[1.6px] uppercase text-[#936D00]">
              {HOW_IT_WORKS_CONFIG.stepsEyebrow}
            </span>
            <h2 className="mt-1 text-[27px] font-extrabold tracking-[-1.2px] text-[#101828]">
              {HOW_IT_WORKS_CONFIG.stepsHeading}
            </h2>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[13px]">
              {HOW_IT_WORKS_CONFIG.steps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-[18px] border border-[#E7E8E5] bg-white p-[24px] relative flex flex-col justify-between min-h-[220px] shadow-xs hover:shadow-sm transition-shadow"
                >
                  {/* Large faded number 01-04 top right */}
                  <span
                    aria-hidden="true"
                    className="absolute top-[20px] right-[20px] text-[34px] font-extrabold leading-none text-[#EAECF0] select-none"
                  >
                    {step.number}
                  </span>

                  <div>
                    {/* 48x48 pale-yellow icon box */}
                    <div className="w-[48px] h-[48px] rounded-[14px] bg-[#FFF4DA] flex items-center justify-center mb-5 shrink-0">
                      {getStepIcon(step.iconType)}
                    </div>
                    <h3 className="font-bold text-[16px] text-[#101828]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-[20px] text-[#667085]">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Built for everyone */}
          <section className="mt-12 sm:mt-16">
            <span className="block text-[10px] font-extrabold tracking-[1.6px] uppercase text-[#936D00]">
              {HOW_IT_WORKS_CONFIG.audienceEyebrow}
            </span>
            <h2 className="mt-1 text-[27px] font-extrabold tracking-[-1.2px] text-[#101828]">
              {HOW_IT_CONFIG_AUDIENCE_HEADING(HOW_IT_WORKS_CONFIG.audienceHeading)}
            </h2>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-[13px]">
              {HOW_IT_WORKS_CONFIG.audiences.map((aud) => (
                <div
                  key={aud.id}
                  className="rounded-[20px] bg-[#F4F5F8] p-6 sm:p-[28px] border border-[#E7E8E5] flex flex-col justify-between min-h-[220px] shadow-xs"
                >
                  <div>
                    <div className="w-[42px] h-[42px] rounded-[12px] bg-white border border-[#E7E8E5] flex items-center justify-center mb-4 shrink-0 shadow-2xs">
                      {getAudienceIcon(aud.id)}
                    </div>
                    <h3 className="font-extrabold text-[18px] text-[#101828]">
                      {aud.title}
                    </h3>
                    {aud.tagline && (
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#936D00] mt-0.5">
                        {aud.tagline}
                      </span>
                    )}
                    <p className="mt-2 text-[13.5px] leading-[21px] text-[#667085]">
                      {aud.description}
                    </p>
                  </div>

                  {aud.to && (
                    <div className="mt-6 pt-4 border-t border-[#E7E8E5]">
                      <Link
                        to={aud.to}
                        className="inline-flex items-center gap-1.5 font-bold text-[13px] text-[#101828] hover:text-[#D49400] transition-colors"
                      >
                        {aud.ctaText}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 5. Dark CTA Band */}
          <section className="mt-12 sm:mt-16 bg-[#111925] rounded-[32px] p-8 sm:px-[48px] sm:py-[40px] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div>
              <h2 className="text-[26px] sm:text-[32px] font-extrabold tracking-[-0.8px] text-white">
                {HOW_IT_WORKS_CONFIG.cta.heading}
              </h2>
              {HOW_IT_WORKS_CONFIG.cta.subtext && (
                <p className="mt-2 text-[14px] text-[#828C9C] max-w-[500px]">
                  {HOW_IT_WORKS_CONFIG.cta.subtext}
                </p>
              )}
            </div>
            <Link
              to={HOW_IT_WORKS_CONFIG.cta.to}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#F5B800] hover:bg-[#E0A800] text-[#101828] font-bold text-[14px] transition-colors shrink-0 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#F5B800] focus:ring-offset-2"
            >
              {HOW_IT_WORKS_CONFIG.cta.buttonText}
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function HOW_IT_CONFIG_AUDIENCE_HEADING(heading) {
  return heading || "One platform, three ways to join";
}
