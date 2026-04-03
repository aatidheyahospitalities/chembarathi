'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { openWhatsApp } from '../Services/openWhatsApp';

const navItems = [
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Experience', href: '#experience', id: 'experience' },
  { label: 'Suites & Cottages', href: '#suites', id: 'suites' },
  { label: 'Gallery', href: '#gallery', id: 'gallery' },
  { label: 'Reviews', href: '#reviews', id: 'reviews' },
  { label: 'FAQs', href: '#faqs', id: 'faqs' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  const lastScrollY = useRef(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Hide/show on scroll & scrolled state
  useEffect(() => {
    const TOP_THRESHOLD = 8;

    const handleScroll = () => {
      const currentY = Math.max(
        window.scrollY,
        document.documentElement.scrollTop,
        document.body.scrollTop
      );
      const isNearTop = currentY <= TOP_THRESHOLD;

      setScrolled(!isNearTop);

      if (isNearTop) {
        setHeaderVisible(true);
        lastScrollY.current = 0;
        return;
      }

      if (Math.abs(currentY - lastScrollY.current) < 10) return;

      if (currentY > lastScrollY.current) {
        setHeaderVisible(false);
        if (menuOpen) setMenuOpen(false);
      } else {
        setHeaderVisible(true);
      }

      lastScrollY.current = currentY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuOpen]);

  // Active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = navItems.map(item => item.id);

    // Track which sections are visible and their ratio
    const visibilityMap = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          visibilityMap.set(entry.target.id, entry.intersectionRatio);
        });

        // Pick the section with highest visibility ratio
        let maxRatio = 0;
        let mostVisible = '';
        visibilityMap.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            mostVisible = id;
          }
        });

        if (mostVisible) setActiveSection(mostVisible);
      },
      {
        rootMargin: '-80px 0px -20% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
      }
    );

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  // Smooth scroll with header offset
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMenuOpen(false);

      const id = href.replace('#', '');
      const target = document.getElementById(id);
      if (!target) return;

      const headerHeight = 80;
      const top =
        target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    },
    []
  );

  return (
    <header
      className={`fixed top-0 left-0 z-[9999] w-full
        transition-transform duration-300 ease-out
        ${headerVisible ? 'translate-y-0' : '-translate-y-full'}

        py-[24px]! px-huge-x!
        xs:!px-[16px] xs:!pt-[16px] xs:!pb-[0px]

        ${scrolled ? 'bg-(--surface-primary-800)' : 'bg-transparent'}

        ${menuOpen ? 'xs:!bg-(--surface-primary-800)' : ''}
      `}
    >
      <div className="flex justify-between items-center">
        {/* WhatsApp icon – mobile left */}
        <div className="hidden xs:!flex w-[50px] h-[50px] items-center">
          <WhatsAppIcon
            fontSize="small"
            className="text-white cursor-pointer"
            onClick={() => openWhatsApp('')}
          />
        </div>

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
          aria-expanded={menuOpen}
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
        <nav className="xs:!hidden flex gap-(--spacing-padding-huge-x)" aria-label="Main navigation">
          <div className="flex text-lg-med text-white items-center">
            {navItems.map(item => (
              <a
                key={item.id}
                href={item.href}
                id={`nav-${item.id}`}
                onClick={e => handleNavClick(e, item.href)}
                className={`flex py-[4px]! px-(--spacing-padding-6x)! items-center transition-opacity duration-200
                  ${activeSection === item.id ? 'opacity-100' : 'opacity-60 hover:opacity-100'}
                `}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex flex-1 justify-end text-lg-med text-white items-center">
            <button
              className="flex py-[4px]! px-(--spacing-padding-6x)! items-center cursor-pointer"
              onClick={() => openWhatsApp('')}
            >
              Book Now
            </button>
          </div>
        </nav>
      </div>

      {/* MOBILE MENU */}
      <nav
        aria-label="Mobile navigation"
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
          <a
            key={item.id}
            href={item.href}
            id={`mobile-nav-${item.id}`}
            onClick={e => handleNavClick(e, item.href)}
            className={`py-[12px]! w-full text-center transition-opacity duration-200
              ${activeSection === item.id ? 'opacity-100' : 'opacity-70'}
            `}
          >
            {item.label}
          </a>
        ))}

        <button
          onClick={() => {
            setMenuOpen(false);
            openWhatsApp('');
          }}
          className="py-[12px]! mt-[8px] cursor-pointer"
        >
          Book Now
        </button>
      </nav>
    </header>
  );
}
