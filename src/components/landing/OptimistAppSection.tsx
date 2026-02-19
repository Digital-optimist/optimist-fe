"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ASSETS } from "@/lib/assets";

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
  // Hand image position offset (to keep all hands at same visual position)
  handOffsetX?: number;
  handOffsetY?: number;
}

const FEATURES: FeatureCardData[] = [
  {
    id: "energy-meter",
    title: "Live Energy tracking",
    description: "Control your Bills\nSave even more!",
    icon: ASSETS.thermometer,
    handImage: ASSETS.liveEnergyMeter,
    desktopLeft: 120,
    desktopTop: 180,
    handOffsetX: 0,
    handOffsetY: 0,
  },
  {
    id: "bills",
    title: "Projected Monthly Bills",
    description: "No surprises. Just real numbers.",
    icon: ASSETS.scroll,
    handImage: ASSETS.projectedMonthlyBills,
    desktopLeft: 30,
    desktopTop: 380,
    handOffsetX: 0,
    handOffsetY: 0,
  },
  {
    id: "filter",
    title: "Filter Health",
    description: "Clean when needed. No more guessing.",
    icon: ASSETS.filter,
    handImage: ASSETS.filterTracking,
    desktopLeft: 120,
    desktopTop: 580,
    handOffsetX: 0,
    handOffsetY: 0,
  },
  {
    id: "gas-level",
    title: "Gas Level Indicator",
    description: "Know before it's an issue.",
    icon: ASSETS.gastank,
    handImage: ASSETS.gasLevelIndicator,
    desktopLeft: 906,
    desktopTop: 160,
    handOffsetX: -20,
    handOffsetY: 0,
  },
  {
    id: "service",
    title: "Intelligence Service Assistance",
    description: "Diagnose remotely. Service seamlessly",
    icon: ASSETS.headset,
    handImage: ASSETS.serviceAssistance,
    desktopLeft: 1016,
    desktopTop: 360,
    handOffsetX: 0,
    handOffsetY: 0,
  },
  {
    id: "scheduling",
    title: "Scheduling",
    description: "Start or stop automatically, on your time.",
    icon: ASSETS.calendar,
    handImage: ASSETS.scheduling,
    desktopLeft: 906,
    desktopTop: 560,
    handOffsetX: -16,
    handOffsetY: 0,
  },
];

// ============================================
// DESKTOP FEATURE CARD COMPONENT
// ============================================
interface FeatureCardProps {
  feature: FeatureCardData;
  onHover: (id: FeatureId) => void;
  onLeave: () => void;
  containerWidth: number;
  isHovered?: boolean;
}

