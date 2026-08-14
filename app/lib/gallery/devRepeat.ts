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
