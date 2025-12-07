import { Document } from '@contentful/rich-text-types';

export interface HeroType {
  title: string;
  slug: string;
  image: {
    url: string;
  };
  description: {
    json: Document; // Rich Text JSON from @contentful/rich-text-types
  };
}

export interface MetaDataType {
  title: string;
  description: string;
}

export interface CommonSectionType {
  title: string;
  eyebrow: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  image: { url: string };
}

export interface ContentSectionWithGalleryType {
  title: string;
  eyebrow: string;
  description: string;
  multipleimgCollection: {
    items: {
      url: string;
    }[];
  };
}

export interface FaqItemType {
  faqItemCollection: {
    items: {
      answer: string;
      question: string;
    }[];
  };
}

// Page Type Interfaces
export interface HomePageType {
  title: string;
  hero: HeroType;
  metadata: MetaDataType;
  aboutus: CommonSectionType;
  theexperiences: CommonSectionType;
  experienceTheBeauty: ContentSectionWithGalleryType;
  faq: FaqItemType;
}

// Collection Interfaces

export interface pagetypeoneCollection {
  pagetypeoneCollection: {
    items: HomePageType[] | [];
  };
}

export interface metadataCollection {
  metadataCollection: {
    items: MetaDataType[] | [];
  };
}

export interface contentSectionWithGalleryCollection {
  contentSectionWithGalleryCollection: {
    items: ContentSectionWithGalleryType[] | [];
  };
}
