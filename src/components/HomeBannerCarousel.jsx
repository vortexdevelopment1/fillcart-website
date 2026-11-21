import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { homeBanners } from "../data/homeBannersData";
import PromoBanner from "./PromoBanner";
import CategoryHeroBanner from "./CategoryHeroBanner";
import { categoryPages } from "../data/categoryPageData";

/**
 * Hardcoded carousel height based on Slide 1 natural aspect ratio:
 * 1216 / (1329 / 448) = ~410px.
 * All slides share this exact height so the page never jumps when the slide changes.
 */
export const CAROUSEL_HEIGHT = 410;

/**
 * Configuration flag for slider indicator dots.
 * Enabled so dots stay visible and usable across all viewports.
 */
const SHOW_DOTS = true;

/**
 * HomeBannerCarousel Component
 * 
 * Auto-sliding banner carousel on the Home page:
 * - Viewport: Exactly 1216px x CAROUSEL_HEIGHT (410px), radius 32px, overflow hidden
 * - Slide 1: Original Home hero promotion, 100% width of 1216px container, height CAROUSEL_HEIGHT, object-fit cover
 * - Slide 2: Pista-green Promo Banner (<PromoBanner />) matching Figma "Banner/Grocery"
 * - Slider controls: Previous/Next arrow buttons deleted; dots gated behind SHOW_DOTS = false
 * - Autoplay: Advances every 4 seconds, smooth 600ms slide transition, infinite looping forward
 * - Pause triggers: Mouse hover, tab hidden, and keyboard focus
 * - Touch swipe support for mobile
 * - Respects prefers-reduced-motion
 * - Accessibility: region role, group slides, aria-roledescription, aria-label ("N of M"), aria-hidden on inactive slides
 */
