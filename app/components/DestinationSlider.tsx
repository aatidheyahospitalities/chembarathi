'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, type Transition } from 'motion/react';
import Image from 'next/image';

import { ROOM_TYPES } from '../lib/rooms';
import { onScrollPosition } from '../lib/scroll';

type Destination = {
  name: string;
  images: string[];
};

/* Names and imagery come from `app/lib/rooms.ts`, which the footer reads too —
   the two used to hold their own copies and had drifted apart. */
const destinations: Destination[] = ROOM_TYPES.map(room => ({
  name: room.name,
  images: [room.image],
}));

const loopDestinations = [
  destinations[destinations.length - 1],
  ...destinations,
  destinations[0],
];

/** Gap between cards, in px. Must match the `gap-4` on the track. */
const CARD_GAP = 16;

/**
 * Card width in px for a given viewport.
 *
 * Measured rather than expressed in CSS because the track's translate has to
 * use the same number, and Motion cannot interpolate between `calc()` strings
 * containing viewport units — the old version animated a calc string, which
 * snapped instead of easing.
 *
 * The `0.9 * width` ceiling is what makes tablets work: at 768x1024 the old
 * `80vh * 16/9` came out at ~1456px, far wider than the screen, so a card
 * could never be centred.
 */
function measureCardWidth(width: number, height: number) {
  if (width <= 540) return width * 0.85;
  return Math.min((height * 0.8 * 16) / 9, width * 0.9);
}

