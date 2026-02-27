"use client";

import {
  CartIcon,
  HeadphoneIcon,
  InstallationIcon,
  ServiceCommitmentIcon,
  ShoppingBagIcon,
  WarrantyIcon,
} from "@/components/icons/ProductIcons";
import {
  AsFeaturedSection,
  BuiltForSection,
  ComparisonSection,
  CustomerVideosSection,
  ExpertTestimonialsSection,
  ImageGallery,
  InsideOptimistSection,
  ProofSection,
  QuantityDropdown,
  ResultSection,
  ReviewsSection,
  TeamSection,
  VariantCard,
  WarrantySection,
} from "@/components/products123";
import { useToast } from "@/components/ui/Toast";
import { useCart } from "@/contexts/CartContext";
import { useProducts, type DisplayVariant } from "@/contexts/ProductsContext";
import { useWaitlist } from "@/contexts/WaitlistContext";
import { ASSETS } from "@/lib/assets";
import { type Product } from "@/lib/shopify";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

// Section animation variants — lightweight (opacity-only on mobile, small y on desktop)
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOutExpo,
    },
  },
};

const slideFromLeftVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: easeOutExpo,
    },
  },
};

const slideFromRightVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: easeOutExpo,
    },
  },
};

const scaleUpVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easeOutExpo,
    },
  },
};

