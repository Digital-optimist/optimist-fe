"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export function MadeSimpleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Batch both cards into a single timeline with one ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 25%",
          toggleActions: "play none none none",
          once: true, // Only animate once for better performance
        },
      });

      // Left card animation
      tl.fromTo(
        leftCardRef.current,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        0
      );

      // Right card animation with slight stagger
      tl.fromTo(
        rightCardRef.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        0.1 // Slight delay for stagger effect
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="bg-white py-4 md:py-6 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Desktop: 2-column layout, Mobile: stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Left Card - Blue gradient with headline */}
          <div
            ref={leftCardRef}
            className="relative rounded-[24px] md:rounded-[32px] overflow-hidden min-h-[400px] md:min-h-[500px] lg:min-h-[600px]"
            style={{
              background: "linear-gradient(180deg, #FFFFFF 0%, #A8D4FF 50%, #3B82F6 100%)",
            }}
          >
            {/* Decorative palm tree watermark */}
            <div className="absolute bottom-0 right-0 w-[200px] h-[200px] md:w-[280px] md:h-[280px] opacity-30 pointer-events-none">
              <Image
                src="/Flower.png"
                alt=""
                fill
                className="object-contain"
                aria-hidden="true"
              />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 md:p-8 lg:p-10 flex flex-col justify-center h-full">
              {/* Headline */}
              <h2 className="font-display text-[32px] leading-[36px] md:text-[40px] md:leading-[44px] lg:text-[52px] lg:leading-[56px] font-bold text-optimist-blue-primary mb-6 md:mb-8">
                Made simple.
                <br />
                Nothing more,
                <br />
                nothing less.
              </h2>

              {/* Buy Now Button */}
              <Link
                href="/products"
                className="btn-buy-now inline-flex items-center justify-center w-fit px-8 md:px-10 py-3 md:py-3.5 rounded-full text-white font-semibold text-sm md:text-base"
              >
                Buy Now
              </Link>
            </div>
          </div>

          {/* Right Card - Remote on wooden background */}
          <div
            ref={rightCardRef}
            className="relative rounded-[24px] md:rounded-[32px] overflow-hidden"
          >
            {/* Desktop Image */}
            <div className="hidden md:block relative w-full aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[600px]">
              <Image
                src="/BrownBgRemoteDesktop.png"
                alt="Optimist Remote Control with features labeled: Fan Speed, Turbo, Power ON/OFF, Temperature, Turbo+"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Mobile Image */}
            <div className="md:hidden relative w-full aspect-square">
              <Image
                src="/BrownBgRemoteMobile.png"
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
