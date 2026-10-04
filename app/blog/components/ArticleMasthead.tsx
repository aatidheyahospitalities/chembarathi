import { formatPostDate, toIsoDate } from '../utils';

/**
 * Opens an article press-page style: a ruled meta line, then the title set
 * into the right-hand columns so the left margin stays open and the eye drops
 * diagonally from the label to the headline.
 *
 * The 12-column grid is shared with `ArticleAside` on the page below — the
 * title and the body column start on the same line — so the two components'
 * `col-start` values need to move together.
 */
export default function ArticleMasthead({
  title,
  date,
  heading,
}: Readonly<{ title: string; date: string; heading: string | null }>) {
  return (
    <header className="section-wrapper flex flex-col pb-0!">
      <div className="grid grid-cols-12 gap-(--spacing-padding-8x) border-b! border-(--surface-primary-500)! pb-(--spacing-padding-5x)! md:!grid-cols-2 md:!gap-(--spacing-padding-4x)">
        <span className="col-span-4 text-md-regular uppercase text-(--typography-color-secondary-500) md:!col-span-1">
          Journal
        </span>

        <time
          dateTime={toIsoDate(date)}
          className="col-span-8 text-md-regular uppercase text-(--typography-color-secondary-500) md:!col-span-1"
        >
          {formatPostDate(date)}
        </time>
      </div>

      <div className="grid grid-cols-12 gap-(--spacing-padding-8x) pt-(--spacing-padding-20x)! md:!grid-cols-1 md:!pt-(--spacing-padding-10x)">
        <div className="col-span-8 col-start-5 flex flex-col gap-(--spacing-padding-6x) pb-(--spacing-padding-20x)! lg:!col-span-9 lg:!col-start-4 md:!col-span-1 md:!col-start-1 md:!pb-(--spacing-padding-10x) xs:!gap-(--spacing-padding-4x)">
          <h1 className="text-heading-1 text-(--typography-color-secondary-100) lg:!text-heading-2 xs:!text-heading-3">
            {title}
          </h1>

          {heading && (
            <p className="max-w-[52ch] text-xxl-regular text-(--typography-color-secondary-800) lg:!text-xl-regular xs:!text-lg-regular">
              {heading}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
