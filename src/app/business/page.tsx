import type { Metadata } from "next";
import type { CSSProperties } from "react";
import BusinessPageClient from "./BusinessPageClient";

// Poppins drives body/UI text on the business page (per design); headlines and
// big numbers keep ABC Solar Display via the `font-solar` utility. The fonts
// are loaded once in the root layout; this wrapper just re-points the body font
// variables to Poppins for this subtree (mirrors the `/` home page).
//
// `color` is pinned to the design's dark ink (#212121) because this is a
// light page: the site-wide <body> default is `--optimist-cream` (a pale tone
// for the dark marketing pages), which otherwise bleeds into every headline
// that doesn't set its own colour (the `font-solar` section titles). Explicit
// colours (blue eyebrows, grey copy, white-on-dark cards) still win.
const BUSINESS_FONT_VARS = {
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
  color: "#212121",
  "--font-sans": "var(--font-poppins)",
  "--font-abc-solar": "var(--font-poppins)",
} as CSSProperties;

export const metadata: Metadata = {
  title: {
    absolute:
      "Optimist for Business | High-efficiency AC fleets for commercial spaces",
  },
  description:
    "Save lakhs in electricity costs across your AC fleet. High-efficiency air conditioning for offices, hotels, education, healthcare and commercial projects — with fleet-wide monitoring and AMC support.",
};

export default function BusinessPage() {
  return (
    <div style={BUSINESS_FONT_VARS}>
      <BusinessPageClient />
    </div>
  );
}
