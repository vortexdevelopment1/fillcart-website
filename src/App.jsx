import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate, useSearchParams } from "react-router-dom";
import AppKartHome from "./pages/AppKartHome";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryListingPage from "./pages/CategoryListingPage";
import AboutPage from "./pages/AboutPage";
import SupportPage from "./pages/SupportPage";
import CustomerLoginPage from "./pages/CustomerLoginPage";
import CustomerRegistrationPage from "./pages/CustomerRegistrationPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import CareersPage from "./pages/CareersPage";
import BlogPage from "./pages/BlogPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import UserProfilePage from "./pages/UserProfilePage";
import ProfileOrders from "./pages/profile/ProfileOrders";
import ProfileAddresses from "./pages/profile/ProfileAddresses";
import ProfilePrescriptions from "./pages/profile/ProfilePrescriptions";
import ProfileAccount from "./pages/profile/ProfileAccount";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import FeaturesPage from "./pages/FeaturesPage";
import LegalPage from "./pages/LegalPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import ShopsPage from "./pages/ShopsPage";
import NotFoundPage from "./pages/NotFoundPage";
import BecomeVendorPage from "./pages/BecomeVendorPage";
import BecomeRiderPage from "./pages/BecomeRiderPage";
import ContactPage from "./pages/ContactPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import PaymentOffersPage from "./pages/PaymentOffersPage";
import StoresListingPage from "./pages/StoresListingPage";
import StoreDetailPage from "./pages/StoreDetailPage";

const StyleguidePage = lazy(() => import("./pages/StyleguidePage"));

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash && pathname !== "/terms" && pathname !== "/privacy") {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function CategoriesRedirect() {
  const [searchParams] = useSearchParams();
  const cat = searchParams.get("cat");
  if (cat) {
    return <Navigate to={`/category/${cat}`} replace />;
  }
  return <Navigate to="/category/grocery" replace />;
}

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<AppKartHome />} />
            <Route path="/profile" element={<Navigate to="/profile/orders" replace />} />
            <Route path="/profile/orders" element={<ProfileOrders />} />
            <Route path="/profile/addresses" element={<ProfileAddresses />} />
            <Route path="/profile/prescriptions" element={<ProfilePrescriptions />} />
            <Route path="/profile/account" element={<ProfileAccount />} />
            <Route path="/profile/:tab" element={<UserProfilePage />} />
            <Route path="/login" element={<CustomerLoginPage />} />
            <Route path="/register" element={<CustomerRegistrationPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/categories" element={<CategoriesRedirect />} />
            <Route path="/groceries" element={<Navigate to="/category/grocery" replace />} />
            <Route path="/category" element={<Navigate to="/category/grocery" replace />} />
            <Route path="/category/:slug" element={<CategoryListingPage />} />
            <Route path="/stores" element={<StoresListingPage />} />
            <Route path="/store/:slug" element={<StoreDetailPage />} />
            <Route path="/shops" element={<Navigate to="/stores" replace />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/faq" element={<Navigate to="/support" replace />} />
            <Route path="/help" element={<Navigate to="/support" replace />} />
            <Route path="/offers/payment" element={<PaymentOffersPage />} />
            <Route path="/payment-offers" element={<Navigate to="/offers/payment" replace />} />
            <Route path="/login/customer" element={<CustomerLoginPage />} />
            <Route path="/subscriptions" element={<SubscriptionPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/terms" element={<LegalPage />} />
            <Route path="/privacy" element={<LegalPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/become-vendor" element={<BecomeVendorPage />} />
            <Route path="/partner/vendor" element={<BecomeVendorPage />} />
            <Route path="/become-rider" element={<BecomeRiderPage />} />
            <Route path="/partner/rider" element={<BecomeRiderPage />} />

            {/* Dev-only styleguide route */}
            {(import.meta.env.DEV || import.meta.env.MODE !== "production") && (
              <Route
                path="/styleguide"
                element={
                  <Suspense fallback={<div className="p-8 text-center text-sm font-bold text-[#101828]">Loading styleguide...</div>}>
                    <StyleguidePage />
                  </Suspense>
                }
              />
            )}

            {/* 404 Not Found Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  );
}
