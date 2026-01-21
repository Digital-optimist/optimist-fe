"use client";

import { useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { type Product } from "@/lib/shopify";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/Toast";
import { ASSETS } from "@/lib/assets";
import { ImageGallery } from "@/components/products/ImageGallery";
import { CartIcon, DeliveryIcon } from "@/components/icons/ProductIcons";
import { QuantityDropdown } from "@/components/products/QuantityDropdown";
import { ProductDetailRow } from "@/components/products/ProductDetailRow";
import { ComparisonSection } from "@/components/products/ComparisonSection";
import { ResultSection } from "@/components/products/ResultSection";
import { VariantCard } from "@/components/products/VariantCard";
import { UserExperienceSection } from "@/components/products/UserExperienceSection";
import { IndiaStorySection } from "@/components/products/IndiaStorySection";
import { AfterBuySection } from "@/components/products/AfterBuySection";
import { WarrantySection } from "@/components/products/WarrantySection";
import { RecognitionSection } from "@/components/products/RecognitionSection";

// =============================================================================
// Types
// =============================================================================

export interface DisplayVariant {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  available: boolean;
}

export interface ProductDetail {
  icon: "diamond" | "warranty" | "installation";
  label: string;
}

// =============================================================================
// Constants
// =============================================================================

const MAX_DISPLAY_IMAGES = 6;
const QUANTITY_OPTIONS = [1, 2, 3, 4, 5] as const;

const MOCK_VARIANTS: DisplayVariant[] = [
  { id: "1ton", name: "1 TON", subtitle: "For compact rooms", price: 40000, available: true },
  { id: "1.5ton", name: "1.5 TON", subtitle: "For compact rooms", price: 45000, available: true },
  { id: "2ton", name: "2 TON", subtitle: "For compact rooms", price: 52000, available: true },
];

const PRODUCT_DETAILS: ProductDetail[][] = [
  [
    { icon: "diamond", label: "Top Rated" },
    { icon: "warranty", label: "1-Year Warranty" },
    { icon: "installation", label: "Paid Installation" },
  ],
  [
    { icon: "diamond", label: "Top Rated" },
    { icon: "warranty", label: "1-Year Warranty" },
    { icon: "installation", label: "Paid Installation" },
  ],
  [
    { icon: "diamond", label: "Top Rated" },
    { icon: "warranty", label: "1-Year Warranty" },
    { icon: "installation", label: "Paid Installation" },
  ],
];

const MOCK_IMAGES = [
  ASSETS.ac1,
  ASSETS.ac2,
  ASSETS.ac3,
  ASSETS.ac1,
  ASSETS.ac2,
  ASSETS.ac3,
];

// =============================================================================
// Utils - Moved outside component to avoid recreation
// =============================================================================

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN").format(price);
}

// =============================================================================
// Props
// =============================================================================

interface ProductsPageClientProps {
  product: Product | null;
}

// =============================================================================
// Main Component
// =============================================================================

