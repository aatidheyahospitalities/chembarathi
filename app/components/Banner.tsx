import { HeroType } from '../lib/type';

export default function Banner({ heroData }: Readonly<{ heroData: HeroType }>) {
  const heroTitle = heroData?.title || '';
  const heroImage = heroData?.image.url || '';

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-center bg-no-repeat bg-cover banner-wrapper"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 flex w-full text-white justify-center">
      <h1 className="text-center xs:!text-h4 w-[500px]">
  {heroTitle}
</h1>

      </div>
    </div>
  );
}
