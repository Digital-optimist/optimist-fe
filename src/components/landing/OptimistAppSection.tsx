"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

// ============================================
// PARALLAX CONFIGURATION
// ============================================
const PARALLAX_CONFIG = {
  // Maximum rotation in radians (subtle tilt feel)
  maxRotationX: 0.12, // ~7 degrees
  maxRotationY: 0.15, // ~8.5 degrees
  // Lerp factor for smooth inertia (0.03-0.08 for "Surge" feel)
  lerpFactor: 0.06,
  // Responsiveness multiplier for smaller screens
  mobileMultiplier: 0.7,
  // Whether effect is active (disable on touch devices)
  enableOnTouch: false,
};

// Utility: Linear interpolation
function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

// ============================================
// CUSTOM HOOK: useMouseParallax
// Tracks normalized mouse coords and applies smooth rotation
// ============================================
function useMouseParallax(
  containerRef: React.RefObject<HTMLElement | null>,
  targetRef: React.RefObject<HTMLElement | null>,
  config = PARALLAX_CONFIG
) {
  // Target rotation (where we want to be)
  const targetRotation = useRef({ x: 0, y: 0 });
  // Current rotation (smoothly interpolated)
  const currentRotation = useRef({ x: 0, y: 0 });
  // Animation frame ID for cleanup
  const rafId = useRef<number | null>(null);
  // Track if mouse is over container
  const isHovering = useRef(false);

  // Responsive scaling based on viewport
  const getResponsiveMultiplier = useCallback(() => {
    if (typeof window === "undefined") return 1;
    return window.innerWidth < 1024 ? config.mobileMultiplier : 1;
  }, [config.mobileMultiplier]);

  useEffect(() => {
    const container = containerRef.current;
    const target = targetRef.current;
    if (!container || !target) return;

    // Check for touch device
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice && !config.enableOnTouch) return;

    // Mouse move handler - calculate normalized coords (-1 to +1)
    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering.current) return;

      const rect = container.getBoundingClientRect();
      // Normalize mouse position to -1 to +1 range
      const normalizedX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normalizedY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      const multiplier = getResponsiveMultiplier();

      // Set target rotation (inverted for natural feel)
      // Mouse moves right → rotate left (negative Y rotation)
      // Mouse moves down → rotate up (negative X rotation)
      targetRotation.current = {
        x: -normalizedY * config.maxRotationX * multiplier,
        y: normalizedX * config.maxRotationY * multiplier,
      };
    };

    const handleMouseEnter = () => {
      isHovering.current = true;
    };

    const handleMouseLeave = () => {
      isHovering.current = false;
      // Reset target to neutral position
      targetRotation.current = { x: 0, y: 0 };
    };

    // Animation loop - this is the "useFrame" equivalent
    const animate = () => {
      // Smooth lerp towards target rotation
      currentRotation.current.x = lerp(
        currentRotation.current.x,
        targetRotation.current.x,
        config.lerpFactor
      );
      currentRotation.current.y = lerp(
        currentRotation.current.y,
        targetRotation.current.y,
        config.lerpFactor
      );

      // Apply transform to target element
      // Note: perspective is set on parent element for full-component effect
      target.style.transform = `
        rotateX(${currentRotation.current.x}rad)
        rotateY(${currentRotation.current.y}rad)
        translateZ(0)
      `;

      rafId.current = requestAnimationFrame(animate);
    };

    // Start animation loop
    rafId.current = requestAnimationFrame(animate);

    // Attach event listeners
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      // Reset transform on cleanup
      target.style.transform = "";
    };
  }, [containerRef, targetRef, config, getResponsiveMultiplier]);
}