export default function ProductsPageClient({ product }: ProductsPageClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<DisplayVariant>(MOCK_VARIANTS[1]);
  const [quantity, setQuantity] = useState(1);
  const [isQuantityOpen, setIsQuantityOpen] = useState(false);
  const { addToCart, isLoading: isCartLoading } = useCart();
  const { showToast } = useToast();

  // Image navigation - memoized
  const images = product?.images.edges.map((e) => e.node.url) || MOCK_IMAGES;
  const displayImages = images.length >= MAX_DISPLAY_IMAGES 
    ? images.slice(0, MAX_DISPLAY_IMAGES) 
    : [...images, ...MOCK_IMAGES].slice(0, MAX_DISPLAY_IMAGES);

  // Animation - only runs once
  useGSAP(
    () => {
      if (!containerRef.current || hasAnimated.current) return;
      hasAnimated.current = true;

      const elements = containerRef.current.querySelectorAll(".animate-in");
      gsap.fromTo(
        elements,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" }
      );
    },
    { scope: containerRef }
  );

  // Memoized handlers
  const handlePrevImage = useCallback(() => {
    setSelectedImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  }, [displayImages.length]);

  const handleNextImage = useCallback(() => {
    setSelectedImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  }, [displayImages.length]);

  const handleSelectImage = useCallback((index: number) => {
    setSelectedImageIndex(index);
  }, []);

  const handleSelectVariant = useCallback((variant: DisplayVariant) => {
    setSelectedVariant(variant);
  }, []);

  const handleQuantityChange = useCallback((qty: number) => {
    setQuantity(qty);
  }, []);

  const handleQuantityToggle = useCallback(() => {
    setIsQuantityOpen((prev) => !prev);
  }, []);

  const handleAddToCart = useCallback(async () => {
    if (!product) return;
    
    const variant = product.variants.edges[0]?.node;
    if (!variant) return;

    try {
      await addToCart(variant.id, quantity);
      showToast("Added to cart", "success");
    } catch {
      showToast("Failed to add to cart", "error");
    }
  }, [product, quantity, addToCart, showToast]);

  return (
    <div ref={containerRef} className="min-h-screen bg-white">
      {/* Product Detail Section */}
      <div className="pt-16 md:pt-20 lg:pt-24 pb-8 md:pb-16">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16">
            {/* Left Column - Image Gallery */}
            <div className="animate-in w-full">
              <ImageGallery
                images={displayImages}
                selectedIndex={selectedImageIndex}
                onSelectImage={handleSelectImage}
                onPrev={handlePrevImage}
                onNext={handleNextImage}
              />
            </div>

            {/* Right Column - Product Info */}
            <div className="w-full space-y-4 md:space-y-6">
              {/* Badge */}
              <div className="animate-in">
                <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-blue-50 text-blue-600 text-xs md:text-sm font-semibold rounded-full">
                  #BESTSELLER
                </span>
              </div>

              {/* Title & Delivery */}
              <div className="animate-in">
                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 md:mb-3 leading-tight">
                  {product?.title || "Optimist AC 1.5 Ton"}
                </h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <DeliveryIcon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span className="text-xs md:text-sm">Delivery in 3 weeks</span>
                </div>
              </div>

              {/* Description */}
              <div className="animate-in">
                <h3 className="text-xs md:text-sm font-semibold text-gray-900 uppercase tracking-wide mb-1.5 md:mb-2">
                  DESCRIPTION
                </h3>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  {product?.description || 
                    "Njut av den behagliga värmen från en komplett och lyxig badtunna från Nordiska Tunnan. Här kan du se allt som ingår i ditt köp. Njut av den behagliga värmen från en komplett och lyxig badtunna från Nordiska Tunnan. Här kan du se allt som ingår i ditt köp."}
                </p>
              </div>

              {/* Divider */}
              <div className="animate-in border-t border-gray-100" />

              {/* Variants */}
              <div className="animate-in">
                <h3 className="text-xs md:text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 md:mb-4">
                  VARIANTS
                </h3>
                <div className="w-full overflow-hidden" role="radiogroup" aria-label="Product variants">
                  <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    {MOCK_VARIANTS.map((variant) => (
                      <VariantCard
                        key={variant.id}
                        variant={variant}
                        isSelected={selectedVariant.id === variant.id}
                        onSelect={handleSelectVariant}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="animate-in border-t border-gray-100" />

              {/* Total */}
              <div className="animate-in">
                <h3 className="text-xs md:text-sm font-semibold text-gray-900 uppercase tracking-wide mb-1.5 md:mb-2">
                  TOTAL
                </h3>
                <div className="flex flex-col md:flex-row md:items-baseline gap-0.5 md:gap-2">
                  <span className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                    Rs {formatPrice(selectedVariant.price)}.00
                  </span>
                  <span className="text-gray-500 text-[10px] md:text-sm">(inclusive of all the taxes)</span>
                </div>
              </div>

              {/* Quantity */}
              <div className="animate-in">
                <QuantityDropdown
                  quantity={quantity}
                  onQuantityChange={handleQuantityChange}
                  isOpen={isQuantityOpen}
                  onToggle={handleQuantityToggle}
                  options={QUANTITY_OPTIONS}
                />
              </div>

              {/* Action Buttons */}
              <div className="animate-in flex gap-2 md:gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isCartLoading}
                  className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-6 py-3 md:py-4 border border-gray-200 rounded-full text-gray-900 font-medium text-xs md:text-base hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  <CartIcon className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  className="flex-1 px-3 md:px-6 py-3 md:py-4 rounded-full text-white font-medium text-xs md:text-base transition-all btn-gradient-primary"
                >
                  Buy Now
                </button>
              </div>

              {/* Divider */}
              <div className="animate-in border-t border-gray-100" />

              {/* Details */}
              <div className="animate-in">
                <h3 className="text-xs md:text-sm font-semibold text-gray-900 uppercase tracking-wide mb-1.5 md:mb-2">
                  DETAILS
                </h3>
                <div className="divide-y divide-gray-100">
                  {PRODUCT_DETAILS.map((row, index) => (
                    <ProductDetailRow key={index} details={row} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <ComparisonSection />

      {/* Result Section */}
      <ResultSection />

      {/* User Experience Section */}
      <UserExperienceSection />

      {/* India Story Section */}
      <IndiaStorySection />

      {/* After Buy Section */}
      <AfterBuySection />

      {/* Warranty Section */}
      <WarrantySection />

      {/* Recognition Section */}
      <RecognitionSection />
    </div>
  );
}
