import { contentfulFetch } from './API/Contentful/getContent';
import { metadataCollection, pagetypeoneCollection } from './lib/type';
import { homeContentQuery, homeMetaDataQuery } from './API/Query/query';
import dynamic from 'next/dynamic';

import Banner from './components/Banner';
import CommonSection from './components/CommonSection';
const CommonSectionWithGallery = dynamic(() => import('./components/CommonSectionWithGallery'));
const ReviewSection = dynamic(() => import('./components/ReviewSection'));
const ScrollVelocityText = dynamic(() => import('./components/ScrollVelocityText'));
const FaqSection = dynamic(() => import('./components/FaqSection'));
const BottomBarSection = dynamic(() => import('./components/BottomBarSection'));
const RoomSlider = dynamic(() => import('./components/RoomSlider'));

export const revalidate = 600;

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
  const faqData = data.pagetypeoneCollection.items[0].faq;

  return (
    <main>
      <Banner heroData={heroData} />
      <CommonSection commonSectionData={AboutData} type="TYPE1" />
      <CommonSection commonSectionData={ExperienceData} type="TYPE2" />
      <RoomSlider />
      <CommonSectionWithGallery commonSectionData={ExperienceTheBeautyData} />
      <ScrollVelocityText
        texts={['Rejuvenation Retreat • Forest Therapy •']}
        velocity={30}
        className="custom-scroll-text text-display text-(--typography-color-secondary-850) whitespace-nowrap m-0 leading-none pr-16 shrink-0 xs:!text-h2"
      />
      <ReviewSection />
      <FaqSection {...faqData} />
      {/* <GalleryLoop /> */}
      <BottomBarSection />
    </main>
  );
}
