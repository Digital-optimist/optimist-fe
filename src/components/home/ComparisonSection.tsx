"use client";

/* eslint-disable @next/next/no-img-element */

import { m } from "framer-motion";
import { Check, X } from "lucide-react";
import { SectionTitle } from "@/components/home/ui/section-title";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";
import { cn } from "@/lib/cn";
import type { HomeComparisonContent } from "@/lib/shopify";

const logoMark = "/figma/optimist-mark.svg";
const heroDecor = "/figma/hero-decor.svg";
const iconFast = "/figma/icon-fast.svg";
const iconGas = "/figma/icon-gas.svg";
const iconSettings = "/figma/icon-settings.svg";
const iconStar = "/figma/icon-star.svg";
const iconUmbrella = "/figma/icon-umbrella.svg";

const FALLBACK_ROWS: {
  icon: string;
  feature: string;
  other: React.ReactNode;
  opt: React.ReactNode;
}[] = [
  { icon: iconFast, feature: "Cooling at 50°C", other: <>Derate above 43°C</>, opt: "Tested & proven" },
  { icon: iconGas, feature: "Gas Level Indicator", other: <>Not available</>, opt: "First ever" },
  {
    icon: iconSettings,
    feature: "Self-Monitoring & Alerts",
    other: <>Silent till it breaks</>,
    opt: "Automated & proactive",
  },
  {
    icon: iconStar,
    feature: "Electricity Savings",
    other: (
      <>
        <span className="font-semibold">10-15%</span> at best
      </>
    ),
    opt: (
      <>
        <span className="font-semibold">25–35%</span> lower bills
      </>
    ),
  },
  {
    icon: iconUmbrella,
    feature: "Warranty",
    other: (
      <>
        <span className="font-semibold">~ 1 year</span> standard
      </>
    ),
    opt: (
      <>
        <span className="font-semibold">5 years.</span> No fine print
      </>
    ),
  },
];

interface ComparisonSectionProps {
  content: HomeComparisonContent | null;
}

// Ported verbatim from optimist-website's WHY OPTIMIST comparison table.
export function ComparisonSection({ content }: ComparisonSectionProps) {
  const rows = content?.rows?.length
    ? content.rows.map((r) => ({
        icon: r.iconUrl ?? "",
        feature: r.feature,
        other: r.otherAc as React.ReactNode,
        opt: r.optimist as React.ReactNode,
      }))
    : FALLBACK_ROWS;

  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 pt-20 md:pt-50">
      <div className="mx-auto max-w-[1080px]">
        <SectionTitle
          eyebrow={content?.subtitle ?? "Built for real cooling, not just marketing."}
          title={
            content
              ? `${content.titleLine1}\n${content.titleLine2}`
              : `Here is why Optimist\nis right for you.`
          }
        />

        <m.div
          className="mt-6 md:mt-10 w-full overflow-x-auto"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent(0.05)}
        >
          <m.div variants={fadeUp} className="h-16 sm:h-20 grid grid-cols-3 md:grid-cols-4">
            <div className="md:pl-10 py-4 sm:py-6 md:py-8 text-sm sm:text-base leading-none font-light text-[#999999] col-span-1 md:col-span-2">
              Features
            </div>
            <div className="p-4 sm:p-6 md:p-[30px] text-center text-base sm:text-lg md:text-xl leading-none font-solar font-medium text-[#4D4D4D] col-span-1">
              Other AC&apos;s
            </div>
            <div className="rounded-t-[16px] sm:rounded-t-[20px] md:rounded-t-[24px] bg-[#FFFCDC] p-3 sm:p-4 md:p-6 text-center text-[12px] sm:text-[14px] font-semibold text-[#212121] col-span-1">
              <div className="flex items-center justify-center gap-0.5 md:gap-1.5">
                <img
                  src={logoMark}
                  alt="logo"
                  aria-hidden
                  className="h-5 md:h-8 w-auto"
                />
                <img
                  src={heroDecor}
                  alt="optimist"
                  aria-hidden
                  className="h-4 md:h-[26px] w-auto"
                />
              </div>
            </div>
          </m.div>

          {rows.map((row, idx) => (
            <m.div
              key={row.feature}
              variants={fadeUp}
              className="h-20 sm:h-24 md:h-25 grid grid-cols-3 md:grid-cols-4 border-t border-[#E9E9E9]"
            >
              <div className="md:pl-10 text-base sm:text-lg md:text-xl leading-none font-solar font-medium col-span-1 md:col-span-2 flex items-center gap-3 sm:gap-4 md:gap-6">
                <img
                  src={row.icon}
                  alt=""
                  aria-hidden
                  className="h-5 sm:h-6 w-auto shrink-0"
                />
                <span className="text-sm sm:text-base md:text-xl">{row.feature}</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base leading-none font-light col-span-1">
                <X className="size-6 sm:size-7 md:size-8 stroke-[#BABABA]" />
                <span className="text-center px-2">{row.other}</span>
              </div>
              <div
                className={cn(
                  "bg-[#FFFCDC] flex flex-col items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base leading-none font-light col-span-1",
                  idx === rows.length - 1 &&
                    "rounded-b-[16px] sm:rounded-b-[20px] md:rounded-b-[24px]",
                )}
              >
                <Check className="size-6 sm:size-7 md:size-8 stroke-[#08A22C]" />
                <span className="text-center px-2">{row.opt}</span>
              </div>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}
