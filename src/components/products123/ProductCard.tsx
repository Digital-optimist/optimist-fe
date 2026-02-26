"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ShoppingCart, Eye } from "lucide-react";
import { formatPrice, type Product } from "@/lib/shopify";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/Toast";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { addToCart, isLoading } = useCart();
  const { showToast } = useToast();

  const firstVariant = product.variants.edges[0]?.node;
  const image = product.featuredImage;
  const price = product.priceRange.minVariantPrice;
  const compareAtPrice = firstVariant?.compareAtPrice;
  const isOnSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  useGSAP(
    () => {
      if (!cardRef.current) return;

      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: "power3.out",
        }
      );
    },
    { scope: cardRef }
  );

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!firstVariant) {
      showToast("Product is not available", "error");
      return;
    }

    try {
      await addToCart(firstVariant.id);
      showToast(`${product.title} added to cart`, "success");
    } catch (error) {
      showToast("Failed to add to cart", "error");
    }
  };

  return (
    <div ref={cardRef} className="group">
      <Link href="/products" className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-optimist-dark mb-4">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-optimist-cream-muted">
              <span className="text-sm">No image</span>
            </div>
          )}

          {/* Sale Badge */}
          {isOnSale && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-optimist-red rounded-full">
              <span className="text-xs font-semibold text-white">Sale</span>
            </div>
          )}

          {/* Hover Actions */}
          <div className="absolute inset-0 bg-optimist-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isLoading || !firstVariant?.availableForSale}
              className="p-3 bg-optimist-cream text-optimist-black rounded-full hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <div className="p-3 bg-optimist-cream/20 text-optimist-cream rounded-full hover:bg-optimist-cream/30 transition-colors">
              <Eye className="w-5 h-5" />
            </div>
          </div>

          {/* Out of Stock Badge */}
          {!firstVariant?.availableForSale && (
            <div className="absolute inset-0 bg-optimist-black/70 flex items-center justify-center">
              <span className="text-optimist-cream font-medium">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <p className="text-xs text-optimist-cream-muted uppercase tracking-wider">
            {product.vendor}
          </p>
          <h3 className="text-lg font-medium text-optimist-cream group-hover:text-optimist-blue-light transition-colors line-clamp-2">
            {product.title}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-optimist-cream">
              {formatPrice(price.amount, price.currencyCode)}
            </span>
            {isOnSale && compareAtPrice && (
              <span className="text-sm text-optimist-cream-muted line-through">
                {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
