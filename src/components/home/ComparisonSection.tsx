"use client";

import Image from "next/image";
import { m } from "framer-motion";
import { Check, X } from "lucide-react";
import { PalmLogo } from "@/components/home/HomeHeader";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";
import type { HomeComparisonContent } from "@/lib/shopify";

const CREAM = "#FBF6DB";

interface ComparisonSectionProps {
  content: HomeComparisonContent | null;
}

export function ComparisonSection({ content }: ComparisonSectionProps) {
  if (!content) return null;

  const { titleLine1, titleLine2, subtitle, rows } = content;
  if (!rows.length) return null;

  return (
    <section className="relative overflow-hidden bg-white py-[88px]">
      <div className="mx-auto max-w-[1100px] px-6">
        {/* Centered header */}
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent(0.1)}
          className="text-center"
        >
          <m.p
            variants={fadeUp}
            className="text-[20px] leading-[30px] font-medium text-optimist-blue-hero"
          >
            {subtitle}
          </m.p>
          <m.h2
            variants={fadeUp}
            className="mt-3 font-display text-[48px] leading-[56px] font-medium text-[#212121]"
          >
            {titleLine1}
            <br />
            {titleLine2}
          </m.h2>
        </m.div>

        {/* Comparison table */}
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="relative mx-auto mt-12 max-w-[920px]"
        >
          {/* Cream highlight band behind the "optimist" column. An overlay grid
              mirrors the column widths so the band lines up exactly. */}
          <div className="pointer-events-none absolute inset-0 grid grid-cols-[1.6fr_1fr_1fr]">
            <div />
            <div />
            <div
              className="rounded-[20px]"
              style={{ backgroundColor: CREAM }}
            />
          </div>

          <div className="relative grid grid-cols-[1.6fr_1fr_1fr]">
            {/* Header row */}
            <div className="flex items-end px-2 pb-5 pt-7 text-[15px] text-black/45">
              Features
            </div>
            <div className="flex items-end justify-center px-2 pb-5 pt-7">
              <span className="font-display text-[18px] font-semibold text-optimist-black">
                Other AC&rsquo;s
              </span>
            </div>
            <div className="flex items-end justify-center gap-1.5 px-2 pb-5 pt-7">
              <PalmLogo className="h-[22px] w-auto" />
              <span className="font-display text-[20px] font-semibold text-optimist-blue-hero">
                optimist
              </span>
            </div>

            {/* Feature rows */}
            {rows.map((row, i) => (
              <div key={i} className="contents">
                {/* Feature name + icon */}
                <div className="flex items-center gap-3 border-t border-black/[0.07] px-2 py-7">
                  {row.iconUrl ? (
                    <Image
                      src={row.iconUrl}
                      alt={row.iconAlt ?? row.feature}
                      width={32}
                      height={32}
                      className="h-7 w-7 flex-shrink-0 object-contain"
                    />
                  ) : null}
                  <span className="font-display text-[18px] font-semibold text-optimist-black">
                    {row.feature}
                  </span>
                </div>

                {/* Other AC's */}
                <div className="flex flex-col items-center justify-center gap-2 border-t border-black/[0.07] px-2 py-7 text-center">
                  <X className="h-5 w-5 text-black/25" strokeWidth={2.5} />
                  <span className="text-[15px] text-black/50">
                    {row.otherAc}
                  </span>
                </div>

                {/* optimist */}
                <div className="flex flex-col items-center justify-center gap-2 border-t border-black/[0.07] px-2 py-7 text-center">
                  <Check
                    className="h-5 w-5 text-[#16A34A]"
                    strokeWidth={2.5}
                  />
                  <span className="text-[15px] font-medium text-optimist-black">
                    {row.optimist}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
}
