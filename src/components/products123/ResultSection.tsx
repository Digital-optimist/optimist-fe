"use client";

import { memo, useRef, useLayoutEffect, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import {
  SnowflakeIcon,
  PiggyBankIcon,
  PersonWalkIcon,
} from "@/components/icons/ProductIcons";

// =============================================================================
// Types
// =============================================================================

interface ResultFeature {
  icon: ReactNode;
  title: string;
  description: string;
}

// =============================================================================
// Constants
// =============================================================================

const RESULT_FEATURES: ResultFeature[] = [
  {
    icon: <SnowflakeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#3478F6]" />,
    title: "Consistent cooling",
    description: "No peaks. No drops.",
  },
  {
    icon: <PiggyBankIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#3478F6]" />,
    title: "Lower running cost",
    description: "Efficiency that holds.",
  },
  {
    icon: <PersonWalkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#3478F6]" />,
    title: "Less to manage",
    description: "It just works.",
  },
];

// =============================================================================
// Feature Card Component
// =============================================================================

interface FeatureCardProps {
  feature: ResultFeature;
}

const FeatureCard = memo(function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <div className="bg-black/[0.04] flex flex-col gap-2 sm:gap-2.5 md:gap-3 items-center p-3 xs:p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl w-full h-full">
      {/* Icon Container */}
      <div className="bg-[rgba(52,120,246,0.12)] flex items-center justify-center rounded-full w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12">
        {feature.icon}
      </div>

      {/* Text Content */}
      <div className="flex flex-col gap-0.5 sm:gap-1 md:gap-2 items-center text-center">
        <h3 className="font-display text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-black leading-tight">
          {feature.title}
        </h3>
        <p className="text-xs xs:text-sm sm:text-sm md:text-base text-[#6c6a6a] font-light leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  );
});

// =============================================================================
// Main Component
// =============================================================================

export const ResultSection = memo(function ResultSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Set initial states to prevent flash
  useLayoutEffect(() => {
    if (titleRef.current) {
      gsap.set(titleRef.current, { opacity: 0, y: 40 });
    }
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll(".result-card");
      gsap.set(cards, { opacity: 0, y: 40 });
    }
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
      tl.to(
        titleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          force3D: true,
        },
        0,
      );

      // Cards stagger animation
      const cards = cardsRef.current?.querySelectorAll(".result-card");
      if (cards) {
        tl.to(
          cards,
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out",
            force3D: true,
          },
          0.2,
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="w-full pb-8 xs:pb-10 sm:pb-12 md:pb-16 lg:pb-20 xl:pb-24 mt-[0px] xs:mt-[0px] sm:mt-[-16px] md:mt-[-64px] lg:mt-[-80px] xl:mt-[-96px] bg-white"
      aria-labelledby="result-heading"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 xs:px-5 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Title */}
        <h2
          ref={titleRef}
          id="result-heading"
          className="font-display text-2xl md:text-4xl lg:text-[40px] font-semibold text-black text-center leading-tight mb-5 md:mb-8 lg:mb-10 will-change-[transform,opacity]"
        >
          The Result.
        </h2>

        {/* Feature Cards Container */}
        {/* Mobile: Single column, Tablet: 2 columns, Desktop: 3 columns row */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-[26px] w-full max-w-[400px] sm:max-w-none mx-auto"
        >
          {RESULT_FEATURES.map((feature, index) => (
            <div
              key={index}
              className="result-card will-change-[transform,opacity] w-full"
            >
              <FeatureCard feature={feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
