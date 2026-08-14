import type { Metadata } from 'next';

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

export default async function GalleryPage() {
  const images = await discoverGalleryImages();

  // TEMPORARY: pads the gallery out for testing. See devRepeat.ts.
  const items = applyDevRepeat(images);

  return (
    <main className="section-wrapper pt-20!">
      <header className="flex flex-col gap-(--spacing-padding-3x) pb-(--spacing-padding-10x)">
        <span className="text-md-regular text-(--typography-color-secondary-500)">
          Gallery
        </span>
        <h1 className="text-heading-2 text-(--typography-color-secondary-100) xs:!text-heading-4">
          Moments at Chembarathi
        </h1>
      </header>

      <MasonryGallery images={items} />
    </main>
  );
}
