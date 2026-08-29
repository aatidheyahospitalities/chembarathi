'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

import { waitForSmoother } from './waitForSmoother';

/**
 * The full-bleed hero, with a parallax crop.
 *
 * The picture is rendered taller than its frame and drifts through that slack
 * as the page scrolls, so the crop shifts without an edge ever showing.
 *
 * The motion is a ScrollSmoother effect, which `SmoothScroll` only creates at
 * ≥1024px — below that there is nothing to hook into and the image simply sits
 * still, which is the right fallback on a phone anyway. The effect is
 * registered here rather than left to the smoother's `effects: true` scan:
 * that scan runs once, when the smoother is created in the root layout, and a
 * client-side route change into this page happens long after.
 */
export default function ArticleHero({
  src,
  alt,
}: Readonly<{ src: string; alt: string }>) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const setup = async () => {
      try {
        const smoother = await waitForSmoother();
        if (!smoother || disposed || !ref.current) return;

        // `speed: 'auto'` lets ScrollSmoother size the drift to the slack we
        // gave the image, so it can never expose the frame.
        const effects = smoother.effects(ref.current, { speed: 'auto' });
        cleanup = () => effects.forEach(effect => effect.kill());
      } catch {
        // GSAP failed to load — the image stays put, which is exactly the
        // pre-parallax rendering, so there is nothing to undo.
        cleanup = undefined;
      }
    };

    void setup();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div className="relative aspect-[16/7] w-full overflow-hidden md:!aspect-[3/2] xs:!aspect-[4/5]">
      {/* Taller than the frame and pulled up by half the excess, so the
          starting crop is centred and there is room to travel both ways. */}
      <div ref={ref} className="absolute inset-x-0 -top-[10%] h-[120%]">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
