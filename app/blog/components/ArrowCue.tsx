/**
 * The rule-and-arrow read cue beneath a listing row's title.
 *
 * Decorative on purpose: the row itself is the link, so this is a `<span>`
 * rather than a nested anchor, adding neither a second link to the same place
 * nor an extra tab stop. Hover comes from the ancestor row's `.group`.
 *
 * Border utilities carry `!` because `styles/globals.css` imports preflight
 * unlayered, which otherwise resets every `border-*` utility back to 0.
 */
export default function ArrowCue({
  label,
  className = '',
}: Readonly<{ label: string; className?: string }>) {
  return (
    <span
      aria-hidden
      className={`relative flex w-full items-center justify-between border-b! border-(--border-color-default)! pb-(--spacing-padding-3x)! text-xl-regular text-(--typography-color-secondary-100) xs:!text-lg-med ${className}`}
    >
      {label}
      <span className="material-symbols-outlined text-base! transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1">
        north_east
      </span>
      {/* Underline sweep, same motion as CommonLinkButton. Sits over the 1px
          rule rather than replacing it, so the line never disappears. */}
      <span className="pointer-events-none absolute left-0 -bottom-px h-px w-full overflow-hidden">
        <span className="block h-full w-full origin-left scale-x-0 bg-white transition-transform duration-300 ease-in-out group-hover:scale-x-100" />
      </span>
    </span>
  );
}
