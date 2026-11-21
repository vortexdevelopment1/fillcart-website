import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Logo from "../components/Logo";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="bg-white min-h-screen text-[#111925] flex flex-col font-sans" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <Navbar />

      <main className="flex-1 max-w-[1216px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center">
        <div className="max-w-md w-full bg-white border border-[#ECEEF2] rounded-[32px] p-8 sm:p-12 shadow-sm text-center">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          <span className="text-6xl sm:text-7xl font-extrabold text-[#FEC201] block mb-4 tracking-tight">
            404
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111925] mb-3">
            Page Not Found
          </h1>

          <p className="text-sm text-[#6B7280] font-medium mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Explore our fresh marketplace or return to the home page.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FEC201] hover:bg-[#F5B800] text-[#111925] font-extrabold px-6 py-3 rounded-full text-xs shadow-xs transition-all cursor-pointer"
            >
              <Home size={15} />
              <span>Back to Home</span>
            </Link>

            <Link
              to="/categories"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F4F5F8] hover:bg-[#ECEEF2] text-[#111925] font-bold px-6 py-3 rounded-full text-xs transition-all cursor-pointer"
            >
              <ArrowLeft size={15} />
              <span>Explore Categories</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

