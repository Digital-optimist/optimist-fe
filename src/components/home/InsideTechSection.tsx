"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";
import type { HomeInsideTechContent, HomeFeatureCard } from "@/lib/shopify";

// White heat-exchanger texture that sits faintly behind the section.
const BG_TEXTURE = "/newHomepage/image%201181%20(1).webp";

function TechCard({ card }: { card: HomeFeatureCard }) {
  return (
    <m.article
      variants={fadeUp}
      className="group relative h-[392px] w-[300px] flex-shrink-0 overflow-hidden rounded-[20px] bg-neutral-900 sm:w-[368px]"
    >
      {card.iconUrl ? (
        <Image
          src={card.iconUrl}
          alt={card.iconAlt ?? card.title}
          fill
          sizes="368px"
          className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-105"
        />
      ) : null}

      {/* Base gradient for legibility; darkens further on hover. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-colors duration-300 group-hover:from-black/90 group-hover:via-black/75 group-hover:to-black/55" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col p-7">
        <h3 className="font-display text-[24px] font-semibold leading-[1.2] text-white">
          {card.title}
        </h3>
        {/* grid-rows 0fr -> 1fr animates the description height open on hover. */}
        <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-out group-hover:mt-3 group-hover:grid-rows-[1fr] group-hover:opacity-100">
          <p className="overflow-hidden text-[15px] leading-[1.5] text-white/75">
            {card.subtitle}
          </p>
        </div>
      </div>
    </m.article>
  );
}

interface InsideTechSectionProps {
  content: HomeInsideTechContent | null;
}

export function InsideTechSection({ content }: InsideTechSectionProps) {
  const subtitle = content?.subtitle ?? "What’s under the hood?";
  const title =
    content?.title ?? "Good engineering is invisible. Until you feel it.";
  const cards = content?.cards ?? [];

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
    // Defer the first sync a frame so it reads settled layout (and to avoid a
    // synchronous setState in the effect body).
    const raf = requestAnimationFrame(onUpdate);
    return () => {
      cancelAnimationFrame(raf);
      emblaApi.off("scroll", onUpdate);
      emblaApi.off("reInit", onUpdate);
    };
  }, [emblaApi, onUpdate]);

  if (!cards.length) return null;

  return (
    <section className="relative overflow-hidden bg-white py-[88px]">
      {/* Faint heat-exchanger texture behind the cards */}
      <Image
        src={BG_TEXTURE}
        alt=""
        aria-hidden="true"
        width={1200}
        height={760}
        className="pointer-events-none absolute right-0 top-1/2 z-0 h-auto w-[70%] max-w-[900px] -translate-y-1/2 select-none opacity-60 blur-[3px]"
      />

      {/* Heading + carousel controls */}
      <div className="relative z-10 mx-auto max-w-[1100px] px-6">
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent(0.1)}
          className="flex items-end justify-between gap-6"
        >
          <div>
            <m.p
              variants={fadeUp}
              className="text-[20px] leading-[30px] font-medium text-optimist-blue-hero"
            >
              {subtitle}
            </m.p>
            <m.h2
              variants={fadeUp}
              className="mt-3 max-w-[560px] font-display text-[48px] leading-[56px] font-medium text-[#212121]"
            >
              {title}
            </m.h2>
          </div>

          <m.div variants={fadeUp} className="hidden flex-shrink-0 gap-3 sm:flex">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canPrev}
              aria-label="Previous"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 text-optimist-black transition-colors hover:bg-black/5 disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canNext}
              aria-label="Next"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 text-optimist-black transition-colors hover:bg-black/5 disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </m.div>
        </m.div>
      </div>

      {/* Carousel: aligned to content on the left, bleeds off the right edge */}
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerParent(0.12)}
        className="relative z-10 mt-10 overflow-hidden"
        ref={emblaRef}
      >
        <div className="flex gap-5 pl-[max(1.5rem,calc((100vw-1100px)/2+1.5rem))] pr-6">
          {cards.map((card, i) => (
            <TechCard key={i} card={card} />
          ))}
        </div>
      </m.div>

      {/* Scroll-progress track */}
      <div className="relative z-10 mx-auto mt-8 max-w-[1100px] px-6">
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
