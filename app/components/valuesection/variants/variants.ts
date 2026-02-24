import { ValueSection, ValueSectionVariant } from '../type';
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
};
