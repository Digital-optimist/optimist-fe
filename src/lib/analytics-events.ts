// =============================================================================
// Client-side analytics event forwarding for Razorpay Magic Checkout.
//
// The Magic Checkout SDK emits funnel events through `rzpInstance.on(
// 'mx-analytics', cb)` (see the integration doc). This module maps each of
// those events — plus the final `purchase` — onto Google Analytics 4 (`gtag`)
// and the Meta Pixel (`fbq`). It is the client-side complement to the
// server-side attribution in `analytics.ts`; like that module, NOTHING here is
// allowed to throw or block checkout.
// =============================================================================

import type { CompleteCheckoutResponse } from "./razorpay-magic";

/** Paise (Razorpay's integer minor unit) → rupees, 2-dp. */
function toAmount(paise: number | undefined): number {
  return Number(((paise ?? 0) / 100).toFixed(2));
}

/**
 * Send a GA4 event. Calls `gtag` when present, otherwise queues directly onto
 * `dataLayer` so the event survives GA4's `lazyOnload` boot — gtag.js drains
 * the queue once it loads. (Funnel events fire mid-session, so gtag is almost
 * always already up; this is belt-and-braces.)
 */
function ga(event: string, params: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params);
    } else {
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push(["event", event, params]);
    }
  } catch {
    /* analytics must never break checkout */
  }
}

/** Send a Meta Pixel event — `track` for standard events, else `trackCustom`. */
function meta(
  event: string,
  params: Record<string, unknown>,
  standard: boolean,
): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  try {
    window.fbq(standard ? "track" : "trackCustom", event, params);
  } catch {
    /* analytics must never break checkout */
  }
}

interface EventMapping {
  /** GA4 event name (recommended-event names used where one exists). */
  ga4: string;
  /** Meta event, or null to skip Meta for this step. `standard` picks track vs trackCustom. */
  meta: { name: string; standard: boolean } | null;
}

// Magic Checkout funnel event → GA4 + Meta targets. Standard ecommerce names
// are used where the platform defines one (begin_checkout / InitiateCheckout,
// add_shipping_info, add_payment_info / AddPaymentInfo); the rest are custom.
const EVENT_MAP: Record<string, EventMapping> = {
  initiate: { ga4: "begin_checkout", meta: { name: "InitiateCheckout", standard: true } },
  coupon_applied: { ga4: "select_promotion", meta: { name: "CouponApplied", standard: false } },
  coupon_failed: { ga4: "coupon_failed", meta: { name: "CouponFailed", standard: false } },
  otp_initiated: { ga4: "otp_initiated", meta: { name: "OtpInitiated", standard: false } },
  otp_submitted: { ga4: "otp_submitted", meta: { name: "OtpSubmitted", standard: false } },
  shipping_selected: { ga4: "add_shipping_info", meta: { name: "AddShippingInfo", standard: false } },
  payment_initiated: { ga4: "add_payment_info", meta: { name: "AddPaymentInfo", standard: true } },
  payment_failed: { ga4: "payment_failed", meta: { name: "PaymentFailed", standard: false } },
  // Emitted once the shopper is OTP-verified. Forwarded to GA4 as a funnel
  // signal; not sent to Meta (would carry PII / advanced-matching concerns).
  user_data: { ga4: "user_data", meta: null },
};

function gaItems(lineItems: MagicAnalyticsLineItem[] | undefined) {
  if (!Array.isArray(lineItems)) return [];
  return lineItems.map((li) => ({
    item_id: li.sku || String(li.variant_id ?? ""),
    item_name: li.name ?? "",
    price: toAmount(li.offer_price ?? li.price),
    quantity: li.quantity ?? 1,
  }));
}

function metaContents(lineItems: MagicAnalyticsLineItem[] | undefined) {
  if (!Array.isArray(lineItems)) return [];
  return lineItems.map((li) => ({
    id: li.sku || String(li.variant_id ?? ""),
    quantity: li.quantity ?? 1,
  }));
}

/**
 * Forward one Magic Checkout `mx-analytics` event to GA4 + Meta. Safe to call
 * with any payload — unknown events and bad shapes are ignored.
 */
export function trackMagicCheckoutEvent(data: MagicAnalyticsEvent): void {
  if (!data || typeof data.event !== "string") return;
  const mapping = EVENT_MAP[data.event];
  if (!mapping) return; // an event we don't forward

  const value = toAmount(data.latestTotal ?? data.totalAmount);
  const currency = data.currency || "INR";
  const coupon = data.couponCode ? { coupon: data.couponCode } : {};

  ga(mapping.ga4, {
    currency,
    value,
    items: gaItems(data.lineItems),
    ...coupon,
  });

  if (mapping.meta) {
    meta(
      mapping.meta.name,
      {
        currency,
        value,
        content_type: "product",
        contents: metaContents(data.lineItems),
        ...coupon,
      },
      mapping.meta.standard,
    );
  }
}

// Guards double-counting if more than one completion path resolves for the same
// order in a single page session (finalize / crash-recovery / manual retry).
const firedPurchases = new Set<string>();

/**
 * Fire the GA4 + Meta `purchase` conversion exactly once per order. Called at
 * order completion (where the amount/currency are known and the page is fully
 * loaded), per the integration doc's "trigger purchase from the handler" note —
 * NOT from the confirmation page, which would race gtag and double-count on
 * refresh.
 */
export function trackPurchase(
  order: CompleteCheckoutResponse,
  onComplete?: () => void,
): void {
  // Still run onComplete (usually a redirect) even when we skip firing, so the
  // caller never stalls on a deduped/invalid order.
  if (!order?.order_id || firedPurchases.has(order.order_id)) {
    onComplete?.();
    return;
  }
  firedPurchases.add(order.order_id);

  const value = toAmount(order.total_amount);
  const currency = order.payment_currency || "INR";

  // Callers usually redirect to the confirmation page right after this. Meta's
  // `fbq` sends a synchronous beacon that survives the redirect, but GA4's
  // `gtag` batches its hit and would be cut off — so when a redirect is pending
  // (`onComplete` provided) we force `transport_type: "beacon"` and proceed only
  // once GA4's `event_callback` fires, with a timeout fallback so navigation
  // never hangs (e.g. if analytics are blocked).
  let settled = false;
  const settle = () => {
    if (settled) return;
    settled = true;
    onComplete?.();
  };

  ga("purchase", {
    transaction_id: order.order_id,
    value,
    currency,
    ...(onComplete
      ? { transport_type: "beacon", event_callback: settle }
      : {}),
  });
  meta("Purchase", { value, currency }, true);

  if (onComplete) setTimeout(settle, 1000);
}
