"use client";

/* eslint-disable @next/next/no-img-element */

import type { ReactNode } from "react";
import { m } from "framer-motion";
import { Wind } from "lucide-react";
import { cn } from "@/lib/cn";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";
import { GradientCTA } from "./ui";

const BADGE = "/business/made-in-india-gauge.png";
const AC = "/business/hero-ac.png";
const CONNECTOR_LEFT = "/business/left-connector.svg";
const CONNECTOR_RIGHT = "/business/right-connector.svg";

type IconKind = "star" | "wind" | undefined;
interface Stat {
  value?: string;
  label: ReactNode;
  key: string;
  icon?: IconKind;
  valueClass?: string;
  /** Gap between value and label — Figma: none on ISEER (one text block),
      16px on the big 30px-value cards (650W / 96%). */
  labelGap?: string;
}

// The four floating performance stats. Per Figma: values are ABC Solar Display
// Medium — ISEER 6.05 at 21px/120%, the big 650W / 96% at 30px/100%. The cooling
// card has no separate value; its "50°C." reads at 21px like a value.
const ISEER: Stat = {
  key: "iseer",
  icon: "star",
  value: "ISEER 6.05",
  label: "Energy Efficiency",
  valueClass: "text-[21px] leading-[1.2]",
};
const COOLING: Stat = {
  key: "cooling",
  icon: "wind",
  label: (
    <>
      Cooling performance upto{" "}
      <span className="text-[21px] leading-[1.2] text-[#3478F6]">50&deg;C.</span>
    </>
  ),
};
const WATT: Stat = {
  key: "watt",
  value: "650W",
  label: "Max. Cooling Capacity",
  valueClass: "text-[30px] leading-none",
  labelGap: "mt-4",
};
const RETENTION: Stat = {
  key: "retention",
  value: "96%",
  label: "Capacity Retention at 50°C.",
  valueClass: "text-[30px] leading-none",
  labelGap: "mt-4",
};
const STAT_LIST = [ISEER, COOLING, WATT, RETENTION];

function StatIcon({ kind }: { kind: IconKind }) {
  if (kind === "star") {
    return (
      <img
        src="/business/star.png"
        alt=""
        aria-hidden
        className="size-12 object-contain"
      />
    );
  }
  if (kind === "wind") {
    return <Wind className="h-[30px] w-[33px] text-[#3478F6]" strokeWidth={1.75} />;
  }
  return null;
}

