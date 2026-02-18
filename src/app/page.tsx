"use client";

import { motion } from "framer-motion";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { CTASection } from "@/components/landing/CTASection";
import { EngineeredSection } from "@/components/landing/EngineeredSection";
import { FeaturesShowcaseSection } from "@/components/landing/FeaturesShowcaseSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { IndiaFirstSection } from "@/components/landing/IndiaFirstSection";
import { MadeSimpleSection } from "@/components/landing/MadeSimpleSection";
import { OptimistAppSection } from "@/components/landing/OptimistAppSection";
import { ProductPickerSection } from "@/components/landing/ProductPickerSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";

// Easing
const easeOutExpo = "easeOut" as const;

// Page transition variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.4, ease: easeOutExpo },
  },
  exit: { opacity: 0 },
};

// Staggered section reveal
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.6,
      ease: easeOutExpo,
    },
  }),
};

export default function HomePage() {
  return (
    <motion.main
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Hero Section - Immediate display, no delay */}
      <HeroSection />
      {/* BenefitsSection handles its own scroll-triggered reveal via GSAP */}
      <BenefitsSection />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        custom={1}
        variants={sectionVariants}
      >
        <FeaturesShowcaseSection />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        custom={4}
        variants={sectionVariants}
      >
        <OptimistAppSection />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        custom={3}
        variants={sectionVariants}
      >
        <MadeSimpleSection />
      </motion.div>{" "}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        custom={2}
        variants={sectionVariants}
      >
        <EngineeredSection />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        custom={5}
        variants={sectionVariants}
      >
        <TestimonialsSection />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        custom={6}
        variants={sectionVariants}
      >
        <ProductPickerSection />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        custom={7}
        variants={sectionVariants}
      >
        <CTASection />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        custom={8}
        variants={sectionVariants}
      >
        <IndiaFirstSection />
      </motion.div>
    </motion.main>
  );
}
