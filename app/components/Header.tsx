'use client';

import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Stay', href: '/stay' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 z-[9999] w-full py-[24px]! px-huge-x! border-b! border-white!">
      <div className="flex justify-between">
        {/* LOGO */}
        <div className="flex items-center">
          <Link href="/" aria-label="Homepage">
            <Image
              src="/logo-white.svg"
              alt="Chembarathi Wayanad"
              width={140}
              height={40}
              priority
              style={{ width: '140px', height: '40px', objectFit: 'contain' }}
            />
          </Link>
        </div>

        {/* MENU — FIXED */}
        <nav
          aria-label="Primary navigation"
          className="flex gap-(--spacing-padding-huge-x)"
        >
          <div className="flex text-lg-med text-white items-center">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex py-[4px]! px-(--spacing-padding-6x)! items-center "
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-1 justify-end text-lg-med text-white items-center">
            <Link
              href="/book"
              className="flex py-[4px]! px-(--spacing-padding-6x)! items-center"
            >
              Book Now
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
