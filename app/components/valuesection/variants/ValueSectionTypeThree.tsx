import { ValueSection } from '../type';
import CommonLinkButton from '../../CommonLinkButton';
import ParallaxImage from '../../ParallaxImage';

export function VariantTypeThree({ field }: { field: ValueSection }) {
  return (
    <div className="flex flex-col">
      <div className="flex section-wrapper xs:!pb-(--spacing-padding-8x) xs:!pt-(--spacing-padding-4x) gap-[96px]! xs:!flex-col xs:!gap-[12px] valueSectionTypeThree">
        {/* Title Block */}
        <div className="flex flex-col gap-(--spacing-padding-3x)">
          <span className="text-md-regular text-(--typography-color-secondary-500) text-nowrap">
            {field.eyebrow}
          </span>
        </div>
        {/* Description Block */}
        <div className="flex flex-col gap-[48px] text-start  xs:!gap-(--spacing-padding-5x)">
          <h2 className="text-heading-4 xs:!text-heading-6 text-(--typography-color-secondary-100) font-secondary! ">
            {field.title}
          </h2>
          <span className="text-xl-regular xs:!text-lg-regular text-(--typography-color-secondary-800) w-[40%] xs:!w-full">
            {field.description}
          </span>
          {field.showCtaLabel && (
            <CommonLinkButton text={field.ctaLabel} url={field.ctaUrl} />
          )}
        </div>
      </div>

      {/* Image */}
      <div className="flex relative overflow-hidden w-full aspect-video xs:!aspect-[1/1] xs:!rounded-[16px] xs:!px-(--spacing-padding-4x) xs:!pb-(--spacing-padding-4x) xs:!overflow-hidden">
        <ParallaxImage src={field.image} shift={20} />
      </div>
    </div>
  );
}
