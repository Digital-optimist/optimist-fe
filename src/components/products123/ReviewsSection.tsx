"use client";

import { memo, useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Star, X, Loader2 } from "lucide-react";
import {
  fetchReviewsSummary,
  fetchFeaturedReviews,
  createReview,
  type JudgeMeReview,
  type ReviewsSummary,
  type RatingDistribution,
} from "@/lib/judgeme";

// =============================================================================
// Constants
// =============================================================================

const EMPTY_SUMMARY: ReviewsSummary = {
  averageRating: 0,
  totalReviews: 0,
  distribution: [
    { star: 5, percentage: 0, count: 0 },
    { star: 4, percentage: 0, count: 0 },
    { star: 3, percentage: 0, count: 0 },
    { star: 2, percentage: 0, count: 0 },
    { star: 1, percentage: 0, count: 0 },
  ],
  reviews: [],
};

// =============================================================================
// Utils
// =============================================================================

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString).getTime();
  if (isNaN(date)) return dateString;

  const diffMs = Date.now() - date;
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "1 month ago";
  return `${diffMonths} months ago`;
}

function useRelativeTime(dateString: string): string {
  const [text, setText] = useState(dateString);

  useEffect(() => {
    setText(getRelativeTime(dateString));
  }, [dateString]);

  return text;
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
// Interactive Star Rating (for the form)
// =============================================================================

const InteractiveStarRating = memo(function InteractiveStarRating({
  rating,
  onChange,
  size = 28,
}: {
  rating: number;
  onChange: (rating: number) => void;
  size?: number;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={size}
            className={
              star <= (hovered || rating)
                ? "fill-[#F5A623] text-[#F5A623]"
                : "fill-none text-[#D1D1D1]"
            }
            strokeWidth={1.5}
          />
        </button>
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
  review: JudgeMeReview;
}) {
  const relativeTime = useRelativeTime(review.date);

  return (
    <div className="bg-white border border-black/[0.12] rounded-[20px] md:rounded-[24px] p-5 md:p-6 flex flex-col h-full">
      <div className="flex flex-col gap-6 md:gap-8 flex-1">
        <div className="flex flex-col gap-5 md:gap-8">
          <div className="flex items-center justify-between">
            <StarRating rating={review.rating} />
            <span className="text-sm md:text-base text-black">
              {relativeTime}
            </span>
          </div>
          {review.title && (
            <p className="font-semibold text-sm md:text-base text-black">
              {review.title}
            </p>
          )}
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
  averageRating,
  totalReviews,
  distribution,
}: {
  averageRating: number;
  totalReviews: number;
  distribution: RatingDistribution[];
}) {
  return (
    <div className="bg-black/[0.04] rounded-[20px] md:rounded-[24px] p-5 md:p-8 w-full lg:w-[440px] shrink-0">
      <div className="flex items-end justify-between mb-6 md:mb-8">
        <p className="font-display font-semibold text-black leading-none">
          <span className="text-[40px] md:text-[48px]">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-[24px] md:text-[32px] text-black/70">/5</span>
        </p>
        <div className="flex items-center gap-1.5">
          <StarRating rating={Math.round(averageRating)} size={20} />
          <span className="text-sm md:text-base text-black/60">
            ({formatReviewCount(totalReviews)})
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:gap-5">
        {distribution.map((item) => (
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
  reviews: JudgeMeReview[];
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
// Write Review Modal
// =============================================================================

interface ProductOption {
  id: string;
  label: string;
}

const WriteReviewModal = memo(function WriteReviewModal({
  isOpen,
  onClose,
  productId,
  products,
}: {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  products?: ProductOption[];
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(productId || "");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (productId) setSelectedProductId(productId);
  }, [productId]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (rating === 0 || !name.trim() || !email.trim() || !body.trim()) return;

      setSubmitting(true);
      setResult(null);

      const res = await createReview({
        name: name.trim(),
        email: email.trim(),
        rating,
        title: title.trim(),
        body: body.trim(),
        productId: selectedProductId || productId,
      });

      setResult(res);
      setSubmitting(false);

      if (res.success) {
        setTimeout(() => {
          onClose();
          setName("");
          setEmail("");
          setRating(0);
          setTitle("");
          setBody("");
          setSelectedProductId(productId || "");
          setResult(null);
        }, 2500);
      }
    },
    [name, email, rating, title, body, onClose, productId, selectedProductId],
  );

  const isValid =
    rating > 0 && name.trim() && email.trim() && body.trim();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative bg-white rounded-[24px] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl md:text-2xl font-semibold text-black">
                Write a Review
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-black/5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {result?.success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-base font-medium text-black">
                  {result.message}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Rating *
                  </label>
                  <InteractiveStarRating rating={rating} onChange={setRating} />
                  {rating === 0 && (
                    <p className="text-xs text-black/40 mt-1">
                      Click a star to rate
                    </p>
                  )}
                </div>

                {products && products.length > 1 && (
                  <div>
                    <label className="block text-sm font-medium text-black mb-1.5">
                      Product *
                    </label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-black/10 bg-black/[0.02] text-sm text-black focus:outline-none focus:border-black/30 transition-colors appearance-none"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1.5">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-black/10 bg-black/[0.02] text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-black/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-black/10 bg-black/[0.02] text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-black/30 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    maxLength={100}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-black/[0.02] text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-black/30 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1.5">
                    Review *
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Share your experience..."
                    required
                    rows={4}
                    maxLength={5000}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-black/[0.02] text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-black/30 transition-colors resize-none"
                  />
                </div>

                {result && !result.success && (
                  <p className="text-sm text-red-600">{result.message}</p>
                )}

                <button
                  type="submit"
                  disabled={!isValid || submitting}
                  className="btn-buy-now flex items-center justify-center gap-2 px-8 py-4 rounded-full text-[#FFFCDC] font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// =============================================================================
// Main Component
// =============================================================================

export const ReviewsSection = memo(function ReviewsSection({
  productId,
  products,
}: {
  productId?: string;
  products?: ProductOption[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const [reviewsData, setReviewsData] =
    useState<ReviewsSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchReviewsSummary(), fetchFeaturedReviews()])
      .then(([summary, featured]) => {
        if (cancelled) return;
        setReviewsData({ ...summary, reviews: featured });
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
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
    <>
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
                onClick={() => setIsModalOpen(true)}
                className="btn-buy-now flex items-center justify-center px-6 md:px-8 py-3 md:py-4 h-11 md:h-14 rounded-full text-[#FFFCDC] font-medium text-sm md:text-base whitespace-nowrap"
              >
                Write a review
              </button>
            </div>

            {/* Content: Summary + Reviews Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2
                  size={32}
                  className="animate-spin text-black/30"
                />
              </div>
            ) : reviewsData.reviews.length > 0 ? (
              <div className="flex flex-col lg:flex-row items-start gap-6 md:gap-8">
                <RatingSummaryCard
                  averageRating={reviewsData.averageRating}
                  totalReviews={reviewsData.totalReviews}
                  distribution={reviewsData.distribution}
                />
                <AutoScrollReviewsGrid
                  reviews={reviewsData.reviews}
                  isInView={isInView}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-lg text-black/50 mb-4">
                  No reviews yet. Be the first to share your experience!
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-buy-now flex items-center justify-center px-8 py-4 rounded-full text-[#FFFCDC] font-medium text-base"
                >
                  Write a review
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <WriteReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={productId}
        products={products}
      />
    </>
  );
});
