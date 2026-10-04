'use client';

import { useRef, useState, useTransition } from 'react';

import type { BlogPostCardType } from '@/app/lib/type';
import { loadMorePosts } from '../actions';
import BlogRow from './BlogRow';
import { useRevealOnScroll } from './useRevealOnScroll';

/**
 * Holds the listing rows. The first page arrives already rendered from the
 * server component; Load More appends the next page through a server action,
 * so the Contentful token never reaches the browser.
 */
export default function BlogList({
  initialPosts,
  total,
}: Readonly<{ initialPosts: BlogPostCardType[]; total: number }>) {
  const [posts, setPosts] = useState(initialPosts);
  const [error, setError] = useState(false);
  const [isPending, startTransition] = useTransition();

  const listRef = useRef<HTMLDivElement | null>(null);
  useRevealOnScroll(listRef, posts.length);

  const hasMore = posts.length < total;

  const handleLoadMore = () => {
    setError(false);

    startTransition(async () => {
      try {
        const next = await loadMorePosts(posts.length);

        setPosts(current => {
          // Guard against a post being published between pages, which would
          // otherwise shift the window and duplicate a row.
          const seen = new Set(current.map(post => post.slug));
          return [
            ...current,
            ...next.posts.filter(post => !seen.has(post.slug)),
          ];
        });
      } catch {
        setError(true);
      }
    });
  };

  if (!posts.length) {
    return (
      <p className="text-xl-regular text-(--typography-color-secondary-800)">
        New stories are on their way. Please check back soon.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-(--spacing-padding-16x) xs:!gap-(--spacing-padding-10x)">
      <div ref={listRef} className="flex flex-col">
        {posts.map((post, index) => (
          <BlogRow key={post.slug} post={post} priority={index === 0} />
        ))}
      </div>

      {hasMore && (
        <div className="flex flex-col items-center gap-(--spacing-padding-3x)">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isPending}
            className="rounded-full! border! border-(--border-color-default)! px-(--spacing-padding-10x)! py-(--spacing-padding-3x)! text-lg-regular! text-(--typography-color-secondary-100)! transition-opacity duration-200 hover:cursor-pointer hover:opacity-70 disabled:cursor-wait disabled:opacity-50 xs:!w-full"
          >
            {isPending ? 'Loading…' : 'Load More Stories'}
          </button>

          {error && (
            <p
              role="status"
              className="text-md-regular text-(--typography-color-secondary-500)"
            >
              Something went wrong. Please try again.
            </p>
          )}
        </div>
      )}

      {/* Announces appended rows to screen readers, which otherwise get no
          signal that the page grew. */}
      <p aria-live="polite" className="sr-only">
        {`Showing ${posts.length} of ${total} stories.`}
      </p>
    </div>
  );
}
