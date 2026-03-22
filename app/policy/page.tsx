import { contentfulFetch } from "../API/Contentful/getContent";
import {  policyContentQuery, policyMetaDataQuery } from "../API/Query/query";
import { metadataCollection, policyCollection } from "../lib/type";
import { PolicySection } from "./components/policysection";

export const revalidate = 600;

export async function generateMetadata() {
  const metaData: metadataCollection = await contentfulFetch(policyMetaDataQuery);

  return {
    title: metaData.metadataCollection.items[0]?.title || '',
    description: metaData.metadataCollection.items[0]?.description || '',
  };
}

export default async function PolicyPage() {
  const data: policyCollection = await contentfulFetch(policyContentQuery);
  const policyContent = data.policypageCollection.items[0]?.policy || null; // Safely access the policy content

  return (
    <main className='pt-20!'>
       <PolicySection contents={policyContent} />
    </main>
  );
}
