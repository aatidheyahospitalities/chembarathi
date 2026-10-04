import { contactDetails } from '../content';

/**
 * The row of contact blocks across the top of the page: a muted label over one
 * or more value lines, sat under a hairline rule.
 *
 * A block is a link when it has an `href` and plain text otherwise, so a
 * detail with nowhere useful to point still renders — the difference is one
 * field in `content.ts`, not a second component.
 *
 * The `!` on the border and padding is not decoration: `globals.css` imports
 * `tailwindcss/preflight` a second time unlayered, and unlayered rules outrank
 * every layered utility, so `*{padding:0;border:0 solid}` wins otherwise. The
 * same reason `Header` writes `border-b!`. See `ContactForm` for the full note.
 */
export default function ContactDetails() {
  return (
    <ul className="grid grid-cols-3 gap-(--spacing-padding-8x) border-t! border-(--border-color-muted)! pt-(--spacing-padding-6x)! md:!grid-cols-2 xs:!grid-cols-1 xs:!gap-(--spacing-padding-6x)">
      {contactDetails.map(detail => {
        const value = (
          <>
            <span className="text-md-regular text-(--typography-color-primary-100)">
              {detail.label}
            </span>

            <span className="flex flex-col text-lg-med text-(--typography-color-secondary-100)">
              {detail.lines.map(line => (
                <span key={line}>{line}</span>
              ))}
            </span>
          </>
        );

        return (
          <li key={detail.label}>
            {detail.href ? (
              <a
                href={detail.href}
                target={detail.external ? '_blank' : undefined}
                rel={detail.external ? 'noopener noreferrer' : undefined}
                className="flex w-fit flex-col gap-(--spacing-padding-2x) transition-opacity hover:opacity-70"
              >
                {value}
              </a>
            ) : (
              <div className="flex flex-col gap-(--spacing-padding-2x)">
                {value}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
