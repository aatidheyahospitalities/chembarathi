import '@/styles/globals.css';
import type { Metadata } from 'next';
import Header from './components/Header';
import { Figtree } from 'next/font/google';
import GalleryLoop from './components/GalleryLoop';
import SmoothScroll from './components/SmoothScroll';
import BottomBarSection from './components/BottomBarSection';
import RouteScrollManager from './components/RouteScrollManager';
import PageTransitionProvider from './components/PageTransition';

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
});

export const metadata: Metadata = {
  title: 'Chembarathi Wayanad',
  description: 'Welcome to Chembarathi',
  icons: {
    icon: '/Icons/Favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={figtree.variable}>
      <head>
        {/* Material Symbols is an icon font, and the spans using it render
            ligature text as their children, so display=block hides that text
            until the font arrives rather than flashing the raw ligature
            (swap) or risking the icons never loading at all (optional, which
            is what the lint rule prefers). no-page-custom-font looks for
            pages/_document.js; the App Router's equivalent is this root
            layout, so it does not apply. */}
        {/* eslint-disable-next-line @next/next/google-font-display, @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block"
        />
      </head>
      <body suppressHydrationWarning>
        <PageTransitionProvider>
          <RouteScrollManager />
          <Header />
          <SmoothScroll>
            <main className="min-h-screen relative z-0">{children}</main>
            <GalleryLoop />
            <BottomBarSection />
          </SmoothScroll>
        </PageTransitionProvider>
      </body>
    </html>
  );
}
