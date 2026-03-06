import { contentfulFetch } from '../API/Contentful/getContent';
import { aboutContentQuery, aboutMetaDataQuery } from '../API/Query/query';
import { metadataCollection, pagetypetwoCollection } from '../lib/type';
import ValueSection from '../components/valuesection/ValueSection';
import FaqSection from '../components/FaqSection';

export const revalidate = 600;

export async function generateMetadata() {
  const metaData: metadataCollection =
    await contentfulFetch(aboutMetaDataQuery);
  return {
    title: metaData.metadataCollection.items[0]?.title || '',
    description: metaData.metadataCollection.items[0]?.description || '',
  };
}

export default async function AboutPage() {
  const data: pagetypetwoCollection = await contentfulFetch(aboutContentQuery);

  const ecosystem = data.pageTypeTwoCollection.items[0].ecosystem;
  const faqData = data.pageTypeTwoCollection.items[0].faq;

  return (
    <main>
      <ValueSection commonSectionData={ecosystem} />
      <FaqSection {...faqData} />
    </main>
  );
}
