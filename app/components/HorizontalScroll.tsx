'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollGSAPProps {
  children: React.ReactNode;
}

export default function HorizontalScrollGSAP({
  children,
}: Readonly<HorizontalScrollGSAPProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const scrollContent = scrollRef.current;

    if (!container || !scrollContent) return;

    // Calculate the horizontal scroll distance
    const getScrollAmount = () => {
      const scrollWidth = scrollContent.scrollWidth;
      const containerWidth = container.offsetWidth;
      return -(scrollWidth - containerWidth);
    };

    // Create the horizontal scroll animation
    const tween = gsap.to(scrollContent, {
      x: getScrollAmount,
      duration: 3,
      ease: 'none',
    });

    // Create ScrollTrigger for the horizontal scroll
    ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      animation: tween,
      scrub: 1,
      pin: '.sticky',
      anticipatePin: 1,
      invalidateOnRefresh: true,
      refreshPriority: -1,
    });

    // Refresh ScrollTrigger on resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ height: '300vh' }}
    >
      <div className="sticky top-0 flex items-center h-screen overflow-hidden">
        <div
          ref={scrollRef}
          className="flex items-center gap-12"
          style={{
            willChange: 'transform',
            paddingLeft: '96px',
            paddingRight: '96px',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
