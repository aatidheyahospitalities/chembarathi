/**
 * Subscribes to the page's scroll position, in pixels from the top.
 *
 * Above 1024px `ScrollSmoother` owns scrolling with `normalizeScroll`, and the
 * native window `scroll` event then fires only a handful of times across an
 * entire gesture — measured at twice for a 200px scroll, and not at all as the
 * smoother eases the last few pixels back to the top. That is far too coarse to
 * read a direction from, so where a smoother exists we sample its position on
 * GSAP's ticker instead, which runs every frame.
 *
 * The upgrade waits for `#smooth-wrapper` to actually be `position: fixed`,
 * which only `ScrollSmoother` sets — the stylesheet gives it `overflow` but
 * never that. Keying off the DOM rather than off `window.innerWidth` keeps GSAP
 * off mobile by construction (no smoother is ever created there, so the branch
 * is never taken) and avoids trusting a width that reads 0 in a background tab.
 *
 * Starts on the native event either way, so callers get a usable position from
 * the first frame.
 *
 * Returns an unsubscribe function.
 */
export function onScrollPosition(
  callback: (scrollY: number) => void
): () => void {
  let disposed = false;
  let stopTicker: (() => void) | null = null;

  // The ticker runs on idle frames too; only report genuine movement so
  // subscribers aren't woken sixty times a second by a stationary page.
  let lastReported = -1;
  const report = (scrollY: number) => {
    if (scrollY === lastReported) return;
    lastReported = scrollY;
    callback(scrollY);
  };

  const nativeHandler = () => report(window.scrollY);
  window.addEventListener('scroll', nativeHandler, { passive: true });
  nativeHandler();

  const smootherIsRunning = () => {
    const wrapper = document.getElementById('smooth-wrapper');
    return !!wrapper && getComputedStyle(wrapper).position === 'fixed';
  };

  const upgrade = async () => {
    try {
      const [{ default: gsap }, { ScrollSmoother }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollSmoother'),
      ]);

      if (disposed) return;

      // Falls back to `window.scrollY` by itself if the smoother is torn down
      // later — a resize below 1024px kills it.
      const sample = () =>
        report(ScrollSmoother.get()?.scrollTop() ?? window.scrollY);

      gsap.ticker.add(sample);
      stopTicker = () => gsap.ticker.remove(sample);

      window.removeEventListener('scroll', nativeHandler);
    } catch {
      // GSAP failed to load; the native listener stays as the fallback.
    }
  };

  // The smoother is created in a layout effect after its own dynamic import, so
  // it rarely exists on the first tick. Give it a bounded window to appear.
  let attempts = 0;
  const poll = window.setInterval(() => {
    if (disposed || attempts > 40) {
      window.clearInterval(poll);
      return;
    }

    attempts += 1;

    if (smootherIsRunning()) {
      window.clearInterval(poll);
      void upgrade();
    }
  }, 100);

  return () => {
    disposed = true;
    window.clearInterval(poll);
    window.removeEventListener('scroll', nativeHandler);
    stopTicker?.();
  };
}

export async function scrollToTop(instant = true): Promise<void> {
  try {
    const { ScrollSmoother } = await import('gsap/ScrollSmoother');
    const smoother = ScrollSmoother.get();

    if (smoother) {
      // ScrollSmoother's second argument is `smooth` — the inverse of ours.
      smoother.scrollTo(0, !instant);
      return;
    }
  } catch {
    // Fall through to native scrolling.
  }

  // `auto` defers to the CSS `scroll-behavior`, which globals.css sets to
  // `smooth`; only `instant` guarantees a jump.
  window.scrollTo({ top: 0, behavior: instant ? 'instant' : 'smooth' });
}

export async function scrollToElement(
  element: HTMLElement,
  instant = false,
  offset = 'top 140px'
): Promise<void> {
  try {
    const { ScrollSmoother } = await import('gsap/ScrollSmoother');
    const smoother = ScrollSmoother.get();

    if (smoother) {
      smoother.scrollTo(element, !instant, offset);
      return;
    }
  } catch {
    // Fall through to native scrolling.
  }

  element.scrollIntoView({
    behavior: instant ? 'instant' : 'smooth',
    block: 'start',
  });
}
