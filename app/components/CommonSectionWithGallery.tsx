import Image from 'next/image';
import { ContentSectionWithGalleryType } from '../lib/type';

export default function commonSection({
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
      <div
        className={`flex gap-(--spacing-padding-16x) w-full xs:!flex-col xs:!gap-(--spacing-padding-6x)`}
      >
        <div
          className={`flex flex-col gap-(--spacing-padding-3x) w-[50%] xs:w-full`}
        >
          <span className="text-md-regular text-(--typography-color-secondary-500)">
            {eyebrow}
          </span>
          <h2 className="text-(--typography-color-secondary-100) xs:!text-h4">
            {title}
          </h2>
        </div>
        <div
          className={`flex flex-col gap-(--spacing-padding-10x) w-[50%] text-start xs:w-full`}
        >
          <span className="text-xl-regular text-(--typography-color-secondary-800) xs:!text-body-lg">
            {description}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-12 grid-rows-2 gap-(--spacing-padding-4x) w-full h-150 xs:h-auto xs:!grid-cols-3 xs:!grid-rows-1">
        {image.slice(0, 6).map((img, index) => {
          // Define span for each image position with responsive breakpoints
          const spanClasses = [
            'xs:col-span-3 3xl:col-span-3 md:col-span-3', // Image 1: narrow
            'xs:col-span-3 3xl:col-span-5 md:col-span-5', // Image 2: widest
            'xs:col-span-3 3xl:col-span-4 md:col-span-4', // Image 3: wider
            'xs:col-span-5 3xl:col-span-5 md:col-span-5', // Image 4: widest
            'xs:col-span-3 3xl:col-span-3 md:col-span-3', // Image 5: narrow
            'xs:col-span-4 3xl:col-span-4 md:col-span-4', // Image 6: wider
          ];

          return (
            <div
              key={index + 1}
              className={`relative w-full h-full ${spanClasses[index]} ${index >= 3 ? 'xs:!hidden' : `${index === 1 ? 'xs:aspect-[3/4]' : 'xs:aspect-video'}`}`}
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
