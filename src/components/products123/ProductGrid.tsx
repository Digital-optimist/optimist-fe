"use client";

import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/shopify";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-optimist-cream-muted">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}

// =============================================================================
// Loading Skeleton
// =============================================================================

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square rounded-xl bg-optimist-dark mb-4" />
      <div className="space-y-3">
        <div className="h-3 w-16 bg-optimist-dark rounded" />
        <div className="h-5 w-3/4 bg-optimist-dark rounded" />
        <div className="h-5 w-1/3 bg-optimist-dark rounded" />
      </div>
    </div>
  );
}

export { ProductGridSkeleton };
