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
    image: "/AcEngineeringDesktop.png",
    mobileImage: "/AcEngineeringMobile.png",
  },
  {
    id: 2,
    title: "Advanced aluminium alloy",
    description: "Lightweight yet incredibly durable.",
    image: "/AcEngineeringDesktop.png",
    mobileImage: "/AcEngineeringMobile.png",
  },
  {
    id: 3,
    title: "1000-hour corrosion tested",
    description: "Built to withstand extreme conditions.",
    image: "/AcEngineeringDesktop.png",
    mobileImage: "/AcEngineeringMobile.png",
  },
  {
    id: 4,
    title: "Automotive-derived design",
    description: "Inspired by precision automotive engineering.",
    image: "/AcEngineeringDesktop.png",
    mobileImage: "/AcEngineeringMobile.png",
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
    <button
      key={feature.id}
      onClick={onClick}
      className={`feature-card w-full text-left p-4 rounded-[16px] flex flex-col transition-all duration-300 ${
        isActive ? "bg-white shadow-sm" : "bg-transparent hover:bg-white/50"
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
          <h3 className="text-base font-semibold text-[#1A1A1A]">
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
        <p ref={descriptionRef} className="text-sm text-[#6B7280] mt-2 pl-14">
          {feature.description}
        </p>
      </div>
    </button>
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
      className={`relative w-full ${
        isMobile
          ? "aspect-[4/3] rounded-[20px]"
          : "h-full min-h-[500px] rounded-[24px]"
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
          className="object-cover"
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
          className="object-cover"
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
      className="py-12 md:py-16 lg:py-20 overflow-hidden"
      style={{
        background:
          "linear-gradient(89.33deg, #CAC9C9 1.16%, #EEEAEA 49.5%, #F3F1F1 60.8%, #CAC9C9 115.48%)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Desktop Header */}
        <div
          ref={headerRef}
          className="hidden lg:flex items-start justify-between mb-10"
        >
          <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl leading-tight">
            <span className="font-bold text-[#1A1A1A]">
              The intelligence you don&apos;t see.
            </span>
            <br />
            <span className="font-bold text-[#1A1A1A]">
              The performance you will.
            </span>
          </h2>

          <Link
            href="#"
            className="flex items-center gap-2 px-5 py-3 border border-[#D1D5DB] rounded-full text-[#1A1A1A] font-medium text-sm hover:bg-white/50 transition-colors whitespace-nowrap"
          >
            Learn how our core works
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden mb-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
            <span className="text-optimist-blue-primary">
              Engineered differently
            </span>
            <br />
            <span className="text-gray-900">from the inside out</span>
          </h2>
        </div>

        {/* Desktop Layout - 2 columns with Apple-style accordion */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12 items-stretch">
          {/* Left - Accordion Features with original design */}
          <div
            ref={featuresRef}
            className="flex flex-col justify-between space-y-3"
          >
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
          <div ref={imageContainerRef} className="relative h-full">
            <AnimatedImage activeFeatureId={activeFeature} isMobile={false} />
          </div>
        </div>

        {/* Mobile Layout - Stacked with horizontal carousel */}
        <div className="lg:hidden">
          {/* AC Image with slide animation */}
          <div className="relative mb-6">
            <AnimatedImage activeFeatureId={activeFeature} isMobile={true} />
          </div>

          {/* Features Carousel (Original Design) */}
          <div
            ref={featuresRef}
            className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {features.map((feature) => (
              <div
                key={feature.id}
                onClick={() => handleFeatureClick(feature.id)}
                className={`feature-card flex-shrink-0 w-[280px] rounded-[16px] p-4 shadow-sm cursor-pointer transition-all duration-300 ${
                  activeFeature === feature.id ? "bg-white" : "bg-white/80"
                }`}
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="w-10 h-10 flex-shrink-0 relative">
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

                  {/* Text */}
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[#1A1A1A]">
                      {feature.title}
                    </h3>
                    {activeFeature === feature.id && feature.description && (
                      <p className="text-xs text-[#6B7280] mt-1 italic">
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
