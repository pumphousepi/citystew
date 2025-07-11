// next.config.js
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      's1.ticketm.net',
      'i.ticketweb.com',
      'source.unsplash.com',
    ],
  },
  eslint: {
    // This allows production builds to succeed even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
