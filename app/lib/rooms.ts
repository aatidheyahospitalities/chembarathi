/**
 * The canonical room types, in the order they are shown.
 *
 * Single source of truth on purpose: the names previously lived separately in
 * `DestinationSlider`, `RoomSlider` and the footer, and had already drifted
 * three ways — the same room appeared as "Private Pool Villa" in one place and
 * "Private Pool Room" in another, and a "Deluxe Suite" existed that the resort
 * does not offer. Anything that needs to name a room imports this.
 *
 * Images: only three rooms have their own photography. The rest borrow gallery
 * assets that genuinely depict the view each name promises — the same stand-in
 * approach `app/experience/content.ts` uses. Swap the `image` paths as real
 * per-room shots arrive; nothing else needs to change.
 */

export type RoomType = {
  name: string;
  image: string;
  /** Booking destination used by room links in the footer. */
  href: string;
};

export const BOOKING_ENGINE_URL =
  'https://bookingengine.stayflexi.com/?hotel_id=28009';

export const ROOM_TYPES: RoomType[] = [
  {
    name: 'Premium Cottage with Pool & Mountain View',
    image: '/cottages/premium-cottage-with-pool-and-mountain-view.jpg',
    href: BOOKING_ENGINE_URL,
  },
  {
    name: 'Deluxe Cottage with Lawn View',
    image: '/cottages/deluxe-cottage-lawn-view.jpg',
    href: BOOKING_ENGINE_URL,
  },
  {
    name: 'Premium Cottage with Mountain View',
    image: '/cottages/premium-cottage-mountain-view.jpg',
    href: BOOKING_ENGINE_URL,
  },
  {
    name: 'Deluxe Cottage with Forest View',
    image: '/cottages/deluxe-cottage-forest-view.jpg',
    href: BOOKING_ENGINE_URL,
  },
  {
    name: 'Private Pool Villa',
    image: '/cottages/private-pool-villa.jpg',
    href: BOOKING_ENGINE_URL,
  },
  {
    name: 'Honeymoon Suite with Jacuzzi',
    image: '/cottages/honeymoon-suite-jacuzzi.jpg',
    href: BOOKING_ENGINE_URL,
  },
];
