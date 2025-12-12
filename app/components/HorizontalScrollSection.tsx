'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const scrollContent = scrollRef.current;
    if (!container || !scrollContent) return;

    // Get the total scrollable width
    const totalWidth = scrollContent.scrollWidth - window.innerWidth;

    // Create the horizontal scroll animation
    gsap.to(scrollContent, {
      x: -totalWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${totalWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: () => {
          // Prevent any height/padding interference
          container.style.paddingBottom = '0px';
        },
      },
    });

    return () => ScrollTrigger.killAll();
  }, []);

  // Sample content cards with DIFFERENT sizes to test flexibility
  const cards = [
    {
      id: 1,
      title: 'Small',
      width: 'w-64',
      height: 'h-64',
      color: 'hsl(0, 70%, 60%)',
    },
    {
      id: 2,
      title: 'Medium',
      width: 'w-80',
      height: 'h-80',
      color: 'hsl(36, 70%, 60%)',
    },
    {
      id: 3,
      title: 'Large',
      width: 'w-96',
      height: 'h-96',
      color: 'hsl(72, 70%, 60%)',
    },
    {
      id: 4,
      title: 'Tall',
      width: 'w-72',
      height: 'h-[500px]',
      color: 'hsl(108, 70%, 60%)',
    },
    {
      id: 5,
      title: 'Wide',
      width: 'w-[500px]',
      height: 'h-72',
      color: 'hsl(144, 70%, 60%)',
    },
    {
      id: 6,
      title: 'Tiny',
      width: 'w-48',
      height: 'h-48',
      color: 'hsl(180, 70%, 60%)',
    },
    {
      id: 7,
      title: 'Square',
      width: 'w-80',
      height: 'h-80',
      color: 'hsl(216, 70%, 60%)',
    },
    {
      id: 8,
      title: 'Extra Wide',
      width: 'w-[600px]',
      height: 'h-64',
      color: 'hsl(252, 70%, 60%)',
    },
    {
      id: 9,
      title: 'Extra Tall',
      width: 'w-64',
      height: 'h-[600px]',
      color: 'hsl(288, 70%, 60%)',
    },
    {
      id: 10,
      title: 'Huge',
      width: 'w-[700px]',
      height: 'h-[700px]',
      color: 'hsl(324, 70%, 60%)',
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ height: 'fit-content' }}
    >
      <div
        ref={scrollRef}
        className="flex items-center h-screen gap-8 px-8 py-12 w-max"
      >
        {cards.map(card => (
          <div
            key={card.id}
            className={`shrink-0 ${card.width} ${card.height} rounded-2xl shadow-2xl flex flex-col items-center justify-center text-white transition-transform duration-300 hover:scale-105`}
            style={{ backgroundColor: card.color }}
          >
            <div className="mb-4 text-4xl font-bold">{card.title}</div>
            <div className="text-sm opacity-75">Keep scrolling →</div>
          </div>
        ))}
      </div>
    </div>
  );
}
