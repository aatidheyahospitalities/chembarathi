import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { HeroType } from '../lib/type';

export default function Banner({ heroData }: Readonly<{ heroData: HeroType }>) {
  const heroTitle = heroData?.title || '';
  const heroImage = heroData?.image.url || '';
  const heroDescription = heroData?.description.json || null;

  return (
    <div
      className="relative flex items-end justify-center min-h-screen bg-center bg-no-repeat bg-cover banner-wrapper"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      {/* Content */}
      <div className="relative z-10 flex w-full text-white justify-space-between gap-(--spacing-padding-16x)">
        <h1 className="w-[50%]">{heroTitle}</h1>
        <div className="text-xl-regular w-[50%] text-(--typography-color-secondary-600)">
          {heroDescription && documentToReactComponents(heroDescription)}
        </div>
      </div>
    </div>
  );
}
