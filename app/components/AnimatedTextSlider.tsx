'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

interface AnimatedTextSliderProps {
  readonly text?: string;
  readonly speed?: number;
  readonly scrollDistance?: string;
}

export default function AnimatedTextSlider({
  text = 'Freelance Developer -',
  speed = 0.1,
  scrollDistance = '-500px',
}: Readonly<AnimatedTextSliderProps>) {
  const firstText = useRef<HTMLParagraphElement>(null);
  const secondText = useRef(null);
  const slider = useRef(null);
  const containerRef = useRef(null);
  const x = useRef(0);
  const direction = useRef(-1);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let animationFrameId: number;
    let textWidth = 0;

    // Get the width of one text element
    if (firstText.current) {
      textWidth = firstText.current.offsetWidth;
    }

    const animate = () => {
      // Reset when we've moved one text width
      if (x.current < -textWidth) {
        x.current = 0;
      } else if (x.current > 0) {
        x.current = -textWidth;
      }
      gsap.set(slider.current, { x: x.current });
      x.current += speed * direction.current;
      animationFrameId = requestAnimationFrame(animate);
    };

    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      scrub: 0.25,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: e => (direction.current = e.direction * -1),
    });

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      scrollTrigger.kill();
    };
  }, [speed, scrollDistance]);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-8 overflow-hidden"
    >
      <div className="relative w-full h-auto">
        <div
          ref={slider}
          className="flex whitespace-nowrap will-change-transform"
        >
          <p
            ref={firstText}
            className="text-display text-(--typography-color-secondary-850) whitespace-nowrap m-0 leading-none pr-16 shrink-0"
          >
            {text}
          </p>
          <p
            ref={secondText}
            className="text-display text-(--typography-color-secondary-850) whitespace-nowrap m-0 leading-none pr-16 shrink-0"
          >
            {text}
          </p>
        </div>
      </div>
    </section>
  );
}
