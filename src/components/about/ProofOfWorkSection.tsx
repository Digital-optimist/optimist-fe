"use client";

import { useRef, memo } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ASSETS } from "@/lib/assets";

// =============================================================================
// Our Values Section - Company values with decorative palm tree
// =============================================================================

// Star Icon Component - Gold star for value items
const StarIcon = memo(function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 0L19.5922 11.0557H31.2169L21.8123 17.8885L25.4046 28.9443L16 22.1115L6.59544 28.9443L10.1877 17.8885L0.783095 11.0557H12.4078L16 0Z"
        fill="#C4A14A"
      />
    </svg>
  );
});

// Global SVG Defs for clip path - rendered once
const PalmTreeClipDef = memo(function PalmTreeClipDef() {
  return (
    <svg width="0" height="0" className="absolute">
      <defs>
        <clipPath id="palmTreeClipPath" clipPathUnits="objectBoundingBox">
          <path d="M0.609 0.386C0.690 0.465 0.737 0.554 0.764 0.670L0.643 0.684C0.619 0.582 0.578 0.505 0.508 0.436C0.504 0.432 0.496 0.434 0.495 0.438C0.448 0.621 0.460 0.817 0.534 1.000H0.407C0.340 0.820 0.328 0.630 0.368 0.449C0.369 0.444 0.361 0.441 0.356 0.445C0.302 0.482 0.244 0.534 0.200 0.594L0.091 0.553C0.148 0.475 0.230 0.403 0.312 0.355C0.318 0.352 0.314 0.345 0.308 0.346C0.207 0.348 0.125 0.368 0.051 0.392L0 0.312C0.092 0.283 0.201 0.256 0.340 0.258C0.346 0.258 0.350 0.252 0.345 0.249C0.305 0.222 0.256 0.202 0.198 0.188L0.239 0.105C0.323 0.126 0.394 0.158 0.450 0.200C0.453 0.203 0.460 0.202 0.462 0.198C0.499 0.128 0.546 0.062 0.601 0L0.704 0.047C0.664 0.093 0.628 0.141 0.598 0.192C0.595 0.196 0.602 0.201 0.608 0.198C0.692 0.165 0.806 0.132 0.964 0.107L0.991 0.193C0.830 0.218 0.723 0.251 0.647 0.284C0.641 0.286 0.642 0.292 0.649 0.294C0.773 0.319 0.892 0.365 1.000 0.429L0.921 0.496C0.851 0.454 0.748 0.405 0.617 0.378C0.611 0.377 0.605 0.382 0.609 0.386Z" />
        </clipPath>
      </defs>
    </svg>
  );
});

// Palm Tree with Video - Using clip-path mask like IndiaFirstSection
const PalmTreeDecoration = memo(function PalmTreeDecoration() {
  return (
    <div className="relative bg-white overflow-hidden w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px] xl:w-[349px] h-[280px] sm:h-[340px] md:h-[390px] lg:h-[450px] xl:h-[490px] flex items-center justify-center">
      <div
        className="relative w-[90%] aspect-[349/490]"
        style={{ clipPath: "url(#palmTreeClipPath)" }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        >
          <source src={ASSETS.videos.treeCool} type="video/mp4" />
        </video>
        {/* Blue Overlay with radial gradient - matching IndiaFirstSection */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(52, 120, 246, 0.5) 0%, rgba(52, 120, 246, 0.3) 50%, transparent 70%)",
            transform: "translateZ(0)",
          }}
        />
      </div>
    </div>
  );
});

// Value Card Component
interface ValueCardProps {
  title: string;
  subtitle: string;
  description: string;
}

const ValueCard = memo(function ValueCard({
  title,
  subtitle,
  description,
}: ValueCardProps) {
  const firstLetter = title.charAt(0);
  const restOfTitle = title.slice(1);

  return (
    <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5 w-full">
      {/* Header with star icon and title */}
      <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3">
        <StarIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 shrink-0" />
        <h3 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-black leading-[1.4]">
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">{firstLetter}</span>
          {restOfTitle}
        </h3>
      </div>
      {/* Description */}
      <div className="text-xs sm:text-sm md:text-sm lg:text-base text-black leading-[1.5] sm:leading-[1.55] md:leading-[1.6]">
        <p className="mb-0 font-medium">{subtitle}</p>
        <p className="text-black/80">{description}</p>
      </div>
    </div>
  );
});

