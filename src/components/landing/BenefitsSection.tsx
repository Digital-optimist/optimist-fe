"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ASSETS } from "@/lib/assets";

// Benefits data with card-specific styling
const benefits = [
  {
    id: 0,
    badge: "Cooling fails in peak summer?",
    headline: "Tested to cool\nat 50\u00b0C",
    description: "No performance drop when others derate.",
    variant: "blue" as const,
    mobileAsset: "/images/benf0-ac-angle.webp",
    desktopAsset1: "/images/benf0-ac-angle.webp",
  },
  {
    id: 1,
    badge: "Worried about Electricity Bills?",
    headline: "India’s #1 Rated\n Energy Efficient AC",
    description: "25-35% lower electricity bills\n every single day!",
    variant: "light" as const,
    mobileAsset: "/images/Group 480960421.webp",
    desktopAsset1: "/images/Group 48096042.webp",
  },
  {
    id: 2,
    badge: "What can an AC app give me?",
    headline: "Real\nIntelligence",
    description: "Anytime. Anywhere",
    variant: "blue" as const,
    mobileAsset: ASSETS.benf2Ass2,
    desktopAsset1: ASSETS.benf2Ass1,
  },
  {
    id: 3,
    badge: "Gas level doubts? Not anymore.",
    headline: "First Ever\nGas Level Indicator",
    description: "0 Surprises. 100% Control",
    variant: "light" as const,
    mobileAsset: ASSETS.benf3Ass2,
    desktopAsset1: ASSETS.benf3Ass2,
    desktopAsset2: ASSETS.benf3Ass1,
  },
];

// Card 0 Component - 50°C Tested
function BenefitCard0({ benefit }: { benefit: (typeof benefits)[0] }) {
  return (
    <div className="benefit-card flex-shrink-0 w-[85vw] max-w-[326px] md:w-[85dvw] lg:w-[80dvw] xl:w-[75dvw] md:max-w-[1200px] relative rounded-[24px] overflow-hidden border border-black/[0.12]">
      {/* Mobile Layout - using svh to prevent resize when iOS Safari address bar shows/hides */}
      <div className="md:hidden relative h-[70svh] min-h-[500px] max-h-[600px] flex flex-col">
        {/* Blue Background - Top portion with text */}
        <div className="relative bg-[#3478f6] px-4 pt-6 pb-4 flex-shrink-0">
          <span className="inline-flex w-fit px-[14px] py-2 bg-[#AEFFD8] text-[#3478F6] text-xs font-medium rounded-full leading-[1.2] mb-3">
            {benefit.badge}
          </span>
          <h3 className="font-display text-[28px] font-bold text-[#aeffd8] leading-[1.1] whitespace-pre-line mb-2">
            {benefit.headline}
          </h3>
          <p className="text-[16px] text-[#fffcdc] leading-[1.3] tracking-[-0.64px]">
            {benefit.description}
          </p>
        </div>

        {/* AC Image - Bottom portion */}
        <div className="relative flex-1 min-h-0 bg-white">
          <Image
            src={benefit.mobileAsset}
            alt=""
            fill
            className="object-cover object-[70%_center]"
            sizes="(max-width: 768px) 85vw, 326px"
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex relative h-[70dvh] min-h-[500px] max-h-[700px] bg-white">
        {/* Blue Background Panel - Left side */}
        <div className="absolute left-0 top-0 w-[45%] z-[5] h-full bg-[#3478f6] rounded-l-[24px]" />

        {/* Text Content - Left side */}
        <div className="absolute left-[44px] top-1/2 -translate-y-1/2 flex flex-col gap-4 w-[40%] max-w-[474px] z-20">
          <div className="flex flex-col gap-4 w-full">
            <span className="inline-flex w-fit px-6 py-3 bg-[#AEFFD8] text-[#3478F6] text-base font-medium rounded-full leading-[1.2]">
              {benefit.badge}
            </span>
            <h3 className="font-display text-[clamp(32px,4vw,52px)] font-bold text-[#aeffd8] leading-[1.23] whitespace-pre-line">
              {benefit.headline}
            </h3>
          </div>
          <p className="text-[clamp(20px,2.5vw,36px)] text-[#fffcdc] leading-[1.3] tracking-[-0.04em]">
            {benefit.description}
          </p>
        </div>

        {/* AC Image - Right side, overlapping blue panel */}
        <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-[85%] h-full z-4">
          <Image
            src={benefit.desktopAsset1}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 75vw, 1000px"
          />
        </div>
      </div>
    </div>
  );
}

