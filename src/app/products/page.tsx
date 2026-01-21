"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { getProducts, type Product } from "@/lib/shopify";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/Toast";
import { ASSETS } from "@/lib/assets";

// =============================================================================
// Types
// =============================================================================

interface DisplayVariant {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  available: boolean;
}

interface ProductDetail {
  icon: "diamond" | "warranty" | "installation";
  label: string;
}

// =============================================================================
// Constants
// =============================================================================

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
// Comparison Section Data
// =============================================================================

const OPTIMIST_BENEFITS = [
  "Remains efficient during long usage",
  "Cooling stays stable through the day",
  "Designed for extreme Indian heat",
  "Tested for steady performance",
  "Smooth and controlled",
  "More predictable month to month",
  "Sustained, daily usage",
  "Less adjustment needed",
];

const MARKET_DRAWBACKS = [
  "Efficiency drops as load increases",
  "Cooling fluctuates with heat",
  "Struggles during peak temperatures",
  "Often compensates by overworking",
  "Sudden wattage spikes",
  "Varies due to spikes and inefficiency",
  "Short-cycle performance",
  "Frequent mode and temperature changes",
];

// =============================================================================
// Icon Components
// =============================================================================

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#22C55E" />
      <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#EF4444" />
      <path d="M15 9L9 15M9 9L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function DiamondIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 9L12 22L22 9L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 9H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 2L8 9L12 22L16 9L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function WarrantyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 3L4 7V12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12V7L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function InstallationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.7 6.3C14.5 6.1 14.2 6 14 6H10C9.4 6 9 6.4 9 7V11C9 11.6 9.4 12 10 12H14C14.6 12 15 11.6 15 11V7C15 6.8 14.9 6.5 14.7 6.3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 12V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 16H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 16V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 16V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 6V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function DeliveryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// =============================================================================
// Sub-Components
// =============================================================================

interface ImageGalleryProps {
  images: string[];
  selectedIndex: number;
  onSelectImage: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

function ImageGallery({ images, selectedIndex, onSelectImage, onPrev, onNext }: ImageGalleryProps) {
  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
        <Image
          src={images[selectedIndex]}
          alt="Product image"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        
        {/* Navigation Arrows */}
        <button
          onClick={onPrev}
          className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
        </button>
        <button
          onClick={onNext}
          className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
        </button>
      </div>

      {/* Thumbnails - horizontal scroll container */}
      <div className="w-full overflow-hidden">
        <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onSelectImage(index)}
              className={`relative w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedIndex
                  ? "border-blue-500"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface VariantCardProps {
  variant: DisplayVariant;
  isSelected: boolean;
  onSelect: () => void;
}

function VariantCard({ variant, isSelected, onSelect }: VariantCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`relative flex-shrink-0 w-[90px] md:w-[130px] lg:w-[140px] p-2.5 md:p-4 rounded-xl border transition-all text-left ${
        isSelected
          ? "border-blue-500 bg-blue-50/50"
          : "border-gray-200 hover:border-gray-300 bg-white"
      }`}
    >
      {/* Radio Circle */}
      <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center mb-2 ${
        isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
      }`}>
        {isSelected && <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white" />}
      </div>
      
      {/* Variant Info */}
      <p className="font-semibold text-gray-900 text-[11px] md:text-sm lg:text-base">{variant.name}</p>
      <p className="text-[9px] md:text-xs lg:text-sm text-gray-500 mt-0.5">{variant.subtitle}</p>
    </button>
  );
}

