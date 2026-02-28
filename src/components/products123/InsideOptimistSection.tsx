"use client";

import { memo, useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ASSETS } from "@/lib/assets";

// =============================================================================
// Animation Variants
// =============================================================================

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.2, 1] as const,
      delay: i * 0.1,
    },
  }),
};

// =============================================================================
// Sub-components
// =============================================================================

const HeroCard = memo(function HeroCard() {
  return (
    <motion.div
      custom={0}
      variants={cardVariants}
      className="relative w-full lg:w-[49%] h-[298px] lg:h-[405px] rounded-[20px] overflow-hidden shadow-[0px_4px_30px_0px_rgba(0,0,0,0.12)] bg-[#121212]"
    >
      {/* Mobile: centered image wider than card, Desktop: full width image */}
      <div className="absolute left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 top-0 w-[374px] h-[198px] lg:w-full lg:h-[310px] overflow-hidden">
        <Image
          src={ASSETS.insideOptimistAcUnit}
          alt="Optimist Air Conditioner"
          fill
          className="object-cover object-[center_30%] lg:object-[center_25%]"
          sizes="(min-width: 1024px) 655px, 374px"
        />
      </div>

      {/* Gradient fade to bg */}
      <div className="absolute inset-x-0 bottom-[100px] lg:bottom-[70px] h-[66px] lg:h-[145px] bg-gradient-to-b from-[rgba(18,18,18,0)] to-[#121212]" />

      {/* Text content - positioned from top to match Figma */}
      <div className="absolute left-4 lg:left-3 top-[221px] lg:top-[308px] right-4 lg:right-3 flex flex-col gap-3">
        <h3 className="font-display font-semibold lg:font-bold text-xl lg:text-[28px] text-[#AEFFD8] leading-normal tracking-wide lg:tracking-normal">
          Optimist Air Conditioner
        </h3>
        <p className="text-sm lg:text-base text-white/60 leading-normal">
          Best Cooling. Lowest Bills. Designed for Tomorrow.
        </p>
      </div>
    </motion.div>
  );
});

const HeatExchangerCard = memo(function HeatExchangerCard() {
  return (
    <motion.div
      custom={1}
      variants={cardVariants}
      className="relative w-full lg:flex-1 h-[298px] lg:h-[405px] rounded-[20px] overflow-hidden shadow-[0px_4px_30px_0px_rgba(0,0,0,0.12)] bg-white"
    >
      {/* Mobile: centered image, Desktop: image pushed right */}
      <div className="absolute left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-auto lg:right-0 top-2 lg:top-[17px] w-[283px] h-[183px] lg:w-[78%] lg:h-[343px]">
        <Image
          src={ASSETS.insideOptimistHeatExchanger}
          alt="Microchannel Heat Exchanger"
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 514px, 283px"
        />
      </div>

      {/* Text - bottom-left */}
      <div className="absolute left-4 lg:left-5 bottom-7 lg:bottom-8 w-[310px] lg:w-auto lg:right-5 flex flex-col gap-3">
        <h3 className="font-display font-semibold lg:font-bold text-xl lg:text-[28px] text-[#3478F6] leading-normal tracking-wide lg:tracking-normal">
          Microchannel Heat Exchanger
        </h3>
        <p className="text-sm lg:text-base text-black/60 leading-normal">
          Removes heat faster for full cooling{" "}
          <span className="font-bold text-black">even at 50°C.</span>
        </p>
      </div>
    </motion.div>
  );
});

const CompressorCard = memo(function CompressorCard() {
  return (
    <motion.div
      custom={2}
      variants={cardVariants}
      className="relative w-[284px] lg:w-[34.8%] h-[405px] rounded-[20px] overflow-clip shadow-[0px_4px_30px_0px_rgba(0,0,0,0.12)] bg-white shrink-0 snap-start"
    >
      {/* Image - centered on mobile, right-aligned on desktop */}
      <div className="absolute left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-auto lg:right-0 top-[140px] lg:top-[107px] w-[251px] h-[279px] lg:w-[60%] lg:h-[305px]">
        <Image
          src={ASSETS.insideOptimistCompressor}
          alt="Dual-Rotary Inverter Compressor"
          fill
          className="object-contain"
          sizes="(min-width: 1024px) 281px, 221px"
        />
      </div>

      {/* Text - vertically centered, offset upward */}
      <div className="absolute left-4 lg:left-5 top-[calc(50%-131.5px)] lg:top-[calc(50%-114.5px)] -translate-y-1/2 flex flex-col gap-3">
        <h3 className="font-display font-semibold lg:font-bold text-[20px] lg:text-[28px] text-[#3478F6] leading-normal tracking-wide lg:tracking-normal w-[252px] lg:w-[300px]">
          Dual-Rotary Inverter Compressor
        </h3>
        <p className="text-[14px] lg:text-[16px] text-black/60 leading-normal w-[252px] lg:w-[256px]">
          <span>Balanced compression for stable cooling and </span>
          <span className="font-bold text-black">lower electricity bills.</span>
        </p>
      </div>
    </motion.div>
  );
});

