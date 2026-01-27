"use client";

import { memo, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ASSETS } from "@/lib/assets";

// =============================================================================
// Types
// =============================================================================

interface RecognitionFeature {
  id: string;
  iconSrc: string;
  iconAlt: string;
  title: string;
  description: string;
}

// =============================================================================
// Constants
// =============================================================================

const RECOGNITION_FEATURES: RecognitionFeature[] = [
  {
    id: "energy-efficient",
    iconSrc: ASSETS.shieldSlash,
    iconAlt: "Energy efficiency icon",
    title: "Energy-saving design",
    description: "Highest efficiency. Independently certified.",
  },
  {
    id: "stable-cooling",
    iconSrc: ASSETS.leafIcon,
    iconAlt: "Leaf icon",
    title: "Stable cooling performance",
    description: "50°C capable. Externally verified.",
  },
  {
    id: "long-term-value",
    iconSrc: ASSETS.hourglass,
    iconAlt: "Hourglass icon",
    title: "Focus on long-term value",
    description: "Built to endure. Covered suitably.",
  },
];

// =============================================================================
// Vertical Divider Component
// =============================================================================

const VerticalDivider = memo(function VerticalDivider() {
  return (
    <div className="hidden md:flex items-center justify-center h-20">
      <div className="w-px h-full bg-white/30" />
    </div>
  );
});

// =============================================================================
// Horizontal Divider Component (for mobile)
// =============================================================================

const HorizontalDivider = memo(function HorizontalDivider() {
  return (
    <div className="flex md:hidden items-center justify-center w-20">
      <div className="h-px w-full bg-white/30" />
    </div>
  );
});

// =============================================================================
// Feature Card Component
// =============================================================================

const FeatureCard = memo(function FeatureCard({
  feature,
}: {
  feature: RecognitionFeature;
}) {
  return (
    <div className="flex flex-col items-center gap-4 w-full md:w-[205px]">
      <div className="flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={feature.iconSrc}
          alt={feature.iconAlt}
          className="w-8 h-8 md:w-10 md:h-10"
        />
      </div>
      <div className="flex flex-col gap-2 items-center text-center">
        <p className="font-display font-bold text-base md:text-xl text-white">
          {feature.title}
        </p>
        <p className="text-sm md:text-base text-white/60 max-w-[159px]">
          {feature.description}
        </p>
      </div>
    </div>
  );
});

// =============================================================================
// Background Component - Uses image backgrounds
// =============================================================================

const GradientBackground = memo(function GradientBackground() {
  return (
    <>
      {/* Desktop Background Image */}
      <Image
        src={ASSETS.recognitionBgDesktop}
        alt=""
        fill
        className="hidden md:block object-cover rounded-[44px]"
        priority
      />

      {/* Mobile Background Image */}
      <Image
        src={ASSETS.recognitionBgMobile}
        alt=""
        fill
        className="block md:hidden object-cover rounded-[24px]"
        priority
      />
    </>
  );
});

// =============================================================================
// Main Component
// =============================================================================

export const RecognitionSection = memo(function RecognitionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  // Set initial states to prevent flash
  useLayoutEffect(() => {
    if (cardRef.current) {
      gsap.set(cardRef.current, { opacity: 0, scale: 0.95 });
    }
    if (headerRef.current) {
      gsap.set(headerRef.current, { opacity: 0, y: 40 });
    }
    if (featuresRef.current) {
      gsap.set(featuresRef.current, { opacity: 0, y: 30 });
    }
    if (mobileRef.current) {
      gsap.set(mobileRef.current, { opacity: 0, y: 30 });
    }
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 25%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // Card scale animation
      tl.to(
        cardRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          force3D: true,
        },
        0,
      );

      // Header animation
      tl.to(
        headerRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          force3D: true,
        },
        0.2,
      );

      // Features animation
      tl.to(
        [featuresRef.current, mobileRef.current],
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          force3D: true,
        },
        0.4,
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white"
      aria-labelledby="recognition-heading"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10">
        {/* Card Container */}
        <div
          ref={cardRef}
          className="relative w-full min-h-[500px] md:min-h-[669px] overflow-hidden rounded-[24px] md:rounded-[44px] will-change-[transform,opacity]"
        >
          {/* Background */}
          <GradientBackground />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-10 md:gap-[60px] py-16 md:py-24 lg:py-32 px-4 md:px-8">
            {/* Header Section */}
            <div
              ref={headerRef}
              className="flex flex-col items-center gap-1 will-change-[transform,opacity]"
            >
              {/* Title with Laurel Icons */}
              <div className="flex items-center gap-2 md:gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ASSETS.laurelLeft}
                  alt=""
                  className="w-5 h-9 md:w-[41px] md:h-[74px] shrink-0"
                />
                <h2
                  id="recognition-heading"
                  className="font-display font-semibold text-xl md:text-4xl lg:text-5xl text-white text-center leading-tight"
                >
                  Recognition based on performance, not promises.
                </h2>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ASSETS.laurelRight}
                  alt=""
                  className="w-5 h-9 md:w-[41px] md:h-[74px] shrink-0"
                  style={{ transform: "scaleX(-1)" }}
                />
              </div>

              {/* Subtitle */}
              <p className="text-xs md:text-xl text-white/60 text-center"></p>
            </div>

            {/* Features Section - Desktop: horizontal with dividers, Mobile: vertical */}
            {/* Desktop Layout */}
            <div
              ref={featuresRef}
              className="hidden md:flex items-center justify-center gap-[84px] w-full will-change-[transform,opacity]"
            >
              <FeatureCard feature={RECOGNITION_FEATURES[0]} />
              <VerticalDivider />
              <FeatureCard feature={RECOGNITION_FEATURES[1]} />
              <VerticalDivider />
              <FeatureCard feature={RECOGNITION_FEATURES[2]} />
            </div>

            {/* Mobile Layout */}
            <div
              ref={mobileRef}
              className="flex md:hidden flex-col items-center gap-7 w-full will-change-[transform,opacity]"
            >
              <FeatureCard feature={RECOGNITION_FEATURES[0]} />
              <HorizontalDivider />
              <FeatureCard feature={RECOGNITION_FEATURES[1]} />
              <HorizontalDivider />
              <FeatureCard feature={RECOGNITION_FEATURES[2]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
