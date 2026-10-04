import { galleryConfig } from './config';
import type { GalleryImage } from './type';

/**
 * TEMPORARY development helper.
 *
 * Repeats the discovered images `galleryConfig.devRepeatCount` times so the
 * masonry layout, lazy loading and scroll performance can be exercised with a
 * realistic item count while only a handful of real photos exist.
 *
 * Set `devRepeatCount` to 1 to show every real image exactly once, or delete
 * this file and its single call site in `app/gallery/page.tsx` to remove the
 * feature. Nothing else in the gallery depends on it — real images added to
 * the folder flow through either way.
 */
export function applyDevRepeat(images: GalleryImage[]): GalleryImage[] {
  // Hard stop outside development. Without it the name is a lie: the helper
  // ran in production builds too, so a count left at 20 for local testing
  // shipped a gallery of twenty duplicates of every photo. `/gallery` is
  // `force-static`, so the decision is made during `next build`, where
  // NODE_ENV is already 'production'.
  if (process.env.NODE_ENV === 'production') return images;

  const passes = Math.max(1, Math.floor(galleryConfig.devRepeatCount));

  if (passes === 1 || images.length === 0) return images;

  const repeated: GalleryImage[] = [];

  for (let pass = 0; pass < passes; pass += 1) {
    for (const image of images) {
      repeated.push(
        // Duplicates need distinct keys; the first pass keeps the real id.
        pass === 0 ? image : { ...image, id: `${image.id}--repeat-${pass}` }
      );
    }
  }

  return repeated;
}
