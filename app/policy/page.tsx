import { contentfulFetch } from '../API/Contentful/getContent';
import { policyContentQuery, policyMetaDataQuery } from '../API/Query/query';
import { metadataCollection, policyCollection } from '../lib/type';
import { PolicySection } from './components/policysection';
import type { Metadata } from 'next';
import { buildMetadata } from '../lib/metadata';

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const metaData: metadataCollection =
    await contentfulFetch(policyMetaDataQuery);
  const title = metaData.metadataCollection.items[0]?.title || 'Privacy Policy';
  const description =
    metaData.metadataCollection.items[0]?.description ||
    'Read our privacy policy to understand how we collect, use, and protect your personal information at Chembarathi Wayanad.';

  /* Was declaring /HoneymoonSuite.JPG as 1200x630; that file is a 2560x1708
     photo, so the dimensions were a lie and crawlers cropped it badly. */
  return buildMetadata({ path: '/policy', title, description });
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
