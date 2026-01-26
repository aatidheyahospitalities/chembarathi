"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type Room = {
  name: string;
  images: string[];
};

const rooms: Room[] = [
  {
    name: "Honeymoon Suite",
    images: ["/HoneymoonSuite.JPG"],
  },
  {
    name: "Premium Cottage",
    images: ["/PremiumCottage.JPG"],
  },
  {
    name: "Deluxe Suite",
    images: ["/PremiumCottage.JPG"],
  },
  {
    name: "Private Pool Room",
    images: ["/PrivatePoolVilla.JPG"],
  },
];

const loopRooms = [
  rooms[rooms.length - 1],
  ...rooms,
  rooms[0],
];

export default function RoomSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [active, setActive] = useState(1);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const CARD_WIDTH = 70;
  const SIDE_SPACE = 15;

  const realIndex =
    active === 0
      ? rooms.length - 1
      : active === loopRooms.length - 1
      ? 0
      : active - 1;

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
      behavior: "smooth",
    });
  }, [active]);

  useEffect(() => {
    if (!trackRef.current) return;

    if (active === 0) {
      setTimeout(() => {
        trackRef.current!.scrollLeft =
          cardsRef.current[rooms.length]?.offsetLeft;
        setActive(rooms.length);
      }, 300);
    }

    if (active === loopRooms.length - 1) {
      setTimeout(() => {
        trackRef.current!.scrollLeft =
          cardsRef.current[1]?.offsetLeft;
        setActive(1);
      }, 300);
    }
  }, [active]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    setCursor({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onMouseMove={handleMouseMove}
      onClick={() =>
        setActive(cursor.x > window.innerWidth / 2 ? active + 1 : active - 1)
      }
      className="relative py-24 overflow-hidden"
    >
      {/* Slider */}
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-scroll scrollbar-hide"
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
            drag="x"
            dragMomentum
            dragConstraints={{ left: 0, right: 0 }}
            className="shrink-0 cursor-pointer"
            style={{ width: `${CARD_WIDTH}vw` }}
          >
            <img
              src={room.images[0]}
              alt={room.name}
              className="w-full h-[65vh] object-cover rounded-xl"
            />
          </motion.div>
        ))}
      </div>

      {/* Title + dots */}
      <div className="mt-8 text-center font-secondary">
        <span className="text-white text-2xl md:text-4xl font-medium">
          {rooms[realIndex].name}
        </span>

        <div className="mt-1.5 flex justify-center gap-2">
          {rooms.map((_, i) => (
            <span
              key={i}
              className={`w-1 h-1 rounded-full ${
                realIndex === i ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Cursor Arrow */}
      {visible && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            top: cursor.y,
            left: cursor.x,
            transform: "translate(12px, -50%)",
          }}
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow">
            <span className="text-black text-sm">
              {cursor.x > window.innerWidth / 2 ? "→" : "←"}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
