"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { getProducts, type Product } from "@/lib/shopify";

// =============================================================================
// Types
// =============================================================================

export interface DisplayVariant {
  id: string;
  variantId: string; // Shopify variant ID for cart operations
  productId: string; // Shopify product ID
  productTitle: string; // Full Shopify product title
  name: string;
  subtitle: string;
  price: number;
  compareAtPrice: number | null;
  available: boolean;
  tonnage: string; // "1", "1.5", "2" etc.
  images: string[];
  description: string;
  descriptionHtml: string;
}

export interface ProductData {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  images: string[];
  variants: DisplayVariant[];
  priceRange: {
    min: number;
    max: number;
  };
  isAvailable: boolean;
  tags: string[];
}

// Combined product data that treats each Shopify product as a variant option
export interface CombinedProductData {
  allVariants: DisplayVariant[];
  allImages: string[];
  isAvailable: boolean;
  priceRange: {
    min: number;
    max: number;
  };
}

interface ProductsContextType {
  products: ProductData[];
  combinedProduct: CombinedProductData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getProductByTonnage: (tonnage: string) => ProductData | undefined;
  getVariantByTonnage: (tonnage: string) => DisplayVariant | undefined;
  getPriceByTonnage: (tonnage: string) => number | null;
}

// =============================================================================
// Context
// =============================================================================

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Extract tonnage from product title or handle
 * Common formats: "1 Ton", "1.5 Ton", "2 Ton", "1-ton", "1-5-ton" etc.
 */
function extractTonnageFromProduct(product: Product): string {
  // First try to extract from title
  const title = product.title.toLowerCase();
  
  // Match patterns like "1 ton", "1.5 ton", "2 ton"
  let tonnageMatch = title.match(/(\d+\.?\d*)\s*ton/i);
  if (tonnageMatch) {
    return tonnageMatch[1];
  }
  
  // Try handle: "1-ton-split-ac", "1-5-ton-split-ac"
  const handle = product.handle.toLowerCase();
  
  // Match "1-5-ton" -> "1.5"
  const handleMatch = handle.match(/(\d+)-(\d+)-ton/);
  if (handleMatch) {
    return `${handleMatch[1]}.${handleMatch[2]}`;
  }
  
  // Match "1-ton" -> "1"
  const simpleHandleMatch = handle.match(/(\d+)-ton/);
  if (simpleHandleMatch) {
    return simpleHandleMatch[1];
  }
  
  // Check product tags
  for (const tag of product.tags) {
    const tagMatch = tag.match(/(\d+\.?\d*)\s*ton/i);
    if (tagMatch) return tagMatch[1];
  }
  
  // Default fallback
  return "1.5";
}

/**
 * Get subtitle for tonnage
 */
function getSubtitleForTonnage(tonnage: string): string {
  const tonnageNum = parseFloat(tonnage);
  if (tonnageNum <= 1) return "For compact rooms";
  if (tonnageNum <= 1.5) return "For medium-sized rooms";
  return "For large rooms";
}

/**
 * Transform Shopify Product to DisplayVariant
 * Each product becomes a selectable variant option (1 Ton, 1.5 Ton, 2 Ton)
 */
function productToVariant(product: Product): DisplayVariant {
  const tonnage = extractTonnageFromProduct(product);
  const variant = product.variants.edges[0]?.node;
  
  return {
    id: `${tonnage}ton`.replace(".", ""),
    variantId: variant?.id || "",
    productId: product.id,
    productTitle: product.title,
    name: `${tonnage} Ton`,
    subtitle: getSubtitleForTonnage(tonnage),
    price: variant ? parseFloat(variant.price.amount) : 0,
    compareAtPrice: variant?.compareAtPrice
      ? parseFloat(variant.compareAtPrice.amount)
      : null,
    available: variant?.availableForSale || false,
    tonnage,
    images: product.images.edges.map(({ node }) => node.url),
    description: product.description,
    descriptionHtml: product.descriptionHtml,
  };
}

/**
 * Transform Shopify Product to our ProductData format
 */
