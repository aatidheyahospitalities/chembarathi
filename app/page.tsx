import Banner from "./components/Banner";
import CommonSection from "./components/CommonSection";

import { getContent, getMetaData } from "./lib/services/getHomeContent";
import { HeroData, commonSectionData } from "./lib/type";
import MarqueeSection from "./components/InfiniteScrollText";

export const revalidate = 600; // Revalidate every 10 minutes

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
  const twoColumnSection = data.items[0]?.fields.twoColumnShowcaseSection as unknown[];
  const AboutData: commonSectionData = (twoColumnSection?.[0] as unknown as commonSectionData) || {};
  const ExperienceData: commonSectionData = (twoColumnSection?.[1] as unknown as commonSectionData) || {};
  return (
    <div>
      <Banner heroData={heroData} />
      <CommonSection commonSectionData={AboutData} type="TYPE1" />
      <CommonSection commonSectionData={ExperienceData} type="TYPE2" />
      <MarqueeSection/>
    </div>
  );
}