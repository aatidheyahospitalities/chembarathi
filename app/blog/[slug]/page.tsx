import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getBlogPost, getBlogSlugs, getRelatedPosts } from '../data';
import ArticleAside from '../components/ArticleAside';
import ArticleBody from '../components/ArticleBody';
import ArticleCta from '../components/ArticleCta';
import ArticleHero from '../components/ArticleHero';
import ArticleMasthead from '../components/ArticleMasthead';
import RelatedPosts from '../components/RelatedPosts';
import StickyRail from '../components/StickyRail';
import {
  assetAlt,
  BLOG_BASE_URL,
  excerptFromRichText,
  toIsoDate,
} from '../utils';

export const revalidate = 600;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) return { title: 'Story Not Found | Chembarathi Wayanad' };

  // The optional `metadata` reference wins; otherwise the post describes itself.
  const title = post.metaData?.title || `${post.title} | Chembarathi Wayanad`;
  const description =
    post.metaData?.description || excerptFromRichText(post.content);

  const url = `${BLOG_BASE_URL}/${post.slug}`;
  const images = post.coverImage?.url
    ? [
        {
          url: post.coverImage.url,
          width: post.coverImage.width ?? 1200,
          height: post.coverImage.height ?? 630,
          alt: assetAlt(post.coverImage, post.title),
        },
      ]
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url,
      siteName: 'Chembarathi Wayanad',
      title,
      description,
      publishedTime: toIsoDate(post.date),
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images?.map(image => image.url),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(slug);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description:
      post.metaData?.description || excerptFromRichText(post.content),
    datePublished: toIsoDate(post.date),
    image: post.coverImage?.url ? [post.coverImage.url] : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BLOG_BASE_URL}/${post.slug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Chembarathi Wayanad',
      url: 'https://chembarathi.com',
    },
  };

  return (
    <main className="pt-20!">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <article>
        {/* Masthead first, hero second: the title carries the page and the
            image confirms it, the way a press piece opens. */}
        <ArticleMasthead
          title={post.title}
          date={post.date}
          heading={post.heading}
        />

        {/* Full-bleed, so it sits outside the section padding above and below.
            The LCP element, hence eager. */}
        {post.coverImage?.url && (
          <ArticleHero
            src={post.coverImage.url}
            alt={assetAlt(post.coverImage, post.title)}
          />
        )}

        {/* Rail and body share the masthead's 12-column grid, so the body
            starts on the same line the title does. Stacks at ≤768px.
            `data-article-row` is what `StickyRail` measures to know when to
            let the rail go. */}
        <div
          data-article-row
          className="section-wrapper grid grid-cols-12 gap-(--spacing-padding-10x) md:!grid-cols-1"
        >
          {/* `self-start` so the cell wraps the rail's own height instead of
              stretching to the body's — a full-height cell cannot be pinned. */}
          <StickyRail className="col-span-3 self-start md:!col-span-1">
            <ArticleAside title={post.title} date={post.date} />
          </StickyRail>

          <div className="col-span-7 col-start-5 min-w-0 lg:!col-span-9 lg:!col-start-4 md:!col-span-1 md:!col-start-1">
            <ArticleBody content={post.content} title={post.title} />
          </div>
        </div>
      </article>

      <RelatedPosts posts={relatedPosts} />
      <ArticleCta />
    </main>
  );
}
