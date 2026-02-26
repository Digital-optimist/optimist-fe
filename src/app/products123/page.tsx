import { Suspense } from "react";
import { type Metadata } from "next";
import { getProducts } from "@/lib/shopify";
import { ProductDetailSkeleton } from "@/components/products/ProductDetailSkeleton";
import ProductsPageClient from "./ProductsPageClient";

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
    console.error("Failed to fetch product:", error);
    return null;
  }
}

// =============================================================================
// Server Component
// =============================================================================

export default async function ProductsPage() {
  const product = await getProductData();

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductsPageClient product={product} />
    </Suspense>
  );
}
