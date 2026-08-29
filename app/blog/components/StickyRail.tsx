'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { waitForSmoother } from './waitForSmoother';

/** Clears the 88px fixed header, with a little air beneath it. */
const PIN_OFFSET = 120;

/**
 * Pins the article rail while the body scrolls past, releasing it when the
 * column ends.
 *
 * This is a GSAP pin rather than `position: sticky` because above 1024px
 * `SmoothScroll` drives the page with a `ScrollSmoother`, which translates
 * `#smooth-content` instead of scrolling it — sticky has no scroll container
 * to stick to there and simply drifts. ScrollTrigger understands the smoother
 * and pins correctly either way, so one mechanism covers both the smoothed
 * desktop and the natively-scrolled tablet band.
 *
 * Below 769px the layout is a single stacked column, where pinning the rail
 * over the body would be wrong, so the effect is scoped above that.
 *
 * The outer div keeps the grid placement and the inner one is what gets
 * pinned: GSAP wraps a pinned element in its own spacer, which would otherwise
 * become the grid child and drop the column placement.
 */
export default function StickyRail({
  className,
  children,
}: Readonly<{ className?: string; children: ReactNode }>) {
  const inner = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const setup = async () => {
      try {
        const { default: gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        // Must not build the trigger until the smoother exists, or it pins
        // against native scrolling on a page that is transform-driven and the
        // rail just scrolls away. See `waitForSmoother`.
        await waitForSmoother();

        const el = inner.current;
        if (disposed || !el) return;

        // The row the rail belongs to; the pin releases when its bottom
        // arrives, so the rail never outlives the article beside it.
        const row = el.closest<HTMLElement>('[data-article-row]');
        if (!row) return;

        const mm = gsap.matchMedia();

        mm.add('(min-width: 769px)', () => {
          const trigger = ScrollTrigger.create({
            trigger: el,
            start: `top ${PIN_OFFSET}px`,
            endTrigger: row,
            // Stop once the row's bottom reaches where the rail's own bottom
            // sits, which is the point native sticky would let go.
            end: () => `bottom ${PIN_OFFSET + el.offsetHeight}px`,
            pin: el,
            pinSpacing: false,
            invalidateOnRefresh: true,
          });

          return () => trigger.kill();
        });

        // The hero loads after this runs and changes every offset below it.
        ScrollTrigger.refresh();

        cleanup = () => mm.kill();
      } catch {
        // GSAP failed to load — the rail stays in flow, which is the correct
        // fallback since nothing has been moved.
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
    <div className={className}>
      <div ref={inner}>{children}</div>
    </div>
  );
}
