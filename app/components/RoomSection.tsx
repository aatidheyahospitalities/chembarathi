import AnimatedHorizontalScroll from './HorizontalScroll';
import img from '../lib/img/36e809e51ea4fffe2472f329ee94c5dd89f56ef8.jpg';
import { StaticImageData } from 'next/image';

export default function RoomSection() {
  const Rooms = [
    {
      id: 1,
      name: 'Deluxe Room',
      discription:
        'Our Honeymoon Suite blends modern comfort and natural charm, creating the perfect space for unforgettable moments together.',
      image: img,
      features: [
        {
          name: 'Private Pool',
          icon: 'pool-icon.png',
        },
      ],
    },
    {
      id: 2,
      name: 'Superior Room',
      discription: 'Description for Superior Room',
      image: img,
      features: [
        {
          name: 'Private Pool',
          icon: 'pool-icon.png',
        },
      ],
    },
    {
      id: 3,
      name: 'Executive Suite',
      discription: 'Description for Executive Suite',
      image: img,
      features: [
        {
          name: 'Private Pool',
          icon: 'pool-icon.png',
        },
      ],
    },
    {
      id: 4,
      name: 'Presidential Suite',
      discription: 'Description for Presidential Suite',
      image: img,
      features: [
        {
          name: 'Private Pool',
          icon: 'pool-icon.png',
        },
      ],
    },
    {
      id: 5,
      name: 'Family Room',
      discription: 'Description for Family Room',
      image: img,
      features: [
        {
          name: 'Private Pool',
          icon: 'pool-icon.png',
        },
      ],
    },
    {
      id: 6,
      name: 'Single Room',
      discription: 'Description for Single Room',
      image: img,
      features: [
        {
          name: 'Private Pool',
          icon: 'pool-icon.png',
        },
      ],
    },
    {
      id: 7,
      name: 'Double Room',
      discription: 'Description for Double Room',
      image: img,
      features: [
        {
          name: 'Private Pool',
          icon: 'pool-icon.png',
        },
      ],
    },
    {
      id: 8,
      name: 'Twin Room',
      discription: 'Description for Twin Room',
      image: img,
      features: [
        {
          name: 'Private Pool',
          icon: 'pool-icon.png',
        },
      ],
    },
    {
      id: 9,
      name: 'Studio Room',
      discription: 'Description for Studio Room',
      image: img,
      features: [
        {
          name: 'Private Pool',
          icon: 'pool-icon.png',
        },
      ],
    },
    {
      id: 10,
      name: 'Penthouse Suite',
      discription: 'Description for Penthouse Suite',
      image: img,
      features: [
        {
          name: 'Private Pool',
          icon: 'pool-icon.png',
        },
      ],
    },
  ];

  return (
    <div>
      <AnimatedHorizontalScroll
        header={
          <div className={`flex flex-col gap-(--spacing-padding-3x)!`}>
            <span className="text-md-regular text-(--typography-color-secondary-500) text-center">
              ACCOMMODATIONS
            </span>
            <h2 className="text-(--typography-color-secondary-100) text-center xs:!text-h4">
              Rooms & Suites
            </h2>
          </div>
        }
      >
        {Rooms.map(room => (
          <Room
            key={room.id}
            title={room.name}
            description={room.discription}
            image={room.image}
            features={room.features}
          />
        ))}
      </AnimatedHorizontalScroll>
    </div>
  );
}
function Room({
  title,
  description,
  image,
  features,
}: Readonly<{
  title?: string;
  description?: string;
  image?: StaticImageData | string;
  features?: Array<{ name: string; icon: string }>;
}>) {
  const imageUrl = typeof image === 'string' ? image : image?.src || '';

  return (
    <div className="w-150 h-full flex-1 rounded-4xl! overflow-hidden group cursor-pointer xs:w-[300px]">
      <div
        className="relative flex flex-col justify-end w-full h-full overflow-hidden align-bottom bg-gray-300 rounded-lg shadow-lg"
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Subtle gradient overlay for text readability on hover */}
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-linear-to-t from-black/50 via-transparent to-transparent group-hover:opacity-100"></div>

        {/* Text content - hidden by default, visible on hover */}
        <div className="px-6x! py-16x! flex gap-(--spacing-padding-10x) justify-between relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-col gap-3">
            <h5 className="text-white">{title || 'Room Title'}</h5>
            <p className="text-gray-200 text-lg-regular">
              {description || 'Room Description'}
            </p>
          </div>
          <div className="flex flex-col self-end">
            {features?.map((feature, index) => (
              <div key={index + 1} className="flex items-center gap-2 mt-2">
                <span className="text-white">+</span>
                <span className="text-white">{feature.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
