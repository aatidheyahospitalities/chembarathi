import { ValueSection, ValueSectionVariant } from '../type';
import { VariantTypeFour } from './ValueSectionTypeFour';
import { VariantTypeOne } from './ValueSectionTypeOne';
import { VariantTypeThree } from './ValueSectionTypeThree';
import { VariantTypeTwo } from './ValueSectionTypeTwo';

export const valueSectionComponentMap: Record<
  ValueSectionVariant,
  React.ComponentType<{ field: ValueSection }>
> = {
  TYPE1: VariantTypeOne,
  TYPE2: VariantTypeTwo,
  TYPE3: VariantTypeThree,
  TYPE4: VariantTypeFour,
};
