import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import SmoothScroll from './components/SmoothScroll';
import Header from './components/Header';

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
});

export const metadata: Metadata = {
  title: 'Chembarathi Wayanad',
  description: 'Welcome to Chembarathi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={figtree.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body suppressHydrationWarning>
        <Header />
        <SmoothScroll>
          <main className="min-h-screen pt-20 relative z-0">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
