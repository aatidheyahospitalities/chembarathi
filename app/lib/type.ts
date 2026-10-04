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
  policy: policyType;
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

// Blog

export interface ContentfulAssetType {
  url: string;
  /** Contentful asset title; used as alt-text fallback. */
  title: string | null;
  /** Contentful asset description; preferred alt text when present. */
  description: string | null;
  width: number | null;
  height: number | null;
}

/** The fields every listing row, related card, and detail hero needs. */
export interface BlogPostCardType {
  title: string;
  slug: string;
  date: string;
  coverImage: ContentfulAssetType | null;
}

/**
 * A Contentful Rich Text field. `links.assets.block` carries the full asset
 * records for anything embedded in the document — the `json` only holds their
 * ids, so both halves are needed to render an embedded image.
 */
export interface RichTextType {
  json: Document;
  links?: {
    assets?: {
      block?: (ContentfulAssetType & { sys: { id: string } })[];
    };
  };
}

export interface BlogPostType extends BlogPostCardType {
  heading: string | null;
  /** Rich Text, rendered with @contentful/rich-text-react-renderer. */
  content: RichTextType | null;
  /** Optional SEO override; falls back to the post's own title/content.
      Named to match the Contentful field id (`metaData`). */
  metaData: MetaDataType | null;
}

export interface blogPostCardCollection {
  blogPostCollection: {
    total: number;
    items: BlogPostCardType[] | [];
  };
}

export interface blogPostCollection {
  blogPostCollection: {
    items: BlogPostType[] | [];
  };
}

export interface blogSlugCollection {
  blogPostCollection: {
    items: { slug: string }[] | [];
  };
}

/** Related-posts query, which does not select `total`. */
export interface blogRelatedCollection {
  blogPostCollection: {
    items: BlogPostCardType[] | [];
  };
}
