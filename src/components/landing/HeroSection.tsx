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
    <div className="relative flex items-end justify-center w-full">
      <motion.img
        src={isMobile ? ASSETS.acHeroMobile : ASSETS.acHeroDesktop}
        alt="Optimist AC"
        className="object-contain"
        style={{
          width: isMobile ? "90%" : "clamp(680px, 60vw, 1000px)",
          maxWidth: isMobile ? "400px" : "1050px",
          height: "auto",
        }}
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
      />
    </div>
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
            {/* Mobile background image */}
            <img
              src={ASSETS.heroMobileBg}
              alt=""
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>

          {/* Content Container */}
          <div
            ref={contentRef}
            className="relative z-10 flex flex-col px-6"
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
                  <span className="block">The Real AC </span>
                  <span className="block text-[36px] leading-[36px]">
                    Compromise ends here.
                  </span>
                </h1>

                {/* Badges Row */}
                <div ref={badgesRef} className="flex items-center gap-3 mt-6">
                  {/* ISEER Badge */}
                  <div className="flex items-center gap-2">
                    <Image
                      src={ASSETS.fiveStarRating}
                      alt="5 Star ISEER Rating"
                      width={56}
                      height={56}
                      className="w-12 h-12"
                    />
                    <div className="flex flex-col">
                      <span className="hero-badge-title text-optimist-cream">
                        Highest ISEER
                      </span>
                      <span className="hero-badge-subtitle text-optimist-cream-muted">
                        In India
                      </span>
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className="h-8 w-px bg-white/20" />

                  {/* Rating Badge */}
                  <div className="flex items-center gap-2">
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 21 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.4588 9.26612L16.24 12.9064L17.5253 18.3505C17.5962 18.646 17.578 18.9559 17.4729 19.2411C17.3677 19.5263 17.1804 19.7739 16.9346 19.9526C16.6889 20.1314 16.3956 20.2333 16.0919 20.2455C15.7883 20.2577 15.4878 20.1796 15.2285 20.0211L10.4941 17.1074L5.7569 20.0211C5.49761 20.1787 5.19749 20.256 4.89434 20.2434C4.59118 20.2308 4.29854 20.1287 4.05327 19.9501C3.808 19.7715 3.62106 19.5243 3.51599 19.2396C3.41093 18.955 3.39243 18.6456 3.46283 18.3505L4.75283 12.9064L0.534082 9.26612C0.304674 9.06785 0.138762 8.80639 0.0570658 8.51438C-0.0246303 8.22238 -0.0184894 7.91278 0.0747213 7.62425C0.167932 7.33571 0.344082 7.08103 0.581172 6.89202C0.818262 6.703 1.10578 6.58802 1.40783 6.56143L6.93908 6.11518L9.07283 0.951432C9.18833 0.670011 9.3849 0.42929 9.63755 0.259874C9.89021 0.0904583 10.1875 0 10.4917 0C10.7959 0 11.0933 0.0904583 11.3459 0.259874C11.5986 0.42929 11.7951 0.670011 11.9106 0.951432L14.0435 6.11518L19.5747 6.56143C19.8774 6.58703 20.1657 6.70137 20.4037 6.89013C20.6416 7.07888 20.8186 7.33366 20.9124 7.62255C21.0062 7.91143 21.0126 8.22157 20.9309 8.5141C20.8492 8.80664 20.683 9.06856 20.4531 9.26706L20.4588 9.26612Z"
                        fill="#F8D300"
                      />
                    </svg>

                    <div className="flex flex-col">
                      <span className="hero-badge-title text-optimist-cream">
                        4.8 rated
                      </span>
                      <span className="hero-badge-subtitle text-optimist-cream-muted">
                        by early users
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons - Mobile */}
                <div
                  ref={mobileButtonsRef}
                  className="flex items-center gap-3 mt-8"
                >
                  <button
                    onClick={() => scrollToSection("benefits")}
                    className="btn-why-optimist hero-btn-mobile flex-1 text-optimist-cream flex items-center justify-center"
                  >
                    Why Optimist ?
                  </button>
                  <button
                    onClick={openModal}
                    className="btn-buy-now-hero hero-btn-mobile flex-1 text-[#1265FF] flex items-center justify-center"
                  >
                    Buy Now
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
            {/* Desktop background image */}
            <img
              src={ASSETS.heroDesktopBg}
              alt=""
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
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
                    <span className="block">The Real AC </span>
                    <span className="block  text-[54px] mt-1 leading-[54px] font-[600]">
                      Compromise ends here.
                    </span>
                  </h1>

                  {/* Badges Row */}
                  <div ref={badgesRef} className="flex items-center gap-6 mt-6">
                    {/* ISEER Badge */}
                    <div className="flex items-center gap-3">
                      <Image
                        src={ASSETS.fiveStarRating}
                        alt="5 Star ISEER Rating"
                        width={56}
                        height={56}
                        className="w-14 h-14"
                      />
                      <div className="flex flex-col">
                        <span className="hero-badge-title text-optimist-cream">
                          Highest ISEER
                        </span>
                        <span className="hero-badge-subtitle text-optimist-cream-muted">
                          In India
                        </span>
                      </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="h-11 w-px bg-white/20" />

                    {/* Rating Badge */}
                    <div className="flex items-center gap-3">
                      <svg
                        width="21"
                        height="21"
                        viewBox="0 0 21 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.4588 9.26612L16.24 12.9064L17.5253 18.3505C17.5962 18.646 17.578 18.9559 17.4729 19.2411C17.3677 19.5263 17.1804 19.7739 16.9346 19.9526C16.6889 20.1314 16.3956 20.2333 16.0919 20.2455C15.7883 20.2577 15.4878 20.1796 15.2285 20.0211L10.4941 17.1074L5.7569 20.0211C5.49761 20.1787 5.19749 20.256 4.89434 20.2434C4.59118 20.2308 4.29854 20.1287 4.05327 19.9501C3.808 19.7715 3.62106 19.5243 3.51599 19.2396C3.41093 18.955 3.39243 18.6456 3.46283 18.3505L4.75283 12.9064L0.534082 9.26612C0.304674 9.06785 0.138762 8.80639 0.0570658 8.51438C-0.0246303 8.22238 -0.0184894 7.91278 0.0747213 7.62425C0.167932 7.33571 0.344082 7.08103 0.581172 6.89202C0.818262 6.703 1.10578 6.58802 1.40783 6.56143L6.93908 6.11518L9.07283 0.951432C9.18833 0.670011 9.3849 0.42929 9.63755 0.259874C9.89021 0.0904583 10.1875 0 10.4917 0C10.7959 0 11.0933 0.0904583 11.3459 0.259874C11.5986 0.42929 11.7951 0.670011 11.9106 0.951432L14.0435 6.11518L19.5747 6.56143C19.8774 6.58703 20.1657 6.70137 20.4037 6.89013C20.6416 7.07888 20.8186 7.33366 20.9124 7.62255C21.0062 7.91143 21.0126 8.22157 20.9309 8.5141C20.8492 8.80664 20.683 9.06856 20.4531 9.26706L20.4588 9.26612Z"
                          fill="#F8D300"
                        />
                      </svg>

                      <div className="flex flex-col">
                        <span className="hero-badge-title text-optimist-cream">
                          4.8 rated
                        </span>
                        <span className="hero-badge-subtitle text-optimist-cream-muted">
                          by early users
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Content - Desktop CTA Buttons */}
                <div ref={buttonsRef} className="flex items-center gap-4 mt-20">
                  <button
                    onClick={() => scrollToSection("benefits")}
                    className="btn-why-optimist hero-btn-desktop text-optimist-cream flex items-center justify-center"
                  >
                    Why Optimist ?
                  </button>
                  <button
                    onClick={openModal}
                    className="btn-buy-now-hero hero-btn-desktop text-[#1265FF] flex items-center justify-center"
                  >
                    Buy Now
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
