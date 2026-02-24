import { contentfulFetch } from '../API/Contentful/getContent';
import { aboutContentQuery, aboutMetaDataQuery } from '../API/Query/query';
import { metadataCollection, pagetypetwoCollection } from '../lib/type';
import ValueSection from '../components/valuesection/ValueSection';

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

  return (
    <main>
      <ValueSection commonSectionData={ecosystem} />
    </main>
  );
}
