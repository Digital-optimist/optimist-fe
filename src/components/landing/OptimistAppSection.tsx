"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const features = [
  {
    id: 1,
    title: "Live Energy Meter",
    description: "Track. Predict. Save.",
    icon: "/EnergeMeter.png",
    position: { top: "8%", left: "8%" },
  },
  {
    id: 2,
    title: "Gas Level Indicator",
    description: "Know before it's an issue.",
    icon: "/EnergeMeter.png",
    position: { top: "8%", right: "8%" },
  },
  {
    id: 3,
    title: "Projected Monthly Bills",
    description: "No surprises. Just real numbers.",
    icon: "/Stats.png",
    position: { top: "50%", left: "4%", transform: "translateY(-50%)" },
  },
  {
    id: 4,
    title: "Intelligence Service Assistance",
    description: "Diagnose remotely. Service seamlessly",
    icon: "/EnergeMeter.png",
    position: { top: "50%", right: "4%", transform: "translateY(-50%)" },
  },
  {
    id: 5,
    title: "Filter Health",
    description: "Clean when needed. No more guessing.",
    icon: "/EnergeMeter.png",
    position: { bottom: "8%", left: "12%" },
  },
  {
    id: 6,
    title: "Scheduling",
    description: "Start or stop automatically, on your time.",
    icon: "/EnergeMeter.png",
    position: { bottom: "8%", right: "12%" },
  },
];

const mobileFeatures = features;

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="feature-card bg-white rounded-[18px] p-4 shadow-[0_2px_16px_rgba(0,0,0,0.08)] flex items-start gap-3 min-w-[270px] max-w-[280px]">
      {/* Icon */}
      <div className="w-[56px] h-[56px] rounded-[12px] overflow-hidden flex-shrink-0 bg-gray-900">
        <Image
          src={icon}
          alt={title}
          width={56}
          height={56}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Text */}
      <div className="flex-1 min-w-0">
        <h4 className="text-[15px] font-bold text-gray-900 leading-tight mb-1.5">
          {title}
        </h4>
        <p className="text-[13px] text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export function OptimistAppSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Batch all animations into a single timeline with one ScrollTrigger
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
          ease: "power3.out",
        },
        0
      );

      // Phone animation
      tl.fromTo(
        phoneRef.current,
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        },
        0.2
      );

      // Feature cards stagger animation
      const cards = featuresRef.current?.querySelectorAll(".feature-card");
      if (cards) {
        tl.fromTo(
          cards,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            stagger: 0.12,
            duration: 0.6,
            ease: "back.out(1.2)",
          },
          0.4
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="bg-white py-12 md:py-16 lg:py-20 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Main Card Container */}
        <div className="bg-gradient-to-b from-[#EEF2F6] to-[#E8EDF3] rounded-[32px] md:rounded-[40px] p-8 md:p-12 lg:p-16 relative overflow-hidden">
          {/* Subtle blue glow background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 55%, rgba(190, 210, 240, 0.5) 0%, transparent 65%)",
            }}
          />

          {/* Header */}
          <div
            ref={headerRef}
            className="text-center mb-12 md:mb-16 lg:mb-20 relative z-10"
          >
            <h2 className="font-display text-4xl md:text-5xl lg:text-[56px] font-bold text-gray-900 mb-3 md:mb-4">
              Optimist App
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Your full-control panel, right in your hand.
            </p>
          </div>

          {/* Desktop Layout - Phone with floating cards */}
          <div className="hidden lg:block relative z-10">
            <div
              ref={featuresRef}
              className="relative flex items-center justify-center min-h-[650px]"
            >
              {/* Elliptical ring/border around phone */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  width: "920px",
                  height: "580px",
                  border: "1.5px solid rgba(180, 200, 230, 0.35)",
                  borderRadius: "50%",
                }}
              />

              {/* Feature Cards - Absolutely positioned */}
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="feature-card absolute"
                  style={feature.position}
                >
                  <FeatureCard
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                  />
                </div>
              ))}

              {/* Center - Phone with Hand */}
              <div
                ref={phoneRef}
                className="relative flex-shrink-0 z-10 -mt-8"
              >
                <div className="relative w-[360px]">
                  <Image
                    src="/Hand.png"
                    alt="Optimist App on Phone"
                    width={360}
                    height={580}
                    className="w-full h-auto drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Layout - Stacked */}
          <div className="lg:hidden relative z-10">
            {/* Phone Image */}
            <div ref={phoneRef} className="flex justify-center mb-10">
              <div className="relative w-[260px] md:w-[320px]">
                <Image
                  src="/Hand.png"
                  alt="Optimist App on Phone"
                  width={320}
                  height={520}
                  className="w-full h-auto drop-shadow-2xl"
                  priority
                />
              </div>
            </div>

            {/* Features Carousel */}
            <div
              ref={featuresRef}
              className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:-mx-6 md:px-6 scrollbar-hide"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {mobileFeatures.map((feature) => (
                <div key={feature.id} style={{ scrollSnapAlign: "start" }}>
                  <FeatureCard
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
