import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { HeroData } from "../lib/type";

export default async function Banner({heroData}: {heroData: HeroData}) {
  const heroTitle = heroData?.fields.heroTitle || "";
  const heroImage = heroData?.fields.heroImage?.fields?.file?.url || "";
  const heroDescription = heroData?.fields.heroDescription;

  return (
    <div 
      className="relative flex items-end justify-center min-h-screen bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(https:${heroImage})` }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      {/* Content */}
      <div className="relative z-10 flex w-full text-white py-10x px-huge-x justify-space-between gap-(--spacing-padding-16x)">
        <h1 className="w-[50%]">{heroTitle}</h1>
        <div className="text-xl-regular w-[50%] text-(--typography-color-secondary-600)">
          {heroDescription && documentToReactComponents(heroDescription)}
        </div>
      </div>
    </div>
  );
}
