"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";

const features = [
  {
    id: 1,
    badge: "First in Class",
    badgeIcon: "/image 24225.png",
    headline: "In-Built Gas Indicator.",
    description: "Stop paying for refills you don't need.",
    image: "/AC1.png",
  },
  {
    id: 2,
    badge: "5-Year Warranty",
    badgeIcon: "/41d29b9eba9f0cca3fb251cb6ffabdda00b8a903.png",
    headline: "5 Years",
    description: "Because quality shouldn't need an asterisk.",
    image: "/AC3.png",
  },
  {
    id: 3,
    badgeTitle: "Highest ISEER",
    badgeSubtitle: "In India",
    badgeIcon: "/41d29b9eba9f0cca3fb251cb6ffabdda00b8a903.png",
    headline: "Lower bills. Higher comfort.",
    description: "Live Energy Meter, Track consumption as it happens.",
    image: "/AC2.png",
  },
];

// Feature content component for mobile with fade transitions
function MobileFeatureContent({ 
  feature, 
  isActive, 
}: { 
  feature: typeof features[0]; 
  isActive: boolean; 
}) {
  return (
    <div 
      className={`absolute inset-0 flex flex-col justify-center px-6 sm:px-8 transition-all duration-500 ease-out ${
        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
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
        {'badgeTitle' in feature ? (
          <div className="flex flex-col">
            <span className="text-[11px] leading-[14px] font-[700] text-[#212121]">
              {feature.badgeTitle}
            </span>
            <span className="text-[11px] leading-[14px] font-[400] text-[#212121]">
              {feature.badgeSubtitle}
            </span>
          </div>
        ) : (
          <span className="text-[11px] leading-[14px] font-[700] text-[#212121]">
            {feature.badge}
          </span>
        )}
      </div>

      {/* Headline */}
      <h2 
        className="font-display text-3xl sm:text-4xl font-bold leading-tight mb-3"
        style={{
          background: "linear-gradient(151.7deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {feature.headline}
      </h2>

      {/* Description */}
      <p className="text-lg sm:text-xl text-[#6B7280] font-normal italic leading-relaxed">
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

  // Check screen size for conditional rendering
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Desktop video scrubbing - starts when section enters viewport
  useGSAP(
    () => {
      if (!isLargeScreen) return;
      
      const video = videoRef.current;
      if (!video || !sectionRef.current) return;

      video.pause();

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%", // Start when section top is 80% down the viewport
        end: "bottom bottom",
        scrub: 0.1,
        onUpdate: (self) => {
          if (video.readyState >= 1 && Number.isFinite(video.duration)) {
            const progress = self.progress;
            const time = progress * video.duration;
            if (Math.abs(video.currentTime - time) > 0.05) {
              video.currentTime = time;
            }
          }
        }
      });
    },
    {
      scope: sectionRef,
      dependencies: [isLargeScreen],
    }
  );

  // Mobile: Separate triggers for video scrubbing (early start) and pinning
  useGSAP(
    () => {
      if (isLargeScreen) return;
      
      const video = mobileVideoRef.current;
      const section = mobileSectionRef.current;
      if (!video || !section) return;

      video.pause();

      // Calculate the total scroll distance for pinning
      const pinScrollDistance = (features.length - 1) * window.innerHeight;

      // Trigger 1: Video scrubbing - starts when section enters viewport
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%", // Start when section enters viewport
        end: () => `+=${window.innerHeight * 0.8 + pinScrollDistance}`, // Account for pre-pin scroll + pin duration
        scrub: 0.3,
        onUpdate: (self) => {
          if (video.readyState >= 1 && Number.isFinite(video.duration)) {
            const progress = self.progress;
            const time = progress * video.duration;
            if (Math.abs(video.currentTime - time) > 0.05) {
              video.currentTime = time;
            }
          }
        }
      });

      // Trigger 2: Pinning and content transitions - starts at top
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${pinScrollDistance}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.3,
        onUpdate: (self) => {
          // Determine active feature based on scroll progress
          const progress = self.progress;
          const featureCount = features.length;
          const newActiveFeature = Math.min(
            Math.floor(progress * featureCount),
            featureCount - 1
          );
          setActiveFeature(newActiveFeature);
        }
      });
    },
    {
      scope: mobileSectionRef,
      dependencies: [isLargeScreen],
    }
  );

  return (
    <>
      {/* Mobile Layout - Fixed split screen with content transitions */}
      <div 
        ref={mobileSectionRef}
        className="lg:hidden relative bg-[#E7E7E7] h-screen"
      >
        {/* Fixed container that gets pinned */}
        <div className="h-screen w-full flex flex-col">
          {/* Top: Video Section (55% of screen) */}
          <div className="h-[55%] w-full overflow-hidden bg-[#E7E7E7] relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <video
                ref={mobileVideoRef}
                src="/PointersAnimation.mp4"
                className="h-[50%] sm:h-[100%] md:h-[120%] w-auto max-w-none object-contain"
                muted
                playsInline
                preload="auto"
                // @ts-ignore
                webkit-playsinline="true"
                disablePictureInPicture
              />
            </div>
          </div>

          {/* Bottom: Content Section (45% of screen) */}
          <div className="h-[45%] w-full bg-[#E7E7E7] relative">
            {/* Feature content - stacked with fade transitions */}
            <div className="absolute inset-0">
              {features.map((feature, index) => (
                <MobileFeatureContent
                  key={feature.id}
                  feature={feature}
                  isActive={index === activeFeature}
                />
              ))}
            </div>

            {/* Scroll hint for first feature */}
            <div 
              className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-opacity duration-300 ${
                activeFeature === 0 ? "opacity-60" : "opacity-0"
              }`}
            >
              <span className="text-xs text-[#9CA3AF] uppercase tracking-wider">Scroll</span>
              <svg 
                className="w-4 h-4 text-[#9CA3AF] animate-bounce" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <section
        ref={sectionRef}
        className="relative bg-[#E7E7E7] hidden lg:block"
      >
        {/* Background Leaf Pattern */}
        <div className="absolute top-0 left-0 w-full max-w-[800px] opacity-10 pointer-events-none z-0">
          <Image
            src="/Leaf Swaying.gif"
            alt=""
            width={800}
            height={1600}
            className="object-contain"
            unoptimized
          />
        </div>

        <div className="flex flex-row">
          {/* Left Scrollable Content */}
          <div className="w-1/2 relative z-10">
            <div className="flex flex-col">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="min-h-screen flex items-center justify-center px-12 lg:px-16 xl:px-24 py-20"
                >
                  <div className="max-w-[500px]">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-[#FFF9E6] rounded-2xl mb-6">
                      <div className="w-6 h-6 md:w-8 md:h-8 relative flex-shrink-0">
                        <Image
                          src={feature.badgeIcon}
                          alt=""
                          fill
                          className="object-contain"
                        />
                      </div>
                      {'badgeTitle' in feature ? (
                        <div className="flex flex-col">
                          <span className="text-[14px] leading-[18px] font-[700] text-[#212121]">
                            {feature.badgeTitle}
                          </span>
                          <span className="text-[14px] leading-[18px] font-[400] text-[#212121]">
                            {feature.badgeSubtitle}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[14px] leading-[18px] font-[700] text-[#212121]">
                          {feature.badge}
                        </span>
                      )}
                    </div>

                    {/* Headline with arrow */}
                    <div className="flex items-center gap-6 mb-6">
                      <h2 
                        className="font-display text-[44px] xl:text-[52px] font-bold leading-[1.1]"
                        style={{
                          background: "linear-gradient(151.7deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
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
                    <p className="text-lg lg:text-xl text-[#6B7280] font-normal italic leading-relaxed max-w-[400px]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sticky Video Section */}
          <div className="w-1/2 h-screen sticky top-0 right-0 overflow-hidden bg-[#E7E7E7]">
            <div className="absolute inset-0 flex items-center justify-center">
              <video
                ref={videoRef}
                src="/PointersAnimation.mp4"
                className="h-[100%] bg-[#E7E7E7] max-w-none w-auto object-cover translate-x-[25%]"
                muted
                playsInline
                preload="auto"
                // @ts-ignore
                webkit-playsinline="true"
                disablePictureInPicture
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
