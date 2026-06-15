"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Play, Star, X } from "lucide-react";
import { SectionTitle } from "@/components/home/ui/section-title";
import { fadeUp, viewportOnce } from "@/lib/motion-variants";
import {
  fetchFeaturedReviews,
  fetchReviewsSummary,
  type JudgeMeReview,
} from "@/lib/judgeme";
import type { HomeReviewsContent, HomeReviewVideo } from "@/lib/shopify";

const optimistTreeVector = "/figma/optimist-tree-vector.svg";

// Continuous auto-scroll speeds (px per animation frame).
const VIDEO_SCROLL_SPEED = 0.5;
const REVIEW_SCROLL_SPEED = 0.4;

// ============================ Video row + modal =============================

function VideoThumb({
  video,
  onOpen,
}: {
  video: HomeReviewVideo;
  onOpen: () => void;
}) {
  if (!video.posterUrl && !video.mp4Url) return null;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative aspect-[3/4] w-[150px] sm:w-[170px] flex-shrink-0 overflow-hidden rounded-[18px] bg-neutral-900"
      aria-label="Play video"
    >
      {video.posterUrl ? (
        <img
          src={video.posterUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#212121] shadow-lg transition-transform duration-200 group-hover:scale-110">
        <Play className="ml-0.5 h-5 w-5 fill-current" />
      </span>
    </button>
  );
}

// Horizontal auto-scrolling video row; content duplicated for a seamless loop,
// hover pauses it (via a ref so the rAF loop never tears down).
function VideoMarquee({
  videos,
  onOpen,
}: {
  videos: HomeReviewVideo[];
  onOpen: (v: HomeReviewVideo) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const offRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const step = () => {
      const el = trackRef.current;
      if (el && !pausedRef.current) {
        const max = el.scrollWidth / 2;
        if (max > 0) {
          offRef.current = (offRef.current + VIDEO_SCROLL_SPEED) % max;
          el.style.transform = `translateX(${-offRef.current}px)`;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [videos.length]);

  if (!videos.length) return null;

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div
        ref={trackRef}
        className="flex w-max gap-3"
        style={{ willChange: "transform" }}
      >
        {[...videos, ...videos].map((v, i) => (
          <VideoThumb key={i} video={v} onOpen={() => onOpen(v)} />
        ))}
      </div>
    </div>
  );
}

function VideoModal({
  video,
  onClose,
}: {
  video: HomeReviewVideo | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!video) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [video, onClose]);

  return (
    <AnimatePresence>
      {video ? (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-[420px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            >
              <X className="h-5 w-5" />
            </button>
            {video.mp4Url ? (
              <video
                src={video.mp4Url}
                poster={video.posterUrl ?? undefined}
                controls
                autoPlay
                playsInline
                className="aspect-[9/16] w-full rounded-[20px] bg-black object-contain"
              />
            ) : null}
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}

// ===================== Judge.me review cards (as before) ====================

function ReviewCard({ review }: { review: JudgeMeReview }) {
  const picture = review.pictures[0];
  return (
    <div className="overflow-hidden rounded-[20px] border border-black/[0.08] bg-white p-5">
      {picture ? (
        <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-[14px] bg-black/[0.04]">
          <img
            src={picture}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      ) : null}
      <div className="mb-3 flex min-w-0 items-center gap-2">
        <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[13px] font-semibold text-[#15803D]">
          {review.rating.toFixed(1)}
        </span>
        <span className="min-w-0 truncate text-[14px] font-semibold text-[#212121]">
          {review.author}
        </span>
      </div>
      {review.title ? (
        <p className="font-solar text-[15px] font-medium leading-[1.3] text-[#212121] sm:text-[18px]">
          {review.title}
        </p>
      ) : null}
      {review.body ? (
        <p className="mt-2 line-clamp-4 whitespace-pre-line text-[14px] leading-[1.5] text-black/55">
          {review.body}
        </p>
      ) : null}
    </div>
  );
}

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
    reviews.forEach((rev, i) => (i % 2 === 0 ? l : r).push(rev));
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
      <div className="grid max-h-[420px] grid-cols-2 items-start gap-4 overflow-hidden">
        <div
          ref={leftRef}
          className="flex flex-col gap-4"
          style={{ willChange: "transform" }}
        >
          {[...left, ...left].map((rev, i) => (
            <ReviewCard key={`l-${rev.id}-${i}`} review={rev} />
          ))}
        </div>
        <div
          ref={rightRef}
          className="flex flex-col gap-4"
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

// ================================ Section ===================================

interface SocialProofSectionProps {
  content: HomeReviewsContent | null;
}

// optimist-website "Real people, real summers" header + dark rating card, with
// the PREVIOUS review mechanisms restored: a video marquee (modal player) and
// the auto-scrolling Judge.me review cards.
export function SocialProofSection({ content }: SocialProofSectionProps) {
  const [reviews, setReviews] = useState<JudgeMeReview[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<HomeReviewVideo | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchReviewsSummary(), fetchFeaturedReviews()])
      .then(([summary, featured]) => {
        if (cancelled) return;
        setReviews(summary.reviews.length > 0 ? summary.reviews : featured);
        if (summary.averageRating) setAvgRating(summary.averageRating);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const eyebrow = content?.subtitle ?? "There’s much to feel optimistic about.";
  const title = content?.title ?? "Hear it from the ones\nwho love living with it.";
  const mainLine =
    content?.mainLine ??
    "Across home in Delhi NCR, Jaipur, Bangalore, Hyderabad, here's what life with Optimist actually feels like.";
  const earlyUsers = content?.earlyUsers ?? 200;
  const ratingValue = (avgRating ?? 4.8).toFixed(1);
  const videos = content?.videos ?? [];

  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 pt-20 md:pt-50">
      <div className="mx-auto max-w-[1080px]">
        <p className="text-base sm:text-lg md:text-[20px] leading-[160%] font-poppins font-normal text-[#3478F6]">
          {eyebrow}
        </p>

        <div className="mt-5 flex flex-col lg:flex-row justify-between gap-x-6 gap-y-2 lg:gap-0">
          <SectionTitle title={title} className="text-start w-full [&>h2]:mt-0" />
          <div className="flex flex-col gap-4 md:gap-y-[23px]">
            <p className="text-sm sm:text-base leading-[160%] font-light text-[#6A6A6A]">
              {mainLine}
            </p>
            <div className="flex flex-col">
              <p className="text-2xl sm:text-3xl md:text-4xl leading-[140%] font-solar font-bold text-[#3478F6]">
                {earlyUsers}+
              </p>
              <p className="text-sm sm:text-base leading-[140%] font-light">
                happy early users
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-12 lg:mt-19 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            <VideoMarquee videos={videos} onOpen={setActiveVideo} />
            <AutoScrollReviews reviews={reviews} />
          </div>

          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            className="relative lg:col-span-4 min-h-[320px] p-6 sm:p-8 md:p-10 pr-5 sm:pr-6 md:pr-[30px] flex flex-col justify-between bg-[#0E0E0E] text-white rounded-[16px] sm:rounded-[20px] md:rounded-[24px]"
          >
            <img
              src={optimistTreeVector}
              alt=""
              className="absolute inset-0 scale-110 md:scale-none opacity-50 md:opacity-100"
            />
            <div className="relative z-10">
              <p className="text-sm sm:text-base leading-[140%] font-light">
                Rated by Early users
              </p>
              <p className="mt-2 font-solar">
                <span className="text-[48px] sm:text-[56px] md:text-[67px] leading-none font-medium">
                  {ratingValue}
                </span>
                <span className="text-2xl sm:text-3xl md:text-4xl leading-[140%] font-medium text-[#6A6A6A]">
                  /5
                </span>
              </p>
              <p className="mt-2.5 pr-2.5 text-base sm:text-lg md:text-[21px] leading-[140%] font-light whitespace-pre-line">{`Already cooling homes in 5+ cities across India, with bills that speak louder than any ad ever could.`}</p>
            </div>
            <div className="flex flex-col gap-2 relative z-10 mt-6">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="size-5 sm:size-6 fill-[#AEFFD8] stroke-[#AEFFD8]"
                  />
                ))}
              </div>
              <p className="text-base sm:text-lg md:text-[21px] leading-[120%] font-solar font-medium whitespace-pre-line">{`Trusted by ${earlyUsers}+ customers\nfrom all over India`}</p>
            </div>
          </m.div>
        </div>
      </div>

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </section>
  );
}
