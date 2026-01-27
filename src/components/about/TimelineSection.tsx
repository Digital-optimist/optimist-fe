"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ASSETS } from "@/lib/assets";

// =============================================================================
// Timeline Section - "Engineering a new standard."
// =============================================================================

// Timeline data - 14 milestones
const timelineData = [
  {
    id: 1,
    label: "How it started",
    year: "Sept–Dec 2023",
    description:
      "A question, not a company. Ashish researched India's climate challenges: heat, energy stress, urban vulnerability. The goal wasn't to build. It was to understand what truly mattered.",
    image: ASSETS.timelineImage,
  },
  {
    id: 2,
    label: "Finding focus",
    year: "Jan 2024",
    description:
      "At a climate forum, one question crystallized everything: Where does India need innovation most urgently? The answer was immediate. Heat stress, the country's most pressing yet under-addressed risk.",
    image: ASSETS.timelineImage,
  },
  {
    id: 3,
    label: "The commitment",
    year: "15 Feb 2024",
    description:
      "Heat stress became the mission. Solve climate adaptation through technology, starting with thermal comfort. This was the point of no return.",
    image: ASSETS.timelineImage,
  },
  {
    id: 4,
    label: "Testing reality",
    year: "Feb–Mar 2024",
    description:
      "45 days of stress-testing feasibility across engineering, energy economics, and manufacturing. Ashish partnered with Pranav Chopra (CTO) and Manjunath V., aligning on first-principles cooling.",
    image: ASSETS.timelineImage,
  },
  {
    id: 5,
    label: "Building begins",
    year: "1 Apr 2024",
    description:
      "Real R&D started. Not slides. Not specs. Real systems, real constraints, real India.",
    image: ASSETS.timelineImage,
  },
  {
    id: 6,
    label: "Optimist is born",
    year: "Aug 2024",
    description:
      "Formally incorporated with one belief: Cooling for India must be designed for India.",
    image: ASSETS.timelineImage,
  },
  {
    id: 7,
    label: "Early backing",
    year: "2024",
    description:
      "USD 4M pre-seed from Accel and Sparrow Capital. Capital follows conviction in climate-first engineering.",
    image: ASSETS.timelineImage,
  },
  {
    id: 8,
    label: "Academic rigor",
    year: "Late 2024",
    description:
      "Mentorship from Prof. Anurag Goyal (IIT Delhi) strengthened scientific and systems thinking foundations.",
    image: ASSETS.timelineImage,
  },
  {
    id: 9,
    label: "The lab",
    year: "Nov 2024–Apr 2025",
    description:
      "Nalanda-1 R&D Lab commissioned. A dedicated space to test, fail, iterate, and validate under extreme conditions. Core R&D team built in parallel.",
    image: ASSETS.timelineImage,
  },
  {
    id: 10,
    label: "Manufacturing readiness",
    year: "Jan 2025",
    description:
      "Dedicated workshop came online. Innovations needed to be not just efficient but buildable at scale.",
    image: ASSETS.timelineImage,
  },
  {
    id: 11,
    label: "The breakthrough",
    year: "Apr–Jul 2025",
    description:
      "Multiple technology breakthroughs converged. One direction emerged clearly: super-efficient air conditioners built for Indian heat, grids, and homes.",
    image: ASSETS.timelineImage,
  },
  {
    id: 12,
    label: "Global validation",
    year: "Aug 2025",
    description:
      "Selected for the Third Derivative climate incubator. Optimist is validated among leading global climate-tech companies.",
    image: ASSETS.timelineImage,
  },
  {
    id: 13,
    label: "Scaling up",
    year: "Dec 2025",
    description:
      "USD 8M additional funding led by Accel. Fuel for scaling R&D, manufacturing, and market readiness.",
    image: ASSETS.timelineImage,
  },
  {
    id: 14,
    label: "Ready for India",
    year: "Jan 2026",
    description:
      "After two years of research, engineering, and validation, Optimist's first product enters the market. Not as another AC. As a new standard for cooling in a warming India.",
    image: ASSETS.timelineImage,
  },
];

