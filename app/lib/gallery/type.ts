export interface GalleryImage {
  /** Stable React key. Unique even across dev-repeat duplicates. */
  id: string;
  /** Public URL, e.g. `/gallery/masonry/mountain-sunset.jpg`. */
  src: string;
  alt: string;
  width: number;
  height: number;
  /** width / height — used to reserve space before the image loads. */
  aspectRatio: number;
}
