import Image from 'next/image';
import Link from 'next/link';

import type { BlogPostCardType } from '@/app/lib/type';
import ArrowCue from './ArrowCue';
import { assetAlt, formatPostDate, toIsoDate } from '../utils';

/**
 * One listing row, in three columns: date, then title with the read cue
 * beneath it, then the cover image on the right. Stacks image-first at ≤768px.
 * Horizontal padding comes from the `section-wrapper` on the list container.
 *
 * The whole row is one link — `PageTransitionProvider` picks the click up from
 * the anchor and runs the striped wipe, same as every other route on the site.
 *
 * Border utilities carry `!` because `styles/globals.css` imports preflight
 * unlayered, which otherwise resets every `border-*` utility back to 0.
 */
export default function BlogRow({
  post,
  priority = false,
}: Readonly<{ post: BlogPostCardType; priority?: boolean }>) {
  return (
    <article
      data-reveal
      className="border-b! border-(--surface-primary-500)! last:border-b-0!"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group flex items-start gap-(--spacing-padding-10x) py-(--spacing-padding-16x)! lg:!gap-(--spacing-padding-8x) md:!flex-col md:!gap-(--spacing-padding-5x) md:!py-(--spacing-padding-10x) xs:!py-(--spacing-padding-8x)"
      >
        <time
          dateTime={toIsoDate(post.date)}
          className="w-[200px] shrink-0 text-md-regular uppercase text-(--typography-color-secondary-500) lg:!w-[140px] md:!w-auto"
        >
          {formatPostDate(post.date)}
        </time>

        <div className="flex min-w-0 flex-1 flex-col gap-(--spacing-padding-10x) md:!w-full md:!gap-(--spacing-padding-5x)">
          <h2 className="max-w-[20ch] text-heading-4 text-(--typography-color-secondary-100) lg:!max-w-none xs:!text-heading-5">
            {post.title}
          </h2>

          {/* Href-less on purpose — the row itself is the link, so the cue must
              not be a nested anchor or an extra tab stop. */}
          <ArrowCue
            label="Read Story"
            className="max-w-[340px] xs:!max-w-none"
          />
        </div>

        <div className="relative aspect-[3/2] w-[35%] shrink-0 overflow-hidden rounded-4xl md:!order-first md:!w-full xs:!rounded-[16px]">
          {post.coverImage?.url ? (
            <Image
              src={post.coverImage.url}
              alt={assetAlt(post.coverImage, post.title)}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, 35vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="h-full w-full bg-(--surface-primary-700)" />
          )}
        </div>
      </Link>
    </article>
  );
}
