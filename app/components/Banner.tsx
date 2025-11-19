import { getHeroSection } from "../lib/services/getHeroSection";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { HeroData } from "../lib/type";

export default async function Banner() {
  const data = await getHeroSection();
  const heroData: HeroData = data.items[0] || {};
  const heroTitle = heroData?.fields?.heroTitle || "";
  const heroImage = heroData?.fields?.heroImage?.fields?.file?.url || "";
  const heroDescription = heroData?.fields?.heroDescription;

  return (
    <div 
      className="relative min-h-screen flex items-end justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(https:${heroImage})` }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      {/* Content */}
      <div className="relative z-10 flex py-10x px-huge-x justify-space-between text-white w-full">
        <h1>{heroTitle}</h1>
        <div className="text-xl md:text-2xl max-w-3xl mx-auto drop-shadow-md">
          {heroDescription && documentToReactComponents(heroDescription)}
        </div>
      </div>
    </div>
  );
}
