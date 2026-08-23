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
