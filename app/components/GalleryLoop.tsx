'use client';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

import img1 from '../lib/img/test.jpg';

interface GalleryLoopProps {
  readonly speed?: number;
}

export default function GalleryLoop({ speed = 1 }: Readonly<GalleryLoopProps>) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const x = useRef(0);

  // Gallery items with different aspect ratios
  // Replace the src paths with your actual image paths from the repo
  const galleryItems = [
    {
      id: 'sq-1',
      width: 300,
      height: 300,
      src: img1,
      alt: 'Gallery image 1',
    }, // 1:1 Square
    {
      id: 'pt-1',
      width: 300,
      height: 400,
      src: img1,
      alt: 'Gallery image 2',
    }, // 3:4 Portrait
    {
      id: 'ls-1',
      width: 300,
      height: 169,
      src: img1,
      alt: 'Gallery image 3',
    }, // 16:9 Landscape
    {
      id: 'ls-2',
      width: 300,
      height: 225,
      src: img1,
      alt: 'Gallery image 4',
    }, // 4:3 Landscape
    {
      id: 'sq-2',
      width: 300,
      height: 300,
      src: img1,
      alt: 'Gallery image 5',
    }, // 1:1 Square
    {
      id: 'pt-2',
      width: 300,
      height: 400,
      src: img1,
      alt: 'Gallery image 6',
    }, // 3:4 Portrait
    {
      id: 'ls-3',
      width: 300,
      height: 169,
      src: img1,
      alt: 'Gallery image 7',
    }, // 16:9 Landscape
    {
      id: 'ls-4',
      width: 300,
      height: 225,
      src: img1,
      alt: 'Gallery image 8',
    }, // 4:3 Landscape
  ];

  useEffect(() => {
    let animationFrameId: number;
    let setWidth = 0;

    // Calculate total width of one complete set INCLUDING the gap after it
    if (sliderRef.current) {
      const firstSet = sliderRef.current.firstElementChild as HTMLElement;
      const secondSet = sliderRef.current.children[1] as HTMLElement;

      if (firstSet && secondSet) {
        // Calculate the distance from the start of first set to start of second set
        // This includes all items + gaps within the set + gap between sets
        const firstSetRect = firstSet.getBoundingClientRect();
        const secondSetRect = secondSet.getBoundingClientRect();
        setWidth = secondSetRect.left - firstSetRect.left;
      }
    }

    const animate = () => {
      // Reset when we've moved exactly one set width (including its trailing gap)
      if (x.current <= -setWidth) {
        x.current = 0;
      }

      if (sliderRef.current) {
        gsap.set(sliderRef.current, { x: x.current });
      }

      x.current -= speed;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed]);

  return (
    <section className="relative w-full py-(--spacing-padding-4x) overflow-hidden bg-transparent">
      <div className="relative w-full h-auto">
        <div
          ref={sliderRef}
          className="flex gap-6 whitespace-nowrap will-change-transform"
        >
          {/* First set of items */}
          <div className="flex gap-6 shrink-0">
            {galleryItems.map(item => (
              <div
                key={`set1-${item.id}`}
                className="relative overflow-hidden rounded-lg shrink-0"
                style={{
                  width: `${item.width}px`,
                  height: `${item.height}px`,
                }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover "
                  sizes={`${item.width}px`}
                />
              </div>
            ))}
          </div>

          {/* Second set (duplicate for seamless loop) */}
          <div className="flex gap-6 shrink-0">
            {galleryItems.map(item => (
              <div
                key={`set2-${item.id}`}
                className="relative overflow-hidden rounded-lg shrink-0"
                style={{
                  width: `${item.width}px`,
                  height: `${item.height}px`,
                }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover "
                  sizes={`${item.width}px`}
                />
              </div>
            ))}
          </div>

          {/* Third set (extra buffer for smooth reset) */}
          <div className="flex gap-6 shrink-0">
            {galleryItems.map(item => (
              <div
                key={`set3-${item.id}`}
                className="relative overflow-hidden rounded-lg shrink-0"
                style={{
                  width: `${item.width}px`,
                  height: `${item.height}px`,
                }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover "
                  sizes={`${item.width}px`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
