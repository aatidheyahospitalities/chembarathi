'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';

type Destination = {
  name: string;
  images: string[];
};

const destinations: Destination[] = [
  { name: 'Private Pool Villa', images: ['/PrivatePoolVilla.JPG'] },
  { name: 'Honeymoon Suite', images: ['/HoneymoonSuite.JPG'] },
  { name: 'Premium Cottage', images: ['/PremiumCottage.JPG'] },
  { name: 'Deluxe Suite', images: ['/PremiumCottage.JPG'] },
];

const loopDestinations = [
  destinations[destinations.length - 1],
  ...destinations,
  destinations[0],
];

export default function DestinationSlider() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [transition, setTransition] = useState<any>({
    type: 'tween',
    ease: [0.32, 0.72, 0, 1],
    duration: 0.5,
  });

  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Navigation handlers
  const goToIndex = (index: number, immediate = false) => {
    if (immediate) {
      setTransition((prev: any) => ({ ...prev, duration: 0 }));
      setActiveIndex(index);
      // Reset transition after a frame
      requestAnimationFrame(() => {
        setTransition((prev: any) => ({ ...prev, duration: 0.5 }));
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
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 540px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Helper functions
  const getRealIndex = (index: number) => {
    if (index === 0) return destinations.length - 1;
    if (index === loopDestinations.length - 1) return 0;
    return index - 1;
  };

  const openWhatsApp = (destinationName: string) => {
    const message = encodeURIComponent(
      `I'm interested in visiting ${destinationName}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const currentDestinationName = destinations[getRealIndex(activeIndex)].name;

  // Navigation handlers
  const goToNext = () => {
    goToIndex(activeIndex + 1);
  };

  const goToPrevious = () => {
    goToIndex(activeIndex - 1);
  };

  // Mouse handlers
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    const rect = trackRef.current?.getBoundingClientRect();
    if (rect) {
      setCursor({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) setCursorVisible(true);
  };

  const handleMouseLeave = () => {
    setCursorVisible(false);
  };

  const handleClick = () => {
    openWhatsApp(currentDestinationName);
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
        className="relative w-full overflow-x-hidden cursor-none"
        onClick={handleClick}
      >
        <motion.div
          animate={{
            x: `calc(-${activeIndex} * (${isMobile ? '85vw' : 'calc(80vh * 16 / 9)'} + 1rem) + (100vw - ${isMobile ? '85vw' : 'calc(80vh * 16 / 9)'}) / 2)`,
          }}
          transition={transition}
          onAnimationComplete={handleAnimationComplete}
          className="flex gap-4"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {loopDestinations.map((destination, index) => (
            <motion.div
              key={index}
              ref={el => {
                cardsRef.current[index] = el;
              }}
              className={`flex-shrink-0 w-[calc(80vh*16/9)] h-[80vh] xs:!w-[85vw] xs:!h-auto xs:!aspect-[3/4] rounded-xl overflow-hidden relative`}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 50) {
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
                layout="fill"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {!isMobile && cursorVisible && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: cursor.x,
            top: cursor.y + (typeof window !== 'undefined' ? window.scrollY : 0),
            transform: 'translate(-50%, -50%)',
          }}
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
        </div>
      )}

      <div className="flex justify-between items-end xs:!items-center xs:!justify-center pt-[20px]! w-full px-[10vw]!">
        {/* Place name at bottom-left */}
        <button
          onClick={() => openWhatsApp(currentDestinationName)}
          className="z-20 text-xxl-regular sm:text-3xl font-semibold hover:opacity-80 transition-opacity text-white! min-w-[300px] text-left"
        >
          {currentDestinationName}
        </button>

        {/* Progress Indicator - Dots */}
        <div className="flex gap-3 items-center justify-center flex-1 mb-2">
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
        <div className="z-20 xs:!hidden flex h-full! items-center justify-center gap-3">
          <button
            onClick={e => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-10 h-10 xs:!w-6 xs:!h-6"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={e => {
              e.stopPropagation();
              goToNext();
            }}
            className="bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-10 h-10 xs:!w-6 xs:!h-6"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
