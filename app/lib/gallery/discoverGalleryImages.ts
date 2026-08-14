import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';

import { galleryConfig } from './config';
import { readImageDimensions } from './imageDimensions';
import type { GalleryImage } from './type';

/**
 * Server-side filesystem discovery for the masonry gallery.
 *
 * Scans `galleryConfig.sourceDir` and returns one entry per image file, with
 * intrinsic dimensions read from each file's header so the client can reserve
 * layout space before anything downloads. There is no hardcoded image list:
 * dropping a file into the folder is all that's needed.
 *
 * Node-only — must never be imported from a client component.
 */

const SUPPORTED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
  '.gif',
]);

/** Keeps `open()` handles bounded when the folder holds thousands of files. */
const METADATA_CONCURRENCY = 16;

export const discoverGalleryImages = cache(async (): Promise<GalleryImage[]> => {
  const directory = path.join(process.cwd(), galleryConfig.sourceDir);

  let filenames: string[];

  try {
    filenames = await readdir(directory);
  } catch {
    console.warn(
      `[gallery] Could not read "${galleryConfig.sourceDir}". ` +
        'Create the folder and add images to populate the gallery.'
    );
    return [];
  }

  const candidates = filenames
    .filter(name => SUPPORTED_EXTENSIONS.has(path.extname(name).toLowerCase()))
    // Natural sort so image-2 comes before image-10.
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const images: GalleryImage[] = [];

  for (let start = 0; start < candidates.length; start += METADATA_CONCURRENCY) {
    const batch = candidates.slice(start, start + METADATA_CONCURRENCY);

    const resolved = await Promise.all(
      batch.map(async (filename, offset) => {
        const dimensions = await readImageDimensions(
          path.join(directory, filename)
        );

        // A file we can't measure still gets shown, just at a default ratio.
        const width = dimensions?.width ?? 1200;
        const height =
          dimensions?.height ??
          Math.round(1200 / galleryConfig.fallbackAspectRatio);

        return {
          id: filename,
          src: `${galleryConfig.publicPath}/${encodeURIComponent(filename)}`,
          alt: buildAltText(filename, start + offset),
          width,
          height,
          aspectRatio: width / height,
        } satisfies GalleryImage;
      })
    );

    images.push(...resolved);
  }

  return images;
});

/**
 * Derives readable alt text from a filename:
 *   `mountain-sunset.jpg` -> `Mountain sunset`
 *   `IMG_2043.JPG`        -> `Img 2043`
 *   `7.jpg`               -> `Chembarathi gallery photo 7`
 *
 * Filenames are a weak source of alt text, but a descriptive fallback beats an
 * empty attribute. Swap this out if the images ever move into the CMS.
 */
function buildAltText(filename: string, index: number): string {
  const stem = path.basename(filename, path.extname(filename));

  const words = stem
    .replace(/[-_]+/g, ' ')
    // Split camelCase / PascalCase runs.
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();

  // Purely numeric names (1.jpg, 002.jpg) carry no meaning.
  if (!words || /^\d+$/.test(words)) {
    return `${galleryConfig.altFallbackPrefix} ${words || index + 1}`;
  }

  return words.charAt(0).toUpperCase() + words.slice(1).toLowerCase();
}
