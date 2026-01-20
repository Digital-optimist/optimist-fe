"use client";

import { useRef, useState, useCallback, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

// ============================================
// FEATURE CARD DATA
// ============================================
type FeatureId = 
  | "energy-meter"
  | "bills"
  | "filter"
  | "gas-level"
  | "service"
  | "scheduling"
  | null;

interface FeatureCardData {
  id: FeatureId;
  title: string;
  description: string;
  icon: string;
  handImage: string;
  // Desktop positions (from Figma)
  desktopLeft?: number;
  desktopTop: number;
}

const FEATURES: FeatureCardData[] = [
  {
    id: "energy-meter",
    title: "Live Energy Meter",
    description: "Track. Predict. Save.",
    icon: "/icons/thermometer.svg",
    handImage: "/hands/Live Energy Meter.png",
    desktopLeft: 80,
    desktopTop: 180,
  },
  {
    id: "bills",
    title: "Projected Monthly Bills",
    description: "No surprises. Just real numbers.",
    icon: "/icons/scroll.svg",
    handImage: "/hands/Projected Monthly Bills.png",
    desktopLeft: 30,
    desktopTop: 380,
  },
  {
    id: "filter",
    title: "Filter Health",
    description: "Clean when needed. No more guessing.",
    icon: "/icons/filter.svg",
    handImage: "/hands/Filter tracking.png",
    desktopLeft: 120,
    desktopTop: 580,
  },
  {
    id: "gas-level",
    title: "Gas Level Indicator",
    description: "Know before it's an issue.",
    icon: "/icons/gastank.svg",
    handImage: "/hands/Gas level indicator.png",
    desktopLeft: 966,
    desktopTop: 160,
  },
  {
    id: "service",
    title: "Intelligence Service Assistance",
    description: "Diagnose remotely. Service seamlessly",
    icon: "/icons/headset.svg",
    handImage: "/hands/Service assistance.png",
    desktopLeft: 1016,
    desktopTop: 360,
  },
  {
    id: "scheduling",
    title: "Scheduling",
    description: "Start or stop automatically, on your time.",
    icon: "/icons/calendar.svg",
    handImage: "/hands/Scheduling.png",
    desktopLeft: 1000,
    desktopTop: 560,
  },
];

// ============================================
// DESKTOP FEATURE CARD COMPONENT
// ============================================
interface FeatureCardProps {
  feature: FeatureCardData;
  onHover: (id: FeatureId) => void;
  onLeave: () => void;
}

function DesktopFeatureCard({
  feature,
  onHover,
  onLeave,
}: FeatureCardProps) {
  return (
    <div
      className="w-[314px] h-[142px] rounded-[20px] overflow-hidden absolute transition-all duration-300 hover:shadow-[0px_8px_40px_0px_rgba(0,0,0,0.18)] hover:-translate-y-1 cursor-pointer"
      style={{
        background: "linear-gradient(180deg, #EAEAEA 0%, #FFFFFF 100%)",
        border: "3px solid rgba(0,0,0,0.03)",
        boxShadow: "0px 4px 30px 0px rgba(0,0,0,0.12)",
        left: feature.desktopLeft !== undefined ? `${feature.desktopLeft}px` : undefined,
        top: `${feature.desktopTop}px`,
      }}
      onMouseEnter={() => onHover(feature.id)}
      onMouseLeave={onLeave}
    >
      {/* Icon Container - positioned at left:12px, top:13px */}
      <div 
        className="absolute w-[106px] h-[116px] bg-[#181818] rounded-[13px] overflow-hidden flex items-center justify-center"
        style={{ left: "12px", top: "13px" }}
      >
        <Image
          src={feature.icon}
          alt={feature.title}
          width={48}
          height={48}
          className="w-12 h-12 object-contain"
        />
      </div>

      {/* Text Content - positioned at left:134px, top:20px */}
      <div 
        className="absolute flex flex-col gap-[14px] w-[141px]"
        style={{ left: "134px", top: "20px" }}
      >
        <p className="font-display text-[16px] font-bold text-black leading-[1.14]">
          {feature.title}
        </p>
        <p className="font-display text-[14px] text-black opacity-60 leading-normal">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

// ============================================
// MOBILE FEATURE CARD COMPONENT
// ============================================
interface MobileFeatureCardProps {
  feature: FeatureCardData;
  isActive?: boolean;
  onTap: (id: FeatureId) => void;
}

function MobileFeatureCard({ feature, isActive, onTap }: MobileFeatureCardProps) {
  return (
    <div
      className={`
        flex-shrink-0 w-[140px] h-[160px] rounded-[12px] overflow-hidden p-2.5
        transition-all duration-300 cursor-pointer
        ${isActive ? "scale-[1.02] -translate-y-0.5" : ""}
      `}
      style={{
        background: isActive 
          ? "#3478f6" 
          : "linear-gradient(180deg, #EAEAEA 0%, #FFFFFF 100%)",
        border: isActive ? "2px solid #3478f6" : "2px solid rgba(0,0,0,0.03)",
        boxShadow: isActive 
          ? "0px 8px 40px 0px rgba(0,0,0,0.18)" 
          : "0px 4px 30px 0px rgba(0,0,0,0.12)",
      }}
      onClick={() => onTap(feature.id)}
    >
      {/* Icon Container - using same icons as desktop */}
      <div className="w-full h-[58px] bg-[#181818] rounded-[8px] flex items-center justify-center mb-2.5">
        <Image
          src={feature.icon}
          alt={feature.title}
          width={40}
          height={40}
          className="w-10 h-10 object-contain"
        />
      </div>

      {/* Text Content */}
      <p className={`font-display text-[13px] font-bold leading-tight mb-1.5 line-clamp-2 ${isActive ? "text-white" : "text-black"}`}>
        {feature.title}
      </p>
      <p className={`font-display text-[11px] leading-normal line-clamp-2 ${isActive ? "text-white/70" : "text-black/60"}`}>
        {feature.description}
      </p>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export function OptimistAppSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  
  const [hoveredFeature, setHoveredFeature] = useState<FeatureId>(null);
  // Default to first item (energy-meter) for mobile
  const [activeFeature, setActiveFeature] = useState<FeatureId>("energy-meter");

  // Scroll-based active card detection for mobile carousel
  useEffect(() => {
    const carousel = mobileCarouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const cards = carousel.querySelectorAll('.mobile-feature-card');
      if (!cards.length) return;

      const carouselRect = carousel.getBoundingClientRect();
      const carouselCenter = carouselRect.left + carouselRect.width / 2;

      let closestCard: Element | null = null;
      let closestDistance = Infinity;

      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(carouselCenter - cardCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestCard = card;
        }
      });

      if (closestCard) {
        const featureId = (closestCard as HTMLElement).dataset.featureId as FeatureId;
        if (featureId && featureId !== activeFeature) {
          setActiveFeature(featureId);
        }
      }
    };

    carousel.addEventListener('scroll', handleScroll, { passive: true });
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, [activeFeature]);

  // Get current hand image based on hover/active state
  const getCurrentHandImage = useCallback(() => {
    const featureId = hoveredFeature || activeFeature;
    const feature = FEATURES.find((f) => f.id === featureId);
    return feature?.handImage || "/hands/Live Energy Meter.png";
  }, [hoveredFeature, activeFeature]);

  // Set initial states immediately to prevent flash/lag on first scroll
  useLayoutEffect(() => {
    if (headerRef.current) {
      gsap.set(headerRef.current, { opacity: 0, y: 40 });
    }
    if (phoneRef.current) {
      gsap.set(phoneRef.current, { opacity: 0, y: 60, scale: 0.9 });
    }
    const cards = featuresRef.current?.querySelectorAll(".feature-card");
    if (cards) {
      gsap.set(cards, { opacity: 0, scale: 0.9, y: 20 });
    }
  }, []);

  // GSAP animations
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

      tl.to(
        headerRef.current,
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", force3D: true },
        0
      );

      tl.to(
        phoneRef.current,
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out", force3D: true },
        0.2
      );

      const cards = featuresRef.current?.querySelectorAll(".feature-card");
      if (cards) {
        tl.to(
          cards,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "power3.out",
            force3D: true,
          },
          0.4
        );
      }
    },
    { scope: sectionRef }
  );

  const handleCardHover = (id: FeatureId) => {
    setHoveredFeature(id);
  };

  const handleCardLeave = () => {
    setHoveredFeature(null);
  };

  const handleMobileCardTap = (id: FeatureId) => {
    setActiveFeature(id);
  };

  return (
    <section
      ref={sectionRef}
      className="bg-white px-4 md:px-10"
    >
      {/* Main Container - 1360px x 917px from Figma */}
      <div
        ref={containerRef}
        className="relative max-w-[1360px] mx-auto rounded-[24px] lg:rounded-[44px] overflow-hidden"
        style={{
          background: "linear-gradient(90deg, rgba(236, 236, 236, 0.2) 0%, rgba(236, 236, 236, 0.2) 100%), linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)",
          border: "1px solid rgba(33,33,33,0.12)",
        }}
      >
        {/* ============ DESKTOP LAYOUT ============ */}
        <div className="hidden lg:block relative h-[800px]">
          {/* Background Ellipse - Outer (Group) */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ top: "120px", width: "1258px", height: "1258px" }}
          >
            <Image
              src="/Ellipse 6512.png"
              alt=""
              width={1258}
              height={1258}
              className="w-full h-full"
              style={{ transform: "scale(1.112)" }}
              loading="lazy"
              quality={75}
            />
          </div>

          {/* Background Ellipse - Inner */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ top: "380px", width: "753px", height: "753px" }}
          >
            <Image
              src="/Ellipse 6513.png"
              alt=""
              width={753}
              height={753}
              className="w-full h-full"
              style={{ transform: "scale(1.187)" }}
              loading="lazy"
              quality={75}
            />
          </div>

          {/* Hand/Phone Image */}
          <div
            ref={phoneRef}
            className="absolute z-20 pointer-events-none will-change-[transform,opacity]"
            style={{ 
              left: "55%", 
              top: "140px",
              transform: "translateX(-50%)",
              width: "800px",
              height: "700px",
            }}
          >
            {/* All hand images for crossfade effect on desktop */}
            {FEATURES.map((feature) => (
              <Image
                key={feature.id}
                src={feature.handImage}
                alt="Optimist App"
                fill
                sizes="700px"
                quality={85}
                className={`object-contain transition-opacity duration-300 ${
                  getCurrentHandImage() === feature.handImage
                    ? "opacity-100"
                    : "opacity-0"
                }`}
                priority={feature.id === "energy-meter"}
                loading={feature.id === "energy-meter" ? undefined : "lazy"}
              />
            ))}
          </div>

          {/* Bottom Fade Gradient */}
          <div 
            className="absolute left-0 w-full h-[120px] pointer-events-none z-30 bottom-0"
            style={{
              background: "linear-gradient(178deg, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 1) 100%)",
            }}
          />

          {/* Header - centered, top: 43px */}
          <div 
            ref={headerRef} 
            className="absolute left-1/2 -translate-x-1/2 text-center w-[444px] z-10 will-change-[transform,opacity]"
            style={{ top: "43px" }}
          >
            <h2 className="font-display text-[40px] font-bold text-black leading-none mb-[14px]">
              Optimist App
            </h2>
            <p className="font-display text-[20px] leading-normal" style={{ color: "rgba(0,0,0,0.42)" }}>
              Your full-control panel, right in your hand.
            </p>
          </div>

          {/* Feature Cards */}
          <div ref={featuresRef} className="absolute inset-0 z-20">
            {FEATURES.map((feature) => (
              <div key={feature.id} className="feature-card">
                <DesktopFeatureCard
                  feature={feature}
                  onHover={handleCardHover}
                  onLeave={handleCardLeave}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ============ MOBILE LAYOUT ============ */}
        <div className="lg:hidden relative overflow-hidden">
          {/* Background Ellipses - Mobile */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Outer Ellipse */}
            <div 
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: "196px", width: "100%", maxWidth: "1258px" }}
            >
              <Image
                src="/Ellipse 6512.png"
                alt=""
                width={1258}
                height={1258}
                sizes="100vw"
                className="w-full h-auto"
                style={{ transform: "scale(1.112)" }}
                loading="lazy"
                quality={60}
              />
            </div>
            {/* Inner Ellipse */}
            <div 
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: "350px", width: "80%", maxWidth: "753px" }}
            >
              <Image
                src="/Ellipse 6513.png"
                alt=""
                width={753}
                height={753}
                sizes="80vw"
                className="w-full h-auto"
                style={{ transform: "scale(1.187)" }}
                loading="lazy"
                quality={60}
              />
            </div>
          </div>

          {/* Header - Mobile */}
          <div ref={headerRef} className="relative z-10 text-center pt-[43px] px-4">
            <h2 className="font-display text-[32px] font-bold text-black leading-none mb-3">
              Optimist App
            </h2>
            <p className="font-display text-[16px] leading-normal" style={{ color: "rgba(0,0,0,0.42)" }}>
              Your full-control panel, right in your hand.
            </p>
          </div>

          {/* Hand/Phone Image Container - Mobile */}
          <div className="relative z-10">
            {/* Hand Image - 512px x 438px from Figma, responsive */}
            {/* OPTIMIZATION: Only render the active image on mobile to prevent memory crashes */}
            <div 
              ref={phoneRef} 
              className="relative flex justify-center"
              style={{ marginTop: "-20px" }}
            >
              <div 
                className="relative w-full"
                style={{ 
                  maxWidth: "512px",
                  aspectRatio: "512 / 438",
                }}
              >
                <Image
                  key={activeFeature}
                  src={FEATURES.find(f => f.id === activeFeature)?.handImage || FEATURES[0].handImage}
                  alt="Optimist App"
                  fill
                  sizes="(max-width: 512px) 100vw, 512px"
                  quality={80}
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* White Gradient at bottom of hand */}
            <div 
              className="absolute left-0 right-0 bottom-0 h-[100px] pointer-events-none z-20"
              style={{
                background: "linear-gradient(178deg, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 1) 100%)",
              }}
            />
          </div>

          {/* Horizontal Scrollable Carousel */}
          <div
            ref={mobileCarouselRef}
            className="relative z-20 flex gap-3 overflow-x-auto pb-6 pt-4 px-4 scrollbar-hide"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {FEATURES.map((feature) => (
              <div 
                key={feature.id} 
                className="feature-card mobile-feature-card"
                data-feature-id={feature.id}
                style={{ scrollSnapAlign: "center" }}
              >
                <MobileFeatureCard
                  feature={feature}
                  isActive={activeFeature === feature.id}
                  onTap={handleMobileCardTap}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OptimistAppSection;