// CHASES Values data
const VALUES_DATA: ValueCardProps[] = [
  {
    title: "Curiosity & Ingenuity",
    subtitle: "Challenge convention. Engineer better.",
    description:
      "We question what's accepted and design what should exist. Progress comes from asking why things work the way they do and refusing to accept inadequate answers.",
  },
  {
    title: "Customer Obsession",
    subtitle: "Earn trust. Keep it.",
    description:
      "Every decision measured against one question: Would we recommend this to our own families? Long-term value over short-term sales. Always.",
  },
  {
    title: "Honesty & Transparency",
    subtitle: "Clarity builds trust.",
    description:
      "Open communication about performance, limitations, and costs. When we fall short, we acknowledge it and make it right. No fine print. No complications.",
  },
  {
    title: "Action Orientation",
    subtitle: "Do. Measure. Improve.",
    description:
      "Progress comes from building, testing, and learning. We move decisively, validate rigorously, and iterate continuously.",
  },
  {
    title: "Stepping Up",
    subtitle: "Own it completely.",
    description:
      "Challenges require people who lean in, not away. We take responsibility beyond our roles and push ourselves to find solutions, not excuses.",
  },
  {
    title: "Excellence & Pace",
    subtitle: "High standards. High velocity.",
    description:
      "Quality and speed aren't trade-offs. They're both requirements. We set ambitious benchmarks and move with urgency to meet them.",
  },
];

export function ProofOfWorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const palmTreeRef = useRef<HTMLDivElement>(null);

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
      tl.from(
        headerRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
        },
        0,
      );

      // Palm tree animation (desktop only)
      if (palmTreeRef.current) {
        tl.from(
          palmTreeRef.current,
          {
            opacity: 0,
            scale: 0.95,
            duration: 1,
            ease: "power3.out",
          },
          0.2,
        );
      }

      // Value cards animation
      if (contentRef.current) {
        const cards = contentRef.current.querySelectorAll("[data-value-card]");
        tl.from(
          cards,
          {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.1,
          },
          0.3,
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="bg-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 overflow-hidden">
      {/* Global clip path definition - rendered once for both desktop and mobile */}
      <PalmTreeClipDef />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* Header Section */}
        <div
          ref={headerRef}
          className="flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 mb-6 sm:mb-8 md:mb-10 lg:mb-12 will-change-[transform,opacity]"
        >
          {/* Label */}
          <p className="font-normal text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[#3478F6] leading-normal">
            Our Values
          </p>

          {/* Title */}
          <h2 className="font-display font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-black leading-[1.2] sm:leading-[1.25] lg:leading-normal max-w-full sm:max-w-[400px] md:max-w-[480px] lg:max-w-[545px]">
            The standards we hold ourselves to.
          </h2>
        </div>

        {/* Main Content - Desktop: Palm tree left + Grid right, Mobile/Tablet: Stack */}
        <div className="flex flex-col xl:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-14 xl:gap-16">
          {/* Palm Tree - Desktop: Left side, Mobile/Tablet: Bottom */}
          <div
            ref={palmTreeRef}
            className="hidden xl:block shrink-0 will-change-[transform,opacity]"
          >
            <PalmTreeDecoration />
          </div>

          {/* Values Grid */}
          <div
            ref={contentRef}
            className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 md:gap-8 lg:gap-x-10 lg:gap-y-10 xl:gap-x-11 xl:gap-y-11"
          >
            {VALUES_DATA.map((value, index) => (
              <div key={index} data-value-card>
                <ValueCard
                  title={value.title}
                  subtitle={value.subtitle}
                  description={value.description}
                />
              </div>
            ))}
          </div>

          {/* Palm Tree - Mobile/Tablet: Bottom centered */}
          <div className="xl:hidden mt-4 sm:mt-6 md:mt-8 flex justify-center will-change-[transform,opacity]">
            <PalmTreeDecoration />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProofOfWorkSection;