interface QuantityDropdownProps {
  quantity: number;
  onQuantityChange: (qty: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

function QuantityDropdown({ quantity, onQuantityChange, isOpen, onToggle }: QuantityDropdownProps) {
  return (
    <div className="relative w-full">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-colors"
      >
        <span className="text-gray-900 font-medium text-sm md:text-base">Quantity: {quantity}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={onToggle} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
            {[1, 2, 3, 4, 5].map((qty) => (
              <button
                key={qty}
                onClick={() => {
                  onQuantityChange(qty);
                  onToggle();
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-sm md:text-base ${
                  quantity === qty ? "bg-blue-50 text-blue-600" : "text-gray-900"
                }`}
              >
                {qty}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface ProductDetailRowProps {
  details: ProductDetail[];
}

function ProductDetailRow({ details }: ProductDetailRowProps) {
  const getIcon = (iconType: ProductDetail["icon"]) => {
    switch (iconType) {
      case "diamond":
        return <DiamondIcon className="w-3.5 h-3.5 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />;
      case "warranty":
        return <WarrantyIcon className="w-3.5 h-3.5 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />;
      case "installation":
        return <InstallationIcon className="w-3.5 h-3.5 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />;
    }
  };

  return (
    <div className="flex items-center justify-between py-2.5 md:py-3 gap-2">
      {details.map((detail, index) => (
        <div key={index} className="flex items-center gap-1 md:gap-2 flex-1 min-w-0">
          {getIcon(detail.icon)}
          <span className="text-[9px] md:text-sm text-gray-600 leading-tight">{detail.label}</span>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// Comparison Section
// =============================================================================

function ComparisonSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Split */}
      <div className="absolute inset-0 flex">
        <div className="w-1/2 bg-[#3478F6]" />
        <div className="w-1/2 bg-[#212121]" />
      </div>

      {/* Top Shadow/Wave Effect - mimics the curved design from Figma */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
        {/* Main curved shadow overlay */}
        <svg 
          className="w-full h-[60px] md:h-[80px] lg:h-[108px]" 
          viewBox="0 0 1440 108" 
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="60%" stopColor="white" stopOpacity="0.6" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="1440" height="108" fill="url(#shadowGradient)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-[1440px] mx-auto">
        <div className="flex">
          {/* Left Side - Optimist AC */}
          <div className="w-1/2 flex flex-col items-end px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16 pt-10 md:pt-[53px] pb-0">
            {/* Title */}
            <h2 className="font-display text-[28px] md:text-[48px] lg:text-[64px] font-bold text-white text-right mb-4 md:mb-6 lg:mb-10 w-full">
              Optimist AC
            </h2>

            {/* Benefits List */}
            <div className="flex flex-col gap-2 sm:gap-3 md:gap-6 items-end w-full">
              {OPTIMIST_BENEFITS.map((benefit, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1.5 sm:gap-2 md:gap-2.5 bg-white/[0.12] rounded-lg md:rounded-xl px-2 sm:px-3 md:px-3 py-1 sm:py-1.5 md:py-2"
                >
                  <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-white font-medium text-right leading-tight whitespace-normal sm:whitespace-nowrap">
                    {benefit}
                  </p>
                  <CheckCircleIcon className="w-4 h-4 md:w-5 lg:w-6 md:h-5 lg:h-6 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Market AC */}
          <div className="w-1/2 flex flex-col items-start px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16 pt-10 md:pt-[53px] pb-0">
            {/* Title */}
            <h2 className="font-display text-[28px] md:text-[48px] lg:text-[64px] font-bold text-white/60 text-left mb-4 md:mb-6 lg:mb-10 w-full">
              Market AC
            </h2>

            {/* Drawbacks List */}
            <div className="flex flex-col gap-2 sm:gap-3 md:gap-6 items-start w-full">
              {MARKET_DRAWBACKS.map((drawback, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1.5 sm:gap-2 md:gap-2.5 bg-white/[0.12] rounded-lg md:rounded-xl px-2 sm:px-3 md:px-3 py-1 sm:py-1.5 md:py-2"
                >
                  <XCircleIcon className="w-4 h-4 md:w-5 lg:w-6 md:h-5 lg:h-6 flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-white font-medium text-left leading-tight whitespace-normal sm:whitespace-nowrap">
                    {drawback}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AC Product Images Container */}
        <div className="relative w-full mt-6 md:mt-10 lg:mt-16">
          {/* Container for proper overlap positioning */}
          <div className="relative w-full h-[130px] sm:h-[160px] md:h-[300px] lg:h-[400px] xl:h-[480px]">
            {/* Left AC Image - Optimist (on blue side) */}
            {/* Mobile: left: calc(30% - 23px), translateX(-50%), width: 50% */}
            {/* Desktop: left: calc(25% + 15px), translateX(-50%), width: 48% max 690px */}
            <div 
              className="absolute shadow-[0px_2px_13px_0px_rgba(0,0,0,0.25)] md:shadow-[0px_4px_24px_0px_rgba(0,0,0,0.25)] z-10 
                         w-[50%] md:w-[48%] lg:max-w-[690px]
                         left-[calc(30%-23px)] md:left-[calc(25%+15px)]
                         -translate-x-1/2 bottom-0"
            >
              <Image
                src={ASSETS.optimistAcCompare}
                alt="Optimist AC"
                width={690}
                height={445}
                className="w-full h-auto object-contain"
                priority
              />
            </div>

            {/* Right AC Image - Market (on dark side) */}
            {/* Mobile: left: calc(40% + 34px), width: 48% */}
            {/* Desktop: left: 50%, width: 45% max 648px */}
            <div 
              className="absolute shadow-[0px_2px_13px_0px_rgba(0,0,0,0.25)] md:shadow-[0px_4px_24px_0px_rgba(0,0,0,0.25)] z-20
                         w-[48%] md:w-[45%] lg:max-w-[648px]
                         left-[calc(40%+34px)] md:left-1/2 bottom-0"
            >
              <Image
                src={ASSETS.marketAcCompare}
                alt="Market AC"
                width={648}
                height={362}
                className="w-full h-auto object-contain"
                priority
              />
              {/* Stand/Base accent - positioned below Market AC on right side */}
              <div 
                className="absolute bg-gradient-to-b from-[#efefef] to-[#e7e7e7] hidden md:block
                           w-[60px] lg:w-[95px] h-[20px] lg:h-[35px]
                           left-[calc(50%+50px)] lg:left-[calc(50%+82px)] -translate-x-1/2
                           -bottom-[10px] lg:-bottom-[15px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export default function ProductsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<DisplayVariant>(MOCK_VARIANTS[1]);
  const [quantity, setQuantity] = useState(1);
  const [isQuantityOpen, setIsQuantityOpen] = useState(false);
  const { addToCart, isLoading: isCartLoading } = useCart();
  const { showToast } = useToast();

  // Fetch first product from Shopify
  useEffect(() => {
    async function fetchProduct() {
      try {
        const products = await getProducts(1);
        if (products.length > 0) {
          setProduct(products[0]);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, []);

  // Animation
  useGSAP(
    () => {
      if (!containerRef.current || isLoading) return;

      const elements = containerRef.current.querySelectorAll(".animate-in");
      gsap.fromTo(
        elements,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" }
      );
    },
    { scope: containerRef, dependencies: [isLoading] }
  );

  // Image navigation
  const images = product?.images.edges.map((e) => e.node.url) || MOCK_IMAGES;
  const displayImages = images.length >= 6 ? images.slice(0, 6) : [...images, ...MOCK_IMAGES].slice(0, 6);

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  // Add to cart
  const handleAddToCart = async () => {
    if (!product) return;
    
    const variant = product.variants.edges[0]?.node;
    if (!variant) return;

    try {
      await addToCart(variant.id, quantity);
      showToast("Added to cart", "success");
    } catch (err) {
      showToast("Failed to add to cart", "error");
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN").format(price);
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

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
              onSelectImage={setSelectedImageIndex}
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
              <div className="w-full overflow-hidden">
                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                  {MOCK_VARIANTS.map((variant) => (
                    <VariantCard
                      key={variant.id}
                      variant={variant}
                      isSelected={selectedVariant.id === variant.id}
                      onSelect={() => setSelectedVariant(variant)}
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
                onQuantityChange={setQuantity}
                isOpen={isQuantityOpen}
                onToggle={() => setIsQuantityOpen(!isQuantityOpen)}
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
                className="flex-1 px-3 md:px-6 py-3 md:py-4 rounded-full text-white font-medium text-xs md:text-base transition-all"
                style={{
                  background: "linear-gradient(151.7deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
                  boxShadow: "0px 2px 12.5px 2px #003FB2 inset",
                }}
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
    </div>
  );
}

// =============================================================================
// Loading Skeleton
// =============================================================================

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white pt-16 md:pt-20 lg:pt-24 pb-8 md:pb-16">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16">
          {/* Left Column */}
          <div className="w-full space-y-4">
            <div className="aspect-square rounded-2xl bg-gray-100 animate-pulse" />
            <div className="flex gap-2 md:gap-3 overflow-hidden">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 flex-shrink-0 rounded-lg bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full space-y-4 md:space-y-6">
            <div className="h-7 w-28 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-8 md:h-10 w-3/4 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-36 bg-gray-100 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-4/5 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="flex gap-2 md:gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-[90px] md:w-[130px] h-20 md:h-24 flex-shrink-0 bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
            <div className="h-8 w-40 bg-gray-100 rounded animate-pulse" />
            <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse" />
            <div className="flex gap-2 md:gap-3">
              <div className="flex-1 h-12 bg-gray-100 rounded-full animate-pulse" />
              <div className="flex-1 h-12 bg-gray-100 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
