'use server';

import type { BlogPostCardType } from '../lib/type';
import { getBlogPage } from './data';

/**
 * Next page of listing rows for the Load More button. Contentful's delivery
 * token is server-only, so the browser cannot query the API directly — this
 * keeps the fetch on the server and returns just the rows.
 */
export async function loadMorePosts(skip: number): Promise<{
  posts: BlogPostCardType[];
  total: number;
}> {
  return getBlogPage(skip);
}
