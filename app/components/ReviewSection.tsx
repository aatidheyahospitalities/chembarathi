import WreathRingLeft from '../lib/Icos/WreathRingLeft copy';
import WreathRingRight from '../lib/Icos/WreathRingRight';
import InfiniteLoopWrapper from './InfiniteLoopWrapper';
import UserReviewCard from './UserReviewCard';

export default function ReviewSection() {
  const customerFeedback = [
    {
      name: 'Elena G.',
      place: 'Barcelona, Spain',
      review:
        'The private pool villa was luxurious and offered stunning views. The service was impeccable, and we felt pampered throughout our stay.',
      date: 'August 20, 2025',
      rating: 4.8,
    },
    {
      name: 'Kenji T.',
      place: 'Kyoto, Japan',
      review:
        'Serene and beautiful. The forest therapy walk was a highlight, and the food was exceptional. A perfect escape from the city.',
      date: 'November 15, 2025',
      rating: 4.9,
    },
    {
      name: 'Sophie M.',
      place: 'Paris, France',
      review:
        'Absolutely magical! The attention to detail was incredible. Loved the sustainable practices and organic meals. Will definitely return.',
      date: 'September 5, 2025',
      rating: 5,
    },
    {
      name: 'Raj P.',
      place: 'Mumbai, India',
      review:
        'A truly rejuvenating experience. The yoga sessions at sunrise and the ayurvedic spa treatments were world-class. Highly recommended!',
      date: 'October 12, 2025',
      rating: 4.7,
    },
    {
      name: 'Lisa K.',
      place: 'New York, USA',
      review:
        'The perfect blend of luxury and nature. Staff went above and beyond to make our anniversary special. The treehouse suite was amazing!',
      date: 'July 28, 2025',
      rating: 4.9,
    },
    {
      name: 'Marco R.',
      place: 'Rome, Italy',
      review:
        'Exceeded all expectations! The organic farm-to-table dining, peaceful surroundings, and warm hospitality made this an unforgettable stay.',
      date: 'December 1, 2025',
      rating: 5,
    },
  ];

  const averageRating = 4.7;
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
        {items.slice(0, 2).map((item, index) => (
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
