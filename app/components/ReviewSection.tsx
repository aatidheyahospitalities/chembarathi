import WreathRingLeft from '../lib/Icos/WreathRingLeft copy';
import WreathRingRight from '../lib/Icos/WreathRingRight';

export default function ReviewSection() {
  return (
    <div>
      <div className="section-wrapper flex flex-col align-middle justify-center gap-(--spacing-padding-10x)">
        <div className="flex flex-col">
          <div className="flex justify-center align-middle">
            <WreathRingLeft />
            <span className="text-center text-h2 text-(--typography-color-secondary-100)">
              {4.7}
            </span>
            <WreathRingRight />
          </div>
          <span className="text-center text-xxl-regular text-(--typography-color-secondary-600)">
            We’re proud to deliver a stay that guests consistently love.
          </span>
        </div>
        <div className="grid grid-cols-4 gap-[26px] max-w-fit mx-auto">
          <div className="flex flex-col justify-center align-middle">
            <span className="text-h3 text-(--typography-color-secondary-500) font-regular text-center">
              5.0
            </span>
            <span className="text-body-lg text-(--typography-color-secondary-500) font-regular leading-6 text-center whitespace-nowrap">
              Cleanliness
            </span>
          </div>
          <div className="flex flex-col justify-center align-middle">
            <span className="text-h3 text-(--typography-color-secondary-500) font-regular text-center">
              5.0
            </span>
            <span className="text-body-lg text-(--typography-color-secondary-500) font-regular leading-6 text-center whitespace-nowrap">
              Accuracy
            </span>
          </div>
          <div className="flex flex-col justify-center align-middle">
            <span className="text-h3 text-(--typography-color-secondary-500) font-regular text-center">
              5.0
            </span>
            <span className="text-body-lg text-(--typography-color-secondary-500) font-regular leading-6 text-center whitespace-nowrap">
              Check-in
            </span>
          </div>
          <div className="flex flex-col justify-center align-middle">
            <span className="text-h3 text-(--typography-color-secondary-500) font-regular text-center">
              5.0
            </span>
            <span className="text-body-lg text-(--typography-color-secondary-500) font-regular leading-6 text-center whitespace-nowrap">
              Communication
            </span>
          </div>
        </div>
      </div>
      {/* Need to add the user review infinite scroll here.... */}
    </div>
  );
}
