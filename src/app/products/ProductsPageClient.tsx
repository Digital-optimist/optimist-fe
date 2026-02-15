"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { type Product } from "@/lib/shopify";
import { useCart } from "@/contexts/CartContext";
import { useProducts, type DisplayVariant } from "@/contexts/ProductsContext";
import { useToast } from "@/components/ui/Toast";
import { useWaitlist } from "@/contexts/WaitlistContext";
import { ASSETS } from "@/lib/assets";
import { ImageGallery } from "@/components/products/ImageGallery";
import {
  PackageIcon,
  ShoppingBagIcon,
  CartIcon,
} from "@/components/icons/ProductIcons";
import { QuantityDropdown } from "@/components/products/QuantityDropdown";
import { ComparisonSection } from "@/components/products/ComparisonSection";
import { ResultSection } from "@/components/products/ResultSection";
import { VariantCard } from "@/components/products/VariantCard";
import { UserExperienceSection } from "@/components/products/UserExperienceSection";
import { IndiaStorySection } from "@/components/products/IndiaStorySection";
import { AfterBuySection } from "@/components/products/AfterBuySection";
import { WarrantySection } from "@/components/products/WarrantySection";
import { RecognitionSection } from "@/components/products/RecognitionSection";
import { BuiltForSection } from "@/components/products/BuiltForSection";

// Easing
const easeOutExpo = "easeOut" as const;

// Page transition variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.4, ease: easeOutExpo },
  },
  exit: { opacity: 0 },
};

// Section animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easeOutExpo,
    },
  },
};

const slideFromLeftVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: easeOutExpo,
    },
  },
};

const slideFromRightVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: easeOutExpo,
    },
  },
};

const scaleUpVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easeOutExpo,
    },
  },
};

const mobileFooterVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOutExpo,
      delay: 0.8,
    },
  },
};

// Hero section variants
const heroGalleryVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: easeOutExpo,
    },
  },
};

const heroInfoContainerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const heroInfoItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOutExpo,
    },
  },
};

// =============================================================================
// Constants
// =============================================================================

const MAX_DISPLAY_IMAGES = 6;
const QUANTITY_OPTIONS = [1, 2, 3, 4, 5] as const;

