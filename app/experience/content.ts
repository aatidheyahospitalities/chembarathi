import { FaqItemType } from '../lib/type';

/**
 * Local content for /experience.
 *
 * The experience panels are no longer here — they come from Contentful via
 * `data.ts`, as `contentsection` entries slugged `experience-*`. What remains
 * is the hero and the FAQ, neither of which has a CMS entry of its own, plus
 * the item type the CMS records are mapped into.
 */

export interface ExperienceItemType {
  tag: string;
  title: string;
  description: string;
  image: string;
  alt: string;
}

/**
 * Eyebrow and title are verbatim from the homepage "experience" teaser; the
 * description is a one-line condensation of that teaser paragraph.
 */
export const experienceHero = {
  eyebrow: 'CURATED FOR YOUR SENSES',
  title: 'Experiences That Stay With You',
  description:
    'From forest therapy to poolside dinners, every moment designed to reconnect.',
  image: '/gallery/masonry/10.jpg',
};

/** The three experience-relevant Q&As already published on the live FAQ. */
export const experienceFaq: FaqItemType = {
  faqItemCollection: {
    items: [
      {
        question: 'Are there private experiences for couples?',
        answer:
          'Yes. Chembarathi caters to honeymoon couples with private villa settings, intimate dining, and curated experiences amid forest surroundings.',
      },
      {
        question: 'Is there an infinity pool or private pool access?',
        answer:
          'Yes. There is an infinity pool for general use, and select villas feature private pool access.',
      },
      {
        question: 'Does Chembarathi follow any eco-friendly policies?',
        answer:
          'Yes. Guests are encouraged to support sustainability by minimizing waste, respecting local ecology, and conserving resources during their stay.',
      },
    ],
  },
};
