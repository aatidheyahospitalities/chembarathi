'use client';

import CommonLinkButton from './CommonLinkButton';
import SectionHeading from './SectionHeading';

/**
 * Where the resort is, and how to get there.
 *
 * Both URLs address the place by name rather than by coordinates or a street
 * address: no address is stored anywhere in this codebase, and Maps resolves
 * the listing reliably from the name. Swap in a `place_id` if the listing ever
 * becomes ambiguous.
 *
 * The `output=embed` form needs no Maps API key, so there is no key to leak in
 * client markup and nothing to bill.
 */
const MAPS_QUERY = 'Chembarathi Wayanad Boutique Resort';

const EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  MAPS_QUERY
)}&output=embed`;

const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  MAPS_QUERY
)}`;

export default function LocationSection() {
  return (
    <div className="section-wrapper flex flex-col gap-(--spacing-padding-16x) xs:!gap-(--spacing-padding-8x)">
      <SectionHeading
        eyebrow="Location"
        title="Finding Your Way Here"
        description="Set in the hills above Wayanad, deep enough into the forest to feel remote and close enough to reach comfortably. We are happy to arrange a pickup — just ask when you book."
      >
        <CommonLinkButton
          text="Get Directions"
          onclick={() =>
            window.open(DIRECTIONS_URL, '_blank', 'noopener,noreferrer')
          }
        />
      </SectionHeading>

      {/* 16:9 on desktop, squarer on phones so the map keeps a usable area
          rather than collapsing to a letterbox strip. */}
      <div className="relative w-full aspect-video overflow-hidden rounded-4xl xs:!aspect-[4/5] xs:!rounded-[16px]">
        <iframe
          src={EMBED_SRC}
          title={`Map showing ${MAPS_QUERY}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  );
}