// Fallback variants when Shopify data is unavailable
const FALLBACK_VARIANTS: DisplayVariant[] = [
  {
    id: "1ton",
    variantId: "",
    productId: "",
    name: "1 Ton",
    subtitle: "For compact rooms",
    price: 30000,
    compareAtPrice: null,
    available: false,
    tonnage: "1",
    images: [],
    description: "",
    descriptionHtml: "",
  },
  {
    id: "15ton",
    variantId: "",
    productId: "",
    name: "1.5 Ton",
    subtitle: "For medium-sized rooms",
    price: 40000,
    compareAtPrice: null,
    available: false,
    tonnage: "1.5",
    images: [],
    description: "",
    descriptionHtml: "",
  },
  {
    id: "2ton",
    variantId: "",
    productId: "",
    name: "2 Ton",
    subtitle: "For large rooms",
    price: 50000,
    compareAtPrice: null,
    available: false,
    tonnage: "2",
    images: [],
    description: "",
    descriptionHtml: "",
  },
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

const userAllowedToBuy = false;

export default function ProductsPageClient({
  product,
}: ProductsPageClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const variantsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isQuantityOpen, setIsQuantityOpen] = useState(false);
  const { addToCart, isLoading: isCartLoading } = useCart();
  const { showToast } = useToast();
  const { combinedProduct, isLoading: isProductsLoading } = useProducts();
  const { openModal: openWaitlistModal } = useWaitlist();

  // Get variants from combined product (each Shopify product = one variant option)
  const variants = useMemo((): DisplayVariant[] => {
    if (combinedProduct && combinedProduct.allVariants.length > 0) {
      return combinedProduct.allVariants;
    }
    return FALLBACK_VARIANTS;
  }, [combinedProduct]);

  // Check if we have real Shopify data (not fallback)
  const hasShopifyData = useMemo(() => {
    return combinedProduct !== null && combinedProduct.allVariants.length > 0;
  }, [combinedProduct]);

  // Initialize selected variant - prefer 1.5 ton (middle), then first available
  const [selectedVariant, setSelectedVariant] = useState<DisplayVariant | null>(
    null,
  );

  // Track if we've initialized with Shopify data
  const [initializedWithShopify, setInitializedWithShopify] = useState(false);

  // Update selected variant when variants change OR when Shopify data becomes available
  useEffect(() => {
    if (variants.length === 0) return;

    // If we haven't initialized with Shopify data yet and now have it, update the variant
    const shouldUpdate =
      !selectedVariant || (hasShopifyData && !initializedWithShopify);

    if (shouldUpdate) {
      // Prefer 1.5 ton as default, then first available, then middle one
      const preferredVariant = variants.find(
        (v) => v.tonnage === "1.5" && v.available,
      );
      const availableVariant = variants.find((v) => v.available);
      const defaultVariant =
        preferredVariant ||
        availableVariant ||
        variants[Math.floor(variants.length / 2)];
      setSelectedVariant(defaultVariant);

      if (hasShopifyData) {
        setInitializedWithShopify(true);
      }
    }
  }, [variants, hasShopifyData, initializedWithShopify, selectedVariant]);

  // Reset image index when variant changes (each variant has its own images)
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedVariant?.id]);

  // Computed states for edge cases
  const isOutOfStock = useMemo(() => {
    // Don't show all out of stock if we don't have real data yet
    if (!hasShopifyData) return false;
    return variants.every((v) => !v.available);
  }, [variants, hasShopifyData]);

  // Only show out of stock if we have a selected variant and it's not available
  // Don't show out of stock during loading, before variant is selected, or if using fallback data
  const selectedVariantOutOfStock = useMemo(() => {
    // Don't show out of stock during loading or if we don't have real Shopify data
    if (isProductsLoading || !selectedVariant || !hasShopifyData) {
      return false;
    }
    // Only show out of stock if the variant has a valid variantId (from Shopify) and is not available
    if (!selectedVariant.variantId) {
      return false;
    }
    return !selectedVariant.available;
  }, [selectedVariant, isProductsLoading, hasShopifyData]);

  const isProductUnavailable = useMemo(() => {
    return !combinedProduct && !isProductsLoading;
  }, [combinedProduct, isProductsLoading]);

  // Determine if CTA buttons should be enabled
  // Enabled when: not loading, have Shopify data, have valid variant, and variant is available
  const canAddToCart = useMemo(() => {
    return (
      !isProductsLoading &&
      hasShopifyData &&
      selectedVariant !== null &&
      !!selectedVariant.variantId &&
      selectedVariant.available
    );
  }, [isProductsLoading, hasShopifyData, selectedVariant]);

  // Button state for display purposes
  const buttonState = useMemo(() => {
    if (isProductsLoading || !hasShopifyData) {
      return "loading";
    }
    if (!selectedVariant || !selectedVariant.variantId) {
      return "loading";
    }
    if (!selectedVariant.available) {
      return "outOfStock";
    }
    return "ready";
  }, [isProductsLoading, hasShopifyData, selectedVariant]);

  // Image navigation - use selected variant's images or fallback
  const images = useMemo(() => {
    // Use images from the selected variant (each product has its own images)
    if (selectedVariant && selectedVariant.images.length > 0) {
      return selectedVariant.images;
    }
    // Fallback to combined images or product prop
    if (combinedProduct && combinedProduct.allImages.length > 0) {
      return combinedProduct.allImages;
    }
    if (product?.images.edges.length) {
      return product.images.edges.map((e) => e.node.url);
    }
    return MOCK_IMAGES;
  }, [selectedVariant, combinedProduct, product]);

  const displayImages = useMemo(() => {
    if (images.length >= MAX_DISPLAY_IMAGES) {
      return images.slice(0, MAX_DISPLAY_IMAGES);
    }
    return [...images, ...MOCK_IMAGES].slice(0, MAX_DISPLAY_IMAGES);
  }, [images]);

  // Memoized handlers
  const handlePrevImage = useCallback(() => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1,
    );
  }, [displayImages.length]);

  const handleNextImage = useCallback(() => {
    setSelectedImageIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1,
    );
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

  const updateVariantsScrollState = useCallback(() => {
    const element = variantsScrollRef.current;
    if (!element) return;

    const maxScrollLeft = element.scrollWidth - element.clientWidth;
    setCanScrollLeft(element.scrollLeft > 0);
    setCanScrollRight(element.scrollLeft < maxScrollLeft - 1);
  }, []);

  const handleVariantsScroll = useCallback((direction: "left" | "right") => {
    const element = variantsScrollRef.current;
    if (!element) return;

    const amount = Math.max(180, Math.round(element.clientWidth * 0.8));
    element.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    updateVariantsScrollState();
    const rafId = requestAnimationFrame(updateVariantsScrollState);
    return () => cancelAnimationFrame(rafId);
  }, [variants.length, updateVariantsScrollState]);

  useEffect(() => {
    const element = variantsScrollRef.current;
    if (!element) return;

    const handleScroll = () => updateVariantsScrollState();
    element.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    const resizeObserver = new ResizeObserver(() =>
      updateVariantsScrollState(),
    );
    resizeObserver.observe(element);

    return () => {
      element.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      resizeObserver.disconnect();
    };
  }, [updateVariantsScrollState]);

  const handleAddToCart = useCallback(async () => {
    if (!selectedVariant || !selectedVariant.variantId) {
      showToast("Please select a variant", "error");
      return;
    }

    if (!selectedVariant.available) {
      showToast("This variant is out of stock", "error");
      return;
    }

    try {
      await addToCart(selectedVariant.variantId, quantity);
      showToast("Added to cart", "success");
    } catch {
      showToast("Failed to add to cart", "error");
    }
  }, [selectedVariant, quantity, addToCart, showToast]);

  return (
    <motion.div
      ref={containerRef}
      className="min-h-screen bg-white pb-24 md:pb-0 overflow-x-hidden"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Product Detail Section */}
      <div ref={heroRef} className="pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-16">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16">
            {/* Left Column - Image Gallery */}
            <motion.div
              className="w-full will-change-[transform,opacity]"
              initial="hidden"
              animate="visible"
              variants={heroGalleryVariants}
            >
              <ImageGallery
                images={displayImages}
                selectedIndex={selectedImageIndex}
                onSelectImage={handleSelectImage}
                onPrev={handlePrevImage}
                onNext={handleNextImage}
              />
            </motion.div>

            {/* Right Column - Product Info */}
            <motion.div
              className="w-full space-y-4 md:space-y-6"
              initial="hidden"
              animate="visible"
              variants={heroInfoContainerVariants}
            >
              {/* Badge */}
              <motion.div
                variants={heroInfoItemVariants}
                className="flex items-center gap-2"
              >
                <span className="relative inline-flex items-center justify-center px-3 py-1.5 md:px-4 md:py-2 bg-[rgba(52,120,246,0.12)] text-[#3478F6] text-xs md:text-sm font-normal rounded-full shadow-[inset_0px_-2px_4px_0px_#ccdeff]">
                  #BESTSELLER
                </span>
                {isOutOfStock && (
                  <span className="inline-flex items-center justify-center px-3 py-1.5 md:px-4 md:py-2 bg-red-100 text-red-600 text-xs md:text-sm font-medium rounded-full">
                    Out of Stock
                  </span>
                )}
              </motion.div>

              {/* Title & Delivery */}
              <motion.div
                variants={heroInfoItemVariants}
                className="flex flex-col gap-2"
              >
                <h1 className="text-[28px] md:text-[40px] font-semibold text-black leading-tight">
                  Optimist AC {selectedVariant?.name || ""}
                </h1>
                <div className="flex items-center gap-2 text-[#6c6a6a]">
                  <PackageIcon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span className="text-xs md:text-sm">
                    {selectedVariant?.available
                      ? "Delivery in 3 weeks"
                      : "Currently unavailable"}
                  </span>
                </div>
              </motion.div>

              {/* Variants */}
              <motion.div
                variants={heroInfoItemVariants}
                className="flex flex-col gap-4 md:gap-6"
              >
                <h3 className="text-sm md:text-base font-medium text-black uppercase tracking-wide">
                  Variants
                </h3>
                {isProductsLoading ? (
                  <div className="flex gap-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-[180px] h-[94px] rounded-[8px] bg-gray-100 animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className="relative w-full overflow-hidden"
                    role="radiogroup"
                    aria-label="Product variants"
                  >
                    <div
                      ref={variantsScrollRef}
                      className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
                    >
                      {variants.map((variant) => (
                        <VariantCard
                          key={variant.id}
                          variant={variant}
                          isSelected={selectedVariant?.id === variant.id}
                          onSelect={handleSelectVariant}
                        />
                      ))}
                    </div>
                    {canScrollLeft && (
                      <button
                        type="button"
                        onClick={() => handleVariantsScroll("left")}
                        aria-label="Scroll variants left"
                        className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/85 text-black shadow-sm backdrop-blur"
                      >
                        <span className="text-lg leading-none">‹</span>
                      </button>
                    )}
                    {canScrollRight && (
                      <button
                        type="button"
                        onClick={() => handleVariantsScroll("right")}
                        aria-label="Scroll variants right"
                        className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/85 text-black shadow-sm backdrop-blur"
                      >
                        <span className="text-lg leading-none">›</span>
                      </button>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Total/Price */}
              <motion.div
                variants={heroInfoItemVariants}
                className="flex flex-col gap-2"
              >
                <h3 className="text-sm md:text-base font-medium text-black uppercase tracking-wide">
                  Total
                </h3>
                <div className="flex flex-wrap items-baseline gap-2">
                  {selectedVariant?.compareAtPrice &&
                    selectedVariant.compareAtPrice > selectedVariant.price && (
                      <span className="text-lg md:text-xl text-[#6c6a6a] line-through">
                        ₹{formatPrice(selectedVariant.compareAtPrice)}
                      </span>
                    )}
                  <span className="text-2xl md:text-3xl font-semibold text-black">
                    ₹{formatPrice(selectedVariant?.price || 0)}
                  </span>
                  <span className="text-[#6c6a6a] text-sm md:text-base font-light">
                    (inclusive of all the taxes)
                  </span>
                </div>
                {selectedVariantOutOfStock && (
                  <span className="text-red-500 text-sm font-medium">
                    This variant is currently out of stock
                  </span>
                )}
              </motion.div>

              {/* Quantity */}
              <motion.div variants={heroInfoItemVariants}>
                <QuantityDropdown
                  quantity={quantity}
                  onQuantityChange={handleQuantityChange}
                  isOpen={isQuantityOpen}
                  onToggle={handleQuantityToggle}
                  options={QUANTITY_OPTIONS}
                />
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                variants={heroInfoItemVariants}
                className="hidden md:flex gap-4"
              >
                {userAllowedToBuy ? (
                  <>
                    <motion.button
                      onClick={handleAddToCart}
                      disabled={isCartLoading || !canAddToCart}
                      className={`flex-1 flex items-center justify-center gap-2.5 px-6 py-4 border rounded-full font-medium text-base transition-all ${
                        buttonState === "loading"
                          ? "border-gray-200 text-gray-400"
                          : buttonState === "outOfStock"
                            ? "border-gray-200 text-gray-400 cursor-not-allowed"
                            : "border-[rgba(0,0,0,0.12)] text-black hover:border-[rgba(0,0,0,0.24)] disabled:opacity-50"
                      }`}
                      whileHover={
                        canAddToCart
                          ? { scale: 1.02, borderColor: "rgba(0,0,0,0.24)" }
                          : {}
                      }
                      whileTap={canAddToCart ? { scale: 0.98 } : {}}
                      transition={{ duration: 0.2 }}
                    >
                      <ShoppingBagIcon className="w-6 h-6" />
                      <span>
                        {buttonState === "loading"
                          ? "Loading..."
                          : buttonState === "outOfStock"
                            ? "Out of Stock"
                            : "Add to Cart"}
                      </span>
                    </motion.button>
                    <motion.button
                      disabled={!canAddToCart}
                      className={`flex-1 px-6 py-4 rounded-full font-medium text-base text-center transition-all ${
                        buttonState === "loading"
                          ? "bg-gray-300 text-gray-500"
                          : buttonState === "outOfStock"
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "btn-buy-now text-[#FFFCDC]"
                      }`}
                      whileHover={canAddToCart ? { scale: 1.02 } : {}}
                      whileTap={canAddToCart ? { scale: 0.98 } : {}}
                      transition={{ duration: 0.2 }}
                    >
                      {buttonState === "loading"
                        ? "Loading..."
                        : buttonState === "outOfStock"
                          ? "Unavailable"
                          : "Buy Now"}
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    onClick={openWaitlistModal}
                    className="flex-1 px-6 py-4 rounded-full font-medium text-base text-center btn-buy-now text-[#FFFCDC] transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    Join the Waitlist
                  </motion.button>
                )}
              </motion.div>

              {/* Divider */}
              <motion.div
                variants={heroInfoItemVariants}
                className="h-px bg-gray-200 w-full"
              />

              {/* Description Accordion */}
              <motion.div variants={heroInfoItemVariants}>
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer py-2">
                    <h3 className="text-sm md:text-base font-medium text-black uppercase tracking-wide">
                      Description
                    </h3>
                    <svg
                      className="w-5 h-5 text-black transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="pt-2 pb-4 max-h-[400px] overflow-y-auto">
                    {selectedVariant?.descriptionHtml ? (
                      <div
                        className="rich-text-content text-sm md:text-base leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: selectedVariant.descriptionHtml,
                        }}
                      />
                    ) : selectedVariant?.description ? (
                      <p className="text-[#6c6a6a] text-sm md:text-base font-light leading-relaxed">
                        {selectedVariant.description}
                      </p>
                    ) : (
                      <>
                        <h4 className="text-sm md:text-base font-semibold text-black mb-2">
                          Engineered for Indian reality.
                        </h4>
                        <p className="text-[#6c6a6a] text-sm md:text-base font-light leading-relaxed">
                          Consistent cooling at 45°C. Bills that stay
                          predictable. Performance that doesn&apos;t fade when
                          you need it most.
                        </p>
                      </>
                    )}
                  </div>
                </details>
              </motion.div>

              {/* Divider */}
              <motion.div
                variants={heroInfoItemVariants}
                className="h-px bg-gray-200 w-full"
              />

              {/* Warranty Return Accordion */}
              <motion.div variants={heroInfoItemVariants}>
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer py-2">
                    <h3 className="text-sm md:text-base font-medium text-black uppercase tracking-wide">
                      Warranty Return
                    </h3>
                    <svg
                      className="w-5 h-5 text-black transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="pt-2 pb-4">
                    <p className="text-[#6c6a6a] text-sm md:text-base font-light leading-relaxed italic">
                      No information available at this time. Warranty details
                      will be updated soon.
                    </p>
                  </div>
                </details>
              </motion.div>

              {/* Divider */}
              <motion.div
                variants={heroInfoItemVariants}
                className="h-px bg-gray-200 w-full"
              />

              {/* More Info Accordion */}
              <motion.div variants={heroInfoItemVariants}>
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer py-2">
                    <h3 className="text-sm md:text-base font-medium text-black uppercase tracking-wide">
                      More Info
                    </h3>
                    <svg
                      className="w-5 h-5 text-black transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="pt-2 pb-4">
                    <p className="text-[#6c6a6a] text-sm md:text-base font-light leading-relaxed italic">
                      No additional information available at this time. Product
                      specifications will be updated soon.
                    </p>
                  </div>
                </details>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        <ComparisonSection />
      </motion.div>

      {/* Result Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={slideFromRightVariants}
      >
        <ResultSection />
      </motion.div>

      {/* User Experience Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={slideFromLeftVariants}
      >
        <UserExperienceSection />
      </motion.div>

      {/* India Story Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={scaleUpVariants}
      >
        <IndiaStorySection />
      </motion.div>

      {/* After Buy Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        <AfterBuySection />
      </motion.div>

      {/* Warranty Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={slideFromRightVariants}
      >
        <WarrantySection />
      </motion.div>

      {/* Recognition Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={scaleUpVariants}
      >
        <RecognitionSection />
      </motion.div>

      {/* Built For Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        <BuiltForSection />
      </motion.div>

      {/* Mobile Fixed Footer */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={mobileFooterVariants}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/50 backdrop-blur-3xl backdrop-saturate-200 border-t border-white/[0.15] shadow-[0_-4px_30px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(255,255,255,0.08)] before:absolute before:inset-x-0 before:top-0 before:h-[50%] before:bg-gradient-to-b before:from-white/[0.12] before:to-transparent before:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-[50%] after:bg-gradient-to-t after:from-white/[0.06] after:to-transparent after:pointer-events-none"
      >
        <div className="px-4 py-4 flex items-center gap-3">
          {userAllowedToBuy ? (
            <>
              <motion.button
                onClick={handleAddToCart}
                disabled={isCartLoading || !canAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-full font-medium text-sm transition-all ${
                  buttonState === "loading"
                    ? "bg-gray-300 text-gray-500"
                    : buttonState === "outOfStock"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-white text-black hover:bg-white/90 disabled:opacity-50"
                }`}
                whileHover={canAddToCart ? { scale: 1.02 } : {}}
                whileTap={canAddToCart ? { scale: 0.98 } : {}}
              >
                <CartIcon className="w-5 h-5" />
                <span>
                  {buttonState === "loading"
                    ? "Loading..."
                    : buttonState === "outOfStock"
                      ? "Out of Stock"
                      : "Add to Cart"}
                </span>
              </motion.button>
              <motion.button
                disabled={!canAddToCart}
                className={`flex-1 px-4 py-3.5 rounded-full font-medium text-sm text-center transition-all ${
                  buttonState === "loading"
                    ? "bg-gray-400 text-gray-600"
                    : buttonState === "outOfStock"
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "btn-buy-now text-[#FFFCDC]"
                }`}
                whileHover={canAddToCart ? { scale: 1.02 } : {}}
                whileTap={canAddToCart ? { scale: 0.98 } : {}}
              >
                {buttonState === "loading"
                  ? "Loading..."
                  : buttonState === "outOfStock"
                    ? "Unavailable"
                    : "Buy Now"}
              </motion.button>
            </>
          ) : (
            <motion.button
              onClick={openWaitlistModal}
              className="flex-1 px-4 py-3.5 rounded-full font-medium text-sm text-center btn-buy-now text-[#FFFCDC] transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Join the Waitlist
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
