import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Plus, Minus, X } from "lucide-react";

const ZOOM_LEVELS = [1.0, 1.5, 2.0, 2.5, 3.0];

/**
 * ImageViewer (Lightbox) Component
 * 
 * Full-screen modal rendered in a portal on document.body.
 * Matches exact Figma specifications:
 * - Backdrop: rgba(11,18,32,0.92) (#0B1220EB), fade-in 150ms
 * - Top bar (72px): counter pill, product label, zoom controls (+/-, 100%-300%), close
 * - Stage card (960x560px, #F8FAFC, radius 20px) with 52px looping prev/next arrows (56px from edge)
 * - Bottom thumbnail strip (64x64 thumbs, active 2px #FBBF24) with auto-scroll & hint line
 * - Zoom & pan: wheel zoom, +/- buttons, double-click 100%/200%, clamped drag panning
 * - Keyboard navigation (Arrows, Esc, +/-), focus trap, scroll lock, touch swipe & pinch
 */
export default function ImageViewer({
  images = [],
  startIndex = 0,
  alt = "Product photo",
  productLabel = "",
  onClose,
}) {
  const [currentIndex, setCurrentIndex] = useState(
    Math.max(0, Math.min(startIndex, images.length - 1))
  );
  const [zoomIndex, setZoomIndex] = useState(0); // index in ZOOM_LEVELS (0 = 1.0 = 100%)
  const zoom = ZOOM_LEVELS[zoomIndex];

  // Pan state for dragging when zoomed
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // Touch swipe & pinch state
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const initialPinchDistRef = useRef(null);

  // Focus trap refs
  const viewerRef = useRef(null);
  const previousActiveElementRef = useRef(null);
  const stageCardRef = useRef(null);
  const activeThumbRef = useRef(null);

  // Check prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mq.matches);
    }
  }, []);

  // Save opener focus and lock body scroll on mount
  useEffect(() => {
    previousActiveElementRef.current = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus close button initially
    const closeBtn = viewerRef.current?.querySelector('button[aria-label="Close viewer"]');
    closeBtn?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === "function") {
        previousActiveElementRef.current.focus();
      }
    };
  }, []);

  // Reset zoom & pan when image changes
  const changeImage = useCallback((newIdx) => {
    setCurrentIndex(newIdx);
    setZoomIndex(0);
    setPan({ x: 0, y: 0 });
  }, []);

  // Prev / Next navigation (loop around)
  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    const nextIdx = (currentIndex - 1 + images.length) % images.length;
    changeImage(nextIdx);
  }, [currentIndex, images.length, changeImage]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    const nextIdx = (currentIndex + 1) % images.length;
    changeImage(nextIdx);
  }, [currentIndex, images.length, changeImage]);

  // Zoom controls (+ / -)
  const handleZoomIn = useCallback(() => {
    setZoomIndex((prev) => {
      const next = Math.min(prev + 1, ZOOM_LEVELS.length - 1);
      if (next === 0) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomIndex((prev) => {
      const next = Math.max(prev - 1, 0);
      if (next === 0) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  // Double click toggle 100% / 200%
  const handleDoubleClick = useCallback(() => {
    if (zoomIndex === 0) {
      // Zoom to 200% (index 2)
      setZoomIndex(2);
    } else {
      // Reset to 100%
      setZoomIndex(0);
      setPan({ x: 0, y: 0 });
    }
  }, [zoomIndex]);

  // Auto-scroll thumbnail into view
  useEffect(() => {
    if (activeThumbRef.current) {
      activeThumbRef.current.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentIndex, prefersReducedMotion]);

  // Clamped Pan helper
  const clampPan = useCallback(
    (newX, newY, currentZoom) => {
      if (!stageCardRef.current || currentZoom <= 1) {
        return { x: 0, y: 0 };
      }
      const rect = stageCardRef.current.getBoundingClientRect();
      const maxX = ((currentZoom - 1) * rect.width) / 2;
      const maxY = ((currentZoom - 1) * rect.height) / 2;
      return {
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY)),
      };
    },
    []
  );

  // Mouse wheel zoom over stage card
  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else if (e.deltaY > 0) {
        handleZoomOut();
      }
    },
    [handleZoomIn, handleZoomOut]
  );

  // Mouse Drag handlers
  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoom <= 1) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const targetX = dragStartRef.current.panX + dx;
    const targetY = dragStartRef.current.panY + dy;
    setPan(clampPan(targetX, targetY, zoom));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for swipe & pinch zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
      if (zoom > 1) {
        dragStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          panX: pan.x,
          panY: pan.y,
        };
        setIsDragging(true);
      }
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistRef.current = dist;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && initialPinchDistRef.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / initialPinchDistRef.current;
      if (ratio > 1.25) {
        handleZoomIn();
        initialPinchDistRef.current = dist;
      } else if (ratio < 0.75) {
        handleZoomOut();
        initialPinchDistRef.current = dist;
      }
    } else if (e.touches.length === 1 && isDragging && zoom > 1) {
      const dx = e.touches[0].clientX - dragStartRef.current.x;
      const dy = e.touches[0].clientY - dragStartRef.current.y;
      setPan(clampPan(dragStartRef.current.panX + dx, dragStartRef.current.panY + dy, zoom));
    }
  };

  const handleTouchEnd = (e) => {
    setIsDragging(false);
    initialPinchDistRef.current = null;
    if (zoom === 1 && e.changedTouches.length === 1) {
      const dx = touchStartRef.current.x - e.changedTouches[0].clientX;
      const dt = Date.now() - touchStartRef.current.time;
      if (Math.abs(dx) >= 50 && dt < 400) {
        if (dx > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
  };

  // Keyboard navigation & Focus trap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
        return;
      }
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        handleZoomIn();
        return;
      }
      if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        handleZoomOut();
        return;
      }

      // Focus trap
      if (e.key === "Tab" && viewerRef.current) {
        const focusableElements = viewerRef.current.querySelectorAll(
          'button:not([disabled]):not([aria-disabled="true"]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext, handleZoomIn, handleZoomOut, onClose]);

  // Backdrop click handler
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const activeImage = images[currentIndex] || "";
  const zoomPercentText = `${Math.round(zoom * 100)}%`;

  return createPortal(
    <div
      ref={viewerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Product photos"
      onClick={handleBackdropClick}
      style={{
        backgroundColor: "rgba(11, 18, 32, 0.92)",
        fontFamily: "'Inter', sans-serif",
      }}
      className={`fixed inset-0 z-[1000] flex flex-col justify-between items-center select-none text-white overflow-hidden ${
        prefersReducedMotion ? "" : "transition-opacity duration-150 ease-out"
      }`}
    >
      {/* 1. TOP BAR (height: 72px, padding: 0 40px, flex, space-between) */}
      <header
        style={{ height: "72px" }}
        className="w-full flex items-center justify-between px-4 md:px-10 shrink-0 z-20 pointer-events-auto"
      >
        {/* Left: counter pill + product label */}
        <div className="flex items-center gap-3">
          <span
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              borderRadius: "999px",
              padding: "7px 14px",
              fontFamily: "'Inter', sans-serif",
            }}
            className="font-bold text-[13px] text-white leading-none whitespace-nowrap"
          >
            {currentIndex + 1} / {images.length}
          </span>
          {productLabel && (
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "rgba(255, 255, 255, 0.8)",
              }}
              className="hidden md:inline font-semibold text-[14px] truncate max-w-[320px]"
            >
              {productLabel}
            </span>
          )}
        </div>

        {/* Right: zoom out, zoom level, zoom in, gap 12px, close */}
        <div className="flex items-center">
          {/* Zoom Out Button */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoomIndex === 0}
            aria-disabled={zoomIndex === 0}
            aria-label="Zoom out"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              opacity: zoomIndex === 0 ? 0.4 : 1,
              cursor: zoomIndex === 0 ? "not-allowed" : "pointer",
            }}
            className="flex items-center justify-center transition-opacity hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24]"
          >
            <Minus size={18} className="text-white" />
          </button>

          {/* Zoom Level Label */}
          <span
            style={{
              width: "44px",
              fontFamily: "'Inter', sans-serif",
              color: "rgba(255, 255, 255, 0.8)",
            }}
            className="text-center font-bold text-[12px] tabular-nums"
          >
            {zoomPercentText}
          </span>

          {/* Zoom In Button */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoomIndex === ZOOM_LEVELS.length - 1}
            aria-disabled={zoomIndex === ZOOM_LEVELS.length - 1}
            aria-label="Zoom in"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              opacity: zoomIndex === ZOOM_LEVELS.length - 1 ? 0.4 : 1,
              cursor: zoomIndex === ZOOM_LEVELS.length - 1 ? "not-allowed" : "pointer",
            }}
            className="flex items-center justify-center transition-opacity hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24]"
          >
            <Plus size={18} className="text-white" />
          </button>

          {/* 12px Gap */}
          <div className="w-[12px]" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close viewer"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.12)",
            }}
            className="flex items-center justify-center transition-colors hover:bg-white/20 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24]"
          >
            <X size={20} className="text-white" />
          </button>
        </div>
      </header>

      {/* 2. STAGE: Centered card 960x560px with photo & looping arrows */}
      <main
        onClick={handleBackdropClick}
        className="relative w-full flex-1 flex items-center justify-center px-4 md:px-14 z-10 overflow-hidden"
      >
        {/* Previous Arrow: 52px white circle, 56px from edge, vertically centered */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous photo"
            style={{
              position: "fixed",
              left: "56px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              zIndex: 30,
            }}
            className="hidden md:flex items-center justify-center text-[#101828] transition-transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24]"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
        )}

        {/* Stage Card: 960px x 560px, background #F8FAFC, radius 20px (under 768px: fills width, no radius) */}
        <div
          ref={stageCardRef}
          onWheel={handleWheel}
          onDoubleClick={handleDoubleClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            backgroundColor: "#F8FAFC",
            cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
          }}
          className="relative w-full max-w-[960px] h-[340px] sm:h-[440px] md:h-[560px] max-h-[calc(100vh-240px)] rounded-none md:rounded-[20px] overflow-hidden flex items-center justify-center shadow-2xl"
        >
          <img
            src={activeImage}
            alt={`${alt} enlarged preview ${currentIndex + 1}`}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transition: isDragging ? "none" : "transform 150ms ease-out",
            }}
            className="max-w-full max-h-full object-contain pointer-events-none select-none"
            draggable={false}
          />
        </div>

        {/* Next Arrow: 52px white circle, 56px from edge, vertically centered */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next photo"
            style={{
              position: "fixed",
              right: "56px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              zIndex: 30,
            }}
            className="hidden md:flex items-center justify-center text-[#101828] transition-transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24]"
          >
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>
        )}
      </main>

      {/* 3. THUMBNAIL STRIP AT BOTTOM (bottom: 28px, centered, gap: 10px) */}
      <footer
        style={{
          paddingBottom: "28px",
          paddingTop: "12px",
        }}
        className="w-full flex flex-col items-center gap-2.5 z-20 shrink-0 pointer-events-auto"
      >
        {/* Thumbnails row */}
        {images.length > 1 && (
          <div
            className="flex items-center gap-[10px] max-w-[90vw] overflow-x-auto p-1 no-scrollbar"
            style={{
              scrollbarWidth: "none",
            }}
          >
            {images.map((img, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  ref={isActive ? activeThumbRef : null}
                  type="button"
                  onClick={() => changeImage(idx)}
                  aria-label={`Jump to photo ${idx + 1} of ${images.length}`}
                  aria-current={isActive ? "true" : undefined}
                  style={{
                    borderRadius: "12px",
                    padding: "3px",
                    border: isActive
                      ? "2px solid #FBBF24"
                      : "1px solid rgba(255, 255, 255, 0.2)",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    opacity: isActive ? 1 : 0.65,
                    boxSizing: "border-box",
                  }}
                  className="w-[56px] h-[56px] md:w-[64px] md:h-[64px] shrink-0 overflow-hidden flex items-center justify-center transition-all cursor-pointer hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24]"
                >
                  <img
                    src={img}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover rounded-[8px]"
                  />
                </button>
              );
            })}
          </div>
        )}
      </footer>
    </div>,
    document.body
  );
}
