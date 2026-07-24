"use client";

/* eslint-disable @next/next/no-img-element */

import { m } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";

const LOGO_MARK = "/figma/optimist-mark.svg";
const LOGO_WORDMARK = "/figma/hero-decor.svg";

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

      {/* Table — same structure/classes as the home ComparisonSection, with
          the business rows. Feature column spans 2 of 4 columns from md up. */}
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerParent(0.06)}
        className="mt-10 w-full md:mt-14"
      >
        {/* Header row */}
        <m.div variants={fadeUp} className="grid h-16 grid-cols-3 sm:h-20 md:grid-cols-4">
          <div className="col-span-1 flex items-center text-sm leading-none font-light text-[#999999] sm:text-base md:col-span-2 md:pl-10">
            Features
          </div>
          <div className="col-span-1 flex items-center justify-center text-center font-solar text-base leading-none font-medium text-[#4D4D4D] sm:text-lg md:text-xl">
            Other AC&rsquo;s
          </div>
          <div className="col-span-1 rounded-t-[16px] bg-[#FFFCDC] sm:rounded-t-[20px] md:rounded-t-[24px]">
            <div className="flex h-full items-center justify-center gap-0.5 md:gap-1.5">
              <img
                src={LOGO_MARK}
                alt="logo"
                aria-hidden
                className="h-5 w-auto md:h-8"
              />
              <img
                src={LOGO_WORDMARK}
                alt="optimist"
                aria-hidden
                className="h-4 w-auto md:h-[26px]"
              />
            </div>
          </div>
        </m.div>

        {/* Rows */}
        {rows.map((row, i) => (
          <m.div
            key={row.feature}
            variants={fadeUp}
            className="grid h-20 grid-cols-3 border-t border-[#E9E9E9] sm:h-24 md:h-25 md:grid-cols-4"
          >
            <div className="col-span-1 flex items-center gap-3 sm:gap-4 md:col-span-2 md:gap-6 md:pl-10">
              <img
                src={row.icon}
                alt=""
                aria-hidden
                className="size-5 shrink-0 object-contain sm:size-6"
              />
              <span className="font-solar text-sm font-medium text-[#212121] sm:text-base md:text-xl">
                {row.feature}
              </span>
            </div>
            <div className="col-span-1 flex flex-col items-center justify-center gap-1.5 text-xs leading-none font-light sm:gap-2 sm:text-sm md:text-base">
              <X className="size-6 stroke-[#BABABA] sm:size-7 md:size-8" />
              <span className="px-2 text-center">{row.other}</span>
            </div>
            <div
              className={cn(
                "col-span-1 flex flex-col items-center justify-center gap-1.5 bg-[#FFFCDC] text-xs leading-none font-light sm:gap-2 sm:text-sm md:text-base",
                i === rows.length - 1 &&
                  "rounded-b-[16px] sm:rounded-b-[20px] md:rounded-b-[24px]",
              )}
            >
              <Check className="size-6 stroke-[#08A22C] sm:size-7 md:size-8" />
              <span className="px-2 text-center">{row.optimist}</span>
            </div>
          </m.div>
        ))}
      </m.div>
    </section>
  );
}