export default function HomeBannerCarousel({ banners = homeBanners }) {
  const totalSlides = banners.length;
  const isMulti = totalSlides > 1;

  // Seamless infinite loop: [cloneLast, ...banners, cloneFirst]
  const slides = isMulti ? [banners[totalSlides - 1], ...banners, banners[0]] : banners;

  // Track state: start at index 1 (the first real slide) if multi
  const [currentIndex, setCurrentIndex] = useState(isMulti ? 1 : 0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [autoplayKey, setAutoplayKey] = useState(0);

  // Viewport scaling state (1216x410 at >= 1200px, scaled down to 768px, mobile under 768px)
  const viewportRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!viewportRef.current) return;
    const handleResize = () => {
      if (!viewportRef.current) return;
      const width = viewportRef.current.clientWidth;
      if (width < 768) {
        setIsMobile(true);
        setScale(1);
      } else {
        setIsMobile(false);
        if (width >= 1200) {
          setScale(1);
        } else {
          setScale(width / 1216);
        }
      }
    };

    handleResize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, []);

  // Check prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener?.("change", listener);
      return () => mediaQuery.removeEventListener?.("change", listener);
    }
  }, []);

  // Compute active real slide index (0 to totalSlides - 1)
  const activeRealIndex = isMulti
    ? currentIndex === 0
      ? totalSlides - 1
      : currentIndex === totalSlides + 1
      ? 0
      : currentIndex - 1
    : 0;

  // Timer reset callback
  const resetAutoplayTimer = useCallback(() => {
    setAutoplayKey((k) => k + 1);
  }, []);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (!isMulti || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [isMulti, isTransitioning]);

  const handlePrev = useCallback(() => {
    if (!isMulti || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [isMulti, isTransitioning]);

  const handleManualNext = useCallback(() => {
    handleNext();
    resetAutoplayTimer();
  }, [handleNext, resetAutoplayTimer]);

  const handleManualPrev = useCallback(() => {
    handlePrev();
    resetAutoplayTimer();
  }, [handlePrev, resetAutoplayTimer]);

  const handleGoToReal = useCallback(
    (realIdx) => {
      if (!isMulti || isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(realIdx + 1);
      resetAutoplayTimer();
    },
    [isMulti, isTransitioning, resetAutoplayTimer]
  );

  // Infinite loop boundary wrap after CSS transition completes
  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (!isMulti) return;
    if (currentIndex === 0) {
      // Wrapped backward to clone of last slide -> snap to real last slide
      setCurrentIndex(totalSlides);
    } else if (currentIndex === totalSlides + 1) {
      // Wrapped forward to clone of first slide -> snap to real first slide
      setCurrentIndex(1);
    }
  };

  // Auto-advance every 4 seconds (pauses on hover, focus, tab hidden, and reduced motion)
  useEffect(() => {
    if (!isMulti || isHovered || isFocused || prefersReducedMotion) return;

    let intervalId = null;

    const startTimer = () => {
      if (document.visibilityState === "hidden") return;
      intervalId = setInterval(() => {
        handleNext();
      }, 4000);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        clearInterval(intervalId);
      } else {
        startTimer();
      }
    };

    startTimer();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isMulti, isHovered, isFocused, prefersReducedMotion, handleNext, autoplayKey]);

  // Touch swipe support (threshold 50px)
  const handleTouchStart = (e) => {
    if (!isMulti) return;
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!isMulti || touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) >= 50) {
      if (diff > 0) {
        handleManualNext();
      } else {
        handleManualPrev();
      }
    }
    setTouchStartX(null);
  };

  // Keyboard navigation (ArrowLeft / ArrowRight)
  const handleKeyDown = (e) => {
    if (!isMulti) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleManualPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleManualNext();
    }
  };

  // Helper to render individual slide content
  const renderSlideContent = (banner, isActive) => {
    if (banner.type === "existing") {
      return (
        <div className="relative w-full h-full rounded-[16px] sm:rounded-[24px] lg:rounded-[32px] overflow-hidden flex items-center justify-center">
          <img
            src="/images/banners/hero-banner.svg"
            alt="Everything you need, delivered fast. Groceries, electronics, dairy, stationery and more, all in one place."
            width={1216}
            height={CAROUSEL_HEIGHT}
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            className="w-full h-full object-contain lg:object-cover object-center block select-none rounded-[16px] sm:rounded-[24px] lg:rounded-[32px]"
          />
          {/* Accessible hotspot over 'Shop Now' */}
          <Link
            to="/category/grocery"
            aria-label="Shop Now"
            tabIndex={isActive ? 0 : -1}
            className="absolute rounded-full cursor-pointer focus:outline-hidden focus-visible:ring-4 focus-visible:ring-[#111827] focus-visible:ring-offset-2 transition-shadow"
            style={{
              left: "4.03%",
              top: "66.34%",
              width: "19.35%",
              height: "14.32%",
            }}
          />
        </div>
      );
    }

    if (banner.type === "promo") {
      return (
        <PromoBanner
          banner={banner}
          isActive={isActive}
          scale={scale}
          isMobile={isMobile}
          carouselHeight={CAROUSEL_HEIGHT}
        />
      );
    }

    if (banner.type === "category") {
      const categoryData = categoryPages[banner.slug] || categoryPages.grocery;
      return (
        <CategoryHeroBanner
          hero={categoryData.hero || {}}
          height="100%"
          className="h-full"
          tabIndex={isActive ? 0 : -1}
          ctaUrl={`/category/${banner.slug}`}
        />
      );
    }

    return null;
  };

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured banners"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="group relative w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#101828] focus-visible:ring-offset-4 rounded-[16px] sm:rounded-[24px] lg:rounded-[32px] select-none"
    >
      {/* Visually hidden h1 for SEO & screen readers */}
      <h1 className="sr-only">Everything You Need, Delivered Fast</h1>

      {/* Carousel Viewport (Height = CAROUSEL_HEIGHT at >= 1024px, auto aspect-ratio below 1024px) */}
      <div
        ref={viewportRef}
        data-testid="carousel-viewport"
        className="relative w-full aspect-[1216/405] lg:aspect-auto rounded-[16px] sm:rounded-[24px] lg:rounded-[32px] overflow-hidden"
        style={{
          boxSizing: "border-box",
          height: isMobile ? "auto" : (scale === 1 ? `${CAROUSEL_HEIGHT}px` : `${Math.round(CAROUSEL_HEIGHT * scale)}px`),
          maxHeight: `${CAROUSEL_HEIGHT}px`,
        }}
      >
        {/* Sliding Track (600ms smooth cubic-bezier transition) */}
        <div
          data-testid="carousel-track"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition:
              isTransitioning && !prefersReducedMotion
                ? "transform 600ms cubic-bezier(0.4, 0, 0.2, 1)"
                : "none",
          }}
          className="flex w-full h-full"
        >
          {slides.map((banner, idx) => {
            const isSlideActive = isMulti
              ? (currentIndex === 0 && idx === totalSlides) ||
                (currentIndex === totalSlides + 1 && idx === 1) ||
                currentIndex === idx
              : true;

            const realIdx = isMulti
              ? idx === 0
                ? totalSlides - 1
                : idx === totalSlides + 1
                ? 0
                : idx - 1
              : 0;

            return (
              <div
                key={`${banner.id}-${idx}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${realIdx + 1} of ${totalSlides}`}
                aria-hidden={!isSlideActive}
                className="w-full h-full shrink-0 basis-full"
              >
                {renderSlideContent(banner, isSlideActive)}
              </div>
            );
          })}
        </div>

        {/* Indicator dots: visible and usable across viewports */}
        {SHOW_DOTS && isMulti && (
          <div
            className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-20 pointer-events-auto bg-black/20 backdrop-blur-xs px-2.5 py-1 rounded-full"
          >
            {banners.map((_, i) => {
              const isDotActive = i === activeRealIndex;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGoToReal(i);
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={isDotActive ? "true" : undefined}
                  className={`transition-all duration-200 cursor-pointer rounded-full focus:outline-none focus-visible:ring-1 focus-visible:ring-white ${
                    isDotActive
                      ? "w-4 sm:w-6 h-1.5 sm:h-2 bg-[#FBBF24]"
                      : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/70 hover:bg-white"
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
