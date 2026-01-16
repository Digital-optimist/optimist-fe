import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Static HTML export
  reactCompiler: true,
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
