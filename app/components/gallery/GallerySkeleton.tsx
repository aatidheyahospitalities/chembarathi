import { memo } from 'react';

interface GallerySkeletonProps {
  /**
   * Only items that have actually started loading shimmer. A gallery of a
   * thousand items would otherwise run a thousand concurrent CSS animations,
   * most of them far off-screen.
   */
  active: boolean;
}

/**
 * Fills the item box while its image is pending. The surrounding figure already
 * carries the same base colour, so this can unmount the moment the image is
 * opaque without any flash.
 */
function GallerySkeletonBase({ active }: GallerySkeletonProps) {
  return (
    <div
      aria-hidden
      className={`absolute inset-0 bg-white/[0.04] ${
        active ? 'gallery-shimmer' : ''
      }`}
    />
  );
}

export default memo(GallerySkeletonBase);
