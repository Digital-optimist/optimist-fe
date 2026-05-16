import { Suspense } from "react";
import { type Metadata } from "next";
import {
  getProducts,
  getProductPageContent,
  type Product,
} from "@/lib/shopify";
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

async function getAllProducts() {
  try {
    // Fetch all variants the products page needs. Previously this was
    // fetched twice — once here (first product only, for SSR LCP preload)
    // and again from <ProductsProvider> on mount. The second fetch ran
    // during hydration and blocked the variants/price UI from settling for
    // ~500-1500 ms. Now we fetch once on the server and hand the full list
    // down to the route-scoped ProductsProvider.
    const products = await getProducts(10);
    return products;
  } catch {
    return [] as Product[];
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

// Fallback used when the Shopify fetch fails — keeps SSR HTML stable so the
// LCP H1 still paints with usable text on first byte instead of an empty
// string that re-renders post-hydration.
const FALLBACK_TITLE = "Optimist 5 Star Inverter Split AC";

export default async function ProductsPage() {
  // Fetch product + CMS content in parallel at build time so both ship in
  // the initial static HTML. Avoids a client-side round-trip on every visit
  // and eliminates the null-first-render flash for CMS-driven copy.
  const [products, pageContent] = await Promise.all([
    getAllProducts(),
    getProductPageContent(),
  ]);
  const product = products.length > 0 ? products[0] : null;
  const lcpUrl = getLcpImageUrl(product);
  const initialTitle = product?.title ?? FALLBACK_TITLE;

  return (
    <>
      {lcpUrl && (
        <link
          rel="preload"
          as="image"
          fetchPriority="high"
          href={withWidth(lcpUrl, 750)}
          imageSrcSet={`${withWidth(lcpUrl, 480)} 480w, ${withWidth(lcpUrl, 640)} 640w, ${withWidth(lcpUrl, 750)} 750w, ${withWidth(lcpUrl, 1080)} 1080w`}
          imageSizes="(max-width: 768px) 90vw, 50vw"
        />
      )}
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductsPageClient
          product={product}
          products={products}
          pageContent={pageContent}
          initialTitle={initialTitle}
        />
      </Suspense>
    </>
  );
}
