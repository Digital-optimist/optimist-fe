"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { Button } from "@/components/home/ui/button";
import Card from "@/components/home/ui/card";
import { SectionTitle } from "@/components/home/ui/section-title";
import { useApp } from "@/components/home/useApp";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";
import { cn } from "@/lib/cn";
import { calculateReadTime, type BlogArticle } from "@/lib/shopify";

interface LabCard {
  label: string;
  labelBg: string;
  imgUrl: string;
  imgAlt: string;
  text: string;
  author: string;
  role: string;
  time: string;
  href?: string;
}

// Reference label background cycle (Health & Wellness / Energy & Savings /
// Behind the Product).
const LABEL_BG = ["#AEFFD8", "#FFFCDC", "#E2EAFA"];
const FALLBACK_IMG = [
  "/figma/article-1.svg",
  "/figma/article-2.svg",
  "/figma/article-3.svg",
];

// Static reference cards used when no Shopify blog articles are available.
const FALLBACK_CARDS: LabCard[] = [
  {
    label: "Health & Wellness",
    labelBg: "#AEFFD8",
    imgUrl: "/figma/article-1.svg",
    imgAlt: "",
    text: `What heat actually does to\nyour body — and why your\nAC matters more than you\nthink.`,
    author: "Dr. Rohit Mehta",
    role: "Researcher",
    time: "5 min read",
  },
  {
    label: "Energy & Savings",
    labelBg: "#FFFCDC",
    imgUrl: "/figma/article-2.svg",
    imgAlt: "",
    text: `The real cost of running\nyour AC all summer — and\nhow to bring it down\nsignificantly`,
    author: "Dr. Rohit Mehta",
    role: "Researcher",
    time: "5 min read",
  },
  {
    label: "Behind the Product",
    labelBg: "#E2EAFA",
    imgUrl: "/figma/article-3.svg",
    imgAlt: "",
    text: `Why we built the world's\nfirst gas level indicator —\nand why no one had done\nit before.`,
    author: "Dr. Rohit Mehta",
    role: "Researcher",
    time: "5 min read",
  },
  {
    label: "Health & Wellness",
    labelBg: "#AEFFD8",
    imgUrl: "/figma/article-1.svg",
    imgAlt: "",
    text: `What heat actually does to\nyour body — and why your\nAC matters more than you\nthink.`,
    author: "Dr. Rohit Mehta",
    role: "Researcher",
    time: "5 min read",
  },
  {
    label: "Energy & Savings",
    labelBg: "#FFFCDC",
    imgUrl: "/figma/article-2.svg",
    imgAlt: "",
    text: `The real cost of running\nyour AC all summer — and\nhow to bring it down\nsignificantly`,
    author: "Dr. Rohit Mehta",
    role: "Researcher",
    time: "5 min read",
  },
];

interface OptimistLabSectionProps {
  articles: BlogArticle[];
}

