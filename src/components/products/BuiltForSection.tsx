"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ArrowUpRight } from "lucide-react";
import ASSETS from "@/lib/assets";

// =============================================================================
// Main Component
// =============================================================================

export function BuiltForSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Animation states will be handled by GSAP ScrollTrigger
  useLayoutEffect(() => {
    // Elements start visible, animation will enhance on scroll
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

      // Title animation
      tl.from(
        titleRef.current,
        {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power3.out",
        },
        0,
      );

      // Image and callouts animation
      tl.from(
        imageContainerRef.current,
        {
          opacity: 0,
          scale: 0.95,
          duration: 1,
          ease: "power3.out",
        },
        0.2,
      );

      // Bottom section animation
      tl.from(
        bottomRef.current,
        {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power3.out",
        },
        0.6,
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="bg-white py-12 pb-0 md:py-16 lg:py-20 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-8 md:mb-11">
          <p className="text-[#3478F6] text-sm md:text-base mb-2">
            Product Callout
          </p>
          <h2
            ref={titleRef}
            className="font-display text-2xl md:text-4xl lg:text-[40px] font-semibold text-black will-change-[transform,opacity]"
          >
            Your Optimist
          </h2>
        </div>

        {/* Desktop Layout - AC Image with Absolute Positioned Callouts */}
        <div
          ref={imageContainerRef}
          className="hidden md:block relative w-full max-w-[1229px] mx-auto mb-12 md:mb-16 will-change-[transform,opacity]"
        >
          {/* Container with relative positioning for absolute children */}
          <div className="relative" style={{ height: "662px" }}>
            {/* AC Image - centered with offset */}
            <div
              className="absolute"
              style={{
                left: "45px",
                top: "0",
                width: "1184px",
                height: "662px",
              }}
            >
              <Image
                src={ASSETS.builtForAcDesktop}
                alt="Optimist AC"
                fill
                className="object-contain"
                sizes="1184px"
                priority
              />
            </div>

            {/* Callout: Cools consistently - Top Left */}
            <div
              className="absolute flex flex-col items-start"
              style={{ left: "0", top: "0" }}
            >
              <p className="font-semibold text-[32px] leading-normal text-black">
                Cools consistently
              </p>
              <p className="font-semibold text-[32px] leading-normal text-[#3478F6]">
                at 45°C
              </p>
            </div>

            {/* Callout: Tracks energy - Top Right (blue) */}
            <div
              className="absolute flex flex-col items-start"
              style={{ left: "905px", top: "142px", width: "324px" }}
            >
              <p className="font-semibold text-[32px] leading-normal text-[#3478F6]">
                Tracks energy
              </p>
              <p className="font-semibold text-[32px] leading-normal text-[#3478F6]">
                in real-time
              </p>
            </div>

            {/* Callout: Shows exact gas levels - Bottom Left */}
            <div
              className="absolute flex flex-col items-start"
              style={{ left: "208px", top: "510px", width: "324px" }}
            >
              <p className="font-semibold text-[32px] leading-normal text-black">
                Shows exact
              </p>
              <p className="font-semibold text-[32px] leading-normal text-[#3478F6]">
                gas levels
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Layout - AC Image with Absolute Positioned Callouts */}
        <div className="md:hidden relative w-full mb-8 will-change-[transform,opacity]">
          {/* Container with relative positioning */}
          <div className="relative" style={{ minHeight: "400px" }}>
            {/* Callout: Cools consistently - Top Left */}
            <div
              className="absolute flex flex-col items-start"
              style={{ left: "0", top: "0" }}
            >
              <p className="font-semibold text-base leading-normal text-black">
                Cools consistently
              </p>
              <p className="font-semibold text-base leading-normal text-[#3478F6]">
                at 45°C
              </p>
            </div>

            {/* Callout: Tracks energy - Top Right (blue) */}
            <div
              className="absolute flex flex-col items-end text-right"
              style={{ right: "0", top: "0" }}
            >
              <p className="font-semibold text-base leading-normal text-[#3478F6]">
                Tracks energy
              </p>
              <p className="font-semibold text-base leading-normal text-[#3478F6]">
                in real-time
              </p>
            </div>

            {/* AC Image - Vertically & Horizontally Centered */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: "340px",
                height: "200px",
              }}
            >
              <Image
                src={ASSETS.builtForAcMobile}
                alt="Optimist AC"
                fill
                className="object-contain"
                sizes="340px"
                priority
              />
            </div>

            {/* Callout: Shows exact gas levels - Bottom Left */}
            <div
              className="absolute flex flex-col items-start"
              style={{ left: "0", bottom: "0" }}
            >
              <p className="font-semibold text-base leading-normal text-black">
                Shows exact
              </p>
              <p className="font-semibold text-base leading-normal text-[#3478F6]">
                gas levels
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section - Outcome and CTA */}
        <div
          ref={bottomRef}
          className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 will-change-[transform,opacity]"
        >
          {/* Outcome */}
          <div className="font-display text-center md:text-left">
            <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight">
              <span className="text-black">
                Everything you need to stay cool.
              </span>
            </p>
            <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight mt-1">
              <span className="text-[#3478F6]">
                Nothing that gets in the way.
              </span>
            </p>
          </div>

          {/* Buy Now Button */}
          <Link
            href="/products"
            className="btn-buy-now flex items-center justify-center gap-2.5 px-8 md:px-12 py-4 h-14 md:h-16 rounded-full text-[#FFFCDC] font-semibold text-base md:text-xl whitespace-nowrap"
          >
            <span>Buy Now</span>
            <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
        </div>
      </div>
    </section>
  );
}
