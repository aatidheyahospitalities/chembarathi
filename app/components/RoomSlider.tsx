'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { openWhatsApp } from '../Services/openWhatsApp';

type Room = {
  name: string;
  images: string[];
};

const rooms: Room[] = [
  {
    name: 'Honeymoon Suite',
    images: ['/HoneymoonSuite.JPG'],
  },
  {
    name: 'Premium Cottage',
    images: ['/PremiumCottage.JPG'],
  },
  {
    name: 'Deluxe Suite',
    images: ['/PremiumCottage.JPG'],
  },
  {
    name: 'Private Pool Room',
    images: ['/PrivatePoolVilla.JPG'],
  },
];

const loopRooms = [rooms[rooms.length - 1], ...rooms, rooms[0]];

export default function RoomSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [active, setActive] = useState(1);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // For mobile scroll tracking
  const scrollStartRef = useRef<number>(0);
  const isUserScrollingRef = useRef(false);

  const CARD_WIDTH = 80;
  const SIDE_SPACE = 10;
  const SCROLL_THRESHOLD = 30;

  const realIndex =
    active === 0
      ? rooms.length - 1
      : active === loopRooms.length - 1
        ? 0
        : active - 1;

  // Check if mobile once on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 640px)').matches);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!trackRef.current || !cardsRef.current[1]) return;
    trackRef.current.scrollLeft = cardsRef.current[1].offsetLeft;
  }, []);

  useEffect(() => {
    if (!trackRef.current || !cardsRef.current[active]) return;

    trackRef.current.scrollTo({
      left:
        cardsRef.current[active].offsetLeft -
        (window.innerWidth * SIDE_SPACE) / 100,
      behavior: 'smooth',
    });
  }, [active]);

  useEffect(() => {
    if (!trackRef.current) return;

    if (active === 0) {
      setTimeout(() => {
        if (!trackRef.current || !cardsRef.current[rooms.length]) return;
        trackRef.current.scrollLeft = cardsRef.current[rooms.length].offsetLeft;
        setActive(rooms.length);
      }, 300);
    }

    if (active === loopRooms.length - 1) {
      setTimeout(() => {
        if (!trackRef.current || !cardsRef.current[1]) return;
        trackRef.current.scrollLeft = cardsRef.current[1].offsetLeft;
        setActive(1);
      }, 300);
    }
  }, [active]);

  // Handle mobile scroll
  useEffect(() => {
    if (!isMobile || !trackRef.current) return;

    const track = trackRef.current;

    const handleTouchStart = () => {
      isUserScrollingRef.current = true;
      scrollStartRef.current = track.scrollLeft;
    };

    const handleTouchEnd = () => {
      if (!isUserScrollingRef.current) return;

      const scrollEnd = track.scrollLeft;
      const scrollDistance = scrollEnd - scrollStartRef.current;

      if (Math.abs(scrollDistance) > SCROLL_THRESHOLD) {
        if (scrollDistance > 0) {
          setActive(prev => prev + 1);
        } else {
          setActive(prev => prev - 1);
        }
      } else {
        track.scrollTo({
          left:
            cardsRef.current[active].offsetLeft -
            (window.innerWidth * SIDE_SPACE) / 100,
          behavior: 'smooth',
        });
      }

      isUserScrollingRef.current = false;
    };

    track.addEventListener('touchstart', handleTouchStart, { passive: true });
    track.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      track.removeEventListener('touchstart', handleTouchStart);
      track.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, active]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    setCursor({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleCardClick = () => {
    if (isMobile) return;
    setActive(cursor.x > window.innerWidth / 2 ? active + 1 : active - 1);
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Slider */}
      <div
        ref={trackRef}
        onMouseEnter={() => !isMobile && setVisible(true)}
        onMouseLeave={() => !isMobile && setVisible(false)}
        onMouseMove={handleMouseMove}
        onClick={handleCardClick}
        className="flex gap-4 overflow-x-scroll scrollbar-hide"
        style={{
          paddingLeft: `${SIDE_SPACE}vw`,
          paddingRight: `${SIDE_SPACE}vw`,
        }}
      >
        {loopRooms.map((room, i) => (
          <motion.div
            key={i}
            ref={el => {
              if (el) cardsRef.current[i] = el;
            }}
            drag={isMobile ? false : 'x'}
            dragMomentum={!isMobile}
            dragConstraints={{ left: 0, right: 0 }}
            className="shrink-0 cursor-pointer"
            style={{
              width: `${CARD_WIDTH}vw`,
              touchAction: isMobile ? 'pan-x' : 'none',
            }}
          >
            <figure className="relative w-full aspect-video xs:!aspect-[3/4] rounded-xl overflow-hidden">
              <Image
                src={room.images[0]}
                alt={`${room.name} luxury resort room`}
                fill
                priority={i === 0}
                sizes="70vw"
                className="object-cover"
              />
            </figure>
          </motion.div>
        ))}
      </div>

      {/* Title + dots */}
      <div className="mt-8! xs:!mt-4 text-center font-secondary ">
        <span
          className="text-white text-xxl-regular cursor-pointer"
          onClick={() => openWhatsApp(rooms[realIndex].name)}
        >
          {rooms[realIndex].name}
        </span>

        <div className="mt-1.5 flex justify-center gap-2">
          {rooms.map((_, i) => (
            <span
              key={i}
              className={`w-1 h-1 rounded-full ${
                realIndex === i ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Cursor Arrow */}
      {visible && !isMobile && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            top: cursor.y,
            left: cursor.x,
            transform: 'translate(12px, -50%)',
          }}
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow">
            <span className="text-black text-sm">
              {cursor.x > window.innerWidth / 2 ? '→' : '←'}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
