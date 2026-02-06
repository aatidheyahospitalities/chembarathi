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

  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isUserScrollingRef = useRef(false);
  const touchStartXRef = useRef(0);
  const isJumpingRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 540px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (trackRef.current && cardsRef.current[activeIndex]) {
      const card = cardsRef.current[activeIndex];
      if (card) {
        const scrollLeft =
          card.offsetLeft -
          (trackRef.current.offsetWidth - card.offsetWidth) / 2;
        trackRef.current.scrollTo({
          left: scrollLeft,
          behavior: isJumpingRef.current ? 'auto' : 'smooth',
        });
      }
    }
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === 0) {
      setTimeout(() => {
        isJumpingRef.current = true;
        setActiveIndex(destinations.length);
        setTimeout(() => {
          isJumpingRef.current = false;
        }, 50);
      }, 300);
    } else if (activeIndex === loopDestinations.length - 1) {
      setTimeout(() => {
        isJumpingRef.current = true;
        setActiveIndex(1);
        setTimeout(() => {
          isJumpingRef.current = false;
        }, 50);
      }, 300);
    }
  }, [activeIndex]);

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
    setActiveIndex(prev => prev + 1);
  };

  const goToPrevious = () => {
    setActiveIndex(prev => prev - 1);
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

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
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
        className="relative w-full overflow-x-hidden cursor-none h-[80vh] xs:!h-fit"
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div
          className="flex gap-4 px-[10vw] h-full"
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
              className={`flex-shrink-0 w-[80vw] xs:!aspect-[3/4] aspect-video rounded-xl overflow-hidden relative`}
              drag={!isMobile}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragStart={() => {
                isUserScrollingRef.current = true;
              }}
              onDragEnd={(_, info) => {
                isUserScrollingRef.current = false;
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
        </div>
      </div>

      {!isMobile && cursorVisible && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: cursor.x,
            top: cursor.y + window.scrollY,
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

      <div className="flex justify-between items-end xs:!items-centerUp pt-[20px]! w-full px-[10vw]!">
        {/* Place name at bottom-left */}
        <button
          onClick={() => openWhatsApp(currentDestinationName)}
          className="z-20 text-xxl-regular sm:text-3xl font-semibold hover:opacity-80 transition-opacity text-white!"
        >
          {currentDestinationName}
        </button>

        {/* Navigation arrows at bottom-right */}
        <div className="z-20 flex h-full! items-center justify-center gap-3">
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
