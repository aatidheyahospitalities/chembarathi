// openWhatsApp.ts

const WHATSAPP_NUMBER = '918891888818'; // country code + number (no +, no spaces)

export function openWhatsApp(roomName = '[Your preferred room]') {
  const message = `Hi, I’d like to enquire about room availability.

Room name: ${roomName}

Check-in:
Check-out:

Please share availability, tariff, and inclusions.

Thanks.`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;

  // Must be triggered by a user action (click/tap)
  window.open(url, '_blank', 'noopener,noreferrer');
}
