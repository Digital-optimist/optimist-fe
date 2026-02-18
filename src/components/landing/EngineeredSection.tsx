"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ArrowUpRight } from "lucide-react";
import { ASSETS } from "@/lib/assets";

/**
 * Feature data for the accordion items
 * Each feature has a title, description, and image that reveals on expansion
 * Similar to Apple iPhone 17 Pro "Take a closer look" section
 *
 * Animation behavior:
 * - When an item is clicked, the right-side image slides out to the left
 * - A new image slides in from the right
 * - The image scales up slightly when expanded
 * - Currently using the same image for all (ready for unique images later)
 */
const features = [
  {
    id: 1,
    title: "Micro-channel heat exchanger",
    description: "4X faster heat transfer than any other AC",
    image: ASSETS.e1,
    mobileImage: ASSETS.e1,
  },
  {
    id: 2,
    title: "Advanced aluminium alloy",
    description: "1,180 flow paths for ultra-efficient cooling",
    image: ASSETS.e2,
    mobileImage: ASSETS.e2,
  },
  {
    id: 3,
    title: "1000-hour corrosion tested",
    description: "15× more testing than typical market standards",
    image: ASSETS.e3,
    mobileImage: ASSETS.e3,
  },
  {
    id: 4,
    title: "Automotive-derived design",
    description: "High-performance thermal engineering.",
    image: ASSETS.e4,
    mobileImage: ASSETS.e4,
  },
];

/**
 * AccordionItem Component
 * Renders an individual expandable item with original design + Apple-style animation
 * - Zap icon with blue background when active
 * - Smooth height animation using GSAP for description
 * - Rounded rectangle container (original design)
 */
interface AccordionItemProps {
  feature: (typeof features)[0];
  isActive: boolean;
  onClick: () => void;
  index: number;
}

function AccordionItem({
  feature,
  isActive,
  onClick,
  index,
}: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  // Animate the description height when active state changes
  useEffect(() => {
    if (!contentRef.current || !descriptionRef.current) return;

    if (isActive) {
      // Expand animation
      const height = descriptionRef.current.scrollHeight;
      gsap.to(contentRef.current, {
        height: height,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      // Collapse animation
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  }, [isActive]);

  return (
    <div className="relative flex items-center">
      <button
        key={feature.id}
        onClick={onClick}
        className={`feature-card w-full text-left p-6 rounded-[20px] flex flex-col transition-all duration-300 ${
          isActive
            ? "bg-white/80"
            : "bg-[#F3F4F6]/50 border-transparent hover:bg-white/40"
        }`}
        style={{
          animationDelay: `${index * 0.1}s`,
          boxShadow: isActive
            ? "0px 3px 20px 0px #0000001A, 0px -3px 5px 0px #00000033 inset"
            : "0px 3px 20px 0px #0000001A",
        }}
        aria-expanded={isActive}
      >
        {/* Header row with icon and title */}
        <div className="flex items-center gap-4">
          {/* Icon */}

          <div className="w-10 h-10 flex-shrink-0 relative">
            <Image
              src={isActive ? ASSETS.lightningBlue : ASSETS.lightningWhite}
              alt="Lightning icon"
              fill
              className="object-contain"
            />
          </div>

          {/* Title */}
          <div className="flex-1">
            <h3
              className={`text-lg font-semibold transition-colors duration-300 ${
                isActive ? "text-[#000000]" : "text-[#000000]"
              }`}
            >
              {feature.title}
            </h3>
          </div>
        </div>

        {/* Expandable description area with GSAP animation */}
        <div
          ref={contentRef}
          className="overflow-hidden"
          style={{ height: 0, opacity: 0 }}
        >
          <p
            ref={descriptionRef}
            className="text-base text-[#6B7280] mt-1 pb-1 mb-4 ml-14 font-medium"
          >
            {feature.description}
          </p>
        </div>
      </button>

      {/* Connecting Line - Only visible on desktop when active */}
      {isActive && (
        <div className="hidden lg:block absolute -right-24 w-24 h-[1px] bg-[#D1D5DB]" />
      )}
    </div>
  );
}

/**
 * AnimatedImage Component
 * Handles the Apple-style slide transition and scale animation for images
 * - Slides out to the left when changing
 * - New image slides in from the right
 * - Scales up slightly when active
 */
interface AnimatedImageProps {
  activeFeatureId: number | null;
  isMobile?: boolean;
}

function AnimatedImage({
  activeFeatureId,
  isMobile = false,
}: AnimatedImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentImageRef = useRef<HTMLDivElement>(null);
  const nextImageRef = useRef<HTMLDivElement>(null);
  const prevFeatureIdRef = useRef<number | null>(activeFeatureId);
  const isAnimatingRef = useRef(false);

  // Get current feature data
  const currentFeature =
    features.find((f) => f.id === activeFeatureId) || features[0];
  const imageSrc = isMobile ? currentFeature.mobileImage : currentFeature.image;

  // Desktop only: slide animation effect
  useEffect(() => {
    // Skip animation on mobile - just show single image
    if (isMobile) {
      prevFeatureIdRef.current = activeFeatureId;
      return;
    }

    // Skip if same feature or already animating
    if (
      prevFeatureIdRef.current === activeFeatureId ||
      isAnimatingRef.current
    ) {
      return;
    }

    // Skip animation on first render
    if (prevFeatureIdRef.current === null && activeFeatureId !== null) {
      prevFeatureIdRef.current = activeFeatureId;
      return;
    }

    const currentImg = currentImageRef.current;
    const nextImg = nextImageRef.current;

    if (!currentImg || !nextImg) return;

    isAnimatingRef.current = true;

    // Create GSAP timeline for coordinated animation
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
        prevFeatureIdRef.current = activeFeatureId;
        // Reset positions after animation
        gsap.set(currentImg, { x: 0, opacity: 1, scale: 1 });
        gsap.set(nextImg, { x: "100%", opacity: 0, scale: 0.95 });
      },
    });

    // Slide current image out to left + scale down
    tl.to(
      currentImg,
      {
        x: "-100%",
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        ease: "power2.inOut",
      },
      0,
    );

    // Slide new image in from right + scale up
    tl.fromTo(
      nextImg,
      { x: "100%", opacity: 0, scale: 0.95 },
      {
        x: 0,
        opacity: 1,
        scale: 1.05, // Scale up when active
        duration: 0.5,
        ease: "power2.out",
      },
      0.15, // Slight delay for staggered effect
    );

    // Settle scale back to normal after expansion
    tl.to(
      nextImg,
      {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      },
      0.65,
    );

    return () => {
      tl.kill();
    };
  }, [activeFeatureId, isMobile]);

  // Mobile: Simple single image with fade transition
  if (isMobile) {
    return (
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] rounded-[32px] border-[12px] border-black/5 shadow-2xl overflow-hidden"
      >
        <Image
          src={imageSrc}
          alt="Optimist AC with intelligent engineering"
          fill
          className="object-cover rounded-[24px] transition-opacity duration-300"
          sizes="100vw"
          priority
        />
      </div>
    );
  }

  // Desktop: Slide animation with two image layers
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[500px] rounded-[48px] border-[12px] border-black/5 shadow-2xl overflow-hidden"
    >
      {/* Current Image (will slide out) */}
      <div
        ref={currentImageRef}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src={imageSrc}
          alt="Optimist AC with intelligent engineering"
          fill
          className="object-cover rounded-[24px]"
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
        />
      </div>

      {/* Next Image (will slide in) */}
      <div
        ref={nextImageRef}
        className="absolute inset-0 will-change-transform"
        style={{ transform: "translateX(100%)", opacity: 0 }}
      >
        <Image
          src={imageSrc}
          alt="Optimist AC with intelligent engineering"
          fill
          className="object-cover rounded-[24px]"
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
      </div>
    </div>
  );
}

