'use client';

import Image from 'next/image';
import { experienceHero } from '../content';

/**
 * Full-bleed page hero. Mirrors the homepage Banner treatment (min-h-screen,
 * dark overlay, centred stack, pill CTA) but takes its content from
 * content.ts instead of Contentful.
 */
export default function ExperienceHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Image
        src={experienceHero.image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex flex-col items-center text-center gap-(--spacing-padding-4x) px-4 max-w-3xl">
        <span className="text-md-regular text-(--typography-color-secondary-300)">
          {experienceHero.eyebrow}
        </span>

        <h1 className="text-heading-1 text-(--typography-color-secondary-100) xs:!text-heading-3">
          {experienceHero.title}
        </h1>

        <p className="text-body-lg font-secondary! text-white/90">
          {experienceHero.description}
        </p>

        <button
          className="px-(--spacing-padding-10x)! text-lg-regular! text-secondary-1000! py-(--spacing-padding-3x)! rounded-full! bg-(--typography-color-secondary-100)! font-secondary! hover:cursor-pointer"
          onClick={() =>
            window.open(
              'https://bookingengine.stayflexi.com/?hotel_id=28009',
              '_blank'
            )
          }
        >
          Book Your Stay
        </button>
      </div>
    </section>
  );
}
