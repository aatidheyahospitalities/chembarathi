'use client';

import { useRouter } from 'next/navigation';

export default function BottomBarSection() {
  const router = useRouter();

  const items = [
    {
      title: 'Cottages',
      subItems: [
        'Cottages & Suites',
        'Premium Cottage',
        'Private Pool Villa',
        'Honeymoon Suite',
      ],
    },
    {
      title: 'Quick Links',
      subItems: [
        'Home',
        'About',
        'Amenities',
        'Gallery',
        'Blog',
        'Book',
        'Contact',
      ],
    },
    {
      title: 'Engagement',
      subItems: [
        'Reviews',
        'Testimonials',
        'Careers',
        'Partner with Us',
      ],
    },
  ];

  const routeMap: Record<string, string> = {
    Home: '/',
    About: '/about',
    Amenities: '/amenities',
    Gallery: '/gallery',
    Blog: '/blog',
    Book: '/book',
    Contact: '/contact',
    Reviews: '/reviews',
    Testimonials: '/testimonials',
    Careers: '/careers',
    'Partner with Us': '/partner',
    'Cottages & Suites': '/cottages',
    'Premium Cottage': '/premium-cottage',
    'Private Pool Villa': '/private-pool-villa',
    'Honeymoon Suite': '/honeymoon-suite',
  };

  return (
    <footer dir="ltr" className="flex flex-col">
      {/* CTA */}
      <div
        className="flex items-center xs:!items-start justify-between w-full border-b section-wrapper gap-16 xs:!gap-[27px] xs:!flex-col"
        style={{ borderColor: 'var(--surface-primary-500)' }}
      >
        <h2
          className="text-heading-2 xs:!text-heading-4"
          style={{ color: 'var(--typography-color-secondary-100)' }}
        >
          Reconnect With Nature
        </h2>

        <button
          onClick={() => router.push('/book')}
          className="px-(--spacing-padding-10x)! py-(--spacing-padding-3x)! rounded-full! cursor-pointer hover:opacity-80 transition"
          style={{
            background: 'var(--typography-color-secondary-100)',
            color: 'var(--typography-color-secondary-1000)',
          }}
        >
          Book Your Stay Today
        </button>
      </div>

      {/* Links */}
      <div className="flex flex-col section-wrapper gap-(--spacing-padding-10x)! xs:!gap-(--spacing-padding-8x)!">
        <nav className="flex gap-[52px] justify-between xs:!flex-col">
          {items.map(item => (
            <ListItem
              key={item.title}
              title={item.title}
              subItems={item.subItems}
              routeMap={routeMap}
            />
          ))}
        </nav>

        <span
          aria-hidden
          className="font-primary text-center"
          style={{
            fontSize: 'clamp(2rem, 15vw, 12.5rem)',
            color: 'var(--typography-color-primary-600)',
          }}
        >
          Chembarathi
        </span>

        <div className="flex justify-between xs:!flex-col-reverse xs:!gap-[24px]">
          <span
            className="text-xl-regular xs:!text-md-regular"
            style={{ color: 'var(--typography-color-primary-400)' }}
          >
            © {new Date().getFullYear()} Chembarathi Wayanad. All Rights Reserved.
          </span>

          <div className="flex gap-12 xs:!gap-[12px] xs:!flex-col">
            {['Privacy Policy', 'Terms & Conditions', 'Cancellation Policy'].map(text => (
              <button
                key={text}
                onClick={() => router.push('/')}
                className="text-xl-regular xs:!text-md-regular text-left cursor-pointer hover:opacity-70 transition"
                style={{ color: 'var(--typography-color-primary-400)' }}
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function ListItem({
  title,
  subItems,
  routeMap,
}: {
  title: string;
  subItems: string[];
  routeMap: Record<string, string>;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-(--spacing-padding-3x) flex-1">
      <h3
        className="text-lg-regular uppercase"
        style={{ color: 'var(--typography-color-primary-400)' }}
      >
        {title}
      </h3>

      <ul className="flex flex-col gap-(--spacing-padding-2x)">
        {subItems.map(subItem => (
          <li key={subItem}>
            <button
              onClick={() => router.push(routeMap[subItem] || '/')}
              className="text-lg-regular text-left cursor-pointer hover:opacity-70 transition"
              style={{ color: 'var(--typography-color-secondary-700)' }}
            >
              {subItem}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
