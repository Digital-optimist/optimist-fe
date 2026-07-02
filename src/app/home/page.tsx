import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";
import { getLandingPageContent } from "@/lib/shopify";

export const metadata: Metadata = {
  title: {
    absolute: "Optimist - India’s Real AC | Cools at 50°C. Proven",
  },
  description:
    "India’s highest ISEER-rated AC (6.05), proven to cool at 50°C. Save 25–35% on electricity bills every day. With India’s first gas level indicator and 5-year warranty",
};

// The previous landing page, now served at /home (the optimist-styled homepage
// took over /). It keeps the original floating Navigation + Footer, applied by
// LayoutContent for this route.
export default async function LandingPage() {
  const landingContent = await getLandingPageContent();
  return (
    <>
      <HomePageClient initialContent={landingContent} />
    </>
  );
}
