import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/auth-api/:path*',
        destination: 'https://api.descope.com/:path*',
      },
    ]
  },
};

export default nextConfig;
