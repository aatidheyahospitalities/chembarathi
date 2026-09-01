import type { BlogPostCardType } from '@/app/lib/type';
import BlogRow from '@/app/blog/components/BlogRow';
import RevealOnScroll from '@/app/blog/components/RevealOnScroll';
import CommonLinkButton from './CommonLinkButton';
import SectionHeading from './SectionHeading';

/**
 * The latest few journal posts, teased on the homepage.
 *
 * Renders the archive's own `BlogRow` rather than a bespoke card, so a post
 * looks identical here and on `/blog` and there is exactly one place to change
 * a row. Content comes from `getLatestPosts`, which reuses the listing query —
 * no second copy of the blog data.
 *
 * Returns nothing when there are no posts, so an empty archive (or a
 * Contentful outage, which `data.ts` degrades to an empty list) leaves the
 * homepage as it was rather than showing a hollow heading.
 */
export default function HomeBlogSection({
  posts,
}: Readonly<{ posts: BlogPostCardType[] }>) {
  if (!posts.length) return null;

  return (
    <div className="section-wrapper flex flex-col gap-(--spacing-padding-16x) xs:!gap-(--spacing-padding-8x)">
      <SectionHeading
        eyebrow="Journal"
        title="Stories From The Hills"
        description="Notes on slow mornings, monsoon light, and the people and produce of Wayanad — written from the estate, at the pace the place keeps."
      />

      {/* `BlogRow` emits `[data-reveal]` but is server-rendered; this client
          wrapper supplies the ref and effect that fade and lift the rows, the
          same treatment they get on the listing and under an article. */}
      <RevealOnScroll
        count={posts.length}
        className="flex flex-col border-t! border-(--surface-primary-500)!"
      >
        {posts.map(post => (
          <BlogRow key={post.slug} post={post} />
        ))}
      </RevealOnScroll>

      <CommonLinkButton text="Read The Journal" url="/blog" />
    </div>
  );
}
