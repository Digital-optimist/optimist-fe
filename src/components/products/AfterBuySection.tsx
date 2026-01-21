"use client";

import { memo } from "react";
import {
  OrderConfirmIcon,
  UserCircleCheckIcon,
  ScrollDocIcon,
  ToolboxIcon,
} from "@/components/icons/ProductIcons";

// =============================================================================
// Types
// =============================================================================

interface Step {
  number: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}

// =============================================================================
// Constants
// =============================================================================

const STEPS: Step[] = [
  {
    number: 1,
    icon: OrderConfirmIcon,
    title: "Order confirmation",
  },
  {
    number: 2,
    icon: UserCircleCheckIcon,
    title: "Installation scheduled by trained professionals",
  },
  {
    number: 3,
    icon: ScrollDocIcon,
    title: "Proper setup and first-use guidance",
  },
  {
    number: 4,
    icon: ToolboxIcon,
    title: "Ongoing service support when required",
  },
];

// =============================================================================
// Step Card Component
// =============================================================================

const StepCard = memo(function StepCard({ step }: { step: Step }) {
  const IconComponent = step.icon;
  
  return (
    <div className="relative bg-[rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.12)] rounded-xl md:rounded-2xl overflow-hidden flex-1 min-w-0 p-2 md:p-6 h-[120px] md:h-[340px] flex flex-col">
      {/* Large Step Number */}
      <p className="font-display font-extrabold text-[20px] md:text-[94px] text-[rgba(0,0,0,0.08)] leading-none shrink-0">
        {step.number}
      </p>
      
      {/* Icon and Text - flex grow to push to bottom */}
      <div className="mt-auto flex flex-col gap-1 md:gap-4">
        <IconComponent className="w-4 h-4 md:w-10 md:h-10" />
        <p className="font-medium text-[10px] md:text-[20px] text-black leading-tight line-clamp-3 md:line-clamp-none">
          {step.title}
        </p>
      </div>
    </div>
  );
});

// =============================================================================
// Connecting Line SVG
// =============================================================================

const ConnectingLine = memo(function ConnectingLine() {
  return (
    <svg
      className="w-full h-auto"
      viewBox="0 0 1027 187"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Center vertical line at top */}
      <path
        d="M513.5 0V30"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="2"
        strokeDasharray="6 6"
      />
      {/* Left curved section */}
      <path
        d="M513.5 30C513.5 30 513.5 90 340 90C166.5 90 90 90 90 187"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="2"
        strokeDasharray="6 6"
        fill="none"
      />
      {/* Right curved section */}
      <path
        d="M513.5 30C513.5 30 513.5 90 687 90C860.5 90 937 90 937 187"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="2"
        strokeDasharray="6 6"
        fill="none"
      />
      {/* Far left curved section */}
      <path
        d="M340 90C250 90 175 90 175 90C90 90 90 90 90 187"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="2"
        strokeDasharray="6 6"
        fill="none"
        opacity="0"
      />
      {/* Left branch down */}
      <path
        d="M260 90V187"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="2"
        strokeDasharray="6 6"
      />
      {/* Right branch down */}
      <path
        d="M767 90V187"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="2"
        strokeDasharray="6 6"
      />
    </svg>
  );
});

// =============================================================================
// Mobile Connecting Line
// =============================================================================

const MobileConnectingLine = memo(function MobileConnectingLine() {
  return (
    <svg
      className="w-full h-auto"
      viewBox="0 0 300 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Center vertical line */}
      <path
        d="M150 0V15"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      {/* Left curve */}
      <path
        d="M150 15C150 15 150 35 75 35C50 35 40 35 40 50"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        fill="none"
      />
      {/* Right curve */}
      <path
        d="M150 15C150 15 150 35 225 35C250 35 260 35 260 50"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        fill="none"
      />
      {/* Left middle branch */}
      <path
        d="M112 35V50"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      {/* Right middle branch */}
      <path
        d="M188 35V50"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
    </svg>
  );
});

// =============================================================================
// Main Component
// =============================================================================

export const AfterBuySection = memo(function AfterBuySection() {
  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-white" aria-labelledby="after-buy-heading">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10">
        {/* Header */}
        <div className="text-center md:text-left mb-6 md:mb-8">
          {/* Subtitle */}
          <p className="text-[#3478F6] text-[16px] md:text-[20px] font-normal mb-2 md:mb-2.5">
            What Happens After You Buy
          </p>
          
          {/* Title */}
          <h2 
            id="after-buy-heading"
            className="font-display font-semibold text-[24px] md:text-[40px] flex flex-wrap justify-center md:justify-start gap-x-2 md:gap-x-6"
          >
            <span className="text-black">Simple.</span>
            <span className="text-black">Predictable.</span>
            <span className="text-[#3478F6]">No coordination issues.</span>
          </h2>
        </div>

        {/* Connecting Line - Desktop */}
        <div className="hidden md:block w-full max-w-[1027px] mx-auto mb-0 -mt-4">
          <ConnectingLine />
        </div>

        {/* Connecting Line - Mobile */}
        <div className="block md:hidden w-full max-w-[300px] mx-auto mb-2">
          <MobileConnectingLine />
        </div>

        {/* Step Cards */}
        <div className="flex gap-1 md:gap-4 lg:gap-[17px]">
          {STEPS.map((step) => (
            <StepCard key={step.number} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
});
