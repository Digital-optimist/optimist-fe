"use client";

import { memo, useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";

// =============================================================================
// Types
// =============================================================================

interface ShopifyReview {
  id: string;
  rating: number;
  title: string;
  body: string;
  author: string;
  createdAt: string;
}

interface RatingDistribution {
  star: number;
  percentage: number;
}

interface ReviewsData {
  averageRating: number;
  totalReviews: number;
  distribution: RatingDistribution[];
  reviews: ShopifyReview[];
}

// =============================================================================
// Constants
// =============================================================================

const SHOPIFY_STORE_DOMAIN = "octolife-3.myshopify.com";

const PLACEHOLDER_REVIEWS: ReviewsData = {
  averageRating: 4.8,
  totalReviews: 2401,
  distribution: [
    { star: 5, percentage: 90 },
    { star: 4, percentage: 74 },
    { star: 3, percentage: 5 },
    { star: 2, percentage: 4 },
    { star: 1, percentage: 0 },
  ],
  reviews: [
    {
      id: "1",
      rating: 4,
      title: "",
      body: "I absolutely love it. I would love to get a bigger basket because I got a 4 quart, but it works perfectly fine. Gets the job done. I love it.\nI absolutely love it. I would love to get a bigger basket",
      author: "Kush Verma",
      createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    },
    {
      id: "2",
      rating: 4,
      title: "",
      body: "Excellent cooling performance even during peak summer. The energy consumption is noticeably lower compared to my old AC. Very satisfied with the purchase.",
      author: "Priya Sharma",
      createdAt: new Date(Date.now() - 22 * 86400000).toISOString(),
    },
    {
      id: "3",
      rating: 5,
      title: "",
      body: "Best AC I have used so far. Cools the room in minutes and the electricity bill has actually gone down. The build quality is premium. Highly recommended!",
      author: "Rahul Mehta",
      createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    },
    {
      id: "4",
      rating: 5,
      title: "",
      body: "The smart features are amazing. Love the live energy meter - it actually helps me track consumption. Installation was smooth and the after-sales support is great.",
      author: "Ananya Gupta",
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: "5",
      rating: 4,
      title: "",
      body: "Very quiet operation and consistent cooling. Works well even on the hottest days. The design looks sleek and modern on the wall. Worth every penny.",
      author: "Vikram Singh",
      createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
    },
    {
      id: "6",
      rating: 5,
      title: "",
      body: "Finally an AC that delivers on its promises. Tested it during a 48°C heatwave and it kept the room perfectly cool. The app integration is a nice bonus.",
      author: "Neha Patel",
      createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
    },
  ],
};

// =============================================================================
// Utils
// =============================================================================

function getRelativeTime(dateString: string): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "1 month ago";
  return `${diffMonths} months ago`;
}

function formatReviewCount(count: number): string {
  return new Intl.NumberFormat("en-IN").format(count);
}

// =============================================================================
// Star Rating Component
// =============================================================================

const StarRating = memo(function StarRating({
  rating,
  size = 18,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= rating
              ? "fill-[#F5A623] text-[#F5A623]"
              : "fill-none text-[#D1D1D1]"
          }
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
});

// =============================================================================
// Rating Bar Component
// =============================================================================

const RatingBar = memo(function RatingBar({
  star,
  percentage,
}: {
  star: number;
  percentage: number;
}) {
  return (
    <div className="flex items-center gap-2 w-full">
      <span className="font-semibold text-sm md:text-base text-black w-3 text-center shrink-0">
        {star}
      </span>
      <div className="flex-1 h-[10px] md:h-3 bg-white rounded-full overflow-hidden">
        <div
          className="h-full bg-[rgba(52,120,246,0.24)] rounded-full transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm md:text-base text-black w-8 text-right shrink-0">
        {percentage}%
      </span>
    </div>
  );
});

// =============================================================================
// Review Card Component
// =============================================================================

const ReviewCard = memo(function ReviewCard({
  review,
}: {
  review: ShopifyReview;
}) {
  return (
    <div className="bg-white border border-black/[0.12] rounded-[20px] md:rounded-[24px] p-5 md:p-6 flex flex-col h-full">
      <div className="flex flex-col gap-6 md:gap-8 flex-1">
        <div className="flex flex-col gap-5 md:gap-8">
          <div className="flex items-center justify-between">
            <StarRating rating={review.rating} />
            <span className="text-sm md:text-base text-black">
              {getRelativeTime(review.createdAt)}
            </span>
          </div>
          <p className="text-sm md:text-base text-black leading-relaxed line-clamp-5 whitespace-pre-line">
            {review.body}
          </p>
        </div>
      </div>
      <p className="font-semibold text-sm md:text-base text-black text-right mt-6 md:mt-auto md:pt-6">
        ~{review.author}
      </p>
    </div>
  );
});

