"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from "react";
import { m } from "framer-motion";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";
import {
  fetchFeaturedReviews,
  fetchReviewsSummary,
  type JudgeMeReview,
} from "@/lib/judgeme";

const PATTERN = "/business/testimonial-pattern.svg";

// Same continuous auto-scroll speed as the home reviews.
const REVIEW_SCROLL_SPEED = 0.4;

// Offline/unconfigured fallback so the section never renders empty.
const FALLBACK_REVIEWS: JudgeMeReview[] = [
  {
    id: "fallback-1",
    rating: 4.8,
    title: "Walked in after work to a perfectly cool room.",
    body: "",
    author: "Krishnakanth",
    date: "",
    pictures: [],
    videos: [],
  },
  {
    id: "fallback-2",
    rating: 4.8,
    title: "Best decision our family made this summer.",
    body: "",
    author: "Rahul Jain",
    date: "",
    pictures: ["/business/testimonial-family.jpg"],
    videos: [],
  },
  {
    id: "fallback-3",
    rating: 4.8,
    title: "Quiet, fast — and the bills actually dropped.",
    body: "",
    author: "Megha S.",
    date: "",
    pictures: [],
    videos: [],
  },
];

// Review card in the business testimonial skin: mint rating chip + ABC Solar
// name, quote-style title, clamped body. Reviews with a photo get the image
// on top (like the built photo card); text-only reviews stay compact.
function ReviewCard({ review }: { review: JudgeMeReview }) {
  const picture = review.pictures[0];
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#E9E9E9] bg-white p-5 md:p-7">
      {picture ? (
        <div className="mb-4 h-[140px] w-full overflow-hidden rounded-[16px] md:h-[200px]">
          <img
            src={picture}
            alt=""
            loading="lazy"
            className="size-full object-cover"
          />
        </div>
      ) : null}
      <div className="flex min-w-0 items-center gap-2">
        <span className="flex h-6 shrink-0 items-center rounded-[10px] bg-[#AEFFD8] px-2 font-solar text-[14px] font-bold leading-none text-[#212121]">
          {review.rating.toFixed(1)}
        </span>
        <span className="min-w-0 truncate font-solar text-[16px] font-medium leading-none text-[#212121]">
          {review.author}
        </span>
      </div>
      {review.title ? (
        <p className="mt-3 line-clamp-3 text-[17px] leading-[1.25] text-[#212121] md:mt-4 md:text-[22px] md:leading-[1.2]">
          {review.title}
        </p>
      ) : null}
      {review.body ? (
        <p className="mt-2 line-clamp-3 text-[13px] leading-[1.5] whitespace-pre-line text-[#6A6A6A] md:text-[14px]">
          {review.body}
        </p>
      ) : null}
    </div>
  );
}

