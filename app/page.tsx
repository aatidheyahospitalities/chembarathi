import { getHeroSection } from "@/lib/services/getHeroSection";

export default async function Home() {
  console.log("Fetching data for Home page");
  const data = await getHeroSection();
  console.log("Fetched data:", data);
  const heroData = data.items;
  console.log("Hero Data in Home component:", heroData);

  return (
    <div className="bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to Chembarathi
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your Next.js application is ready to go. Start building something amazing!
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">⚡</div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">Fast Performance</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Built with Next.js 16 for lightning-fast page loads and optimal performance.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎨</div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">Beautiful Design</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Styled with Tailwind CSS for modern, responsive, and customizable interfaces.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">Ready to Deploy</h2>
            <p className="text-gray-600 dark:text-gray-300">
              TypeScript configured and ready for production deployment.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex flex-wrap gap-4 justify-center">
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              View Documentation
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors shadow-lg hover:shadow-xl dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

