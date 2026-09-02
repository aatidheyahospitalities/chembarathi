import type { Metadata } from 'next';

import { contentfulFetch } from '../API/Contentful/getContent';
import { blogMetaDataQuery } from '../API/Query/query';
import type { metadataCollection } from '../lib/type';
import { getBlogPage } from './data';
import BlogList from './components/BlogList';
import BlogMasthead from './components/BlogMasthead';
import { BLOG_BASE_URL } from './utils';
import { buildMetadata } from '../lib/metadata';

export const revalidate = 600;

/* Masthead copy is intentionally not CMS-driven: it changes rarely, and the
   listing has no page entry of its own (unlike /about or /policy) because the
   list is built by querying posts. Edit here to change it. SEO for this page
   does come from Contentful — the `metadata` entry with slug `blogpage`. */
const MASTHEAD_TITLE = 'Stories From The Hills';
const MASTHEAD_INTRO =
  'Notes on slow mornings, monsoon light, and the people and produce of Wayanad — written from the estate, at the pace the place keeps.';

const FALLBACK_TITLE = 'Journal | Chembarathi Wayanad';
const FALLBACK_DESCRIPTION =
  'Stories from Chembarathi Wayanad — slow living, the surrounding forest and estate, and the experiences that shape a stay in the hills.';

export async function generateMetadata(): Promise<Metadata> {
  const metaData: metadataCollection = await contentfulFetch(blogMetaDataQuery);
  const entry = metaData.metadataCollection?.items[0];

  const title = entry?.title || FALLBACK_TITLE;
  const description = entry?.description || FALLBACK_DESCRIPTION;

  return buildMetadata({ path: '/blog', title, description });
}

export default async function BlogPage() {
  const { posts, total } = await getBlogPage(0);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: MASTHEAD_TITLE,
    description: MASTHEAD_INTRO,
    url: BLOG_BASE_URL,
    publisher: {
      '@type': 'Organization',
      name: 'Chembarathi Wayanad',
      url: 'https://chembarathi.com',
    },
    blogPost: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      datePublished: post.date,
      url: `${BLOG_BASE_URL}/${post.slug}`,
    })),
  };

  return (
    <main className="pt-20!">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="section-wrapper">
        <BlogMasthead title={MASTHEAD_TITLE} intro={MASTHEAD_INTRO} />
        <BlogList initialPosts={posts} total={total} />
      </div>
    </main>
  );
}
