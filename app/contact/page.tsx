import type { Metadata } from 'next';

import { contactWordmark } from './content';
import { buildMetadata } from '../lib/metadata';
import ContactForm from './components/ContactForm';
import ContactDetails from './components/ContactDetails';

/**
 * A single full-height screen: details along the top, the wordmark and the
 * form sharing the bottom edge. The footer's "Contact" quick link has pointed
 * here since it was written; this is the route it was pointing at.
 *
 * Entirely local content, so nothing is fetched and there is no `revalidate`
 * to set — this is a static page.
 */

export const metadata: Metadata = buildMetadata({
  path: '/contact',
  title: 'Contact | Chembarathi Wayanad',
  description:
    'Get in touch with Chembarathi Wayanad. Send us a message on WhatsApp about availability, tariffs, or anything you would like to arrange before you arrive.',
});

export default function ContactPage() {
  return (
    /* The top padding is the fixed header's exact height, so the rule opening
       `ContactDetails` lands flush against the header's own bottom border and
       the two read as one continuous line.

       89px is that height, derived from `Header`: `py-[24px]` twice, either
       side of a 40px logo, plus the 1px `border-b`. It is a literal rather
       than a token because no token equals it — and because it is a
       measurement of another component, not a spacing choice. Changing the
       header's padding, logo size or border means changing this with it.

       Other pages sit 80px clear (`pt-20`) and can afford to be approximate;
       this one cannot, because a visible line has to meet another one. The
       padding goes on the wrapper rather than an outer element for the same
       reason — an outer `pt` would stack on the wrapper's own 96px instead of
       replacing it.

       Because that clearance is now padding *inside* the wrapper, the wrapper
       itself starts at the top of the viewport and so wants the full `100vh` —
       subtracting the header height here as well would leave it 89px short,
       and `justify-between` would have no slack left to push the bottom row
       down with. The bottom padding is cut to 40px for the same reason the
       top was: this row is meant to sit on the bottom edge of the screen, and
       the section default of 96px held it well clear of it. */
    <div className="section-wrapper flex min-h-screen flex-col justify-between gap-(--spacing-padding-16x) pt-[89px]! pb-(--spacing-padding-10x)! xs:!gap-(--spacing-padding-10x)">
      {/* Ordered second below `md`, so a phone leads with the wordmark and
            the form rather than with three lines of small print. */}
      <ContactDetails />

      <div className="flex items-end justify-between gap-(--spacing-padding-16x) md:!order-first md:!flex-col md:!items-stretch md:!gap-(--spacing-padding-10x)">
        {/* Sized in `vw` rather than from the type scale: this is the same
              oversized wordmark treatment the footer uses, and at 144px the
              `display` token would leave most of the line empty on a wide
              screen and overflow a narrow one.

              The negative bottom margin is what makes `items-end` align what
              the eye actually sees. Staylista's line box ends well below its
              ink — measured at this size, the baseline sits 0.194em above the
              box bottom, so aligning the boxes left the wordmark floating
              ~47px above the form it is supposed to share an edge with.
              Trimming that much off the bottom puts the baseline itself on
              the row's bottom edge. It is expressed in `em` so it scales with
              the `clamp()` above instead of only being right at one width. */}
        <h1
          className="font-primary mb-[-0.194em]! leading-[0.85] text-(--typography-color-secondary-100)"
          style={{ fontSize: 'clamp(4rem, 16vw, 15rem)' }}
        >
          {contactWordmark}
        </h1>

        <div className="w-[460px] shrink-0 xl:!w-[400px] md:!w-full">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
