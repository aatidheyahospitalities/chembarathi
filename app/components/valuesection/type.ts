export type ValueSection = {
  title: string;
  description: string;
  ctaLabel: string;
  eyebrow: string;
  image: string;
  showCtaLabel: boolean;
  ctaUrl: string;
};

export interface ValueSectionWithGalleryType {
  title: string;
  eyebrow: string;
  description: string;
  multipleimgCollection: {
    items: {
      url: string;
    }[];
  };
}

export type ValueSectionVariant = 'TYPE1' | 'TYPE2' | 'TYPE3' | 'TYPE4';
