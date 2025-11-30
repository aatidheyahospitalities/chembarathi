import { Document } from "@contentful/rich-text-types";

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
  image: {
    url: string;
  };
}

export interface HomePageType {
  title: string;
  hero: HeroType;
  metadata: MetaDataType;
  aboutus: CommonSectionType;
  theexperiences: CommonSectionType;
}

// Define the structure for the data returned by the Contentful API for page type one

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
