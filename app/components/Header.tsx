'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { onScrollPosition, scrollToElement } from '../lib/scroll';
import { useTransitionRouter } from './PageTransition';

import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { openWhatsApp } from '../Services/openWhatsApp';

type NavItem = {
  label: string;
  href: string;
  id: string;
  /** Points at a real route rather than a homepage anchor. */
  isRoute?: boolean;
};

const navItems: NavItem[] = [
  { label: 'About', href: '/about', id: 'about', isRoute: true },
  {
    label: 'Experience',
    href: '/experience',
    id: 'experience',
    isRoute: true,
  },
  { label: 'Suites & Cottages', href: '#suites', id: 'suites' },
  { label: 'Gallery', href: '/gallery', id: 'gallery', isRoute: true },
  { label: 'Reviews', href: '#reviews', id: 'reviews' },
  { label: 'FAQs', href: '#faqs', id: 'faqs' },
];

/** Matches the fixed headers height, so anchored sections clear it. */
const HEADER_OFFSET = 'top 80px';

/** Within this many pixels of the top, the header counts as being at rest. */
const TOP_THRESHOLD = 8;

/** Matches the protected top zone used by the Elementis reference header. */
const HIDE_START = 130;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  const router = useTransitionRouter();
  const pathname = usePathname();

  const lastScrollY = useRef(0);
  const hasScrollPosition = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  /** Section to scroll to once the homepage has mounted, set by anchor
   * clicks made from another route. */
  const pendingSectionRef = useRef<string | null>(null);

  /*
   * Hide/show on scroll, and the background that comes with it.
   *
   * The background is tied to the scroll-up reveal rather than to a scroll
   * offset. Previously it switched on 8px past the top, which painted a solid
   * band across a hero still filling the viewport — the header is transparent
   * precisely so the hero reads as full-bleed. Scrolling down now slides the
   * header away while it is still transparent, and it only picks up a
   * background on the way back in, where it sits over real content and needs
   * one to stay legible. Returning to the top drops it again.
   */
  useEffect(() => {
    const handlePosition = (currentY: number) => {
      if (!hasScrollPosition.current) {
        hasScrollPosition.current = true;
        lastScrollY.current = currentY;
        return;
      }

      if (currentY <= TOP_THRESHOLD) {
        setHeaderVisible(true);
        setScrolled(false);
        lastScrollY.current = currentY;
        return;
      }

      const delta = currentY - lastScrollY.current;
      lastScrollY.current = currentY;

      if (currentY <= HIDE_START) return;

      if (delta > 0) {
        setHeaderVisible(false);
        // Functional update so this effect doesn't depend on `menuOpen` —
        // it now holds a per-frame ticker subscription, which should not be
        // torn down and rebuilt every time the menu toggles.
        setMenuOpen(open => (open ? false : open));
      } else if (delta < 0) {
        setHeaderVisible(true);
        setScrolled(true);
      }
    };

    return onScrollPosition(handlePosition);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    // Route items have no in-page section to observe.
    const sectionIds = navItems
      .filter(item => !item.isRoute)
      .map(item => item.id);

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
  }, [pathname]);

  // Finishes an anchor click made from another route, once the homepage has
  // mounted and the target section exists.
  useEffect(() => {
    const id = pendingSectionRef.current;
    if (!id || pathname !== '/') return;

    let attempts = 0;
    const timer = window.setInterval(() => {
      const target = document.getElementById(id);

      if (target) {
        pendingSectionRef.current = null;
        window.clearInterval(timer);
        void scrollToElement(target, false, HEADER_OFFSET);
        return;
      }

      attempts += 1;
      if (attempts > 20) {
        pendingSectionRef.current = null;
        window.clearInterval(timer);
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, [pathname]);

  // Smooth scroll with header offset. Route items fall through to <Link>.
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
      setMenuOpen(false);

      if (item.isRoute) return;

      e.preventDefault();

      // Anchors live on the homepage. From any other route, go there first
      // and let the pending-scroll effect finish once it has mounted.
      if (pathname !== '/') {
        pendingSectionRef.current = item.id;
        router.push('/');
        return;
      }

      const target = document.getElementById(item.id);
      if (!target) return;

      void scrollToElement(target, false, HEADER_OFFSET);
    },
    [pathname, router]
  );

  const isActive = (item: NavItem) =>
    item.isRoute
      ? pathname === item.href
      : pathname === '/' && activeSection === item.id;

  return (
    <header
      /* Colour and border get their own, slower curve rather than riding the
         slide's 300ms ease-out — matched to the transform they arrive as an
         abrupt block, so they fade over 500ms on a symmetric ease instead.

         The hairline is what makes the reveal legible at all on most routes:
         `--surface-primary-800` is #151e19, the exact colour `globals.css`
         paints on `body`, so the background alone only ever showed up where
         the header sat over imagery — the homepage and experience heroes.
         `--surface-primary-500` is the same hairline used by `BlogRow`,
         `ArticleMasthead`, `RelatedPosts` and `BottomBarSection`. The border
         is always present and only changes colour, so nothing shifts by a
         pixel when it comes and goes. */
      data-visible={headerVisible}
      className={`site-header fixed top-0 left-0 z-[9999] w-full
        border-b!
        py-[24px]! px-huge-x!
        xs:!px-[16px] xs:!pt-[16px] xs:!pb-[0px]

        ${
          scrolled
            ? 'bg-(--surface-primary-800) border-(--surface-primary-500)!'
            : 'bg-transparent border-transparent!'
        }

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
        <nav
          className="xs:!hidden flex gap-(--spacing-padding-huge-x)"
          aria-label="Main navigation"
        >
          <div className="flex text-lg-med text-white items-center">
            {navItems.map(item => (
              <Link
                key={item.id}
                href={item.href}
                id={`nav-${item.id}`}
                onClick={e => handleNavClick(e, item)}
                className={`flex py-[4px]! px-(--spacing-padding-6x)! items-center transition-opacity duration-200
                  ${isActive(item) ? 'opacity-100' : 'opacity-60 hover:opacity-100'}
                `}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-1 justify-end text-lg-med text-white items-center">
            <button
              className="flex py-[4px]! px-(--spacing-padding-6x)! items-center cursor-pointer"
              onClick={() =>
                window.open(
                  'https://bookingengine.stayflexi.com/?hotel_id=28009',
                  '_blank'
                )
              }
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
          overflow-hidden
          motion-reduce:transition-none
          ${
            menuOpen
              ? 'max-h-[420px] opacity-100 translate-y-0 pointer-events-auto'
              : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'
          }
        `}
        aria-hidden={!menuOpen}
      >
        {navItems.map(item => (
          <Link
            key={item.id}
            href={item.href}
            id={`mobile-nav-${item.id}`}
            onClick={e => handleNavClick(e, item)}
            className={`py-[12px]! w-full text-center transition-opacity duration-200
              ${isActive(item) ? 'opacity-100' : 'opacity-70'}
            `}
          >
            {item.label}
          </Link>
        ))}

        <button
          onClick={() => {
            setMenuOpen(false);
            window.open(
              'https://bookingengine.stayflexi.com/?hotel_id=28009',
              '_blank'
            );
          }}
          className="py-[12px]! mt-[8px] cursor-pointer"
        >
          Book Now
        </button>
      </nav>
    </header>
  );
}
