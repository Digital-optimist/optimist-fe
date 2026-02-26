"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";
import { ASSETS } from "@/lib/assets";

// Helper to detect iOS Safari
const isIOSSafari = () => {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
  const webkit = !!ua.match(/WebKit/i);
  const iOSSafari = iOS && webkit && !ua.match(/CriOS/i) && !ua.match(/OPiOS/i);
  return iOSSafari;
};

const features = [
  {
    id: 1,
    badge: "135% Capacity Boost",
    badgeIcon: ASSETS.rocketLaunchIcon,
    headline: "Turbo+ Mode.\n42°C → 25°C, Fastest.",
    description: "2 Tons of Cooling in a 1.5 Ton AC.",
    image: ASSETS.ac3,
  },
  {
    id: 2,
    badge: "Highest Efficiency: ISEER 6.05",
    badgeIcon: ASSETS.iseer5StarBadge,
    headline: "Lowest AC Bills. Proven.",
    description: "Smart Energy Meter in App",
    image: ASSETS.ac1,
  },

  {
    id: 3,
    badge: "Comprehensive",
    badgeIcon: ASSETS.calendarCheckIcon,
    headline: "5 Years Warranty",
    description: "Because quality shouldn't need an asterisk.",
    image: ASSETS.ac2,
  },
];

