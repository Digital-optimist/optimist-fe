import { useState, useEffect } from "react";

const SHOP_DOMAIN = "aet2fp-ks.myshopify.com";
const PUBLIC_TOKEN = "gdjODw0sMwsBYtb-2OJdVwbUajY";
const API_BASE = "https://judge.me/api/v1";

// =============================================================================
// Types
// =============================================================================

export interface JudgeMeReview {
  id: string;
  rating: number;
  title: string;
  body: string;
  author: string;
  date: string;
}

export interface RatingDistribution {
  star: number;
  percentage: number;
  count: number;
}

export interface ReviewsSummary {
  averageRating: number;
  totalReviews: number;
  distribution: RatingDistribution[];
  reviews: JudgeMeReview[];
}

export interface CreateReviewPayload {
  name: string;
  email: string;
  rating: number;
  title?: string;
  body: string;
  productId?: string;
}

// =============================================================================
// HTML Parsers (using DOMParser for reliable extraction)
// =============================================================================

function parseSummaryFromHeader(html: string): {
  totalReviews: number;
  averageRating: number;
  distribution: RatingDistribution[];
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const header =
    doc.querySelector(".jdgm-all-reviews__header") ||
    doc.querySelector(".jdgm-rev-widg") ||
    doc.querySelector("[data-number-of-reviews]");
  const totalReviews = parseInt(
    header?.getAttribute("data-number-of-reviews") || "0",
    10,
  );
  const averageRating = parseFloat(
    header?.getAttribute("data-average-rating") || "0",
  );

  const distribution: RatingDistribution[] = [];
  const rows = doc.querySelectorAll(".jdgm-histogram__row[data-rating]");

  rows.forEach((row) => {
    const star = parseInt(row.getAttribute("data-rating") || "0", 10);
    const count = parseInt(row.getAttribute("data-frequency") || "0", 10);
    const percentage = parseInt(
      row.getAttribute("data-percentage") || "0",
      10,
    );
    if (star >= 1 && star <= 5) {
      distribution.push({ star, percentage, count });
    }
  });

  if (distribution.length === 0) {
    for (let s = 5; s >= 1; s--) {
      distribution.push({ star: s, percentage: 0, count: 0 });
    }
  }

  return { totalReviews, averageRating, distribution };
}

function parseReviewsFromHTML(html: string): JudgeMeReview[] {
  if (!html) return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const items = doc.querySelectorAll(".jdgm-rev[data-review-id]");
  const reviews: JudgeMeReview[] = [];

  items.forEach((item) => {
    const id = item.getAttribute("data-review-id") || "";

    const ratingEl = item.querySelector(".jdgm-rev__rating");
    const rating = parseInt(
      ratingEl?.getAttribute("data-score") || "5",
      10,
    );

    const titleEl = item.querySelector(".jdgm-rev__title");
    const title = titleEl?.textContent?.trim() || "";

    const bodyEl = item.querySelector(".jdgm-rev__body");
    const body = bodyEl?.textContent?.trim() || "";

    const authorEl = item.querySelector(".jdgm-rev__author");
    const author = authorEl?.textContent?.trim() || "Anonymous";

    const timestampEl = item.querySelector(".jdgm-rev__timestamp");
    const date = timestampEl?.getAttribute("data-content") || "";

    if (body || title) {
      reviews.push({ id, rating, title, body, author, date });
    }
  });

  return reviews;
}

function parsePreviewBadge(html: string): {
  rating: number;
  count: number;
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const badge = doc.querySelector("[data-average-rating]");
  const rating = parseFloat(
    badge?.getAttribute("data-average-rating") || "0",
  );
  const count = parseInt(
    badge?.getAttribute("data-number-of-reviews") || "0",
    10,
  );

  return { rating, count };
}

// =============================================================================
// API Functions
// =============================================================================

async function widgetFetch(endpoint: string, params: string = "") {
  const url = `${API_BASE}/widgets/${endpoint}?api_token=${PUBLIC_TOKEN}&shop_domain=${SHOP_DOMAIN}${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Judge.me API error: ${res.status}`);
  return res.json();
}

function extractNumericId(shopifyGid: string): string {
  const match = shopifyGid.match(/(\d+)$/);
  return match ? match[1] : shopifyGid;
}

