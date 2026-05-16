import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-3fd7021ca25b4b06b592f8cf7b1b425e.r2.dev',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
