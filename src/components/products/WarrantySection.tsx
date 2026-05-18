"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ASSETS } from "@/lib/assets";
import { viewportOnce } from "@/lib/motion-variants";

const sectionStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const blockReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

// =============================================================================
// Types
// =============================================================================

interface WarrantyFeature {
  id: number;
  text: {
    regular: string;
    bold: string;
    position: "start" | "end" | "middle";
  };
}

// =============================================================================
// Constants
// =============================================================================

const WARRANTY_FEATURES: WarrantyFeature[] = [
  {
    id: 1,
    text: {
      bold: "5-year comprehensive warranty",
      regular: " covering outdoor unit and critical indoor components.",
      position: "start",
    },
  },
  {
    id: 2,
    text: {
      bold: "10-year compressor protection",
      regular: " for long-term cooling reliability.",
      position: "start",
    },
  },
  {
    id: 3,
    text: {
      bold: "Preventive care included",
      regular: " with scheduled service and proactive system monitoring.",
      position: "start",
    },
  },
];

// =============================================================================
// Feature Item Component
// =============================================================================

const FeatureItem = memo(function FeatureItem({ feature }: { feature: WarrantyFeature }) {
  return (
    <div className="bg-[rgba(0,0,0,0.04)] flex items-center gap-2 md:gap-4 p-2.5 md:px-5 md:py-8 rounded-xl w-full">
      <Image
        src={ASSETS.warrantyCheck}
        alt="Check"
        width={40}
        height={40}
        className="w-6 h-6 md:w-10 md:h-10 shrink-0"
      />
      <p className="text-sm md:text-xl text-black leading-normal">
        {feature.text.position === "start" ? (
          <>
            <span className="font-semibold">{feature.text.bold}</span>
            <span>{feature.text.regular}</span>
          </>
        ) : feature.text.position === "end" ? (
          <>
            <span>{feature.text.regular} </span>
            <span className="font-semibold">{feature.text.bold}</span>
          </>
        ) : (
          <>
            <span>{feature.text.regular}</span>
            <span className="font-semibold">{feature.text.bold}</span>
          </>
        )}
      </p>
    </div>
  );
});

// =============================================================================
// Main Component
// =============================================================================

export const WarrantySection = memo(function WarrantySection() {
  return (
    <motion.section
      className="w-full py-12 md:py-20 lg:py-24 bg-white"
      aria-labelledby="warranty-heading"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={sectionStagger}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10">
        <motion.div className="mb-6 md:mb-11" variants={blockReveal}>
          <div className="flex items-start justify-between">
            <div>
              {/* Subtitle */}
              <p className="text-[#3478F6] text-base md:text-xl font-normal mb-2 md:mb-2.5">
                Warranty and T&C
              </p>
              
              {/* Title */}
              <h2 
                id="warranty-heading"
                className="font-display font-semibold text-2xl md:text-4xl lg:text-[40px] text-black leading-tight tracking-wide md:tracking-normal"
              >
                Ownership without worry.
              </h2>
            </div>

            {/* Learn more CTA - Desktop */}
            <Link
              href="/warranty"
              className="hidden md:inline-flex items-center justify-center px-8 py-3 bg-[#3478F6] text-white text-base font-medium rounded-full hover:bg-[#2a60c8] transition-colors shrink-0"
            >
              Learn more
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="border border-[rgba(0,0,0,0.12)] rounded-2xl md:rounded-3xl overflow-hidden md:h-[545px]"
          variants={blockReveal}
        >
          <div className="flex flex-col md:flex-row items-center md:items-center md:justify-between p-4 md:pl-5 md:pr-0 md:py-10 gap-[18px] md:gap-4">
            {/* Warranty Card Image — source is pre-cropped to the visible region. */}
            <div className="relative w-[200px] md:w-[326px] h-[285px] md:h-[465px] shrink-0 overflow-hidden">
              <Image
                src={ASSETS.warrantyCard}
                alt="Optimist Warranty Card - Peace of mind, built in"
                fill
                sizes="(min-width: 768px) 326px, 200px"
                className="object-cover"
              />
            </div>

            {/* Features and Tagline */}
            <div className="flex flex-col gap-6 md:gap-10 w-full md:flex-1 md:max-w-[974px]">
              {/* Feature Items */}
              <div className="flex flex-col gap-2">
                {WARRANTY_FEATURES.map((feature) => (
                  <FeatureItem key={feature.id} feature={feature} />
                ))}
              </div>

              {/* Gradient Tagline */}
              <p 
                className="font-display font-semibold text-xl md:text-[40px] leading-tight tracking-wide md:tracking-normal bg-gradient-to-r from-[#3478F6] to-[#1E4690] bg-clip-text"
                style={{ WebkitTextFillColor: "transparent" }}
              >
                Optimist is built to stay reliable over years of use.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex md:hidden mt-6">
          <Link
            href="/warranty"
            className="inline-flex items-center justify-center gap-2 w-full py-4 border border-[rgba(0,0,0,0.12)] text-[#3478F6] text-base font-medium rounded-full transition-colors"
          >
            Learn more
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </motion.section>
  );
});
