"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useWaitlist } from "@/contexts/WaitlistContext";
import { ASSETS } from "@/lib/assets";

export function MadeSimpleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const { openModal } = useWaitlist();

  // Set initial states immediately to prevent flash/lag on first scroll
  useLayoutEffect(() => {
    if (leftCardRef.current) {
      gsap.set(leftCardRef.current, { opacity: 0, x: -40 });
    }
    if (rightCardRef.current) {
      gsap.set(rightCardRef.current, { opacity: 0, x: 40 });
    }
  }, []);

  useGSAP(
    () => {
      // Batch both cards into a single timeline with one ScrollTrigger
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

      // Right card animation with slight stagger
      tl.to(
        rightCardRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          force3D: true,
        },
        0.1, // Slight delay for stagger effect
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="py-4 md:py-6 overflow-x-hidden"
      style={{
        background:
          "linear-gradient(0deg, #FFFFFF, #FFFFFF),linear-gradient(0deg, rgba(236, 236, 236, 0.2), rgba(236, 236, 236, 0.2))",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Desktop: 2-column layout, Mobile: stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Left Card - Blue gradient with headline */}
          <div
            ref={leftCardRef}
            className="relative rounded-[24px] md:rounded-[32px] overflow-hidden min-h-[400px] md:min-h-[450px] lg:min-h-[500px] will-change-[transform,opacity]"
            style={{
              border: "1px solid #21212133",
            }}
          >
            {/* Decorative palm tree watermark */}
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-[180px] h-[180px] md:w-[240px] md:h-[240px] lg:w-[280px] lg:h-[280px] pointer-events-none">
              <Image
                src={ASSETS.optimistTree}
                alt=""
                fill
                className="object-contain"
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(70%) sepia(30%) saturate(500%) hue-rotate(175deg) brightness(95%) contrast(90%)",
                  opacity: 0.5,
                }}
                aria-hidden="true"
              />
            </div>

            {/* Content */}
            <div
              className="relative z-10 p-4 md:p-8 lg:p-10 flex flex-col justify-start pt-10 md:pt-14 lg:pt-16 h-full"
              style={{
                background:
                  "linear-gradient(180deg, #FFFFFF 0%, #E8F4FF 35%, #B8DEFF 70%, #8ECFFF 100%)",
              }}
            >
              {/* Headline */}
              <h2
                className="font-display text-[32px] leading-[38px] md:text-[44px] md:leading-[50px] lg:text-[56px] lg:leading-[62px] font-bold mb-6 md:mb-8"
                style={{
                  background:
                    "linear-gradient(151.7deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Made minimal.
                <br />
                Nothing more,
                <br />
                nothing less.
              </h2>

              {/* Join Waitlist Button */}
              <button
                onClick={openModal}
                className="btn-buy-now inline-flex items-center justify-center w-fit px-8 md:px-10 py-3 md:py-3.5 rounded-full text-[#FFFCDC] font-semibold text-sm md:text-base"
              >
                Join the Waitlist
              </button>
            </div>
          </div>

          {/* Right Card - Remote on wooden background */}
          <div
            ref={rightCardRef}
            className="relative rounded-[24px] md:rounded-[32px] overflow-hidden will-change-[transform,opacity]"
          >
            {/* Desktop Image */}
            <div className="hidden md:block relative w-full aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[450px]">
              <Image
                src={ASSETS.brownBgRemote}
                alt="Optimist Remote Control with features labeled: Fan Speed, Turbo, Power ON/OFF, Temperature, Turbo+"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Mobile Image */}
            <div className="md:hidden relative w-full aspect-[4/3]">
              <Image
                src={ASSETS.brownBgRemote}
                alt="Optimist Remote Control with features labeled"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
