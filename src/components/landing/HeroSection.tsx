"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  Center,
  PerspectiveCamera,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import { HeroBlueGradient } from "@/components/landing/HeroBlueGradient";
import { useScrollVelocity } from "@/hooks/useScrollVelocity";

const MODEL_PATH = "/HomePageAnimation02.glb";

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

  // Keep camera looking at center - throttle to every 3rd frame for performance
  const frameCount = useRef(0);
  useFrame(() => {
    frameCount.current++;
    if (frameCount.current % 3 === 0 && cameraRef.current) {
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
function SceneContent() {
  const [modelLoaded, setModelLoaded] = useState(false);
  const { gl } = useThree();
  const isFastScrolling = useScrollVelocity({ threshold: 1200 });

  // Set a fixed DPR for consistent performance
  useEffect(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    gl.setPixelRatio(dpr);
  }, [gl]);

  const handleModelLoaded = useRef(() => {
    // Small delay to ensure everything is rendered
    setTimeout(() => {
      setModelLoaded(true);
    }, 100);
  }).current;

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
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      // Ensures the rendering doesn't clip when camera is very close
      camera={{ near: 0.01, far: 1000 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      frameloop="always"
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
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
      if (!sectionRef.current || !gradientRef.current) return;

      // Skip pinning on mobile - it breaks scrolling
      if (isMobile) return;

      // Create ScrollTrigger for pinning and gradient shrink - DESKTOP ONLY
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=100%", // Pin for 100% of viewport height
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

      // Animate content slightly during scroll
      gsap.to(contentRef.current, {
        scale: 0.98,
        opacity: 0.95,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=100%",
          scrub: 1,
        },
      });
    },
    { scope: sectionRef, dependencies: [isMobile] }
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
      className={`hero-section relative flex flex-col overflow-x-hidden ${
        isMobile ? "min-h-screen" : "h-screen overflow-hidden"
      }`}
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      {/* Blue Gradient Background - passes scroll progress for shrink animation */}
      <div
        ref={gradientRef}
        className="absolute inset-0"
        style={{ willChange: "transform", transformStyle: "preserve-3d" }}
      >
        <HeroBlueGradient progress={scrollProgress} />
      </div>

      {/* Content Container */}
      <div
        ref={contentRef}
        className="relative z-10 flex-1 flex flex-col px-4 md:px-8 lg:px-16 xl:px-24 pt-24 md:pt-28 lg:pt-32"
        style={{ willChange: "transform, opacity" }}
      >
        {/* Desktop Layout: flex row with content left and buttons right */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start max-w-[1400px] mx-auto w-full">
          {/* Left Content */}
          <div className="flex flex-col">
            {/* Headline */}
            <h1
              ref={headlineRef}
              className="hero-headline hero-headline-size italic"
              style={{ perspective: "1000px" }}
            >
              <span className="block">More Chill.</span>
              <span className="block">Lower Bill.</span>
            </h1>

            {/* Badges Row */}
            <div
              ref={badgesRef}
              className="flex items-center gap-4 md:gap-6 mt-6 md:mt-8"
            >
              {/* ISEER Badge */}
              <div className="flex items-center gap-2 md:gap-3">
                <Image
                  src="/5StarRating.png"
                  alt="5 Star ISEER Rating"
                  width={56}
                  height={56}
                  className="w-12 h-12 md:w-16 md:h-16"
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

              {/* Divider */}
              <div className="w-px h-8 md:h-10 bg-optimist-border-light" />

              {/* Rating Badge */}
              <div className="flex items-center gap-2 md:gap-3">
                <Image
                  src="/GoldenStar.png"
                  alt="Golden Star Rating"
                  width={32}
                  height={32}
                  className="w-6 h-6 md:w-8 md:h-8"
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

            {/* CTA Buttons - Mobile (full width, side by side) */}
            <div
              ref={mobileButtonsRef}
              className="flex items-center gap-3 mt-8 lg:hidden"
            >
              <Link
                href="#why-optimist"
                className="btn-why-optimist hero-btn-mobile flex-1 text-optimist-cream flex items-center justify-center"
              >
                Why Optimist ?
              </Link>
              <Link
                href="/products"
                className="btn-buy-now hero-btn-mobile flex-1 text-optimist-cream flex items-center justify-center"
              >
                Buy Now
              </Link>
            </div>
          </div>

          {/* Right Content - Desktop CTA Buttons */}
          <div
            ref={buttonsRef}
            className="hidden lg:flex items-center gap-4 lg:mt-6 xl:mt-8"
          >
            <Link
              href="#why-optimist"
              className="btn-why-optimist hero-btn-desktop text-optimist-cream flex items-center justify-center"
            >
              Why Optimist ?
            </Link>
            <Link
              href="/products"
              className="btn-buy-now hero-btn-desktop text-optimist-cream flex items-center justify-center"
            >
              Buy Now
            </Link>
          </div>
        </div>

        {/* AC 3D Animation */}
        <div
          ref={imageRef}
          className="flex-1 flex items-end justify-center mt-auto pb-0 md:pb-8"
          style={{ willChange: "transform, opacity" }}
        >
          <div className="w-full h-[480px] md:h-[500px] lg:h-[650px] xl:h-[750px] max-w-6xl lg:max-w-7xl xl:max-w-[1400px] mx-auto">
            <HeroACCanvas />
          </div>
        </div>
      </div>
    </section>
  );
}

// Preload the GLB model for better performance
useGLTF.preload(MODEL_PATH);
