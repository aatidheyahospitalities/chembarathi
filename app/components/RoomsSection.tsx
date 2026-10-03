"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

/**
 * Full-height product image carousel.
 *
 * Data shape per slide:
 * { image: string, title: string, size: string, alt: string }
 *
 * Scales to any number of slides without structural changes —
 * just pass a longer `slides` array.
 */

const DEFAULT_SLIDES = [
  {
    image: "/rooms/Premium Cottage with Pool View & Mountain View.jpg",
    title: "Premium Cottage with Pool & Mountain View",
    size: "Luxury Stay",
    alt: "Premium Cottage with Pool & Mountain View at Chembarathi Wayanad",
  },
  {
    image: "/rooms/Premium Cottage with Mountain View.png",
    title: "Premium Cottage with Mountain View",
    size: "Premium Stay",
    alt: "Premium Cottage with Mountain View at Chembarathi Wayanad",
  },
  {
    image: "/rooms/Deluxe Cottage with Forest View.jpg",
    title: "Deluxe Cottage with Forest View",
    size: "Nature Stay",
    alt: "Deluxe Cottage with Forest View at Chembarathi Wayanad",
  },
  {
    image: "/rooms/Private Pool Villa.jpg",
    title: "Private Pool Villa",
    size: "Luxury Suite",
    alt: "Private Pool Villa at Chembarathi Wayanad with stunning views",
  },
  {
    image: "/rooms/Honeymoon Suite with Jacuzzi.jpg",
    title: "Honeymoon Suite with Jacuzzi",
    size: "Romantic Getaway",
    alt: "Honeymoon Suite with Jacuzzi at Chembarathi Wayanad perfect for couples",
  },
];

