import WreathRingLeft from '../lib/Icos/WreathRingLeft copy';
import WreathRingRight from '../lib/Icos/WreathRingRight';
import InfiniteLoopWrapper from './InfiniteLoopWrapper';
import UserReviewCard from './UserReviewCard';

export default function ReviewSection() {
  /* Real guest reviews. No location is published with them, so the card's
     `place` line is simply omitted rather than invented. */
  const customerFeedback = [
    {
      name: 'Yadhu Krishnan',
      review:
        'I had an amazing stay at Chemparathi Resort. The location is serene and surrounded by beautiful greenery, making it a perfect escape from busy city life. The rooms were spotless, spacious, and very comfortable. The staff were extremely friendly and attentive, always ensuring we had everything we needed. The food was delicious and freshly prepared. Overall, it was a refreshing and memorable experience. Highly recommended!',
      date: 'March 2026',
      rating: 5,
    },
    {
      name: 'Akhil Mohan',
      review:
        'The atmosphere was calm, cozy, and peaceful, making it a truly relaxing place to stay. The climate and overall ambience added to the experience and were exceptionally pleasant. The service was excellent, with staff providing attentive and courteous hospitality throughout our stay. The food was also very good and well-prepared. The candlelight dinner was beautifully arranged and added a special touch to our stay. Overall, it was a wonderful experience, and we thoroughly enjoyed our time here.',
      date: 'July 2026',
      rating: 5,
    },
    {
      name: 'Farhan',
      review:
        'The property is tucked inside greenery with such peaceful vibes. The thatched cottages, clean lawns, and warm hospitality made our trip special. The staff were very courteous and responsive. If you want to wake up to birds, mist, and pure calm—this is the place. Highly recommended for couples and families. We’ll definitely come back! Thank you, Team Chembarathi.',
      date: 'July 2026',
      rating: 5,
    },
  ];

  /* Derived, not hardcoded: the headline number used to sit at 4.7 while every
     card on screen read 5, which reads as invented the moment anyone checks. */
  const averageRating =
    customerFeedback.reduce((sum, item) => sum + item.rating, 0) /
    customerFeedback.length;

  const CleanlinessRating = 5.0;
  const CheckInRating = 4.8;
  const CommunicationRating = 5.0;
  const LocationRating = 5.0;

  const items = customerFeedback.map((review, index) => ({
    node: <UserReviewCard key={index} {...review} />,
  }));

  return (
    <div>
      <div className="section-wrapper flex flex-col justify-center gap-(--spacing-padding-10x)">
        <div className="flex flex-col">
          <div className="flex justify-center items-center">
            <WreathRingLeft />
            <span className="text-center text-h2 xs:!text-h3 text-(--typography-color-secondary-100) font-secondary">
              {averageRating.toFixed(1)}
            </span>
            <WreathRingRight />
          </div>

          <span className="text-center text-xxl-regular xs:!text-lg-regular text-(--typography-color-secondary-600) font-secondary">
            We’re proud to deliver a stay that guests consistently love.
          </span>
        </div>

        {/* Ratings */}
        <div className="flex flex-row gap-[24px] justify-center mx-auto self-center">
          <RatingItem rating={CleanlinessRating} label="Cleanliness" />
          <RatingItem rating={CheckInRating} label="Check-in" />
          <RatingItem rating={CommunicationRating} label="Communication" />
          <RatingItem rating={LocationRating} label="Location" />
        </div>
      </div>

      {/* Desktop loop */}
      <div className="pb-(--spacing-padding-huge-x)! xs:!hidden">
        <InfiniteLoopWrapper items={items} alignItems="start" />
      </div>

      {/* Mobile static cards */}
      <div className="px-(--spacing-padding-4x)! hidden xs:!flex pb-(--spacing-padding-huge-x)! flex-col gap-[24px]">
        {items.map((item, index) => (
          <div key={index}>{item.node}</div>
        ))}
      </div>
    </div>
  );
}

function RatingItem({
  rating,
  label,
}: Readonly<{ rating: number; label: string }>) {
  return (
    <div className="flex flex-col justify-center items-center">
      <span className="text-h3 xs:!text-body-xl text-(--typography-color-secondary-500) font-secondary">
        {rating.toFixed(1)}
      </span>

      <span className="text-body-lg xs:!text-body-md text-(--typography-color-secondary-500) leading-6 text-center whitespace-nowrap font-secondary">
        {label}
      </span>
    </div>
  );
}