// optimist-website "Articles" carousel. Cards come from the Shopify blog
// (getArticles), falling back to the reference's static cards when empty.
export function OptimistLabSection({ articles }: OptimistLabSectionProps) {
  const { isLargeDesktop, isMobile } = useApp();
  const [activeArticleSlide, setActiveArticleSlide] = useState(0);

  const cards: LabCard[] = articles.length
    ? articles.slice(0, 9).map((a, i) => ({
        label: a.tags?.[0] ?? "From the Optimist Lab",
        labelBg: LABEL_BG[i % LABEL_BG.length],
        imgUrl: a.image?.url ?? FALLBACK_IMG[i % FALLBACK_IMG.length],
        imgAlt: a.image?.altText ?? a.title,
        text: a.title,
        author: a.author?.name ?? "Optimist Team",
        role: "Researcher",
        time: `${calculateReadTime(a.content)} min read`,
        href: `/blogs/${a.blog?.handle || "news"}/${a.handle}`,
      }))
    : FALLBACK_CARDS;

  const handlePrevArticleSlide = () => {
    setActiveArticleSlide(
      (prev) =>
        prev -
        (activeArticleSlide > 1 ? 3 : activeArticleSlide % 3 === 0 ? 3 : 1),
    );
  };

  const handleNextArticleSlide = () => {
    setActiveArticleSlide(
      (prev) =>
        prev +
        (activeArticleSlide === cards.length - (isLargeDesktop ? 5 : 4)
          ? 1
          : 3),
    );
  };

  return (
    <section className="mx-auto w-full max-w-[1440px] py-20 md:py-32 lg:py-50 2xl:pb-72">
      <div className="px-5 mx-auto max-w-[1080px]">
        <SectionTitle
          eyebrow="Research, reviews and real conversations"
          title={`What makes us so cool?\nRead and analyse yourself.`}
          description="Thoughts, research and real talk from the people building India's most intelligent AC."
        />
      </div>

      <div
        className={cn(
          "mt-6 md:mt-10 h-auto md:h-[436px] w-full max-w-[1080px] mx-auto",
          isMobile && "px-5 overflow-x-auto hide-scrollbar",
        )}
      >
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent(0.08)}
          className="h-full pt-2.5 flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${activeArticleSlide * (333 + 40)}px)`,
          }}
        >
          {cards.map((card, idx) => {
            const inner = (
              <Card className="relative h-auto md:h-full w-[260px] md:w-[333px] p-2.5 px-[9px] shrink-0 flex flex-col gap-5 md:gap-[30px] overflow-visible">
                <span
                  className="h-6 sm:h-7 px-2 sm:px-3 py-[3px] absolute -top-2 sm:-top-2.5 left-1/2 -translate-x-1/2 rounded-[50px] text-xs sm:text-sm leading-[160%] text-nowrap"
                  style={{ backgroundColor: card.labelBg }}
                >
                  {card.label}
                </span>
                <div className="flex flex-col gap-4 sm:gap-5">
                  <img
                    src={card.imgUrl}
                    alt={card.imgAlt}
                    className="h-[160px] sm:h-[180px] md:h-[200px] w-full object-cover rounded-lg"
                  />
                  <p className="text-sm md:text-xl leading-[120%] font-light md:whitespace-pre-line">
                    {card.text}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm sm:text-base leading-none font-medium">
                    {card.author}
                  </p>
                  <p className="text-xs sm:text-sm leading-[140%] font-light text-[#6A6A6A]">
                    {card.role} · {card.time}
                  </p>
                </div>
              </Card>
            );

            return (
              <m.div key={idx} variants={fadeUp} className="pr-5 sm:pr-6 md:pr-10">
                {card.href ? (
                  <Link href={card.href} className="block h-full">
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </m.div>
            );
          })}
        </m.div>
      </div>

      <div className="mt-6 md:mt-8 px-5 mx-auto max-w-[1080px]">
        <div className="flex items-center justify-center md:justify-between">
          <span className="hidden md:block" />

          <Link
            href="/blogs"
            className="sm:ml-20 flex items-center gap-2 hover:[&>svg]:stroke-[#6A6A6A] cursor-pointer"
          >
            <p className="text-base sm:text-lg md:text-xl leading-[160%] font-medium">
              Read all articles
            </p>
            <ChevronsRight className="size-5 sm:size-6 stroke-[#BABABA]" />
          </Link>

          <div className="hidden md:flex gap-2">
            <Button
              onClick={handlePrevArticleSlide}
              className="size-8 sm:size-9 flex items-center justify-center text-[#212121] disabled:text-[#BABABA] rounded-full border border-[#4D4D4D] disabled:border-[#BABABA] bg-white hover:bg-gray-50 transition-colors cursor-pointer"
              aria-label="Previous slide"
              disabled={activeArticleSlide === 0}
            >
              <ChevronLeft className="size-5 sm:size-6" />
            </Button>
            <Button
              onClick={handleNextArticleSlide}
              className="size-8 sm:size-9 flex items-center justify-center text-[#212121] disabled:text-[#BABABA] rounded-full border border-[#4D4D4D] disabled:border-[#BABABA] bg-white hover:bg-gray-50 transition-colors cursor-pointer"
              aria-label="Next slide"
              disabled={
                activeArticleSlide >= cards.length - (isLargeDesktop ? 4 : 3)
              }
            >
              <ChevronRight className="size-5 sm:size-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
