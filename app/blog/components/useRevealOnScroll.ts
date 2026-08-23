'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Fades and lifts every `[data-reveal]` child of `rootRef` as it enters the
 * viewport. GSAP is imported dynamically and ScrollTrigger is registered inside
 * a `gsap.context`, matching how the policy page does it — that keeps the
 * animation off the initial bundle and makes teardown a single `revert()`.
 *
 * `count` re-runs the effect after Load More appends rows, and elements that
 * have already played are skipped so existing rows do not re-animate.
 */
export function useRevealOnScroll(
  rootRef: RefObject<HTMLElement | null>,
  count: number
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const setup = async () => {
      try {
        const { default: gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        if (disposed || !rootRef.current) return;

        const ctx = gsap.context(() => {
          const targets = gsap.utils.toArray<HTMLElement>(
            '[data-reveal]',
            root
          );

          targets.forEach(target => {
            if (target.dataset.revealed === 'true') return;
            target.dataset.revealed = 'true';

            gsap.fromTo(
              target,
              { opacity: 0, y: 16 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: target,
                  start: 'top bottom-=80',
                  once: true,
                },
              }
            );
          });
        }, root);

        cleanup = () => ctx.revert();
      } catch {
        // GSAP failed to load — rows stay visible, which is the correct
        // fallback since nothing has been hidden in CSS.
        cleanup = undefined;
      }
    };

    void setup();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [rootRef, count]);
}
