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
  const CleanlinessRating = 4.7;
  const AccuracyRating = 4.7;
  const CheckInRating = 4.7;
  const CommunicationRating = 4.7;

  const items = customerFeedback.map((review, index) => ({
    node: <UserReviewCard key={index + 1} {...review} />,
  }));

  return (
    <div>
      <div className="section-wrapper flex flex-col align-middle justify-center gap-(--spacing-padding-10x)">
        <div className="flex flex-col">
          <div className="flex justify-center align-middle">
            <WreathRingLeft />
            <span className="text-center text-h2 text-(--typography-color-secondary-100)">
              {averageRating}
            </span>
            <WreathRingRight />
          </div>
          <span className="text-center text-xxl-regular text-(--typography-color-secondary-600)">
            We’re proud to deliver a stay that guests consistently love.
          </span>
        </div>
        <div className="grid grid-cols-4 gap-[26px] max-w-fit mx-auto self-center">
          <RatingItem rating={CleanlinessRating} label="Cleanliness" />
          <RatingItem rating={AccuracyRating} label="Accuracy" />
          <RatingItem rating={CheckInRating} label="Check-in" />
          <RatingItem rating={CommunicationRating} label="Communication" />
        </div>
      </div>
      <div className="pb-(--spacing-padding-huge-x)!">
        <InfiniteLoopWrapper items={items} alignItems="start" />
      </div>
    </div>
  );
}

function RatingItem({
  rating,
  label,
}: Readonly<{ rating: number; label: string }>) {
  return (
    <div className="flex flex-col justify-center align-middle">
      <span className="text-h3 text-(--typography-color-secondary-500) font-regular text-center">
        {rating}
      </span>
      <span className="text-body-lg text-(--typography-color-secondary-500) font-regular leading-6 text-center whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}
