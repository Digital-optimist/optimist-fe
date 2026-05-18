"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { LandingContentProvider } from "@/contexts/LandingContentContext";
import { ProductsProvider } from "@/contexts/ProductsContext";
import type { LandingPageContent } from "@/lib/shopify";

const BenefitsSection = dynamic(
  () => import("@/components/landing/BenefitsSection").then((m) => ({ default: m.BenefitsSection })),
);
const FeaturesShowcaseSection = dynamic(
  () => import("@/components/landing/FeaturesShowcaseSection").then((m) => ({ default: m.FeaturesShowcaseSection })),
);
const OptimistAppSection = dynamic(
  () => import("@/components/landing/OptimistAppSection").then((m) => ({ default: m.OptimistAppSection })),
);
const MadeSimpleSection = dynamic(
  () => import("@/components/landing/MadeSimpleSection").then((m) => ({ default: m.MadeSimpleSection })),
);
const EngineeredSection = dynamic(
  () => import("@/components/landing/EngineeredSection").then((m) => ({ default: m.EngineeredSection })),
);
const TestimonialsSection = dynamic(
  () => import("@/components/landing/TestimonialsSection").then((m) => ({ default: m.TestimonialsSection })),
);
const ProductPickerSection = dynamic(
  () => import("@/components/landing/ProductPickerSection").then((m) => ({ default: m.ProductPickerSection })),
);
const CTASection = dynamic(
  () => import("@/components/landing/CTASection").then((m) => ({ default: m.CTASection })),
);
const IndiaFirstSection = dynamic(
  () => import("@/components/landing/IndiaFirstSection").then((m) => ({ default: m.IndiaFirstSection })),
);

const easeOutExpo = "easeOut" as const;

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

interface HomePageClientProps {
  initialContent: LandingPageContent | null;
}

export default function HomePageClient({ initialContent }: HomePageClientProps) {
  const landingContent = initialContent;
  // Fade the page in on mount via opacity transition on a plain <main>.
  // We don't use a motion component here because Framer Motion adds
  // `will-change: transform` to motion elements, and that on an ancestor
  // breaks `position: fixed` / `position: sticky` descendants — which we
  // need intact for BenefitsSection and FeaturesShowcaseSection scroll pins.
  const [mainOpacity, setMainOpacity] = useState(0);
  useEffect(() => {
    setMainOpacity(1);
  }, []);

  return (
    <LandingContentProvider content={landingContent}>
    <ProductsProvider>
    <main
      style={{
        opacity: mainOpacity,
        transition: "opacity 0.4s ease-out",
      }}
    >
      <HeroSection
        headingLine1={landingContent?.heroHeadingLine1}
        headingLine2={landingContent?.heroHeadingLine2}
        badges={landingContent?.heroBadges}
      />
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
        <TestimonialsSection testimonials={landingContent?.testimonials} />
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
    </main>
    </ProductsProvider>
    </LandingContentProvider>
  );
}
