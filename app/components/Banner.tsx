import { HeroType } from '../lib/type';

export default function Banner({ heroData }: Readonly<{ heroData: HeroType }>) {
  const title = heroData?.title || '';
  const image = heroData?.image?.url || '';

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex flex-col items-center text-center text-white gap-4 px-4 max-w-3xl">
        <span
          className="
    inline-flex
    items-center
    justify-center
    align-middle
    px-4! py-[2px]!
    rounded-full
    bg-white/10
    text-sm
    font-medium
    backdrop-blur-sm
  "
        >
          Luxury Stay
        </span>

        {/* Title */}
        <h1 className="text-heading-1 xs:!text-h4">{title}</h1>

        {/* Description — correct paragraph style */}
        <p className="text-body-lg text-white/90">
          Peace comfort nature luxury escape
        </p>

        <button className="px-(--spacing-padding-10x)! body-lg-reqular text-secondary-1000! py-(--spacing-padding-3x)! rounded-full! bg-(--typography-color-secondary-100)!">
          Book Your Stay
        </button>
      </div>
    </section>
  );
}
