import Image from 'next/image';
import { ExperienceItemType } from '../content';

/**
 * One numbered experience block. Alternates image/text sides on desktop and
 * stacks image-first at ≤768px. Horizontal padding comes from the
 * `section-wrapper` on the list container, so this component only owns its
 * own two columns.
 */
export default function ExperiencePanel({
  item,
  index,
}: Readonly<{ item: ExperienceItemType; index: number }>) {
  const reversed = index % 2 === 1;

  return (
    <article
      className={`flex items-center gap-(--spacing-padding-16x) md:!flex-col md:!gap-(--spacing-padding-6x) ${
        reversed ? 'flex-row-reverse' : ''
      }`}
    >
      {/* 16:9 rather than a fixed height: the column is a percentage of the
          viewport, so a pinned height let the crop drift wider on large
          screens and taller on small ones. */}
      <div className="relative w-[50%] aspect-video rounded-4xl overflow-hidden md:!w-full xs:!rounded-[16px]">
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-(--spacing-padding-4x) w-[50%] md:!w-full">
        <span className="text-md-regular uppercase text-(--typography-color-secondary-500)">
          {item.tag}
        </span>

        <h2 className="text-heading-3 text-(--typography-color-secondary-100) xs:!text-heading-4">
          {item.title}
        </h2>

        <p className="text-xl-regular text-(--typography-color-secondary-800) xs:!text-body-lg">
          {item.description}
        </p>
      </div>
    </article>
  );
}
