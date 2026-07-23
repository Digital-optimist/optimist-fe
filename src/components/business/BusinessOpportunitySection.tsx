"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { m } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";

const BG_TEXTURE = "/business/opportunity-bg.png";

// Same cards as the home page's "under the hood" carousel (InsideTechSection):
// full-bleed photo, bottom-anchored title, description hidden until hover.
// The set is doubled, exactly like home, so the rail scrolls further.
interface TechCardData {
  title: string;
  body: string;
  img: string;
}

const baseCards: TechCardData[] = [
  {
    title: "Cools 4x faster than anything else in its class.",
    body: "Our micro-channel heat exchanger transfers heat at 4x the speed of a conventional AC. That's not a small tweak — that's why your room feels different within minutes of switching it on.",
    img: "/figma/underhood-heat-exchanger.png",
  },
  {
    title: "1,180 flow paths. Every single one working for you.",
    body: "Each path is precision-engineered to move refrigerant exactly where it's needed — so cooling is even, fast and efficient across the whole room.",
    img: "/figma/underhood-flow-paths.png",
  },
  {
    title: "Tested 15x harder than the industry standard. On purpose.",
    body: "We put every unit through 15x the standard stress cycles, so it keeps performing through years of brutal Indian summers.",
    img: "/figma/underhood-tested.png",
  },
];
const cards = [...baseCards, ...baseCards];

// Card — ported 1:1 from the home TechCard: black card, photo zooms on hover,
// description reveals via grid-rows 0fr → 1fr.
function TechCard({ card }: { card: TechCardData }) {
  return (
    <m.article
      variants={fadeUp}
      className="group relative flex h-[360px] w-[280px] shrink-0 flex-col justify-end overflow-hidden rounded-[16px] bg-black text-white sm:h-[400px] sm:w-[340px] sm:rounded-[20px] md:h-[440px] md:w-[427px] md:rounded-[24px]"
    >
      <img
        src={card.img}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-[600ms] ease-out group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(218deg,rgba(97,97,97,0)_26%,rgba(0,0,0,0.9)_80%)]" />
      <div className="relative flex flex-col p-6 sm:p-10 md:p-15">
        <p className="font-solar text-[20px] font-medium leading-[120%] sm:text-[28px] md:text-[32px]">
          {card.title}
        </p>
        <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-out group-hover:mt-3 group-hover:grid-rows-[1fr] group-hover:opacity-100 sm:group-hover:mt-4">
          <p className="overflow-hidden text-sm leading-[160%] font-light text-[#BABABA] sm:text-base">
            {card.body}
          </p>
        </div>
      </div>
    </m.article>
  );
}

export function BusinessOpportunitySection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [progress, setProgress] = useState({ width: 30, left: 0 });

  // Continuous scroll-progress thumb, same mechanism as the home carousel.
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

  // Round arrow button — Figma: 36px circle; gray/disabled vs dark/active.
  const arrowClass = (enabled: boolean) =>
    cn(
      "flex size-9 items-center justify-center rounded-full border transition-colors",
      enabled
        ? "border-[#4D4D4D] text-[#212121] hover:bg-black/[0.04]"
        : "border-[#E9E9E9] text-[#BABABA]",
    );

  return (
    <section className="relative overflow-hidden bg-white py-14 md:py-[100px]">
      {/* Crumpled-texture swoosh (Figma masked composite, full section width). */}
      <img
        src={BG_TEXTURE}
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 w-full min-w-[1200px] max-w-none -translate-x-1/2 -translate-y-1/2 select-none"
      />

      {/* Header */}
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        className="relative mx-auto flex w-full max-w-[1160px] items-end justify-between gap-6 px-5 sm:px-6 md:px-10"
      >
        <div>
          <p className="text-base font-medium leading-[1.6] text-[#3478F6] sm:text-lg md:text-[20px]">
            Built for the next generation of efficient buildings
          </p>
          <h2 className="mt-2.5 max-w-[551px] font-solar text-[28px] font-medium leading-[1.2] text-[#212121] sm:text-[36px] md:text-[48px]">
            Efficiency is becoming a business opportunity
          </h2>
        </div>

        {/* Arrows */}
        <div className="hidden shrink-0 gap-2 md:flex">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            className={arrowClass(canPrev)}
          >
            <ChevronLeft className="size-4" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            className={arrowClass(canNext)}
          >
            <ChevronRight className="size-4" strokeWidth={2.25} />
          </button>
        </div>
      </m.div>

      {/* Carousel — leading padding lines the first card up with the 1080px
          content column; the rail bleeds off the right edge. */}
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerParent(0.1)}
        className="mt-8 overflow-hidden md:mt-[60px]"
        ref={emblaRef}
      >
        <div className="flex gap-5 pr-5 pl-5 sm:pr-6 sm:pl-6 md:gap-10 md:pr-[max(2.5rem,calc((100vw-1080px)/2))] md:pl-[max(2.5rem,calc((100vw-1080px)/2))]">
          {cards.map((card, i) => (
            <TechCard key={i} card={card} />
          ))}
        </div>
      </m.div>

      {/* Progress bar — Figma track colours, home's continuous-thumb mechanics */}
      <div className="relative mx-auto mt-10 w-full max-w-[1160px] px-5 sm:px-6 md:mt-[60px] md:px-10">
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-[#E9E9E9]">
          <div
            className="absolute inset-y-0 rounded-full bg-[#4D4D4D] transition-[left] duration-150 ease-out"
            style={{ width: `${progress.width}%`, left: `${progress.left}%` }}
          />
        </div>
      </div>
    </section>
  );
}
