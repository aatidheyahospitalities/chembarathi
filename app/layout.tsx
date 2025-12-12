import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import SmoothScroll from './components/SmoothScroll';

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
});

export const metadata: Metadata = {
  title: 'Chembarathi',
  description: 'Welcome to Chembarathi',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={figtree.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <SmoothScroll>
          {' '}
          {/* ✅ wrapped, everything else untouched */}
          {/* Header - shared across all pages */}
          {/* <header className="border-b border-gray-200 dark:border-gray-800">
            <nav className="container px-4 py-4 mx-auto">
              <h1 className="text-2xl font-bold">Chembarathi</h1>
            </nav>
          </header> */}
          {/* Main content - each page renders here */}
          <main className="min-h-screen">{children}</main>
          {/* Footer - shared across all pages */}
          {/* <footer className="mt-16 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <div className="container px-4 py-8 mx-auto text-center text-gray-600 dark:text-gray-400">
              <p>&copy; 2025 Chembarathi. All rights reserved.</p>
            </div>
          </footer> */}
        </SmoothScroll>
      </body>
    </html>
  );
}
