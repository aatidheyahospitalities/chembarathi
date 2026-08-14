'use client';

import { useMemo, useSyncExternalStore } from 'react';

import { galleryConfig } from '@/app/lib/gallery/config';
import type { GalleryImage } from '@/app/lib/gallery/type';
import GalleryItem from './GalleryItem';
import { useLazyObserver } from './useLazyVisibility';

interface MasonryGalleryProps {
  images: GalleryImage[];
  className?: string;
}

interface PackedItem {
  image: GalleryImage;
  /** Position in the original list, used to decide which items load eagerly. */
  index: number;
}

/**
 * Responsive masonry gallery with progressive image loading.
 *
 * Columns are packed in JavaScript rather than with CSS `columns` because the
 * server already knows every image's aspect ratio: a shortest-column-first pass
 * produces balanced columns whose heights are known before a single byte of
 * image data arrives. That keeps the layout completely stable as images load.
 */
export default function MasonryGallery({
  images,
  className = '',
}: MasonryGalleryProps) {
  const columnCount = useColumnCount();
  // The column count doubles as a reset key: it only changes when a responsive
  // breakpoint is crossed, which is also when the scroll container can change.
  const observe = useLazyObserver(galleryConfig.preloadMargin, columnCount);

  const columns = useMemo(
    () => packIntoColumns(images, columnCount),
    [images, columnCount]
  );

  if (images.length === 0) {
    return (
      <p className="text-body-lg text-(--typography-color-secondary-500)">
        No images found in {galleryConfig.sourceDir}. Drop image files into that
        folder and they will appear here automatically.
      </p>
    );
  }

  return (
    <div
      className={`flex w-full items-start gap-(--spacing-padding-4x) xs:!gap-(--spacing-padding-2x) ${className}`}
    >
      {columns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className="flex min-w-0 flex-1 flex-col gap-(--spacing-padding-4x) xs:!gap-(--spacing-padding-2x)"
        >
          {column.map(({ image, index }) => (
            <GalleryItem
              key={image.id}
              image={image}
              sizes={IMAGE_SIZES}
              eager={index < galleryConfig.priorityCount}
              observe={observe}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Greedy shortest-column packing. O(images x columns) with a tiny constant, and
 * it runs only when the list or the column count changes.
 */
function packIntoColumns(
  images: GalleryImage[],
  columnCount: number
): PackedItem[][] {
  const columns: PackedItem[][] = Array.from(
    { length: columnCount },
    () => []
  );
  // Height each column would occupy if every column were one unit wide.
  const heights = new Array<number>(columnCount).fill(0);

  images.forEach((image, index) => {
    let shortest = 0;

    for (let column = 1; column < columnCount; column += 1) {
      if (heights[column] < heights[shortest]) shortest = column;
    }

    columns[shortest].push({ image, index });
    heights[shortest] += 1 / (image.aspectRatio || galleryConfig.fallbackAspectRatio);
  });

  return columns;
}

/**
 * Tells next/image how wide each image renders, so it can pick a sensibly sized
 * source instead of the full-resolution original. Derived from config, so it is
 * constant for the life of the module.
 */
const IMAGE_SIZES = [
  ...galleryConfig.breakpoints.map(
    breakpoint => `${breakpoint.query} ${breakpoint.viewportWidth}`
  ),
  galleryConfig.defaultViewportWidth,
].join(', ');

/* -------------------------------------------------------------------------- */
/* Responsive column count                                                     */
/* -------------------------------------------------------------------------- */

let mediaQueryLists: MediaQueryList[] | null = null;

function getMediaQueryLists(): MediaQueryList[] {
  mediaQueryLists ??= galleryConfig.breakpoints.map(breakpoint =>
    window.matchMedia(breakpoint.query)
  );

  return mediaQueryLists;
}

function subscribeToBreakpoints(onChange: () => void): () => void {
  const lists = getMediaQueryLists();
  lists.forEach(list => list.addEventListener('change', onChange));

  return () => {
    lists.forEach(list => list.removeEventListener('change', onChange));
  };
}

function getColumnCount(): number {
  const lists = getMediaQueryLists();
  const matched = lists.findIndex(list => list.matches);

  return matched === -1
    ? galleryConfig.defaultColumns
    : galleryConfig.breakpoints[matched].columns;
}

function getServerColumnCount(): number {
  return galleryConfig.ssrColumns;
}

/**
 * `useSyncExternalStore` rather than a resize listener: it reads matchMedia
 * synchronously during render, supports a distinct server snapshot without a
 * hydration mismatch, and only re-renders when the breakpoint actually crosses.
 */
function useColumnCount(): number {
  return useSyncExternalStore(
    subscribeToBreakpoints,
    getColumnCount,
    getServerColumnCount
  );
}
