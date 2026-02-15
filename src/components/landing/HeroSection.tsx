"use client";

import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useWaitlist } from "@/contexts/WaitlistContext";
import { ASSETS } from "@/lib/assets";

// Smooth scroll to element using GSAP
const scrollToSection = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    const targetPosition = element.getBoundingClientRect().top + window.scrollY;
    gsap.to(window, {
      scrollTo: { y: targetPosition, autoKill: false },
      duration: 0.1,
      ease: "power2.inOut",
    });
  }
};

function HeroACImage({ isMobile }: { isMobile: boolean }) {
  return (
    <motion.div
      className="relative flex items-end justify-center w-full"
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
      style={{
        width: isMobile ? "90%" : "clamp(680px, 60vw, 1000px)",
        maxWidth: isMobile ? "400px" : "1050px",
      }}
    >
      <Image
        src={isMobile ? ASSETS.acHeroMobile : ASSETS.acHeroDesktop}
        alt="Optimist AC - India's highest ISEER rated air conditioner"
        width={1050}
        height={700}
        className="object-contain w-full h-auto"
        priority
      />
    </motion.div>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const mobileButtonsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const parallaxContainerRef = useRef<HTMLDivElement>(null);
  const parallaxContentRef = useRef<HTMLDivElement>(null);
  const leafVideoRef1 = useRef<HTMLVideoElement>(null);
  const { openModal } = useWaitlist();
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Set leaf video playback speed (slower)
  useEffect(() => {
    if (leafVideoRef1.current) {
      leafVideoRef1.current.playbackRate = 0.3;
    }
  }, []);

  // Mouse parallax effect - push in opposite direction (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const container = parallaxContainerRef.current;
    const content = parallaxContentRef.current;
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
  }, [isMobile]);

  // Initial entrance animations
  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // Staggered headline animation
      tl.fromTo(
        headlineRef.current?.querySelectorAll("span") || [],
        { opacity: 0, y: 60, rotateX: -15 },
        { opacity: 1, y: 0, rotateX: 0, stagger: 0.15, duration: 1 },
      )
        // Badges fade in
        .fromTo(
          badgesRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5",
        )
        // Desktop buttons
        .fromTo(
          buttonsRef.current?.children || [],
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, stagger: 0.1, duration: 0.6 },
          "-=0.4",
        )
        // Mobile buttons
        .fromTo(
          mobileButtonsRef.current?.children || [],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.6 },
          "-=0.6",
        )
        // AC Image with scale effect
        .fromTo(
          imageRef.current,
          { opacity: 0, y: 80, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power2.out" },
          "-=0.8",
        );
    },
    { scope: sectionRef },
  );

  // Use CSS-based responsive sizing for SSR, only switch to JS-based after mount
  // Note: Using 'svh' (small viewport height) on mobile instead of 'dvh' to prevent
  // height changes when the navigation header hides/shows on scroll
  const sectionStyle = isMounted
    ? {
        height: isMobile ? "85svh" : "82vh",
        minHeight: isMobile ? "550px" : "500px",
      }
    : {
        height: "82vh",
        minHeight: "500px",
      };

  return (
    <section
      ref={sectionRef}
      className="hero-section relative flex flex-col bg-black"
      style={{ ...sectionStyle, overflow: "visible", zIndex: 10 }}
    >
      {/* MOBILE LAYOUT */}
      {isMounted && isMobile && (
        <>
          {/* COMMENTED OUT: Previous Blue Gradient Background implementation */}
          {/* <div
            ref={gradientRef}
            className="absolute inset-0"
            style={{ 
              willChange: "auto", 
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
            }}
          >
            <HeroBlueGradient1 progress={scrollProgress} isMobile={isMobile} />
          </div> */}

          {/* Background - Mobile background image */}
          <div ref={gradientRef} className="absolute inset-0 overflow-hidden">
            {/* Mobile background image - decorative */}
            <Image
              src={ASSETS.heroMobileBg}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center pointer-events-none"
              priority
            />
          </div>

          {/* Content Container */}
          <div
            ref={contentRef}
            className="relative z-10 flex flex-col px-5 sm:px-6"
            style={{ willChange: "transform, opacity", paddingTop: "20vh" }}
          >
            <div className="flex flex-col">
              {/* Left Content */}
              <div className="flex flex-col">
                {/* Headline */}
                <h1
                  ref={headlineRef}
                  className="hero-headline hero-headline-size"
                  style={{ perspective: "1000px" }}
                >
                  <span className="block">India’s Real AC </span>
                  {/* <span className="block text-[36px] leading-[36px]">
                    Compromise ends here.
                  </span> */}
                </h1>

                {/* Badges Row */}
                <div ref={badgesRef} className="flex items-center gap-3 mt-6">
                  {/* Cooling Badge */}
                  <div className="flex items-center gap-2 py-2">
                    <Image
                      src={ASSETS.thermometerBadge}
                      alt="Proven Cooling at 50°C"
                      width={36}
                      height={36}
                      className="w-9 h-9 flex-shrink-0"
                      priority
                    />
                    <div className="flex flex-col justify-center">
                      <span className="hero-badge-title text-optimist-cream leading-[1.3]">
                        No Bullshit.
                      </span>
                      <span className="hero-badge-title text-optimist-cream leading-[1.3]">
                        Real Cooling at 50°C
                      </span>
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className="h-9 w-px bg-white/20 flex-shrink-0" />

                  {/* ISEER Badge */}
                  <div className="flex items-center gap-2 py-2">
                    <Image
                      src={ASSETS.iseer5StarBadge}
                      alt="India's #1 Rated Energy Efficient AC"
                      width={44}
                      height={36}
                      className="w-10 h-9 object-contain flex-shrink-0"
                      priority
                    />
                    <div className="flex flex-col justify-center">
                      <span className="hero-badge-title text-optimist-cream leading-[1.3]">
                        India's #1 Rated
                      </span>
                      <span className="hero-badge-title text-optimist-cream leading-[1.3]">
                        Energy Efficient AC
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons - Mobile */}
                <div
                  ref={mobileButtonsRef}
                  className="flex items-center gap-3 mt-8"
                >
                  {/* <button
                    onClick={() => scrollToSection("benefits")}
                    className="btn-why-optimist hero-btn-mobile flex-1 text-optimist-cream flex items-center justify-center"
                  >
                    Why Optimist ?
                  </button> */}
                  <button
                    onClick={openModal}
                    className="btn-buy-now-hero  hero-btn-mobile min-w-[150px] text-[#1265FF] flex items-center justify-center"
                  >
                    Join the Waitlist
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AC Image Container - Mobile: Half inside hero, half outside */}
          <div
            className="absolute left-0 right-0 flex justify-center pointer-events-none"
            style={{
              bottom: 0,
              transform: "translateY(50%)",
              zIndex: 30,
            }}
          >
            <HeroACImage isMobile={isMobile} />
          </div>
        </>
      )}

      {/* DESKTOP LAYOUT - Normal section matching Figma design */}
      {/* Render desktop layout on server (default) and when mounted and not mobile */}
      {(!isMounted || !isMobile) && (
        <div
          ref={parallaxContainerRef}
          className="relative w-full h-full flex flex-col"
          style={{ overflow: "visible" }}
        >
          {/* Background - Desktop background image - clipped to section bounds */}
          <div
            ref={gradientRef}
            className="absolute inset-0 overflow-hidden"
            style={{ borderRadius: "0 0 0 0" }}
          >
            {/* Desktop background image - decorative */}
            <Image
              src={ASSETS.heroDesktopBg}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center pointer-events-none"
              priority
            />
            {/* Leaves video overlay - subtle effect */}
            <video
              ref={leafVideoRef1}
              src="/animations/small-vecteezy_summer-concept-the-motion-of-leaves-sunlight-natural-shadow_29616214_small.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute pointer-events-none"
              style={{
                top: "50%",
                left: "50%",
                width: "150%",
                height: "150%",
                objectFit: "cover",
                objectPosition: "center",
                transform: "translate(-50%, -50%) rotate(180deg)",
                opacity: 0.18,
                mixBlendMode: "multiply",
              }}
            />
          </div>

          {/* Parallax content wrapper for mouse movement effect */}
          <div
            ref={parallaxContentRef}
            className="relative z-10 w-full h-full will-change-transform"
          >
            {/* Content Container - centered with max-width */}
            <div
              ref={contentRef}
              className="flex flex-col justify-start w-full max-w-[1360px] mx-auto px-10 lg:px-16"
              style={{ paddingTop: "24vh" }}
            >
              {/* Top Row: Headline+Badges on Left, Buttons on Right */}
              <div className="flex flex-row justify-between items-start w-full">
                {/* Left Content */}
                <div className="flex flex-col gap-4">
                  {/* Headline */}
                  <h1
                    ref={headlineRef}
                    className="hero-headline hero-headline-size"
                    style={{ perspective: "1000px" }}
                  >
                    <span className="block">India’s Real AC</span>
                    {/* <span className="block  text-[54px] mt-1 leading-[54px] font-[600]">
                      Compromise ends here.
                    </span> */}
                  </h1>

                  {/* Badges Row */}
                  <div ref={badgesRef} className="flex items-center gap-6 mt-6">
                    {/* Cooling Badge */}
                    <div className="flex items-center gap-1 py-4">
                      <Image
                        src={ASSETS.thermometerBadge}
                        alt="Proven Cooling at 50°C"
                        width={44}
                        height={44}
                        className="w-11 h-11"
                        priority
                      />
                      <div className="flex flex-col">
                        <span className="hero-badge-title text-optimist-cream leading-[1.2] text-[20px]">
                          No Bullshit.
                        </span>
                        <span className="hero-badge-title text-optimist-cream leading-[1.2] text-[20px]">
                          Real Cooling at 50°C
                        </span>
                      </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="h-11 w-px bg-white/20" />

                    {/* ISEER Badge */}
                    <div className="flex items-center gap-1 py-3">
                      <Image
                        src={ASSETS.iseer5StarBadge}
                        alt="India's #1 Rated Energy Efficient AC"
                        width={56}
                        height={44}
                        className="w-14 h-11 object-contain"
                        priority
                      />
                      <div className="flex flex-col">
                        <span className="hero-badge-title text-optimist-cream leading-[1.2] text-[20px]">
                          India's #1 Rated Energy
                        </span>
                        <span className="hero-badge-title text-optimist-cream leading-[1.2] text-[20px]">
                          Efficient AC. Try Us!
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Content - Desktop CTA Buttons */}
                <div ref={buttonsRef} className="flex items-center gap-4 mt-20">
                  {/* <button
                    onClick={() => scrollToSection("benefits")}
                    className="btn-why-optimist hero-btn-desktop text-optimist-cream flex items-center justify-center"
                  >
                    Why Optimist ?
                  </button> */}
                  <button
                    onClick={openModal}
                    className="btn-buy-now-hero hero-btn-desktop text-[#1265FF] flex items-center justify-center"
                  >
                    Join the Waitlist
                  </button>
                </div>
              </div>
            </div>

            {/* AC Image Container - Desktop: Half inside hero, half outside */}
            {/* Outer div handles positioning, inner div handles GSAP animation */}
            <div
              className="absolute left-0 right-0 flex justify-center pointer-events-none"
              style={{
                bottom: 0,
                transform: "translateY(65%)",
                zIndex: 30,
              }}
            >
              <div ref={imageRef}>
                <HeroACImage isMobile={false} />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
