import Banner from "./components/Banner";
import CommonSection from "./components/CommonSection";

import { getContent, getMetaData } from "./lib/services/getHomeContent";
import { HeroData, commonSectionData } from "./lib/type";

export async function generateMetadata() {
  const metaData = await getMetaData();
  return {
    title: metaData.fields.metaDataTitle || "",
    description: metaData.fields.metaDataDescription || "",
  };
}


export default async function HomePage() {

  const data = await getContent();
  const heroData: HeroData = data.items[0]?.fields.hero as HeroData || {};
  const commonSectionData: commonSectionData = data.items[0]?.fields.twoColumnShowcaseSection as unknown as commonSectionData || {};
  return (
    <div>
      <Banner heroData={heroData} />
      <CommonSection commonSectionData={commonSectionData} />
    </div>
  );
}