"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { RotateCcw, Share2, ShieldCheck, Truck } from "lucide-react";
import { viewportOnce } from "@/lib/motion-variants";

const sectionStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const blockReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};
import { useProducts } from "@/contexts/ProductsContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/Toast";
import { ASSETS } from "@/lib/assets";
import { useJudgeMeRating } from "@/lib/judgeme";
import { redirectWithAnalytics } from "@/lib/analytics";
import PincodeModal from "@/components/ui/PincodeModal";

// Static copy keyed by variant ID — used for headline/tagline/features
const VARIANT_COPY: Record<
  string,
  {
    headline: string;
    tagline: string;
    features: string[];
    savings: string;
  }
> = {};

const DEFAULT_COPY = {
  headline: "Designed right for India",
  tagline: "Cools 120 to 200 sft rooms",
  features: [
    "30 Days Return -No Question Asked",
    "5 Years Warranty -No Hidden Charges",
    "48 Hours Delivery & Installation",
  ],
  savings: "",
};

const FEATURE_ICONS = [RotateCcw, ShieldCheck, Truck];

function getFeatureParts(feature: string) {
  const [title, subtitle] = feature.split(/\s*-\s*/);

  return {
    title,
    subtitle,
  };
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN").format(price);
}

// ACVideo replaced by a static image (ASSETS.optimistImageAsset) for better
// performance. Restore this component if the hover-reverse video is brought back.
// function ACVideo() {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const requestRef: any = useRef<number>(null);
//   const lastTimeRef: any = useRef<number>(null);
//
//   const animateReverse = (time: number) => {
//     if (!videoRef.current) return;
//
//     if (lastTimeRef.current !== undefined) {
//       const delta = (time - lastTimeRef.current) * 0.001;
//       videoRef.current.currentTime = Math.max(
//         0,
//         videoRef.current.currentTime - delta,
//       );
//     }
//     lastTimeRef.current = time;
//
//     if (videoRef.current.currentTime > 0) {
//       requestRef.current = requestAnimationFrame(animateReverse);
//     } else {
//       lastTimeRef.current = undefined;
//     }
//   };
//
//   const handleMouseEnter = () => {
//     if (requestRef.current) {
//       cancelAnimationFrame(requestRef.current);
//       requestRef.current = undefined;
//       lastTimeRef.current = undefined;
//     }
//     videoRef.current?.play().catch((e) => {});
//   };
//
//   const handleMouseLeave = () => {
//     videoRef.current?.pause();
//     requestRef.current = requestAnimationFrame(animateReverse);
//   };
//
//   return (
//     <video
//       ref={videoRef}
//       src={ASSETS.videos.productCardAnimation2}
//       className="w-full h-auto object-contain cursor-pointer bg-transparent"
//       muted
//       playsInline
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//     />
//   );
// }

