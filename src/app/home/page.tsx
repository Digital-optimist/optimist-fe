import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { getArticles, getHomePageContent, getProducts } from "@/lib/shopify";
import HomePageClient from "./HomePageClient";

// Poppins drives body/UI text on the /home route (per design). Titles and big
// display text keep ABC Solar Display. Scoped to this page: the wrapper below
// re-points only the body font CSS variables (`font-sans`/`--font-abc-solar`)
// to Poppins, while the display variables are left untouched so they inherit
// ABC Solar Display from the root layout. The full weight range is loaded so
// body/meta text renders at the right weights, matching the design.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// Force Poppins for body/UI text on the home subtree. `fontFamily` is set
// directly (not just via variables) because unclassed text inherits the
// already-computed family from <body> — redefining `--font-abc-solar` alone
// wouldn't override that inherited value. `--font-sans`/`--font-abc-solar` are
// also re-pointed so the `font-sans` utility resolves to Poppins. The display
// variables are left untouched so `font-display` headlines stay ABC Solar
// Display (the `.font-display` rule wins via its own font-family declaration).
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
