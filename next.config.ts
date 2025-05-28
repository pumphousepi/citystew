import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      's1.ticketm.net',
      'i.ticketweb.com',
      'source.unsplash.com',  // <-- allow Unsplash Source
    ],
  },
};

export default nextConfig;