const ExpansionValveCard = memo(function ExpansionValveCard() {
  return (
    <motion.div
      custom={3}
      variants={cardVariants}
      className="relative w-[284px] lg:w-[34.8%] h-[405px] rounded-[20px] overflow-clip shadow-[0px_4px_30px_0px_rgba(0,0,0,0.12)] bg-white shrink-0 snap-start"
    >
      {/* Image */}
      <div className="absolute left-4 lg:left-auto lg:right-0 top-[119px] lg:top-[107px] w-[252px] h-[273px] lg:w-[60%] lg:h-[305px]">
        <Image
          src={ASSETS.insideOptimistExpansionValve}
          alt="Electronic Expansion Valve"
          fill
          className="object-contain"
          sizes="(min-width: 1024px) 281px, 252px"
        />
      </div>

      {/* Text - vertically centered, offset upward */}
      <div className="absolute left-4 lg:left-5 top-[calc(50%-143.5px)] lg:top-[calc(50%-131.5px)] -translate-y-1/2 flex flex-col gap-3">
        <h3 className="font-display font-semibold lg:font-bold text-[20px] lg:text-[28px] text-[#3478F6] leading-normal tracking-wide lg:tracking-normal w-[252px] lg:w-[355px]">
          Electronic Expansion Valve
        </h3>
        <div className="text-[14px] lg:text-[16px] text-black/60 leading-normal w-[252px] lg:w-[279px]">
          <p className="lg:hidden">Precise refrigerant control for</p>
          <p className="lg:hidden font-bold text-black">
            consistent temperature and efficiency.
          </p>
          <p className="hidden lg:block">
            <span>Precise refrigerant control for </span>
            <span className="font-bold text-black">
              consistent temperature and efficiency.
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
});

const TextOnlyCards = memo(function TextOnlyCards() {
  return (
    <div className="flex flex-col gap-6 w-[284px] lg:w-auto lg:flex-1 h-[405px] shrink-0 snap-start">
      <motion.div
        custom={4}
        variants={cardVariants}
        className="flex-1 relative rounded-[20px] overflow-hidden shadow-[0px_4px_30px_0px_rgba(0,0,0,0.12)] bg-white"
      >
        <div className="absolute left-5 top-1/2 -translate-y-1/2 w-[244px] lg:w-[316px] flex flex-col gap-3">
          <h3 className="font-display font-semibold lg:font-bold text-xl lg:text-[28px] text-black leading-normal tracking-wide lg:tracking-normal">
            Real-Time Monitoring &amp; Diagnostics
          </h3>
          <p className="text-sm lg:text-base text-black/60 leading-normal">
            Track energy use and monitor system health instantly.
          </p>
        </div>
      </motion.div>

      <motion.div
        custom={5}
        variants={cardVariants}
        className="flex-1 relative rounded-[20px] overflow-hidden shadow-[0px_4px_30px_0px_rgba(0,0,0,0.12)] bg-white"
      >
        <div className="absolute left-5 top-1/2 -translate-y-1/2 w-[244px] lg:w-[316px] flex flex-col gap-3">
          <h3 className="font-display font-semibold lg:font-bold text-xl lg:text-[28px] text-black leading-normal tracking-wide lg:tracking-normal">
            Gas Level Indicator
          </h3>
          <div className="text-sm lg:text-base text-black/60 leading-normal">
            <p>Detect refrigerant drops</p>
            <p>before cooling performance declines</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

// =============================================================================
// Main Component
// =============================================================================

const MobileCarouselRow = memo(function MobileCarouselRow() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  const [activeIndex, setActiveIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  return (
    <div className="lg:hidden" style={{ touchAction: "pan-y pinch-zoom" }}>
      <div ref={emblaRef} className="overflow-hidden -mx-4 px-4">
        <div className="flex gap-6 py-6 -my-2">
          <div className="shrink-0">
            <CompressorCard />
          </div>
          <div className="shrink-0">
            <ExpansionValveCard />
          </div>
          <div className="shrink-0">
            <TextOnlyCards />
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-1.5 mt-2">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "bg-black w-4"
                : "w-1.5 bg-[#BFBFBF] hover:bg-[#999999]"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
});

export const InsideOptimistSection = memo(function InsideOptimistSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      ref={sectionRef}
      className="w-full py-12 md:py-12 lg:py-16 bg-white overflow-hidden"
      aria-label="Inside Optimist - Engineered for Extremes"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={sectionVariants}
          className="flex flex-col items-center gap-[54px]"
        >
          {/* Section Title */}
          <h2 className="font-display font-semibold text-2xl md:text-4xl lg:text-[40px] text-black text-center leading-tight tracking-wide md:tracking-normal">
            <span className="text-[#3478F6]">Inside Optimist</span>
            <br />
            Engineered for Extremes
          </h2>

          {/* Cards Grid */}
          <motion.div
            className="w-full flex flex-col gap-6 lg:gap-8"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* Row 1: Hero AC + Heat Exchanger */}
            <div className="flex flex-col lg:flex-row gap-6">
              <HeroCard />
              <HeatExchangerCard />
            </div>

            {/* Row 2 Mobile: Embla Carousel — doesn't block vertical scroll */}
            <MobileCarouselRow />

            {/* Row 2 Desktop: Standard flex layout */}
            <div className="hidden lg:flex gap-6">
              <CompressorCard />
              <ExpansionValveCard />
              <TextOnlyCards />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});
