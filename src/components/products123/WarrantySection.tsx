"use client";

import { memo, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ASSETS } from "@/lib/assets";

// =============================================================================
// Types
// =============================================================================

interface WarrantyFeature {
  id: number;
  text: {
    regular: string;
    bold: string;
    position: "start" | "end" | "middle";
  };
}

// =============================================================================
// Constants
// =============================================================================

const WARRANTY_FEATURES: WarrantyFeature[] = [
  {
    id: 1,
    text: {
      bold: "5-year comprehensive warranty",
      regular: " covering outdoor unit and critical indoor components.",
      position: "start",
    },
  },
  {
    id: 2,
    text: {
      bold: "10-year compressor protection",
      regular: " for long-term cooling reliability.",
      position: "start",
    },
  },
  {
    id: 3,
    text: {
      bold: "Preventive care included",
      regular: " with scheduled service and proactive system monitoring.",
      position: "start",
    },
  },
];

// =============================================================================
// Feature Item Component
// =============================================================================

const FeatureItem = memo(function FeatureItem({ feature }: { feature: WarrantyFeature }) {
  return (
    <div className="bg-[rgba(0,0,0,0.04)] flex items-center gap-2 md:gap-4 p-2.5 md:px-5 md:py-8 rounded-xl w-full">
      <Image
        src={ASSETS.warrantyCheck}
        alt="Check"
        width={40}
        height={40}
        className="w-6 h-6 md:w-10 md:h-10 shrink-0"
      />
      <p className="text-sm md:text-xl text-black leading-normal">
        {feature.text.position === "start" ? (
          <>
            <span className="font-semibold">{feature.text.bold}</span>
            <span>{feature.text.regular}</span>
          </>
        ) : feature.text.position === "end" ? (
          <>
            <span>{feature.text.regular} </span>
            <span className="font-semibold">{feature.text.bold}</span>
          </>
        ) : (
          <>
            <span>{feature.text.regular}</span>
            <span className="font-semibold">{feature.text.bold}</span>
          </>
        )}
      </p>
    </div>
  );
});

// =============================================================================
// Main Component
// =============================================================================

export const WarrantySection = memo(function WarrantySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Set initial states to prevent flash
  useLayoutEffect(() => {
    if (headerRef.current) {
      gsap.set(headerRef.current, { opacity: 0, y: 40 });
    }
    if (contentRef.current) {
      gsap.set(contentRef.current, { opacity: 0, y: 40 });
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

      // Header animation
      tl.to(
        headerRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          force3D: true,
        },
        0
      );

      // Content card animation
      tl.to(
        contentRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          force3D: true,
        },
        0.2
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="w-full py-12 md:py-20 lg:py-24 bg-white" aria-labelledby="warranty-heading">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10">
        {/* Header */}
        <div ref={headerRef} className="mb-6 md:mb-11 will-change-[transform,opacity]">
          <div className="flex items-start justify-between">
            <div>
              {/* Subtitle */}
              <p className="text-[#3478F6] text-base md:text-xl font-normal mb-2 md:mb-2.5">
                Warranty and T&C
              </p>
              
              {/* Title */}
              <h2 
                id="warranty-heading"
                className="font-display font-semibold text-2xl md:text-[40px] text-black leading-tight"
              >
                Ownership without worry.
              </h2>
            </div>

            {/* Learn more CTA - Desktop */}
            <Link
              href="/warranty"
              className="hidden md:inline-flex items-center justify-center px-8 py-3 bg-[#3478F6] text-white text-base font-medium rounded-full hover:bg-[#2a60c8] transition-colors shrink-0"
            >
              Learn more
            </Link>
          </div>
        </div>

        {/* Content Card */}
        <div ref={contentRef} className="border border-[rgba(0,0,0,0.12)] rounded-2xl md:rounded-3xl overflow-hidden md:h-[545px] will-change-[transform,opacity]">
          <div className="flex flex-col md:flex-row items-center md:items-center md:justify-between p-4 md:pl-5 md:pr-0 md:py-10 gap-[18px] md:gap-4">
            {/* Warranty Card Image - using Figma's exact positioning/cropping */}
            <div className="relative w-[200px] md:w-[326px] h-[285px] md:h-[465px] shrink-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ASSETS.warrantyCard}
                alt="Optimist Warranty Card - Peace of mind, built in"
                className="absolute w-[266.67%] h-[124.57%] max-w-none"
                style={{ left: '-75%', top: '-9.73%' }}
              />
            </div>

            {/* Features and Tagline */}
            <div className="flex flex-col gap-6 md:gap-10 w-full md:flex-1 md:max-w-[974px]">
              {/* Feature Items */}
              <div className="flex flex-col gap-2">
                {WARRANTY_FEATURES.map((feature) => (
                  <FeatureItem key={feature.id} feature={feature} />
                ))}
              </div>

              {/* Gradient Tagline */}
              <p 
                className="font-display font-semibold text-xl md:text-[40px] leading-tight bg-gradient-to-r from-[#3478F6] to-[#1E4690] bg-clip-text"
                style={{ WebkitTextFillColor: "transparent" }}
              >
                Optimist is built to stay reliable over years of use.
              </p>
            </div>
          </div>
        </div>

        {/* Learn more CTA - Mobile */}
        <div className="flex md:hidden justify-center mt-6">
          <Link
            href="/warranty"
            className="inline-flex items-center justify-center px-10 py-3.5 bg-[#3478F6] text-white text-base font-medium rounded-full hover:bg-[#2a60c8] transition-colors"
          >
            Learn more
          </Link>
        </div>
      </div>
    </section>
  );
});
