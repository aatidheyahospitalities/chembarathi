import Image from 'next/image';
import Link from 'next/link';

import type { BlogPostCardType } from '@/app/lib/type';
import { assetAlt, formatPostDate, toIsoDate } from '../utils';

/**
 * Four most-recent posts other than the one being read, as a card grid.
 * Renders nothing while the archive is too small to fill a meaningful row.
 */
export default function RelatedPosts({
  posts,
}: Readonly<{ posts: BlogPostCardType[] }>) {
  if (!posts.length) return null;

  return (
    <section
      aria-labelledby="related-stories"
      className="section-wrapper flex flex-col gap-(--spacing-padding-10x) border-t! border-(--surface-primary-500)! xs:!gap-(--spacing-padding-6x)"
    >
      <h2
        id="related-stories"
        className="text-heading-4 text-(--typography-color-secondary-100) xs:!text-heading-5"
      >
        More Stories
      </h2>

      <ul className="grid grid-cols-4 gap-(--spacing-padding-8x) md:!grid-cols-2 md:!gap-(--spacing-padding-6x) xs:!grid-cols-1">
        {posts.map(post => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-(--spacing-padding-4x)"
            >
              <div className="relative aspect-[3/2] overflow-hidden rounded-4xl xs:!rounded-[16px]">
                {post.coverImage?.url ? (
                  <Image
                    src={post.coverImage.url}
                    alt={assetAlt(post.coverImage, post.title)}
                    fill
                    sizes="(max-width: 540px) 100vw, (max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="h-full w-full bg-(--surface-primary-700)" />
                )}
              </div>

              <time
                dateTime={toIsoDate(post.date)}
                className="text-md-regular uppercase text-(--typography-color-secondary-500)"
              >
                {formatPostDate(post.date)}
              </time>

              <h3 className="text-xl-regular text-(--typography-color-secondary-100) transition-opacity duration-200 group-hover:opacity-70">
                {post.title}
              </h3>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