// Hero section variants
const heroGalleryVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
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
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
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
    productTitle: "Optimist 1 Ton 5 Star Inverter Split AC",
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
    productTitle: "Optimist 1.5 Ton 5 Star Inverter Split AC",
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
    productTitle: "Optimist 2 Ton 5 Star Inverter Split AC",
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
  const priceRef = useRef<HTMLDivElement>(null);
  const mobileGalleryRef = useRef<HTMLDivElement>(null);
  const [showMobileFooter, setShowMobileFooter] = useState(false);
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

  // Show mobile footer when mobile image gallery scrolls out of viewport
  useEffect(() => {
    const el = mobileGalleryRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowMobileFooter(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
      className="min-h-screen bg-white md:pb-0 overflow-x-clip"
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
              className="hidden lg:block w-full"
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
              className="w-full space-y-4 md:space-y-5"
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

              {/* Title & Star Rating */}
              <motion.div
                variants={heroInfoItemVariants}
                className="flex flex-col gap-1.5"
              >
                <h1 className="text-[20px] md:text-[40px] font-semibold text-black leading-tight">
                  {selectedVariant?.productTitle ||
                    `Optimist ${selectedVariant?.name || ""} 5 Star Inverter Split AC`}
                </h1>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center">
                    {[1, 2, 3, 4].map((star) => (
                      <svg
                        key={star}
                        className="w-4 h-4 md:w-5 md:h-5 text-[#F5A623]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <defs>
                        <linearGradient id="halfStar">
                          <stop offset="50%" stopColor="#F5A623" />
                          <stop offset="50%" stopColor="#D1D5DB" />
                        </linearGradient>
                      </defs>
                      <path
                        fill="url(#halfStar)"
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm md:text-base text-[#6c6a6a]">
                    (2,401)
                  </span>
                </div>
              </motion.div>

              {/* Mobile Image Gallery */}
              <motion.div
                ref={mobileGalleryRef}
                variants={heroInfoItemVariants}
                className="lg:hidden"
              >
                <ImageGallery
                  images={displayImages}
                  selectedIndex={selectedImageIndex}
                  onSelectImage={handleSelectImage}
                  onPrev={handlePrevImage}
                  onNext={handleNextImage}
                />
              </motion.div>

              {/* Total/Price */}
              <motion.div
                ref={priceRef}
                variants={heroInfoItemVariants}
                className="flex flex-col gap-1.5"
              >
                <h3 className="text-sm md:text-base font-medium text-black uppercase tracking-wide">
                  Total
                </h3>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-semibold text-black">
                    Rs {formatPrice(selectedVariant?.price || 0)}.00
                  </span>
                  {selectedVariant?.compareAtPrice &&
                    selectedVariant.compareAtPrice > selectedVariant.price && (
                      <>
                        <span className="text-base md:text-lg text-[#6c6a6a] line-through">
                          Rs {formatPrice(selectedVariant.compareAtPrice)}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs md:text-sm font-medium bg-[#E8F5E9] text-[#2E7D32]">
                          {Math.round(
                            ((selectedVariant.compareAtPrice -
                              selectedVariant.price) /
                              selectedVariant.compareAtPrice) *
                              100,
                          )}
                          % off
                        </span>
                      </>
                    )}
                </div>
                <span className="text-[#6c6a6a] text-sm md:text-base font-light">
                  (inclusive of all the taxes)
                </span>
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

              {/* Action Buttons - Desktop */}
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
                  <>
                    <motion.button
                      onClick={openWaitlistModal}
                      className="flex-1 flex items-center justify-center gap-2.5 px-6 py-4 border border-[rgba(0,0,0,0.12)] rounded-full font-medium text-base text-black hover:border-[rgba(0,0,0,0.24)] transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ShoppingBagIcon className="w-6 h-6" />
                      <span>Add to Cart</span>
                    </motion.button>
                    <motion.button
                      onClick={openWaitlistModal}
                      className="flex-1 px-6 py-4 rounded-full font-medium text-base text-center btn-buy-now text-[#FFFCDC] transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      Buy Now
                    </motion.button>
                  </>
                )}
              </motion.div>

              {/* Snapmint Banner */}
              <motion.div variants={heroInfoItemVariants}>
                <div className="w-full flex items-center justify-center py-3 bg-[#F5F5F5] rounded-lg">
                  <img
                    src="/assets/snapmint-logo.png"
                    alt="Snapmint"
                    className="h-6 md:h-7 w-auto object-contain"
                  />
                </div>
              </motion.div>

              {/* Variants */}
              <motion.div
                variants={heroInfoItemVariants}
                className="flex flex-col gap-3 md:gap-4"
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
                      className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 touch-pan-x"
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

              {/* Feature Icons Row */}
              <motion.div variants={heroInfoItemVariants}>
                <div className="w-full grid grid-cols-4 gap-2 py-4 px-3 bg-[#F8F8F8] rounded-xl">
                  {[
                    {
                      icon: InstallationIcon,
                      label: "Free\nInstallation",
                    },
                    {
                      icon: WarrantyIcon,
                      label: "5 Year\nWarranty",
                    },
                    {
                      icon: HeadphoneIcon,
                      label: "24x7\nsupport",
                    },
                    {
                      icon: ServiceCommitmentIcon,
                      label: "48 hrs service\ncommitment",
                    },
                  ].map((feature) => (
                    <div
                      key={feature.label}
                      className="flex flex-col items-center gap-1.5 text-center"
                    >
                      <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-[#333]" />
                      <span className="text-[10px] md:text-xs text-[#333] leading-tight whitespace-pre-line">
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>
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
                      Warranty & Return
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
                  <div className="pt-2 pb-4 text-[#6c6a6a] text-sm md:text-base font-light leading-relaxed space-y-4">
                    <div>
                      <h4 className="font-semibold text-black mb-2">
                        Comprehensive Warranty Protection
                      </h4>
                    </div>

                    <div>
                      <h5 className="font-medium text-black mb-1">
                        Outdoor Unit
                      </h5>
                      <p>
                        5-Year comprehensive warranty on all outdoor unit parts
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium text-black mb-1">
                        10-Year warranty on compressor
                      </h5>
                    </div>

                    <div>
                      <h5 className="font-medium text-black mb-1">
                        Indoor Unit
                      </h5>
                      <p>
                        5-Year warranty on critical functional components (PCB,
                        blower motor, sensors, control electronics)
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>No labour charges on covered repairs</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>
                          Covered parts repaired or replaced at ₹0 (T&Cs apply)
                        </span>
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium text-black mb-2">
                        Important Warranty Conditions
                      </h5>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Valid for normal residential use only</li>
                        <li>
                          Installation & servicing must be done by{" "}
                          <span className="font-medium text-black">
                            Optimist-authorised technicians
                          </span>
                        </li>
                        <li>
                          Warranty activation via{" "}
                          <span className="font-medium text-black">
                            Optimist App is mandatory
                          </span>
                        </li>
                        <li>
                          Two preventive services required every year
                          (pre-season & post-season)
                        </li>
                        <li>
                          Year-1 preventive services free | From Year-2
                          chargeable
                        </li>
                        <li>
                          Physical damage, misuse, tampering, cosmetic parts &
                          commercial use excluded
                        </li>
                        <li>
                          Warranty void if serviced by unauthorised personnel
                        </li>
                        <li>
                          For full terms, visit{" "}
                          <span className="font-medium text-black">
                            optimist.in/warranty
                          </span>
                        </li>
                      </ul>
                    </div>
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
                  <div className="pt-2 pb-4 text-[#6c6a6a] text-sm md:text-base font-light leading-relaxed space-y-4">
                    <div>
                      <h4 className="font-semibold text-black mb-2">
                        Intelligent Features
                      </h4>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Turbo+ Capacity Boost</li>
                        <li>First-ever Built-in Gas Level Indicator</li>
                        <li>Auto Clean Function</li>
                        <li>Eco / Energy Saver Mode</li>
                        <li>Sleep Mode</li>
                        <li>Smart Scheduling & Timer</li>
                        <li>Wi-Fi Enabled with Optimist App</li>
                        <li>Real-time Energy Monitoring</li>
                        <li>Voice Control (Alexa / Google)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-black mb-2">
                        Technical Specifications
                      </h4>
                      <ul className="space-y-1">
                        <li>
                          <span className="font-medium text-black">
                            Capacity:
                          </span>{" "}
                          1.5 Ton
                        </li>
                        <li>
                          <span className="font-medium text-black">
                            Energy Rating:
                          </span>{" "}
                          5 Star
                        </li>
                        <li>
                          <span className="font-medium text-black">ISEER:</span>{" "}
                          6.05
                        </li>
                        <li>
                          <span className="font-medium text-black">
                            Refrigerant:
                          </span>{" "}
                          R-32
                        </li>
                        <li>
                          <span className="font-medium text-black">
                            Annual Energy Consumption:
                          </span>{" "}
                          620.2 kWh
                        </li>
                        <li>
                          <span className="font-medium text-black">
                            Cooling Capacity:
                          </span>{" "}
                          4.85 kW
                        </li>
                        <li>
                          <span className="font-medium text-black">
                            Power Input:
                          </span>{" "}
                          1070 W
                        </li>
                        <li>
                          <span className="font-medium text-black">
                            Voltage:
                          </span>{" "}
                          230V
                        </li>
                        <li>
                          <span className="font-medium text-black">
                            Noise Level:
                          </span>{" "}
                          32–46 dB
                        </li>
                        <li>
                          <span className="font-medium text-black">
                            System Type:
                          </span>{" "}
                          Split Inverter AC
                        </li>
                        <li>
                          <span className="font-medium text-black">
                            Country of Origin:
                          </span>{" "}
                          India
                        </li>
                      </ul>
                    </div>
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
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
      >
        <ComparisonSection />
      </motion.div>

      {/* Result Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={slideFromRightVariants}
      >
        <ResultSection />
      </motion.div>

      {/* Customer Videos Section */}
      <CustomerVideosSection />

      {/* Expert Testimonials Section */}
      <ExpertTestimonialsSection />

      {/* Inside Optimist Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
      >
        <InsideOptimistSection />
      </motion.div>

      {/* Team Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={scaleUpVariants}
      >
        <TeamSection />
      </motion.div>

      {/* Proof over Promises Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
      >
        <ProofSection />
      </motion.div>

      {/* As Featured On Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
      >
        <AsFeaturedSection />
      </motion.div>

      {/* Warranty Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={slideFromRightVariants}
      >
        <WarrantySection />
      </motion.div>

      {/* Reviews Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
      >
        <ReviewsSection />
      </motion.div>

      {/* Built For Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
      >
        <BuiltForSection />
      </motion.div>

      {/* Mobile Fixed Footer - appears when price reaches mid-screen */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={
          showMobileFooter ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
        }
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ pointerEvents: showMobileFooter ? "auto" : "none" }}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/85 backdrop-blur-md border-t border-white/[0.12] shadow-[0_-4px_20px_rgba(0,0,0,0.3)] [transform:translateZ(0)]"
      >
        <div className="px-4 py-4">
          {userAllowedToBuy ? (
            <div className="flex items-center gap-3">
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
            </div>
          ) : (
            <motion.button
              onClick={openWaitlistModal}
              className="w-full px-4 py-3.5 rounded-full font-medium text-base text-center btn-buy-now text-[#FFFCDC] transition-all"
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
