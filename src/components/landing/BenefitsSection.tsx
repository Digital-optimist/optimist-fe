"use client";

import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const benefits = [
  {
    id: 1,
    badge: "Worried about AC bill shocks?",
    headline: "India's Most Energy-Efficient AC.",
    description: "Lowest electricity consumption every single day.",
    image: "/b1.png",
  },
  {
    id: 2,
    badge: "Cooling fails in peak summer?",
    headline: "Tested to cool at 50°C.",
    description: "No performance drop when others derate.",
    image: "/b2.png",
  },
  {
    id: 3,
    badge: "Cooling taking forever?",
    headline: "2 Tons of Cooling in 1.5 Tons.",
    description: "Exclusive Turbo+ Mode for instant cooling.",
    image: "/b3.png",
  },
];

export function BenefitsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Set initial states immediately to prevent flash/lag on first scroll
  useLayoutEffect(() => {
    if (headerRef.current) {
      gsap.set(headerRef.current, { opacity: 0, y: 40 });
    }
  }, []);

  useGSAP(
    () => {
      // Track our own ScrollTrigger instances for cleanup
      const triggers: ScrollTrigger[] = [];

      // Check window width directly as additional safeguard (handles SSR hydration timing)
      const isCurrentlyMobile = typeof window !== "undefined" && window.innerWidth < 768;

      // Skip horizontal scroll on mobile - use native scroll instead
      if (isMobile || isCurrentlyMobile) {
        // Simple fade-in animation for mobile - use 'to' since initial state is set
        const headerTrigger = gsap.to(
          headerRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        ).scrollTrigger;
        if (headerTrigger) triggers.push(headerTrigger);
        
        // Cleanup only our triggers
        return () => {
          triggers.forEach((trigger) => trigger.kill());
        };
      }

      const carousel = carouselRef.current;
      const section = sectionRef.current;
      if (!carousel || !section) return;

      // Get the total scroll width needed
      const cards = carousel.querySelectorAll(".benefit-card");
      const cardWidth = cards[0]?.getBoundingClientRect().width || 0;
      const gap = 24; // gap-6 = 24px
      const totalWidth = (cardWidth + gap) * cards.length - gap;
      const viewportWidth = window.innerWidth;
      const scrollDistance = totalWidth - viewportWidth + 100; // Extra padding

      // Header fade in animation - use 'to' since initial state is set
      const headerTrigger = gsap.to(
        headerRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      ).scrollTrigger;
      if (headerTrigger) triggers.push(headerTrigger);

      // Horizontal scroll animation on vertical scroll
      // Pin when bottom of section reaches bottom of viewport (so full card is visible)
      const carouselTrigger = gsap.to(carousel, {
        x: -scrollDistance,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "bottom bottom",
          end: () => `+=${scrollDistance}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            // Recalculate on resize
            const newCards = carousel.querySelectorAll(".benefit-card");
            const newCardWidth =
              newCards[0]?.getBoundingClientRect().width || 0;
            const newTotalWidth = (newCardWidth + gap) * newCards.length - gap;
            const newScrollDistance = newTotalWidth - window.innerWidth + 100;
            self.vars.end = `+=${newScrollDistance}`;
            gsap.set(carousel, { x: -self.progress * newScrollDistance });
          },
        },
      }).scrollTrigger;
      if (carouselTrigger) triggers.push(carouselTrigger);

      // Cleanup only our triggers, not all triggers
      return () => {
        triggers.forEach((trigger) => trigger.kill());
      };
    },
    { scope: sectionRef, dependencies: [isMobile] }
  );

  return (
    <section id="benefits" ref={sectionRef} className="relative bg-[#FFFFFF] overflow-x-hidden">
      {/* Trigger wrapper for pinning - only on desktop */}
      <div
        ref={triggerRef}
        className="py-2 md:py-6 lg:py-10"
      >
        <div className="mx-auto px-4 md:px-6 lg:px-8 max-w-[1400px] md:max-w-none">
          {/* Section Header */}
          <div ref={headerRef} className="mb-8 md:mb-12 will-change-[transform,opacity]">
            <p className="text-sm md:text-base text-[#212121] italic mb-2">
              New Generation of AC
            </p>
            {/* Desktop headline */}
            <h2 className="hidden md:block font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#212121] leading-tight">
              Everything you need. Nothing you don&apos;t.
            </h2>
            {/* Mobile headline */}
            <h2 className="md:hidden font-display text-3xl font-bold text-gray-900 leading-tight">
              Benefits that matter
            </h2>
          </div>

          {/* Carousel - Desktop: horizontal scroll on vertical, Mobile: native horizontal scroll */}
          <div
            ref={carouselRef}
            className="flex gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none"
          >
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="benefit-card flex-shrink-0 w-[85vw] md:w-[calc(55%-12px)] lg:w-[calc(60%-12px)] relative rounded-[24px] overflow-hidden snap-start transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
              >
                {/* Image Background */}
                <div className="relative aspect-[4/5] md:aspect-[16/10]">
                  {/* Base Background Image - Full Coverage */}
                  <img
                    src="/7f1e6fdcab538721bd5209e2c306b0ab004ed70a.png"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Benefit Image Layer */}
                  <img
                    src={benefit.image}
                    alt={benefit.badge}
                    className="absolute inset-0 w-full h-full object-cover brightness-[0.9]"
                  />

                  {/* Bottom Gradient Overlay for text visibility */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[55%]"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(33, 33, 33, 0) 0%, rgba(33, 33, 33, 0.4) 30%, rgba(33, 33, 33, 0.75) 60%, #212121 100%)",
                    }}
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
                      <h3 className="font-display text-lg md:text-2xl lg:text-[40px] font-bold text-[#AEFFD8] mb-1 leading-tight">
                        {benefit.headline}
                      </h3>
                      <p className="text-base md:text-xl lg:text-[40px] font-bold text-[#FFFCDC] leading-tight">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
