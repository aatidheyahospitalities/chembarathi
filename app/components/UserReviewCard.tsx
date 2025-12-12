interface Review {
  readonly name: string;
  readonly place: string;
  readonly review: string;
  readonly date: string;
  readonly rating: number;
}

export default function UserReviewCard(review: Review) {
  return (
    <div className="flex flex-col w-[500px] min-h-80 p-5! gap-(--spacing-padding-6x) bg-(--surface-primary-700) rounded-(--border-radius-md) ">
      <div className="flex justify-between">
        <div className="flex gap-(--spacing-padding-3x)">
          <span className="w-[47px] h-[47px] rounded-full bg-white"></span>
          <div className="flex flex-col">
            <span className="text-(--typography-color-secondary-100)">
              {review.name}
            </span>
            <span className="text-(--typography-color-secondary-700)">
              {review.place}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xl-regular text-(--typography-color-secondary-100)">
            {review.rating}
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
      <div className="flex flex-col justify-between flex-1 min-h-full">
        <span className="text-xl-regular text-(--typography-color-secondary-800)">
          {review.review}
        </span>
        <span className="text-xl-regular text-(--typography-color-secondary-700)">
          {review.date}
        </span>
      </div>
    </div>
  );
}
