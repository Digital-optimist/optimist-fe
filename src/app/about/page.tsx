"use client";

import { motion } from "framer-motion";
import {
  AboutHeroSection,
  BreathworkSection,
  MissionSection,
  ProofOfWorkSection,
  TimelineSection,
  CoreTeamSection,
  SupportersSection,
  FutureSection,
  CTASection,
} from "@/components/about";

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
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.7,
      ease: easeOutExpo,
    },
  }),
};

// Slide from left variant
const slideFromLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: easeOutExpo,
    },
  },
};

// Slide from right variant
const slideFromRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: easeOutExpo,
    },
  },
};

// Scale up variant
const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easeOutExpo,
    },
  },
};

export default function AboutPage() {
  return (
    <motion.main
      className="bg-white min-h-screen overflow-x-hidden"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Hero Section - Immediate display */}
      <AboutHeroSection />

      {/* Animated sections with various effects */}
      <BreathworkSection />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={slideFromRight}
      >
        <MissionSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        custom={0}
        variants={sectionVariants}
      >
        <ProofOfWorkSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={scaleUp}
      >
        <TimelineSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={slideFromLeft}
      >
        <CoreTeamSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={scaleUp}
      >
        <SupportersSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        custom={1}
        variants={sectionVariants}
      >
        <FutureSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={scaleUp}
      >
        <CTASection />
      </motion.div>
    </motion.main>
  );
}
