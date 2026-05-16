import { Suspense } from "react";
import { type Metadata } from "next";
import { getProducts, type Product } from "@/lib/shopify";
import ProductsPageClient from "./ProductsPageClient";
import { ProductDetailSkeleton } from "@/components/products/ProductDetailSkeleton";

// =============================================================================
// Metadata for SEO
// =============================================================================

export const metadata: Metadata = {
  title: "Products | Optimist AC - Energy Efficient Air Conditioners",
  description:
    "Discover Optimist AC - India's first energy-efficient air conditioner designed for extreme heat. Premium cooling with lower electricity bills.",
  keywords: [
    "Optimist AC",
    "air conditioner",
    "energy efficient AC",
    "inverter AC",
    "India AC",
    "cooling",
  ],
  openGraph: {
    title: "Products | Optimist AC",
    description:
      "Discover Optimist AC - India's first energy-efficient air conditioner designed for extreme heat.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Products | Optimist AC",
    description:
      "Discover Optimist AC - India's first energy-efficient air conditioner designed for extreme heat.",
  },
};

// =============================================================================
// Data Fetching (Server-side)
// =============================================================================

async function getProductData() {
  try {
    const products = await getProducts(1);
    return products.length > 0 ? products[0] : null;
  } catch (error) {
    return null;
  }
}

// =============================================================================
// Server Component
// =============================================================================

function getLcpImageUrl(product: Product | null): string | null {
  if (!product) return null;
  const fromMedia = product.media?.edges.find(
    ({ node }) => node.mediaContentType === "IMAGE" && node.image,
  )?.node.image?.url;
  if (fromMedia) return fromMedia;
  return product.images?.edges[0]?.node.url ?? product.featuredImage?.url ?? null;
}

function withWidth(url: string, width: number): string {
  try {
    const u = new URL(url);
    u.searchParams.set("width", String(width));
    return u.toString();
  } catch {
    return url;
  }
}

export default async function ProductsPage() {
  const product = await getProductData();
  const lcpUrl = getLcpImageUrl(product);

  return (
    <>
      {lcpUrl && (
        <link
          rel="preload"
          as="image"
          fetchPriority="high"
          href={withWidth(lcpUrl, 828)}
          imageSrcSet={`${withWidth(lcpUrl, 640)} 640w, ${withWidth(lcpUrl, 828)} 828w, ${withWidth(lcpUrl, 1080)} 1080w, ${withWidth(lcpUrl, 1200)} 1200w`}
          imageSizes="(max-width: 768px) 100vw, 50vw"
        />
      )}
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductsPageClient product={product} />
      </Suspense>
    </>
  );
}
