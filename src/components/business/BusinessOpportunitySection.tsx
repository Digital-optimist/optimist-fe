"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { m } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { fadeUp, viewportOnce } from "@/lib/motion-variants";

const BG_TEXTURE = "/business/opportunity-bg.png";

// Figma node 1:293 — "Efficiency is becoming a business opportunity".
// Card 1 is a dark info card (photo under a blurred black/80 overlay, title +
// body at the top); cards 2 and 3 are photo cards with a bottom-dark gradient
// and a title anchored near the bottom (each at its own Figma offset).
const cards = [
  {
    image: "/business/opportunity-card-1.jpg",
    title: "Lower operating costs, building-wide",
    body: "Our micro-channel heat exchanger transfers heat at 4x the speed of a conventional AC. That's not a small tweak — that's why your room feels different within minutes of switching it on.",
  },
  {
    image: "/business/opportunity-card-2.jpg",
    title: "High performance even during peak summer.",
    titleBottom: "bottom-[22%]",
  },
  {
    image: "/business/opportunity-card-3.jpg",
    title: "Supports your growth building goals",
    titleBottom: "bottom-[32%]",
  },
] as const;

export function BusinessOpportunitySection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [selected, setSelected] = useState(0);
  const [snapCount, setSnapCount] = useState<number>(cards.length);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
    setSelected(emblaApi.selectedScrollSnap());
    setSnapCount(emblaApi.scrollSnapList().length);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaApi, onSelect]);

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
      {/* Crumpled-texture swoosh (Figma masked composite, full section width).
          Kept near native scale so it doesn't squash on small screens. */}
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

      {/* Carousel — full-bleed viewport; the leading padding lines the first
          card up with the 1080px content column (Figma: cards start at x180
          and bleed off the right edge of the screen). */}
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        className="mt-8 overflow-hidden md:mt-[60px]"
        ref={emblaRef}
      >
        <div className="flex gap-5 pr-5 pl-5 sm:pr-6 sm:pl-6 md:gap-10 md:pr-[max(2.5rem,calc((100vw-1080px)/2))] md:pl-[max(2.5rem,calc((100vw-1080px)/2))]">
          {cards.map((card) => (
            <div
              key={card.title}
              className="relative h-[360px] w-[300px] shrink-0 grow-0 overflow-hidden rounded-[24px] shadow-[0_6px_10px_rgba(0,0,0,0.45)] sm:h-[400px] sm:w-[360px] md:h-[440px] md:w-[427px]"
            >
              <img
                src={card.image}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
              {"body" in card ? (
                <>
                  {/* Dark info card — blurred black overlay, text at top */}
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-[8px]" />
                  <div className="absolute inset-0 p-10 md:p-[60px]">
                    <h3 className="max-w-[307px] font-solar text-[24px] font-medium leading-[1.2] text-white md:text-[32px]">
                      {card.title}
                    </h3>
                    <p className="mt-[15px] max-w-[307px] text-sm leading-[1.6] text-[#BABABA] md:text-[16px]">
                      {card.body}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Photo card — bottom-dark gradient, bottom-anchored title */}
                  <div className="absolute inset-0 bg-[linear-gradient(206deg,rgba(97,97,97,0)_24.9%,rgba(0,0,0,0.9)_74.8%)]" />
                  <h3
                    className={cn(
                      "absolute left-10 max-w-[280px] font-solar text-[24px] font-medium leading-[1.2] text-white md:left-[60px] md:max-w-[307px] md:text-[32px]",
                      card.titleBottom,
                    )}
                  >
                    {card.title}
                  </h3>
                </>
              )}
            </div>
          ))}
        </div>
      </m.div>

      {/* Progress bar — Figma: 4px track #E9E9E9, fill #4D4D4D */}
      <div className="relative mx-auto mt-10 w-full max-w-[1160px] px-5 sm:px-6 md:mt-[60px] md:px-10">
        <div className="h-1 w-full overflow-hidden rounded-full bg-[#E9E9E9]">
          <div
            className="h-full rounded-full bg-[#4D4D4D] transition-[width] duration-300 ease-out"
            style={{ width: `${((selected + 1) / Math.max(snapCount, 1)) * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}