export function ProductPickerSection() {
  const { showToast } = useToast();
  const { combinedProduct, isLoading: isPriceLoading } = useProducts();
  const { buyNow, isLoading: isCartLoading } = useCart();
  const [showPincodeModal, setShowPincodeModal] = useState(false);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);

  // Get AC-only variants (same filter as products page — excludes Inner Circle)
  const acVariants = useMemo(() => {
    if (!combinedProduct) return [];
    return combinedProduct.allVariants.filter(
      (v) => !v.productTitle.toLowerCase().includes("inner circle"),
    );
  }, [combinedProduct]);

  // Build tabs dynamically from real Shopify variants
  const capacityTabs = useMemo(() => {
    if (acVariants.length > 0) {
      return acVariants.map((v) => ({
        id: v.id,
        label: `Optimist ${v.name} 5 Star Inverter Split AC`,
      }));
    }
    return [];
  }, [acVariants]);

  // Track selected tab by variant ID; default to first variant
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    if (
      capacityTabs.length > 0 &&
      !capacityTabs.find((t) => t.id === activeTab)
    ) {
      setActiveTab(capacityTabs[0].id);
    }
  }, [capacityTabs, activeTab]);

  // Select variant directly by ID — no tonnage string matching
  const activeVariant = useMemo(() => {
    return (
      acVariants.find((v) => v.id === activeTab) ?? acVariants[0] ?? undefined
    );
  }, [acVariants, activeTab]);

  const activePrice = activeVariant?.price ?? 0;
  const activeCompareAtPrice = activeVariant?.compareAtPrice ?? null;

  const discountPercent = useMemo(() => {
    if (activeCompareAtPrice && activeCompareAtPrice > activePrice) {
      return Math.round(
        ((activeCompareAtPrice - activePrice) / activeCompareAtPrice) * 100,
      );
    }
    return 0;
  }, [activePrice, activeCompareAtPrice]);

  const activeProductId = activeVariant?.productId;
  const { rating: judgeRating, count: judgeCount } =
    useJudgeMeRating(activeProductId);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard!", "success");
    } catch {
      showToast("Failed to copy link", "error");
    }
  };

  const handleBuyNow = () => {
    if (!activeVariant || !activeVariant.variantId) {
      showToast("Please select a variant", "error");
      return;
    }
    if (!activeVariant.available) {
      showToast("This variant is out of stock", "error");
      return;
    }
    setShowPincodeModal(true);
  };

  const handleBuyNowConfirmed = async () => {
    if (!activeVariant || !activeVariant.variantId) return;
    setIsBuyNowLoading(true);
    try {
      const checkoutUrl = await buyNow(activeVariant.variantId, 1);
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
  };

  const activeProduct =
    activeTab && VARIANT_COPY[activeTab]
      ? VARIANT_COPY[activeTab]
      : DEFAULT_COPY;

  return (
    <motion.section
      className="bg-white py-8 md:py-12 lg:py-16 overflow-x-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={sectionStagger}
    >
      <div className=" mx-auto px-4 md:px-12 lg:px-16">
        <motion.div
          className="flex items-center justify-center gap-4 md:gap-6 mb-10 md:mb-14"
          variants={blockReveal}
        >
          {/* Left line */}
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-400 md:to-gray-300" />

          {/* Headline */}
          <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 whitespace-nowrap">
            Buy Your Optimist
          </h2>

          {/* Right line */}
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-400 md:to-gray-300" />
        </motion.div>

        <motion.div
          className="bg-[#F8F8FA] rounded-[24px] md:rounded-[32px] overflow-hidden"
          style={{ boxShadow: "0px -4px 4px 0px #00000014 inset" }}
          variants={blockReveal}
        >
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {capacityTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 md:py-5 text-center text-sm md:text-base font-semibold transition-all duration-300 relative ${
                    activeTab === tab.id
                      ? "text-optimist-blue-primary bg-[#3478F612]"
                      : "text-gray-500 hover:text-gray-700 bg-[#F5F5F5]"
                  }`}
                >
                  {tab.label}
                  {/* Active underline */}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-optimist-blue-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Content */}
          <div className="p-4 md:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
              {/* Mobile: Image First */}
              <div className="lg:hidden">
                <div className="relative bg-white rounded-[20px] overflow-hidden shadow-sm">
                  {/* Share Button */}
                  {/* <button
                    onClick={handleShare}
                    className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button> */}

                  {/* AC Image */}
                  <div className="aspect-[4/3] relative flex items-center justify-center p-8">
                    <Image
                      src={ASSETS.optimistImageAsset}
                      alt="Optimist AC Unit"
                      fill
                      className="px-4 object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Left Column - Product Info */}
              <div className="flex flex-col justify-between h-full">
                {/* Top Group: Rating, Headline, Features - 24px spacing */}
                <div className="flex flex-col gap-6">
                  {/* Rating Badge */}
                  {judgeCount > 0 && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-sm w-fit">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const filled = judgeRating >= star;
                          const half = !filled && judgeRating >= star - 0.5;
                          return (
                            <svg
                              key={star}
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              {half && (
                                <defs>
                                  <linearGradient
                                    id={`picker-halfStar-${star}`}
                                  >
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
                                      ? `url(#picker-halfStar-${star})`
                                      : "#D1D5DB"
                                }
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                              />
                            </svg>
                          );
                        })}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {judgeRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({new Intl.NumberFormat("en-IN").format(judgeCount)})
                      </span>
                    </div>
                  )}

                  {/* Headline */}
                  <div>
                    <h3 className="font-display text-[28px] md:text-[36px] lg:text-[42px] leading-[28px] md:leading-[36px] lg:leading-[42px] font-[600] text-gray-900">
                      {activeProduct.headline}
                    </h3>
                    <span
                      className="font-display text-[28px] md:text-[36px] lg:text-[42px] leading-tight font-bold"
                      style={{
                        background:
                          "linear-gradient(151.7deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {activeProduct.tagline}
                    </span>
                  </div>

                  {/* Features Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {activeProduct.features.map((feature, index) => {
                      const FeatureIcon = FEATURE_ICONS[index] ?? ShieldCheck;
                      const { title, subtitle } = getFeatureParts(feature);

                      return (
                        <div
                          key={feature}
                          className="flex items-center gap-2.5 rounded-xl border border-white/70 bg-white/80 px-3 py-2.5 shadow-[0_6px_18px_rgba(15,23,42,0.05)] md:flex-col md:items-start md:gap-2 md:px-3 md:py-3"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-optimist-blue-primary md:h-9 md:w-9">
                            <FeatureIcon className="h-4 w-4 md:h-4.5 md:w-4.5" />
                          </span>
                          <span className="flex min-w-0 flex-col">
                            <span className="text-[12px] font-semibold leading-snug text-gray-900 md:text-[13px] xl:text-sm">
                              {title}
                            </span>
                            {subtitle && (
                              <span className="mt-0.5 text-[11px] leading-snug text-gray-500 md:text-xs">
                                {subtitle}
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom: Price and CTA */}
                <div className="flex flex-row justify-between items-center mt-8 lg:mt-0">
                  <div className="flex flex-col gap-1.5">
                    {isPriceLoading ? (
                      <div className="h-6 w-28 bg-gray-200 animate-pulse rounded" />
                    ) : (
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-lg md:text-[20px] md:leading-[20px] font-semibold text-gray-900">
                          Rs {formatPrice(activePrice)}.00
                        </span>
                        {activeCompareAtPrice &&
                          activeCompareAtPrice > activePrice && (
                            <>
                              <span className="text-sm md:text-base text-gray-400 line-through">
                                Rs {formatPrice(activeCompareAtPrice)}
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#E8F5E9] text-[#2E7D32]">
                                {discountPercent}% off
                              </span>
                            </>
                          )}
                      </div>
                    )}
                    <span className="text-xs md:text-sm text-gray-500">
                      {activeProduct.savings}
                    </span>
                  </div>
                  <button
                    onClick={handleBuyNow}
                    disabled={
                      isCartLoading ||
                      isPriceLoading ||
                      !activeVariant?.variantId ||
                      !activeVariant?.available
                    }
                    className="btn-buy-now min-w-[90px] inline-flex items-center justify-center px-4 md:px-10 py-3 md:py-3.5 rounded-full text-[#FFFCDC] font-semibold text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Right Column - AC Image (Desktop Only) */}
              <div className="hidden lg:block">
                <div className="relative bg-white rounded-[24px] overflow-hidden shadow-sm h-full min-h-[400px]">
                  {/* Share Button */}
                  {/* <button
                    onClick={handleShare}
                    className="absolute top-5 right-5 z-10 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-md text-sm font-medium text-gray-700 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button> */}

                  {/* AC Image — the source file (1200×1200) has whitespace padding,
                      so object-cover crops the edges and the AC fills the card. */}
                  {/* <ACVideo /> */}
                  <Image
                    src={ASSETS.optimistImageAsset}
                    alt="Optimist AC Unit"
                    fill
                    className="object-cover px-4"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

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
    </motion.section>
  );
}
