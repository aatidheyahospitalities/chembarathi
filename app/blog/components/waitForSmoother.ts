import type { ScrollSmoother as ScrollSmootherClass } from 'gsap/ScrollSmoother';

type Smoother = InstanceType<typeof ScrollSmootherClass>;

/**
 * Resolves the page's `ScrollSmoother` once `SmoothScroll` has built it, or
 * `null` when there will never be one.
 *
 * `SmoothScroll` creates the smoother asynchronously — it dynamically imports
 * GSAP, flips a state flag, and only calls `ScrollSmoother.create()` on the
 * commit after that — so anything mounting alongside it wins the race and
 * sees nothing. That matters beyond just reading the instance: a ScrollTrigger
 * created before the smoother exists configures itself for native scrolling
 * and then silently misbehaves once the page turns out to be transform-driven.
 *
 * Below 1024px `SmoothScroll` deliberately creates no smoother, so this
 * returns immediately rather than burning the timeout.
 */
export async function waitForSmoother(
  timeoutMs = 5000
): Promise<Smoother | null> {
  if (window.innerWidth < 1024) return null;

  const { ScrollSmoother } = await import('gsap/ScrollSmoother');
  const deadline = Date.now() + timeoutMs;

  return new Promise<Smoother | null>(resolve => {
    const tick = () => {
      const found = ScrollSmoother.get();
      if (found || Date.now() > deadline) {
        resolve(found ?? null);
        return;
      }
      window.setTimeout(tick, 100);
    };

    tick();
  });
}