// Decorative Abstract Shape SVG Component
function DecorativeShape({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 328 354"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M199.86 175.808C226.192 211.769 241.862 251.894 250.425 304.643L210.69 311.056C203.143 264.653 189.604 229.632 166.657 198.506C165.405 196.794 162.731 197.398 162.325 199.447C147.094 282.818 150.919 371.595 175.254 455H133.488C111.387 373.039 107.528 286.612 120.728 204.449C121.067 202.2 118.359 200.756 116.7 202.368C98.9314 219.223 80.0454 242.861 65.5932 270.126L29.9536 251.558C48.6365 216.269 75.5778 183.195 102.417 161.505C104.177 160.061 103.128 157.207 100.861 157.274C67.827 158.147 40.9196 167.649 16.5845 178.595L0 142.198C30.1566 128.801 65.9994 116.344 111.387 117.385C113.553 117.452 114.704 114.766 113.079 113.288C100.014 101.201 84.1069 92.0006 65.0855 85.3859L78.3531 47.6791C105.971 57.2485 129.122 71.7873 147.466 90.9933C148.685 92.2692 150.783 91.8663 151.426 90.221C163.746 58.4237 178.977 28.1374 197.017 0L230.998 21.4556C217.73 42.2397 206.053 64.2661 196.103 87.2327C195.189 89.3144 197.49 91.3626 199.487 90.2546C227.072 74.9435 264.268 60.2705 316.357 48.9215L324.988 87.8706C272.391 99.3875 237.124 114.161 212.078 129.237C210.284 130.312 210.69 132.998 212.721 133.569C253.471 145.086 292.631 165.87 328 195.182L302.176 225.771C279.262 206.8 245.348 184.371 202.466 172.115C200.266 171.511 198.506 173.995 199.86 175.808Z"
        fill="#E8E8E8"
        fillOpacity="0.6"
      />
    </svg>
  );
}