// Feature content component for mobile with fade transitions
function MobileFeatureContent({
  feature,
  isActive,
}: {
  feature: (typeof features)[0];
  isActive: boolean;
}) {
  return (
    <div
      className={`absolute inset-0 flex flex-col justify-center px-6 sm:px-8 transition-all duration-500 ease-out ${
        isActive
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-[#FFF9E6] rounded-2xl mb-4 w-fit">
        <div className="w-6 h-6 relative flex-shrink-0">
          <Image
            src={feature.badgeIcon}
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <span className="text-[11px] leading-[14px] font-[700] text-[#212121] opacity-60">
          {feature.badge}
        </span>
      </div>

      {/* Headline */}
      <h2
        className="font-display text-3xl sm:text-4xl font-bold leading-tight mb-3 whitespace-pre-line"
        style={{
          background:
            "linear-gradient(151.7deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {feature.headline}
      </h2>

      {/* Description */}
      <p className="text-lg sm:text-xl text-[#6B7280] font-normal leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
}

export function FeaturesShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mobileSectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [mobileVideoReady, setMobileVideoReady] = useState(false);
  const videoInitializedRef = useRef(false);
  const mobileVideoInitializedRef = useRef(false);

  // Check screen size for conditional rendering
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Initialize video for iOS Safari - must happen on user interaction
  const initializeVideo = useCallback(
    async (
      video: HTMLVideoElement | null,
      initializedRef: React.MutableRefObject<boolean>,
    ) => {
      if (!video || initializedRef.current) return;

      try {
        video.muted = true;
        // Brief play to force iOS to load video data
        const playPromise = video.play();
        if (playPromise !== undefined) {
          await playPromise;
          video.pause();
          video.currentTime = 0;
          initializedRef.current = true;
        }
      } catch (e) {
        // Autoplay prevented - this is expected on iOS without user interaction
      }
    },
    [],
  );

  // Touch handler to initialize video on first user interaction (crucial for iOS Safari)
  useEffect(() => {
    const handleFirstTouch = () => {
      if (!isLargeScreen && mobileVideoRef.current) {
        initializeVideo(mobileVideoRef.current, mobileVideoInitializedRef);
      } else if (isLargeScreen && videoRef.current) {
        initializeVideo(videoRef.current, videoInitializedRef);
      }
      // Remove listener after first touch
      document.removeEventListener("touchstart", handleFirstTouch);
    };

    document.addEventListener("touchstart", handleFirstTouch, {
      passive: true,
    });
    return () => document.removeEventListener("touchstart", handleFirstTouch);
  }, [isLargeScreen, initializeVideo]);

  // Video load initialization
  useEffect(() => {
    const video = isLargeScreen ? videoRef.current : mobileVideoRef.current;
    if (!video) return;

    video.load();

    // Try to initialize immediately (works on non-iOS browsers)
    if (!isIOSSafari()) {
      const initializedRef = isLargeScreen
        ? videoInitializedRef
        : mobileVideoInitializedRef;
      initializeVideo(video, initializedRef);
    }
  }, [isLargeScreen, initializeVideo]);

  // Handle video metadata loaded
  const handleVideoLoaded = useCallback(() => {
    setVideoReady(true);
    // Try to initialize on metadata load
    if (videoRef.current && !videoInitializedRef.current) {
      initializeVideo(videoRef.current, videoInitializedRef);
    }
  }, [initializeVideo]);

  const handleMobileVideoLoaded = useCallback(() => {
    setMobileVideoReady(true);
    // Try to initialize on metadata load
    if (mobileVideoRef.current && !mobileVideoInitializedRef.current) {
      initializeVideo(mobileVideoRef.current, mobileVideoInitializedRef);
    }
  }, [initializeVideo]);

  // Desktop video scrubbing - starts when section enters viewport
  useGSAP(
    () => {
      if (!isLargeScreen) return;

      const video = videoRef.current;
      if (!video || !sectionRef.current) return;

      video.pause();

      // Track target time and current interpolated time for smoother seeking
      let targetTime = 0;
      let currentTime = 0;
      let lastTargetTime = 0;
      let isSeekingAllowed = true;
      let rafId: number | null = null;

      // Lerp factors - use faster lerp for reverse scrolling
      const lerpFactorForward = 0.15;
      const lerpFactorReverse = 0.35;

      // Use requestAnimationFrame with lerp for smoother video updates
      const updateVideoTime = () => {
        if (!isSeekingAllowed) return;

        if (video.readyState >= 1 && Number.isFinite(video.duration)) {
          // Lerp towards target time for smoother transitions
          const diff = targetTime - currentTime;
          const isReverse = targetTime < lastTargetTime;

          // Use faster lerp for reverse scrolling to improve responsiveness
          const lerpFactor = isReverse ? lerpFactorReverse : lerpFactorForward;

          // For large jumps (like quick scroll direction change), snap faster
          if (Math.abs(diff) > video.duration * 0.15) {
            // Jump closer to target for large differences
            currentTime = currentTime + diff * 0.5;
          } else if (Math.abs(diff) < 0.01) {
            // If difference is very small, snap to target
            currentTime = targetTime;
          } else {
            // Smooth interpolation towards target
            currentTime += diff * lerpFactor;
          }

          // Only seek if there's a meaningful difference
          if (Math.abs(video.currentTime - currentTime) > 0.02) {
            // Use regular currentTime for reverse seeking (more accurate than fastSeek)
            // fastSeek can be inaccurate when seeking backward
            if (
              !isReverse &&
              "fastSeek" in video &&
              typeof video.fastSeek === "function"
            ) {
              try {
                video.fastSeek(currentTime);
              } catch {
                video.currentTime = currentTime;
              }
            } else {
              video.currentTime = currentTime;
            }
          }

          // Continue animation loop if not at target
          if (Math.abs(targetTime - currentTime) > 0.01) {
            rafId = requestAnimationFrame(updateVideoTime);
          }
        }
      };

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom", // Start as soon as section enters viewport
        end: "bottom bottom",
        scrub: 0.1,
        onUpdate: (self) => {
          if (Number.isFinite(video.duration)) {
            lastTargetTime = targetTime;
            targetTime = self.progress * video.duration;
            // Cancel any pending frame and start new animation loop
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(updateVideoTime);
          }
        },
      });

      return () => {
        isSeekingAllowed = false;
        if (rafId) cancelAnimationFrame(rafId);
      };
    },
    {
      scope: sectionRef,
      dependencies: [isLargeScreen, videoReady],
    },
  );

  // Mobile: Separate ScrollTriggers for video scrubbing and content transitions
  useGSAP(
    () => {
      if (isLargeScreen) return;

      const video = mobileVideoRef.current;
      const section = mobileSectionRef.current;
      if (!video || !section) return;

      video.pause();

      // Track target time and current interpolated time for smoother seeking
      let targetTime = 0;
      let currentTime = 0;
      let lastTargetTime = 0;
      let rafId: number | null = null;
      let lastSeekTime = 0;
      const seekThrottleMs = 16; // ~60fps throttle for seeking

      // Lerp factors - increased for faster, more responsive video updates on mobile
      const lerpFactorForward = 0.12; // Reduced for slower video progression
      const lerpFactorReverse = 0.25; // Reduced for smoother reverse

      // Use requestAnimationFrame with lerp for smoother video updates
      const updateVideoTime = () => {
        if (video.readyState >= 2 && Number.isFinite(video.duration)) {
          const now = performance.now();

          // Lerp towards target time for smoother transitions
          const diff = targetTime - currentTime;
          const isReverse = targetTime < lastTargetTime;

          // Use faster lerp for reverse scrolling to improve responsiveness
          const lerpFactor = isReverse ? lerpFactorReverse : lerpFactorForward;

          // For large jumps (like quick scroll direction change), snap faster
          if (Math.abs(diff) > video.duration * 0.1) {
            // Jump closer to target for large differences (increased from 0.5 to 0.7)
            currentTime = currentTime + diff * 0.7;
          } else if (Math.abs(diff) < 0.005) {
            // If difference is very small, snap to target
            currentTime = targetTime;
          } else {
            // Smooth interpolation towards target
            currentTime += diff * lerpFactor;
          }

          // Only seek if there's a meaningful difference and we're not throttled
          const shouldSeek = Math.abs(video.currentTime - currentTime) > 0.016;
          const isThrottled = now - lastSeekTime < seekThrottleMs;

          if (shouldSeek && !isThrottled) {
            lastSeekTime = now;
            try {
              // Use fastSeek when available and going forward (it's faster but less accurate)
              if (
                !isReverse &&
                "fastSeek" in video &&
                typeof video.fastSeek === "function"
              ) {
                video.fastSeek(currentTime);
              } else {
                video.currentTime = currentTime;
              }
            } catch {
              // Ignore seeking errors
            }
          }

          // Continue animation loop if not at target
          if (Math.abs(targetTime - currentTime) > 0.005) {
            rafId = requestAnimationFrame(updateVideoTime);
          }
        }
      };

      const featureBreakpoints = [0, 0.33, 0.66, 1];

      ScrollTrigger.create({
        trigger: section,
        start: "top 25%",
        end: "bottom bottom",
        scrub: 0.3, // Increased from 0.05 for better scroll responsiveness on mobile
        onUpdate: (self) => {
          const progress = self.progress;

          // Update video time based on scroll progress
          if (Number.isFinite(video.duration)) {
            lastTargetTime = targetTime;
            targetTime = progress * video.duration;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(updateVideoTime);
          }

          // Update active feature based on breakpoints
          let newActiveFeature = 0;
          for (let i = 1; i < featureBreakpoints.length; i++) {
            if (progress >= featureBreakpoints[i]) {
              newActiveFeature = i;
            } else {
              break;
            }
          }
          newActiveFeature = Math.min(newActiveFeature, features.length - 1);
          setActiveFeature(newActiveFeature);
        },
      });

      // Cleanup
      return () => {
        if (rafId) cancelAnimationFrame(rafId);
      };
    },
    {
      scope: mobileSectionRef,
      dependencies: [isLargeScreen, mobileVideoReady], // Added mobileVideoReady dependency
    },
  );

  return (
    <>
      {/* Mobile Layout - Uses CSS sticky for reliable mobile behavior */}
      {/* Outer container creates scroll space (height = features * 100vh) */}
      <div
        ref={mobileSectionRef}
        className="lg:hidden block w-full relative"
        style={{
          height: `${features.length * 80}vh`,
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* Sticky container - stays fixed while parent scrolls */}
        <div
          style={{
            position: "sticky",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#FFFFFF",
            overflow: "hidden",
          }}
        >
          {/* Video Section - Top 55% */}
          <div
            style={{
              height: "55%",
              width: "100%",
              overflow: "hidden",
              backgroundColor: "#FFFFFF",
              position: "relative",
              flexShrink: 0,
              contain: "layout style",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 50,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                willChange: "transform",
                transform: "translateZ(0)",
              }}
            >
              <video
                ref={mobileVideoRef}
                src={`${ASSETS.videos.pointersAnimationMobile}`}
                className="h-[100%] w-auto max-w-none object-cover translate-x-[5%]"
                muted
                playsInline
                preload="auto"
                onLoadedMetadata={handleMobileVideoLoaded}
                onCanPlay={handleMobileVideoLoaded}
                onCanPlayThrough={handleMobileVideoLoaded}
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
                style={{
                  WebkitTransform: "translateZ(0) translateX(25%)",
                  transform: "translateZ(0) translateX(25%)",
                  willChange: "contents",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  contain: "layout style paint",
                }}
              />
            </div>
          </div>

          {/* Content Section - Bottom 45% */}
          <div
            style={{
              height: "45%",
              width: "100%",
              backgroundColor: "#FFFFFF",
              position: "relative",
              flexShrink: 0,
            }}
          >
            {/* Feature content - stacked with fade transitions */}
            {features.map((feature, index) => (
              <MobileFeatureContent
                key={feature.id}
                feature={feature}
                isActive={index === activeFeature}
              />
            ))}

            {/* Scroll hint for first feature */}
            <div
              style={{
                position: "absolute",
                bottom: "1rem",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.25rem",

                transition: "opacity 300ms",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Scroll
              </span>
              <svg
                style={{ width: "1rem", height: "1rem", color: "#9CA3AF" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <section ref={sectionRef} className="relative bg-white hidden lg:block">
        {/* Background Leaf Pattern */}
        {/* <div className="absolute top-0 left-0 sticky w-full opacity-10 pointer-events-none z-20">
          <video
            src={ASSETS.videos.heroLeafVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto object-contain"
          />
        </div> */}

        <div className="flex flex-row pb-4">
          {/* Left Scrollable Content */}
          <div className="w-1/2 relative z-10">
            <div className="flex flex-col">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className={`flex items-center justify-center px-12 lg:px-16 xl:px-24 ${
                    index === 0 ? "min-h-[70vh]" : "min-h-screen"
                  }`}
                >
                  <div className="max-w-[500px]">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-[#FFF9E6] rounded-2xl mb-6">
                      <div className="w-6 h-6 md:w-6 md:h-6 relative flex-shrink-0">
                        <Image
                          src={feature.badgeIcon}
                          alt=""
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-[14px] leading-[18px] font-[700] text-[#212121] opacity-60">
                        {feature.badge}
                      </span>
                    </div>

                    {/* Headline with arrow */}
                    <div className="flex items-center gap-6 mb-6">
                      <h2
                        className="font-display text-[44px] xl:text-[52px] font-bold leading-[1.1] whitespace-pre-line"
                        style={{
                          background:
                            "linear-gradient(151.7deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        {feature.headline}
                      </h2>
                      {/* Arrow line */}
                      <div className="flex items-center flex-shrink-0">
                        <div className="w-20 xl:w-28 h-[1px] bg-[#C4C4C4]" />
                        <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[8px] border-l-[#C4C4C4]" />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-lg lg:text-xl text-[#6B7280] font-normal leading-relaxed max-w-[400px]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sticky Video Section */}
          <div className="w-1/2 h-screen sticky top-0 right-0 overflow-hidden bg-white">
            <div className="absolute inset-0 flex items-center justify-center">
              <video
                ref={videoRef}
                src={`${ASSETS.videos.pointersAnimation}`}
                className="h-[100%] bg-white max-w-none w-auto object-cover translate-x-[25%]"
                muted
                playsInline
                autoPlay={false}
                preload="auto"
                onLoadedMetadata={handleVideoLoaded}
                onCanPlay={handleVideoLoaded}
                onCanPlayThrough={handleVideoLoaded}
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
                style={{ WebkitTransform: "translateZ(0)" }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
