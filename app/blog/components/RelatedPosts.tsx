import type { BlogPostCardType } from '@/app/lib/type';
import BlogRow from './BlogRow';
import RevealOnScroll from './RevealOnScroll';

/**
 * The most-recent posts other than the one being read.
 *
 * Uses the same `BlogRow` as the listing rather than a card grid, so an
 * article ends in the shape the archive is already read in. Sits on a lifted
 * panel (`--surface-primary-700` against the page's `--surface-primary-800`)
 * so the seam does the separating and no extra rule is needed.
 *
 * Renders nothing while the archive is too small to fill a meaningful list.
 */
export default function RelatedPosts({
  posts,
}: Readonly<{ posts: BlogPostCardType[] }>) {
  if (!posts.length) return null;

  return (
    <section
      aria-labelledby="more-stories"
      className="bg-(--surface-primary-700)"
    >
      <div className="section-wrapper flex flex-col gap-(--spacing-padding-16x) xs:!gap-(--spacing-padding-8x)">
        {/* Indented to start on `BlogRow`'s title column — its date column is
            200px (140px at ≤1024px) plus the row gap. Keep in step with
            `BlogRow` if either changes. The margin needs `!` for the same
            reason the border utilities do: preflight is imported unlayered, so
            its `* { margin: 0 }` outranks any layered spacing utility. */}
        <h2
          id="more-stories"
          className="ml-[240px]! text-heading-3 text-(--typography-color-secondary-100) lg:!ml-[172px] lg:!text-heading-4 md:!ml-0 xs:!text-heading-5"
        >
          More Stories
        </h2>

        {/* Wrapped so the rows fade and lift on scroll the way the listing's
            do — `BlogRow` emits `[data-reveal]`, but only a client component
            can mount the hook that animates it. */}
        <RevealOnScroll
          count={posts.length}
          className="flex flex-col border-t! border-(--surface-primary-500)!"
        >
          {posts.map(post => (
            <BlogRow key={post.slug} post={post} />
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
