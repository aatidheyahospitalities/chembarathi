/**
 * Local content for /contact.
 *
 * Nothing here is CMS-backed. Every value below is one the codebase already
 * knows: the number is the WhatsApp one from `app/Services/openWhatsApp.ts`,
 * the place is addressed by name exactly as `LocationSection` does (no street
 * address is stored anywhere in this repo), and the booking URL is the
 * Stayflexi link the header, hero and footer all open.
 *
 * There is deliberately no email block — no address for the resort exists
 * anywhere in the codebase, and a made-up one on a contact page is worse than
 * none. Add a fourth entry here once there is a real one to publish.
 */

export type ContactDetail = {
  /** Small muted label above the value, e.g. `Reach us | 01`. */
  label: string;
  /** One line per rendered row, so a value can break where it should. */
  lines: string[];
  /** Makes the block a link. Omit for plain text. */
  href?: string;
  /** External targets open in a new tab. */
  external?: boolean;
};

export const contactDetails: ContactDetail[] = [
  {
    label: 'Reach us | 01',
    lines: ['+91 88918 88818', 'Call or WhatsApp'],
    href: 'tel:+918891888818',
  },
  {
    label: 'Find us | 02',
    lines: ['Chembarathi Wayanad', 'Kerala, India'],
    href: 'https://www.google.com/maps/dir/?api=1&destination=Chembarathi%20Wayanad%20Boutique%20Resort',
    external: true,
  },
  {
    label: 'Reservations',
    lines: ['Book direct', 'Best available rate'],
    href: 'https://bookingengine.stayflexi.com/?hotel_id=28009',
    external: true,
  },
];

/** Rendered as the page's `h1`, in the display face. */
export const contactWordmark = 'Contact';

export const contactForm = {
  title: 'Get in touch',
  /* Sets the expectation the WhatsApp handoff creates: the message lands in a
     chat, not an inbox, so the reply comes back the same way. */
  note: 'Tell us a little about your stay. We pick it up on WhatsApp, usually within a few hours.',
};
