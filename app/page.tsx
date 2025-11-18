import { getHeroSection } from "@/lib/services/getHeroSection";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { Document } from "@contentful/rich-text-types";

interface HeroData {
  fields?: {
    heroTitle?: string;
    heroDescription?: Document;
    heroImage?: {
      fields?: {
        file?: {
          url?: string;
        };
      };
    };
  };
}

// This is a Server Component - data fetching happens on the server
export default async function HomePage() {
  // Fetch data directly in the component (no getStaticProps needed!)
  const data = await getHeroSection();
  const heroData: HeroData = data.items[0] || {};
  
  const heroTitle = heroData?.fields?.heroTitle || "";
  const heroImage = heroData?.fields?.heroImage?.fields?.file?.url || "";
  const heroDescription = heroData?.fields?.heroDescription;
  
  return (
    <div>
      {/* Hero Banner Section with Background Image */}
      <div 
        className="relative min-h-[600px] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(https:${heroImage})` }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 drop-shadow-lg">
            {heroTitle}
          </h1>
          <div className="text-xl md:text-2xl max-w-3xl mx-auto drop-shadow-md">
            {heroDescription && documentToReactComponents(heroDescription)}
          </div>
        </div>
      </div>
    </div>
  );
}