export function EngineeredSection() {
  const [activeFeature, setActiveFeature] = useState<number | null>(1);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Toggle accordion - click same item to close, click different to switch
  const handleFeatureClick = useCallback((id: number) => {
    setActiveFeature((prev) => (prev === id ? null : id));
  }, []);

  // Mobile: Auto-select card on scroll using Intersection Observer
  useEffect(() => {
    const carousel = mobileCarouselRef.current;
    if (!carousel) return;

    // Only run on mobile (lg breakpoint is 1024px)
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    if (!mediaQuery.matches) return;

    const observerOptions = {
      root: carousel,
      rootMargin: "0px -50% 0px 0px", // Detect when card enters left half of viewport
      threshold: 0.6,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cardId = parseInt(
            entry.target.getAttribute("data-feature-id") || "1",
          );
          setActiveFeature(cardId);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    // Observe all card elements
    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    // Handle scroll end detection for the last card
    // When scrolled to the end, the last card can't move into the left half,
    // so we need to detect this case and select it manually
    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const scrollWidth = carousel.scrollWidth;
      const clientWidth = carousel.clientWidth;

      // Check if scrolled to the end (with a small threshold for tolerance)
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;

      if (isAtEnd) {
        // Select the last feature
        const lastFeatureId = features[features.length - 1].id;
        setActiveFeature(lastFeatureId);
      }
    };

    carousel.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      carousel.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Set initial states immediately to prevent flash/lag on first scroll
  useLayoutEffect(() => {
    if (headerRef.current) {
      gsap.set(headerRef.current, { opacity: 0, y: 50 });
    }
    const featureCards = featuresRef.current?.querySelectorAll(".feature-card");
    if (featureCards) {
      gsap.set(featureCards, { opacity: 0, x: -40, scale: 0.95 });
    }
    if (imageContainerRef.current) {
      gsap.set(imageContainerRef.current, { opacity: 0, scale: 0.92, y: 30 });
    }
  }, []);

  useGSAP(
    () => {
      // Batch all animations into a single timeline with one ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 25%",
          toggleActions: "play none none none",
          once: true, // Only animate once for better performance
        },
      });

      // Header animation - use 'to' since initial state is already set
      tl.to(
        headerRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          force3D: true,
        },
        0,
      );

      // Features stagger animation - Apple-style sequential reveal
      const featureCards =
        featuresRef.current?.querySelectorAll(".feature-card");
      if (featureCards) {
        tl.to(
          featureCards,
          {
            opacity: 1,
            x: 0,
            scale: 1,
            stagger: 0.12,
            duration: 0.7,
            ease: "power3.out",
            force3D: true,
          },
          0.2, // Start slightly after header
        );
      }

      // Image container animation with subtle scale
      tl.to(
        imageContainerRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          force3D: true,
        },
        0.3, // Start slightly after features
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="why-optimist"
      className=" my-6 bg-white md:my-8 lg:my-12"
    >
      <div
        className="py-4 md:py-6 lg:py-8 overflow-x-hidden mx-auto px-4 md:px-6 lg:px-8"
        style={{
          background: "#F8F8F8",
        }}
      >
        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col lg:flex-row items-start justify-between mb-2 lg:mb-4 gap-8 will-change-[transform,opacity]"
        >
          <h2 className="font-display text-[32px] md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1]">
            <span
              className="font-[600]"
              style={{
                background:
                  "linear-gradient(151.7deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Engineered for Extremes.
            </span>
            <br />
            <span className="font-[600] text-[#1A1A1A]">
              The performance you will feel.
            </span>
          </h2>

          {/* <Link
            href="#"
            className="hidden lg:flex items-center gap-2 px-6 py-3 border border-[#00000033] rounded-full text-[#1A1A1A] font-semibold text-sm hover:bg-white transition-all shadow-sm hover:shadow-md whitespace-nowrap lg:mt-2"
          >
            Learn how our core works
            <ArrowUpRight className="w-4 h-4" />
          </Link> */}
        </div>

        {/* Desktop Layout - 2 columns with Apple-style accordion */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24 items-center">
          {/* Left - Accordion Features with original design */}
          <div ref={featuresRef} className="flex flex-col space-y-4">
            {features.map((feature, index) => (
              <AccordionItem
                key={feature.id}
                feature={feature}
                isActive={activeFeature === feature.id}
                onClick={() => handleFeatureClick(feature.id)}
                index={index}
              />
            ))}
          </div>

          {/* Right - AC Image with slide animation */}
          <div ref={imageContainerRef} className="relative h-full py-8">
            <AnimatedImage activeFeatureId={activeFeature} isMobile={false} />
          </div>
        </div>

        {/* Mobile Layout - Stacked with horizontal carousel */}
        <div className="lg:hidden">
          {/* AC Image with slide animation */}
          <div className="relative mb-10 transition-all duration-500 ease-out">
            <AnimatedImage activeFeatureId={activeFeature} isMobile={true} />
          </div>

          {/* Features Carousel */}
          <div
            ref={mobileCarouselRef}
            className="flex gap-3 overflow-x-auto pb-8 scrollbar-hide scroll-smooth"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {features.map((feature, index) => (
              <div
                key={feature.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                data-feature-id={feature.id}
                onClick={() => handleFeatureClick(feature.id)}
                className={`feature-card flex-shrink-0 w-[280px] rounded-[20px] p-4 cursor-pointer transition-all duration-500 ease-out ${
                  activeFeature === feature.id
                    ? "bg-white/80 scale-[1.02]"
                    : "bg-[#F3F4F6]/50 scale-100 opacity-70"
                }`}
                style={{
                  scrollSnapAlign: "start",
                  boxShadow:
                    activeFeature === feature.id
                      ? "0px 3px 20px 0px #0000001A, 0px -3px 5px 0px #00000033 inset"
                      : "0px 3px 20px 0px #0000001A",
                }}
              >
                {/* Horizontal layout: Icon + Text */}
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 flex-shrink-0 relative transition-transform duration-500 ${
                      activeFeature === feature.id ? "scale-110" : "scale-100"
                    }`}
                  >
                    <Image
                      src={
                        activeFeature === feature.id
                          ? ASSETS.lightningBlue
                          : ASSETS.lightningWhite
                      }
                      alt="Lightning icon"
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Text - Title and Description stacked */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-base font-semibold leading-tight transition-colors duration-500 ${
                        activeFeature === feature.id
                          ? "text-[#1A1A1A]"
                          : "text-[#6B7280]"
                      }`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={`text-sm mt-1 font-medium leading-snug transition-all duration-500 ${
                        activeFeature === feature.id
                          ? "text-[#6B7280] opacity-100"
                          : "text-[#9CA3AF] opacity-80"
                      }`}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
