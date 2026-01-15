"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const benefits = [
  {
    id: 1,
    badge: "Super Energy Efficiency",
    headline: "Tired of surprise bills?",
    description: "Live Energy Meter, Track consumption as it happens.",
  },
  {
    id: 2,
    badge: "Cools at High Temperatures",
    headline: "Beat the summer heat?",
    description: "Powerful cooling even at 52°C outdoor temperature.",
  },
  {
    id: 3,
    badge: "Lower bills. Higher comfort.",
    headline: "Save more every month?",
    description: "India's highest ISEER rating means lowest running costs.",
  },
];

export function BenefitsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Batch header and cards into a single timeline with one ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 25%",
          toggleActions: "play none none none",
          once: true, // Only animate once for better performance
        },
      });

      // Header animation
      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
        },
        0
      );

      // Cards stagger animation - all in same timeline
      const cards = carouselRef.current?.querySelectorAll(".benefit-card");
      if (cards) {
        tl.fromTo(
          cards,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out",
          },
          0.2 // Start slightly after header
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-12 md:py-16 lg:py-20 overflow-hidden bg-[#F8F8FA]"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header - Desktop */}
        <div ref={headerRef} className="mb-8 md:mb-12">
          <p className="text-sm md:text-base text-gray-500 italic mb-2">
            New Generation of AC
          </p>
          {/* Desktop headline */}
          <h2 className="hidden md:block font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
            Everything you need. Nothing you don&apos;t.
          </h2>
          {/* Mobile headline */}
          <h2 className="md:hidden font-display text-3xl font-bold text-gray-900 leading-tight">
            Benefits that matter
          </h2>
        </div>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-4 -mx-4 pl-4 pr-4 md:mx-0 md:px-0 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="benefit-card flex-shrink-0 w-[85vw] md:w-[calc(50%-12px)] lg:w-[calc(80%-12px)] relative rounded-[24px] overflow-hidden"
              style={{ scrollSnapAlign: "start" }}
            >
              {/* Image Background */}
              <div className="relative aspect-[4/5] md:aspect-[16/10]">
                <img
                  src="/ACOutside.png"
                  alt="Optimist AC"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-6">
                  {/* Top - Badge */}
                  <div>
                    <span className="inline-block px-4 py-2 bg-optimist-blue-primary text-white text-sm font-medium rounded-full">
                      {benefit.badge}
                    </span>
                  </div>

                  {/* Bottom - Text */}
                  <div className="mt-auto">
                    <h3 className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-cyan-300 mb-1">
                      {benefit.headline}
                    </h3>
                    <p className="text-lg md:text-xl lg:text-2xl font-bold text-optimist-cream">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
