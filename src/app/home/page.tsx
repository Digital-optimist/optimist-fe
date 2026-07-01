import { getArticles, getHomePageContent, getProducts } from "@/lib/shopify";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import HomePageClient from "./HomePageClient";

// Poppins drives body/UI text on the /home route (per design). Titles and big
// display text keep ABC Solar Display. The font itself is loaded once in the
// root layout (exposed as --font-poppins); the wrapper below just re-points the
// body font variables to it for this subtree.

// Force Poppins for body/UI text on the home subtree. `fontFamily` is set
// directly (not just via variables) because unclassed text inherits the
// already-computed family from <body>. `--font-sans`/`--font-abc-solar` are
// re-pointed so those utilities resolve to Poppins; the display variables are
// left untouched so `font-solar` headlines stay ABC Solar Display.
const HOME_FONT_VARS = {
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
  "--font-sans": "var(--font-poppins)",
  "--font-abc-solar": "var(--font-poppins)",
} as CSSProperties;

export const metadata: Metadata = {
  title: {
    absolute: "Optimist - India’s Real AC | Cools at 50°C. Proven",
  },
  description:
    "India’s highest ISEER-rated AC (6.05), proven to cool at 50°C. Save 25–35% on electricity bills every day. With India’s first gas level indicator and 5-year warranty",
};

// Content is fetched from Shopify (metaobjects + live products + blog articles)
// at build time, then rendered through the optimist-website-styled sections.
// Sections fall back to the reference's static copy when a metaobject is absent.
export default async function NewHomePage() {
  const [content, products, articlesResult] = await Promise.all([
    getHomePageContent(),
    getProducts(10),
    getArticles(9),
  ]);

  return (
    <div style={HOME_FONT_VARS}>
      <HomePageClient
        content={content}
        products={products}
        articles={articlesResult.articles}
      />
    </div>
  );
}
