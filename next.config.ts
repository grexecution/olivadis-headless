import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'], // Modern formats for better compression
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'olivadis.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: '*.basemaps.cartocdn.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'], // Tree-shake Lucide icons (only bundle used icons)
  },
};

export default nextConfig;
