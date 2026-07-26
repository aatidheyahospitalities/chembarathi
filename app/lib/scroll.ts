export async function scrollToTop(instant = true): Promise<void> {
  try {
    const { ScrollSmoother } = await import('gsap/ScrollSmoother');
    const smoother = ScrollSmoother.get();

    if (smoother) {
      smoother.scrollTo(0, instant);
      return;
    }
  } catch {
    // Fall through to native scrolling.
  }

  window.scrollTo({ top: 0, behavior: instant ? 'auto' : 'smooth' });
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
    behavior: instant ? 'auto' : 'smooth',
    block: 'start',
  });
}
