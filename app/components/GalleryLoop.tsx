'use client';

import Image from 'next/image';
import InfiniteLoopWrapper from './InfiniteLoopWrapper';

/* Ratios are assigned by position rather than picked at random. A random pick
   cannot run during render without the server and the client disagreeing, so
   it had to happen in an effect — which meant the strip rendered nothing at
   all until after mount. Fixed shapes keep the staggered look and let the
   images render with the rest of the page. */
const galleryImages = [
  { src: '/gallery/scroll-section/1.jpg', ratio: 'aspect-square' },
  { src: '/gallery/scroll-section/2.jpg', ratio: 'aspect-[3/4]' },
  { src: '/gallery/scroll-section/3.jpg', ratio: 'aspect-[3/4]' },
  { src: '/gallery/scroll-section/4.jpg', ratio: 'aspect-square' },
  { src: '/gallery/scroll-section/5.jpg', ratio: 'aspect-[3/4]' },
  { src: '/gallery/scroll-section/6.jpg', ratio: 'aspect-square' },
];

const items = galleryImages.map((img, i) => ({
  node: (
    <div
      key={i}
      className={`relative w-[300px] ${img.ratio} shrink-0 overflow-hidden rounded-lg`}
    >
      <Image src={img.src} alt="" fill className="object-cover" />
    </div>
  ),
}));

export default function GalleryLoop({ speed = 50 }) {
  return (
    <section className="relative w-full py-(--spacing-padding-16x)!">
      <InfiniteLoopWrapper
        items={items}
        speed={speed}
        gap={24}
        pauseOnHover
        alignItems="start"
        ariaLabel="Gallery images"
      />
    </section>
  );
}
