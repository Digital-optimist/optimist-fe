import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Static HTML export
  trailingSlash: true, // Generate /products/index.html instead of /products.html
  reactCompiler: true,
  experimental: {
    // Inline CSS into the HTML head instead of shipping it as a separate
    // render-blocking <link rel="stylesheet">. The Tailwind + font-face
    // chunk is only ~22 KiB, and inlining removes a 150-170 ms render block
    // on slow networks (the chunk had to download before first paint).
    inlineCss: true,
  },
  images: {
    // Custom loader lets us resize Shopify CDN images via ?width=N query
    // params at build time. Local & S3 assets pass through unchanged
    // (they are pre-optimized as WebP at the correct dimensions).
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "optimist-fe-assets.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