function transformProduct(product: Product): ProductData {
  const tonnage = extractTonnageFromProduct(product);
  const variant = product.variants.edges[0]?.node;
  
  const displayVariant: DisplayVariant = {
    id: `${tonnage}ton`.replace(".", ""),
    variantId: variant?.id || "",
    productId: product.id,
    productTitle: product.title,
    name: `${tonnage} Ton`,
    subtitle: getSubtitleForTonnage(tonnage),
    price: variant ? parseFloat(variant.price.amount) : 0,
    compareAtPrice: variant?.compareAtPrice
      ? parseFloat(variant.compareAtPrice.amount)
      : null,
    available: variant?.availableForSale || false,
    tonnage,
    images: product.images.edges.map(({ node }) => node.url),
    description: product.description,
    descriptionHtml: product.descriptionHtml,
  };

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    images: product.images.edges.map(({ node }) => node.url),
    variants: [displayVariant],
    priceRange: {
      min: parseFloat(product.priceRange.minVariantPrice.amount),
      max: parseFloat(product.priceRange.maxVariantPrice.amount),
    },
    isAvailable: variant?.availableForSale || false,
    tags: product.tags,
  };
}

// =============================================================================
// Provider
// =============================================================================

interface ProductsProviderProps {
  children: ReactNode;
  initialProducts?: Product[];
}

export function ProductsProvider({
  children,
  initialProducts,
}: ProductsProviderProps) {
  const [products, setProducts] = useState<ProductData[]>(() => {
    if (initialProducts) {
      return initialProducts.map(transformProduct);
    }
    return [];
  });
  const [rawProducts, setRawProducts] = useState<Product[]>(initialProducts || []);
  const [isLoading, setIsLoading] = useState(!initialProducts);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const shopifyProducts = await getProducts(10);
      setRawProducts(shopifyProducts);
      const transformedProducts = shopifyProducts.map(transformProduct);
      setProducts(transformedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch products"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch products on mount if not provided initially
  useEffect(() => {
    if (!initialProducts) {
      fetchProducts();
    }
  }, [fetchProducts, initialProducts]);

  // Create combined product data - treats all Shopify products as variant options
  const combinedProduct = useMemo((): CombinedProductData | null => {
    if (rawProducts.length === 0) return null;

    // Convert each product to a variant option
    const allVariants = rawProducts
      .map(productToVariant)
      .sort((a, b) => parseFloat(a.tonnage) - parseFloat(b.tonnage));

    // Collect all images from all products
    const allImages = rawProducts.flatMap((p) =>
      p.images.edges.map(({ node }) => node.url)
    );

    // Check if any variant is available
    const isAvailable = allVariants.some((v) => v.available);

    // Calculate price range
    const prices = allVariants.map((v) => v.price);
    const priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };

    return {
      allVariants,
      allImages,
      isAvailable,
      priceRange,
    };
  }, [rawProducts]);

  // Helper to get product by tonnage
  const getProductByTonnage = useCallback(
    (tonnage: string): ProductData | undefined => {
      // Normalize tonnage: "1.0" -> "1", "1.5" -> "1.5", "2.0" -> "2"
      const normalizedTonnage = tonnage.replace(/\.0$/, "");
      return products.find((p) =>
        p.variants.some((v) => v.tonnage === normalizedTonnage || v.tonnage === tonnage)
      );
    },
    [products]
  );

  // Helper to get variant by tonnage
  const getVariantByTonnage = useCallback(
    (tonnage: string): DisplayVariant | undefined => {
      if (!combinedProduct) return undefined;
      // Normalize tonnage: "1.0" -> "1", "1.5" -> "1.5", "2.0" -> "2"
      const normalizedTonnage = tonnage.replace(/\.0$/, "");
      return combinedProduct.allVariants.find(
        (v) => v.tonnage === normalizedTonnage || v.tonnage === tonnage
      );
    },
    [combinedProduct]
  );

  // Helper to get price by tonnage
  const getPriceByTonnage = useCallback(
    (tonnage: string): number | null => {
      const variant = getVariantByTonnage(tonnage);
      return variant?.price ?? null;
    },
    [getVariantByTonnage]
  );

  return (
    <ProductsContext.Provider
      value={{
        products,
        combinedProduct,
        isLoading,
        error,
        refetch: fetchProducts,
        getProductByTonnage,
        getVariantByTonnage,
        getPriceByTonnage,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
