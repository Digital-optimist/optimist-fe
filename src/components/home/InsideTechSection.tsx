"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from "react";
import { m } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/home/ui/button";
import { SectionTitle } from "@/components/home/ui/section-title";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";
import type { HomeInsideTechContent } from "@/lib/shopify";

const underHoodBg = "/figma/under-hood-bg.svg";
const underhoodHeatExchanger = "/figma/underhood-heat-exchanger.png";
const underhoodFlowPaths = "/figma/underhood-flow-paths.png";
const underhoodTested = "/figma/underhood-tested.png";

interface TechCardData {
  title: string;
  body?: string;
  img: string;
}

const underHoodCards: TechCardData[] = [
  {
    title: "Cools 4x faster than anything else in its class.",
    body: "Our micro-channel heat exchanger transfers heat at 4x the speed of a conventional AC. That's not a small tweak — that's why your room feels different within minutes of switching it on.",
    img: underhoodHeatExchanger,
  },
  {
    title: "1,180 flow paths. Every single one working for you.",
    body: "Each path is precision-engineered to move refrigerant exactly where it's needed — so cooling is even, fast and efficient across the whole room.",
    img: underhoodFlowPaths,
  },
  {
    title: "Tested 15x harder than the industry standard. On purpose.",
    body: "We put every unit through 15x the standard stress cycles, so it keeps performing through years of brutal Indian summers.",
    img: underhoodTested,
  },
  {
    title: "Cools 4x faster than anything else in its class.",
    body: "Our micro-channel heat exchanger transfers heat at 4x the speed of a conventional AC. That's not a small tweak — that's why your room feels different within minutes of switching it on.",
    img: underhoodHeatExchanger,
  },
  {
    title: "1,180 flow paths. Every single one working for you.",
    body: "Each path is precision-engineered to move refrigerant exactly where it's needed — so cooling is even, fast and efficient across the whole room.",
    img: underhoodFlowPaths,
  },
  {
    title: "Tested 15x harder than the industry standard. On purpose.",
    body: "We put every unit through 15x the standard stress cycles, so it keeps performing through years of brutal Indian summers.",
    img: underhoodTested,
  },
];

// Card keeps the optimist-website visual (black card, full-bleed photo, ABC Solar
// title) but uses the previous mechanism: the description stays hidden and
// reveals on hover (grid-rows 0fr → 1fr).
function TechCard({ card }: { card: TechCardData }) {
  return (
    <m.article
      variants={fadeUp}
      className="group relative h-[360px] sm:h-[400px] md:h-[440px] w-[280px] sm:w-[340px] md:w-[427px] shrink-0 flex flex-col justify-end overflow-hidden rounded-[16px] sm:rounded-[20px] md:rounded-[24px] bg-black text-white"
    >
      <img
        src={card.img}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-[600ms] ease-out group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(218deg,rgba(97,97,97,0)_26%,rgba(0,0,0,0.9)_80%)]" />
      <div className="relative p-6 sm:p-10 md:p-15 flex flex-col">
        <p className="text-[20px] sm:text-[28px] md:text-[32px] leading-[120%] font-solar font-medium">
          {card.title}
        </p>
        {card.body ? (
          <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-out group-hover:mt-3 sm:group-hover:mt-4 group-hover:grid-rows-[1fr] group-hover:opacity-100">
            <p className="overflow-hidden text-sm sm:text-base leading-[160%] font-light text-[#BABABA]">
              {card.body}
            </p>
          </div>
        ) : null}
      </div>
    </m.article>
  );
}

interface InsideTechSectionProps {
  content: HomeInsideTechContent | null;
}

// Ported back to the previous mechanism: embla drag carousel + a bottom
// scroll-progress track + hover-to-reveal descriptions.
export function InsideTechSection({ content }: InsideTechSectionProps) {
  const cards: TechCardData[] = content?.cards?.length
    ? content.cards.map((c) => ({
        title: c.title,
        body: c.subtitle,
        img: c.iconUrl ?? "",
      }))
    : underHoodCards;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [progress, setProgress] = useState({ width: 30, left: 0 });

  const onUpdate = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());

    const viewport = emblaApi.rootNode();
    const container = emblaApi.containerNode();
    const visibleRatio = Math.min(
      1,
      viewport.clientWidth / container.scrollWidth,
    );
    const width = visibleRatio * 100;
    const left = emblaApi.scrollProgress() * (100 - width);
    setProgress({ width, left: Math.max(0, Math.min(100 - width, left)) });
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("scroll", onUpdate);
    emblaApi.on("reInit", onUpdate);
    const raf = requestAnimationFrame(onUpdate);
    return () => {
      cancelAnimationFrame(raf);
      emblaApi.off("scroll", onUpdate);
      emblaApi.off("reInit", onUpdate);
    };
  }, [emblaApi, onUpdate]);

  return (
    <section className="relative w-full pt-20 md:pt-50">
      <div className="relative mx-auto max-w-[1440px] px-5">
        <img src={underHoodBg} alt="" className="absolute hidden md:block" />
        <div className="mx-auto max-w-[1080px] flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <SectionTitle
            className="text-start [&>h2]:mt-2.5"
            eyebrow={content?.subtitle ?? "What's under the hood?"}
            title={
              content?.title ??
              `Good engineering is invisible.\nUntil you feel it.`
            }
          />

          <div className="hidden relative mb-1 md:flex gap-2">
            <Button
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canPrev}
              aria-label="Previous slide"
              className="size-8 sm:size-9 flex items-center justify-center text-[#212121] disabled:text-[#BABABA] rounded-full border border-[#4D4D4D] disabled:border-[#BABABA] bg-white hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ChevronLeft className="size-5 sm:size-6" />
            </Button>
            <Button
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canNext}
              aria-label="Next slide"
              className="size-8 sm:size-9 flex items-center justify-center text-[#212121] disabled:text-[#BABABA] rounded-full border border-[#4D4D4D] disabled:border-[#BABABA] bg-white hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ChevronRight className="size-5 sm:size-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Carousel: aligned to the 1080 content on the left, bleeds off the right */}
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerParent(0.1)}
        className="relative z-10 mt-8 md:mt-15 overflow-hidden"
        ref={emblaRef}
      >
        <div className="flex gap-5 sm:gap-6 md:gap-10 pl-[max(1.25rem,calc((100vw-1080px)/2+1.25rem))] pr-5">
          {cards.map((card, i) => (
            <TechCard key={i} card={card} />
          ))}
        </div>
      </m.div>

      {/* Scroll-progress track (as before) */}
      <div className="relative z-10 mx-auto mt-8 max-w-[1080px] px-5">
        <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-black/10">
          <div
            className="absolute inset-y-0 rounded-full bg-black/70 transition-[left] duration-150 ease-out"
            style={{ width: `${progress.width}%`, left: `${progress.left}%` }}
          />
        </div>
      </div>
    </section>
  );
}
