"use client";

import {
  CartIcon,
  InstallationIcon,
  ServiceCommitmentIcon,
  ShoppingBagIcon,
  WarrantyIcon,
} from "@/components/icons/ProductIcons";
import { ImageGallery, QuantityDropdown } from "@/components/products";
import { useToast } from "@/components/ui/Toast";
import { useCart, buildBusinessCartAttributes } from "@/contexts/CartContext";
import {
  useProducts,
  ProductsProvider,
  type DisplayVariant,
} from "@/contexts/ProductsContext";
import { useJudgeMeRating } from "@/lib/judgeme";
import {
  type Product,
  type ProductPageContent,
  type VariantRichText,
} from "@/lib/shopify";
import { redirectWithAnalytics } from "@/lib/analytics";
import { RichTextContent } from "@/lib/richTextRenderer";
import PincodeModal from "@/components/ui/PincodeModal";
import Link from "next/link";
import dynamic from "next/dynamic";

// Below-the-fold sections — split into their own chunks to shrink the main
// hydration bundle. SSR is preserved (default) so SEO-relevant copy still
// ships in the initial HTML.
// ComparisonSection is included here even though it's the first section
// after the hero — it imports GSAP, which would otherwise ship in the
// initial chunk and bloat hydration. Splitting it out keeps GSAP off the
// LCP/TBT path.
const ComparisonSection = dynamic(() =>
  import("@/components/products/ComparisonSection").then((m) => ({
    default: m.ComparisonSection,
  })),
);
const BusinessPurchaseSection = dynamic(() =>
  import("@/components/products/BusinessPurchaseSection").then((m) => ({
    default: m.BusinessPurchaseSection,
  })),
);
const ExpertTestimonialsSection = dynamic(() =>
  import("@/components/products/ExpertTestimonialsSection").then((m) => ({
    default: m.ExpertTestimonialsSection,
  })),
);
const InsideOptimistSection = dynamic(() =>
  import("@/components/products/InsideOptimistSection").then((m) => ({
    default: m.InsideOptimistSection,
  })),
);
const TeamSection = dynamic(() =>
  import("@/components/products/TeamSection").then((m) => ({
    default: m.TeamSection,
  })),
);
const ProofSection = dynamic(() =>
  import("@/components/products/ProofSection").then((m) => ({
    default: m.ProofSection,
  })),
);
const AsFeaturedSection = dynamic(() =>
  import("@/components/products/AsFeaturedSection").then((m) => ({
    default: m.AsFeaturedSection,
  })),
);
const WarrantySection = dynamic(() =>
  import("@/components/products/WarrantySection").then((m) => ({
    default: m.WarrantySection,
  })),
);
const ReviewsSection = dynamic(() =>
  import("@/components/products/ReviewsSection").then((m) => ({
    default: m.ReviewsSection,
  })),
);
const BuiltForSection = dynamic(() =>
  import("@/components/products/BuiltForSection").then((m) => ({
    default: m.BuiltForSection,
  })),
);
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// NOTE: framer-motion was removed from this file (see PageSpeed pass).
// The outer page wrapper used to be a <motion.div> with initial={opacity:0}
// which kept the LCP image invisible until hydration completed — costing
// ~3.7s of "element render delay" on mobile. Hero fade-ins were also opacity
// 0 → 1 motion wrappers, blocking the same paint. They were swapped for
// plain divs. Below-the-fold sections each handle their own scroll-in
// animations (GSAP / CSS), so the wrappers in this file were redundant.

// =============================================================================
// Constants
// =============================================================================

const MAX_DISPLAY_IMAGES = 20;
const QUANTITY_OPTIONS = [1, 2, 3, 4, 5] as const;
// =============================================================================
// Utils - Moved outside component to avoid recreation
// =============================================================================

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN").format(price);
}

function getVariantRichText(
  data: VariantRichText | undefined,
  tonnage: string,
) {
  if (!data) return null;
  if (tonnage === "1" || tonnage === "1.0") return data["1_0_ton"];
  if (tonnage === "1.5") return data["1_5_ton"];
  if (tonnage === "2" || tonnage === "2.0") return data["2_0_ton"];
  return data["1_5_ton"];
}

// =============================================================================
// Props
// =============================================================================

