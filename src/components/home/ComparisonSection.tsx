"use client";

import Image from "next/image";
import { m } from "framer-motion";
import { Check, X } from "lucide-react";
import { PalmLogo } from "@/components/home/HomeHeader";
import { SectionHeader } from "@/components/home/SectionHeader";
import { fadeUp, viewportOnce } from "@/lib/motion-variants";
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
    <section className="relative overflow-hidden bg-white py-14 sm:py-20 lg:py-[88px]">
      <div className="mx-auto max-w-[1100px] px-6">
        {/* Centered header */}
        <SectionHeader
          eyebrow={subtitle}
          title={
            <>
              {titleLine1}
              <br />
              {titleLine2}
            </>
          }
        />

        {/* Comparison table */}
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="relative mx-auto mt-8 max-w-[920px] sm:mt-12"
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
            <div className="flex items-end px-2 pb-3 pt-5 text-[13px] text-black/45 sm:pb-5 sm:pt-7 sm:text-[15px]">
              Features
            </div>
            <div className="flex items-end justify-center px-1 pb-3 pt-5 sm:px-2 sm:pb-5 sm:pt-7">
              <span className="font-display text-[14px] font-medium text-optimist-black sm:text-[18px]">
                Other AC&rsquo;s
              </span>
            </div>
            <div className="flex items-end justify-center gap-1 px-1 pb-3 pt-5 sm:gap-1.5 sm:px-2 sm:pb-5 sm:pt-7">
              <PalmLogo className="h-[16px] w-auto sm:h-[22px]" />
              <span className="font-display text-[15px] font-medium text-optimist-blue-hero sm:text-[20px]">
                optimist
              </span>
            </div>

            {/* Feature rows */}
            {rows.map((row, i) => (
              <div key={i} className="contents">
                {/* Feature name + icon */}
                <div className="flex items-center gap-2 border-t border-black/[0.07] px-2 py-4 sm:gap-3 sm:py-7">
                  {row.iconUrl ? (
                    <Image
                      src={row.iconUrl}
                      alt={row.iconAlt ?? row.feature}
                      width={32}
                      height={32}
                      className="h-5 w-5 flex-shrink-0 object-contain sm:h-7 sm:w-7"
                    />
                  ) : null}
                  <span className="font-display text-[14px] font-medium leading-tight text-optimist-black sm:text-[18px]">
                    {row.feature}
                  </span>
                </div>

                {/* Other AC's */}
                <div className="flex flex-col items-center justify-center gap-1.5 border-t border-black/[0.07] px-1 py-4 text-center sm:gap-2 sm:px-2 sm:py-7">
                  <X className="h-4 w-4 text-black/25 sm:h-5 sm:w-5" strokeWidth={2.5} />
                  <span className="text-[12px] leading-tight text-black/50 sm:text-[15px]">
                    {row.otherAc}
                  </span>
                </div>

                {/* optimist */}
                <div className="flex flex-col items-center justify-center gap-1.5 border-t border-black/[0.07] px-1 py-4 text-center sm:gap-2 sm:px-2 sm:py-7">
                  <Check
                    className="h-4 w-4 text-[#16A34A] sm:h-5 sm:w-5"
                    strokeWidth={2.5}
                  />
                  <span className="text-[12px] font-medium leading-tight text-optimist-black sm:text-[15px]">
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