function DesktopFeatureCard({
  feature,
  onHover,
  onLeave,
  containerWidth,
  isHovered = false,
}: FeatureCardProps) {
  // Scale positions based on container width (base design is 1360px)
  const scale = Math.min(1, containerWidth / 1360);
  const scaledLeft =
    feature.desktopLeft !== undefined ? feature.desktopLeft * scale : undefined;
  const scaledTop = feature.desktopTop * scale;

  // Scale card size for smaller screens (Figma base: 314x142)
  const cardWidth = Math.max(240, 314 * scale);
  const cardHeight = Math.max(110, 142 * scale);
  // Figma: icon box 106x116
  const iconWidth = Math.max(70, 106 * scale);
  const iconHeight = Math.max(80, 116 * scale);
  // Figma: image 64x64
  const imageSize = Math.max(44, 64 * scale);

  return (
    <div
      className="rounded-[20px] overflow-hidden absolute transition-all duration-300 cursor-pointer"
      style={{
        background: "linear-gradient(180deg, #EAEAEA 0%, #FFFFFF 100%)",
        border: "3px solid rgba(0,0,0,0.03)",
        boxShadow: isHovered
          ? "0px 8px 40px 0px rgba(0,0,0,0.18)"
          : "0px 4px 30px 0px rgba(0,0,0,0.12)",
        left: scaledLeft !== undefined ? `${scaledLeft}px` : undefined,
        top: `${scaledTop}px`,
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => onHover(feature.id)}
      onMouseLeave={onLeave}
    >
      {/* Icon Container - Figma: left:12px, top:13px, 106x116, rounded:13.117px */}
      <div
        className="absolute overflow-hidden transition-colors duration-300"
        style={{
          left: `${Math.max(8, 12 * scale)}px`,
          top: `${Math.max(9, 13 * scale)}px`,
          width: `${iconWidth}px`,
          height: `${iconHeight}px`,
          borderRadius: `${Math.max(9, 13.117 * scale)}px`,
          backgroundColor: isHovered ? "#3478f6" : "rgba(24,24,24,0.05)",
        }}
      >
        {/* Image centered using absolute positioning - Figma: 64x64 centered */}
        <div
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: `${imageSize}px`,
            height: `${imageSize}px`,
          }}
        >
          <Image
            src={feature.icon}
            alt={feature.title}
            width={64}
            height={64}
            className="object-contain w-full h-full"
          />
        </div>
        {/* Inner shadow overlay - Figma: inset 0px 5px 20px rgba(0,0,0,0.07) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: "inherit",
            boxShadow: "inset 0px 5px 20px 0px rgba(0,0,0,0.07)",
          }}
        />
      </div>

      {/* Text Content - Figma: left:134px, top:20px, width:141px, gap:14px */}
      <div
        className="absolute flex flex-col"
        style={{
          left: `${Math.max(90, 134 * scale)}px`,
          top: `${Math.max(14, 20 * scale)}px`,
          width: `${Math.max(100, 141 * scale)}px`,
          gap: `${Math.max(10, 14 * scale)}px`,
        }}
      >
        <p
          className="font-display font-bold leading-none transition-colors duration-300"
          style={{
            fontSize: `${Math.max(13, 16 * scale)}px`,
            color: isHovered ? "#3478f6" : "#000000",
          }}
        >
          {feature.title}
        </p>
        <p
          className="font-display leading-normal transition-colors duration-300"
          style={{
            fontSize: `${Math.max(11, 14 * scale)}px`,
            color: isHovered ? "rgba(52, 120, 246, 0.6)" : "rgba(0, 0, 0, 0.6)",
          }}
        >
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

function MobileFeatureCard({
  feature,
  isActive,
  onTap,
}: MobileFeatureCardProps) {
  return (
    <div
      className={`
        flex-shrink-0 
        w-[220px] xs:w-[250px] sm:w-[280px] md:w-[300px]
        h-[100px] xs:h-[110px] sm:h-[120px] md:h-[130px]
        rounded-[14px] sm:rounded-[16px] md:rounded-[20px] overflow-hidden
        transition-all duration-300 cursor-pointer
        ${isActive ? "scale-[1.02] -translate-y-0.5" : ""}
      `}
      style={{
        background: "linear-gradient(180deg, #EAEAEA 0%, #FFFFFF 100%)",
        border: "3px solid rgba(0,0,0,0.03)",
        boxShadow: isActive
          ? "0px 8px 40px 0px rgba(0,0,0,0.18)"
          : "0px 4px 30px 0px rgba(0,0,0,0.12)",
      }}
      onClick={() => onTap(feature.id)}
    >
      {/* Horizontal layout matching desktop */}
      <div className="flex h-full p-2 sm:p-2.5 gap-2 sm:gap-3">
        {/* Icon Container - matching Figma pattern with centered image and overlay shadow */}
        <div
          className="flex-shrink-0 w-[70px] xs:w-[80px] sm:w-[90px] md:w-[100px] h-full rounded-[10px] sm:rounded-[12px] md:rounded-[13px] overflow-hidden relative transition-colors duration-300"
          style={{
            backgroundColor: isActive ? "#3478f6" : "rgba(24,24,24,0.05)",
          }}
        >
          {/* Image centered using absolute positioning */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 xs:w-11 sm:w-12 md:w-14 h-10 xs:h-11 sm:h-12 md:h-14">
            <Image
              src={feature.icon}
              alt={feature.title}
              width={64}
              height={64}
              className="w-full h-full object-contain"
            />
          </div>
          {/* Inner shadow overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: "inherit",
              boxShadow: "inset 0px 5px 20px 0px rgba(0,0,0,0.07)",
            }}
          />
        </div>

        {/* Text Content - horizontal layout like desktop */}
        <div className="flex flex-col justify-center gap-[10px] sm:gap-[12px] md:gap-[14px] flex-1 min-w-0 pr-1">
          <p
            className="font-display text-[12px] xs:text-[13px] sm:text-[14px] md:text-[15px] font-bold leading-none transition-colors duration-300"
            style={{ color: isActive ? "#3478f6" : "#000000" }}
          >
            {feature.title}
          </p>
          <p
            className="font-display text-[10px] xs:text-[11px] sm:text-[12px] md:text-[13px] leading-normal transition-colors duration-300"
            style={{
              color: isActive
                ? "rgba(52, 120, 246, 0.6)"
                : "rgba(0, 0, 0, 0.6)",
            }}
          >
            {feature.description}
          </p>
        </div>
      </div>
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
  const contentRef = useRef<HTMLDivElement>(null);

  const [hoveredFeature, setHoveredFeature] = useState<FeatureId>(null);
  // Default to first item (energy-meter) for mobile
  const [activeFeature, setActiveFeature] = useState<FeatureId>("energy-meter");
  const [containerWidth, setContainerWidth] = useState(1360);

  // Track container width for responsive scaling
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Mouse parallax effect - push in opposite direction
  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    // Configuration for the parallax effect
    const maxMove = 15; // Maximum pixels to move
    const smoothness = 0.1; // Smoothing factor (0.05 - 0.2 for smooth feel)

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let animationId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();

      // Calculate mouse position relative to container center (0 to 1, centered at 0.5)
      const mouseX = (e.clientX - rect.left) / rect.width;
      const mouseY = (e.clientY - rect.top) / rect.height;

      // Convert to -1 to 1 range (centered at 0)
      const normalizedX = (mouseX - 0.5) * 2;
      const normalizedY = (mouseY - 0.5) * 2;

      // Invert for opposite direction push effect
      targetX = -normalizedX * maxMove;
      targetY = -normalizedY * maxMove;
    };

    const handleMouseLeave = () => {
      // Smoothly return to center
      targetX = 0;
      targetY = 0;
    };

    const animate = () => {
      // Lerp towards target for smooth motion
      currentX += (targetX - currentX) * smoothness;
      currentY += (targetY - currentY) * smoothness;

      // Apply transform
      gsap.set(content, {
        x: currentX,
        y: currentY,
        force3D: true,
      });

      animationId = requestAnimationFrame(animate);
    };

    // Start animation loop
    animationId = requestAnimationFrame(animate);

    // Add event listeners
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Scroll-based active card detection for mobile carousel
  useEffect(() => {
    const carousel = mobileCarouselRef.current;
    if (!carousel) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // Debounce for smoother updates
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const cards = carousel.querySelectorAll(".mobile-feature-card");
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
          const featureId = (closestCard as HTMLElement).dataset
            .featureId as FeatureId;
          if (featureId) {
            setActiveFeature(featureId);
          }
        }
      }, 50);
    };

    // Initial check on mount
    handleScroll();

    carousel.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      carousel.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Get current hand image based on hover/active state
  const getCurrentHandImage = useCallback(() => {
    const featureId = hoveredFeature || activeFeature;
    const feature = FEATURES.find((f) => f.id === featureId);
    return feature?.handImage || ASSETS.liveEnergyMeter;
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
          start: "top 85%",
          end: "top 30%",
          scrub: 0.8, // Smooth scroll-linked animation with slight lag
        },
      });

      tl.to(
        headerRef.current,
        { opacity: 1, y: 0, duration: 1, ease: "power2.out", force3D: true },
        0,
      );

      tl.to(
        phoneRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          force3D: true,
        },
        0.15,
      );

      const cards = featuresRef.current?.querySelectorAll(".feature-card");
      if (cards) {
        tl.to(
          cards,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            stagger: 0.08,
            duration: 1,
            ease: "power2.out",
            force3D: true,
          },
          0.3,
        );
      }
    },
    { scope: sectionRef },
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

  // Calculate responsive values
  const scale = Math.min(1, containerWidth / 1360);
  const desktopHeight = Math.max(600, Math.min(800, 800 * scale));
  const handImageWidth = Math.max(500, 800 * scale);
  const handImageHeight = Math.max(450, 700 * scale);

  return (
    <section
      ref={sectionRef}
      className="bg-white py-10 px-3 sm:px-4 md:px-6 lg:px-10"
    >
      {/* Main Container - responsive max-width */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[1360px] mx-auto rounded-[20px] sm:rounded-[28px] md:rounded-[36px] lg:rounded-[44px] overflow-hidden"
        style={{
          background:
            "linear-gradient(90deg, rgba(236, 236, 236, 0.2) 0%, rgba(236, 236, 236, 0.2) 100%), linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)",
          border: "1px solid rgba(33,33,33,0.12)",
        }}
      >
        {/* ============ DESKTOP LAYOUT (lg and up) ============ */}
        <div
          className="hidden lg:block relative overflow-hidden"
          style={{ height: `${desktopHeight}px` }}
        >
          {/* Parallax content wrapper */}
          <div
            ref={contentRef}
            className="absolute inset-0 will-change-transform"
          >
            {/* Background Ellipse - Outer (Group) - responsive sizing */}
            <div
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                top: `${120 * scale}px`,
                width: `${Math.min(1258, containerWidth * 0.95)}px`,
                height: `${Math.min(1258, containerWidth * 0.95)}px`,
              }}
            >
              <Image
                src={ASSETS.ellipse6512}
                alt=""
                width={1258}
                height={1258}
                className="w-full h-full"
                style={{ transform: "scale(1.112)" }}
                quality={75}
              />
            </div>

            {/* Background Ellipse - Inner */}
            <div
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                top: `${380 * scale}px`,
                width: `${Math.min(753, containerWidth * 0.6)}px`,
                height: `${Math.min(753, containerWidth * 0.6)}px`,
              }}
            >
              <Image
                src={ASSETS.ellipse6513}
                alt=""
                width={753}
                height={753}
                className="w-full h-full"
                style={{ transform: "scale(1.187)" }}
                quality={75}
              />
            </div>

            {/* Hand/Phone Image - Responsive position container */}
            <div
              ref={phoneRef}
              className="absolute z-20 pointer-events-none will-change-[transform,opacity]"
              style={{
                left: "60%",
                top: `${140 * scale}px`,
                transform: "translateX(-50%)",
                width: `${handImageWidth}px`,
                height: `${handImageHeight}px`,
                overflow: "hidden",
              }}
            >
              {/* All hand images stacked - using responsive positioning */}
              {FEATURES.map((feature) => {
                const offsetX = (feature.handOffsetX || 0) * scale;
                const offsetY = (feature.handOffsetY || 0) * scale;

                return (
                  <div
                    key={feature.id}
                    className={`absolute transition-opacity duration-300 ${
                      getCurrentHandImage() === feature.handImage
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                    style={{
                      left: `${offsetX}px`,
                      top: `${offsetY}px`,
                      width: `${handImageWidth}px`,
                      height: `${handImageHeight}px`,
                    }}
                  >
                    <Image
                      src={feature.handImage}
                      alt={`Optimist App - ${feature.title}`}
                      width={800}
                      height={700}
                      quality={85}
                      className="w-full h-full"
                      style={{
                        objectFit: "cover",
                        objectPosition: "center center",
                      }}
                      priority={feature.id === "energy-meter"}
                    />
                  </div>
                );
              })}
            </div>

            {/* Header - centered, responsive positioning */}
            <div
              ref={headerRef}
              className="absolute left-1/2 -translate-x-1/2 text-center z-10 will-change-[transform,opacity] px-4"
              style={{
                top: `${Math.max(30, 43 * scale)}px`,
                width: `${Math.min(600, containerWidth * 0.5)}px`,
              }}
            >
              <h2
                className="font-display font-bold text-black leading-none mb-2 lg:mb-[14px]"
                style={{ fontSize: `${Math.max(28, 40 * scale)}px` }}
              >
                Real Intelligence in your Hand.
              </h2>
              <p
                className="font-display leading-normal"
                style={{
                  color: "rgba(0,0,0,0.42)",
                  fontSize: `${Math.max(16, 20 * scale)}px`,
                }}
              >
                Control. Monitor. Diagnose. Anytime. Anywhere
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
                    containerWidth={containerWidth}
                    isHovered={hoveredFeature === feature.id}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Fade Gradient - outside parallax wrapper so it stays fixed */}
          <div
            className="absolute left-0 w-full h-[80px] lg:h-[120px] pointer-events-none z-30 bottom-0"
            style={{
              background:
                "linear-gradient(178deg, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 1) 100%)",
            }}
          />
        </div>

        {/* ============ TABLET LAYOUT (md to lg) ============ */}
        <div
          className="hidden md:block lg:hidden relative bg-white overflow-hidden"
          style={{ minHeight: "580px" }}
        >
          {/* Background Ellipses - Tablet - better centered */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: "80px", width: "110%", maxWidth: "800px" }}
            >
              <Image
                src={ASSETS.ellipse6512}
                alt=""
                width={1258}
                height={1258}
                sizes="110vw"
                className="w-full h-auto"
                style={{ transform: "scale(1.112)" }}
                quality={70}
              />
            </div>
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: "200px", width: "70%", maxWidth: "500px" }}
            >
              <Image
                src={ASSETS.ellipse6513}
                alt=""
                width={753}
                height={753}
                sizes="70vw"
                className="w-full h-auto"
                style={{ transform: "scale(1.187)" }}
                quality={70}
              />
            </div>
          </div>

          {/* Header - Tablet - reduced top padding */}
          <div className="relative bg-white z-10 text-center pt-8 px-6">
            <h2 className="font-display text-[32px] font-bold text-black leading-none mb-2">
              Real Intelligence in your Hand.
            </h2>
            <p
              className="font-display text-[16px] leading-normal max-w-sm mx-auto"
              style={{ color: "rgba(0,0,0,0.42)" }}
            >
              Control. Monitor. Diagnose. Anytime. Anywhere
            </p>
          </div>

          {/* Hand/Phone Image Container - Tablet - better centered positioning */}
          <div
            ref={phoneRef}
            className="relative z-10 pointer-events-none mx-auto mt-2"
            style={{
              width: "100%",
              maxWidth: "500px",
              height: "340px",
            }}
          >
            <Image
              key={activeFeature}
              src={
                FEATURES.find((f) => f.id === activeFeature)?.handImage ||
                FEATURES[0].handImage
              }
              alt="Optimist App"
              fill
              sizes="500px"
              quality={80}
              className="object-contain object-center"
              priority
            />
          </div>

          {/* Carousel - Tablet - improved spacing and centered */}
          <div
            ref={mobileCarouselRef}
            className="relative bg-white pt-2 z-30 flex gap-4 overflow-x-auto pb-6 px-6 scrollbar-hide justify-start"
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

        {/* ============ MOBILE LAYOUT (below md) ============ */}
        <div
          className="md:hidden relative bg-white overflow-hidden"
          style={{ minHeight: "690px" }}
        >
          {/* Background Ellipses - Mobile */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Outer Ellipse */}
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: "200px", width: "150%", maxWidth: "1258px" }}
            >
              <Image
                src={ASSETS.ellipse6512}
                alt=""
                width={1258}
                height={1258}
                sizes="150vw"
                className="w-full h-auto"
                style={{ transform: "scale(1.112)" }}
                quality={60}
              />
            </div>
            {/* Inner Ellipse */}
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: "360px", width: "100%", maxWidth: "753px" }}
            >
              <Image
                src={ASSETS.ellipse6513}
                alt=""
                width={753}
                height={753}
                sizes="100vw"
                className="w-full h-auto"
                style={{ transform: "scale(1.187)" }}
                quality={60}
              />
            </div>
          </div>

          {/* Header - Mobile */}
          <div
            ref={headerRef}
            className="relative bg-white z-10 text-center pt-[43px] px-4"
          >
            <h2 className="font-display text-[28px] xs:text-[30px] sm:text-[32px] font-bold text-black leading-none mb-3">
              Real Intelligence <br /> in your Hand.
            </h2>
            <p
              className="font-display text-[15px] xs:text-[16px] sm:text-[16px] leading-normal"
              style={{ color: "rgba(0,0,0,0.42)" }}
            >
              Control. Monitor. Diagnose. <br /> Anytime. Anywhere
            </p>
          </div>

          {/* Hand/Phone Image Container - Mobile - positioned bottom right */}
          <div
            ref={phoneRef}
            className="absolute z-10 pointer-events-none"
            style={{
              right: "-200px",
              bottom: "50px",
              width: "700px",
              height: "580px",
            }}
          >
            <Image
              key={activeFeature}
              src={
                FEATURES.find((f) => f.id === activeFeature)?.handImage ||
                FEATURES[0].handImage
              }
              alt="Optimist App"
              fill
              sizes="580px"
              quality={80}
              className="object-contain object-right-bottom"
              priority
            />
          </div>

          {/* White Gradient at bottom */}
          <div className="absolute left-0 right-0 bottom-0 h-[150px] sm:h-[180px] pointer-events-none z-20" />

          {/* Horizontal Scrollable Carousel - positioned at bottom */}
          <div
            ref={mobileCarouselRef}
            className="absolute bottom-0 bg-white pt-3 sm:pt-4 left-0 right-0 z-30 flex gap-2 xs:gap-3 overflow-x-auto pb-4 xs:pb-5 sm:pb-6 px-3 xs:px-4 scrollbar-hide"
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
