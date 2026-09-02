'use client';

import { useId, useState } from 'react';

interface Review {
  readonly name: string;
  readonly place?: string;
  readonly review: string;
  readonly date: string;
  readonly rating: number;
}

/**
 * One guest review.
 *
 * Real reviews run far longer than the invented ones this card was built for,
 * so the body clamps to four lines and expands on request. Expanded, it is
 * capped and scrolls internally rather than growing without limit — the cards
 * sit in a horizontal marquee, and one tall card would drag the whole row's
 * height with it.
 */
export default function UserReviewCard({
  name,
  place,
  review,
  date,
  rating,
}: Review) {
  const [expanded, setExpanded] = useState(false);
  const bodyId = useId();

  return (
    <div className="flex flex-col w-[500px] xs:!w-full min-h-80 xs:!h-fit p-5! gap-(--spacing-padding-6x) bg-(--surface-primary-700) rounded-(--border-radius-md) ">
      <div className="flex justify-between">
        <div className="flex gap-(--spacing-padding-3x)">
          <span className="w-[47px] h-[47px] rounded-full bg-white"></span>
          <div className="flex flex-col">
            <span className="text-(--typography-color-secondary-100) xs:!text-xl-regular">
              {name}
            </span>
            {place && (
              <span className="text-(--typography-color-secondary-700) xs:!text-md-regular">
                {place}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xl-regular text-(--typography-color-secondary-100)">
            {rating}
          </span>
          <span
            className="text-white material-symbols-outlined"
            style={{
              fontVariationSettings:
                '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
            }}
          >
            star
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-between flex-1 min-h-full gap-(--spacing-padding-3x)">
        <div className="flex flex-col items-start gap-(--spacing-padding-2x)">
          <span
            id={bodyId}
            className={`text-xl-regular xs:!text-lg-regular text-(--typography-color-secondary-800) ${
              expanded
                ? 'max-h-[220px] overflow-y-auto'
                : 'line-clamp-4 overflow-hidden'
            }`}
          >
            {review}
          </span>

          <button
            type="button"
            onClick={() => setExpanded(open => !open)}
            aria-expanded={expanded}
            aria-controls={bodyId}
            className="text-md-regular text-(--typography-color-secondary-500) underline underline-offset-4 hover:text-(--typography-color-secondary-100) transition-colors duration-200 cursor-pointer"
          >
            {expanded ? 'Read Less' : 'Read More'}
          </button>
        </div>

        <span className="text-xl-regular xs:!text-lg-regular text-(--typography-color-secondary-700)">
          {date}
        </span>
      </div>
    </div>
  );
}
