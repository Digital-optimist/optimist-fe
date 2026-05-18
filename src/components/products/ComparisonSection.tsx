"use client";

import { memo } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ASSETS } from "@/lib/assets";
import { CheckCircleIcon, XCircleIcon } from "@/components/icons/ProductIcons";
import { viewportOnce } from "@/lib/motion-variants";

const sectionStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const titlesReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const rowsStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const rowReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const imagesReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

// =============================================================================
// Constants
// =============================================================================

const COMPARISON_DATA = [
  {
    category: "Extreme heat cooling",
    optimist: "Tested to deliver full cooling at 50°C",
    market: "Only claims, rarely tested beyond 43°C",
  },
  {
    category: "Turbo cooling",
    optimist: "Turbo+ delivers real 1.9 Ton cooling in a 1.4 Ton AC",
    market: "Turbo mostly increases fan speed",
  },
  {
    category: "Energy efficiency",
    optimist: "Lower electricity bills even in peak summer (ISEER rated)",
    market: "Efficiency drops, bills rise in peak heat",
  },
  {
    category: "Gas visibility",
    optimist: "Built-in Gas Level Indicator. No guesswork.",
    market: "No gas visibility, service dependent",
  },
  {
    category: "Warranty",
    optimist: "5 Years All-Inclusive Warranty. No hidden charges.",
    market: "Hidden charges, AMC push",
  },
  {
    category: "Durability",
    optimist: "1000-hour salt spray tested",
    market: "~72-hour salt spray testing",
  },
] as const;

// =============================================================================
// Component
// =============================================================================

export const ComparisonSection = memo(function ComparisonSection() {
  return (
    <motion.section
      className="relative w-full"
      aria-labelledby="comparison-heading"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={sectionStagger}
    >
      {/* Gradient Background Section */}
      <div className="relative overflow-hidden">
        {/* Background Split */}
        <div className="absolute inset-0 flex" aria-hidden="true">
          <div className="w-1/2 bg-[#3478F6]" />
          <div className="w-1/2 bg-[#212121]" />
        </div>

        {/* Shadow/Wave Background Image - covers the full section */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          {/* Use a wrapper div to handle the overflow sizing from Figma */}
          <div
            className="absolute"
            style={{
              width: "110.59%",
              height: "100%",
              left: "-5.3%",
              top: 0,
            }}
          >
            {/* Plain <img> + srcset because output:"export" + custom loader
                can't generate responsive variants for local assets. The
                mobile variant is roughly 50% the byte weight of the desktop
                source — meaningful since this is a decorative below-fold
                background. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ASSETS.comparisonShadowBg}
              srcSet={`${ASSETS.comparisonShadowBgMobile} 800w, ${ASSETS.comparisonShadowBg} 1200w`}
              sizes="100vw"
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-top object-cover opacity-[0.3]"
            />
          </div>
        </div>

        {/* Section Headline */}
        {/* <div className="text-center">
          <p className="text-white/60 text-sm md:text-base mb-2">Comparison</p>
          <h2
            id="comparison-heading"
            className="font-display text-2xl md:text-4xl lg:text-5xl font-semibold text-white"
          >
            Designed for real use
          </h2>
        </div> */}

        {/* Content */}
        <div className="relative z-[10] w-full max-w-[1440px] mx-auto pt-10 md:pt-[53px] pb-[90px] md:pb-[175px]">
          <motion.div
            className="flex will-change-transform"
            variants={titlesReveal}
          >
            <div className="w-1/2 px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16">
              <h3 className="font-display text-[28px] md:text-[48px] lg:text-[64px] font-semibold md:font-bold text-white text-right tracking-wide md:tracking-normal mb-4 md:mb-6 lg:mb-10">
                Optimist AC
              </h3>
            </div>
            <div className="w-1/2 px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16">
              <h3 className="font-display text-[28px] md:text-[48px] lg:text-[64px] font-semibold md:font-bold text-white/60 text-left tracking-wide md:tracking-normal mb-4 md:mb-6 lg:mb-10">
                Market AC
              </h3>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col gap-3 md:gap-6 will-change-transform"
            variants={rowsStagger}
          >
            {COMPARISON_DATA.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-stretch"
                variants={rowReveal}
              >
                {/* Left - Benefit */}
                <div className="w-1/2 flex justify-end items-stretch px-2 sm:px-4 md:px-4 lg:px-6 xl:px-8">
                  <div className="flex items-center justify-end gap-1.5 sm:gap-2 md:gap-2.5 bg-white/[0.12] rounded-lg md:rounded-xl px-2 sm:px-3 md:px-3 py-1 sm:py-1.5 md:py-2 w-full md:w-fit md:max-w-[320px]">
                    <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-white font-medium text-right leading-tight">
                      {item.optimist}
                    </p>
                    <CheckCircleIcon className="w-4 h-4 md:w-5 lg:w-6 md:h-5 lg:h-6 flex-shrink-0" />
                  </div>
                </div>
                {/* Right - Drawback */}
                <div className="w-1/2 flex justify-start items-stretch px-2 sm:px-4 md:px-4 lg:px-6 xl:px-8">
                  <div className="flex items-center justify-start gap-1.5 sm:gap-2 md:gap-2.5 bg-white/[0.12] rounded-lg md:rounded-xl px-2 sm:px-3 md:px-3 py-1 sm:py-1.5 md:py-2 w-full md:w-fit md:max-w-[320px]">
                    <XCircleIcon className="w-4 h-4 md:w-5 lg:w-6 md:h-5 lg:h-6 flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-white font-medium text-left leading-tight">
                      {item.market}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="relative bg-white h-[95px] md:h-[200px] lg:min-h-[350px]" />

      <motion.div
        className="absolute bottom-0 left-0 right-5 md:right-10 lg:right-[60px] z-[20] will-change-transform"
        variants={imagesReveal}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12">
          <div className="relative w-full h-[200px] md:h-[450px] lg:h-[650px]">
            <Image
              src={ASSETS.acComparison}
              alt="Optimist AC vs Market AC comparison"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1440px) 90vw, 1440px"
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
});
