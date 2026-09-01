import { contentfulFetch } from '../API/Contentful/getContent';
import {
  blogListQuery,
  blogPostQuery,
  blogSlugsQuery,
  relatedBlogPostsQuery,
} from '../API/Query/query';
import type {
  BlogPostCardType,
  BlogPostType,
  blogPostCardCollection,
  blogPostCollection,
  blogRelatedCollection,
  blogSlugCollection,
} from '../lib/type';
import { POSTS_PER_PAGE, RELATED_POST_COUNT } from './utils';

/**
 * All blog reads go through here.
 *
 * `contentfulFetch` calls `notFound()` on any non-OK response, which is right
 * for a page but fatal during `generateStaticParams` — a missing content type
 * or a transient Contentful outage would fail the entire site build, not just
 * the blog. These wrappers degrade to empty instead, so the journal renders its
 * own empty state and ISR picks the content up on the next revalidation.
 *
 * The detail page is the deliberate exception: an unknown slug still 404s.
 */
async function tolerant<T>(fetcher: () => Promise<T>, label: string) {
  try {
    return await fetcher();
  } catch (error) {
    console.error(`Blog: ${label} failed.`, error);
    return null;
  }
}

export async function getBlogPage(skip = 0): Promise<{
  posts: BlogPostCardType[];
  total: number;
}> {
  const data = await tolerant<blogPostCardCollection>(
    () => contentfulFetch(blogListQuery(POSTS_PER_PAGE, Math.max(0, skip))),
    'listing query'
  );

  return {
    posts: data?.blogPostCollection?.items ?? [],
    total: data?.blogPostCollection?.total ?? 0,
  };
}

/**
 * The newest posts, for the homepage journal teaser.
 *
 * Deliberately the same `blogListQuery` the archive paginates with — it
 * already orders `date_DESC`, so "latest" is just its first page at a smaller
 * limit. No second source of blog data, and a Contentful outage degrades to an
 * empty list, which the section renders as nothing at all.
 */
export async function getLatestPosts(
  limit: number
): Promise<BlogPostCardType[]> {
  const data = await tolerant<blogPostCardCollection>(
    () => contentfulFetch(blogListQuery(Math.max(1, limit), 0)),
    'latest posts query'
  );

  return data?.blogPostCollection?.items ?? [];
}

export async function getBlogSlugs(): Promise<string[]> {
  const data = await tolerant<blogSlugCollection>(
    () => contentfulFetch(blogSlugsQuery),
    'slugs query'
  );

  return (data?.blogPostCollection?.items ?? [])
    .map(item => item.slug)
    .filter(Boolean);
}

export async function getBlogPost(slug: string): Promise<BlogPostType | null> {
  const data = await tolerant<blogPostCollection>(
    () => contentfulFetch(blogPostQuery(slug)),
    `post query for "${slug}"`
  );

  return data?.blogPostCollection?.items[0] ?? null;
}

export async function getRelatedPosts(
  slug: string
): Promise<BlogPostCardType[]> {
  const data = await tolerant<blogRelatedCollection>(
    () => contentfulFetch(relatedBlogPostsQuery(slug)),
    `related query for "${slug}"`
  );

  return (data?.blogPostCollection?.items ?? []).slice(0, RELATED_POST_COUNT);
}
