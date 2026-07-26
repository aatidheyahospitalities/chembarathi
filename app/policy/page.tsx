import { contentfulFetch } from "../API/Contentful/getContent";
import { policyContentQuery, policyMetaDataQuery } from "../API/Query/query";
import { metadataCollection, policyCollection } from "../lib/type";
import { PolicySection } from "./components/policysection";
import type { Metadata } from 'next';

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const metaData: metadataCollection = await contentfulFetch(policyMetaDataQuery);
  const title = metaData.metadataCollection.items[0]?.title || 'Privacy Policy';
  const description = metaData.metadataCollection.items[0]?.description || 'Read our privacy policy to understand how we collect, use, and protect your personal information at Chembarathi Wayanad.';

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://chembarathi.com/policy',
      title,
      description,
      siteName: 'Chembarathi Wayanad',
      images: [
        {
          url: '/HoneymoonSuite.JPG',
          width: 1200,
          height: 630,
          alt: 'Chembarathi Wayanad - Privacy Policy',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/HoneymoonSuite.JPG'],
    },
  };
}

export default async function PolicyPage() {
  const data: policyCollection = await contentfulFetch(policyContentQuery);
  const policyContent = data.policypageCollection.items[0]?.policy || null; // Safely access the policy content

  return (
    <main className="policy-page pt-20!">
      <PolicySection contents={policyContent} />
    </main>
  );
}
