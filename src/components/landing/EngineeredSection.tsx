"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ArrowUpRight } from "lucide-react";

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
    description: "Faster heat transfer. Lower energy use.",
    image: "/e1.png",
    mobileImage: "/e1.png",
  },
  {
    id: 2,
    title: "Advanced aluminium alloy",
    description: "Designed to last.",
    image: "/e2.png",
    mobileImage: "/e2.png",
  },
  {
    id: 3,
    title: "1000-hour corrosion tested",
    description: "Built to withstand extreme conditions.",
    image: "/e3.png",
    mobileImage: "/e3.png",
  },
  {
    id: 4,
    title: "Automotive-derived design",
    description: "High-performance thermal engineering.",
    image: "/e4.png",
    mobileImage: "/e4.png",
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
        className={`feature-card w-full text-left p-6 rounded-[20px] flex flex-col transition-all duration-300 border ${
          isActive
            ? "bg-white/80 border-white shadow-lg shadow-black/5"
            : "bg-[#F3F4F6]/50 border-transparent hover:bg-white/40"
        }`}
        style={{ animationDelay: `${index * 0.1}s` }}
        aria-expanded={isActive}
      >
        {/* Header row with icon and title */}
        <div className="flex items-center gap-4">
          {/* Icon */}
        
            <div className="w-10 h-10 flex-shrink-0 relative">
              <Image
                src={isActive ? "/LightningBlue.png" : "/LightningWhite.png"}
                alt="Lightning icon"
                fill
                className="object-contain"
              />
            </div>
       

          {/* Title */}
          <div className="flex-1">
            <h3
              className={`text-lg font-semibold transition-colors duration-300 ${
                isActive ? "text-[#1A1A1A]" : "text-[#4B5563]"
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

  useEffect(() => {
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
      0
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
      0.15 // Slight delay for staggered effect
    );

    // Settle scale back to normal after expansion
    tl.to(
      nextImg,
      {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      },
      0.65
    );

    return () => {
      tl.kill();
    };
  }, [activeFeatureId]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full border-[12px] border-black/5 shadow-2xl ${
        isMobile
          ? "aspect-[4/3] rounded-[32px]"
          : "h-full min-h-[500px] rounded-[48px]"
      } overflow-hidden`}
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
          sizes={isMobile ? "100vw" : "(max-width: 1024px) 100vw, 60vw"}
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
          sizes={isMobile ? "100vw" : "(max-width: 1024px) 100vw, 60vw"}
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

  // Toggle accordion - click same item to close, click different to switch
  const handleFeatureClick = useCallback((id: number) => {
    setActiveFeature((prev) => (prev === id ? null : id));
  }, []);

  useGSAP(
    () => {
      // Batch all animations into a single timeline with one ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 25%",
          toggleActions: "play none none none",
          once: true, // Only animate once for better performance
        },
      });

      // Header animation - fade in from bottom
      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        },
        0
      );

      // Features stagger animation - Apple-style sequential reveal
      const featureCards =
        featuresRef.current?.querySelectorAll(".feature-card");
      if (featureCards) {
        tl.fromTo(
          featureCards,
          { opacity: 0, x: -40, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            stagger: 0.12,
            duration: 0.7,
            ease: "power3.out",
          },
          0.2 // Start slightly after header
        );
      }

      // Image container animation with subtle scale
      tl.fromTo(
        imageContainerRef.current,
        { opacity: 0, scale: 0.92, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        },
        0.3 // Start slightly after features
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="why-optimist"
      className="py-12 md:py-16 lg:py-24 overflow-x-hidden"
      style={{
        background:
          "linear-gradient(89.33deg, #CAC9C9 1.16%, #EEEAEA 49.5%, #F3F1F1 60.8%, #CAC9C9 115.48%)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col lg:flex-row items-start justify-between mb-12 lg:mb-20 gap-8"
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tight">
            <span className="font-bold text-[#074FD5]">
              The intelligence you don&apos;t see.
            </span>
            <br />
            <span className="font-bold text-[#1A1A1A]">
              The performance you will.
            </span>
          </h2>

          <Link
            href="#"
            className="flex items-center gap-2 px-6 py-3 border border-[#00000033] rounded-full text-[#1A1A1A] font-semibold text-sm hover:bg-white transition-all shadow-sm hover:shadow-md whitespace-nowrap lg:mt-2"
          >
            Learn how our core works
            <ArrowUpRight className="w-4 h-4" />
          </Link>
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
          <div className="relative mb-10">
            <AnimatedImage activeFeatureId={activeFeature} isMobile={true} />
          </div>

          {/* Features Carousel (Original Design) */}
          <div
            ref={featuresRef}
            className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {features.map((feature) => (
              <div
                key={feature.id}
                onClick={() => handleFeatureClick(feature.id)}
                className={`flex-shrink-0 w-[300px] rounded-[24px] p-6 border transition-all duration-300 cursor-pointer ${
                  activeFeature === feature.id
                    ? "bg-white border-white shadow-xl shadow-black/5"
                    : "bg-[#F3F4F6]/50 border-transparent"
                }`}
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="flex flex-col gap-4">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center ${
                      activeFeature === feature.id
                        ? "bg-gradient-to-br from-[#074FD5] to-[#04348C]"
                        : "bg-white/70"
                    }`}
                  >
                    <div className="w-5 h-5 relative">
                      <Image
                        src={
                          activeFeature === feature.id
                            ? "/LightningBlue.png"
                            : "/LightningWhite.png"
                        }
                        alt="Lightning icon"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Text */}
                  <div>
                    <h3
                      className={`text-lg font-semibold ${
                        activeFeature === feature.id
                          ? "text-[#1A1A1A]"
                          : "text-[#4B5563]"
                      }`}
                    >
                      {feature.title}
                    </h3>
                    {activeFeature === feature.id && (
                      <p className="text-base text-[#6B7280] mt-2 font-medium">
                        {feature.description}
                      </p>
                    )}
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
