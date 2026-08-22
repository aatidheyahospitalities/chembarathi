import { FaqItemType } from '../lib/type';

/**
 * Content for /experience.
 *
 * Hardcoded rather than CMS-driven, matching the existing pattern for
 * DestinationSlider / ReviewSection. Copy is grounded in wording already
 * published on the site (the homepage "Experiences That Stay With You"
 * teaser and the live FAQ accordion) — see the notes on each block.
 *
 * Images are existing gallery assets standing in for dedicated per-experience
 * photography. Swap the `image` paths once real shots exist; nothing else
 * needs to change.
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

export const experiences: ExperienceItemType[] = [
  {
    tag: 'Renewal',
    title: 'Forest Therapy Walk',
    description:
      "A guided walk through Wayanad's ancient canopy, where every step slows the mind and steadies the breath. Time softens here — leaves overhead, quiet trails underfoot — until the forest becomes less a place you walk through, and more a place that walks through you.",
    image: '/gallery/masonry/6.jpg',
    alt: 'Mist settling over the forest around a Chembarathi cottage',
  },
  {
    tag: 'Awakening',
    title: 'Sunrise Yoga',
    description:
      'As the first light breaks over the hills, a quiet practice begins on open ground. Sunrise yoga at Chembarathi is unhurried and personal — a gentle way to greet the day, find stillness in the body, and carry that calm through everything that follows.',
    image: '/gallery/masonry/1.jpg',
    alt: 'Morning practice on an open deck beside the plunge pool',
  },
  {
    tag: 'Restoration',
    title: 'Ayurvedic Spa Rituals',
    description:
      "Rooted in Kerala's centuries-old healing tradition, each treatment is prepared with warmth, care, and time-tested herbs. Here, restoration isn't rushed — it's a slow return to balance, guided by hands that understand rest as much as ritual.",
    image: '/gallery/masonry/2.jpg',
    alt: 'Open-air bathing pavilion set among forest rock and greenery',
  },
  {
    tag: 'Nourishment',
    title: 'Dining Under Open Skies',
    description:
      'Meals here follow the land, not a menu — organic, farm-fresh, and served wherever the evening feels right: beside the pool, beneath the trees, under an open sky. Every plate is a quiet celebration of where you are.',
    image: '/gallery/masonry/9.jpg',
    alt: 'The thatched dining pavilion lit at dusk',
  },
  {
    tag: 'Immersion',
    title: 'Infinity Pool & Stillness',
    description:
      "Water meets the horizon, and the forest falls quiet around it. Whether it's an early swim before the day begins or a slow float as evening settles in, the infinity pool is where the pace of a Chembarathi stay is set — unhurried, immersive, and entirely your own.",
    image: '/gallery/masonry/8.jpg',
    alt: 'The infinity pool seen from above, ringed by forest canopy',
  },
];

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
