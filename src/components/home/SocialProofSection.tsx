"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";
import { Play, Star, X } from "lucide-react";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";
import {
  fetchReviewsSummary,
  fetchFeaturedReviews,
  type JudgeMeReview,
} from "@/lib/judgeme";
import type { HomeReviewsContent, HomeReviewVideo } from "@/lib/shopify";

const CARD_BG = "/newHomepage/Vector%20(22).webp";

// Continuous auto-scroll speeds (px per animation frame).
const VIDEO_SCROLL_SPEED = 0.5;
const REVIEW_SCROLL_SPEED = 0.4;

// =============================================================================
// Video thumbnail row + modal player
// =============================================================================

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
      className="group relative aspect-[3/4] w-[150px] flex-shrink-0 overflow-hidden rounded-[18px] bg-neutral-900 sm:w-[170px]"
      aria-label="Play video"
    >
      {video.posterUrl ? (
        <Image
          src={video.posterUrl}
          alt=""
          fill
          sizes="170px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-optimist-black shadow-lg transition-transform duration-200 group-hover:scale-110">
        <Play className="ml-0.5 h-5 w-5 fill-current" />
      </span>
    </button>
  );
}

// Horizontal auto-scrolling video row. Content is duplicated so the translateX
// loop is seamless; hovering pauses it (via a ref, so the rAF loop never tears
// down) and individual thumbs stay clickable.
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

// =============================================================================
// Auto-scrolling reviews (mirrors products/ReviewsSection behavior)
// =============================================================================

function ReviewCard({ review }: { review: JudgeMeReview }) {
  const picture = review.pictures[0];
  return (
    <div className="overflow-hidden rounded-[20px] border border-black/[0.08] bg-white p-5">
      {picture ? (
        <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-[14px] bg-black/[0.04]">
          <Image
            src={picture}
            alt=""
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 50vw, 280px"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[13px] font-semibold text-[#15803D]">
          {review.rating.toFixed(1)}
        </span>
        <span className="text-[14px] font-semibold text-optimist-black">
          {review.author}
        </span>
      </div>
      {review.title ? (
        <p className="font-display text-[18px] font-semibold leading-[1.3] text-optimist-black">
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

// =============================================================================
// Static "rated by early users" card
// =============================================================================

function RatedCard() {
  return (
    <div className="relative flex h-full min-h-[520px] flex-col justify-between overflow-hidden rounded-[28px] bg-neutral-950 p-8 text-white">
      <Image
        src={CARD_BG}
        alt=""
        aria-hidden="true"
        fill
        sizes="380px"
        className="pointer-events-none select-none object-cover opacity-40"
      />
      <div className="relative z-10">
        <p className="text-[14px] text-white/55">Rated by Early users</p>
        <p className="mt-2 font-display font-semibold leading-none">
          <span className="text-[64px]">4.8</span>
          <span className="text-[28px] text-white/45">/5</span>
        </p>
        <p className="mt-6 max-w-[280px] text-[20px] font-medium leading-[1.4] text-white/90">
          Already cooling homes in 20+ cities across India, with bills that
          speak louder than any ad ever could.
        </p>
      </div>
      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className="h-6 w-6 fill-[#34D399] text-[#34D399]"
            />
          ))}
        </div>
        <p className="text-[16px] font-semibold leading-[1.3]">
          Trusted by 2500+ customers
          <br />
          from all over India
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// Section
// =============================================================================

interface SocialProofSectionProps {
  content: HomeReviewsContent | null;
}

export function SocialProofSection({ content }: SocialProofSectionProps) {
  const [reviews, setReviews] = useState<JudgeMeReview[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchReviewsSummary(), fetchFeaturedReviews()])
      .then(([summary, featured]) => {
        if (cancelled) return;
        setReviews(summary.reviews.length > 0 ? summary.reviews : featured);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const [activeVideo, setActiveVideo] = useState<HomeReviewVideo | null>(null);

  if (!content) return null;

  const { subtitle, title, mainLine, earlyUsers, unitsSold, videos } = content;

  return (
    <section className="relative overflow-hidden bg-white py-[88px]">
      <div className="mx-auto max-w-[1100px] px-6">
        {/* Header: title (left) + main line & stats (right) */}
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent(0.1)}
          className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12"
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
              className="mt-3 font-display text-[48px] leading-[56px] font-medium text-[#212121]"
            >
              {title}
            </m.h2>
          </div>

          <div className="lg:pt-2">
            {mainLine ? (
              <m.p
                variants={fadeUp}
                className="max-w-[420px] text-[16px] leading-[1.5] text-black/50"
              >
                {mainLine}
              </m.p>
            ) : null}
            <m.div variants={fadeUp} className="mt-6 flex gap-12">
              <div>
                <p className="font-display text-[36px] font-semibold leading-none text-optimist-blue-hero">
                  {earlyUsers}+
                </p>
                <p className="mt-1 text-[15px] text-black/55">
                  happy early users
                </p>
              </div>
              <div>
                <p className="font-display text-[36px] font-semibold leading-none text-optimist-blue-hero">
                  {unitsSold}
                </p>
                <p className="mt-1 text-[15px] text-black/55">AC Units sold</p>
              </div>
            </m.div>
          </div>
        </m.div>

        {/* Body: videos + reviews (left), rated card (right). Fixed
            proportions; `min-w-0` lets the video row scroll horizontally
            instead of stretching the column and pushing the card off-screen. */}
        <div className="mt-12 flex flex-col gap-6 lg:flex-row lg:items-stretch">
          <div className="min-w-0 lg:w-[63%]">
            <VideoMarquee videos={videos} onOpen={setActiveVideo} />

            <div className="mt-6">
              <AutoScrollReviews reviews={reviews} />
            </div>
          </div>

          <div className="flex-shrink-0 lg:w-[34%]">
            <RatedCard />
          </div>
        </div>
      </div>

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </section>
  );
}
