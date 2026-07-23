"use client";

/* eslint-disable @next/next/no-img-element */

import type { ReactNode } from "react";
import { m } from "framer-motion";
import { cn } from "@/lib/cn";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";

// Brand logos from the Figma mock (node 1:143), rendered at their natural
// design sizes and centred in 80px rows.
const LOGOS = {
  doordash: { src: "/business/brand-doordash.svg", w: 130, h: 15 },
  shopify: { src: "/business/brand-shopify.svg", w: 96, h: 28 },
  expedia: { src: "/business/brand-expedia.svg", w: 107, h: 22 },
  hubspot: { src: "/business/brand-hubspot.svg", w: 97, h: 28 },
  stripe: { src: "/business/brand-stripe.svg", w: 66, h: 28 },
  disney: { src: "/business/brand-disney.svg", w: 57, h: 24 },
} as const;

type LogoId = keyof typeof LOGOS;

// Figma order — associated grid (4×2) and featured row (5)
const ASSOCIATED: LogoId[] = [
  "doordash",
  "shopify",
  "expedia",
  "hubspot",
  "expedia",
  "stripe",
  "disney",
  "doordash",
];
const FEATURED: LogoId[] = [
  "doordash",
  "doordash",
  "shopify",
  "expedia",
  "hubspot",
];

function BrandLogo({ id }: { id: LogoId }) {
  const { src, w, h } = LOGOS[id];
  return (
    <img
      src={src}
      alt={id}
      style={{ width: w, height: h }}
      className="object-contain"
    />
  );
}

const stats = [
  { value: "50+", label: "Cities served" },
  { value: "1.4L", label: "Units Installed" },
  { value: "20+", label: "Commercial Projects" },
  { value: "96%", label: "Customer Satisfaction", accent: true },
];

// Uppercase, wide-tracked label flanked by hairline rules (Figma: Poppins 600,
// 12px, line-height 100%, letter-spacing 20%).
function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="h-px flex-1 bg-[#E9E9E9]" />
      <span className="text-center text-xs font-semibold uppercase leading-none tracking-[0.2em] text-[#6A6A6A]">
        {children}
      </span>
      <span className="h-px flex-1 bg-[#E9E9E9]" />
    </div>
  );
}

export function TrustedBySection() {
  return (
    <section className="mx-auto w-full max-w-[1160px] px-5 sm:px-6 md:px-10 py-14 md:py-[100px]">
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerParent(0.08)}
        className="space-y-9 md:space-y-[30px]"
      >
        {/* Heading — Poppins 500, 20px, 160% */}
        <m.p
          variants={fadeUp}
          className="text-center text-lg font-medium leading-[1.6] text-[#212121] md:text-[20px]"
        >
          Trusted by 100+ businesses &amp; clients across India
        </m.p>

        {/* Stat cards — 4 across (2×2 on mobile), evenly spaced (no dividers) */}
        <m.div
          variants={fadeUp}
          className="grid grid-cols-2 gap-y-7 md:grid-cols-4 md:gap-y-0"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center px-6 text-center md:px-10 md:py-5"
            >
              <span
                className={cn(
                  "font-solar text-[40px] font-bold leading-none md:text-[48px]",
                  s.accent ? "text-[#08A22C]" : "text-[#3478F6]",
                )}
              >
                {s.value}
              </span>
              <span className="mt-2 text-sm text-[#999999] md:text-base">
                {s.label}
              </span>
            </div>
          ))}
        </m.div>

        {/* Partner logos — 8 (4 per row × 2 on desktop, 2 per row on mobile),
            centred in 80px rows like the Figma cells */}
        <m.div variants={fadeUp} className="space-y-5">
          <SectionLabel>Businesses and companies we are associated with</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {ASSOCIATED.map((id, i) => (
              <div
                key={`${id}-${i}`}
                className="flex h-16 items-center justify-center md:h-20"
              >
                <BrandLogo id={id} />
              </div>
            ))}
          </div>
        </m.div>

        {/* Featured logos — 5 in a single row on desktop, centred wrap on mobile */}
        <m.div variants={fadeUp} className="space-y-5">
          <SectionLabel>We have been featured in</SectionLabel>
          <div className="flex flex-wrap items-center justify-center">
            {FEATURED.map((id, i) => (
              <div
                key={`${id}-${i}`}
                className="flex h-16 w-[45%] items-center justify-center sm:w-[30%] md:h-20 md:w-[20%]"
              >
                <BrandLogo id={id} />
              </div>
            ))}
          </div>
        </m.div>
      </m.div>
    </section>
  );
}
