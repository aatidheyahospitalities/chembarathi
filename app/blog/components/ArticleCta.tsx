'use client';

import CommonLinkButton from '@/app/components/CommonLinkButton';

/** Same booking engine the header and bottom bar already open. */
const BOOKING_URL = 'https://bookingengine.stayflexi.com/?hotel_id=28009';

/**
 * Closes an article. A client component only because `CommonLinkButton` takes
 * an `onclick` handler, which cannot cross the server boundary.
 */
export default function ArticleCta() {
  return (
    <section className="section-wrapper flex items-center justify-between gap-16 border-t! border-(--surface-primary-500)! xs:!flex-col xs:!items-start xs:!gap-(--spacing-padding-6x)">
      <div className="flex flex-col gap-(--spacing-padding-3x)">
        {/* TODO: replace with final launch copy. */}
        <h2 className="text-heading-3 text-(--typography-color-secondary-100) xs:!text-heading-4">
          Come See It For Yourself
        </h2>

        <p className="max-w-[48ch] text-xl-regular text-(--typography-color-secondary-800) xs:!text-lg-regular">
          The hills read differently in person. Plan a stay and let Wayanad set
          the pace.
        </p>
      </div>

      <CommonLinkButton
        text="Plan Your Stay"
        onclick={() => window.open(BOOKING_URL, '_blank')}
      />
    </section>
  );
}
