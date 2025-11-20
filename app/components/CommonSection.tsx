import CommonLinkButton from "./CommonLinkButton";

export default async function commonSection() {

  return (
    <div className="p-huge-x gap-(--spacing-padding-16x)" >
        <div className="flex gap-(--spacing-padding-16x)">
            <div className="flex flex-col gap-(--spacing-padding-3x) w-[50%]">
              <span className="text-md-regular text-(--typography-color-secondary-500)">About us</span>
              <h2 className="text-(--typography-color-secondary-100)">Nature, Comfort, Relax, Indulge</h2>
            </div>
            <div className="flex flex-col gap-(--spacing-padding-10x) w-[50%] text-start">
              <span className="text-xl-regular text-(--typography-color-secondary-800)">Nestled amidst breathtaking landscapes, our resort offers the perfect harmony of nature and luxury. Enjoy thoughtfully designed spaces, serene surroundings, and personalized experiences that let you relax, rejuvenate, and indulge in every moment of your stay.</span>
              <CommonLinkButton text="Learn More About Us"/>
            </div>
        </div>
        <div className="w-full h-[702px]"></div>
    </div>
  );
}
