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
  contentTypeStyle: string;
  showCtaLabel: boolean;
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

export interface policyType {
  policyblockCollection: {
    items: {
      heading: string;
      name: string;
      content: string;
    }[];
  };
}

export interface ConnectionSectionType {
  descriptionCollection: {
    items: {
      title: string;
      description: string;
      img: {
        url: string;
      };
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

export interface AboutPageType {
  ecosystem: CommonSectionType;
  connection: ConnectionSectionType;
  awwwards: CommonSectionType;
  faq: FaqItemType;
}

export interface PolicyPageType {
   policy:policyType
}

// Collection Interfaces

export interface pagetypeoneCollection {
  pagetypeoneCollection: {
    items: HomePageType[] | [];
  };
}

export interface pagetypetwoCollection {
  pageTypeTwoCollection: {
    items: AboutPageType[] | [];
  };
}

export interface policyCollection {
  policypageCollection: {
    items: PolicyPageType[] | [];
  }
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
