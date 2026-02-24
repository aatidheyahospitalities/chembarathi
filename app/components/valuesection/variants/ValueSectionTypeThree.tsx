import Image from 'next/image';
import { ValueSection } from '../type';
import CommonLinkButton from '../../CommonLinkButton';

export function VariantTypeThree({ field }: { field: ValueSection }) {
  return (
    <div className=" flex flex-col">
      <div className="flex p-(--spacing-padding-huge-x)! gap-[96px]!">
        {/* Title Block */}
        <div className="flex flex-col gap-(--spacing-padding-3x">
          <span className="text-md-regular text-(--typography-color-secondary-500) text-nowrap">
            {field.eyebrow}
          </span>
        </div>
        {/* Description Block */}
        <div className="flex flex-col gap-[48px] text-start">
          <h2 className="text-heading-4 text-(--typography-color-secondary-100) font-secondary! ">
            {field.title}
          </h2>
          <span className="text-xl-regular text-(--typography-color-secondary-800) w-[40%]">
            {field.description}
          </span>
          {field.showCtaLabel && <CommonLinkButton text={field.ctaLabel} />}
        </div>
      </div>

      {/* Image */}
      <div className="flex relative  overflow-hidden w-full aspect-video xs:!aspect-[1/1]">
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
