import Image from 'next/image';
import { ValueSection } from '../type';
import CommonLinkButton from '../../CommonLinkButton';

export function VariantTypeFour({ field }: { field: ValueSection }) {
  const descriptionCards = field.description
    ?.split(/(?=\s-\s)/g)
    .map(item => item.replace(/^\s*-\s*/, '').trim())
    .filter(Boolean);
  return (
    <div className="section-wrapper flex flex-row-reverse gap-(--spacing-padding-16x) xs:!flex-col-reverse xs:!gap-(--spacing-padding-5x) ValueSectionTypeFour">
      {/* Content */}
      <div className="flex flex-col py-(--spacing-padding-16x)! xs:!py-none gap-[32px] w-[50%] xs:!w-full xs:!gap-[12px] justify-center">
        <div className="flex flex-col gap-(--spacing-padding-3x) xs:!gap-[12px]">
          <span className="text-md-regular text-(--typography-color-secondary-500)">
            {field.eyebrow}
          </span>
          <h2 className="text-heading-2 text-(--typography-color-secondary-100) xs:!text-heading-4">
            {field.title}
          </h2>
        </div>

        <div className="flex flex-col gap-(--spacing-padding-10x) text-start xs:!gap-(--spacing-padding-8x)">
          <div className="flex gap-[32px] xs:!gap-(--spacing-padding-6x) xs:!flex-col">
            {descriptionCards.map((text, index) => (
              <span
                className="text-lg-regular text-(--typography-color-secondary-800) xs:!text-body-lg"
                key={index}
              >
                {text}
              </span>
            ))}
          </div>
          {field.showCtaLabel && (
            <CommonLinkButton text={field.ctaLabel} url={field.ctaUrl} />
          )}
        </div>
      </div>

      {/* Image */}
      <div className="flex relative rounded-4xl overflow-hidden w-[50%] aspect-[3/4] xs:!w-full xs:!rounded-[16px]">
        <Image
          src={field.image}
          alt="Common Section Image"
          className="object-cover"
          fill
          loading="eager"
          quality={100}
        />
      </div>
    </div>
  );
}
