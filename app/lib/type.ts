import { Document } from "@contentful/rich-text-types";

export interface HeroData {
  fields?: {
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
