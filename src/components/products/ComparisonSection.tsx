"use client";

import { memo, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ASSETS } from "@/lib/assets";
import { CheckCircleIcon, XCircleIcon } from "@/components/icons/ProductIcons";

// =============================================================================
// Constants
// =============================================================================

const COMPARISON_DATA = [
  {
    category: "Extreme heat cooling",
    optimist: "Tested to deliver full cooling at 50°C",
    market: "Only claims, rarely tested beyond 43°C",
  },
  {
    category: "Turbo cooling",
    optimist: "Turbo+ delivers real 2 Ton cooling in a 1.5 Ton AC",
    market: "Turbo mostly increases fan speed",
  },
  {
    category: "Energy efficiency",
    optimist: "Lower electricity bills even in peak summer (ISEER rated)",
    market: "Efficiency drops, bills rise in peak heat",
  },
  {
    category: "Gas visibility",
    optimist: "Built-in Gas Level Indicator. No guesswork.",
    market: "No gas visibility, service dependent",
  },
  {
    category: "Warranty",
    optimist: "5 Years All-Inclusive Warranty. No hidden charges.",
    market: "Hidden charges, AMC push",
  },
  {
    category: "Durability",
    optimist: "1000-hour salt spray tested",
    market: "~72-hour salt spray testing",
  },
] as const;

// =============================================================================
// Component
// =============================================================================

export const ComparisonSection = memo(function ComparisonSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titlesRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

  // Set initial states to prevent flash
  useLayoutEffect(() => {
    if (titlesRef.current) {
      gsap.set(titlesRef.current, { opacity: 0, y: 40 });
    }
    if (rowsRef.current) {
      const rows = rowsRef.current.querySelectorAll(".comparison-row");
      gsap.set(rows, { opacity: 0, y: 20 });
    }
    if (imagesRef.current) {
      gsap.set(imagesRef.current, { opacity: 0, y: 40 });
    }
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 25%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // Titles animation
      tl.to(
        titlesRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          force3D: true,
        },
        0,
      );

      // Rows stagger animation
      const rows = rowsRef.current?.querySelectorAll(".comparison-row");
      if (rows) {
        tl.to(
          rows,
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.6,
            ease: "power3.out",
            force3D: true,
          },
          0.2,
        );
      }

      // Images animation
      tl.to(
        imagesRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          force3D: true,
        },
        0.4,
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      aria-labelledby="comparison-heading"
    >
      {/* Gradient Background Section */}
      <div className="relative overflow-hidden">
        {/* Background Split */}
        <div className="absolute inset-0 flex" aria-hidden="true">
          <div className="w-1/2 bg-[#3478F6]" />
          <div className="w-1/2 bg-[#212121]" />
        </div>

        {/* Shadow/Wave Background Image - covers the full section */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          {/* Use a wrapper div to handle the overflow sizing from Figma */}
          <div
            className="absolute"
            style={{
              width: "110.59%",
              height: "100%",
              left: "-5.3%",
              top: 0,
            }}
          >
            <Image
              src={ASSETS.comparisonShadowBg}
              alt=""
              fill
              sizes="100vw"
              className="object-top opacity-[0.3]"
            />
          </div>
        </div>

        {/* Section Headline */}
        {/* <div className="text-center">
          <p className="text-white/60 text-sm md:text-base mb-2">Comparison</p>
          <h2
            id="comparison-heading"
            className="font-display text-2xl md:text-4xl lg:text-5xl font-semibold text-white"
          >
            Designed for real use
          </h2>
        </div> */}

        {/* Content */}
        <div className="relative z-[10] w-full max-w-[1440px] mx-auto pt-10 md:pt-[53px] pb-[90px] md:pb-[175px]">
          {/* Titles Row */}
          <div ref={titlesRef} className="flex will-change-[transform,opacity]">
            <div className="w-1/2 px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16">
              <h3 className="font-display text-[28px] md:text-[48px] lg:text-[64px] font-bold text-white text-right mb-4 md:mb-6 lg:mb-10">
                Optimist AC
              </h3>
            </div>
            <div className="w-1/2 px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16">
              <h3 className="font-display text-[28px] md:text-[48px] lg:text-[64px] font-bold text-white/60 text-left mb-4 md:mb-6 lg:mb-10">
                Market AC
              </h3>
            </div>
          </div>

          {/* Comparison Rows - Each row contains both benefit and drawback */}
          <div ref={rowsRef} className="flex flex-col gap-3 md:gap-6">
            {COMPARISON_DATA.map((item, index) => (
              <div
                key={index}
                className="comparison-row flex items-stretch will-change-[transform,opacity]"
              >
                {/* Left - Benefit */}
                <div className="w-1/2 flex justify-end items-stretch px-2 sm:px-4 md:px-4 lg:px-6 xl:px-8">
                  <div className="flex items-center justify-end gap-1.5 sm:gap-2 md:gap-2.5 bg-white/[0.12] rounded-lg md:rounded-xl px-2 sm:px-3 md:px-3 py-1 sm:py-1.5 md:py-2 w-full md:w-fit md:max-w-[320px]">
                    <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-white font-medium text-right leading-tight">
                      {item.optimist}
                    </p>
                    <CheckCircleIcon className="w-4 h-4 md:w-5 lg:w-6 md:h-5 lg:h-6 flex-shrink-0" />
                  </div>
                </div>
                {/* Right - Drawback */}
                <div className="w-1/2 flex justify-start items-stretch px-2 sm:px-4 md:px-4 lg:px-6 xl:px-8">
                  <div className="flex items-center justify-start gap-1.5 sm:gap-2 md:gap-2.5 bg-white/[0.12] rounded-lg md:rounded-xl px-2 sm:px-3 md:px-3 py-1 sm:py-1.5 md:py-2 w-full md:w-fit md:max-w-[320px]">
                    <XCircleIcon className="w-4 h-4 md:w-5 lg:w-6 md:h-5 lg:h-6 flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-white font-medium text-left leading-tight">
                      {item.market}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* White Background Section for bottom half of AC images */}
      <div className="relative bg-white h-[95px] md:h-[200px] lg:min-h-[350px]" />

      {/* AC Product Images - Single merged image positioned to span both sections */}
      <div
        ref={imagesRef}
        className="absolute bottom-0 left-0 right-5 md:right-10 lg:right-[60px] z-[20] will-change-[transform,opacity]"
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12">
          <div className="relative w-full h-[200px] md:h-[450px] lg:h-[650px]">
            <Image
              src={ASSETS.acComparison}
              alt="Optimist AC vs Market AC comparison"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1440px) 90vw, 1440px"
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
});
