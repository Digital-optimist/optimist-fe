"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * Custom image loader for static export.
 *
 * - Shopify CDN: appends `width` and `format=webp` query params so the CDN
 *   returns a properly-sized image (saves multi-MB on thumbnails and gallery).
 * - Everything else (local `/assets/`, S3 bucket): returned unchanged. We
 *   pre-optimize those assets at build/upload time instead of relying on
 *   a runtime resizer.
 */
export default function imageLoader({ src, width }: ImageLoaderProps): string {
  if (src.includes("cdn.shopify.com")) {
    try {
      const url = new URL(src);
      url.searchParams.set("width", String(width));
      return url.toString();
    } catch {
      return src;
    }
  }
  return src;
}
