"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import InfiniteLoopWrapper from "./InfiniteLoopWrapper";

const galleryImages = [
  "/gallery/scroll-section/1.jpg",
  "/gallery/scroll-section/2.jpg",
  "/gallery/scroll-section/3.jpg",
  "/gallery/scroll-section/4.jpg",
  "/gallery/scroll-section/5.jpg",
  "/gallery/scroll-section/6.jpg",
];

// REMOVED aspect-video (16:9)
const ratios = ["aspect-square", "aspect-[3/4]"];

export default function GalleryLoop({ speed = 50 }) {
  const [imagesWithRatio, setImagesWithRatio] = useState<
    { src: string; ratio: string }[]
  >([]);

  useEffect(() => {
    setImagesWithRatio(
      galleryImages.map((src) => ({
        src,
        ratio: ratios[Math.floor(Math.random() * ratios.length)],
      }))
    );
  }, []);

  if (!imagesWithRatio.length) return null;

  const items = imagesWithRatio.map((img, i) => ({
    node: (
      <div
        key={i}
        className={`relative w-[300px] ${img.ratio} shrink-0 overflow-hidden rounded-lg`}
      >
        <Image src={img.src} alt="" fill className="object-cover" />
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
