'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Stay', href: '/stay' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  // 🔥 Close mobile menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Ignore tiny scroll jitter
      if (Math.abs(currentScrollY - lastScrollY.current) < 10) return;

      if (menuOpen) {
        setMenuOpen(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 z-[9999] w-full
        py-[24px]! px-huge-x!
        xs:!px-[16px] xs:!pt-[16px] xs:!pb-[0px]
        ${menuOpen ? 'xs:!bg-(--surface-primary-800)' : 'bg-transparent'}
      `}
    >
      <div className="flex justify-between items-center">
        <div className="hidden xs:!flex w-[10px] h-[10px]" />

        {/* LOGO */}
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

        {/* HAMBURGER */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="flex flex-col justify-center gap-[6px] xs:!flex hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`w-[24px] h-[2px] bg-white transition-all duration-300
              ${menuOpen ? 'rotate-45 translate-y-[8px]' : ''}`}
          />
          <span
            className={`w-[24px] h-[2px] bg-white transition-all duration-300
              ${menuOpen ? 'opacity-0 scale-x-0' : ''}`}
          />
          <span
            className={`w-[24px] h-[2px] bg-white transition-all duration-300
              ${menuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`}
          />
        </button>

        {/* DESKTOP MENU */}
        <nav className="xs:!hidden flex gap-(--spacing-padding-huge-x)">
          <div className="flex text-lg-med text-white items-center">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex py-[4px]! px-(--spacing-padding-6x)! items-center"
              >
                {item.label}
              </Link>
            ))}
          </div>

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

      {/* MOBILE MENU */}
      <nav
        className={`
          mt-[16px]
          xs:!flex hidden
          items-center flex-col
          text-white text-lg-med
          absolute top-full left-0 w-full
          bg-(--surface-primary-800)
          transition-all duration-300 ease-out
          origin-top
          ${
            menuOpen
              ? 'opacity-100 translate-y-0 scale-y-100 pointer-events-auto'
              : 'opacity-0 -translate-y-3 scale-y-95 pointer-events-none'
          }
        `}
      >
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            className="py-[12px]!"
          >
            {item.label}
          </Link>
        ))}

        <Link
          href="/book"
          onClick={() => setMenuOpen(false)}
          className="py-[12px]! mt-[8px]"
        >
          Book Now
        </Link>
      </nav>
    </header>
  );
}
