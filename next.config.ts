import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['images.ctfassets.net'], // Add the Contentful image domain here
  },
  // Enable strict mode for better development experience
  reactStrictMode: true,
  /* config options here */
};

export default nextConfig;
