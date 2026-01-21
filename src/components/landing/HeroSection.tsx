"use client";

import { useScrollVelocity } from "@/hooks/useScrollVelocity";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import {
  Center,
  ContactShadows,
  Environment,
  PerspectiveCamera,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Image from "next/image";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import HeroBlueGradient1 from "./HeroBlueGradient1";
import { motion } from "framer-motion";
import { useWaitlist } from "@/contexts/WaitlistContext";
import { ASSETS } from "@/lib/assets";
const MODEL_PATH = "/HomePageAnimation02.glb";

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

// Helper function to check if mobile view
const isMobileView = (width: number) => width < 768;

// Check if device is mobile (for disabling pinning)
const isMobileDevice = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
};

// 3D AC Model Component
function ACModel({ onLoaded }: { onLoaded: () => void }) {
  const { scene } = useGLTF(MODEL_PATH);

  useEffect(() => {
    // Signal that model is loaded
    onLoaded();
  }, [onLoaded]);

  return <primitive object={scene} scale={1} />;
}

// Responsive Camera with zoom-out animation
function ResponsiveCamera({ startAnimation }: { startAnimation: boolean }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
  const hasAnimated = useRef(false);
  const { size } = useThree();

  // Set initial camera position immediately (very close - inside the AC)
  useEffect(() => {
    if (cameraRef.current && !hasAnimated.current) {
      cameraRef.current.position.set(0, 0, 0.05);
      cameraRef.current.lookAt(0, 0, 0);
    }
  }, []);

  // Run animation only once when startAnimation becomes true
  useEffect(() => {
    if (!cameraRef.current || !startAnimation || hasAnimated.current) return;

    hasAnimated.current = true;
    const isMobile = size.width < 768;

    /**
     * ADJUST THESE FOR SIZE:
     * Lower numbers = AC looks BIGGER
     * Higher numbers = AC looks SMALLER
     */
    const finalZ = isMobile ? 2.4 : 1.4;

    // Animation: Zooming out to the "Big" view with a bounce
    gsap.to(cameraRef.current.position, {
      z: finalZ,
      duration: 2.5,
      delay: 0.1,
      ease: "power2.out", // Smoother ease for the "Big" view
      onUpdate: () => {
        if (cameraRef.current) {
          cameraRef.current.lookAt(0, 0, 0);
        }
      },
    });
  }, [startAnimation, size.width]);

  // Keep camera looking at center
  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <PerspectiveCamera
      makeDefault
      ref={cameraRef}
      position={[0, 0, 0.05]}
      fov={isMobileView(size.width) ? 45 : 35}
    />
  );
}

// Scene content component to handle animation state
function SceneContent({ onReady }: { onReady?: () => void }) {
  const [modelLoaded, setModelLoaded] = useState(false);
  const { gl } = useThree();
  const isFastScrolling = useScrollVelocity({ threshold: 1200 });

  // Set a fixed DPR for consistent performance
  useEffect(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    gl.setPixelRatio(dpr);
  }, [gl]);

  const handleModelLoaded = useCallback(() => {
    // Small delay to ensure everything is rendered
    setTimeout(() => {
      setModelLoaded(true);
      if (onReady) onReady();
    }, 100);
  }, [onReady]);

  // Pause rendering during fast scrolling to save resources
  useFrame(() => {
    if (isFastScrolling) {
      return false; // Skip this frame
    }
  });

  return (
    <>
      <ResponsiveCamera startAnimation={modelLoaded} />

      {/* Lighting optimized to show the AC's details clearly */}
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} />
      <Environment preset="city" />

      {/* Center is vital because the GLB has internal offsets */}
      <Center top>
        <ACModel onLoaded={handleModelLoaded} />
      </Center>

      <ContactShadows
        position={[0, -0.5, 0]}
        opacity={0.4}
        scale={15}
        blur={2}
        far={3}
        frames={1}
        resolution={512}
      />
    </>
  );
}

