"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";
import { calculateReadTime, type BlogArticle } from "@/lib/shopify";

// Category-pill colour map. Known categories from the design get their exact
// palette; anything else cycles through the same three swatches by index so a
// new Shopify tag still renders a pleasant chip.
const TAG_STYLES: Record<string, string> = {
  "Health & Wellness": "bg-[#C9F2D8] text-[#0A7B3E]",
  "Energy & Savings": "bg-[#FBF0C2] text-[#8A6D12]",
  "Behind the Product": "bg-[#E3E0F7] text-[#5B53B0]",
};
const FALLBACK_TAG_STYLES = [
  "bg-[#C9F2D8] text-[#0A7B3E]",
  "bg-[#FBF0C2] text-[#8A6D12]",
  "bg-[#E3E0F7] text-[#5B53B0]",
];

function LabCard({ article, index }: { article: BlogArticle; index: number }) {
  const readTime = calculateReadTime(article.content);
  const tag = article.tags?.[0] ?? null;
  const tagStyle = tag
    ? (TAG_STYLES[tag] ??
      FALLBACK_TAG_STYLES[index % FALLBACK_TAG_STYLES.length])
    : "";

  return (
    <Link
      href={`/blogs/${article.blog?.handle || "news"}/${article.handle}`}
      className="group flex h-full flex-col rounded-[24px] border border-black/[0.08] bg-white p-4 transition-shadow duration-300 hover:shadow-[0_24px_50px_-30px_rgba(15,23,42,0.35)]"
    >
      {/* Image with the category pill straddling its top edge */}
      <div className="relative">
        {tag ? (
          <span
            className={`absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] font-semibold shadow-[0_6px_16px_-8px_rgba(15,23,42,0.4)] ${tagStyle}`}
          >
            {tag}
          </span>
        ) : null}
        <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-gray-100">
          {article.image ? (
            <Image
              src={article.image.url}
              alt={article.image.altText || article.title}
              fill
              sizes="(min-width:1024px) 340px, (min-width:640px) 50vw, 90vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : null}
        </div>
      </div>

      {/* Title */}
      <h3 className="mt-6 line-clamp-4 font-display text-[22px] font-semibold leading-[1.32] text-optimist-black transition-colors duration-300 group-hover:text-optimist-blue-hero">
        {article.title}
      </h3>

      {/* Author + meta pinned to the bottom */}
      <div className="mt-auto pt-8">
        <p className="font-display text-[16px] font-semibold text-optimist-black">
          {article.author?.name || "Optimist Team"}
        </p>
        <p className="mt-1 text-[14px] text-black/50">
          Researcher · {readTime} min read
        </p>
      </div>
    </Link>
  );
}

interface OptimistLabSectionProps {
  articles: BlogArticle[];
}

export function OptimistLabSection({ articles }: OptimistLabSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onUpdate = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onUpdate);
    emblaApi.on("reInit", onUpdate);
    const raf = requestAnimationFrame(onUpdate);
    return () => {
      cancelAnimationFrame(raf);
      emblaApi.off("select", onUpdate);
      emblaApi.off("reInit", onUpdate);
    };
  }, [emblaApi, onUpdate]);

  if (!articles.length) return null;

  return (
    <section className="relative overflow-hidden bg-white py-[88px]">
      <div className="mx-auto max-w-[1100px] px-6">
        {/* Header */}
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent(0.1)}
          className="mx-auto max-w-[820px] text-center"
        >
          <m.p
            variants={fadeUp}
            className="text-[20px] leading-[30px] font-medium text-optimist-blue-hero"
          >
            From the Optimist Lab
          </m.p>
          <m.h2
            variants={fadeUp}
            className="mt-4 font-display text-[48px] leading-[56px] font-medium text-[#212121]"
          >
            Heat isn&apos;t just uncomfortable.
            <br />
            It&apos;s worth understanding.
          </m.h2>
          <m.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-[640px] text-[18px] leading-[1.5] text-black/55"
          >
            Thoughts, research and real talk from the people building
            India&apos;s most intelligent AC.
          </m.p>
        </m.div>

        {/* Carousel */}
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent(0.12)}
          className="mt-12 overflow-hidden"
          ref={emblaRef}
        >
          <div className="flex gap-6">
            {articles.map((article, i) => (
              <m.div
                key={article.id}
                variants={fadeUp}
                className="min-w-0 flex-[0_0_88%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]"
              >
                <LabCard article={article} index={i} />
              </m.div>
            ))}
          </div>
        </m.div>

        {/* Footer row: centred "Read all articles" + carousel controls */}
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="relative mt-12 flex items-center justify-center"
        >
          <Link
            href="/blogs"
            className="group flex items-center gap-1.5 font-display text-[18px] font-[400] text-[#212121] transition-opacity hover:opacity-70"
          >
            Read all articles
            <ChevronsRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <div className="absolute right-0 hidden gap-3 sm:flex">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canPrev}
              aria-label="Previous articles"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 text-optimist-black transition-colors hover:bg-black/5 disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canNext}
              aria-label="Next articles"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 text-optimist-black transition-colors hover:bg-black/5 disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </m.div>
      </div>
    </section>
  );
}
