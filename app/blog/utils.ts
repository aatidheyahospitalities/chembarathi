import type { ContentfulAssetType, RichTextType } from '../lib/type';

/** How many rows the listing renders per page, server-side and per Load More. */
export const POSTS_PER_PAGE = 6;

/** Related cards shown at the foot of an article. */
export const RELATED_POST_COUNT = 4;

export const BLOG_BASE_URL = 'https://chembarathi.com/blog';

/**
 * The calendar date the editor actually picked, as `{ y, m, d }`.
 *
 * Contentful returns a date-only field as midnight in the space's own time
 * zone — `2026-08-23T00:00:00.000+05:30` for a post dated 23 August. Passing
 * that through `new Date()` and formatting in UTC rewinds it to the 22nd, so
 * the authored day is read straight off the string instead. Anything with a
 * real time component still goes through `Date`.
 */
function calendarParts(date: string) {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  if (dateOnly) {
    return {
      y: Number(dateOnly[1]),
      m: Number(dateOnly[2]),
      d: Number(dateOnly[3]),
    };
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;

  return {
    y: parsed.getUTCFullYear(),
    m: parsed.getUTCMonth() + 1,
    d: parsed.getUTCDate(),
  };
}

/**
 * `12 August 2026`. Pinned to en-GB and built from a UTC instant so the server
 * render and the client hydration cannot disagree about the day.
 */
export function formatPostDate(date: string): string {
  if (!date) return '';

  const parts = calendarParts(date);
  if (!parts) return '';

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(parts.y, parts.m - 1, parts.d)));
}

/** `2026-08-12`, for `<time dateTime>` and article structured data. */
export function toIsoDate(date: string): string {
  const parts = calendarParts(date);
  if (!parts) return '';

  const pad = (n: number) => String(n).padStart(2, '0');
  return `${parts.y}-${pad(parts.m)}-${pad(parts.d)}`;
}

/**
 * Contentful assets carry their own alt text: the description field when the
 * editor filled it in, otherwise the asset title. Falls back to the post title
 * so an image is never announced as unlabelled.
 */
export function assetAlt(
  asset: ContentfulAssetType | null,
  fallback: string
): string {
  return asset?.description?.trim() || asset?.title?.trim() || fallback;
}

/**
 * Flattens a Rich Text document into a plain sentence for meta descriptions,
 * for posts with no `metadata` entry of their own. Walks the node tree
 * collecting text leaves — the document is small enough that recursion is fine.
 */
export function excerptFromRichText(
  content: RichTextType | null,
  limit = 160
): string {
  if (!content?.json) return '';

  const parts: string[] = [];

  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return;
    const n = node as {
      nodeType?: string;
      value?: string;
      content?: unknown[];
    };

    if (n.nodeType === 'text' && typeof n.value === 'string') {
      parts.push(n.value);
    }
    if (Array.isArray(n.content)) n.content.forEach(walk);
  };

  walk(content.json);

  const plain = parts.join(' ').replace(/\s+/g, ' ').trim();
  if (plain.length <= limit) return plain;

  const clipped = plain.slice(0, limit);
  const lastSpace = clipped.lastIndexOf(' ');

  return `${(lastSpace > 40 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
}
