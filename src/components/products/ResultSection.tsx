"use client";

import { memo, type ReactNode } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { SnowflakeIcon } from "@/components/icons/ProductIcons";
import type { ResultSectionItem } from "@/lib/shopify";
import { viewportOnce } from "@/lib/motion-variants";

const sectionStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const titleReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const cardsStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

// =============================================================================
// Types
// =============================================================================

interface ResultFeature {
  icon: ReactNode;
  title: string;
  description: string;
}

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
// Props
// =============================================================================

interface ResultSectionProps {
  heading?: string;
  items?: ResultSectionItem[];
}

// =============================================================================
// Main Component
// =============================================================================

export const ResultSection = memo(function ResultSection({
  heading,
  items,
}: ResultSectionProps) {
  const features: ResultFeature[] =
    items && items.length > 0
      ? items.map((item) => ({
          icon: item.iconUrl ? (
            <Image
              src={item.iconUrl}
              alt={item.heading}
              width={24}
              height={24}
              className="w-5 h-5 sm:w-6 sm:h-6"
              unoptimized
            />
          ) : (
            <SnowflakeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#3478F6]" />
          ),
          title: item.heading,
          description: item.subHeading,
        }))
      : [];

  return (
    <motion.section
      className="w-full pb-8 xs:pb-10 sm:pb-12 md:pb-16 lg:pb-20 xl:pb-24 mt-[0px] xs:mt-[0px] sm:mt-[-16px] md:mt-[-64px] lg:mt-[-80px] xl:mt-[-96px] bg-white"
      aria-labelledby="result-heading"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={sectionStagger}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 xs:px-5 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <motion.h2
          id="result-heading"
          className="font-display text-2xl md:text-4xl lg:text-[40px] font-semibold text-black text-center leading-tight tracking-wide md:tracking-normal mb-5 md:mb-8 lg:mb-10"
          variants={titleReveal}
        >
          {heading ?? "The Result."}
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-[26px] w-full max-w-[400px] sm:max-w-none mx-auto"
          variants={cardsStagger}
        >
          {features.map((feature, index) => (
            <motion.div key={index} className="w-full" variants={cardReveal}>
              <FeatureCard feature={feature} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
});
