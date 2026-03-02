import { getLandingPageContent } from "@/lib/shopify";
import HomePageClient from "./HomePageClient";

export default async function HomePage() {
  let landingContent = null;
  try {
    landingContent = await getLandingPageContent();
  } catch (error) {
    console.error("Failed to fetch landing page content:", error);
  }

  return <HomePageClient landingContent={landingContent} />;
}
