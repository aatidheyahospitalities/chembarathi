import type { Metadata } from 'next';

import FaqSection from '../components/FaqSection';
import { experienceFaq, experiences } from './content';
import ExperienceHero from './components/ExperienceHero';
import ExperiencePanel from './components/ExperiencePanel';

/**
 * Content lives in ./content.ts rather than Contentful, so there is nothing to
 * revalidate — the page is fully static. The header, gallery loop, and bottom
 * bar all come from the root layout; this page renders its own sections only.
 */
export const metadata: Metadata = {
  title: 'Experience | Chembarathi Wayanad',
  description:
    'Forest therapy walks, sunrise yoga, Ayurvedic spa rituals, dining under open skies, and an infinity pool over the valley — the experiences that shape a stay at Chembarathi Wayanad.',
};

export default function ExperiencePage() {
  return (
    <main>
      <ExperienceHero />

      <div className="section-wrapper flex flex-col gap-(--spacing-padding-20x) xs:!gap-(--spacing-padding-16x)">
        {experiences.map((item, index) => (
          <ExperiencePanel key={item.title} item={item} index={index} />
        ))}
      </div>

      <FaqSection {...experienceFaq} />
    </main>
  );
}
