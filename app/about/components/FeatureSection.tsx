'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ConnectionSectionType } from '@/app/lib/type';

interface FeatureSectionProps {
  sectionData: ConnectionSectionType;
}

function formatCount(value: number) {
  return value.toString().padStart(2, '0');
}

export default function FeatureSection({ sectionData }: FeatureSectionProps) {
  const slides = useMemo(() => {
    return (
      sectionData?.descriptionCollection?.items?.filter(
        item => item?.title?.trim() || item?.description?.trim() || item?.img?.url
      ) ?? []
    );
  }, [sectionData]);

  const rootRef = useRef<HTMLElement | null>(null);
  const headingStageRef = useRef<HTMLDivElement | null>(null);
  const descStageRef = useRef<HTMLDivElement | null>(null);
  const headingARef = useRef<HTMLDivElement | null>(null);
  const headingBRef = useRef<HTMLDivElement | null>(null);
  const descARef = useRef<HTMLDivElement | null>(null);
  const descBRef = useRef<HTMLDivElement | null>(null);
  const imageARef = useRef<HTMLDivElement | null>(null);
  const imageBRef = useRef<HTMLDivElement | null>(null);
  const metaNumRef = useRef<HTMLSpanElement | null>(null);
  const metaTotalRef = useRef<HTMLSpanElement | null>(null);

  const [imgA, setImgA] = useState('');
  const [imgB, setImgB] = useState('');

  const currentRef = useRef(0);
  const busyRef = useRef(false);
  const topSlotRef = useRef<'A' | 'B'>('A');
  const goToRef = useRef<(index: number, direction: 1 | -1) => void>(() => {});

  useEffect(() => {
    if (slides.length === 0) return;
    if (
      !headingStageRef.current ||
      !descStageRef.current ||
      !headingARef.current ||
      !headingBRef.current ||
      !descARef.current ||
      !descBRef.current ||
      !imageARef.current ||
      !imageBRef.current ||
      !metaNumRef.current ||
      !metaTotalRef.current
    ) {
      return;
    }

    const STAGGER = 0.05;
    const DURATION_OUT = 0.4;
    const DURATION_IN = 0.52;

    const headingStage = headingStageRef.current;
    const descStage = descStageRef.current;
    const headingA = headingARef.current;
    const headingB = headingBRef.current;
    const descA = descARef.current;
    const descB = descBRef.current;
    const imageA = imageARef.current;
    const imageB = imageBRef.current;
    const metaNum = metaNumRef.current;
    const metaTotal = metaTotalRef.current;

    const buildSlot = (slot: HTMLDivElement, text: string) => {
      const slotStyle = window.getComputedStyle(slot);
      const proxy = slot.cloneNode(false) as HTMLDivElement;
      proxy.style.cssText = [
        'position:fixed',
        'visibility:hidden',
        'pointer-events:none',
        'top:0',
        'left:0',
        `width:${slot.offsetWidth}px`,
        `font:${slotStyle.font}`,
        `line-height:${slotStyle.lineHeight}`,
        `letter-spacing:${slotStyle.letterSpacing}`,
        `word-spacing:${slotStyle.wordSpacing}`,
        'white-space:normal',
        'z-index:-9999',
      ].join(';');
      document.body.appendChild(proxy);

      const words = text.split(' ');
      words.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = index < words.length - 1 ? `${word} ` : word;
        proxy.appendChild(span);
      });

      const wordSpans = Array.from(proxy.children) as HTMLSpanElement[];
      const lineGroups: HTMLSpanElement[][] = [];

      wordSpans.forEach(span => {
        const top = Math.round(span.getBoundingClientRect().top);
        const lastGroup = lineGroups[lineGroups.length - 1];
        if (lastGroup) {
          const lastTop = Math.round(lastGroup[0].getBoundingClientRect().top);
          if (Math.abs(lastTop - top) < 2) {
            lastGroup.push(span);
            return;
          }
        }
        lineGroups.push([span]);
      });

      document.body.removeChild(proxy);

      slot.innerHTML = '';
      const inners: HTMLSpanElement[] = [];

      lineGroups.forEach(group => {
        const lineText = group.map(word => word.textContent).join('').trimEnd();
        const outer = document.createElement('span');
        outer.style.display = 'block';
        outer.style.overflow = 'hidden';
        outer.style.lineHeight = 'inherit';

        const inner = document.createElement('span');
        inner.style.display = 'block';
        inner.textContent = lineText;

        outer.appendChild(inner);
        slot.appendChild(outer);
        inners.push(inner);
      });

      return inners;
    };

    const goTo = (nextIndex: number, direction: 1 | -1) => {
      if (busyRef.current || nextIndex === currentRef.current) return;
      busyRef.current = true;

      const top = topSlotRef.current;
      const headingOut = top === 'A' ? headingA : headingB;
      const headingIn = top === 'A' ? headingB : headingA;
      const descOut = top === 'A' ? descA : descB;
      const descIn = top === 'A' ? descB : descA;
      const imageOut = top === 'A' ? imageA : imageB;
      const imageIn = top === 'A' ? imageB : imageA;

      const headingOutLines = Array.from(
        headingOut.querySelectorAll('span > span')
      ) as HTMLSpanElement[];
      const descOutLines = Array.from(
        descOut.querySelectorAll('span > span')
      ) as HTMLSpanElement[];

      const headingInLines = buildSlot(headingIn, slides[nextIndex].title || '');
      const descInLines = buildSlot(descIn, slides[nextIndex].description || '');
      gsap.set([...headingInLines, ...descInLines], {
        yPercent: direction > 0 ? 110 : -110,
      });
      gsap.set([headingIn, descIn], { zIndex: 1 });

      if (top === 'A') {
        setImgB(slides[nextIndex].img?.url || '');
      } else {
        setImgA(slides[nextIndex].img?.url || '');
      }

      gsap.set(imageIn, { opacity: 0, scale: 1.04, zIndex: 1 });

      const outLineCount = Math.max(headingOutLines.length, descOutLines.length);
      const outTotal = DURATION_OUT + STAGGER * Math.max(outLineCount - 1, 0);

      const timeline = gsap.timeline({
        onComplete: () => {
          currentRef.current = nextIndex;
          topSlotRef.current = top === 'A' ? 'B' : 'A';

          gsap.set([headingOut, descOut, imageOut], { zIndex: 1 });
          gsap.set([headingIn, descIn, imageIn], { zIndex: 2 });

          busyRef.current = false;
        },
      });

      timeline.to(
        headingOutLines,
        {
          yPercent: direction > 0 ? -110 : 110,
          duration: DURATION_OUT,
          ease: 'power3.in',
          stagger: STAGGER,
        },
        0
      );
      timeline.to(
        descOutLines,
        {
          yPercent: direction > 0 ? -110 : 110,
          duration: DURATION_OUT,
          ease: 'power3.in',
          stagger: STAGGER,
        },
        0
      );
      timeline.to(
        metaNum,
        {
          yPercent: direction > 0 ? -110 : 110,
          duration: DURATION_OUT,
          ease: 'power3.in',
        },
        0
      );
      timeline.add(() => {
        metaNum.textContent = formatCount(nextIndex + 1);
        gsap.set(metaNum, { yPercent: direction > 0 ? 110 : -110 });
      }, outTotal);
      timeline.to(
        metaNum,
        {
          yPercent: 0,
          duration: DURATION_IN,
          ease: 'power3.out',
        },
        outTotal
      );
      timeline.to(
        headingInLines,
        {
          yPercent: 0,
          duration: DURATION_IN,
          ease: 'power3.out',
          stagger: STAGGER,
        },
        outTotal
      );
      timeline.to(
        descInLines,
        {
          yPercent: 0,
          duration: DURATION_IN,
          ease: 'power3.out',
          stagger: STAGGER,
        },
        outTotal
      );
      timeline.to(
        imageOut,
        {
          opacity: 0,
          scale: 0.97,
          duration: 0.5,
          ease: 'power2.inOut',
        },
        0
      );
      timeline.to(
        imageIn,
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
        },
        outTotal
      );
    };

    const initialize = () => {
      currentRef.current = 0;
      busyRef.current = false;
      topSlotRef.current = 'A';
      metaNum.textContent = '01';
      metaTotal.textContent = formatCount(slides.length);

      setImgA(slides[0]?.img?.url || '');
      setImgB(slides[1]?.img?.url || '');

      gsap.set([headingA, descA, imageA], { zIndex: 2 });
      gsap.set([headingB, descB, imageB], { zIndex: 1 });
      gsap.set(imageA, { opacity: 1, scale: 1 });
      gsap.set(imageB, { opacity: 0, scale: 1.04 });

      let maxHeading = 0;
      let maxDesc = 0;
      slides.forEach(item => {
        buildSlot(headingA, item.title || '');
        maxHeading = Math.max(maxHeading, headingA.offsetHeight);

        buildSlot(descA, item.description || '');
        maxDesc = Math.max(maxDesc, descA.offsetHeight);
      });

      headingStage.style.height = `${maxHeading}px`;
      descStage.style.height = `${maxDesc}px`;

      const headingLines = buildSlot(headingA, slides[0]?.title || '');
      const descLines = buildSlot(descA, slides[0]?.description || '');

      gsap.set([...headingLines, ...descLines], { yPercent: 110 });
      gsap.to([...headingLines, ...descLines], {
        yPercent: 0,
        duration: DURATION_IN,
        ease: 'power3.out',
        stagger: STAGGER,
      });
    };

    const context = gsap.context(() => {
      initialize();
    }, rootRef);

    goToRef.current = goTo;

    return () => {
      context.revert();
      goToRef.current = () => {};
    };
  }, [slides]);

  const handleNext = () => {
    if (slides.length < 2) return;
    const nextIndex = (currentRef.current + 1) % slides.length;
    goToRef.current(nextIndex, 1);
  };

  const handlePrev = () => {
    if (slides.length < 2) return;
    const nextIndex = (currentRef.current - 1 + slides.length) % slides.length;
    goToRef.current(nextIndex, -1);
  };

  return (
    <section
      ref={rootRef}
      className="section-wrapper flex  gap-(--spacing-padding-16x) xs:!flex-col-reverse xs:!gap-[20px] FeatureSection"
    >
      <div className="w-full flex flex-col justify-center gap-(--spacing-padding-16x) xs:!gap-[20px]">
        <div ref={headingStageRef} className="relative overflow-hidden">
          <div
            ref={headingARef}
            className="absolute top-0 left-0 w-full text-heading-2 xs:!text-heading-4 text-(--typography-color-secondary-100)"
          />
          <div
            ref={headingBRef}
            className="absolute top-0 left-0 w-full text-heading-2 xs:!text-heading-4 text-(--typography-color-secondary-100)"
          />
        </div>

        <div className="flex gap-(--spacing-padding-16x) xs:!flex-col xs:!gap-(--spacing-padding-8x) xs:!gap-[20px]">
          <div
            className="text-xl-regular text-(--typography-color-secondary-100) whitespace-nowrap inline-flex items-center gap-(--spacing-padding-2x)"
            style={{ minWidth: '7ch', fontVariantNumeric: 'tabular-nums' }}
          >
            <span
              ref={metaNumRef}
              className="inline-flex items-center justify-center overflow-hidden h-[1.2em] w-[2ch] text-center leading-none"
            >
              01
            </span>
            <span>-</span>
            <span ref={metaTotalRef} className="inline-block">
              {formatCount(slides.length || 1)}
            </span>
          </div>

          <div className="flex flex-col gap-(--spacing-padding-8x) w-full xs:!gap-[16px]">
            <div ref={descStageRef} className="relative overflow-hidden min-h-[6.5rem]">
              <div
                ref={descARef}
                className="absolute top-0 left-0 w-full text-xl-regular xs:!text-body-lg text-(--typography-color-secondary-800)"
              />
              <div
                ref={descBRef}
                className="absolute top-0 left-0 w-full text-xl-regular xs:!text-body-lg text-(--typography-color-secondary-800)"
              />
            </div>

            <div className="flex items-center gap-(--spacing-padding-2x) text-xl-regular text-(--typography-color-secondary-700)">
              <button
                type="button"
                onClick={handlePrev}
                className="hover:opacity-70 transition cursor-pointer disabled:opacity-40"
                disabled={slides.length < 2}
              >
                Prev
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={handleNext}
                className="hover:opacity-70 transition cursor-pointer disabled:opacity-40"
                disabled={slides.length < 2}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative rounded-[16px] overflow-hidden w-full max-w-[420px] min-h-[300px] xs:!max-w-full aspect-[4/5]">
        <div
          ref={imageARef}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: imgA ? `url(${imgA})` : 'none' }}
        />
        <div
          ref={imageBRef}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: imgB ? `url(${imgB})` : 'none' }}
        />
      </div>
    </section>
  );
}
