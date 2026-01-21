"use client";

import { memo } from "react";
import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import { CheckCircleIcon, XCircleIcon } from "@/components/icons/ProductIcons";

// =============================================================================
// Constants
// =============================================================================

const OPTIMIST_BENEFITS = [
  "Remains efficient during long usage",
  "Cooling stays stable through the day",
  "Designed for extreme Indian heat",
  "Tested for steady performance",
  "Smooth and controlled",
  "More predictable month to month",
  "Sustained, daily usage",
  "Less adjustment needed",
] as const;

const MARKET_DRAWBACKS = [
  "Efficiency drops as load increases",
  "Cooling fluctuates with heat",
  "Struggles during peak temperatures",
  "Often compensates by overworking",
  "Sudden wattage spikes",
  "Varies due to spikes and inefficiency",
  "Short-cycle performance",
  "Frequent mode and temperature changes",
] as const;

// =============================================================================
// Component
// =============================================================================

export const ComparisonSection = memo(function ComparisonSection() {
  return (
    <section className="relative w-full overflow-hidden" aria-labelledby="comparison-heading">
      {/* Background Split */}
      <div className="absolute inset-0 flex" aria-hidden="true">
        <div className="w-1/2 bg-[#3478F6]" />
        <div className="w-1/2 bg-[#212121]" />
      </div>

      {/* Shadow/Wave Background Image - covers the full section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Use a wrapper div to handle the overflow sizing from Figma */}
        <div 
          className="absolute"
          style={{
            width: '110.59%',
            height: '117.98%',
            left: '-5.3%',
            top: 0,
          }}
        >
          <Image
            src={ASSETS.comparisonShadowBg}
            alt=""
            fill
            className="object-top opacity-[0.3]"
            loading="lazy"
          />
        </div>
      </div>

      {/* Visually hidden heading for accessibility */}
      <h2 id="comparison-heading" className="sr-only">
        Compare Optimist AC with Market AC
      </h2>

      {/* Content */}
      <div className="relative z-[10] w-full max-w-[1440px] mx-auto pt-10 md:pt-[53px]">
        {/* Titles Row */}
        <div className="flex">
          <div className="w-1/2 px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16">
            <h3 className="font-display text-[28px] md:text-[48px] lg:text-[64px] font-bold text-white text-right mb-4 md:mb-6 lg:mb-10">
              Optimist AC
            </h3>
          </div>
          <div className="w-1/2 px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16">
            <h3 className="font-display text-[28px] md:text-[48px] lg:text-[64px] font-bold text-white/60 text-left mb-4 md:mb-6 lg:mb-10">
              Market AC
            </h3>
          </div>
        </div>

        {/* Comparison Rows - Each row contains both benefit and drawback */}
        <div className="flex flex-col gap-2 sm:gap-3 md:gap-6">
          {OPTIMIST_BENEFITS.map((benefit, index) => (
            <div key={index} className="flex items-stretch">
              {/* Left - Benefit */}
              <div className="w-1/2 flex justify-end items-stretch px-2 sm:px-4 md:px-4 lg:px-6 xl:px-8">
                <div className="flex items-center justify-end gap-1.5 sm:gap-2 md:gap-2.5 bg-white/[0.12] rounded-lg md:rounded-xl px-2 sm:px-3 md:px-3 py-1 sm:py-1.5 md:py-2 w-full md:w-fit md:max-w-[320px]">
                  <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-white font-medium text-right leading-tight">
                    {benefit}
                  </p>
                  <CheckCircleIcon className="w-4 h-4 md:w-5 lg:w-6 md:h-5 lg:h-6 flex-shrink-0" />
                </div>
              </div>
              {/* Right - Drawback */}
              <div className="w-1/2 flex justify-start items-stretch px-2 sm:px-4 md:px-4 lg:px-6 xl:px-8">
                <div className="flex items-center justify-start gap-1.5 sm:gap-2 md:gap-2.5 bg-white/[0.12] rounded-lg md:rounded-xl px-2 sm:px-3 md:px-3 py-1 sm:py-1.5 md:py-2 w-full md:w-fit md:max-w-[320px]">
                  <XCircleIcon className="w-4 h-4 md:w-5 lg:w-6 md:h-5 lg:h-6 flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-white font-medium text-left leading-tight">
                    {MARKET_DRAWBACKS[index]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