// Timeline Card Component
function TimelineCard({
  label,
  year,
  description,
  image,
}: {
  label: string;
  year: string;
  description: string;
  image: string;
}) {
  return (
    <div className="relative flex-shrink-0 w-[320px] md:w-[600px] lg:w-[780px] h-auto md:h-[480px] lg:h-[516px] rounded-[20px] md:rounded-[20px] border border-[#E5E5E5] bg-white overflow-hidden">
      {/* Decorative Shape - positioned in upper right on mobile, lower-left on desktop */}
      <div className="absolute right-[20px] top-[60px] md:left-[30px] md:right-auto md:top-auto md:bottom-[80px] lg:left-[40px] lg:bottom-[120px] w-[120px] md:w-[200px] lg:w-[260px] h-[130px] md:h-[216px] lg:h-[280px] pointer-events-none z-0">
        <DecorativeShape className="w-full h-full" />
      </div>

      {/* Card Content - Mobile: single column, Desktop: two columns */}
      <div className="relative z-10 flex flex-col md:flex-row gap-0 md:gap-[40px] lg:gap-[54px] h-full px-[24px] md:px-[40px] lg:px-[54px] py-[24px] md:py-[36px] lg:py-[44px]">
        {/* Desktop Left Column - Label, Divider, Year (hidden on mobile) */}
        <div className="hidden md:flex flex-col justify-between items-start w-[280px] lg:w-[318px] h-full">
          {/* Top: Label and Divider */}
          <div className="flex flex-col gap-4 w-full">
            <p className="font-normal text-[18px] lg:text-[20px] text-black/50 tracking-[0.8px] leading-normal">
              {label}
            </p>
            <div className="w-[220px] lg:w-[281px] h-px bg-black/20" />
          </div>

          {/* Bottom: Year */}
          <p className="font-bold text-[100px] lg:text-[128px] text-[#E3E3E3] leading-none tracking-[0.04em]">
            {year}
          </p>
        </div>

        {/* Desktop Right Column - Description and Image (hidden on mobile) */}
        <div className="hidden md:flex flex-col gap-6 lg:gap-[53px] flex-1 w-[260px] lg:w-[301px]">
          <p className="font-normal text-[15px] lg:text-[16px] text-black leading-[1.4] tracking-[0.04em]">
            {description}
          </p>

          {/* Image */}
          <div className="relative w-full h-[200px] lg:h-[260px] rounded-[14px] lg:rounded-[16px] overflow-hidden">
            <Image
              src={image}
              alt={`Timeline ${year}`}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 260px, 301px"
            />
          </div>
        </div>

        {/* Mobile Layout - Single column with: Label -> Year -> Description -> Image */}
        <div className="flex md:hidden flex-col w-full">
          {/* Label */}
          <p className="font-normal text-[16px] text-black/50 tracking-[0.8px] leading-normal mb-2">
            {label}
          </p>
          
          {/* Divider */}
          <div className="w-full h-px bg-black/20 mb-4" />

          {/* Year - large faded text */}
          <p className="font-bold text-[80px] text-[#E3E3E3] leading-none tracking-[0.02em] mb-6">
            {year}
          </p>

          {/* Description */}
          <p className="font-normal text-[16px] text-black leading-[1.5] tracking-[0.02em] mb-6">
            {description}
          </p>

          {/* Image - at bottom, full width */}
          <div className="relative w-full h-[240px] rounded-[16px] overflow-hidden">
            <Image
              src={image}
              alt={`Timeline ${year}`}
              fill
              className="object-cover object-center"
              sizes="280px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Timeline Progress Dots Component
function TimelineProgress({ total }: { total: number }) {
  return (
    <div className="flex items-center w-full">
      {/* Dots with connecting lines */}
      <div className="flex items-center">
        {Array.from({ length: total }).map((_, index) => (
          <div key={index} className="flex items-center">
            {/* Dot */}
            <div
              className={`rounded-full transition-all duration-300 ${
                index === 0
                  ? "w-[12px] h-[12px] md:w-[14px] md:h-[14px] bg-[#3478F6]"
                  : "w-[10px] h-[10px] md:w-[12px] md:h-[12px] bg-[#D9D9D9]"
              }`}
            />
            {/* Connecting line (except after last dot) */}
            {index < total - 1 && (
              <div className="w-[60px] md:w-[120px] lg:w-[200px] h-[2px] bg-[#E5E5E5]" />
            )}
          </div>
        ))}
      </div>
      {/* Trailing gradient line */}
      <div className="flex-1 h-[2px] bg-gradient-to-r from-[#E5E5E5] to-transparent max-w-[300px] md:max-w-[600px] lg:max-w-[900px]" />
    </div>
  );
}

export function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

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

      // Title animation
      tl.from(
        titleRef.current,
        {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power3.out",
        },
        0,
      );

      // Cards animation
      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        tl.from(
          cards,
          {
            opacity: 0,
            x: 60,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.15,
          },
          0.2,
        );
      }

      // Progress bar animation
      tl.from(
        progressRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power3.out",
        },
        0.4,
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="bg-white py-12 md:py-16 lg:py-20 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Title - Engineering a new standard */}
        <h2
          ref={titleRef}
          className="font-display font-semibold text-[28px] md:text-[36px] lg:text-[40px] text-center mb-8 md:mb-12 lg:mb-16 px-4 will-change-[transform,opacity]"
        >
          <span className="text-black">Engineering a </span>
          <span className="text-[#3478F6]">new standard.</span>
        </h2>

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide pb-4"
        >
          <div
            ref={cardsRef}
            className="flex gap-4 md:gap-6 lg:gap-9 px-4 md:px-6 lg:px-12 w-max"
          >
            {timelineData.map((item) => (
              <TimelineCard
                key={item.id}
                label={item.label}
                year={item.year}
                description={item.description}
                image={item.image}
              />
            ))}
          </div>
        </div>

        {/* Timeline Progress Indicator */}
        {/* <div
          ref={progressRef}
          className="mt-6 md:mt-8 lg:mt-10 px-4 md:px-6 lg:px-12 will-change-[transform,opacity]"
        >
          <TimelineProgress total={timelineData.length} />
        </div> */}
      </div>
    </section>
  );
}

export default TimelineSection;
