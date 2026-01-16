"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ChevronLeft, Minus, Plus, ShoppingCart, Check } from "lucide-react";
import {
  getProductByHandle,
  formatPrice,
  type Product,
  type ProductVariant,
} from "@/lib/shopify";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/Toast";

interface ProductDetailClientProps {
  handle: string;
}

export default function ProductDetailClient({ handle }: ProductDetailClientProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, isLoading: isCartLoading } = useCart();
  const { showToast } = useToast();

  // Fetch product
  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductByHandle(handle);
        if (data) {
          setProduct(data);
          // Set initial variant
          const firstVariant = data.variants.edges[0]?.node;
          if (firstVariant) {
            setSelectedVariant(firstVariant);
            // Initialize selected options
            const initialOptions: Record<string, string> = {};
            firstVariant.selectedOptions.forEach((opt) => {
              initialOptions[opt.name] = opt.value;
            });
            setSelectedOptions(initialOptions);
          }
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [handle]);

  // Find variant when options change
  useEffect(() => {
    if (!product) return;

    const matchingVariant = product.variants.edges.find((edge) => {
      return edge.node.selectedOptions.every(
        (opt) => selectedOptions[opt.name] === opt.value
      );
    })?.node;

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  }, [selectedOptions, product]);

  useGSAP(
    () => {
      if (!containerRef.current || isLoading) return;

      const elements = containerRef.current.querySelectorAll(".animate-in");
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }
      );
    },
    { scope: containerRef, dependencies: [isLoading] }
  );

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    try {
      await addToCart(selectedVariant.id, quantity);
      showToast(`${product?.title} added to cart`, "success");
    } catch (err) {
      showToast("Failed to add to cart", "error");
    }
  };

  const images = product?.images.edges.map((e) => e.node) || [];

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-optimist-cream-muted mb-4">{error}</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-optimist-blue-light hover:text-optimist-blue-glow transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const isOnSale =
    selectedVariant?.compareAtPrice &&
    parseFloat(selectedVariant.compareAtPrice.amount) >
      parseFloat(selectedVariant.price.amount);

  return (
    <div ref={containerRef} className="min-h-screen pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Back Button */}
        <Link
          href="/products"
          className="animate-in inline-flex items-center gap-2 text-optimist-cream-muted hover:text-optimist-cream transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="animate-in space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-optimist-dark">
              {images[selectedImageIndex] ? (
                <Image
                  src={images[selectedImageIndex].url}
                  alt={images[selectedImageIndex].altText || product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-optimist-cream-muted">
                  No image
                </div>
              )}
              {isOnSale && (
                <div className="absolute top-4 left-4 px-4 py-2 bg-optimist-red rounded-full">
                  <span className="text-sm font-semibold text-white">Sale</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={image.url}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === selectedImageIndex
                        ? "border-optimist-blue-light"
                        : "border-transparent hover:border-optimist-border-light"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || `${product.title} ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="animate-in">
              <p className="text-sm text-optimist-cream-muted uppercase tracking-wider mb-2">
                {product.vendor}
              </p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-optimist-cream mb-4">
                {product.title}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-2xl md:text-3xl font-semibold text-optimist-cream">
                  {selectedVariant &&
                    formatPrice(
                      selectedVariant.price.amount,
                      selectedVariant.price.currencyCode
                    )}
                </span>
                {isOnSale && selectedVariant?.compareAtPrice && (
                  <span className="text-lg text-optimist-cream-muted line-through">
                    {formatPrice(
                      selectedVariant.compareAtPrice.amount,
                      selectedVariant.compareAtPrice.currencyCode
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Variant Options */}
            {product.options.map((option) => (
              <div key={option.id} className="animate-in">
                <label className="block text-sm font-medium text-optimist-cream mb-3">
                  {option.name}
                </label>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const isSelected = selectedOptions[option.name] === value;
                    return (
                      <button
                        key={value}
                        onClick={() => handleOptionChange(option.name, value)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                          isSelected
                            ? "border-optimist-blue-light bg-optimist-blue-light/10 text-optimist-cream"
                            : "border-optimist-border text-optimist-cream-muted hover:border-optimist-border-light hover:text-optimist-cream"
                        }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div className="animate-in">
              <label className="block text-sm font-medium text-optimist-cream mb-3">
                Quantity
              </label>
              <div className="inline-flex items-center border border-optimist-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-optimist-cream-muted hover:text-optimist-cream transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-optimist-cream font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-optimist-cream-muted hover:text-optimist-cream transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="animate-in pt-4">
              <button
                onClick={handleAddToCart}
                disabled={
                  isCartLoading ||
                  !selectedVariant ||
                  !selectedVariant.availableForSale
                }
                className="w-full btn-primary px-8 py-4 rounded-full text-white font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCartLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Adding...
                  </>
                ) : selectedVariant?.availableForSale ? (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                ) : (
                  "Out of Stock"
                )}
              </button>
            </div>

            {/* Description */}
            <div className="animate-in pt-6 border-t border-optimist-border">
              <h2 className="text-lg font-medium text-optimist-cream mb-4">
                Description
              </h2>
              <div
                className="prose prose-invert prose-sm max-w-none text-optimist-cream-muted"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="animate-in pt-4">
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium bg-optimist-dark text-optimist-cream-muted rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Loading Skeleton
// =============================================================================

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="h-6 w-32 bg-optimist-dark rounded mb-8" />
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-optimist-dark animate-pulse" />
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-lg bg-optimist-dark animate-pulse"
                />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="h-4 w-20 bg-optimist-dark rounded animate-pulse" />
              <div className="h-10 w-3/4 bg-optimist-dark rounded animate-pulse" />
              <div className="h-8 w-32 bg-optimist-dark rounded animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="h-4 w-16 bg-optimist-dark rounded animate-pulse" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-20 bg-optimist-dark rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>
            <div className="h-14 w-full bg-optimist-dark rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
