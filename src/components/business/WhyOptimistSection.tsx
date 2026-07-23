"use client";

/* eslint-disable @next/next/no-img-element */

import { m } from "framer-motion";
import { cn } from "@/lib/cn";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";

const LOGO_MARK = "/figma/optimist-mark.svg";
const LOGO_WORDMARK = "/figma/hero-decor.svg";
const X_ICON = "/business/why-x.svg";
const CHECK_ICON = "/business/why-check.svg";

// Figma node 1:441 — "Why Optimist for commercial fleets?" comparison table.
// Three columns: Features (fluid) · Other AC's (305px) · Optimist (305px on
// #FFFCDC with rounded 24 top/bottom). Rows are 100px with hairline dividers;
// feature icons are the design's blue vectors.
const rows = [
  {
    icon: "/business/why-icon-cooling.svg",
    feature: "Cooling at 50°C",
    other: <>Derate above 43°C</>,
    optimist: <>Tested &amp; proven</>,
  },
  {
    icon: "/business/why-icon-iseer.svg",
    feature: "Electricity Savings (ISEER)",
    other: (
      <>
        <span className="font-semibold">10–15%</span> at best
      </>
    ),
    optimist: (
      <>
        <span className="font-semibold">25–35%</span> lower bills
      </>
    ),
  },
  {
    icon: "/business/why-icon-amc.svg",
    feature: "AMC & Multi-size support",
    other: <>Silent till it breaks</>,
    optimist: <>Automated &amp; proactive</>,
  },
  {
    icon: "/business/why-icon-manager.svg",
    feature: "Dedicated Account Manager",
    other: <>Not available</>,
    optimist: <>First ever</>,
  },
];

// Shared column template: fluid features column + two fixed comparison
// columns (Figma: 305px each at 1080 content width).
const GRID =
  "grid grid-cols-[1.15fr_1fr_1fr] md:grid-cols-[1fr_240px_240px] lg:grid-cols-[1fr_305px_305px]";

export function WhyOptimistSection() {
  return (
    <section className="mx-auto w-full max-w-[1160px] px-5 sm:px-6 md:px-10 py-14 md:py-[100px]">
      {/* Header */}
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerParent(0.1)}
        className="text-center"
      >
        <m.p
          variants={fadeUp}
          className="text-lg font-medium leading-[1.6] text-[#3478F6] md:text-[20px]"
        >
          Why Optimist?
        </m.p>
        <m.h2
          variants={fadeUp}
          className="mx-auto mt-2 max-w-[560px] font-solar text-[32px] font-medium leading-[1.2] text-[#212121] sm:text-[40px] md:text-[48px]"
        >
          Why Optimist for commercial fleets?
        </m.h2>
      </m.div>

      {/* Table */}
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerParent(0.06)}
        className="mt-10 md:mt-14"
      >
        {/* Header row — Figma: 80px tall; logo cell on #FFFCDC, rounded-t 24 */}
        <m.div variants={fadeUp} className={cn(GRID, "h-[64px] md:h-[80px]")}>
          <div className="flex h-full items-center px-2 md:px-10">
            <span className="text-sm leading-none text-[#999999] md:text-[16px]">
              Features
            </span>
          </div>
          <div className="flex h-full items-center justify-center px-2 md:px-10">
            <span className="font-solar text-[16px] font-medium leading-none text-[#4D4D4D] md:text-[20px]">
              Other AC&rsquo;s
            </span>
          </div>
          {/* Real brand assets (palm mark + wordmark) — the Figma SVG export
              outlines the wordmark with a fallback font, so it can't be used.
              On phones the lockup is width-driven (shrinks with the narrow
              column); from sm up it uses the design's fixed heights. */}
          <div className="flex h-full min-w-0 items-center justify-center gap-1 rounded-t-[24px] bg-[#FFFCDC] px-2 md:px-10">
            <img
              src={LOGO_MARK}
              alt=""
              aria-hidden
              className="h-4 w-auto shrink-0 sm:h-6 md:h-8"
            />
            <img
              src={LOGO_WORDMARK}
              alt="Optimist"
              className="h-auto w-full min-w-0 max-w-[90px] sm:h-5 sm:w-auto sm:max-w-none md:h-[26px]"
            />
          </div>
        </m.div>

        {/* Rows — Figma: 100px tall, top hairline, centered comparison cells */}
        {rows.map((row, i) => (
          <m.div
            key={row.feature}
            variants={fadeUp}
            className={cn(GRID, "min-h-[88px] border-t border-[#E9E9E9] md:min-h-[100px]")}
          >
            <div className="flex items-center gap-3 py-4 pr-2 md:gap-6 md:px-10 md:py-[30px]">
              <img
                src={row.icon}
                alt=""
                aria-hidden
                className="hidden size-6 shrink-0 object-contain sm:block"
              />
              <span className="font-solar text-[15px] font-medium leading-[1.15] text-[#212121] md:text-[20px] md:leading-none">
                {row.feature}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 px-2 py-4 text-center md:px-10 md:py-[30px]">
              <img src={X_ICON} alt="No" className="size-4" />
              <span className="text-[13px] leading-[1.2] text-[#212121] md:text-[16px] md:leading-none">
                {row.other}
              </span>
            </div>
            <div
              className={cn(
                "flex flex-col items-center justify-center gap-2 bg-[#FFFCDC] px-2 py-4 text-center md:px-10 md:py-[30px]",
                i === rows.length - 1 && "rounded-b-[24px]",
              )}
            >
              <img src={CHECK_ICON} alt="Yes" className="size-7 md:size-8" />
              <span className="text-[13px] leading-[1.2] text-[#212121] md:text-[16px] md:leading-none">
                {row.optimist}
              </span>
            </div>
          </m.div>
        ))}
      </m.div>
    </section>
  );
}
