import Image from 'next/image';
import { CommonSectionType } from '../lib/type';
import CommonLinkButton from './CommonLinkButton';

export default async function commonSection({
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
      className={`section-wrapper gap-(--spacing-padding-16x) flex flex-col ${typeOfSection === 'TYPE1' ? '' : 'flex-row'}`}
    >
      <div
        className={`flex gap-(--spacing-padding-16x) ${typeOfSection === 'TYPE1' ? 'w-full' : 'flex-col w-[50%]'}`}
      >
        <div
          className={`flex flex-col gap-(--spacing-padding-3x) w-[50%] ${typeOfSection === 'TYPE1' ? 'w-[50%]' : 'flex-col w-full'}`}
        >
          <span className="text-md-regular text-(--typography-color-secondary-500)">
            {eyebrow}
          </span>
          <h2 className="text-(--typography-color-secondary-100)">{title}</h2>
        </div>
        <div
          className={`flex flex-col gap-(--spacing-padding-10x) w-[50%] text-start ${typeOfSection === 'TYPE1' ? 'w-[50%]' : 'flex-col w-full'}`}
        >
          <span className="text-xl-regular text-(--typography-color-secondary-800)">
            {description}
          </span>
          <CommonLinkButton text={ctaLabel} />
        </div>
      </div>
      <div
        className={` h-[702px] flex relative ${typeOfSection === 'TYPE1' ? 'w-full' : 'w-[50%]'}`}
      >
        <Image
          src={image}
          alt="Common Section Image"
          className="object-cover"
          fill
          loading="eager"
        />
      </div>
    </div>
  );
}
