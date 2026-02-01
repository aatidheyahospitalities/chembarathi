"use client";

import { useRef, useLayoutEffect, useEffect, useState } from "react";

let gsap: any = null;
let ScrollTrigger: any = null;
let ScrollSmoother: any = null;

const initGSAP = async () => {
  if (gsap) return;
  
  const gsapModule = await import("gsap");
  gsap = gsapModule.default;
  
  const { ScrollTrigger: ST } = await import("gsap/ScrollTrigger");
  const { ScrollSmoother: SS } = await import("gsap/ScrollSmoother");
  
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
  const [isReady, setIsReady] = useState(false);

  // Only load GSAP on desktop and when component mounts
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      initGSAP().then(() => setIsReady(true));
    } else {
      setIsReady(true);
    }
  }, []);

  useLayoutEffect(() => {
    if (!isReady || !gsap || !wrapper.current || !content.current) return;
    
    if (window.innerWidth < 1024) {
      return;
    }

    const mm = gsap.matchMedia();
    let smoother: any = null;

    mm.add("(min-width: 1024px)", () => {
      smoother = ScrollSmoother.create({
        wrapper: wrapper.current!,
        content: content.current!,
        smooth: 1.5,
        effects: true,
        normalizeScroll: true,
      });
    });

    mm.add("(max-width: 1023px)", () => {
      ScrollTrigger?.normalizeScroll(false);
    });

    return () => {
      smoother?.kill();
      ScrollTrigger?.getAll().forEach((t: any) => t.kill());
      mm.kill();
    };
  }, [isReady]);

  return (
    <div ref={wrapper} id="smooth-wrapper">
      <div ref={content} id="smooth-content">
        {children}
      </div>
    </div>
  );
}
