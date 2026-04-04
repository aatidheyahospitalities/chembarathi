"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";

interface ParallaxImageProps {
  src: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  shift?: number; // parallax strength
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
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    let current = 0;

    const update = () => {
      if (!containerRef.current || !innerRef.current) {
        rafId = requestAnimationFrame(update);
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const progress =
        (windowHeight - rect.top) / (windowHeight + rect.height);

      const clamped = Math.min(1, Math.max(0, progress));
      const target = (clamped - 0.5) * shift;

      // Smooth interpolation (LERP)
      current += (target - current) * 0.08;

      // GPU-accelerated transform
      innerRef.current.style.transform = `translate3d(0, ${current}%, 0)`;

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(rafId);
  }, [shift]);

  const inset = shift / 2;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full ${containerClassName}`}
    >
      <div
        ref={innerRef}
        style={{
          position: "absolute",
          top: `-${inset}%`,
          bottom: `-${inset}%`,
          left: 0,
          right: 0,
          transform: "translate3d(0,0,0)",
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