// =============================================================================
// Rating Summary Card Component
// =============================================================================

const RatingSummaryCard = memo(function RatingSummaryCard({
  data,
}: {
  data: ReviewsData;
}) {
  return (
    <div className="bg-black/[0.04] rounded-[20px] md:rounded-[24px] p-5 md:p-8 w-full lg:w-[440px] shrink-0">
      <div className="flex items-end justify-between mb-6 md:mb-8">
        <p className="font-display font-semibold text-black leading-none">
          <span className="text-[40px] md:text-[48px]">
            {data.averageRating}
          </span>
          <span className="text-[24px] md:text-[32px] text-black/70">/5</span>
        </p>
        <div className="flex items-center gap-1.5">
          <StarRating rating={Math.round(data.averageRating)} size={20} />
          <span className="text-sm md:text-base text-black/60">
            ({formatReviewCount(data.totalReviews)})
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:gap-5">
        {data.distribution.map((item) => (
          <RatingBar
            key={item.star}
            star={item.star}
            percentage={item.percentage}
          />
        ))}
      </div>
    </div>
  );
});

// =============================================================================
// Auto-scrolling Reviews Grid
// =============================================================================

const AutoScrollReviewsGrid = memo(function AutoScrollReviewsGrid({
  reviews,
  isInView,
}: {
  reviews: ShopifyReview[];
  isInView: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollSpeed = 0.5;

  const startScrolling = useCallback(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    const step = () => {
      if (!trackRef.current || !containerRef.current) return;

      offsetRef.current += scrollSpeed;

      const maxOffset = trackRef.current.scrollHeight / 2;
      if (offsetRef.current >= maxOffset) {
        offsetRef.current = 0;
      }

      trackRef.current.style.transform = `translateY(${-offsetRef.current}px)`;

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
  }, [scrollSpeed]);

  const stopScrolling = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isInView && !isPaused) {
      startScrolling();
    } else {
      stopScrolling();
    }
    return stopScrolling;
  }, [isInView, isPaused, startScrolling, stopScrolling]);

  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => setIsPaused(false), []);
  const handleTouchStart = useCallback(() => setIsPaused(true), []);
  const handleTouchEnd = useCallback(() => {
    setTimeout(() => setIsPaused(false), 2000);
  }, []);

  const doubledReviews = [...reviews, ...reviews];

  return (
    <div
      className="flex-1 min-w-0 relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

      <div
        ref={containerRef}
        className="overflow-hidden max-h-[440px] md:max-h-[520px]"
      >
        <div
          ref={trackRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
          style={{ willChange: "transform" }}
        >
          {doubledReviews.map((review, index) => (
            <ReviewCard key={`${review.id}-${index}`} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
});

// =============================================================================
// Main Component
// =============================================================================

export const ReviewsSection = memo(function ReviewsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const [reviewsData] = useState<ReviewsData>(PLACEHOLDER_REVIEWS);

  const handleWriteReview = useCallback(() => {
    window.open(
      `https://${SHOPIFY_STORE_DOMAIN}/pages/reviews`,
      "_blank",
      "noopener,noreferrer",
    );
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" as const },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white pb-8 md:pb-12 lg:pb-16"
      aria-labelledby="reviews-heading"
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <h2
              id="reviews-heading"
              className="font-display text-2xl md:text-4xl lg:text-[40px] font-semibold text-black leading-tight tracking-wide md:tracking-normal"
            >
              Our Reviews
            </h2>
            <button
              onClick={handleWriteReview}
              className="btn-buy-now flex items-center justify-center px-6 md:px-8 py-3 md:py-4 h-11 md:h-14 rounded-full text-[#FFFCDC] font-medium text-sm md:text-base whitespace-nowrap"
            >
              Write a review
            </button>
          </div>

          {/* Content: Summary + Reviews Grid */}
          <div className="flex flex-col lg:flex-row items-start gap-6 md:gap-8">
            <RatingSummaryCard data={reviewsData} />
            <AutoScrollReviewsGrid
              reviews={reviewsData.reviews}
              isInView={isInView}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
});
