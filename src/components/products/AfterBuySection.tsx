"use client";

import { memo, useRef, useLayoutEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { motion, useInView } from "framer-motion";
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
    title: "Order confirmed. You're all set.",
  },
  {
    number: 2,
    icon: UserCircleCheckIcon,
    title: "Professionally installed. By trained technicians.",
  },
  {
    number: 3,
    icon: ScrollDocIcon,
    title: "Expertly configured. Ready to perform.",
  },
  {
    number: 4,
    icon: ToolboxIcon,
    title: "Supported throughout. Whenever you need us.",
  },
];

// =============================================================================
// Step Card Component
// =============================================================================

const StepCard = memo(function StepCard({ step }: { step: Step }) {
  const IconComponent = step.icon;

  return (
    <div className="relative bg-[rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.12)] rounded-xl md:rounded-2xl overflow-hidden p-2 md:p-6 h-[120px] md:h-[340px] flex flex-col">
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
// Connecting Line SVG with Animation
// =============================================================================

// Animation duration for the flow effect
const FLOW_DURATION = 2;

// Animated path component for the flowing dots
const AnimatedPath = memo(function AnimatedPath({
  d,
  delay = 0,
  strokeWidth = 2,
  isInView = false,
}: {
  d: string;
  delay?: number;
  strokeWidth?: number;
  isInView?: boolean;
}) {
  return (
    <motion.path
      d={d}
      stroke="#3478F6"
      strokeWidth={strokeWidth}
      strokeDasharray="6 6"
      fill="none"
      strokeLinecap="round"
      initial={{ strokeDashoffset: 0 }}
      animate={isInView ? { strokeDashoffset: -24 } : { strokeDashoffset: 0 }}
      transition={{
        duration: FLOW_DURATION,
        ease: "linear",
        repeat: Infinity,
        delay,
      }}
    />
  );
});

const ConnectingLine = memo(function ConnectingLine() {
  const svgRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(svgRef, { once: false, amount: 0.3 });

  return (
    <svg
      ref={svgRef}
      className="w-full h-auto"
      viewBox="0 0 1027 187"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Static gray paths (background) */}
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

      {/* Animated blue paths (overlay) */}
      {/* Center vertical line - starts first */}
      <AnimatedPath d="M513.5 0V30" delay={0} isInView={isInView} />

      {/* Left curved section - starts after center line */}
      <AnimatedPath
        d="M513.5 30C513.5 30 513.5 90 340 90C166.5 90 90 90 90 187"
        delay={0.1}
        isInView={isInView}
      />

      {/* Right curved section - starts after center line */}
      <AnimatedPath
        d="M513.5 30C513.5 30 513.5 90 687 90C860.5 90 937 90 937 187"
        delay={0.1}
        isInView={isInView}
      />

      {/* Left branch down - starts after curve reaches 90 */}
      <AnimatedPath d="M260 90V187" delay={0.3} isInView={isInView} />

      {/* Right branch down - starts after curve reaches 90 */}
      <AnimatedPath d="M767 90V187" delay={0.3} isInView={isInView} />
    </svg>
  );
});

// =============================================================================
// Mobile Connecting Line
// =============================================================================

// Mobile animated path with smaller dash array
const MobileAnimatedPath = memo(function MobileAnimatedPath({
  d,
  delay = 0,
  isInView = false,
}: {
  d: string;
  delay?: number;
  isInView?: boolean;
}) {
  return (
    <motion.path
      d={d}
      stroke="#3478F6"
      strokeWidth={1.5}
      strokeDasharray="4 4"
      fill="none"
      strokeLinecap="round"
      initial={{ strokeDashoffset: 0 }}
      animate={isInView ? { strokeDashoffset: -16 } : { strokeDashoffset: 0 }}
      transition={{
        duration: FLOW_DURATION,
        ease: "linear",
        repeat: Infinity,
        delay,
      }}
    />
  );
});

const MobileConnectingLine = memo(function MobileConnectingLine() {
  const svgRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(svgRef, { once: false, amount: 0.3 });

  return (
    <svg
      ref={svgRef}
      className="w-full h-auto"
      viewBox="0 0 300 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Static gray paths (background) */}
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

      {/* Animated blue paths (overlay) */}
      {/* Center vertical line - starts first */}
      <MobileAnimatedPath d="M150 0V15" delay={0} isInView={isInView} />

      {/* Left curve - starts after center line */}
      <MobileAnimatedPath
        d="M150 15C150 15 150 35 75 35C50 35 40 35 40 50"
        delay={0.1}
        isInView={isInView}
      />

      {/* Right curve - starts after center line */}
      <MobileAnimatedPath
        d="M150 15C150 15 150 35 225 35C250 35 260 35 260 50"
        delay={0.1}
        isInView={isInView}
      />

      {/* Left middle branch - starts after curve reaches 35 */}
      <MobileAnimatedPath d="M112 35V50" delay={0.2} isInView={isInView} />

      {/* Right middle branch - starts after curve reaches 35 */}
      <MobileAnimatedPath d="M188 35V50" delay={0.2} isInView={isInView} />
    </svg>
  );
});

// =============================================================================
// Main Component
// =============================================================================

export const AfterBuySection = memo(function AfterBuySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Set initial states to prevent flash
  useLayoutEffect(() => {
    if (headerRef.current) {
      gsap.set(headerRef.current, { opacity: 0, y: 40 });
    }
    if (linesRef.current) {
      gsap.set(linesRef.current.querySelectorAll("svg"), {
        opacity: 0,
        scale: 0.95,
      });
    }
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll(".step-card-wrapper");
      gsap.set(cards, { opacity: 0, y: 40 });
    }
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 25%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // Header animation
      tl.to(
        headerRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          force3D: true,
        },
        0,
      );

      // Lines animation
      if (linesRef.current) {
        tl.to(
          linesRef.current.querySelectorAll("svg"),
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
            force3D: true,
          },
          0.2,
        );
      }

      // Cards stagger animation
      const cards = cardsRef.current?.querySelectorAll(".step-card-wrapper");
      if (cards) {
        tl.to(
          cards,
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.8,
            ease: "power3.out",
            force3D: true,
          },
          0.3,
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white"
      aria-labelledby="after-buy-heading"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center md:text-left mb-6 md:mb-8 will-change-[transform,opacity]"
        >
          {/* Subtitle */}
          <p className="text-[#3478F6] text-[16px] md:text-[20px] font-normal mb-2 md:mb-2.5">
            What happens after you buy
          </p>

          {/* Title */}
          <h2
            id="after-buy-heading"
            className="font-display font-semibold text-[24px] md:text-[40px] flex flex-wrap justify-center md:justify-start gap-x-2 md:gap-x-6"
          >
            <span className="text-black">Four steps.</span>
            <span className="text-[#3478F6]">Zero hassle.</span>
          </h2>
        </div>

        {/* Connecting Lines Container */}
        <div ref={linesRef}>
          {/* Connecting Line - Desktop */}
          <div className="hidden md:block w-full max-w-[1027px] mx-auto mb-0 -mt-4 will-change-[transform,opacity]">
            <ConnectingLine />
          </div>

          {/* Connecting Line - Mobile */}
          <div className="block md:hidden w-full max-w-[300px] mx-auto mb-2 will-change-[transform,opacity]">
            <MobileConnectingLine />
          </div>
        </div>

        {/* Step Cards */}
        <div ref={cardsRef} className="flex gap-1 md:gap-4 lg:gap-[17px]">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="step-card-wrapper flex-1 min-w-0 will-change-[transform,opacity]"
            >
              <StepCard step={step} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
