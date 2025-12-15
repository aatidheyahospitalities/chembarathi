export default function BottomBarSection() {
  const items = [
    {
      title: 'Cottages',
      subItems: [
        'Cottages & Suites',
        'Premium Cottage',
        'Private Pool Villa',
        'Honeymoon suite',
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
      title: 'Engagement/Social',
      subItems: [
        'Reviews',
        'Testimonials',
        'Careers / Join Our Team',
        'Partner with Us',
      ],
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between w-full border-b! section-wrapper border-(--surface-primary-500)! gap-16 ">
        <h2 style={{ color: 'var(--typography-color-secondary-100)' }}>
          Reconnect With Nature
        </h2>
        <button className="px-(--spacing-padding-10x)! py-(--spacing-padding-3x)! rounded-full! text-lg-medium bg-(--typography-color-secondary-100)! text-xl-regular">
          Book Your Stay Today
        </button>
      </div>
      <div className="flex flex-col section-wrapper gap-(--spacing-padding-10x)! align-middle justify-center">
        <div className="flex gap-[52px] align-middle justify-between">
          {items.map((item, index) => (
            <ListItem
              key={index + 1}
              title={item.title}
              subItems={item.subItems}
            />
          ))}
        </div>
        <span className="font-primary text-[200px] text-(--typography-color-primary-600)! text-center">
          Chembarathi
        </span>
        <div className="flex justify-between align-middle">
          <span className="flex text-xl-regular text-(--typography-color-primary-400)">
            © 2025 Chembarathi Wayanad. All Rights Reserved.
          </span>
          <div className="flex gap-12 ">
            <span className="flex text-xl-regular text-(--typography-color-primary-400)">
              Privacy Policy
            </span>
            <span className="flex text-xl-regular text-(--typography-color-primary-400)">
              Terms & Conditions
            </span>
            <span className="flex text-xl-regular text-(--typography-color-primary-400)">
              Cancellation Policy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListItem({
  title,
  subItems,
}: Readonly<{ title: string; subItems: string[] }>) {
  return (
    <div className="flex flex-col gap-(--spacing-padding-3x) flex-1">
      <h3 className="text-xxl-regular text-(--typography-color-primary-400)">
        {title}
      </h3>
      <div className="flex flex-col align-middle justify-center gap-(--spacing-padding-2x)">
        {subItems.map((subItem, index) => (
          <span
            key={index + 1}
            className="text-lg-regular text-(--typography-color-secondary-700)"
          >
            {subItem}
          </span>
        ))}
      </div>
    </div>
  );
}
