"use client";

import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Stay", href: "/stay" },
  { label: "Experiences", href: "/experiences" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 z-[9999] w-full">
      {/* HEADER BAR */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-md" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center">

          {/* LOGO */}
          <div className="flex flex-1 items-center">
            <Link href="/" aria-label="Homepage">
              <Image
                src="/logo-white.svg"
                alt="Chembarathi Wayanad"
                width={140}
                height={40}
                priority
              />
            </Link>
          </div>

          {/* MENU — FIXED */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-10 rounded-full bg-black/70 px-10 py-3"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white tracking-wide hover:text-white/70 transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex flex-1 justify-end">
            <Link
              href="/book"
              className="rounded-full border border-white/70 px-6 py-2 text-sm font-medium text-white hover:bg-white hover:text-black transition"
            >
              Book Now
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
