// openWhatsApp.ts

const WHATSAPP_NUMBER = '918891888818'; // country code + number (no +, no spaces)

/** The `wa.me` deep link for an arbitrary prefilled message. */
export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(roomName = '[Your preferred room]') {
  const message = `Hi, I’d like to enquire about room availability.

Room name: ${roomName}

Check-in:
Check-out:

Please share availability, tariff, and inclusions.

Thanks.`;

  // Must be triggered by a user action (click/tap)
  window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
}

/**
 * Opens WhatsApp with an already-composed message — used by the contact form,
 * which builds its own body from the answers it collected.
 *
 * Returns the URL rather than a success flag on purpose: `noopener` makes
 * `window.open` return `null` even when the tab did open, so there is no way
 * to tell a blocked popup from a successful one. Callers show the URL as a
 * fallback link instead of guessing.
 */
export function openWhatsAppMessage(message: string) {
  const url = buildWhatsAppUrl(message);

  // Must be triggered by a user action (click/tap)
  window.open(url, '_blank', 'noopener,noreferrer');

  return url;
}
