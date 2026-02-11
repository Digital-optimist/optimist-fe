"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

// =============================================================================
// CTA Section - "Nothing extra. Nothing unnecessary" with Buy Now button
// =============================================================================

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "top 25%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // Text animation
      tl.from(
        textRef.current,
        {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power3.out",
        },
        0,
      );

      // Button animation
      tl.from(
        buttonRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
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
      className="bg-white py-12 md:py-16 lg:py-20 xl:py-24 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 xl:px-[40px]">
        {/* Content Container */}
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-4 md:gap-6 lg:gap-8">
          {/* Text Content */}
          <div
            ref={textRef}
            className="flex flex-col font-display text-center lg:text-left will-change-[transform,opacity] lg:max-w-[809px]"
          >
            {/* Line 1: Everything you need. */}
            <p className="font-semibold text-[32px] sm:text-[40px] md:text-[56px] lg:text-[64px] xl:text-[80px] text-black leading-[1.2] lg:leading-normal">
              Everything you <span className="text-[#3478F6]">need.</span>
            </p>

            {/* Line 2: Nothing you don't. */}
            <p className="font-semibold text-[32px] sm:text-[40px] md:text-[56px] lg:text-[64px] xl:text-[80px] text-black leading-[1.2] lg:leading-normal">
              Nothing you <span className="text-[#3478F6]">don&apos;t.</span>
            </p>
          </div>

          {/* Buy Now Button */}
          <a
            ref={buttonRef}
            href="#"
            className="group relative flex items-center justify-center gap-2.5 min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[241px] w-auto px-8 md:px-10 lg:px-[48px] h-[52px] sm:h-[56px] md:h-[60px] lg:h-[64px] rounded-[36px] overflow-hidden shrink-0 will-change-[transform,opacity] transition-transform duration-300 hover:scale-[1.03]"
            style={{
              background: "#3478F6",
            }}
          >
            {/* Button Text */}
            <span className="font-display font-semibold text-[16px] md:text-[18px] lg:text-[20px] text-[#FFFCDC] text-center whitespace-nowrap">
              Buy Now
            </span>

            {/* Arrow Icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path
                d="M7 17L17 7M17 7H7M17 7V17"
                stroke="#FFFCDC"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Inner Shadow Overlay */}
            <div
              className="absolute inset-0 pointer-events-none rounded-[inherit]"
              style={{
                boxShadow: "inset 0px 2px 12.5px 2px #003FB2",
              }}
            />
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