// Card box — Figma (nodes 1:127/131/135/139): rounded 24, 1px border, 20px
// padding, content top-aligned and hugged (each card is exactly as tall as its
// content — 166/151/124/143 in the design, NO equalisation). Icons render at
// natural size (star 48px, wind 30px) with a 16px gap to the text; on the big
// 30px-value cards the label sits 16px below the value, while ISEER's value +
// label read as one tight block.
function StatCard({ stat, className }: { stat: Stat; className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col gap-4 rounded-[24px] border border-[#E9E9E9] bg-white/70 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-md",
        className,
      )}
    >
      {stat.icon && <StatIcon kind={stat.icon} />}
      <div>
        {stat.value && (
          <p
            className={cn(
              "font-solar font-medium text-[#3478F6]",
              stat.valueClass ?? "text-[21px] leading-[1.2]",
            )}
          >
            {stat.value}
          </p>
        )}
        {/* Labels are ABC Solar Display Medium 16px / 120% per Figma */}
        <p
          className={cn(
            "font-solar text-[16px] font-medium leading-[1.2] text-[#212121]",
            stat.value && stat.labelGap,
          )}
        >
          {stat.label}
        </p>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative">
      {/* No local background glows — the page's dotted texture is the single,
          uniform hero/nav background (BusinessPageClient). */}
      {/* md:pt matches the Figma nav→headline gap (80px from header bottom) */}
      <div className="relative mx-auto w-full max-w-[1160px] px-5 sm:px-6 md:px-10 pt-8 pb-14 md:pt-20 md:pb-[100px]">
        {/* Headline + sub + CTA */}
        <m.div
          initial="hidden"
          animate="visible"
          variants={staggerParent(0.12)}
          className="mx-auto flex max-w-[760px] flex-col items-center text-center"
        >
          <m.h1
            variants={fadeUp}
            className="font-solar text-[34px] leading-[1.1] font-medium sm:text-[46px] md:text-[60px]"
          >
            <span className="block text-[#3478F6]">
              Save lakhs in electricity costs
            </span>
            <span className="block text-[#212121]">across your AC fleet</span>
          </m.h1>
          <m.p
            variants={fadeUp}
            className="mt-5 max-w-[600px] text-sm leading-[1.6] text-[#999999] md:text-base"
          >
            High-efficiency air conditioning for offices, hotels, educational
            institutions, healthcare facilities, retail spaces and commercial
            projects.
          </m.p>
          <m.div variants={fadeUp} className="mt-7 md:mt-8">
            <GradientCTA
              href="#lead-form"
              className="h-11 px-7 text-[15px] md:h-15 md:px-10 md:text-[21px]"
            >
              Request a proposal
            </GradientCTA>
          </m.div>
        </m.div>

        {/* ---------------------------------------------------------------- */}
        {/* PRECISE desktop stage — mirrors the Figma layout exactly (shown at */}
        {/* ≥1200px, where the content column is the design's 1080px). Coords  */}
        {/* below are Figma frame coords minus the stage origin (left 180,     */}
        {/* top 513). z-order: AC (10) < connectors (20) < cards (30), so each  */}
        {/* trace runs out from behind its card and its diamond sits on the AC. */}
        {/* ---------------------------------------------------------------- */}
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent(0.1)}
          className="relative mx-auto mt-16 hidden h-[307px] w-[1080px] min-[1200px]:block"
        >
          {/* Made-in-India badge — behind the AC, bottom half hidden */}
          <m.img
            variants={fadeUp}
            src={BADGE}
            alt="Proudly Made in India"
            className="absolute top-[7px] left-1/2 w-[200px] -translate-x-1/2"
          />
          {/* AC render */}
          <m.img
            variants={fadeUp}
            src={AC}
            alt="Optimist commercial air conditioner"
            className="absolute bottom-0 left-1/2 z-10 w-[708px] -translate-x-1/2"
          />
          {/* Connector traces (exact Figma SVGs) — no z, so they sit BEHIND the
              AC (z-10) and the cards (z-30): the wire tucks behind the unit and
              only shows in the gap between each card and the AC. */}
          <img
            src={CONNECTOR_LEFT}
            alt=""
            aria-hidden
            className="pointer-events-none absolute top-[85px] left-[125px] w-[112px]"
          />
          <img
            src={CONNECTOR_RIGHT}
            alt=""
            aria-hidden
            className="pointer-events-none absolute top-[86px] left-[850px] w-[112px]"
          />

          {/* Left column (ISEER + 650W) and right column (50°C + 96%). Cards
              hug their content and stack with the Figma gaps (12px left, 10px
              right) — the design keeps the columns intentionally asymmetric,
              with each card only as tall as its text. */}
          <m.div
            variants={fadeUp}
            className="absolute top-0 left-0 z-30 flex w-[147px] flex-col gap-3"
          >
            <StatCard stat={ISEER} />
            <StatCard stat={WATT} />
          </m.div>
          <m.div
            variants={fadeUp}
            className="absolute top-0 right-0 z-30 flex w-[147px] flex-col gap-2.5"
          >
            <StatCard stat={COOLING} />
            <StatCard stat={RETENTION} />
          </m.div>
        </m.div>

        {/* ---------------------------------------------------------------- */}
        {/* STACKED layout — below 1200px (mobile → laptop). Fills the width:  */}
        {/* AC + badge centred, then the four stats. 2×2 on phones, a single   */}
        {/* row (4-across) from md up so it fills wide screens cleanly instead  */}
        {/* of sitting in a narrow centred column.                             */}
        {/* ---------------------------------------------------------------- */}
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent(0.1)}
          className="mx-auto mt-14 max-w-[600px] md:mt-20 md:max-w-none min-[1200px]:hidden"
        >
          <m.div
            variants={fadeUp}
            className="relative mx-auto w-full max-w-[560px] md:max-w-[680px] lg:max-w-[780px]"
          >
            <img
              src={BADGE}
              alt="Proudly Made in India"
              className="absolute top-[10%] left-1/2 w-[26%] max-w-[176px] -translate-x-1/2 -translate-y-1/2"
            />
            <img
              src={AC}
              alt="Optimist commercial air conditioner"
              className="relative z-10 h-auto w-full"
            />
          </m.div>

          <div className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-4 md:gap-5">
            {STAT_LIST.map((s) => (
              <m.div key={s.key} variants={fadeUp}>
                <StatCard stat={s} />
              </m.div>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
}
