"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ASSETS } from "@/lib/assets";

// =============================================================================
// About Hero Section - "Cooling, built for a warming world."
// =============================================================================

export function AboutHeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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

      // Card animation
      tl.from(
        cardRef.current,
        {
          opacity: 0,
          y: 60,
          duration: 1,
          ease: "power3.out",
        },
        0.2,
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="bg-white pt-24 pb-12 md:pb-16 lg:pb-20 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12">
        {/* Title - Cooling, built for a warming world. */}
        <h1
          ref={titleRef}
          className="font-display text-[32px] md:text-[48px] lg:text-[64px] font-bold text-center mb-6 md:mb-8 lg:mb-10 will-change-[transform,opacity]"
        >
          <span className="text-black">Real Cooling, built for a </span>
          <span className="text-[#3478F6]">warming world.</span>
        </h1>

        {/* Hero Card with Background Video/Image */}
        <div
          ref={cardRef}
          className="relative w-full max-w-[1344px] mx-auto rounded-[32px] overflow-hidden will-change-[transform,opacity]"
        >
          {/* Desktop Layout - 556px height */}
          <div className="hidden md:block relative w-full h-[450px] lg:h-[556px]">
            <video
              src={ASSETS.discussionVideo}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            {/* Text overlay */}
            <div className="absolute left-[48px] bottom-[48px] lg:bottom-[64px] max-w-[700px]">
              <p className="font-light text-[20px] lg:text-[24px] leading-[1.5] text-white">
                Indian summers demand more than Normal ACs deliver. Real solid
                cooling at 45°C and more. Lowest and predictable costs.
                Transparent service. In 2024, we set out to build what should
                have already existed. The Real AC, engineered for reality, not
                marketing talk, nor spec sheets.
              </p>
            </div>
          </div>

          {/* Mobile Layout - 402px height */}
          <div className="md:hidden relative w-full h-[362px]">
            <video
              src={ASSETS.discussionVideo}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute bottom-0 left-0 right-0 h-[220px] bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            {/* Text overlay */}
            <div className="absolute left-[16px] right-[16px] bottom-[24px]">
              <p className="font-light text-[15px] leading-[1.5] text-white">
                Indian summers demand more than ACs were delivering. Consistent
                cooling at 45°C. Predictable costs. Transparent service. In
                2023, we set out to build what should have already existed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutHeroSection;
