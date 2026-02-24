import { CommonSectionType } from '@/app/lib/type';
import { valueSectionComponentMap } from './variants/variants';
import { ValueSection, ValueSectionVariant } from './type';

export default function commonSection({
  commonSectionData,
}: {
  commonSectionData: CommonSectionType;
}) {
  const typeOfSection: ValueSectionVariant =
    (commonSectionData.contentTypeStyle || 'TYPE1') as ValueSectionVariant;

  const content = {
    eyebrow: commonSectionData?.eyebrow || '',
    title: commonSectionData?.title || '',
    description: commonSectionData?.description || '',
    ctaLabel: commonSectionData?.ctaLabel || '',
    image: commonSectionData?.image?.url || '',
    showCtaLabel: commonSectionData?.showCtaLabel || false,
  } as ValueSection;

  const ContentComponent = valueSectionComponentMap[typeOfSection];

  return <ContentComponent field={content} />;
}
