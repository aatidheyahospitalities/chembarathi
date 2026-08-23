import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { getBlogPost, getBlogSlugs, getRelatedPosts } from '../data';
import ArticleBody from '../components/ArticleBody';
import ArticleCta from '../components/ArticleCta';
import RelatedPosts from '../components/RelatedPosts';
import {
  assetAlt,
  BLOG_BASE_URL,
  excerptFromRichText,
  formatPostDate,
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
        {/* Hero opens the page, ahead of the title — the LCP element, so it
            loads eagerly. */}
        {post.coverImage?.url && (
          <div className="relative aspect-[16/7] w-full overflow-hidden md:!aspect-[3/2] xs:!aspect-[4/5]">
            <Image
              src={post.coverImage.url}
              alt={assetAlt(post.coverImage, post.title)}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="section-wrapper flex flex-col items-center gap-(--spacing-padding-10x) xs:!gap-(--spacing-padding-8x)">
          <header className="flex w-full max-w-[760px] flex-col items-center gap-(--spacing-padding-4x) text-center xs:!gap-(--spacing-padding-3x)">
            <time
              dateTime={toIsoDate(post.date)}
              className="text-md-regular uppercase text-(--typography-color-secondary-500)"
            >
              {formatPostDate(post.date)}
            </time>

            <h1 className="text-heading-2 text-(--typography-color-secondary-100) lg:!text-heading-3 xs:!text-heading-4">
              {post.title}
            </h1>

            {post.heading && (
              <p className="text-xxl-regular text-(--typography-color-secondary-800) lg:!text-xl-regular xs:!text-lg-regular">
                {post.heading}
              </p>
            )}
          </header>

          <div className="w-full max-w-[760px]">
            <ArticleBody content={post.content} title={post.title} />
          </div>
        </div>
      </article>

      <RelatedPosts posts={relatedPosts} />
      <ArticleCta />
    </main>
  );
}
