'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ConnectionSectionType } from '@/app/lib/type';

interface FeatureSectionProps {
  sectionData: ConnectionSectionType;
}

function formatCount(value: number) {
  return value.toString().padStart(2, '0');
}

export default function FeatureSection({ sectionData }: FeatureSectionProps) {
  const contentList = useMemo(
    () =>
      sectionData?.description?.contentList?.filter(
        content => content?.trim().length > 0
      ) ?? [],
    [sectionData]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const totalSlides = contentList.length;
  const currentSlide =
    totalSlides > 0 ? contentList[activeIndex] : 'No content available.';
  const counterLabel = `${formatCount(
    Math.min(activeIndex + 1, Math.max(totalSlides, 1))
  )} - ${formatCount(Math.max(totalSlides, 1))}`;

  const goNext = () => {
    if (totalSlides < 2) return;
    setActiveIndex(prev => (prev + 1) % totalSlides);
  };

  const goPrev = () => {
    if (totalSlides < 2) return;
    setActiveIndex(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section className="section-wrapper flex gap-(--spacing-padding-16x) xs:!flex-col xs:!gap-(--spacing-padding-8x)">
      <div className="w-full flex flex-col justify-center gap-(--spacing-padding-16x)">
        <h2 className="text-heading-2 xs:!text-heading-4 text-(--typography-color-secondary-100)">
          {sectionData?.title || ''}
        </h2>

        <div className="flex gap-(--spacing-padding-16x) xs:!flex-col xs:!gap-(--spacing-padding-8x)">
          <span
            className="text-xl-regular text-(--typography-color-secondary-100) whitespace-nowrap inline-block"
            style={{ minWidth: '7ch', fontVariantNumeric: 'tabular-nums' }}
          >
            {counterLabel}
          </span>

          <div className="flex flex-col gap-(--spacing-padding-8x) w-full">
            <p className="text-xl-regular xs:!text-body-lg text-(--typography-color-secondary-800)">
              {currentSlide}
            </p>

            <div className="flex items-center gap-(--spacing-padding-2x) text-xl-regular text-(--typography-color-secondary-700)">
              <button
                type="button"
                onClick={goPrev}
                className="hover:opacity-70 transition cursor-pointer disabled:opacity-40"
                disabled={totalSlides < 2}
              >
                Prev
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={goNext}
                className="hover:opacity-70 transition cursor-pointer disabled:opacity-40"
                disabled={totalSlides < 2}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative rounded-[16px] overflow-hidden w-full max-w-[420px] min-h-[300px] xs:!max-w-full aspect-[4/5]">
        {sectionData?.img?.url ? (
          <Image
            src={sectionData.img.url}
            alt={sectionData?.title || 'Feature image'}
            fill
            className="object-cover"
            quality={100}
          />
        ) : null}
      </div>
    </section>
  );
}
