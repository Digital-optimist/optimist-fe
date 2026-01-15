"use client";

import { HeroSection } from "@/components/landing/HeroSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { FeaturesShowcaseSection } from "@/components/landing/FeaturesShowcaseSection";
import { EngineeredSection } from "@/components/landing/EngineeredSection";
import { MadeSimpleSection } from "@/components/landing/MadeSimpleSection";
import { OptimistAppSection } from "@/components/landing/OptimistAppSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { ProductPickerSection } from "@/components/landing/ProductPickerSection";
import { CTASection } from "@/components/landing/CTASection";
import { IndiaFirstSection } from "@/components/landing/IndiaFirstSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <FeaturesShowcaseSection />
      <EngineeredSection />
      <MadeSimpleSection />
      <OptimistAppSection />
      <TestimonialsSection />
      <ProductPickerSection />
      <CTASection />
      <IndiaFirstSection />
    </>
  );
}
