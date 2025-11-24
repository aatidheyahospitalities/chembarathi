import { Document } from "@contentful/rich-text-types";

export interface HeroData {
  fields: {
    heroTitle?: string;
    heroDescription?: Document;
    heroImage?: {
      fields?: {
        file?: {
          url?: string;
        };
      };
    };
  };
}

export interface MetaData {
  fields: {
    metaDataTitle?: string;
    metaDataDescription?: string;
  };
  
}

export interface commonSectionData {
  fields: {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaUrl: string;
    image: {
      fields?: {
        file?: {
          url?: string;
        };
      };
    };
  };
}