export async function fetchReviewsSummary(
  productId?: string,
): Promise<ReviewsSummary> {
  if (productId) {
    const externalId = extractNumericId(productId);
    const data = await widgetFetch(
      "product_review",
      `&external_id=${externalId}&page=1&per_page=50`,
    );

    const widgetHtml = data.widget || "";
    const { totalReviews, averageRating, distribution } =
      parseSummaryFromHeader(widgetHtml);
    const reviews = parseReviewsFromHTML(widgetHtml);

    return { averageRating, totalReviews, distribution, reviews };
  }

  const data = await widgetFetch(
    "all_reviews_page",
    "&page=1&review_type=shop-reviews",
  );

  const { totalReviews, averageRating, distribution } = parseSummaryFromHeader(
    data.all_reviews_header || "",
  );
  const reviews = parseReviewsFromHTML(data.all_reviews || "");

  return { averageRating, totalReviews, distribution, reviews };
}

function parseCarouselReviews(html: string): JudgeMeReview[] {
  if (!html) return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const items = doc.querySelectorAll(".jdgm-carousel-item[data-review-id]");
  const reviews: JudgeMeReview[] = [];

  items.forEach((item) => {
    const id = item.getAttribute("data-review-id") || "";

    const ratingEl = item.querySelector(".jdgm-carousel-item__review-rating");
    const stars = ratingEl?.querySelectorAll(".jdgm-star.jdgm--on")?.length || 0;

    const titleEl = item.querySelector(".jdgm-carousel-item__review-title");
    const title = titleEl?.textContent?.trim() || "";

    const bodyEl = item.querySelector(".jdgm-carousel-item__review-body");
    const body = bodyEl?.textContent?.trim() || "";

    const authorEl = item.querySelector(".jdgm-carousel-item__reviewer-name");
    const author = authorEl?.textContent?.trim() || "Anonymous";

    const timestampEl = item.querySelector(".jdgm-carousel-item__timestamp");
    const date =
      timestampEl?.getAttribute("data-time") ||
      timestampEl?.textContent?.trim() ||
      "";

    if (body || title) {
      reviews.push({ id, rating: stars, title, body, author, date });
    }
  });

  return reviews;
}

export async function fetchFeaturedReviews(): Promise<JudgeMeReview[]> {
  const data = await widgetFetch("featured_carousel");
  return parseCarouselReviews(data.featured_carousel || "");
}

/**
 * Uses form-encoded body to avoid CORS preflight (OPTIONS).
 * Judge.me's POST /reviews supports this and returns proper CORS headers
 * for "simple requests" but not for preflighted JSON requests.
 */
export async function createReview(
  payload: CreateReviewPayload,
): Promise<{ success: boolean; message: string }> {
  try {
    const formData = new URLSearchParams();
    formData.append("shop_domain", SHOP_DOMAIN);
    formData.append("platform", "shopify");
    formData.append("name", payload.name);
    formData.append("email", payload.email);
    formData.append("rating", String(payload.rating));
    formData.append("title", payload.title || "");
    formData.append("body", payload.body);
    if (payload.productId) {
      formData.append("id", extractNumericId(payload.productId));
    }

    const res = await fetch(`${API_BASE}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    if (!res.ok) {
      return {
        success: false,
        message: "Failed to submit review. Please try again.",
      };
    }

    return {
      success: true,
      message:
        "Thank you! Your review has been submitted and will appear shortly.",
    };
  } catch {
    return {
      success: false,
      message: "Network error. Please try again later.",
    };
  }
}

// =============================================================================
// Hooks
// =============================================================================

const ratingCache = new Map<string, { rating: number; count: number }>();

export function useJudgeMeRating(productId?: string): {
  rating: number;
  count: number;
  loading: boolean;
} {
  const externalId = productId ? extractNumericId(productId) : undefined;
  const cacheKey = externalId || "__shop__";
  const [data, setData] = useState<{ rating: number; count: number }>(() => {
    return ratingCache.get(cacheKey) || { rating: 0, count: 0 };
  });
  const [loading, setLoading] = useState(!ratingCache.has(cacheKey));

  useEffect(() => {
    const cached = ratingCache.get(cacheKey);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    setData({ rating: 0, count: 0 });
    setLoading(true);
    let cancelled = false;

    if (externalId) {
      widgetFetch("preview_badge", `&external_id=${externalId}`)
        .then((res) => {
          if (cancelled) return;
          const result = parsePreviewBadge(res.badge || "");
          ratingCache.set(cacheKey, result);
          setData(result);
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    } else {
      Promise.all([
        widgetFetch("all_reviews_rating"),
        widgetFetch("all_reviews_count"),
      ])
        .then(([ratingRes, countRes]) => {
          if (cancelled) return;
          const result = {
            rating: parseFloat(ratingRes.all_reviews_rating || "0"),
            count: parseInt(countRes.all_reviews_count || "0", 10),
          };
          ratingCache.set(cacheKey, result);
          setData(result);
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }

    return () => {
      cancelled = true;
    };
  }, [cacheKey, externalId]);

  return { ...data, loading };
}
