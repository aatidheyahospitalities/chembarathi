import Image from 'next/image';
import { ValueSection } from '../type';
import CommonLinkButton from '../../CommonLinkButton';

export function VariantTypeTwo({ field }: { field: ValueSection }) {
  return (
    <div className="section-wrapper flex flex-row gap-(--spacing-padding-16x) xs:!flex-col xs:!gap-(--spacing-padding-8x)">
      {/* Content */}
      <div className="flex flex-col gap-(--spacing-padding-16x) w-[50%] xs:!w-full xs:!gap-(--spacing-padding-6x)">
        <div className="flex flex-col gap-(--spacing-padding-3x)">
          <span className="text-md-regular text-(--typography-color-secondary-500)">
            {field.eyebrow}
          </span>
          <h2 className="text-heading-2 text-(--typography-color-secondary-100) xs:!text-heading-4">
            {field.title}
          </h2>
        </div>

        <div className="flex flex-col gap-(--spacing-padding-10x) text-start xs:!gap-(--spacing-padding-6x)">
          <span className="text-xl-regular text-(--typography-color-secondary-800) xs:!text-body-lg">
            {field.description}
          </span>
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
