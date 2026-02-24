
"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

interface ParallaxImageProps {
  src: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  shift?: number; // how much parallax movement (default: 20)
  quality?: number;
}

export default function ParallaxImage({
  src,
  alt = "image",
  className = "",
  containerClassName = "",
  shift = 20,
  quality = 100,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
      const clamped = Math.min(1, Math.max(0, progress));
      setOffset((clamped - 0.5) * shift);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [shift]);

  const inset = shift / 2;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full ${containerClassName}`}
    >
      <div
        style={{
          position: "absolute",
          top: `-${inset}%`,
          bottom: `-${inset}%`,
          left: 0,
          right: 0,
          transform: `translateY(${offset}%)`,
          transition: "transform 0.08s linear",
          willChange: "transform",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          loading="eager"
          quality={quality}
          className={`object-cover ${className}`}
        />
      </div>
    </div>
  );
}