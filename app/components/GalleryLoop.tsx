"use client";

import Image from "next/image";
import InfiniteLoopWrapper from "./InfiniteLoopWrapper";

interface GalleryLoopProps {
  readonly speed?: number;
}

const galleryImages = [
  "/gallery/scroll-section/1.jpg",
  "/gallery/scroll-section/2.jpg",
  "/gallery/scroll-section/3.jpg",
  "/gallery/scroll-section/4.jpg",
  "/gallery/scroll-section/5.jpg",
  "/gallery/scroll-section/6.jpg",
];

// Aspect ratio classes
const ratios = [
  "aspect-[16/9]",
  "aspect-square",
  "aspect-[3/4]",
];

// Pick random ratio ONCE
const imagesWithRatio = galleryImages.map(src => ({
  src,
  ratio: ratios[Math.floor(Math.random() * ratios.length)],
}));

export default function GalleryLoop({ speed = 50 }: GalleryLoopProps) {
  const items = imagesWithRatio.map((img, i) => ({
    node: (
      <div
        key={i}
        className={`relative w-[300px] ${img.ratio} shrink-0 overflow-hidden rounded-lg`}
      >
        <Image
          src={img.src}
          alt={`Gallery image ${i + 1}`}
          fill
          className="object-cover"
          sizes="300px"
        />
      </div>
    ),
  }));

  return (
    <section className="relative w-full py-(--spacing-padding-4x)">
      <InfiniteLoopWrapper
        items={items}
        speed={speed}
        gap={24}
        pauseOnHover
        alignItems="start"
        ariaLabel="Gallery images"
      />
    </section>
  );
}
