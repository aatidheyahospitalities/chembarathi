import type { Metadata } from 'next';

/**
 * Site-wide SEO and social-sharing values, and the helper that builds a page's
 * `Metadata` from them.
 *
 * Every page used to export a bare `{ title, description }`, so a shared link
 * carried no image, no site name and no canonical URL. Worse, `metadataBase`
 * was unset, which makes Next resolve a relative OG image against `localhost`
 * during build — the card then breaks everywhere it is unfurled. Both are
 * fixed here rather than repeated per page.
 */

export const SITE_URL = 'https://chembarathi.com';
export const SITE_NAME = 'Chembarathi Wayanad';

/** 1200x630, the size Facebook, LinkedIn, WhatsApp and X all crop from. */
export const OG_IMAGE = {
  url: '/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'The infinity pool at Chembarathi Wayanad, looking out over the forested hills at dusk',
};

type BuildMetadataInput = {
  title: string;
  description: string;
  /** Path with a leading slash, e.g. `/gallery`. Omit for the homepage. */
  path?: string;
  /** Absolute URL of a page-specific image, e.g. a blog post's cover. */
  image?: string | null;
  imageAlt?: string;
};

/**
 * A page's full metadata: title, description, canonical URL, Open Graph and
 * Twitter cards, all consistent with each other.
 *
 * `title` and `description` are used verbatim for the OG and Twitter fields,
 * so a page can never present one thing to Google and another to WhatsApp.
 */
export function buildMetadata({
  title,
  description,
  path = '',
  image,
  imageAlt,
}: BuildMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;

  const images = image
    ? [{ url: image, alt: imageAlt || title }]
    : [{ ...OG_IMAGE, alt: imageAlt || OG_IMAGE.alt }];

  return {
    /* `absolute` so the root layout's title template cannot wrap this. Page
       titles here — and the ones editors write in Contentful — already carry
       the brand, so templating produced "Journal | Chembarathi Wayanad |
       Chembarathi Wayanad". */
    title: { absolute: title },
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: SITE_NAME,
      url,
      title,
      description,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  };
}
