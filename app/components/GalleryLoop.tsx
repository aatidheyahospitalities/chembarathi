import Image from 'next/image';
import InfiniteLoopWrapper from './InfiniteLoopWrapper';

import img1 from '../lib/img/test.jpg';

interface GalleryLoopProps {
  readonly speed?: number;
}

export default function GalleryLoop({
  speed = 50,
}: Readonly<GalleryLoopProps>) {
  // Gallery items with different aspect ratios
  const galleryItems = [
    {
      id: 'sq-1',
      width: 300,
      height: 300,
      src: img1,
      alt: 'Gallery image 1',
    }, // 1:1 Square
    {
      id: 'pt-1',
      width: 300,
      height: 400,
      src: img1,
      alt: 'Gallery image 2',
    }, // 3:4 Portrait
    {
      id: 'ls-1',
      width: 300,
      height: 169,
      src: img1,
      alt: 'Gallery image 3',
    }, // 16:9 Landscape
    {
      id: 'ls-2',
      width: 300,
      height: 225,
      src: img1,
      alt: 'Gallery image 4',
    }, // 4:3 Landscape
    {
      id: 'sq-2',
      width: 300,
      height: 300,
      src: img1,
      alt: 'Gallery image 5',
    }, // 1:1 Square
    {
      id: 'pt-2',
      width: 300,
      height: 400,
      src: img1,
      alt: 'Gallery image 6',
    }, // 3:4 Portrait
    {
      id: 'ls-3',
      width: 300,
      height: 169,
      src: img1,
      alt: 'Gallery image 7',
    }, // 16:9 Landscape
    {
      id: 'ls-4',
      width: 300,
      height: 225,
      src: img1,
      alt: 'Gallery image 8',
    }, // 4:3 Landscape
  ];

  // Convert gallery items to InfiniteLoopWrapper format
  const items = galleryItems.map(item => ({
    node: (
      <div
        className="relative overflow-hidden rounded-lg shrink-0"
        style={{
          width: `${item.width}px`,
          height: `${item.height}px`,
        }}
      >
        <Image
          src={item.src}
          alt={item.alt}
          fill
          className="object-cover"
          sizes={`${item.width}px`}
        />
      </div>
    ),
  }));

  return (
    <section className="relative w-full py-(--spacing-padding-4x) bg-transparent">
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
