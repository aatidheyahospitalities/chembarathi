import { contentfulFetch } from './API/Contentful/getContent';
import { metadataCollection, pagetypeoneCollection } from './lib/type';
import { homeContentQuery, homeMetaDataQuery } from './API/Query/query';
import { buildMetadata } from './lib/metadata';
import { getLatestPosts } from './blog/data';
import { HOME_POST_COUNT } from './blog/utils';
import dynamic from 'next/dynamic';

import Banner from './components/Banner';
import DestinationSlider from '@/app/components/DestinationSlider';
import CommonSection from './components/valuesection/ValueSection';
const CommonSectionWithGallery = dynamic(
  () => import('./components/valuesection/ValueSectionWithGallery')
);
const ReviewSection = dynamic(() => import('./components/ReviewSection'));
const ScrollVelocityText = dynamic(
  () => import('./components/ScrollVelocityText')
);
const FaqSection = dynamic(() => import('./components/FaqSection'));
const HomeBlogSection = dynamic(() => import('./components/HomeBlogSection'));
const LocationSection = dynamic(() => import('./components/LocationSection'));

export const revalidate = 600;

export async function generateMetadata() {
  const metaData: metadataCollection = await contentfulFetch(homeMetaDataQuery);
  const entry = metaData.metadataCollection.items[0];

  return buildMetadata({
    title:
      entry?.title ||
      'Honeymoon Resort in Wayanad | Luxury Villas with Private Pool',
    description:
      entry?.description ||
      'Stay at a luxury honeymoon resort in Wayanad with private pool villas, forest cottages and mountain views.',
  });
}

export default async function HomePage() {
  // Independent queries, so they run together rather than in series.
  const [data, latestPosts] = await Promise.all([
    contentfulFetch<pagetypeoneCollection>(homeContentQuery),
    getLatestPosts(HOME_POST_COUNT),
  ]);

  const heroData = data.pagetypeoneCollection.items[0].hero;
  const AboutData = data.pagetypeoneCollection.items[0].aboutus;
  const ExperienceData = data.pagetypeoneCollection.items[0].theexperiences;
  const ExperienceTheBeautyData =
    data.pagetypeoneCollection.items[0].experienceTheBeauty;
  const faqData = data.pagetypeoneCollection.items[0].faq;

  return (
    <main>
      <Banner heroData={heroData} />
      <section id="about" style={{ scrollMarginTop: '80px' }}>
        <CommonSection commonSectionData={AboutData} />
      </section>
      <section id="experience" style={{ scrollMarginTop: '80px' }}>
        <CommonSection commonSectionData={ExperienceData} />
      </section>
      <section id="suites" style={{ scrollMarginTop: '80px' }}>
        <DestinationSlider />
      </section>
      <section id="gallery" style={{ scrollMarginTop: '80px' }}>
        <CommonSectionWithGallery commonSectionData={ExperienceTheBeautyData} />
      </section>
      <ScrollVelocityText
        texts={['Rejuvenation Retreat • Forest Therapy •']}
        velocity={30}
        className="custom-scroll-text text-display text-(--typography-color-secondary-850) whitespace-nowrap m-0 leading-none pr-16 shrink-0 xs:!text-h2"
      />
      <section id="reviews" style={{ scrollMarginTop: '80px' }}>
        <ReviewSection />
      </section>
      <section id="journal" style={{ scrollMarginTop: '80px' }}>
        <HomeBlogSection posts={latestPosts} />
      </section>
      {/* Last content section before the FAQs: by this point a visitor has seen
          the rooms and the stories, and "where is it" is the next question. */}
      <section id="location" style={{ scrollMarginTop: '80px' }}>
        <LocationSection />
      </section>
      <section id="faqs" style={{ scrollMarginTop: '80px' }}>
        <FaqSection {...faqData} />
      </section>
    </main>
  );
}
