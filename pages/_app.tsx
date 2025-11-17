import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Header - shared across all pages */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <nav className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Chembarathi</h1>
        </nav>
      </header>

      {/* Main content - each page renders here */}
      <main className="min-h-screen">
        <Component {...pageProps} />
      </main>

      {/* Footer - shared across all pages */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 Chembarathi. All rights reserved.</p>
          <p>&copy; 2025 Chembarathi. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
