import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { getArticles, getHomePageContent, getProducts } from "@/lib/shopify";
import HomePageClient from "./HomePageClient";

// Poppins drives every text element on the /home route (per design). It is
// scoped to this page: the wrapper below re-points the font CSS variables that
// the home sections resolve through (`font-display`/`font-sans` utilities), so
// the rest of the site keeps the ABC Solar family from the root layout. The
// full weight range is loaded so headlines stay bold while body/meta text
// renders at lighter weights, matching the design.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// Override the theme + raw font variables on the home subtree so both the
// Tailwind font utilities and any direct `var(--font-abc-solar*)` usage fall
// back to Poppins.
const HOME_FONT_VARS = {
  "--font-sans": "var(--font-poppins)",
  "--font-display": "var(--font-poppins)",
  "--font-abc-solar": "var(--font-poppins)",
  "--font-abc-solar-display": "var(--font-poppins)",
} as CSSProperties;

export const metadata: Metadata = {
  title: {
    absolute: "Optimist - India’s Real AC | Cools at 50°C. Proven",
  },
  description:
    "India’s highest ISEER-rated AC (6.05), proven to cool at 50°C. Save 25–35% on electricity bills every day. With India’s first gas level indicator and 5-year warranty",
};

export default async function NewHomePage() {
  const [content, products, articlesResult] = await Promise.all([
    getHomePageContent(),
    getProducts(10),
    getArticles(9),
  ]);
  return (
    <div className={poppins.variable} style={HOME_FONT_VARS}>
      <HomePageClient
        content={content}
        products={products}
        articles={articlesResult.articles}
      />
    </div>
  );
}
