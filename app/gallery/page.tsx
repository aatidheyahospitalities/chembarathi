import type { Metadata } from 'next';

import SectionHeading from '../components/SectionHeading';
import MasonryGallery from '../components/gallery/MasonryGallery';
import { applyDevRepeat } from '../lib/gallery/devRepeat';
import { discoverGalleryImages } from '../lib/gallery/discoverGalleryImages';

/**
 * Rendered once at build time. The image list comes from the filesystem, which
 * is available during the build but not necessarily inside the deployed
 * serverless function, so this page must not be re-rendered at request time.
 * Adding images therefore takes a rebuild (or just a dev-server refresh).
 */
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Gallery | Chembarathi Wayanad',
  description:
    'A visual tour of Chembarathi Wayanad — our suites, cottages, and the forest that surrounds them.',
};

const GALLERY_EYEBROW = 'Gallery';
const GALLERY_TITLE = 'Moments at Chembarathi';

/**
 * Deliberately worded differently from `metadata.description` above: a meta
 * description and an on-page intro are read by different audiences, and
 * repeating one in the other wastes the only prose this page has. Between them
 * they cover the terms the page should rank for — private pool villas, forest
 * cottages, Wayanad, Kerala — without either reading like a keyword list.
 */
const GALLERY_DESCRIPTION =
  'A closer look at the estate — private pool villas and forest cottages, ' +
  'misted mornings over the Wayanad hills, and the unhurried evenings in ' +
  'between. Every photograph was taken here in Kerala, on the grounds at ' +
  'Chembarathi, exactly as you will find it.';

export default async function GalleryPage() {
  const images = await discoverGalleryImages();

  // TEMPORARY: pads the gallery out for testing. See devRepeat.ts.
  const items = applyDevRepeat(images);

  return (
    // `pt-20` belongs on the outer element, not on the `section-wrapper`: put
    // on the wrapper it overrides its `padding-block` and leaves less clearance
    // than the fixed header is tall. Same arrangement as the blog listing.
    <main className="pt-20!">
      <div className="section-wrapper">
        <SectionHeading
          as="h1"
          eyebrow={GALLERY_EYEBROW}
          title={GALLERY_TITLE}
          description={GALLERY_DESCRIPTION}
          className="pb-(--spacing-padding-16x)! xs:!pb-(--spacing-padding-10x)"
        />

        <MasonryGallery images={items} />
      </div>
    </main>
  );
}