export default function ProductCarousel({ slides = DEFAULT_SLIDES }) {
  const count = slides.length;
  const loopable = count > 1;

  const [current, setCurrent] = useState(0); // real index
  const [animate, setAnimate] = useState(true);
  const [hoverSide, setHoverSide] = useState<'left' | 'right' | null>(null);
  const [errored, setErrored] = useState(() => new Set<number>());
  const [dragX, setDragX] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  const goNext = useCallback(() => {
    if (!loopable) return;
    setAnimate(true);
    setCurrent((c) => (c + 1) % count);
  }, [loopable, count]);

  const goPrev = useCallback(() => {
    if (!loopable) return;
    setAnimate(true);
    setCurrent((c) => (c - 1 + count) % count);
  }, [loopable, count]);

  const goTo = useCallback(
    (idx: number) => {
      if (idx === current) return;
      setAnimate(true);
      setCurrent(idx);
    },
    [current]
  );

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  // Snap invisibly at the clones to fake infinite loop
  const handleTransitionEnd = () => {
    // No longer needed with simplified carousel
  };

  // Re-enable the transition on the next frame after a silent snap
  useEffect(() => {
    // No longer needed with simplified carousel
  }, [animate]);

  // Desktop: reveal left/right arrow based on cursor half
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setHoverSide(x < rect.width / 2 ? "left" : "right");
  };
  const handleMouseLeave = () => setHoverSide(null);

  // Touch swipe: native listeners (not React's onTouch* props) so we can
  // call preventDefault on touchmove — React attaches touchstart/touchmove
  // as passive by default, which silently ignores preventDefault and lets
  // the page scroll fight the swipe. We also only lock the gesture once we
  // know it's more horizontal than vertical, so a vertical scroll attempt
  // that starts over the carousel still scrolls the page normally.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let axis: 'x' | 'y' | null = null;
    let lastDx = 0;

    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      axis = null;
      lastDx = 0;
      setAnimate(false);
    };

    const onMove = (e: TouchEvent) => {
      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      if (axis === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
        axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }
      if (axis === "x") {
        e.preventDefault();
        lastDx = dx;
        setDragX(dx);
      }
    };

    const onEnd = () => {
      if (axis === "x") {
        const threshold = 50;
        if (lastDx <= -threshold) goNext();
        else if (lastDx >= threshold) goPrev();
        else setAnimate(true);
        setDragX(0);
      } else {
        setAnimate(true);
      }
      axis = null;
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd, { passive: true });
    el.addEventListener("touchcancel", onEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [goNext, goPrev]);

  const base = -current * 100;
  const dragPercent =
    stageRef.current && dragX
      ? (dragX / (stageRef.current.getBoundingClientRect()?.width || 1)) * 100
      : 0;

  const active = slides[current];

  return (
    <section
      className="font-secondary text-black"
      aria-roledescription="carousel"
      aria-label="Product photo gallery"
    >
      <div className="section-wrapper flex gap-16x w-full xs:!flex-col xs:!gap-6x">
        <div className="flex flex-col gap-3x w-[50%] xs:!w-full">
          <span className="text-md-regular text-secondary-500">
            ACCOMMODATION
          </span>
          <h2 className="text-heading-2 text-secondary-100 xs:!text-heading-4">
            Suites & Cottages.
          </h2>
        </div>
        <div className="flex flex-col gap-10x w-[50%] text-start xs:!w-full xs:!gap-6x">
          <span className="text-xl-regular text-secondary-800 xs:!text-lg-regular">
            Enjoy the light-filled interiors with soaring ceilings and private
            terraces or courtyards that offer stunning views of the lush
            greenery. Experience the ultimate in comfort and privacy during your
            stay with us.
          </span>
        </div>
      </div>

      <div
        className="relative w-full h-screen overflow-hidden bg-[#f2f1ee] cursor-default touch-pan-y md:h-auto md:aspect-[3/4]"
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`flex h-full w-full will-change-transform ${animate ? "transition-transform duration-[620ms] ease-[cubic-bezier(.65,0,.35,1)]" : ""}`}
          style={{ transform: `translateX(${base + dragPercent}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((slide: any, i: number) => {
            const isCurrent = i === current;
            return (
              <div
                className="relative flex-shrink-0 w-full h-full"
                key={i}
                aria-hidden={!isCurrent}
              >
                {errored.has(i) ? (
                  <div className="absolute inset-0 flex items-end p-8 bg-gradient-to-br from-[#e7e5df] to-[#d3d0c8] text-black/35 text-sm font-medium">
                    {slide.title}
                  </div>
                ) : (
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority={isCurrent}
                    className="object-cover select-none"
                    draggable={false}
                    onError={() =>
                      setErrored((prev) => new Set(prev).add(i))
                    }
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Room Information Overlay */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-4 py-6 px-[clamp(20px,4vw,48px)] bg-gradient-to-t from-black/60 via-black/40 to-transparent">
          <div className="text-center">
            <p className="text-base font-medium text-white mb-1 leading-tight">{active.title}</p>
            <p className="text-sm text-white/70 leading-tight">{active.size}</p>
          </div>
          {loopable && (
            <div className="flex flex-col items-center gap-2.5 flex-shrink-0">
              <span className="text-xs font-medium tracking-widest text-white/60 tabular-nums whitespace-nowrap">
                {String(current + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
              <div className="flex gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`w-5 h-0.5 rounded-none bg-white/20 cursor-pointer transition-all duration-200 ease focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-3 ${i === current ? "w-7 bg-white" : ""}`}
                    aria-label={`Go to image ${i + 1}`}
                    aria-current={i === current}
                    onClick={() => goTo(i)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="absolute top-1/2 -translate-y-1/2 w-[46px] h-[46px] rounded-full bg-white/88 backdrop-blur-md border-2 border-white flex items-center justify-center cursor-pointer transition-opacity duration-[220ms] ease transition-transform duration-[180ms] ease text-white z-10 left-6 hover:scale-106 focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-3"
          aria-label="Previous image"
          onClick={goPrev}
        >
          <ChevronLeft size={20} strokeWidth={2.5} style={{ color: '#ffffff' }} />
        </button>
        <button
          type="button"
          className="absolute top-1/2 -translate-y-1/2 w-[46px] h-[46px] rounded-full bg-white/88 backdrop-blur-md border-2 border-white flex items-center justify-center cursor-pointer transition-opacity duration-[220ms] ease transition-transform duration-[180ms] ease text-white z-10 right-6 hover:scale-106 focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-3"
          aria-label="Next image"
          onClick={goNext}
        >
          <ChevronRight size={20} strokeWidth={2.5} style={{ color: '#ffffff' }} />
        </button>

        <span className="sr-only" aria-live="polite">
          {`Image ${current + 1} of ${count}: ${active.title}`}
        </span>
      </div>
    </section>
  );
}
