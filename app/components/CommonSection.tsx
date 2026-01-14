import Image from 'next/image';
import { CommonSectionType } from '../lib/type';
import CommonLinkButton from './CommonLinkButton';

export default function commonSection({
  commonSectionData,
  type,
}: {
  commonSectionData: CommonSectionType;
  type: 'TYPE1' | 'TYPE2';
}) {
  const typeOfSection = type || 'TYPE1';
  const title = commonSectionData?.title || '';
  const description = commonSectionData?.description || '';
  const ctaLabel = commonSectionData?.ctaLabel || '';
  const eyebrow = commonSectionData?.eyebrow || '';
  const image = commonSectionData?.image?.url || '';

  return (
    <div
      className={`section-wrapper gap-(--spacing-padding-16x) flex flex-col xs:!flex-col xs:!gap-(--spacing-padding-8x) ${
        typeOfSection === 'TYPE1' ? '' : 'flex-row'
      }`}
    >
      <div
        className={`flex gap-(--spacing-padding-16x) xs:!flex-col xs:!w-full xs:!gap-(--spacing-padding-6x) ${
          typeOfSection === 'TYPE1' ? 'w-full' : 'flex-col w-[50%]'
        }`}
      >
        <div
          className={`flex flex-col gap-(--spacing-padding-3x) w-[50%] xs:!w-full  ${
            typeOfSection === 'TYPE1' ? 'w-[50%]' : 'flex-col w-full'
          }`}
        >
          <span className="text-md-regular text-(--typography-color-secondary-500)">
            {eyebrow}
          </span>
          <h2 className="text-(--typography-color-secondary-100) xs:!text-h4">
            {title}
          </h2>
        </div>
        <div
          className={`flex flex-col gap-(--spacing-padding-10x) w-[50%] text-start xs:!w-full xs:!gap-(--spacing-padding-6x) ${
            typeOfSection === 'TYPE1' ? 'w-[50%]' : 'flex-col w-full'
          }`}
        >
          <span className="text-xl-regular text-(--typography-color-secondary-800) xs:!text-body-lg">
            {description}
          </span>
          <CommonLinkButton text={ctaLabel} />
        </div>
      </div>
      <div
        className={`flex relative  rounded-4xl xs:!rounded-[16px] overflow-hidden xs:!w-full  ${
          typeOfSection === 'TYPE1'
            ? 'w-full aspect-video xs:!aspect-[1/1]'
            : 'w-[50%] aspect-[3/4]'
        }`}
      >
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
