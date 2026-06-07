"use client";

import dynamic from "next/dynamic";
import { ProductsProvider } from "@/contexts/ProductsContext";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HeroSection } from "@/components/home/HeroSection";
import type { BlogArticle, HomePageContent, Product } from "@/lib/shopify";

// Below-the-fold: lazy-loaded so they stay out of the hero's critical path.
const BenefitsSection = dynamic(() =>
  import("@/components/home/BenefitsSection").then((m) => ({
    default: m.BenefitsSection,
  })),
);

const ProductDisplaySection = dynamic(() =>
  import("@/components/home/ProductDisplaySection").then((m) => ({
    default: m.ProductDisplaySection,
  })),
);

const InsideTechSection = dynamic(() =>
  import("@/components/home/InsideTechSection").then((m) => ({
    default: m.InsideTechSection,
  })),
);

const AppFeaturesSection = dynamic(() =>
  import("@/components/home/AppFeaturesSection").then((m) => ({
    default: m.AppFeaturesSection,
  })),
);

const ComparisonSection = dynamic(() =>
  import("@/components/home/ComparisonSection").then((m) => ({
    default: m.ComparisonSection,
  })),
);

const SocialProofSection = dynamic(() =>
  import("@/components/home/SocialProofSection").then((m) => ({
    default: m.SocialProofSection,
  })),
);

const MeetFamilySection = dynamic(() =>
  import("@/components/home/MeetFamilySection").then((m) => ({
    default: m.MeetFamilySection,
  })),
);

const OptimistLabSection = dynamic(() =>
  import("@/components/home/OptimistLabSection").then((m) => ({
    default: m.OptimistLabSection,
  })),
);

const HomeFooter = dynamic(() =>
  import("@/components/home/HomeFooter").then((m) => ({
    default: m.HomeFooter,
  })),
);

interface HomePageClientProps {
  content: HomePageContent | null;
  products: Product[];
  articles: BlogArticle[];
}

export default function HomePageClient({
  content,
  products,
  articles,
}: HomePageClientProps) {
  // LayoutContent already wraps page children in a <main>, so we render the
  // header + sections as siblings here (no extra landmark). The header is
  // `fixed`, so it sits above the hero regardless of DOM order.
  return (
    <ProductsProvider initialProducts={products}>
      <HomeHeader />
      <HeroSection hero={content?.hero ?? null} />
      <BenefitsSection />
      <ProductDisplaySection content={content?.productDisplay ?? null} />
      <InsideTechSection content={content?.insideTech ?? null} />
      <AppFeaturesSection content={content?.appFeatures ?? null} />
      <ComparisonSection content={content?.comparison ?? null} />
      <SocialProofSection content={content?.reviews ?? null} />
      <MeetFamilySection />
      <OptimistLabSection articles={articles} />
      <HomeFooter />
    </ProductsProvider>
  );
}
