import { getProducts } from "@/lib/shopify";
import ProductDetailClient from "@/components/products/ProductDetailClient";

interface ProductDetailPageProps {
  params: Promise<{ handle: string }>;
}

// Generate static paths for all products at build time
export async function generateStaticParams() {
  try {
    const products = await getProducts(100); // Fetch up to 100 products
    return products.map((product) => ({
      handle: product.handle,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return []; // Return empty array if there's an error
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { handle } = await params;
  
  return <ProductDetailClient handle={handle} />;
}
