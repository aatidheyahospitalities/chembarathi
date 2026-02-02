'use client';

import Link from 'next/link';

export default function NotFound() {
  const image = '/coming-soon.jpg'; // put this in /public

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* overlay */}
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
          Chembarathi Wayanad
        </span>

        <h1 className="text-heading-1 xs:!text-heading-3">
          Coming Soon
        </h1>

        <p className="text-body-lg text-white/90 font-secondary!">
          We’re preparing something special. This page isn’t live yet.
        </p>

        <Link
          href="/"
          className="px-(--spacing-padding-10x)! body-lg-reqular text-secondary-1000! py-(--spacing-padding-3x)! rounded-full! bg-(--typography-color-secondary-100)! hover:cursor-pointer font-secondary!"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
