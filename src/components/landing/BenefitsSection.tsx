"use client";

import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ASSETS } from "@/lib/assets";

const benefits = [
  {
    id: 2,
    badge: "Cooling fails in peak summer?",
    headline: "Tested to cool at 50°C.",
    description: "No performance drop when others derate.",
    image: ASSETS.b2,
  },
  {
    id: 1,
    badge: "Worried about AC bill shocks?",
    headline: "India's Most Energy-Efficient AC.",
    description: "Lowest electricity consumption every single day.",
    image: ASSETS.b1,
  },

  {
    id: 3,
    badge: "Cooling taking forever?",
    headline: "2 Tons of Cooling in 1.5 Tons.",
    description: "Exclusive Turbo+ Mode for instant cooling.",
    image: ASSETS.b3,
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
      const isCurrentlyMobile =
        typeof window !== "undefined" && window.innerWidth < 768;

      // Skip horizontal scroll on mobile - use native scroll instead
      if (isMobile || isCurrentlyMobile) {
        // Simple fade-in animation for mobile - use 'to' since initial state is set
        const headerTrigger = gsap.to(headerRef.current, {
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
        }).scrollTrigger;
        if (headerTrigger) triggers.push(headerTrigger);

        // Cleanup only our triggers
        return () => {
          triggers.forEach((trigger) => trigger.kill());
        };
      }

      const carousel = carouselRef.current;
      const section = sectionRef.current;
      if (!carousel || !section) return;

      const gap = 24; // gap-6 = 24px
      let scrollDistance = 0;
      let bufferRatio = 0;
      let totalScrollDistance = 0;

      const updateMetrics = () => {
        // Get the total scroll width needed
        const cards = carousel.querySelectorAll(".benefit-card");
        const cardWidth = cards[0]?.getBoundingClientRect().width || 0;
        const totalWidth = (cardWidth + gap) * cards.length - gap;

        // Use the actual carousel container width instead of full viewport
        const containerWidth =
          carousel.parentElement?.getBoundingClientRect().width ||
          window.innerWidth;

        // Calculate scroll distance: scroll enough to show the last card fully visible
        // Add small padding (15% of card width) for breathing room
        scrollDistance = Math.max(
          totalWidth - containerWidth + cardWidth * 0.15,
          0,
        );

        // Buffer zone: extra scroll distance at the start where first card stays visible
        // This gives users time to view the first card before horizontal scroll begins
        const bufferDistance = window.innerHeight * 0.4; // 40% of viewport height as buffer
        totalScrollDistance = bufferDistance + scrollDistance;
        bufferRatio =
          totalScrollDistance > 0 ? bufferDistance / totalScrollDistance : 0;
      };

      updateMetrics();

      // Header fade in animation - use 'to' since initial state is set
      const headerTrigger = gsap.to(headerRef.current, {
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
      }).scrollTrigger;
      if (headerTrigger) triggers.push(headerTrigger);

      // Horizontal scroll animation - pins and scrolls cards horizontally
      // Smooths the entry by mapping a buffer zone before horizontal movement
      const carouselTween = gsap.to(carousel, {
        x: () => -scrollDistance,
        ease: "none",
        force3D: true,
        paused: true,
      });

      const carouselTrigger = ScrollTrigger.create({
        trigger: triggerRef.current,
        start: "top top", // Pin when section reaches top of viewport
        end: () => `+=${totalScrollDistance}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        refreshPriority: 1,
        onRefresh: () => {
          updateMetrics();
          carouselTween.invalidate();
        },
        onUpdate: (self) => {
          const progress = self.progress;
          const adjusted =
            progress <= bufferRatio || bufferRatio >= 1
              ? 0
              : (progress - bufferRatio) / (1 - bufferRatio);
          carouselTween.progress(adjusted);
        },
      });
      triggers.push(carouselTrigger);

      // Refresh after images load to avoid pin jump on first entry
      const images = carousel.querySelectorAll("img");
      const handleImageLoad = () => ScrollTrigger.refresh();
      images.forEach((img) => {
        if (!img.complete) {
          img.addEventListener("load", handleImageLoad);
        }
      });

      // Cleanup only our triggers, not all triggers
      return () => {
        images.forEach((img) => {
          if (!img.complete) {
            img.removeEventListener("load", handleImageLoad);
          }
        });
        carouselTween.kill();
        triggers.forEach((trigger) => trigger.kill());
      };
    },
    { scope: sectionRef, dependencies: [isMobile] },
  );

  return (
    <section
      id="benefits"
      ref={sectionRef}
      className="relative bg-[#FFFFFF] overflow-x-hidden"
    >
      {/* Trigger wrapper for pinning - only on desktop */}
      <div ref={triggerRef} className="py-8 md:py-12 lg:py-16">
        <div className="mx-auto px-4 md:px-6 lg:px-8 max-w-[1400px] md:max-w-none">
          {/* Section Header */}
          <div ref={headerRef} className="mb-4 will-change-[transform,opacity]">
            <p className="text-sm md:text-base text-[#212121] italic mb-2">
              New Generation of AC
            </p>
            {/* Desktop headline */}
            <h2 className="hidden md:block font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#212121] leading-tight">
              Everything you need. Nothing you don&apos;t.
            </h2>
            {/* Mobile headline */}
            <h2 className="md:hidden font-display text-3xl font-bold text-gray-900 leading-tight">
              Everything you need. Nothing you don&apos;t.
            </h2>
          </div>

          {/* Carousel - Desktop: horizontal scroll on vertical, Mobile: native horizontal scroll */}
          <div
            ref={carouselRef}
            className="flex gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide mx-0 px-4 md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none"
          >
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="benefit-card flex-shrink-0 w-[85vw] md:w-[calc(60%-12px)] lg:w-[calc(70%-12px)] relative rounded-[24px] overflow-hidden snap-start transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
              >
                {/* Image Background */}
                <div className="relative aspect-[4/5] md:aspect-[16/10]">
                  {/* Base Background Image - Full Coverage */}
                  <img
                    src={ASSETS.benefitsBg}
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
