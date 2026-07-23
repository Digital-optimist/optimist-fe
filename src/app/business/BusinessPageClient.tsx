"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { BusinessHeader } from "@/components/business/BusinessHeader";
import { BusinessFooter } from "@/components/business/BusinessFooter";
import { HeroSection } from "@/components/business/HeroSection";
import { TrustedBySection } from "@/components/business/TrustedBySection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { SavingsCalculatorSection } from "@/components/business/SavingsCalculatorSection";
import { BusinessOpportunitySection } from "@/components/business/BusinessOpportunitySection";
import { WhyOptimistSection } from "@/components/business/WhyOptimistSection";
import { SupportSection } from "@/components/business/SupportSection";
import { TestimonialsSection } from "@/components/business/TestimonialsSection";
import { LeadFormSection } from "@/components/business/LeadFormSection";

// Figma hero background: the exact dotted texture (1440×800, transparent, fades
// out downward). It sits behind the transparent header + hero as the single,
// uniform background so the navbar merges with the hero (no seam).
const HERO_BG = "/business/hero-bg.png";

// Composes the /business (commercial) landing page. Like the main home page,
// this route ships its OWN header + footer inside the wrapper (the layout adds
// neither — see LayoutContent), so the header sits on the same dotted
// background as the hero and there's no seam between them. Sections self-animate
// on scroll-into-view; the page fades in on mount.
//
// `overflow-x-clip` (not `overflow-hidden`) keeps the wrapper from becoming a
// scroll container, which would break the header's sticky-on-scroll behaviour.
export default function BusinessPageClient() {
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    setOpacity(1);
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-white text-[#212121]"
      style={{ opacity, transition: "opacity 0.4s ease-out" }}
    >
      {/* Centred + min-width so the dot texture stays at (near-)native scale on
          narrow screens instead of being squeezed into noise; the overflow is
          clipped by the wrapper's overflow-x-clip. Desktop is already ≥922px so
          it spans full width as before. */}
      <img
        src={HERO_BG}
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 w-full min-w-[922px] -translate-x-1/2 select-none"
      />

      <BusinessHeader />

      <div className="relative z-10 overflow-hidden">
        <HeroSection />
        <TrustedBySection />
        {/* Reuses the home page's polished "Built for Indian heat" bento
            (BenefitsSection). Wrapped to keep the #solutions nav anchor and to
            override the home's large top padding (md:pt-50) with this page's own
            py-[100px] section rhythm, so the gaps around it match the rest. */}
        <div
          id="solutions"
          className="scroll-mt-28 [&>section]:py-14 md:[&>section]:py-[100px]"
        >
          <BenefitsSection />
        </div>
        <SavingsCalculatorSection />
        <BusinessOpportunitySection />
        <WhyOptimistSection />
        <SupportSection />
        <TestimonialsSection />
        <LeadFormSection />
      </div>

      <BusinessFooter />
    </div>
  );
}
