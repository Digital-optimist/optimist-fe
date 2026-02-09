"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

// =============================================================================
// Blog Hero Section - "Industry news, insights and more"
// =============================================================================

export function BlogHeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // Title animation
      tl.from(titleRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
      });

      // Subtitle animation
      tl.from(
        subtitleRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.4",
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="bg-white pt-24 sm:pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-[40px]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 lg:gap-8">
          {/* Title */}
          <div
            ref={titleRef}
            className="font-display will-change-[transform,opacity]"
          >
            <h1 className="text-[36px] sm:text-[44px] md:text-[54px] lg:text-[54px] font-bold leading-[1.1]">
              <span className="text-[#1265FF]">Industry news,</span>
              <br />
              <span className="text-black">insights and more</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-[16px] sm:text-[18px] md:text-[20px] text-[#475467] max-w-[360px] lg:max-w-[320px] leading-[1.5] will-change-[transform,opacity] lg:text-right lg:pb-2"
          >
            Here&apos;s a peek at what we&apos;re up to in terms of technology,
            design and intelligence.
          </p>
        </div>
      </div>
    </section>
  );
}

export default BlogHeroSection;