interface ProductsPageClientProps {
  product: Product | null;
  products: Product[];
  pageContent: ProductPageContent | null;
  initialTitle: string;
}

// =============================================================================
// Main Component
//
// Outer wrapper installs a route-scoped <ProductsProvider> seeded with the
// server-fetched product list. This shadows the global ProductsProvider in
// Providers.tsx for this subtree, so useProducts() consumers see real data
// at the very first render instead of an empty/loading state that fills in
// only after a client-side Shopify fetch (which used to add ~500-1500 ms
// of hydration jank — variants flashed in, prices jumped).
// =============================================================================

export default function ProductsPageClient(props: ProductsPageClientProps) {
  return (
    <ProductsProvider initialProducts={props.products}>
      <ProductsPageInner {...props} />
    </ProductsProvider>
  );
}

function ProductsPageInner({
  product,
  pageContent,
  initialTitle,
}: ProductsPageClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const variantsScrollRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const mobileGalleryRef = useRef<HTMLDivElement>(null);
  const [showMobileFooter, setShowMobileFooter] = useState(false);
  const [showPincodeModal, setShowPincodeModal] = useState(false);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isQuantityOpen, setIsQuantityOpen] = useState(false);
  const {
    addToCart,
    buyNow,
    isLoading: isCartLoading,
    businessDetails,
  } = useCart();
  const { showToast } = useToast();
  const {
    products: shopProducts,
    combinedProduct,
    isLoading: isProductsLoading,
  } = useProducts();
  // Get variants from combined product (each Shopify product = one variant option)
  // TEMPORARY: Exclude Inner Circle Club — only show AC variants on this page
  const variants = useMemo((): DisplayVariant[] => {
    if (combinedProduct && combinedProduct.allVariants.length > 0) {
      const acVariants = combinedProduct.allVariants.filter(
        (v) => !v.productTitle.toLowerCase().includes("inner circle"),
      );
      return acVariants || [];
    }
    return [];
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

  // Re-init Snapmint EMI widget when the variant/price changes — the script
  // binds the EMI calculation to the price in `data-snapmint-price`, so a
  // variant switch needs `window.loadOnPage()` to re-read the new value.
  useEffect(() => {
    if (selectedVariant?.price) {
      const tid = setTimeout(() => {
        window.loadOnPage?.();
      }, 500);
      return () => clearTimeout(tid);
    }
  }, [selectedVariant?.price]);

  const activeProductId = selectedVariant?.productId || product?.id;
  const { rating: judgeRating, count: judgeCount } =
    useJudgeMeRating(activeProductId);

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
    if (product?.media?.edges.length) {
      return product.media.edges
        .map(({ node }) => {
          if (node.mediaContentType === "IMAGE" && node.image)
            return node.image.url;
          if (node.mediaContentType === "VIDEO" && node.sources?.length) {
            const mp4 = node.sources.find((s) => s.mimeType === "video/mp4");
            return (mp4 || node.sources[0]).url;
          }
          return null;
        })
        .filter((url): url is string => url !== null);
    }
    if (product?.images.edges.length) {
      return product.images.edges.map((e) => e.node.url);
    }
    return [];
  }, [selectedVariant, combinedProduct, product]);

  const displayImages = useMemo(() => {
    if (images.length >= MAX_DISPLAY_IMAGES) {
      return images.slice(0, MAX_DISPLAY_IMAGES);
    }
    return [...images].slice(0, MAX_DISPLAY_IMAGES);
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

  const handleBuyNow = useCallback(() => {
    if (!selectedVariant || !selectedVariant.variantId) {
      showToast("Please select a variant", "error");
      return;
    }
    if (!selectedVariant.available) {
      showToast("This variant is out of stock", "error");
      return;
    }
    setShowPincodeModal(true);
  }, [selectedVariant, showToast]);

  const handleBuyNowConfirmed = useCallback(async () => {
    if (!selectedVariant || !selectedVariant.variantId) return;
    setIsBuyNowLoading(true);
    try {
      const attributes =
        businessDetails.isBusinessPurchase && businessDetails.verified
          ? buildBusinessCartAttributes(businessDetails)
          : undefined;

      const checkoutUrl = await buyNow(
        selectedVariant.variantId,
        quantity,
        attributes,
      );
      if (checkoutUrl) {
        redirectWithAnalytics(checkoutUrl);
      } else {
        showToast("Failed to initiate checkout", "error");
        setIsBuyNowLoading(false);
      }
    } catch {
      showToast("Failed to proceed to checkout", "error");
      setIsBuyNowLoading(false);
    }
  }, [selectedVariant, quantity, buyNow, showToast, businessDetails]);

  if (isProductUnavailable) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 pt-24">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-xl md:text-2xl font-semibold text-[#0A0A0A]">
            Product unavailable
          </h1>
          <p className="text-[#737373]">
            We couldn’t load this product. Please check back later or browse our
            homepage.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-[#0A0A0A] text-white px-6 py-3 font-medium hover:bg-[#1a1a1a] transition-colors"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-white md:pb-0 overflow-x-clip"
    >
      {/* Product Detail Section */}
      <div ref={heroRef} className="pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-16">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16">
            {/* Left Column - Image Gallery
                Rendered as a plain div (no Framer Motion fade-in) because this
                contains the LCP product image — any opacity:0 initial state
                delays LCP by the full hydration+animation duration. */}
            <div className="hidden lg:block w-full">
              <ImageGallery
                images={displayImages}
                selectedIndex={selectedImageIndex}
                onSelectImage={handleSelectImage}
                onPrev={handlePrevImage}
                onNext={handleNextImage}
              />
            </div>

            {/* Right Column - Product Info */}
            <div className="w-full space-y-4 md:space-y-5">
              {/* Badge */}
              <div className="flex items-center gap-2">
                <span className="relative inline-flex items-center justify-center px-3 py-1.5 md:px-4 md:py-2 bg-[rgba(52,120,246,0.12)] text-[#3478F6] text-xs md:text-sm font-normal rounded-full shadow-[inset_0px_-2px_4px_0px_#ccdeff]">
                  India’s Real AC
                </span>
                {isOutOfStock && (
                  <span className="inline-flex items-center justify-center px-3 py-1.5 md:px-4 md:py-2 bg-red-100 text-red-600 text-xs md:text-sm font-medium rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Title & Star Rating — plain div, not motion: this H1 is the
                  LCP element on desktop, and Framer Motion's opacity:0 →
                  opacity:1 fade-in delays LCP timing until the animation
                  completes (~600ms after mount). */}
              <div className="flex flex-col gap-1.5">
                <h1 className="text-[20px] md:text-[40px] font-semibold text-black leading-tight">
                  {selectedVariant?.productTitle || initialTitle}
                </h1>
                {judgeCount > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const filled = judgeRating >= star;
                        const half = !filled && judgeRating >= star - 0.5;
                        return (
                          <svg
                            key={star}
                            className="w-4 h-4 md:w-5 md:h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            {half && (
                              <defs>
                                <linearGradient id={`halfStar-${star}`}>
                                  <stop offset="50%" stopColor="#F5A623" />
                                  <stop offset="50%" stopColor="#D1D5DB" />
                                </linearGradient>
                              </defs>
                            )}
                            <path
                              fill={
                                filled
                                  ? "#F5A623"
                                  : half
                                    ? `url(#halfStar-${star})`
                                    : "#D1D5DB"
                              }
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            />
                          </svg>
                        );
                      })}
                    </div>
                    <span className="text-sm md:text-base text-[#6c6a6a]">
                      ({new Intl.NumberFormat("en-IN").format(judgeCount)})
                    </span>
                  </div>
                )}
              </div>

              {/* Mobile Image Gallery — same rationale as desktop: this is
                  the LCP element, so it must paint immediately without
                  Framer Motion's fade-in. */}
              <div ref={mobileGalleryRef} className="lg:hidden">
                <ImageGallery
                  images={displayImages}
                  selectedIndex={selectedImageIndex}
                  onSelectImage={handleSelectImage}
                  onPrev={handlePrevImage}
                  onNext={handleNextImage}
                />
              </div>

              {/* Total/Price */}
              <div ref={priceRef} className="flex flex-col gap-1.5">
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
                  (inclusive of all taxes)
                </span>
                {selectedVariantOutOfStock && (
                  <span className="text-red-500 text-sm font-medium">
                    This variant is currently out of stock
                  </span>
                )}
              </div>

              {/* Quantity */}
              <div className="md:mt-[-20px] mt-[-12px]">
                <QuantityDropdown
                  quantity={quantity}
                  onQuantityChange={handleQuantityChange}
                  isOpen={isQuantityOpen}
                  onToggle={handleQuantityToggle}
                  options={QUANTITY_OPTIONS}
                />
              </div>

              {/* Business Purchase (GST) */}
              <div>
                <BusinessPurchaseSection />
              </div>

              {/* Snapmint EMI Widget — the loader script (mounted globally in
                  layout.tsx via SnapmintLoader) injects EMI copy into
                  `.snap_emi_txt` based on the price in
                  `.snapmint_lowest_emi_value`. Both elements must exist for
                  the widget to render. */}
              <div>
                <div className="snap_emi_txt"></div>
                <span
                  className="snapmint_lowest_emi_value"
                  style={{ display: "none" }}
                  data-snapmint-price={selectedVariant?.price || 0}
                  data-snapmint-merchant_id={"8097"}
                  data-snapmint-page="products_page"
                ></span>
              </div>

              {/* Variants */}
              {/* <motion.div
                variants={heroInfoItemVariants}
                className="flex flex-col gap-3 md:gap-4"
              >
                <h3 className="text-sm md:text-base font-medium text-black uppercase tracking-wide">
                  Choose your Optimist
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
                      className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 touch-auto"
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
              </motion.div> */}

              {/* Action Buttons
                  CSS hover/active scale instead of framer-motion whileHover/whileTap.
                  The .btn-scale class is defined in globals.css. */}
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 md:gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={isCartLoading || !canAddToCart}
                    className={`btn-scale flex-1 flex items-center justify-center gap-2 md:gap-2.5 px-4 md:px-6 py-3 md:py-4 border rounded-full font-medium text-sm md:text-base transition-all ${
                      buttonState === "loading"
                        ? "border-gray-200 text-gray-400"
                        : buttonState === "outOfStock"
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-[rgba(0,0,0,0.12)] text-black hover:border-[rgba(0,0,0,0.24)] disabled:opacity-50"
                    }`}
                  >
                    <ShoppingBagIcon className="w-5 h-5 md:w-6 md:h-6" />
                    <span>
                      {buttonState === "loading"
                        ? "Loading..."
                        : buttonState === "outOfStock"
                          ? "Out of Stock"
                          : "Add to Cart"}
                    </span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={isCartLoading || !canAddToCart}
                    className={`btn-scale flex-1 px-4 md:px-6 py-3 md:py-4 rounded-full font-medium text-sm md:text-base text-center transition-all ${
                      buttonState === "loading"
                        ? "bg-gray-300 text-gray-500"
                        : buttonState === "outOfStock"
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "btn-buy-now text-[#FFFCDC]"
                    }`}
                  >
                    {buttonState === "loading"
                      ? "Loading..."
                      : buttonState === "outOfStock"
                        ? "Unavailable"
                        : "Buy Now"}
                  </button>
                </div>
                <button
                  onClick={() => {
                    (window as any).saleassist?.mountWidget({
                      id: "b64c75ac-d186-4979-a841-1572d8d9614b",
                    });
                  }}
                  className="btn-scale w-full flex items-center justify-center gap-2 md:gap-2.5 px-4 md:px-6 py-3 md:py-4 border border-[rgba(0,0,0,0.12)] rounded-full font-medium text-sm md:text-base text-black hover:border-[rgba(0,0,0,0.24)] transition-all"
                >
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                  <span>Live Demo</span>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                  </span>
                </button>
              </div>

              {/* Feature Icons Row */}
              <div>
                <div className="w-full grid grid-cols-3 gap-2 py-4 px-3 bg-[#F8F8F8] rounded-xl">
                  {[
                    {
                      icon: InstallationIcon,
                      label: "30 Days Return\nNo Question Asked",
                    },
                    {
                      icon: WarrantyIcon,
                      label: "5 Years Warranty\nNo Hidden Charges",
                    },
                    {
                      icon: ServiceCommitmentIcon,
                      label: "48 Hours Delivery\n& Installation",
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
                <div className="mt-3 w-full overflow-hidden rounded-xl bg-[#F8F8F8]">
                  <div className="px-4 py-4 md:px-5 md:py-5">
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-row flex-wrap items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[#111827] leading-6">
                            Installation & Demo
                          </p>
                          <p className="mt-1 text-sm text-[#333333] leading-6">
                            Brand-authorised installation by verified Optimist
                            experts.
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-[#111827] leading-6 shrink-0">
                          ₹1,499 + GST
                        </p>
                      </div>
                      <p className="text-sm text-[#4B5563] leading-6">
                        Additional accessories/materials chargeable if required.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-200 w-full" />

              {/* Description Accordion */}
              <div>
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer py-2">
                    <h3 className="text-sm md:text-base font-medium text-black uppercase tracking-wide">
                      Intelligent Features
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
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-200 w-full" />

              {/* More Info Accordion */}
              <div>
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer py-2">
                    <h3 className="text-sm md:text-base font-medium text-black uppercase tracking-wide">
                      Product Specs
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
                  <RichTextContent
                    node={getVariantRichText(
                      pageContent?.productMoreInfo,
                      selectedVariant?.tonnage ?? "1.5",
                    )}
                  />
                </details>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-200 w-full" />

              {/* Warranty Return Accordion */}
              <div>
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer py-2">
                    <h3 className="text-sm md:text-base font-medium text-black uppercase tracking-wide">
                      Warranty
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
                  <RichTextContent
                    node={getVariantRichText(
                      pageContent?.warrantyReturnInfo,
                      selectedVariant?.tonnage ?? "1.5",
                    )}
                  />
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Below-the-fold sections.
          The motion.div whileInView wrappers that used to sit here were
          removed — each section already runs its own scroll-in animation
          (GSAP / CSS), so the outer wrappers added framer-motion to the
          initial bundle without adding any visual effect. */}
      <ComparisonSection />

      {/* Expert Testimonials Section */}
      <ExpertTestimonialsSection experts={pageContent?.expertTestimonials} />

      <InsideOptimistSection />

      <TeamSection />

      <ProofSection />

      <AsFeaturedSection />

      <WarrantySection />

      <ReviewsSection
        products={shopProducts.map((p) => ({
          id: p.id,
          label: p.title,
        }))}
        productId={selectedVariant?.productId || product?.id}
      />

      <BuiltForSection />

      {/* Mobile Fixed Footer — show/hide via CSS transform (no framer-motion). */}
      <div
        aria-hidden={!showMobileFooter}
        style={{ pointerEvents: showMobileFooter ? "auto" : "none" }}
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/85 backdrop-blur-md border-t border-white/[0.12] shadow-[0_-4px_20px_rgba(0,0,0,0.3)] transition-[opacity,transform] duration-300 ease-out [transform:translateZ(0)] ${
          showMobileFooter
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-5"
        }`}
      >
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isCartLoading || !canAddToCart}
              className={`btn-scale flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full font-medium text-sm transition-all ${
                buttonState === "loading"
                  ? "bg-gray-300 text-gray-500"
                  : buttonState === "outOfStock"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white text-black hover:bg-white/90 disabled:opacity-50"
              }`}
            >
              <CartIcon className="w-5 h-5" />
              <span>
                {buttonState === "loading"
                  ? "Loading..."
                  : buttonState === "outOfStock"
                    ? "Out of Stock"
                    : "Add to Cart"}
              </span>
            </button>
            <button
              onClick={handleBuyNow}
              disabled={isCartLoading || !canAddToCart}
              className={`btn-scale flex-1 px-4 py-3 rounded-full font-medium text-sm text-center transition-all ${
                buttonState === "loading"
                  ? "bg-gray-400 text-gray-600"
                  : buttonState === "outOfStock"
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "btn-buy-now text-[#FFFCDC]"
              }`}
            >
              {buttonState === "loading"
                ? "Loading..."
                : buttonState === "outOfStock"
                  ? "Unavailable"
                  : "Buy Now"}
            </button>
          </div>
        </div>
      </div>

      {/* Pincode Check Modal — opens on Buy Now */}
      <PincodeModal
        isOpen={showPincodeModal}
        onClose={() => {
          setShowPincodeModal(false);
          setIsBuyNowLoading(false);
        }}
        onConfirm={handleBuyNowConfirmed}
        confirmLabel="Proceed to Checkout →"
        loadingLabel="Opening checkout…"
        isConfirmLoading={isBuyNowLoading}
      />
    </div>
  );
}
