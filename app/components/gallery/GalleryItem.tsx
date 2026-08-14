'use client';

import Image from 'next/image';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

import type { GalleryImage } from '@/app/lib/gallery/type';
import GallerySkeleton from './GallerySkeleton';
import type { ObserveFn } from './useLazyVisibility';

type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

interface GalleryItemProps {
  image: GalleryImage;
  /** `sizes` for next/image, derived once by the gallery from the column count. */
  sizes: string;
  /** Above-the-fold items skip the observer and load immediately. */
  eager: boolean;
  observe: ObserveFn;
}

/**
 * A single masonry cell.
 *
 * Owns its own load state so that one image finishing has no effect on any
 * other item — combined with `memo`, a gallery of a thousand items re-renders
 * exactly one component per image load.
 */
function GalleryItemBase({ image, sizes, eager, observe }: GalleryItemProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<LoadStatus>(eager ? 'loading' : 'idle');

  // Register with the shared observer until this item enters the preload zone.
  useEffect(() => {
    if (eager) return;

    const frame = frameRef.current;
    if (!frame) return;

    return observe(frame, () =>
      setStatus(current => (current === 'idle' ? 'loading' : current))
    );
  }, [eager, observe]);

  // A cached image can finish decoding before React attaches its onLoad
  // handler, which would otherwise leave the skeleton up forever. Checking
  // `complete` as the element is attached closes that gap.
  const attachImage = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth > 0) setStatus('loaded');
  }, []);

  const showImage = status === 'loading' || status === 'loaded';

  return (
    <figure
      ref={frameRef}
      // The base colour matches the skeleton, so removing the skeleton mid-fade
      // never shows the page background through the image.
      className="gallery-item relative w-full overflow-hidden rounded-2xl bg-white/[0.04] xs:!rounded-xl"
      style={{ aspectRatio: image.aspectRatio }}
    >
      {status !== 'loaded' && status !== 'error' && (
        <GallerySkeleton active={status === 'loading'} />
      )}

      {showImage && (
        <Image
          ref={attachImage}
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          // Only the handful of above-the-fold items get priority; everything
          // else stays lazy so scrolling drives the requests.
          priority={eager}
          loading={eager ? undefined : 'lazy'}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`object-cover transition-opacity duration-500 ease-out ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {status === 'error' && (
        <div
          role="img"
          aria-label={`${image.alt} — unable to load`}
          className="absolute inset-0 flex items-center justify-center px-4 text-center"
        >
          <span className="text-body-xs text-(--typography-color-secondary-500)">
            Unable to load image
          </span>
        </div>
      )}
    </figure>
  );
}

export default memo(GalleryItemBase);
