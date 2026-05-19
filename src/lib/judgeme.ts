import { useState, useEffect } from "react";

const SHOP_DOMAIN = "aet2fp-ks.myshopify.com";
const PUBLIC_TOKEN = "gdjODw0sMwsBYtb-2OJdVwbUajY";
const API_BASE = "https://judge.me/api/v1";

const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD || "";
const CLOUDINARY_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "";

export const IMAGE_UPLOAD_ENABLED = Boolean(
  CLOUDINARY_CLOUD && CLOUDINARY_PRESET,
);

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
  pictures: string[];
  videos: string[];
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
  image?: File;
}

export const REVIEW_IMAGE_MAX_BYTES = 500 * 1024;

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

function extractMediaSrc(el: Element): string {
  return (
    el.getAttribute("src") ||
    el.getAttribute("data-src") ||
    el.getAttribute("data-original") ||
    ""
  );
}

function collectPicturesAndVideos(
  item: Element,
  pictureSelector: string,
  videoSelector: string,
): { pictures: string[]; videos: string[] } {
  const pictures: string[] = [];
  item.querySelectorAll(pictureSelector).forEach((img) => {
    const src = extractMediaSrc(img);
    if (src && !src.startsWith("data:")) pictures.push(src);
  });

  const videos: string[] = [];
  item.querySelectorAll(videoSelector).forEach((el) => {
    const src = extractMediaSrc(el);
    if (src) videos.push(src);
  });

  return { pictures, videos };
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

    const { pictures, videos } = collectPicturesAndVideos(
      item,
      ".jdgm-rev__pic-img, .jdgm-rev__pics img",
      ".jdgm-rev__video video[src], .jdgm-rev__video source",
    );

    if (body || title) {
      reviews.push({ id, rating, title, body, author, date, pictures, videos });
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

    const { pictures, videos } = collectPicturesAndVideos(
      item,
      ".jdgm-carousel-item__img-wrapper img, .jdgm-carousel-item__product-img img, img.jdgm-carousel-item__review-image",
      ".jdgm-carousel-item__video video[src], .jdgm-carousel-item__video source, video[src]",
    );

    if (body || title) {
      reviews.push({
        id,
        rating: stars,
        title,
        body,
        author,
        date,
        pictures,
        videos,
      });
    }
  });

  return reviews;
}

export async function fetchFeaturedReviews(): Promise<JudgeMeReview[]> {
  const data = await widgetFetch("featured_carousel");
  return parseCarouselReviews(data.featured_carousel || "");
}

/**
 * Upload an image to Cloudinary via an unsigned preset. Returns the
 * public secure_url that Judge.me can store as a `picture_urls[]` entry.
 * The preset (configured in Cloudinary dashboard) enforces max size,
 * allowed formats, and target folder server-side.
 */
async function uploadImageToCloudinary(image: File): Promise<string | null> {
  if (!IMAGE_UPLOAD_ENABLED) return null;
  const form = new FormData();
  form.append("file", image);
  form.append("upload_preset", CLOUDINARY_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
    { method: "POST", body: form },
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { secure_url?: string };
  return data.secure_url || null;
}

/**
 * Uses `application/x-www-form-urlencoded` to avoid CORS preflight.
 * Images are uploaded to Cloudinary first (Judge.me's public API only
 * accepts `picture_urls[]`, never raw file uploads).
 */
export async function createReview(
  payload: CreateReviewPayload,
): Promise<{ success: boolean; message: string }> {
  if (payload.image && payload.image.size > REVIEW_IMAGE_MAX_BYTES) {
    return {
      success: false,
      message: "Image must be 500 KB or smaller.",
    };
  }

  if (payload.image && !IMAGE_UPLOAD_ENABLED) {
    return {
      success: false,
      message:
        "Image uploads are not configured. Please submit the review without an image.",
    };
  }

  try {
    let pictureUrl: string | null = null;
    if (payload.image) {
      pictureUrl = await uploadImageToCloudinary(payload.image);
      if (!pictureUrl) {
        return {
          success: false,
          message: "Could not upload image. Please try again.",
        };
      }
    }

    const form = new URLSearchParams();
    form.append("shop_domain", SHOP_DOMAIN);
    form.append("platform", "shopify");
    form.append("name", payload.name);
    form.append("email", payload.email);
    form.append("rating", String(payload.rating));
    form.append("title", payload.title || "");
    form.append("body", payload.body);
    if (payload.productId) {
      form.append("id", extractNumericId(payload.productId));
    }
    if (pictureUrl) {
      form.append("picture_urls[]", pictureUrl);
    }

    const res = await fetch(`${API_BASE}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
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

// Defer non-essential work until the browser is idle so it doesn't compete
// with hydration. ~50-200ms slip is invisible since the fetch was async anyway,
// but it frees the main thread for INP-sensitive interactions right after load.
function scheduleIdle(cb: () => void): () => void {
  if (typeof window === "undefined") {
    cb();
    return () => {};
  }
  type IdleHandle = number;
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => IdleHandle;
    cancelIdleCallback?: (handle: IdleHandle) => void;
  };
  if (typeof w.requestIdleCallback === "function") {
    const handle = w.requestIdleCallback(cb, { timeout: 2000 });
    return () => w.cancelIdleCallback?.(handle);
  }
  const handle = window.setTimeout(cb, 1);
  return () => window.clearTimeout(handle);
}

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

    const cancelIdle = scheduleIdle(() => {
      if (cancelled) return;

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
    });

    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, [cacheKey, externalId]);

  return { ...data, loading };
}