export default function DestinationSlider() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  const [transition, setTransition] = useState<Transition>({
    type: 'tween',
    ease: [0.32, 0.72, 0, 1],
    duration: 0.5,
  });

  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorPositionRef = useRef({ x: 0, y: 0 });
  /* Set on drag end and read by the click handler. Without it, finishing a
     swipe counted as a tap and threw the visitor into the booking engine. */
  const draggedRef = useRef(false);

  // Navigation handlers
  const goToIndex = (index: number, immediate = false) => {
    if (immediate) {
      setTransition((prev: Transition) => ({ ...prev, duration: 0 }));
      setActiveIndex(index);
      // Reset transition after a frame
      requestAnimationFrame(() => {
        setTransition((prev: Transition) => ({ ...prev, duration: 0.5 }));
      });
    } else {
      setActiveIndex(index);
    }
  };

  const handleAnimationComplete = () => {
    if (activeIndex === 0) {
      goToIndex(destinations.length, true);
    } else if (activeIndex === loopDestinations.length - 1) {
      goToIndex(1, true);
    }
  };

  useEffect(() => {
    const measure = () => {
      setIsMobile(window.matchMedia('(max-width: 540px)').matches);
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Helper functions
  const getRealIndex = (index: number) => {
    if (index === 0) return destinations.length - 1;
    if (index === loopDestinations.length - 1) return 0;
    return index - 1;
  };

  const openBookingEngine = () => {
    window.open(
      'https://bookingengine.stayflexi.com/?hotel_id=28009',
      '_blank'
    );
  };

  const currentDestinationName = destinations[getRealIndex(activeIndex)].name;

  const cardWidth = measureCardWidth(viewport.width, viewport.height);
  const trackOffset =
    -activeIndex * (cardWidth + CARD_GAP) + (viewport.width - cardWidth) / 2;

  // Navigation handlers
  const goToNext = () => {
    goToIndex(activeIndex + 1);
  };

  const goToPrevious = () => {
    goToIndex(activeIndex - 1);
  };

  /* Writes straight to the cursor node instead of through state. Every mouse
     move used to call `setCursor`, re-rendering the whole slider -- eight
     Motion cards and the dots -- on each event, and it called
     `getBoundingClientRect()` each time only to discard the result, forcing a
     layout per move. */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;

    cursorPositionRef.current = { x: e.clientX, y: e.clientY };
    const node = cursorRef.current;
    if (!node) return;

    node.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (isMobile) return;

    cursorPositionRef.current = { x: e.clientX, y: e.clientY };
    setCursorVisible(true);
  };

  const handleMouseLeave = () => {
    setCursorVisible(false);
  };

  useEffect(() => {
    if (!cursorVisible || !cursorRef.current) return;

    const { x, y } = cursorPositionRef.current;
    cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  }, [cursorVisible]);

  useEffect(() => {
    if (!cursorVisible) return;

    return onScrollPosition(() => {
      const track = trackRef.current;
      if (!track) return;

      const { x, y } = cursorPositionRef.current;
      const rect = track.getBoundingClientRect();
      const pointerIsInside =
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

      if (!pointerIsInside) setCursorVisible(false);
    });
  }, [cursorVisible]);

  const handleClick = () => {
    // A swipe ends with a click event; only a real tap should open booking.
    if (draggedRef.current) {
      draggedRef.current = false;
      return;
    }

    openBookingEngine();
  };

  return (
    <div className="relative w-full  flex flex-col items-center justify-center">
      <div className="section-wrapper flex gap-(--spacing-padding-16x) w-full xs:!flex-col xs:!gap-(--spacing-padding-6x)">
        <div className="flex flex-col gap-(--spacing-padding-3x) w-[50%] xs:!w-full">
          <span className="text-md-regular text-(--typography-color-secondary-500)">
            ACCOMMODATION
          </span>
          <h2 className="text-heading-2 text-(--typography-color-secondary-100) xs:!text-heading-4">
            Suites & Cottages.
          </h2>
        </div>
        <div className="flex flex-col gap-(--spacing-padding-10x) w-[50%] text-start xs:!w-full xs:!gap-(--spacing-padding-6x)">
          <span className="text-xl-regular text-(--typography-color-secondary-800) xs:!text-body-lg">
            Enjoy the light-filled interiors with soaring ceilings and private
            terraces or courtyards that offer stunning views of the lush
            greenery. Experience the ultimate in comfort and privacy during your
            stay with us.
          </span>
        </div>
      </div>
      <div
        ref={trackRef}
        className="relative w-full overflow-x-hidden cursor-none xs:!cursor-auto"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          animate={{ x: trackOffset }}
          transition={transition}
          onAnimationComplete={handleAnimationComplete}
          className="flex gap-4"
        >
          {loopDestinations.map((destination, index) => (
            <motion.div
              key={index}
              ref={el => {
                cardsRef.current[index] = el;
              }}
              style={{ width: cardWidth || undefined }}
              className={`flex-shrink-0 h-[80vh] xs:!h-auto xs:!aspect-[3/4] rounded-xl overflow-hidden relative`}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 50) {
                  draggedRef.current = true;
                  if (info.offset.x < 0) {
                    goToNext();
                  } else {
                    goToPrevious();
                  }
                }
              }}
            >
              <Image
                src={destination.images[0]}
                alt={destination.name}
                fill
                /* Without `sizes`, `fill` assumes 100vw and every card pulled
                   the 3840px source -- eight of them, on a section that shows
                   one at a time. A card is never wider than ~90vw. */
                sizes="(max-width: 540px) 85vw, 90vw"
                /* Only the card in view at load matters for LCP; the rest wait
                   until the visitor actually pages to them. */
                priority={index === 1}
                loading={index === 1 ? undefined : 'lazy'}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {!isMobile &&
        cursorVisible &&
        createPortal(
          /* Render outside ScrollSmoother's transformed content so these
             viewport coordinates stay accurate at every scroll position. */
          <div
            ref={cursorRef}
            className="fixed left-0 top-0 pointer-events-none z-[10000]"
          >
            <div className="bg-white/10! backdrop-blur-md! px-4! py-2! rounded-full border border-white/20 flex items-center gap-3">
              <span className="text-white font-semibold">View Details</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </div>
          </div>,
          document.body
        )}

      <div className="section-wrapper grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-(--spacing-padding-6x) pt-[20px]! pb-0! xs:!flex xs:!flex-col xs:!gap-(--spacing-padding-4x)">
        <button
          onClick={() => openBookingEngine()}
          className="z-20 max-w-[32rem] justify-self-start text-left text-xl-regular text-white! transition-opacity hover:opacity-80 xs:!max-w-none xs:!text-center"
        >
          {currentDestinationName}
        </button>

        {/* Progress Indicator - Dots */}
        <div className="flex items-center justify-self-center gap-3">
          {destinations.map((_, i) => (
            <motion.div
              key={i}
              className="h-2 rounded-full bg-white transition-all duration-300"
              initial={false}
              animate={{
                width: getRealIndex(activeIndex) === i ? 24 : 8,
                opacity: getRealIndex(activeIndex) === i ? 1 : 0.3,
              }}
              transition={transition}
            />
          ))}
        </div>

        {/* Navigation arrows at bottom-right */}
        <div className="z-20 flex items-center justify-self-end gap-3 xs:!hidden">
          <button
            onClick={e => {
              e.stopPropagation();
              goToPrevious();
            }}
            aria-label="Previous room"
            className="bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={e => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next room"
            className="bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
