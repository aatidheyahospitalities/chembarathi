import Image from 'next/image';
import { CommonSectionType, SectionVariant } from '../lib/type';
import CommonLinkButton from './CommonLinkButton';
import { sectionVariants } from './const/variants';

export default function CommonSection({
  commonSectionData,
}: {
  commonSectionData: CommonSectionType;
}) {
  const type: SectionVariant = (commonSectionData.contentTypeStyle ||
    'TYPE1') as SectionVariant;

  const variant = sectionVariants[type];

  const title = commonSectionData?.title || '';
  const description = commonSectionData?.description || '';
  const ctaLabel = commonSectionData?.ctaLabel || '';
  const eyebrow = commonSectionData?.eyebrow || '';
  const image = commonSectionData?.image?.url || '';

  return (
    <div className={variant.wrapper}>
      <div className={variant.contentWrapper}>
        <div className={variant.titleWrapper}>
          <span className="text-md-regular text-(--typography-color-secondary-500)">
            {eyebrow}
          </span>

          <h2 className="text-heading-2 text-(--typography-color-secondary-100) xs:!text-heading-4">
            {title}
          </h2>
        </div>

        <div className={variant.descriptionWrapper}>
          <span className="text-xl-regular text-(--typography-color-secondary-800) xs:!text-body-lg">
            {description}
          </span>

          <CommonLinkButton text={ctaLabel} />
        </div>
      </div>

      <div className={variant.imageWrapper}>
        <Image
          src={image}
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
