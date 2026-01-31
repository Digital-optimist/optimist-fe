"use client";

// COMMENTED OUT: Scroll animation imports - no longer needed for normal section
// import { useScrollVelocity } from "@/hooks/useScrollVelocity";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
// COMMENTED OUT: 3D model imports - not used in simplified version
// import {
//   Center,
//   ContactShadows,
//   Environment,
//   PerspectiveCamera,
//   useGLTF,
// } from "@react-three/drei";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// Blue gradient component - still used for mobile
import HeroBlueGradient1 from "./HeroBlueGradient1";
import { motion } from "framer-motion";
import { useWaitlist } from "@/contexts/WaitlistContext";
import { ASSETS } from "@/lib/assets";
// const MODEL_PATH = "/HomePageAnimation02.glb";

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

// COMMENTED OUT: Helper function to check if mobile view - no longer used
// const isMobileView = (width: number) => width < 768;

// COMMENTED OUT: Mobile device check - no longer needed without scroll pinning
// const isMobileDevice = () => {
//   if (typeof window === "undefined") return false;
//   return window.innerWidth < 768;
// };

// COMMENTED OUT: 3D AC Model Component - not used in simplified version
// function ACModel({ onLoaded }: { onLoaded: () => void }) {
//   const { scene } = useGLTF(MODEL_PATH);
//
//   useEffect(() => {
//     // Signal that model is loaded
//     onLoaded();
//   }, [onLoaded]);
//
//   return <primitive object={scene} scale={1} />;
// }

// COMMENTED OUT: Responsive Camera with zoom-out animation
// function ResponsiveCamera({ startAnimation }: { startAnimation: boolean }) {
//   const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
//   const hasAnimated = useRef(false);
//   const { size } = useThree();
//
//   useEffect(() => {
//     if (cameraRef.current && !hasAnimated.current) {
//       cameraRef.current.position.set(0, 0, 0.05);
//       cameraRef.current.lookAt(0, 0, 0);
//     }
//   }, []);
//
//   useEffect(() => {
//     if (!cameraRef.current || !startAnimation || hasAnimated.current) return;
//     hasAnimated.current = true;
//     const isMobile = size.width < 768;
//     const finalZ = isMobile ? 2.4 : 1.4;
//     gsap.to(cameraRef.current.position, {
//       z: finalZ,
//       duration: 2.5,
//       delay: 0.1,
//       ease: "power2.out",
//       onUpdate: () => {
//         if (cameraRef.current) {
//           cameraRef.current.lookAt(0, 0, 0);
//         }
//       },
//     });
//   }, [startAnimation, size.width]);
//
//   useFrame(() => {
//     if (cameraRef.current) {
//       cameraRef.current.lookAt(0, 0, 0);
//     }
//   });
//
//   return (
//     <PerspectiveCamera
//       makeDefault
//       ref={cameraRef}
//       position={[0, 0, 0.05]}
//       fov={isMobileView(size.width) ? 45 : 35}
//     />
//   );
// }

// COMMENTED OUT: Scene content component
// function SceneContent({ onReady }: { onReady?: () => void }) {
//   const [modelLoaded, setModelLoaded] = useState(false);
//   const { gl } = useThree();
//   const isFastScrolling = useScrollVelocity({ threshold: 1200 });
//
//   useEffect(() => {
//     const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
//     gl.setPixelRatio(dpr);
//   }, [gl]);
//
//   const handleModelLoaded = useCallback(() => {
//     setTimeout(() => {
//       setModelLoaded(true);
//       if (onReady) onReady();
//     }, 100);
//   }, [onReady]);
//
//   useFrame(() => {
//     if (isFastScrolling) {
//       return false;
//     }
//   });
//
//   return (
//     <>
//       <ResponsiveCamera startAnimation={modelLoaded} />
//       <ambientLight intensity={1} />
//       <directionalLight position={[5, 5, 5]} intensity={1.4} />
//       <Environment preset="city" />
//       <Center top>
//         <ACModel onLoaded={handleModelLoaded} />
//       </Center>
//       <ContactShadows
//         position={[0, -0.5, 0]}
//         opacity={0.4}
//         scale={15}
//         blur={2}
//         far={3}
//         frames={1}
//         resolution={512}
//       />
//     </>
//   );
// }

