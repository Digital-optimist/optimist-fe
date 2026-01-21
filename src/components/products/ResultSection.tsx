"use client";

import { memo, type ReactNode } from "react";
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
    icon: <SnowflakeIcon className="w-6 h-6 text-[#3478F6]" />,
    title: "Consistent Cooling",
    description: "Steady temperature throughout the day, even in peak summer",
  },
  {
    icon: <PiggyBankIcon className="w-6 h-6 text-[#3478F6]" />,
    title: "Lower Running Cost Over Time",
    description: "Energy-efficient design that saves on electricity bills",
  },
  {
    icon: <PersonWalkIcon className="w-6 h-6 text-[#3478F6]" />,
    title: "Less Effort To Manage",
    description: "Smart controls that adapt to your comfort automatically",
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
    <div className="bg-black/[0.04] flex flex-col gap-2 md:gap-3 items-center p-4 md:p-6 rounded-xl w-full md:w-[436px] flex-shrink-0">
      {/* Icon Container */}
      <div className="bg-[rgba(52,120,246,0.12)] flex items-center justify-center rounded-full w-11 h-11 md:w-12 md:h-12">
        {feature.icon}
      </div>
      
      {/* Text Content */}
      <div className="flex flex-col gap-1 md:gap-2 items-center text-center">
        <h3 className="font-display text-base md:text-2xl font-semibold text-black">
          {feature.title}
        </h3>
        <p className="text-sm md:text-base text-[#6c6a6a] font-light">
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
  return (
    <section 
      className="w-full py-12 md:py-16 lg:py-20 bg-white"
      aria-labelledby="result-heading"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12">
        {/* Title */}
        <h2 
          id="result-heading"
          className="font-display text-[32px] md:text-[40px] font-semibold text-black text-center mb-7 md:mb-10"
        >
          Result
        </h2>
        
        {/* Feature Cards Container */}
        {/* Mobile: Vertical stack, Desktop: Horizontal row */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-[26px] items-center justify-center">
          {RESULT_FEATURES.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
});
