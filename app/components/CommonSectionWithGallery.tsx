import Image from 'next/image';
import { ContentSectionWithGalleryType } from '../lib/type';

export default async function commonSection({
  commonSectionData,
}: {
  commonSectionData: ContentSectionWithGalleryType;
}) {
  const title = commonSectionData?.title || '';
  const description = commonSectionData?.description || '';
  const eyebrow = commonSectionData?.eyebrow || '';
  const image = commonSectionData?.multipleimgCollection?.items || [];

  return (
    <div
      className={`section-wrapper gap-(--spacing-padding-16x) flex flex-col `}
    >
      <div className={`flex gap-(--spacing-padding-16x) w-full`}>
        <div className={`flex flex-col gap-(--spacing-padding-3x) w-[50%]`}>
          <span className="text-md-regular text-(--typography-color-secondary-500)">
            {eyebrow}
          </span>
          <h2 className="text-(--typography-color-secondary-100)">{title}</h2>
        </div>
        <div
          className={`flex flex-col gap-(--spacing-padding-10x) w-[50%] text-start`}
        >
          <span className="text-xl-regular text-(--typography-color-secondary-800)">
            {description}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-12 grid-rows-2 gap-(--spacing-padding-4x) w-full h-[600px]">
        {image.slice(0, 6).map((img, index) => {
          // Define span for each image position
          const spanClasses = [
            'col-span-3', // Image 1: narrow
            'col-span-5', // Image 2: widest
            'col-span-4', // Image 3: wider
            'col-span-5', // Image 4: widest
            'col-span-3', // Image 5: narrow
            'col-span-4', // Image 6: wider
          ];

          return (
            <div
              key={index + 1}
              className={`relative w-full h-full ${spanClasses[index]}`}
            >
              <Image
                src={img.url}
                alt="Gallery Image"
                className="object-cover rounded"
                fill
                loading="eager"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
