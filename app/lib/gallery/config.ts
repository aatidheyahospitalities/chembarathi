/**
 * Single place to tune the masonry gallery.
 *
 * Shared by the server-side discovery code and the client gallery components,
 * so it deliberately contains no browser- or node-only imports.
 */
export const galleryConfig = {
  /**
   * Folder scanned for images, relative to the project root.
   * Everything dropped in here is picked up automatically — see
   * `discoverGalleryImages.ts`.
   */
  sourceDir: 'public/gallery/masonry',

  /** Public URL prefix that `sourceDir` is served from. */
  publicPath: '/gallery/masonry',

  /**
   * TEMPORARY: repeats the discovered images N times so the gallery can be
   * tested with a realistic item count while only a handful of real photos
   * exist. Set to 1 to show every real image exactly once.
   *
   * Only read by `devRepeat.ts`; deleting that file and its single call site
   * in `app/gallery/page.tsx` removes the feature entirely.
   */
  devRepeatCount: 1,

  /**
   * How far outside the viewport an item starts loading. Roughly half a
   * screen on a laptop — enough lead time to finish decoding before the item
   * scrolls in, without pulling in the whole page.
   */
  preloadMargin: '400px',

  /**
   * Items rendered eagerly (with `priority`) instead of waiting for the
   * IntersectionObserver. The packing algorithm fills columns left to right,
   * so the first N items are the top row — the genuinely above-the-fold ones.
   * Everything else stays lazy.
   */
  priorityCount: 4,

  /**
   * Responsive column counts. Ordered most-specific first and expressed as
   * max-width queries to match the project's desktop-first breakpoints in
   * `tailwind.config.js`.
   */
  breakpoints: [
    { query: '(max-width: 640px)', columns: 2, viewportWidth: '50vw' },
    { query: '(max-width: 1024px)', columns: 3, viewportWidth: '33vw' },
    { query: '(max-width: 1536px)', columns: 4, viewportWidth: '25vw' },
  ],

  /** Column count above the widest breakpoint. */
  defaultColumns: 5,
  /** Viewport width share above the widest breakpoint, for `next/image` sizes. */
  defaultViewportWidth: '20vw',

  /**
   * Column count used for the server-rendered markup. The real count is
   * resolved on the client via matchMedia; this only decides what the initial
   * HTML looks like.
   */
  ssrColumns: 4,

  /** Aspect ratio used when an image's dimensions can't be read. */
  fallbackAspectRatio: 3 / 4,

  /** Used to build alt text for images whose filename carries no meaning. */
  altFallbackPrefix: 'Chembarathi gallery photo',
} as const;