// 3D Canvas wrapper component
function HeroACCanvas() {
  const [isReady, setIsReady] = useState(false);
  const handleSceneReady = useCallback(() => setIsReady(true), []);

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      // Ensures the rendering doesn't clip when camera is very close
      camera={{ near: 0.01, far: 1000 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent", marginTop: "80px" }}
      className={`transition-opacity duration-1000 ease-out ${isReady ? "opacity-100" : "opacity-0"}`}
      frameloop="always"
    >
      <Suspense fallback={null}>
        <SceneContent onReady={handleSceneReady} />
      </Suspense>
    </Canvas>
  );
}

// Static image fallback for mobile (88MB GLB is too heavy for mobile)
function HeroACImage({ isMobile }: { isMobile: boolean }) {
  return (
    <div className="relative flex items-end justify-center">
      <motion.img
        src={ASSETS.heroAc}
        alt="Optimist AC"
        className="object-contain h-auto"
        style={{ 
          width: isMobile ? "95%" : "auto",
          maxWidth: isMobile ? undefined : "800px",
          maxHeight: isMobile ? undefined : "320px",
        }}
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
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
  const cardRef = useRef<HTMLDivElement>(null);
  const { openModal } = useWaitlist();

  // Use ref instead of state to avoid re-renders on every scroll
  const scrollProgressRef = useRef(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Setup pinned scroll animation for gradient shrink - DESKTOP ONLY
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // Skip all scroll animations on mobile - use immediate check, not state
      if (isMobileDevice()) return;

      // Create ScrollTrigger for pinning - DESKTOP ONLY
      // Extended scroll distance for multi-phase animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=150%", // Extended for multi-phase animation
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 1,
        onUpdate: (self) => {
          // Update ref immediately for gradient animation
          scrollProgressRef.current = self.progress;
          // Throttle state updates to reduce re-renders
          if (Math.abs(self.progress - scrollProgress) > 0.02) {
            setScrollProgress(self.progress);
          }
        },
      });

      // Phase 1 (0-60%): Content fades out
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          opacity: 0,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=60%",
            scrub: 1,
          },
        });
      }

      // Phase 1-2 (20-80%): Gradient fades out as bars shrink
      if (gradientRef.current) {
        gsap.to(gradientRef.current, {
          opacity: 0,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top+=20% top",
            end: "+=60%",
            scrub: 1,
          },
        });
      }

      // Phase 2 (40-90%): Card fades out and scales down
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          opacity: 0,
          scale: 0.95,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top+=40% top",
            end: "+=50%",
            scrub: 1,
          },
        });
      }

      // Phase 2-3 (30-100%): AC image moves up smoothly
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          y: -300, // Move up significantly
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top+=30% top",
            end: "+=120%",
            scrub: 1,
          },
        });
      }
    },
    { scope: sectionRef }
  );

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
        { opacity: 1, y: 0, rotateX: 0, stagger: 0.15, duration: 1 }
      )
        // Badges fade in
        .fromTo(
          badgesRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5"
        )
        // Desktop buttons
        .fromTo(
          buttonsRef.current?.children || [],
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, stagger: 0.1, duration: 0.6 },
          "-=0.4"
        )
        // Mobile buttons
        .fromTo(
          mobileButtonsRef.current?.children || [],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.6 },
          "-=0.6"
        )
        // AC Image with scale effect
        .fromTo(
          imageRef.current,
          { opacity: 0, y: 80, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power2.out" },
          "-=0.8"
        );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={`hero-section relative flex flex-col overflow-x-hidden bg-black ${isMobile ? "" : "overflow-hidden h-screen"
        }`}
      style={{ 
        height: isMobile ? '85vh' : undefined,
        perspective: "1000px",
        WebkitPerspective: "1000px",
        transformStyle: "preserve-3d",
        WebkitTransformStyle: "preserve-3d",
      }}
    >
      {/* MOBILE LAYOUT - unchanged */}
      {isMobile && (
        <>
          {/* Blue Gradient Background - static radial glow on mobile */}
          <div
            ref={gradientRef}
            className="absolute inset-0"
            style={{ 
              willChange: "auto", 
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
            }}
          >
            <HeroBlueGradient1 progress={scrollProgress} isMobile={isMobile} />
          </div>

          {/* Content Container */}
          <div
            ref={contentRef}
            className="relative z-10 flex-1 flex flex-col px-4"
            style={{ willChange: "transform, opacity" }}
          >
            <div 
              className="flex flex-col"
              style={{ paddingTop: '15vh' }}
            >
              {/* Left Content */}
              <div className="flex flex-col gap-4">
                {/* Headline */}
                <h1
                  ref={headlineRef}
                  className="hero-headline hero-headline-size italic"
                  style={{ perspective: "1000px" }}
                >
                  <span className="block">Best Cooling. </span>
                  <span className="block">Lowest Bills.</span>
                </h1>

                {/* Badges Row */}
                <div
                  ref={badgesRef}
                  className="flex items-center gap-4 mt-6"
                >
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

                  {/* Rating Badge */}
                  <div className="flex items-center gap-2">
                    <Image
                      src={ASSETS.goldenStar}
                      alt="Golden Star Rating"
                      width={32}
                      height={32}
                      className="w-6 h-6"
                    />
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
                    onClick={() => scrollToSection('benefits')}
                    className="btn-why-optimist hero-btn-mobile flex-1 text-optimist-cream flex items-center justify-center"
                  >
                    Why Optimist ?
                  </button>
                  <button
                    onClick={openModal}
                    className="btn-buy-now hero-btn-mobile flex-1 text-optimist-cream flex items-center justify-center"
                  >
                    Join the Waitlist
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AC Image - Mobile */}
          <div 
            className="absolute left-0 right-0 z-20"
            style={{
              top: '70vh',
              transform: 'translateY(-50%)',
            }}
          >
            <HeroACImage isMobile={isMobile} />
          </div>
        </>
      )}

      {/* DESKTOP LAYOUT - new card-based design */}
      {!isMobile && (
        <div className="relative w-full h-full flex flex-col items-center">
          {/* Desktop Card Container */}
          <div 
            ref={cardRef}
            className="relative w-full max-w-[1360px] mx-4 lg:mx-10 mt-[120px]"
            style={{
              height: '560px',
              borderRadius: '24px',
              boxShadow: '0px 145px 120px 4px rgba(52,120,246,0.12), 0px 35px 120px 0px rgba(52,120,246,0.2)',
              overflow: 'hidden',
            }}
          >
            {/* Blue Gradient Background inside card */}
            <div
              ref={gradientRef}
              className="absolute inset-0"
              style={{ 
                willChange: "transform", 
                transformStyle: "preserve-3d",
                WebkitTransformStyle: "preserve-3d",
              }}
            >
              <HeroBlueGradient1 progress={scrollProgress} isMobile={false} />
            </div>

            {/* Content Container inside card */}
            <div
              ref={contentRef}
              className="relative z-10 h-full flex flex-col justify-center px-8 lg:px-10"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="flex flex-row justify-between items-start w-full">
                {/* Left Content */}
                <div className="flex flex-col gap-4">
                  {/* Headline */}
                  <h1
                    ref={headlineRef}
                    className="hero-headline hero-headline-size italic"
                    style={{ perspective: "1000px" }}
                  >
                    <span className="block">Best Cooling. </span>
                    <span className="block">Lowest Bills.</span>
                  </h1>

                  {/* Badges Row */}
                  <div
                    ref={badgesRef}
                    className="flex items-center gap-6 mt-8"
                  >
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
                      <Image
                        src={ASSETS.goldenStar}
                        alt="Golden Star Rating"
                        width={44}
                        height={44}
                        className="w-11 h-11"
                      />
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
                <div
                  ref={buttonsRef}
                  className="flex items-center gap-6 mt-6"
                >
                  <button
                    onClick={() => scrollToSection('benefits')}
                    className="btn-why-optimist hero-btn-desktop text-optimist-cream flex items-center justify-center"
                  >
                    Why Optimist ?
                  </button>
                  <button
                    onClick={openModal}
                    className="btn-buy-now hero-btn-desktop text-optimist-cream flex items-center justify-center"
                  >
                    Join the Waitlist
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AC Image - Desktop: positioned half inside card, half outside */}
          {/* AC center should align with card bottom edge */}
          {/* Smaller negative margin = AC positioned lower = more in black section */}
          <div 
            ref={imageRef}
            className="relative z-20 flex justify-center w-full"
            style={{
              // Negative margin to pull AC up - smaller value = lower position
              marginTop: '-160px',
              willChange: 'transform',
            }}
          >
            <HeroACImage isMobile={false} />
          </div>
        </div>
      )}
    </section>
  );
}

// Preload the GLB model for better performance
useGLTF.preload(MODEL_PATH);
