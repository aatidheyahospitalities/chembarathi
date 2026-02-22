import { SectionVariant, SectionVariantStyles } from '@/app/lib/type';

export const sectionVariants: Record<SectionVariant, SectionVariantStyles> = {
  TYPE1: {
    wrapper:
      'section-wrapper gap-(--spacing-padding-16x) flex flex-col xs:!flex-col xs:!gap-(--spacing-padding-8x)',
    contentWrapper:
      'flex gap-(--spacing-padding-16x) xs:!flex-col xs:!w-full xs:!gap-(--spacing-padding-6x) w-full',
    titleWrapper: 'flex flex-col gap-(--spacing-padding-3x) w-[50%] xs:!w-full',
    descriptionWrapper:
      'flex flex-col gap-(--spacing-padding-10x) w-[50%] text-start xs:!w-full xs:!gap-(--spacing-padding-6x)',
    imageWrapper:
      'flex relative rounded-4xl xs:!rounded-[16px] overflow-hidden xs:!w-full w-full aspect-video xs:!aspect-[1/1]',
  },
  TYPE2: {
    wrapper:
      'section-wrapper gap-(--spacing-padding-16x) flex flex-col xs:!flex-col xs:!gap-(--spacing-padding-8x) flex-row',
    contentWrapper:
      'flex gap-(--spacing-padding-16x) xs:!flex-col xs:!w-full xs:!gap-(--spacing-padding-6x) flex-col w-[50%]',
    titleWrapper: 'flex flex-col gap-(--spacing-padding-3x) w-full xs:!w-full',
    descriptionWrapper:
      'flex flex-col gap-(--spacing-padding-10x) w-full text-start xs:!w-full xs:!gap-(--spacing-padding-6x)',
    imageWrapper:
      'flex relative rounded-4xl xs:!rounded-[16px] overflow-hidden xs:!w-full w-[50%] aspect-[3/4]',
  },
} as const;
