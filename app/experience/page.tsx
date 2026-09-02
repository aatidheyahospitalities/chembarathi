import type { Metadata } from 'next';

import FaqSection from '../components/FaqSection';
import { experienceFaq } from './content';
import { getExperiences } from './data';
import ExperienceHero from './components/ExperienceHero';
import ExperiencePanel from './components/ExperiencePanel';
import { buildMetadata } from '../lib/metadata';

/**
 * The panels come from Contentful via `getExperiences`, which falls back to
 * the bundled copy in ./content.ts while the CMS has no `experience-` entries.
 * The hero and FAQ are still local. The header, gallery loop, and bottom bar
 * all come from the root layout; this page renders its own sections only.
 */
export const revalidate = 600;

export const metadata: Metadata = buildMetadata({
  path: '/experience',
  title: 'Experience | Chembarathi Wayanad',
  description:
    'Forest therapy walks, sunrise yoga, Ayurvedic spa rituals, dining under open skies, and an infinity pool over the valley — the experiences that shape a stay at Chembarathi Wayanad.',
});

export default async function ExperiencePage() {
  const experiences = await getExperiences();

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
