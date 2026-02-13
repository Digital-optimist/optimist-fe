"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useWaitlist } from "@/contexts/WaitlistContext";
import { ASSETS } from "@/lib/assets";

export function IndiaFirstSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const flowerRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const { openModal } = useWaitlist();

  // Set initial states immediately to prevent flash/lag on first scroll
  useLayoutEffect(() => {
    if (leftCardRef.current) {
      gsap.set(leftCardRef.current, { opacity: 0, x: -40 });
    }
    if (flowerRef.current) {
      gsap.set(flowerRef.current, { opacity: 0, scale: 0.95 });
    }
    const badgeCards = badgesRef.current?.querySelectorAll(".badge-card");
    if (badgeCards) {
      gsap.set(badgeCards, { opacity: 0, y: 20 });
    }
  }, []);

  useGSAP(
    () => {
      // Batch all animations into a single timeline with one ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 25%",
          toggleActions: "play none none none",
          once: true, // Only animate once for better performance
        },
      });

      // Left card animation - use 'to' since initial state is already set
      tl.to(
        leftCardRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          force3D: true,
        },
        0,
      );

      // Flower image animation
      tl.to(
        flowerRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          force3D: true,
        },
        0.1,
      );

      // Badges staggered animation
      const badgeCards = badgesRef.current?.querySelectorAll(".badge-card");
      if (badgeCards) {
        tl.to(
          badgeCards,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power3.out",
            force3D: true,
          },
          0.2,
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-4 md:py-6 overflow-x-hidden bg-white"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Desktop: 2-column grid, Mobile: stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 md:gap-6">
          {/* Left Column - Dark Product Card */}
          <div
            ref={leftCardRef}
            className="relative rounded-[24px] md:rounded-[32px] overflow-hidden min-h-[420px] md:min-h-[520px] lg:min-h-[620px] will-change-[transform,opacity]"
            style={{
              background:
                "linear-gradient(180deg, #000000 0%, #1a1a1a 40%, #666666 70%, #cccccc 90%, #f5f5f5 100%)",
            }}
          >
            {/* Background Image Layer - decorative */}
            <div className="absolute inset-0 z-0 opacity-30">
              <Image
                src={ASSETS.ellipse1}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center"
              />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 md:p-10 lg:p-12">
              {/* Headline */}
              <h2 className="font-display text-[#AEFFD8] text-[32px] leading-[36px] md:text-[48px] md:leading-[52px] lg:text-[92px] lg:leading-[92px] font-[600] mb-4 md:mb-6">
                <span>
                  Live Gas Level
                  <br />
                  Indicator.
                </span>
              </h2>
              <p className="font-display text-[24px] leading-[28px] md:text-[32px] md:leading-[36px] lg:text-[40px] lg:leading-[44px] font-bold text-optimist-headline mb-6 md:mb-8">
                0 Surprises. 100% Control.
              </p>

              {/* Buttons */}
              <div className="flex items-center gap-3 md:gap-4">
                <button
                  onClick={openModal}
                  className="btn-buy-now w-[160px] hero-btn-mobile md:hero-btn-desktop inline-flex items-center justify-center text-[#FFFCDC]"
                >
                  Join the Waitlist
                </button>
                <button
                  onClick={() => {
                    document
                      .getElementById("benefits")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="btn-why-optimist w-[160px] hero-btn-mobile md:hero-btn-desktop inline-flex items-center justify-center text-white"
                >
                  Why Optimist ?
                </button>
              </div>
            </div>

            {/* AC Image - Positioned at bottom right, responsive sizing */}
            <div className="absolute bottom-[-12px] md:bottom-0 right-0 md:right-[-3%] w-[76%] md:w-[80%] lg:w-[65%]">
              <Image
                src={ASSETS.acTilt}
                alt="Optimist AC Unit with built-in gas level indicator"
                width={800}
                height={500}
                sizes="(max-width: 768px) 76vw, (max-width: 1024px) 80vw, 65vw"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Right Column - Flower + Badge Cards */}
          <div className="flex flex-col gap-4 md:gap-6">
            {/* Flower Image */}
            <div
              ref={flowerRef}
              className="relative bg-white border border-gray-200 rounded-[24px] md:rounded-[32px] overflow-hidden flex-1 min-h-[240px] md:min-h-[300px] lg:min-h-[340px] flex items-center justify-center will-change-[transform,opacity]"
            >
              {/* Star shape with palm tree video */}
              <div
                className="relative w-[80%] aspect-[349/311]"
                style={{
                  WebkitMaskImage: "url(/icons/Flower.svg)",
                  maskImage: "url(/icons/Flower.svg)",
                  WebkitMaskSize: "contain",
                  maskSize: "contain" as string,
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                >
                  <source src={ASSETS.videos.treeCool} type="video/mp4" />
                </video>
                {/* Blue Overlay with Blur - using backdrop-filter for GPU acceleration */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(52, 120, 246, 0.5) 0%, rgba(52, 120, 246, 0.3) 50%, transparent 70%)",
                    transform: "translateZ(0)",
                  }}
                />
              </div>
            </div>

            {/* Badge Cards Container */}
            <div
              ref={badgesRef}
              className="flex flex-col gap-3 md:gap-4 will-change-[transform,opacity]"
            >
              {/* India's 1st Badge Card */}
              <div
                className="badge-card relative rounded-[20px] md:rounded-[24px] overflow-hidden px-5 py-4 md:px-6 md:py-5"
                style={{
                  background:
                    "linear-gradient(135deg, #3478F6 0%, #5BA8E8 50%, #69CDEB 75%, #89D8F0 100%)",
                }}
              >
                {/* Grid Pattern Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
                    `,
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="relative z-10 flex items-center gap-3 md:gap-4">
                  <Image
                    src={ASSETS.fiveStarRating}
                    alt="5 Star Rating"
                    width={56}
                    height={56}
                    className="w-12 h-12 md:w-14 md:h-14"
                  />
                  <div>
                    <p className="font-display text-[24px] md:text-[28px] lg:text-[32px] font-bold text-white leading-tight">
                      India’s #1 Rated
                    </p>
                    <p className="text-sm md:text-base text-white/90 font-medium">
                      Energy Efficient AC.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4.8 Rated Badge Card */}
              <div
                className="badge-card relative rounded-[20px] md:rounded-[24px] overflow-hidden px-5 py-4 md:px-6 md:py-5"
                style={{
                  background:
                    "linear-gradient(135deg, #3478F6 0%, #5BA8E8 50%, #69CDEB 75%, #89D8F0 100%)",
                }}
              >
                {/* Grid Pattern Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
                    `,
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="relative z-10 flex items-center gap-3 md:gap-4">
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

                  <div>
                    <p className="font-display text-[24px] md:text-[28px] lg:text-[32px] font-bold text-white leading-tight">
                      4.8 rated
                    </p>
                    {/* Mobile text */}
                    <p className="text-sm md:hidden text-white/90 font-medium">
                      By those who switched, and stayed.
                    </p>
                    {/* Desktop text */}
                    <p className="hidden md:block text-base text-white/90 font-medium">
                      by early users
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