// Gauge icon component
function GaugeIcon() {
  return (
    <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] bg-[#111111] rounded-[20px] md:rounded-[24px] flex items-center justify-center flex-shrink-0">
      <div className="relative w-full h-full flex flex-col items-center justify-center p-2">
        {/* Gauge Arc */}
        <div className="relative w-12 md:w-16 h-8 md:h-10 mb-1 flex items-center justify-center">
          <svg
            width="64"
            height="32"
            viewBox="0 0 64 32"
            fill="none"
            className="absolute top-0 w-12 md:w-16"
          >
            <path
              d="M 4 28 A 28 28 0 0 1 60 28"
              stroke="#222222"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M 4 28 A 28 28 0 0 1 42 5"
              stroke="#3B82F6"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-white text-[11px] md:text-[14px] font-bold mt-2 md:mt-3">
            24°C
          </span>
        </div>
        {/* Three Icons below */}
        <div className="flex gap-1.5 md:gap-2 mt-1 md:mt-2">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#3B82F6] flex items-center justify-center">
            <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full opacity-80" />
          </div>
          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#3B82F6] flex items-center justify-center">
            <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full opacity-80" />
          </div>
          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#3B82F6] flex items-center justify-center">
            <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Bar chart icon for bills feature
function BillsIcon() {
  return (
    <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] bg-[#111111] rounded-[20px] md:rounded-[24px] flex items-center justify-center flex-shrink-0">
      <div className="relative w-full h-full flex flex-col items-center justify-center p-2">
        {/* Bar Chart */}
        <div className="flex items-end gap-1 md:gap-1.5 h-8 md:h-10 mb-1 md:mb-2">
          <div className="w-1.5 md:w-2 h-3 md:h-4 bg-[#222222] rounded-full" />
          <div className="w-1.5 md:w-2 h-6 md:h-8 bg-[#222222] rounded-full" />
          <div className="w-1.5 md:w-2 h-5 md:h-6 bg-[#222222] rounded-full" />
          <div className="w-1.5 md:w-2 h-8 md:h-10 bg-[#222222] rounded-full" />
          <div className="w-1.5 md:w-2 h-4 md:h-5 bg-[#222222] rounded-full" />
          <div className="w-1.5 md:w-2 h-9 md:h-12 bg-[#10B981] rounded-full" />
        </div>
        {/* Three Icons below */}
        <div className="flex gap-1.5 md:gap-2">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#3B82F6] flex items-center justify-center">
            <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full opacity-80" />
          </div>
          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#3B82F6] flex items-center justify-center">
            <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full opacity-80" />
          </div>
          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#3B82F6] flex items-center justify-center">
            <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  iconType = "gauge",
  iconPosition = "left",
  className = "",
}: {
  title: string;
  description: string;
  iconType?: "gauge" | "bills";
  iconPosition?: "left" | "right";
  className?: string;
}) {
  return (
    <div
      className={`feature-card backdrop-blur-md rounded-[20px] md:rounded-[32px] p-3 md:p-4 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex items-center gap-3 md:gap-5 border border-gray-100 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 ${
        iconPosition === "right" ? "flex-row-reverse" : "flex-row"
      } ${className}`}
      style={{background:"linear-gradient(180deg, #EAEAEA 0%, #FFFFFF 100%)",boxShadow: "0px 4px 30px 0px #0000001F"}}
    >
      {/* Icon Box */}
      <div className="flex-shrink-0">
        {iconType === "bills" ? <BillsIcon /> : <GaugeIcon />}
      </div>
      {/* Text */}
      <div className="flex-1 min-w-0">
        <h4 className="text-[14px] md:text-[16px] font-bold text-gray-900 leading-tight mb-0.5 md:mb-1 tracking-tight">
          {title}
        </h4>
        <p className="text-[12px] md:text-[14px] text-gray-400 leading-snug font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}

// Mobile feature card for carousel
function MobileFeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div 
      className="feature-card flex-shrink-0 w-[180px] rounded-[16px] p-2.5 border border-gray-200"
      style={{
        background: "linear-gradient(180deg, #EAEAEA 0%, #FFFFFF 100%)",
        boxShadow: "0px 4px 20px 0px rgba(0, 0, 0, 0.08)"
      }}
    >
      {/* Dark Icon Container */}
      <div className="w-full h-[120px] bg-[#111111] rounded-[12px] flex items-center justify-center mb-3">
        <div className="relative flex flex-col items-center justify-center">
          {/* Gauge Arc */}
          <div className="relative w-20 h-12 mb-1 flex items-center justify-center">
            <svg
              width="80"
              height="40"
              viewBox="0 0 80 40"
              fill="none"
              className="absolute top-0"
            >
              {/* Background arc */}
              <path
                d="M 8 36 A 32 32 0 0 1 72 36"
                stroke="#222222"
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Blue progress arc */}
              <path
                d="M 8 36 A 32 32 0 0 1 52 8"
                stroke="#3B82F6"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-white text-[16px] font-bold mt-4">24°C</span>
          </div>
          {/* Three Blue Dots */}
          <div className="flex gap-2.5 mt-2">
            <div className="w-4 h-4 rounded-full bg-[#3B82F6] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full opacity-90" />
            </div>
            <div className="w-4 h-4 rounded-full bg-[#3B82F6] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full opacity-90" />
            </div>
            <div className="w-4 h-4 rounded-full bg-[#3B82F6] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full opacity-90" />
            </div>
          </div>
        </div>
      </div>
      {/* Text Content */}
      <h4 className="text-[15px] font-bold text-gray-900 leading-tight mb-0.5">
        {title}
      </h4>
      <p className="text-[13px] text-gray-500 leading-snug">{description}</p>
    </div>
  );
}

export function OptimistAppSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxContentRef = useRef<HTMLDivElement>(null); // Inner content that receives parallax
  const headerRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // ============================================
  // PARALLAX EFFECT SETUP
  // Apply smooth 3D tilt to the FULL component content
  // sectionRef = area that tracks mouse movement
  // parallaxContentRef = entire inner content that receives the tilt
  // The lerping happens in the animation loop (equivalent to R3F useFrame)
  // ============================================
  useMouseParallax(sectionRef, parallaxContentRef);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 25%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        0
      );

      tl.fromTo(
        phoneRef.current,
        { opacity: 0, y: 60, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" },
        0.2
      );

      const cards = featuresRef.current?.querySelectorAll(".feature-card");
      if (cards) {
        tl.fromTo(
          cards,
          { opacity: 0, scale: 0.9, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "power3.out",
          },
          0.4
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="bg-white py-4 md:py-6 px-4 md:px-6 overflow-x-hidden"
    >
      {/* Rounded Container with Border - STATIC frame */}
      <div
        ref={containerRef}
        className={`relative max-w-[1440px] mx-auto bg-gradient-to-b from-white via-[#f5f9ff] to-[#e8f1ff] rounded-[32px] md:rounded-[48px] overflow-hidden border border-gray-200/50 transition-shadow duration-500 ease-out ${
          isHovered ? "shadow-2xl" : "shadow-xl"
        }`}
        style={{ perspective: "1500px" }} // 3D perspective for inner content
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Inner content wrapper - receives parallax tilt */}
        <div
          ref={parallaxContentRef}
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
            transformOrigin: "center center",
          }}
        >
        {/* Background Semi-Elliptical Gradients from Bottom */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Outer Ellipse Image - Desktop Only */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-[65%]">
            <Image
              src="/Ellipse 6512.png"
              alt=""
              width={1600}
              height={1100}
              className="w-[1600px] h-auto"
            />
          </div>
          {/* Inner Ellipse Image - Desktop Only */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-[50%]">
            <Image
              src="/Ellipse 6513.png"
              alt=""
              width={1200}
              height={850}
              className="w-[1200px] h-auto"
            />
          </div>
          {/* Radial glow effect */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-[40%] w-[1400px] rounded-[50%] bg-gradient-radial from-[#D4E8FF]/20 via-[#E8F2FF]/10 to-transparent" />
        </div>

        <div className="relative z-10 px-4 md:px-8 lg:px-16 pt-4 md:pt-8 pb-0">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-8 md:mb-12">
            <h2 className="font-display text-[32px] md:text-[40px] leading-[32px] md:leading-[40px] font-[700] font-bold text-gray-900 mb-2">
              Optimist App
            </h2>
            <p className="text-[16px] md:text-[20px] leading-[16px] md:leading-[20px] text-[#0000006B] font-[400]">
              Your full-control panel, right in your hand.
            </p>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block relative h-[600px]">
            {/* Blue Gradient Arcs - Desktop Only */}
            {/* Outer Arc - at bottom curving upward */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-10"
              style={{ bottom: "-450px" }}
            >
              <Image
                src="/Ellipse 6512.png"
                alt=""
                width={1400}
                height={900}
                className="w-[1400px] h-auto"
              />
            </div>
            {/* Inner Arc - at bottom curving upward */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-10"
              style={{ bottom: "-350px" }}
            >
              <Image
                src="/Ellipse 6513.png"
                alt=""
                width={1100}
                height={700}
                className="w-[1100px] h-auto"
              />
            </div>

            {/* Feature Cards positioned along the elliptical arcs */}
            <div ref={featuresRef} className="absolute inset-0">
              {/* Left Arc Cards - Top to Bottom */}
    

              {/* Top Left - Live Energy Meter */}
              <div
                className="absolute z-20 transition-transform duration-300 hover:scale-105"
                style={{ top: "0%", left: "8%" }}
              >
                <FeatureCard
                  title="Live Energy Meter"
                  description="Track. Predict. Save."
                  iconType="gauge"
                  iconPosition="left"
                  className="w-[320px]"
                />
              </div>

              {/* Middle Left - Projected Monthly Bills */}
              <div
                className="absolute z-20 transition-transform duration-300 hover:scale-105"
                style={{ top: "35%", left: "2%" }}
              >
                <FeatureCard
                  title="Projected Monthly Bills"
                  description="No surprises. Just real numbers."
                  iconType="bills"
                  iconPosition="left"
                  className="w-[320px]"
                />
              </div>

              {/* Bottom Left - Filter Health */}
              <div
                className="absolute z-20 transition-transform duration-300 hover:scale-105"
                style={{ top: "70%", left: "6%" }}
              >
                <FeatureCard
                  title="Filter Health"
                  description="Clean when needed. No more guessing."
                  iconType="gauge"
                  iconPosition="left"
                  className="w-[320px]"
                />
              </div>

              {/* Right Arc Cards - Top to Bottom */}

              {/* Top Right - Gas Level Indicator */}
              <div
                className="absolute z-20 transition-transform duration-300 hover:scale-105"
                style={{ top: "0%", right: "8%" }}
              >
                <FeatureCard
                  title="Gas Level Indicator"
                  description="Know before it's an issue."
                  iconType="gauge"
                  iconPosition="right"
                  className="w-[320px]"
                />
              </div>

              {/* Middle Right - Intelligence Service Assistance */}
              <div
                className="absolute z-20 transition-transform duration-300 hover:scale-105"
                style={{ top: "35%", right: "2%" }}
              >
                <FeatureCard
                  title="Intelligence Service Assistance"
                  description="Diagnose remotely. Service seamlessly"
                  iconType="gauge"
                  iconPosition="right"
                  className="w-[340px]"
                />
              </div>

              {/* Bottom Right - Scheduling */}
              <div
                className="absolute z-[31] transition-transform duration-300 hover:scale-105"
                style={{ top: "70%", right: "6%" }}
              >
                <FeatureCard
                  title="Scheduling"
                  description="Start or stop automatically, on your time."
                  iconType="gauge"
                  iconPosition="right"
                  className="w-[320px]"
                />
              </div>
            </div>

            {/* Hand/Phone Image - Bottom Center-Right */}
            <div
              ref={phoneRef}
              className="absolute z-30 pointer-events-none"
              style={{
                bottom: "0px",
                left: "45%",
                transform: "translateX(-50%)",
              }}
            >
              <div className="relative w-[900px]">
                <Image
                  src="/Hand.png"
                  alt="Optimist App"
                  width={850}
                  height={1500}
                  className="w-full h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.2)]"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden mt-[-50px]">
            {/* Phone */}
            <div ref={phoneRef} className="flex justify-center">
              <div className="relative w-[100%]">
                <Image
                  src="/Hand.png"
                  alt="Optimist App"
                  width={500}
                  height={820}
                  className="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                  priority
                />
              </div>
            </div>

            {/* Horizontal Scrollable Carousel */}
            <div
              ref={featuresRef}
              className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {mobileFeatures.map((f) => (
                <div key={f.id} style={{ scrollSnapAlign: "start" }}>
                  <MobileFeatureCard
                    title={f.title}
                    description={f.description}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>{/* Close parallax wrapper */}
      </div>
    </section>
  );
}

const mobileFeatures = [
  {
    id: 1,
    title: "Live Energy Meter",
    description: "To track consumption and predict bills",
  },
  {
    id: 2,
    title: "Live Energy Meter",
    description: "To track consumption and predict bills",
  },
  {
    id: 3,
    title: "Live Energy Meter",
    description: "To track consumption and predict bills",
  },
  {
    id: 4,
    title: "Live Energy Meter",
    description: "To track consumption and predict bills",
  },
  {
    id: 5,
    title: "Live Energy Meter",
    description: "To track consumption and predict bills",
  },
  {
    id: 6,
    title: "Live Energy Meter",
    description: "To track consumption and predict bills",
  },
];
