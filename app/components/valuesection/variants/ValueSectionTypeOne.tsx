import Image from 'next/image';
import { ValueSection } from '../type';
import CommonLinkButton from '../../CommonLinkButton';

export function VariantTypeOne({ field }: { field: ValueSection }) {
  return (
    <div className="section-wrapper flex flex-col gap-(--spacing-padding-16x) xs:!flex-col xs:!gap-(--spacing-padding-8x)">
      <div className="flex gap-(--spacing-padding-16x) w-full xs:!flex-col xs:!w-full xs:!gap-(--spacing-padding-6x)">
        {/* Title Block */}
        <div className="flex flex-col gap-(--spacing-padding-3x) w-[50%] xs:!w-full">
          <span className="text-md-regular text-(--typography-color-secondary-500)">
            {field.eyebrow}
          </span>
          <h2 className="text-heading-2 text-(--typography-color-secondary-100) xs:!text-heading-4">
            {field.title}
          </h2>
        </div>

        {/* Description Block */}
        <div className="flex flex-col gap-(--spacing-padding-10x) w-[50%] text-start xs:!w-full xs:!gap-(--spacing-padding-6x)">
          <span className="text-xl-regular text-(--typography-color-secondary-800) xs:!text-body-lg">
            {field.description}
          </span>
          {field.showCtaLabel && (
            <CommonLinkButton text={field.ctaLabel} url={field.ctaUrl} />
          )}
        </div>
      </div>

      {/* Image */}
      <div className="flex relative rounded-4xl overflow-hidden w-full aspect-video xs:!aspect-[1/1] xs:!rounded-[16px]">
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