// Two auto-scrolling columns (home mechanism). Reviews are dealt greedily by
// "units" — an image card counts double — so a viewport shows ~4 text cards,
// 3 when one has a photo, 2 when both columns lead with photos.
function AutoScrollReviews({ reviews }: { reviews: JudgeMeReview[] }) {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const leftOff = useRef(0);
  const rightOff = useRef(0);
  const pausedRef = useRef(false);

  const { left, right } = useMemo(() => {
    const l: JudgeMeReview[] = [];
    const r: JudgeMeReview[] = [];
    let lu = 0;
    let ru = 0;
    for (const rev of reviews) {
      const units = rev.pictures.length > 0 ? 2 : 1;
      if (lu <= ru) {
        l.push(rev);
        lu += units;
      } else {
        r.push(rev);
        ru += units;
      }
    }
    return { left: l, right: r };
  }, [reviews]);

  useEffect(() => {
    const advance = (
      el: HTMLDivElement | null,
      off: React.MutableRefObject<number>,
    ) => {
      if (!el) return;
      const max = el.scrollHeight / 2;
      if (max <= 0) return;
      off.current = (off.current + REVIEW_SCROLL_SPEED) % max;
      el.style.transform = `translateY(${-off.current}px)`;
    };
    const step = () => {
      if (!pausedRef.current) {
        advance(leftRef.current, leftOff);
        advance(rightRef.current, rightOff);
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reviews.length]);

  if (!reviews.length) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-white to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-white to-transparent" />
      <div className="grid max-h-[440px] grid-cols-2 items-start gap-3 overflow-hidden md:gap-5 lg:max-h-[417px] lg:gap-10">
        <div
          ref={leftRef}
          className="flex flex-col gap-3 md:gap-5 lg:gap-10"
          style={{ willChange: "transform" }}
        >
          {[...left, ...left].map((rev, i) => (
            <ReviewCard key={`l-${rev.id}-${i}`} review={rev} />
          ))}
        </div>
        <div
          ref={rightRef}
          className="flex flex-col gap-3 md:gap-5 lg:gap-10"
          style={{ willChange: "transform" }}
        >
          {[...right, ...right].map((rev, i) => (
            <ReviewCard key={`r-${rev.id}-${i}`} review={rev} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<JudgeMeReview[]>(FALLBACK_REVIEWS);

  // Same source as the home page's review wall (Judge.me), with the static
  // trio as a safety net when the API is unreachable.
  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchReviewsSummary(), fetchFeaturedReviews()])
      .then(([summary, featured]) => {
        if (cancelled) return;
        // Positive reviews only on the sales page (the raw feed can contain
        // service complaints).
        const fetched = (
          summary.reviews.length > 0 ? summary.reviews : featured
        ).filter((r) => r.rating >= 4);
        if (fetched.length > 0) setReviews(fetched);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto w-full max-w-[1160px] px-5 sm:px-6 md:px-10 py-14 md:py-[100px]">
      {/* Header — title left, intro right (Figma: intro top-aligned with title) */}
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerParent(0.1)}
        className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-10"
      >
        <div>
          <m.p
            variants={fadeUp}
            className="text-lg font-medium leading-[1.6] text-[#3478F6] md:text-[20px]"
          >
            Real People. Real Summers.
          </m.p>
          <m.h2
            variants={fadeUp}
            className="mt-3 max-w-[521px] font-solar text-[30px] font-medium leading-[1.2] text-[#212121] sm:text-[38px] md:mt-5 md:text-[48px]"
          >
            We could tell you how good it is. But they&apos;ll do it better.
          </m.h2>
        </div>
        <m.p
          variants={fadeUp}
          className="max-w-[427px] text-sm leading-[1.6] text-[#6A6A6A] md:shrink-0 md:basis-[427px] md:pt-[52px] md:text-[16px]"
        >
          From bankers in Gurgaon to engineers in Hyderabad &mdash; here&apos;s
          what a summer with Optimist actually feels like.
        </m.p>
      </m.div>

      {/* Reviews (auto-scrolling, real Judge.me data) + dark stat card */}
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerParent(0.08)}
        className="mt-10 grid grid-cols-1 gap-5 md:mt-20 md:grid-cols-2 md:gap-10 lg:grid-cols-3"
      >
        <m.div variants={fadeUp} className="md:col-span-2">
          <AutoScrollReviews reviews={reviews} />
        </m.div>

        {/* Dark stat card with the palm-mark pattern */}
        <m.div
          variants={fadeUp}
          className="relative overflow-hidden rounded-[24px] bg-[#0E0E0E] p-10 text-white md:col-span-2 lg:col-span-1 lg:min-h-[417px]"
        >
          <img
            src={PATTERN}
            alt=""
            aria-hidden
            className="pointer-events-none absolute top-[-60%] left-[calc(50%+9px)] h-[1317px] w-[942px] max-w-none -translate-x-1/2 select-none"
          />
          <div className="relative">
            <p className="text-[16px] leading-[1.4]">Already supporting</p>
            <p className="mt-2 font-solar text-[56px] font-medium leading-none text-[#AEFFD8] md:text-[67px]">
              45+
            </p>
            <p className="mt-6 font-solar text-[21px] font-medium leading-[1.2]">
              Commercial project
            </p>
            <p className="mt-4 max-w-[253px] text-[18px] leading-[1.4] md:text-[21px]">
              Across offices, hotels, education and healthcare - louder than
              dry patch.
            </p>
          </div>
        </m.div>
      </m.div>
    </section>
  );
}
