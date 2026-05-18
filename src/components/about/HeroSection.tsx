"use client";

import { motion, type Variants } from "framer-motion";
import { ASSETS } from "@/lib/assets";
import { staggerParent, viewportOnce } from "@/lib/motion-variants";

const stagger = staggerParent(0.2);

const titleReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

// =============================================================================
// About Hero Section - "Cooling, built for a warming world."
// =============================================================================

export function AboutHeroSection() {
  return (
    <motion.section
      className="bg-white pt-24 pb-12 md:pb-16 lg:pb-20 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={stagger}
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12">
        <motion.h1
          className="font-display text-[32px] md:text-[48px] lg:text-[64px] font-bold text-center mb-6 md:mb-8 lg:mb-10"
          variants={titleReveal}
        >
          <span className="text-black">Real Cooling for a </span>
          <span className="text-[#3478F6]">Warming India</span>
        </motion.h1>

        <motion.div
          className="relative w-full max-w-[1344px] mx-auto rounded-[32px] overflow-hidden"
          variants={cardReveal}
        >
          {/* Desktop Layout - 556px height */}
          <div className="hidden md:block relative w-full h-[450px] lg:h-[556px]">
            <video
              src={ASSETS.discussionVideo}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            {/* Text overlay */}
            <div className="absolute left-[48px] bottom-[48px] lg:bottom-[64px] max-w-[900px]">
              <p className="font-light text-[20px] lg:text-[24px] leading-[1.5] text-white">
                India isn’t getting cooler. Summers are getting harsher, heat
                lasts longer, and cooling is becoming a major energy expense at
                home. Yet most air conditioners aren’t built for real Indian
                heat. Optimist exists to change that by building India’s Real
                AC; delivering best cooling, lowest bills, and designed for
                tomorrow.
              </p>
            </div>
          </div>

          {/* Mobile Layout - 402px height */}
          <div className="md:hidden relative w-full h-[362px]">
            <video
              src={ASSETS.discussionVideo}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute bottom-0 left-0 right-0 h-[220px] bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            {/* Text overlay */}
            <div className="absolute left-[16px] right-[16px] bottom-[24px]">
              <p className="font-light text-[15px] leading-[1.5] text-white">
                India isn’t getting cooler. Summers are getting harsher, heat
                lasts longer, and cooling is becoming a major energy expense at
                home. Yet most air conditioners aren’t built for real Indian
                heat. Optimist exists to change that by building India’s Real
                AC; delivering best cooling, lowest bills, and designed for
                tomorrow.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default AboutHeroSection;
