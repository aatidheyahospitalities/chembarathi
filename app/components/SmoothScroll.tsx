"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapper = useRef<HTMLDivElement | null>(null);
  const content = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!wrapper.current || !content.current) return;

    const mm = gsap.matchMedia();
    let smoother: ScrollSmoother | null = null;

    // Desktop only
    mm.add("(min-width: 1024px)", () => {
      smoother = ScrollSmoother.create({
        wrapper: wrapper.current!,
        content: content.current!,
        smooth: 1.5,
        effects: true,
        normalizeScroll: true,
      });
    });

    // Mobile: native scroll ONLY
    mm.add("(max-width: 1023px)", () => {
      ScrollTrigger.normalizeScroll(false);
    });

    return () => {
      smoother?.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      mm.kill();
    };
  }, []);

  return (
    <div ref={wrapper} id="smooth-wrapper">
      <div ref={content} id="smooth-content">
        {children}
      </div>
    </div>
  );
}
