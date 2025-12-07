import { contentfulFetch } from './API/Contentful/getContent';
import { metadataCollection, pagetypeoneCollection } from './lib/type';
import { homeContentQuery, homeMetaDataQuery } from './API/Query/query';

import Banner from './components/Banner';
import CommonSection from './components/CommonSection';
import CommonSectionWithGallery from './components/CommonSectionWithGallery';
import GalleryLoop from './components/GalleryLoop';
import ReviewSection from './components/ReviewSection';
import ScrollVelocityText from './components/ScrollVelocityText';

export const revalidate = 600; // Revalidate every 10 minutes

export async function generateMetadata() {
  const metaData: metadataCollection = await contentfulFetch(homeMetaDataQuery);
  return {
    title: metaData.metadataCollection.items[0]?.title || '',
    description: metaData.metadataCollection.items[0]?.description || '',
  };
}

export default async function HomePage() {
  const data: pagetypeoneCollection = await contentfulFetch(homeContentQuery);
  const heroData = data.pagetypeoneCollection.items[0].hero;
  const AboutData = data.pagetypeoneCollection.items[0].aboutus;
  const ExperienceData = data.pagetypeoneCollection.items[0].theexperiences;
  const ExperienceTheBeautyData =
    data.pagetypeoneCollection.items[0].experienceTheBeauty;
  return (
    <main>
      <Banner heroData={heroData} />
      <CommonSection commonSectionData={AboutData} type="TYPE1" />
      <CommonSection commonSectionData={ExperienceData} type="TYPE2" />
      <ScrollVelocityText
        texts={['Rejuvenation Retreat • Forest Therapy •']}
        velocity={30}
        className="custom-scroll-text text-display text-(--typography-color-secondary-850) whitespace-nowrap m-0 leading-none pr-16 shrink-0"
      />
      <CommonSectionWithGallery commonSectionData={ExperienceTheBeautyData} />
      <GalleryLoop />
      <ReviewSection />
    </main>
  );
}
