import { ReactNode } from 'react';

/**
 * The eyebrow / title / description block that opens almost every section.
 *
 * It was hand-copied into seven components before this existed, and had already
 * drifted: `ValueSectionWithGallery` was missing the `xs` gap override, so its
 * description sat 40px below the heading on phones where every other section
 * sat at 24px. Centralising it keeps that from happening again.
 *
 * Deliberately owns no outer padding — callers already sit inside a
 * `section-wrapper`, which is where section padding belongs.
 */

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  /**
   * `split` gives the description its own half-width column beside the title
   * (the homepage sections); `stacked` runs it underneath in a single column.
   * Both collapse to one column at `xs`.
   */
  layout?: 'split' | 'stacked';
  /** `h2` for a section within a page, `h1` for a page's own masthead. */
  as?: 'h1' | 'h2';
  /** Rendered below the description — a `CommonLinkButton`, typically. */
  children?: ReactNode;
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  layout = 'split',
  as: Heading = 'h2',
  children,
  className = '',
}: Readonly<SectionHeadingProps>) {
  const split = layout === 'split';

  // In `split` the second column is only worth reserving when something will
  // fill it, otherwise the title would sit against a dead half-width gap.
  const hasBody = Boolean(description) || Boolean(children);

  return (
    <div
      className={
        split
          ? `flex gap-(--spacing-padding-16x) w-full xs:!flex-col xs:!gap-(--spacing-padding-6x) ${className}`
          : `flex flex-col gap-(--spacing-padding-16x) xs:!gap-(--spacing-padding-6x) ${className}`
      }
    >
      <div
        className={`flex flex-col gap-(--spacing-padding-3x) ${
          split && hasBody ? 'w-[50%] xs:!w-full' : ''
        }`}
      >
        {/* Cased in CSS rather than in the copy, so a caller can pass ordinary
            prose and Contentful entries need no shouting stored in them. */}
        <span className="text-md-regular uppercase text-(--typography-color-secondary-500)">
          {eyebrow}
        </span>
        <Heading className="text-heading-2 text-(--typography-color-secondary-100) xs:!text-heading-4">
          {title}
        </Heading>
      </div>

      {hasBody && (
        <div
          className={`flex flex-col gap-(--spacing-padding-10x) text-start xs:!gap-(--spacing-padding-6x) ${
            split ? 'w-[50%] xs:!w-full' : ''
          }`}
        >
          {description && (
            <span className="text-xl-regular text-(--typography-color-secondary-800) xs:!text-body-lg">
              {description}
            </span>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
