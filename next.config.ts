import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
    ],
  },
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
    ],
  },
  turbopack: {},
};

export default nextConfig;
