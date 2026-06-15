"use client";

import { ProductsProvider } from "@/contexts/ProductsContext";
import { HomeAppProvider } from "@/components/home/useApp";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HeroSection } from "@/components/home/HeroSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { ProductDisplaySection } from "@/components/home/ProductDisplaySection";
import { InsideTechSection } from "@/components/home/InsideTechSection";
import { AppFeaturesSection } from "@/components/home/AppFeaturesSection";
import { ComparisonSection } from "@/components/home/ComparisonSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { MeetFamilySection } from "@/components/home/MeetFamilySection";
import { OptimistLabSection } from "@/components/home/OptimistLabSection";
import { HomeFooter } from "@/components/home/HomeFooter";
import type { BlogArticle, HomePageContent, Product } from "@/lib/shopify";

// Faint background "checks" pattern bleeding from the top of the page.
const CHECKS_BG = "/figma/hero-section-bg.svg";

interface HomePageClientProps {
  content: HomePageContent | null;
  products: Product[];
  articles: BlogArticle[];
}

// optimist-website-styled homepage, driven by Shopify integrations. Dynamic
// sections take their copy/data from metaobjects (hero, productDisplay,
// insideTech, appFeatures, comparison, reviews), live products, and blog
// articles; Benefits / MeetFamily / Footer stay static (as before). Each section
// falls back to the reference's static content when its data is absent.
export default function HomePageClient({
  content,
  products,
  articles,
}: HomePageClientProps) {
  return (
    <HomeAppProvider>
      <ProductsProvider initialProducts={products}>
        <div className="min-h-screen relative bg-white text-[#212121]">
          <img
            src={CHECKS_BG}
            alt=""
            aria-hidden
            className="max-w-[1440px] absolute top-0 w-full left-1/2 -translate-x-[58.333%] md:-translate-x-1/2 opacity-80"
          />
          <HomeHeader />

          <div className="overflow-hidden">
            <HeroSection hero={content?.hero ?? null} />
            <BenefitsSection />
            <ProductDisplaySection content={content?.productDisplay ?? null} />
            <InsideTechSection content={content?.insideTech ?? null} />
            <AppFeaturesSection content={content?.appFeatures ?? null} />
            <ComparisonSection content={content?.comparison ?? null} />
            <SocialProofSection content={content?.reviews ?? null} />
            <MeetFamilySection />
            <OptimistLabSection articles={articles} />
          </div>

          <HomeFooter />
        </div>
      </ProductsProvider>
    </HomeAppProvider>
  );
}
