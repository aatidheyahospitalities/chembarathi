import { formatPostDate } from '../utils';

/**
 * The rail beside the article body: where you are, and what you are reading.
 *
 * Placement and the pinning behaviour belong to `StickyRail`, which wraps this
 * — see the note there on why the pin is a ScrollTrigger rather than
 * `position: sticky`.
 */
export default function ArticleAside({
  title,
  date,
}: Readonly<{ title: string; date: string }>) {
  return (
    <aside className="flex flex-col gap-(--spacing-padding-5x) md:!gap-(--spacing-padding-4x)">
      <p className="text-md-regular uppercase text-(--typography-color-secondary-500)">
        {`Journal — ${formatPostDate(date)}`}
      </p>

      <p className="text-lg-regular text-(--typography-color-secondary-800)">
        {title}
      </p>
    </aside>
  );
}
