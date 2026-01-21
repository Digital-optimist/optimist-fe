"use client";

import { memo } from "react";
import Image from "next/image";
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
    title: "Energy-efficient design",
    description: "Lorem ipsum text is a dummy text",
  },
  {
    id: "stable-cooling",
    iconSrc: ASSETS.leafIcon,
    iconAlt: "Leaf icon",
    title: "Stable cooling performance",
    description: "Lorem ipsum text is a dummy text",
  },
  {
    id: "long-term-value",
    iconSrc: ASSETS.hourglass,
    iconAlt: "Hourglass icon",
    title: "Focus on long-term value",
    description: "Lorem ipsum text is a dummy text",
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

const FeatureCard = memo(function FeatureCard({ feature }: { feature: RecognitionFeature }) {
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
// Background Component - Matches Figma structure exactly
// =============================================================================

const GradientBackground = memo(function GradientBackground() {
  return (
    <>
      {/* Layer 1: Base gradient - Figma exact gradient */}
      <div 
        className="absolute inset-0 rounded-[24px] md:rounded-[44px]"
        style={{
          background: "linear-gradient(165.16deg, rgba(18, 101, 255, 1) 25.27%, rgba(105, 205, 235, 1) 87.59%, rgba(70, 245, 160, 1) 120.92%)",
        }}
      />
      
      {/* Layer 2: Overlay container with mix-blend-multiply - at bottom portion */}
      <div className="absolute bottom-0 left-0 right-0 h-[70%] md:h-[473px] rounded-b-[24px] md:rounded-b-[44px] overflow-hidden mix-blend-multiply">
        {/* Dark ellipse - large radial gradient positioned to create dark area at top of card */}
        <div 
          className="absolute w-[200%] h-[200%] left-1/2 -translate-x-1/2 -top-[100%]"
          style={{
            background: "radial-gradient(ellipse at center bottom, transparent 30%, rgba(0, 0, 0, 0.95) 70%)",
          }}
        />
        
        {/* Stripes rectangle - creates vertical light beams from blue to white */}
        <div className="absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ASSETS.recognitionStripes}
            alt=""
            className="absolute w-full bottom-0 left-0"
            style={{ height: "200%", objectFit: "cover", objectPosition: "bottom" }}
          />
        </div>
        
        {/* 11 Vertical stripe divs with backdrop-blur and mix-blend-overlay */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-full min-h-px min-w-px backdrop-blur-[85px] mix-blend-overlay"
              style={{
                backgroundImage: "linear-gradient(-90deg, rgba(255, 255, 255, 0.01) 0%, rgba(0, 0, 0, 0.2) 76.04%, rgba(255, 255, 255, 0.01) 100%)",
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Layer 3: Dark overlay at top of card to create the dark header area */}
      <div 
        className="absolute inset-0 rounded-[24px] md:rounded-[44px] pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.6) 25%, rgba(0, 0, 0, 0.3) 40%, transparent 55%)",
        }}
      />
    </>
  );
});

// =============================================================================
// Main Component
// =============================================================================

export const RecognitionSection = memo(function RecognitionSection() {
  return (
    <section 
      className="w-full py-8 md:py-12 lg:py-16 bg-white" 
      aria-labelledby="recognition-heading"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10">
        {/* Card Container */}
        <div className="relative w-full min-h-[500px] md:min-h-[669px] overflow-hidden rounded-[24px] md:rounded-[44px]">
          {/* Background */}
          <GradientBackground />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-10 md:gap-[60px] py-16 md:py-24 lg:py-32 px-4 md:px-8">
            {/* Header Section */}
            <div className="flex flex-col items-center gap-1">
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
                  Recognized for performance &amp; efficiency
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
              <p className="text-xs md:text-xl text-white/60 text-center">
                External validation that reflects real-world use.
              </p>
            </div>

            {/* Features Section - Desktop: horizontal with dividers, Mobile: vertical */}
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-center gap-[84px] w-full">
              <FeatureCard feature={RECOGNITION_FEATURES[0]} />
              <VerticalDivider />
              <FeatureCard feature={RECOGNITION_FEATURES[1]} />
              <VerticalDivider />
              <FeatureCard feature={RECOGNITION_FEATURES[2]} />
            </div>
            
            {/* Mobile Layout */}
            <div className="flex md:hidden flex-col items-center gap-7 w-full">
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