// COMMENTED OUT: 3D Canvas wrapper component
// function HeroACCanvas() {
//   const [isReady, setIsReady] = useState(false);
//   const handleSceneReady = useCallback(() => setIsReady(true), []);
//
//   return (
//     <Canvas
//       shadows
//       dpr={[1, 1.5]}
//       camera={{ near: 0.01, far: 1000 }}
//       gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
//       style={{ background: "transparent", marginTop: "80px" }}
//       className={`transition-opacity duration-1000 ease-out ${isReady ? "opacity-100" : "opacity-0"}`}
//       frameloop="always"
//     >
//       <Suspense fallback={null}>
//         <SceneContent onReady={handleSceneReady} />
//       </Suspense>
//     </Canvas>
//   );
// }

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
  const parallaxContainerRef = useRef<HTMLDivElement>(null);
  const parallaxContentRef = useRef<HTMLDivElement>(null);
  // const cardRef = useRef<HTMLDivElement>(null); // COMMENTED OUT: Not needed without card design
  const { openModal } = useWaitlist();

  // COMMENTED OUT: Scroll progress tracking - not needed for desktop normal section
  // const scrollProgressRef = useRef(0);
  // Kept for mobile gradient (still uses scroll progress)
  const scrollProgress = 0; // Static value for mobile gradient since no scroll animation
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

  // COMMENTED OUT: Scroll animation for gradient shrink - DESKTOP ONLY
  // useGSAP(
  //   () => {
  //     if (!sectionRef.current) return;
  //     if (isMobileDevice()) return;
  //
  //     ScrollTrigger.create({
  //       trigger: sectionRef.current,
  //       start: "top top",
  //       end: "+=150%",
  //       pin: true,
  //       pinSpacing: true,
  //       anticipatePin: 1,
  //       scrub: 1,
  //       onUpdate: (self) => {
  //         scrollProgressRef.current = self.progress;
  //         if (Math.abs(self.progress - scrollProgress) > 0.02) {
  //           setScrollProgress(self.progress);
  //         }
  //       },
  //     });
  //
  //     if (contentRef.current) {
  //       gsap.to(contentRef.current, {
  //         opacity: 0,
  //         ease: "power2.inOut",
  //         scrollTrigger: {
  //           trigger: sectionRef.current,
  //           start: "top top",
  //           end: "+=60%",
  //           scrub: 1,
  //         },
  //       });
  //     }
  //
  //     if (gradientRef.current) {
  //       gsap.to(gradientRef.current, {
  //         opacity: 0,
  //         ease: "power2.inOut",
  //         scrollTrigger: {
  //           trigger: sectionRef.current,
  //           start: "top+=20% top",
  //           end: "+=60%",
  //           scrub: 1,
  //         },
  //       });
  //     }
  //
  //     if (cardRef.current) {
  //       gsap.to(cardRef.current, {
  //         opacity: 0,
  //         scale: 0.95,
  //         ease: "power2.inOut",
  //         scrollTrigger: {
  //           trigger: sectionRef.current,
  //           start: "top+=40% top",
  //           end: "+=50%",
  //           scrub: 1,
  //         },
  //       });
  //     }
  //
  //     if (imageRef.current) {
  //       gsap.to(imageRef.current, {
  //         y: -300,
  //         ease: "power2.out",
  //         scrollTrigger: {
  //           trigger: sectionRef.current,
  //           start: "top+=30% top",
  //           end: "+=120%",
  //           scrub: 1,
  //         },
  //       });
  //     }
  //   },
  //   { scope: sectionRef }
  // );

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

  return (
    <section
      ref={sectionRef}
      className="hero-section relative flex flex-col overflow-hidden bg-black"
      style={{
        height: isMobile ? "85vh" : "100vh",
        minHeight: isMobile ? "600px" : "700px",
      }}
    >
      {/* MOBILE LAYOUT */}
      {isMobile && (
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

          {/* Background - same as desktop: layered blue gradient + light rays + shadow */}
          <div
            ref={gradientRef}
            className="absolute inset-0 overflow-hidden"
            style={{
              backgroundColor: "#000",
            }}
          >
            {/* Layer 1: Blue radial gradient base */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 50% at 50% 50%, #2563EB 0%, #1E40AF 25%, #1E3A8A 45%, #0a1628 75%, #000 100%)",
              }}
            />
            {/* Layer 2: Light rays image with overlay blend mode */}
            <img
              src={ASSETS.rectangleBg}
              alt=""
              className="absolute w-full h-full pointer-events-none"
              style={{
                objectFit: "cover",
                objectPosition: "left top",
                mixBlendMode: "overlay",
              }}
            />
            {/* Layer 3: Shadow overlay with multiply blend mode */}
            {/* <img
              src="/Shadow%20%230011.png"
              alt=""
              className="absolute pointer-events-none"
              style={{
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'left top',
                mixBlendMode: 'multiply',
              }}
            /> */}
            <video
              src={ASSETS.videos.heroLeafVideo}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                objectFit: "cover",
                objectPosition: "left top",

                opacity: 0.06,
              }}
            />
          </div>

          {/* Content Container */}
          <div
            ref={contentRef}
            className="relative z-10 flex-1 flex flex-col px-4 "
            style={{ willChange: "transform, opacity" }}
          >
            <div className="flex flex-col" style={{ paddingTop: "15vh" }}>
              {/* Left Content */}
              <div className="flex flex-col gap-4">
                {/* Headline */}
                <h1
                  ref={headlineRef}
                  className="hero-headline hero-headline-size italic brightness-[0.8]"
                  style={{ perspective: "1000px" }}
                >
                  <span className="block">The Real AC </span>
                  <span className="block">Compromise ends here.</span>
                </h1>

                {/* Badges Row */}
                <div ref={badgesRef} className="flex items-center gap-4 mt-6">
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
                    onClick={() => scrollToSection("benefits")}
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
            className="absolute left-0 right-0 z-20 brightness-[0.8]"
            style={{
              top: "70vh",
              transform: "translateY(-50%)",
            }}
          >
            <HeroACImage isMobile={isMobile} />
          </div>

          {/* Leaves video overlay - above AC image */}
          <video
            src={ASSETS.videos.heroLeafVideo}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full pointer-events-none z-30"
            style={{
              objectFit: "cover",
              objectPosition: "left top",

              opacity: 0.06,
            }}
          />
        </>
      )}

      {/* DESKTOP LAYOUT - Normal section matching Figma design */}
      {!isMobile && (
        <div
          ref={parallaxContainerRef}
          className="relative w-full h-full flex flex-col overflow-hidden"
        >
          {/* Background from Figma - layered blue gradient + light rays + shadow with darken blend */}
          <div
            ref={gradientRef}
            className="absolute inset-0 overflow-hidden"
            style={{
              backgroundColor: "#000",
            }}
          >
            {/* Layer 1: Blue radial gradient base */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 50% at 50% 50%, #2563EB 0%, #1E40AF 25%, #1E3A8A 45%, #0a1628 75%, #000 100%)",
              }}
            />
            {/* Layer 2: Light rays image with overlay blend mode */}
            <img
              src={ASSETS.rectangleBg}
              alt=""
              className="absolute w-full h-full pointer-events-none"
              style={{
                objectFit: "cover",
                objectPosition: "left top",
                mixBlendMode: "overlay",
              }}
            />
            {/* Layer 3: Leaves video overlay with screen blend mode */}
            <video
              src={ASSETS.videos.heroLeafVideo}
              autoPlay
              loop
              muted
              playsInline
              className="absolute pointer-events-none"
              style={{
                top: 0,
                left: 0,
                width: "120%",
                height: "120%",
                objectFit: "cover",
                objectPosition: "left top",

                opacity: 0.06,
              }}
            />
            {/* Layer 4: Shadow overlay from top-left with multiply blend mode */}
            {/* <img
              src="/Shadow%20%230011.png"
              alt=""
              className="absolute pointer-events-none"
              style={{
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'left top',
                mixBlendMode: 'multiply',
              }}
            /> */}
          </div>

          {/* Parallax content wrapper for mouse movement effect */}
          <div
            ref={parallaxContentRef}
            className="relative z-10 flex-1 flex flex-col w-full h-full will-change-transform"
          >
            {/* Content Container - centered with max-width */}
            <div
              ref={contentRef}
              className="flex-1 flex flex-col justify-start w-full max-w-[1360px] mx-auto px-10 lg:px-16"
              style={{ paddingTop: "12%" }}
            >
              {/* Top Row: Headline+Badges on Left, Buttons on Right */}
              <div className="flex flex-row justify-between brightness-[0.8] items-start w-full">
                {/* Left Content */}
                <div className="flex flex-col gap-4">
                  {/* Headline */}
                  <h1
                    ref={headlineRef}
                    className="hero-headline hero-headline-size italic"
                    style={{ perspective: "1000px" }}
                  >
                    <span className="block">The Real AC </span>
                    <span className="block  text-[54px] leading-[54px] font-[600]">
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
                <div ref={buttonsRef} className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => scrollToSection("benefits")}
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

            {/* AC Image - Desktop: positioned at bottom center */}
            <div
              ref={imageRef}
              className="relative flex justify-center w-full brightness-[0.8]"
              style={{
                marginTop: "auto",
                paddingBottom: "40px",
              }}
            >
              <HeroACImage isMobile={false} />
            </div>
          </div>

          {/* Leaves video overlay - above AC image */}
          <video
            src={ASSETS.videos.heroLeafVideo}
            autoPlay
            loop
            muted
            playsInline
            className="absolute pointer-events-none z-30"
            style={{
              top: 0,
              left: 0,
              width: "120%",
              height: "120%",
              objectFit: "cover",
              objectPosition: "left top",
              mixBlendMode: "overlay",
              opacity: 0.06,
            }}
          />
        </div>
      )}
    </section>
  );
}

// COMMENTED OUT: Preload the GLB model - not used in simplified version
// useGLTF.preload(MODEL_PATH);
