"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Image from "next/image";
import { ASSETS } from "@/lib/assets";

// Benefits data with card-specific styling
const benefits = [
  {
    id: 1,
    badge: "Worried about Electricity Bills?",
    headline: "India’s #1 Rated Energy Efficient AC",
    description: "25-35% lower electricity bills every single day!",
    variant: "light" as const,
    mobileAsset: ASSETS.benf1Ass1,
    desktopAsset1: ASSETS.benf1Ass1,
    desktopAsset2: ASSETS.benf1Ass2,
  },
  {
    id: 2,
    badge: "Cooling fails in peak summer?",
    headline: "Tested to cool\nat 50°C",
    description: "No performance drop when others derate.",
    variant: "blue" as const,
    mobileAsset: ASSETS.benf2Ass1,
    desktopAsset1: ASSETS.benf2Ass1,
  },
  {
    id: 3,
    badge: "Cooling suddenly dropping?",
    headline: "Live Gas Level\nIndicator with alerts",
    description: "0 Surprises. 100% Control",
    variant: "light" as const,
    mobileAsset: ASSETS.benf3Ass2,
    desktopAsset1: ASSETS.benf3Ass2,
    desktopAsset2: ASSETS.benf3Ass1,
  },
];

// Card 1 Component - Energy Efficient
function BenefitCard1({ benefit }: { benefit: (typeof benefits)[0] }) {
  return (
    <div className="benefit-card flex-shrink-0 w-[85vw] max-w-[326px] md:w-[85dvw] lg:w-[80dvw] xl:w-[75dvw] md:max-w-[1200px] relative rounded-[24px] overflow-hidden border border-black/[0.12]">
      {/* Mobile Layout */}
      <div className="md:hidden relative h-[70dvh] min-h-[500px] max-h-[580px] bg-[rgba(52,120,246,0.08)]">
        {/* Text Content - Top */}
        <div className="absolute left-4 top-6 flex flex-col gap-3 w-[85%] z-20">
          <span className="inline-flex w-fit px-[14px] py-2 bg-[#212121] text-white text-xs font-medium rounded-full leading-[1.2]">
            {benefit.badge}
          </span>
          <h3 className="font-display text-[28px] font-bold text-[#3478f6] leading-[1.1] whitespace-pre-line">
            {benefit.headline}
          </h3>
          <p className="text-[16px] text-[#212121] leading-[1.3] tracking-[-0.64px]">
            {benefit.description}
          </p>
        </div>

        {/* Phone Hand Image - Bottom right */}
        <div className="absolute right-[-15%] bottom-0 w-[85%] h-[65%] z-10">
          <Image
            src={benefit.mobileAsset}
            alt=""
            fill
            className="object-contain object-bottom"
            sizes="(max-width: 768px) 85vw, 380px"
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex relative h-[70dvh] min-h-[500px] max-h-[700px] bg-[rgba(52,120,246,0.08)]">
        {/* Light Blue Background Panel - Left portion */}
        <div className="absolute left-0 top-0 w-[60%] h-full rounded-l-[20px]" />

        {/* Text Content - Left side */}
        <div className="absolute left-[44px] top-1/2 -translate-y-1/2 flex flex-col gap-4 w-[40%] max-w-[450px] z-20">
          <div className="flex flex-col gap-4 w-full">
            <span className="inline-flex w-fit px-6 py-3 bg-[#212121] text-white text-base font-medium rounded-full leading-[1.2]">
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

        {/* Phone Hand Image - Center-right */}
        <div className="absolute left-[45%] top-[3%] w-[45%] h-[105%] z-10">
          <Image
            src={benefit.desktopAsset1}
            alt=""
            fill
            className="object-contain object-bottom"
            sizes="(max-width: 1024px) 45vw, 550px"
          />
        </div>

        {/* AC Unit Image - Far right background */}
        {benefit.desktopAsset2 && (
          <div className="absolute right-0 top-0 w-[35%] h-full z-0">
            <Image
              src={benefit.desktopAsset2}
              alt=""
              fill
              className="object-cover object-left"
              sizes="35vw"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Card 2 Component - 50°C Tested
function BenefitCard2({ benefit }: { benefit: (typeof benefits)[1] }) {
  return (
    <div className="benefit-card flex-shrink-0 w-[85vw] max-w-[326px] md:w-[85dvw] lg:w-[80dvw] xl:w-[75dvw] md:max-w-[1200px] relative rounded-[24px] overflow-hidden border border-black/[0.12]">
      {/* Mobile Layout */}
      <div className="md:hidden relative h-[70dvh] min-h-[500px] max-h-[580px] flex flex-col">
        {/* Blue Background - Top portion with text */}
        <div className="relative bg-[#3478f6] px-4 pt-6 pb-4 flex-shrink-0">
          <span className="inline-flex w-fit px-[14px] py-2 bg-[#fffcdc] text-[#212121] text-xs font-medium rounded-full leading-[1.2] mb-3">
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
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 326px"
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex relative h-[70dvh] min-h-[500px] max-h-[700px] bg-white">
        {/* Blue Background Panel - Left side */}
        <div className="absolute left-0 top-0 w-[45%] z-[20] h-full bg-[#3478f6] rounded-l-[20px]" />

        {/* Text Content - Left side */}
        <div className="absolute left-[44px] top-1/2 -translate-y-1/2  flex flex-col gap-4 w-[45%] max-w-[420px] z-20">
          <div className="flex flex-col gap-4 w-full">
            <span className="inline-flex w-fit px-6 py-3 bg-[#fffcdc] text-[#212121] text-base font-medium rounded-full leading-[1.2]">
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
function BenefitCard3({ benefit }: { benefit: (typeof benefits)[2] }) {
  return (
    <div className="benefit-card flex-shrink-0 w-[85vw] max-w-[326px] md:w-[85dvw] lg:w-[80dvw] xl:w-[75dvw] md:max-w-[1200px] relative rounded-[24px] overflow-hidden border border-black/[0.12]">
      {/* Mobile Layout */}
      <div className="md:hidden relative h-[70dvh] min-h-[500px] max-h-[580px] bg-[rgba(52,120,246,0.08)]">
        {/* Text Content - Top */}
        <div className="absolute left-4 top-6 flex flex-col gap-3 w-[85%] z-20">
          <span className="inline-flex w-fit px-[14px] py-2 bg-[#212121] text-white text-xs font-medium rounded-full leading-[1.2]">
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
            <span className="inline-flex w-fit px-6 py-3 bg-[#212121] text-white text-base font-medium rounded-full leading-[1.2]">
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

  useGSAP(
    () => {
      const carousel = carouselRef.current;
      const section = sectionRef.current;
      if (!carousel || !section) return;

      gsap.set(headerRef.current, { opacity: 0, y: 40 });

      let scrollDistance = 0;

      const updateMetrics = () => {
        const cards = carousel.querySelectorAll(".benefit-card");
        if (!cards.length) return;
        const gap = parseFloat(getComputedStyle(carousel).columnGap) || 16;
        const cardWidth = cards[0].getBoundingClientRect().width;
        const totalWidth = (cardWidth + gap) * cards.length - gap;
        const containerWidth =
          carousel.parentElement?.getBoundingClientRect().width ||
          window.innerWidth;
        scrollDistance = Math.max(totalWidth - containerWidth + 48, 0);
      };

      updateMetrics();

      // Header fade in
      gsap.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        force3D: true,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // Horizontal scroll driven by vertical scroll — all devices
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: "top top",
        end: () => `+=${scrollDistance + window.innerHeight * 0.5}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 1,
        invalidateOnRefresh: true,
        onRefresh: updateMetrics,
        onUpdate: (self) => {
          const xMove = -scrollDistance * self.progress;
          gsap.set(carousel, { x: xMove, force3D: true });
        },
      });

      // Refresh after images load
      const images = carousel.querySelectorAll("img");
      const handleImageLoad = () => {
        updateMetrics();
        ScrollTrigger.refresh();
      };
      images.forEach((img) => {
        if (!img.complete) {
          img.addEventListener("load", handleImageLoad);
        }
      });

      return () => {
        images.forEach((img) => {
          img.removeEventListener("load", handleImageLoad);
        });
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="benefits"
      ref={sectionRef}
      className="relative bg-[#FFFFFF] overflow-x-hidden z-[1]"
    >
      {/* Spacer for AC image + Buy Now button overflow from hero section */}
      <div className="pt-[20px] md:pt-[200px]" />

      {/* Pinned scroll container - no top padding so pin works correctly */}
      <div ref={triggerRef} className="pt-4 md:pt-6 pb-8 md:pb-12 lg:pb-16">
        <div className="mx-auto px-4 md:px-6 lg:px-8 max-w-[1400px] md:max-w-none">
          {/* Section Header */}
          <div
            ref={headerRef}
            className="mb-6 md:mb-8 will-change-[transform,opacity]"
          >
            <h2 className="hidden md:block font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#212121] leading-tight">
              Best Cooling. Lowest Bills.
              <br />
              Designed for Tomorrow.
            </h2>
            <h2 className="md:hidden font-display text-3xl font-bold text-gray-900 leading-tight">
              Best Cooling. Lowest Bills.
              <br />
              Designed for Tomorrow.
            </h2>
          </div>

          {/* Carousel */}
          <div
            ref={carouselRef}
            className="flex gap-4 md:gap-6 overflow-visible pb-4 md:pb-0 will-change-transform"
          >
            {benefits.map((benefit, index) => (
              <div key={benefit.id}>
                {index === 0 && <BenefitCard1 benefit={benefit} />}
                {index === 1 && (
                  <BenefitCard2 benefit={benefit as (typeof benefits)[1]} />
                )}
                {index === 2 && (
                  <BenefitCard3 benefit={benefit as (typeof benefits)[2]} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