// Card 1 Component - Energy Efficient
function BenefitCard1({ benefit }: { benefit: (typeof benefits)[0] }) {
  return (
    <div className="benefit-card flex-shrink-0 w-[85vw] max-w-[326px] md:w-[85dvw] lg:w-[80dvw] xl:w-[75dvw] md:max-w-[1200px] relative rounded-[24px] overflow-hidden border border-black/[0.12]">
      {/* Mobile Layout - using svh to prevent resize when iOS Safari address bar shows/hides */}
      <div className="md:hidden relative h-[70svh] min-h-[500px] max-h-[600px] bg-[rgba(52,120,246,0.08)] rounded-[20px]">
        {/* Text Content - Top */}
        <div className="absolute left-[15px] top-6 flex flex-col gap-3 w-[296px] max-w-[90%] z-20">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit px-[14px] py-2 bg-[#AEFFD8] text-[#3478F6] text-xs font-medium rounded-full leading-[1.2]">
              {benefit.badge}
            </span>
            <h3 className="font-display text-[24px] font-bold text-[#3478f6] leading-[28px] whitespace-pre-line">
              {benefit.headline}
            </h3>
          </div>
          <p className="text-[16px] text-[#212121] leading-[20px] tracking-[-0.64px] whitespace-pre-line">
            {benefit.description}
          </p>
        </div>

        {/* AC with Bill Comparison Chart */}
        <div className="absolute inset-x-0 top-[38%] bottom-0 z-10">
          <Image
            src={benefit.mobileAsset}
            alt="Optimist AC saves 34% on electricity bills"
            fill
            className="object-cover object-bottom"
            sizes="(max-width: 768px) 85vw, 326px"
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex relative h-[70dvh] min-h-[500px] max-h-[700px] bg-[rgba(52,120,246,0.08)]">
        {/* Text Content - Left side */}
        <div className="absolute left-[44px] top-1/2 -translate-y-1/2 flex flex-col gap-4 w-[35%] max-w-[450px] z-20">
          <div className="flex flex-col gap-4 w-full">
            <span className="inline-flex w-fit px-6 py-3 bg-[#AEFFD8] text-[#3478F6] text-base font-medium rounded-full leading-[1.2]">
              {benefit.badge}
            </span>
            <h3 className="font-display text-[clamp(32px,4vw,52px)] font-bold text-[#3478f6] leading-[1.2] whitespace-pre-line">
              {benefit.headline}
            </h3>
          </div>
          <p className="text-[clamp(20px,2.5vw,36px)] text-[#212121] leading-[1.3] tracking-[-0.04em]">
            {benefit.description}
          </p>
        </div>

        {/* AC with Bill Comparison Chart - Right side */}
        <div className="absolute right-0 top-0 w-[55%] h-full z-10 overflow-hidden rounded-r-[24px]">
          <Image
            src={benefit.desktopAsset1}
            alt="Optimist AC saves 34% on electricity bills"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 55vw, 660px"
          />
        </div>
      </div>
    </div>
  );
}

// Card 2 Component - 50°C Tested
function BenefitCard2({ benefit }: { benefit: (typeof benefits)[2] }) {
  return (
    <div className="benefit-card flex-shrink-0 w-[85vw] max-w-[326px] md:w-[85dvw] lg:w-[80dvw] xl:w-[75dvw] md:max-w-[1200px] relative rounded-[24px] overflow-hidden border border-black/[0.12]">
      {/* Mobile Layout - using svh to prevent resize when iOS Safari address bar shows/hides */}
      <div className="md:hidden relative h-[70svh] min-h-[500px] max-h-[600px] flex flex-col">
        {/* Blue Background - Top portion with text */}
        <div className="relative bg-[#3478f6] px-4 pt-6 pb-4 flex-shrink-0">
          <span className="inline-flex w-fit px-[14px] py-2 bg-[#AEFFD8] text-[#3478F6] text-xs font-medium rounded-full leading-[1.2] mb-3">
            {benefit.badge}
          </span>
          <h3 className="font-display text-[28px] font-bold text-[#aeffd8] leading-[1.1] whitespace-pre-line mb-2">
            {benefit.headline}
          </h3>
          <p className="text-[16px] text-[#fffcdc] leading-[1.3] tracking-[-0.64px]">
            {benefit.description}
          </p>
        </div>

        {/* AC with Window Image - Bottom portion */}
        <div className="relative flex-1 min-h-0">
          <Image
            src={benefit.mobileAsset}
            alt=""
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 326px"
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex relative h-[70dvh] min-h-[500px] max-h-[700px] bg-white">
        {/* Blue Background Panel - Left side */}
        <div className="absolute left-0 top-0 w-[40%]  z-[20] h-full bg-[#3478f6] rounded-l-[20px]" />

        {/* Text Content - Left side */}
        <div className="absolute left-[44px] top-1/2 -translate-y-1/2  flex flex-col gap-4 w-[40%] max-w-[350px] z-20">
          <div className="flex flex-col gap-4 w-full">
            <span className="inline-flex w-fit px-6 py-3 bg-[#AEFFD8] text-[#3478F6] text-base font-medium rounded-full leading-[1.2]">
              {benefit.badge}
            </span>
            <h3 className="font-display text-[clamp(32px,4vw,52px)] font-bold text-[#aeffd8] leading-[1.2] whitespace-pre-line">
              {benefit.headline}
            </h3>
          </div>
          <p className="text-[clamp(20px,2.5vw,36px)] text-[#fffcdc] leading-[1.3] tracking-[-0.04em]">
            {benefit.description}
          </p>
        </div>

        {/* AC with Window Image - Right side */}
        <div className="absolute left-[25%] top-0 w-[75%] h-full z-10">
          <Image
            src={benefit.desktopAsset1}
            alt=""
            fill
            className="object-cover object-left"
            sizes="60vw"
          />
        </div>
      </div>
    </div>
  );
}

// Card 3 Component - Gas Level Indicator
function BenefitCard3({ benefit }: { benefit: (typeof benefits)[3] }) {
  return (
    <div className="benefit-card flex-shrink-0 w-[85vw] max-w-[326px] md:w-[85dvw] lg:w-[80dvw] xl:w-[75dvw] md:max-w-[1200px] relative rounded-[24px] overflow-hidden border border-black/[0.12]">
      {/* Mobile Layout - using svh to prevent resize when iOS Safari address bar shows/hides */}
      <div className="md:hidden relative h-[70svh] min-h-[500px] max-h-[600px] bg-[rgba(52,120,246,0.08)]">
        {/* Text Content - Top */}
        <div className="absolute left-4 top-6 flex flex-col gap-3 w-[85%] z-20">
          <span className="inline-flex w-fit px-[14px] py-2 bg-[#AEFFD8] text-[#3478F6] text-xs font-medium rounded-full leading-[1.2]">
            {benefit.badge}
          </span>
          <h3 className="font-display text-[28px] font-bold text-[#3478f6] leading-[1.1] whitespace-pre-line">
            {benefit.headline}
          </h3>
          <p className="text-[16px] text-[#212121] leading-[1.3] tracking-[-0.64px]">
            {benefit.description}
          </p>
        </div>

        {/* Phone Hand Image - Bottom right (larger size) */}
        <div className="absolute right-[-35%] bottom-[-0%] w-[130%] h-[85%] z-10">
          <Image
            src={benefit.mobileAsset}
            alt=""
            fill
            className="object-contain object-bottom"
            sizes="(max-width: 768px) 130vw, 500px"
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex relative h-[70dvh] min-h-[500px] max-h-[700px] bg-[#eff4fe]">
        {/* Light Blue Background Panel - Left portion */}
        <div className="absolute left-0 top-0 w-[55%] h-full bg-[#eff4fe] rounded-l-[20px]" />

        {/* Text Content - Left side */}
        <div className="absolute left-[44px] top-1/2 -translate-y-1/2 flex flex-col gap-4 w-[40%] max-w-[450px] z-20">
          <div className="flex flex-col gap-4 w-full">
            <span className="inline-flex w-fit px-6 py-3 bg-[#AEFFD8] text-[#3478F6] text-base font-medium rounded-full leading-[1.2]">
              {benefit.badge}
            </span>
            <h3 className="font-display text-[clamp(32px,4vw,48px)] font-bold text-[#3478f6] leading-[1.2] whitespace-pre-line">
              {benefit.headline}
            </h3>
          </div>
          <p className="text-[clamp(20px,2.5vw,36px)] text-[#212121] leading-[1.3] tracking-[-0.04em]">
            {benefit.description}
          </p>
        </div>

        {/* Phone Hand Image - Center (larger size) */}
        <div className="absolute left-[35%] top-[-30%] w-[65%] h-[135%] z-10">
          <Image
            src={benefit.desktopAsset1}
            alt=""
            fill
            className="object-contain object-bottom"
            sizes="65vw"
          />
        </div>

        {/* AC with Leaves Image - Far right */}
        {benefit.desktopAsset2 && (
          <div className="absolute right-0 top-0 w-[40%] h-full z-0">
            <Image
              src={benefit.desktopAsset2}
              alt=""
              fill
              className="object-cover object-left"
              sizes="40vw"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function BenefitsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Distance the carousel must translate left to expose all cards. Measured
  // from the DOM on mount + resize + image load — same metric the old
  // ScrollTrigger maintained.
  const [scrollDistance, setScrollDistance] = useState(0);

  useLayoutEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const updateMetrics = () => {
      const cards = carousel.querySelectorAll(".benefit-card");
      if (!cards.length) return;
      const gap = parseFloat(getComputedStyle(carousel).columnGap) || 16;
      const cardWidth = cards[0].getBoundingClientRect().width;
      const totalWidth = (cardWidth + gap) * cards.length - gap;
      const containerWidth =
        carousel.parentElement?.getBoundingClientRect().width ||
        window.innerWidth;
      setScrollDistance(Math.max(totalWidth - containerWidth + 48, 0));
    };

    updateMetrics();

    const ro = new ResizeObserver(updateMetrics);
    ro.observe(carousel);
    if (carousel.parentElement) ro.observe(carousel.parentElement);

    const images = carousel.querySelectorAll("img");
    const handleImageLoad = () => updateMetrics();
    images.forEach((img) => {
      if (!img.complete) img.addEventListener("load", handleImageLoad);
    });

    return () => {
      ro.disconnect();
      images.forEach((img) => img.removeEventListener("load", handleImageLoad));
    };
  }, []);

  // Drive the carousel's horizontal translation from vertical scroll progress
  // through the trigger container. The inner element is `position: sticky` so
  // it pins to the viewport top for the duration of the trigger's height —
  // exactly mirroring GSAP's `pin: true` + `scrub: 1` behaviour.
  const { scrollYProgress } = useScroll({
    target: triggerRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

  // Header fade-in on desktop only (mobile shows it immediately on mount).
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      el.style.opacity = "1";
      el.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          el.style.opacity = "0";
          el.style.transform = "translate3d(0, 40px, 0)";
          requestAnimationFrame(() => {
            el.style.transition =
              "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
            el.style.opacity = "1";
            el.style.transform = "translate3d(0, 0, 0)";
          });
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="benefits"
      ref={sectionRef}
      className="relative bg-[#FFFFFF] overflow-x-clip z-[1]"
    >
      <div className="pt-[20px] md:pt-[200px]" />

      {/* The trigger container's height creates the scroll distance the user
          must scroll through. We use a CSS-computed `min-height` based on
          viewport units as a defensive baseline so the trigger is always
          tall enough to hold the carousel scroll even before the JS
          measurement of scrollDistance arrives. The exact `height` is then
          set from the measured scrollDistance for precise alignment.

          ~325vw covers: 4 cards × ~80vw width + 3 × 24px gaps - 100vw
          container = ~220vw of horizontal travel, plus 100vh for the
          pinned viewport — total ≈ 100vh + 220vw. Padding the estimate to
          325vw is safe and never under-sizes the trigger. */}
      <div
        ref={triggerRef}
        className="relative"
        style={{
          height:
            scrollDistance > 0
              ? `calc(100vh + ${scrollDistance}px)`
              : undefined,
          minHeight: "calc(100vh + 240vw)",
        }}
      >
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <div className="mx-auto px-4 md:px-6 lg:px-8 max-w-[1400px] md:max-w-none w-full">
            <div
              ref={headerRef}
              className="mb-16 md:mb-8 will-change-[transform,opacity]"
            >
            <h2 className="hidden md:block font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#212121] leading-tight">
              <span
                style={{
                  background:
                    "linear-gradient(151.7deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {" "}
                Best Cooling. Lowest Bills.
              </span>
              <br />{" "}
              <span className="font-[#000000]">Designed for Tomorrow.</span>
            </h2>
            <h2 className="md:hidden font-display text-[28px] font-bold text-gray-900 leading-tight">
              <span
                style={{
                  background:
                    "linear-gradient(151.7deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {" "}
                Best Cooling. Lowest Bills.
              </span>
              <br />{" "}
              <span className="font-[#000000]">Designed for Tomorrow.</span>
            </h2>
          </div>

            <motion.div
              ref={carouselRef}
              className="flex gap-4 md:gap-6 overflow-visible pb-4 md:pb-0 will-change-transform"
              style={{ x }}
            >
              {benefits.map((benefit, index) => (
                <div key={benefit.id}>
                  {index === 0 && <BenefitCard0 benefit={benefit} />}
                  {index === 1 && <BenefitCard1 benefit={benefit} />}
                  {index === 2 && (
                    <BenefitCard2 benefit={benefit as (typeof benefits)[2]} />
                  )}
                  {index === 3 && (
                    <BenefitCard3 benefit={benefit as (typeof benefits)[3]} />
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
