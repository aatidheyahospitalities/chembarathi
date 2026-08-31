'use client';

import { useRef, useLayoutEffect, useEffect, useState } from 'react';

/* The plugins are pulled in dynamically so GSAP never ships to mobile, which
   means they cannot be imported for their types either. These aliases read the
   shapes straight off the modules, so the module-level handles stay typed
   without the import being emitted. */
type Gsap = typeof import('gsap').default;
type ScrollTriggerStatic = typeof import('gsap/ScrollTrigger').ScrollTrigger;
type ScrollSmootherStatic = typeof import('gsap/ScrollSmoother').ScrollSmoother;
type ScrollTriggerInstance = import('gsap/ScrollTrigger').ScrollTrigger;
type ScrollSmootherInstance = import('gsap/ScrollSmoother').ScrollSmoother;

let gsap: Gsap | null = null;
let ScrollTrigger: ScrollTriggerStatic | null = null;
let ScrollSmoother: ScrollSmootherStatic | null = null;

const initGSAP = async () => {
  if (gsap) return;

  const gsapModule = await import('gsap');
  gsap = gsapModule.default;

  const { ScrollTrigger: ST } = await import('gsap/ScrollTrigger');
  const { ScrollSmoother: SS } = await import('gsap/ScrollSmoother');

  ScrollTrigger = ST;
  ScrollSmoother = SS;

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
};

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapper = useRef<HTMLDivElement | null>(null);
  const content = useRef<HTMLDivElement | null>(null);
  const [gsapReady, setGsapReady] = useState(false);

  useEffect(() => {
    /* Below 1024px the site scrolls natively, so GSAP is never fetched and
       this flag stays false — the layout effect below bailed out at the same
       width anyway. */
    if (window.innerWidth < 1024) return;

    let cancelled = false;

    initGSAP().then(() => {
      if (!cancelled) setGsapReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    if (!gsapReady || !gsap || !ScrollTrigger || !ScrollSmoother) return;
    if (!wrapper.current || !content.current) return;

    if (window.innerWidth < 1024) {
      return;
    }

    // Narrowed copies, so the closures below don't re-widen to `| null`.
    const scrollTrigger = ScrollTrigger;
    const scrollSmoother = ScrollSmoother;

    const mm = gsap.matchMedia();
    let smoother: ScrollSmootherInstance | null = null;

    mm.add('(min-width: 1024px)', () => {
      smoother = scrollSmoother.create({
        wrapper: wrapper.current!,
        content: content.current!,
        smooth: 1.5,
        effects: true,
        normalizeScroll: true,
      });
    });

    mm.add('(max-width: 1023px)', () => {
      scrollTrigger.normalizeScroll(false);
    });

    return () => {
      smoother?.kill();
      scrollTrigger.getAll().forEach((t: ScrollTriggerInstance) => t.kill());
      mm.kill();
    };
  }, [gsapReady]);

  return (
    <div ref={wrapper} id="smooth-wrapper">
      <div ref={content} id="smooth-content">
        {children}
      </div>
    </div>
  );
}
