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
    label: "Mission Locked",
    year: "Feb 2024",
    description:
      "Heat stress chosen as the problem to solve. Optimist commits to climate adaptation through thermal comfort.",
    image: ASSETS.timelineImage,
  },
  {
    id: 2,
    label: "First-Principle Designing",
    year: "Mar 2024",
    description:
      "Pranav Chopra joins. First-principles engineering begins. The problem shifts from 'what' to 'how'.",
    image: ASSETS.timelineImage,
  },
  {
    id: 3,
    label: "Company Incorporated",
    year: "Aug 2024",
    description:
      "Optimist formally comes into existence. From research project to real company.",
    image: ASSETS.timelineImage,
  },
  {
    id: 4,
    label: "Lab + Manufacturing Live",
    year: "Nov 2024",
    description:
      "Nalanda-1 R&D Lab and dedicated workshop commissioned. Ability to test, fail, iterate, and build at scale. Before: theory. After: execution engine.",
    image: ASSETS.timelineImage,
  },
  {
    id: 5,
    label: "Technology Breakthrough",
    year: "July 2025",
    description:
      "Super-efficient AC architecture validated for Indian conditions. Performance, efficiency, and buildability converge. Before: experiments. After: product direction locked.",
    image: ASSETS.timelineImage,
  },
  {
    id: 6,
    label: "Conviction Backed",
    year: "Dec 2025",
    description:
      "USD 12M raised from Accel, Arkam Ventures & Sparrow Capital. External validation that climate-first engineering deserved scale.",
    image: ASSETS.timelineImage,
  },
  {
    id: 7,
    label: "Market Entry",
    year: "Jan 2026",
    description:
      "Optimist's first product launches in India. A new cooling standard enters the market.",
    image: ASSETS.timelineImage,
  },
];

// Decorative Abstract Shape SVG Component
function DecorativeShape({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 328 455"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M199.86 175.808C226.192 211.769 241.862 251.894 250.425 304.643L210.69 311.056C203.143 264.653 189.604 229.632 166.657 198.506C165.405 196.794 162.731 197.398 162.325 199.447C147.094 282.818 150.919 371.595 175.254 455H133.488C111.387 373.039 107.528 286.612 120.728 204.449C121.067 202.2 118.359 200.756 116.7 202.368C98.9314 219.223 80.0454 242.861 65.5932 270.126L29.9536 251.558C48.6365 216.269 75.5778 183.195 102.417 161.505C104.177 160.061 103.128 157.207 100.861 157.274C67.827 158.147 40.9196 167.649 16.5845 178.595L0 142.198C30.1566 128.801 65.9994 116.344 111.387 117.385C113.553 117.452 114.704 114.766 113.079 113.288C100.014 101.201 84.1069 92.0006 65.0855 85.3859L78.3531 47.6791C105.971 57.2485 129.122 71.7873 147.466 90.9933C148.685 92.2692 150.783 91.8663 151.426 90.221C163.746 58.4237 178.977 28.1374 197.017 0L230.998 21.4556C217.73 42.2397 206.053 64.2661 196.103 87.2327C195.189 89.3144 197.49 91.3626 199.487 90.2546C227.072 74.9435 264.268 60.2705 316.357 48.9215L324.988 87.8706C272.391 99.3875 237.124 114.161 212.078 129.237C210.284 130.312 210.69 132.998 212.721 133.569C253.471 145.086 292.631 165.87 328 195.182L302.176 225.771C279.262 206.8 245.348 184.371 202.466 172.115C200.266 171.511 198.506 173.995 199.86 175.808Z"
        fill="#FFFFFF"
        fillOpacity="1.5"
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
    <div className="relative flex-shrink-0 w-[290px] md:w-[600px] lg:w-[780px] h-[559px] md:h-[480px] lg:h-[516px] rounded-[20px] bg-[#F5F5F5] border border-[#E8E8E8] overflow-hidden">
      {/* Decorative Shape - positioned in upper right on mobile, lower-left on desktop */}
      <div className="absolute right-[-40px] top-[40px] md:left-[-30px] md:right-auto md:top-auto md:bottom-[-40px] lg:left-[-40px] lg:bottom-[-60px] pointer-events-none">
        <div className="w-[200px] h-[280px] md:w-[320px] md:h-[400px] lg:w-[400px] lg:h-[500px] opacity-50">
          <DecorativeShape className="w-full h-full" />
        </div>
      </div>

      {/* Desktop Layout - Two columns */}
      <div className="hidden md:flex relative z-10 gap-[40px] lg:gap-[54px] h-full px-[40px] lg:px-[54px] py-[36px] lg:py-[44px]">
        {/* Left Column - Label, Divider at top; Year at bottom */}
        <div className="flex flex-col justify-between items-start w-[260px] lg:w-[318px] h-full">
          {/* Top: Label and Divider */}
          <div className="flex flex-col gap-4 w-full">
            <p className="font-normal text-[18px] lg:text-[20px] text-black/50 tracking-[0.8px] leading-normal">
              {label}
            </p>
            <div className="w-[220px] lg:w-[281px] h-px bg-black/20" />
          </div>

          {/* Bottom: Year */}
          <p className="font-bold text-[100px] lg:text-[128px] text-[#E3E3E3] leading-none tracking-[5.12px]">
            {year}
          </p>
        </div>

        {/* Right Column - Description at top, Image at bottom */}
        <div className="flex flex-col justify-between flex-1 w-[240px] lg:w-[301px] h-full">
          <p className="font-normal text-[15px] lg:text-[16px] text-black leading-[1.4] tracking-[0.64px]">
            {description}
          </p>

          {/* Image */}
          <div className="relative w-full h-[200px] lg:h-[260px] rounded-[16px] overflow-hidden">
            <Image
              src={image}
              alt={`Timeline ${year}`}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 260px, 301px"
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout - Single column: Label -> Divider -> Year -> Description -> Image */}
      <div className="flex md:hidden flex-col relative z-10 px-[36px] py-[20px] h-full">
        {/* Label */}
        <p className="font-normal text-[14px] text-black/50 tracking-[0.56px] leading-normal">
          {label}
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-black/20 mt-4" />

        {/* Year - positioned below divider */}
        <p className="font-bold text-[44px] text-[#E3E3E3] leading-none tracking-[1.76px] mt-[28px]">
          {year}
        </p>

        {/* Description */}
        <p className="font-normal text-[14px] text-black leading-[1.4] tracking-[0.56px] mt-[24px]">
          {description}
        </p>

        {/* Image - at bottom */}
        <div className="relative w-full h-[260px] rounded-[16px] overflow-hidden mt-auto">
          <Image
            src={image}
            alt={`Timeline ${year}`}
            fill
            className="object-cover object-center"
            sizes="290px"
          />
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
