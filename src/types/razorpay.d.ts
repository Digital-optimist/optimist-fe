// Ambient typings for the Razorpay Magic Checkout Web SDK
// (https://checkout.razorpay.com/v1/magic-checkout.js), loaded at runtime via
// src/lib/loadRazorpay.ts. Mirrors the ambient-global style of gtag.d.ts.

interface RazorpayPrefill {
  name?: string;
  email?: string;
  contact?: string;
  /** A coupon from the cart to auto-apply inside Magic Checkout (Step 4). */
  coupon_code?: string;
}

/** Payload passed to `handler` after a payment is captured. */
interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

/** A line item inside a Magic Checkout `mx-analytics` event payload. */
interface MagicAnalyticsLineItem {
  sku?: string;
  name?: string;
  type?: string;
  price?: number; // paise
  weight?: number;
  quantity?: number;
  image_url?: string;
  variant_id?: number | string;
  description?: string;
  offer_price?: number; // paise
  product_url?: string;
}

/**
 * Payload delivered to the `mx-analytics` event for each step of the Magic
 * Checkout funnel — `initiate`, `coupon_applied`/`coupon_failed`,
 * `otp_initiated`/`otp_submitted`, `shipping_selected`, `payment_initiated`,
 * `payment_failed`, `user_data`. Monetary amounts are in paise.
 */
interface MagicAnalyticsEvent {
  event: string;
  paymentMode?: string;
  lineItems?: MagicAnalyticsLineItem[];
  totalAmount?: number;
  latestTotal?: number;
  currency?: string;
  couponCode?: string;
  couponDiscountValue?: number;
  shippingAmount?: number;
  paymentMethod?: string;
  errorMsg?: string;
  [key: string]: unknown;
}

/** Payload passed to the `payment.failed` event handler. */
interface RazorpayFailedResponse {
  error: {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
    metadata?: {
      order_id?: string;
      payment_id?: string;
    };
  };
}

/**
 * Per-method display overrides. `whitelabel` re-brands a provider on the EMI
 * screens (e.g. shows Snapmint under a custom label). Optional — omit to keep
 * the provider's own name.
 */
interface RazorpayMethodOptions {
  snapmint?: {
    whitelabel?: {
      enabled?: boolean;
      label?: string;
      description?: string;
    };
  };
}

/** A custom tile on the L0 payment screen: a named, standalone block grouping
 *  one or more instruments (payment methods). */
interface RazorpayDisplayBlock {
  name: string;
  instruments: { method: string }[];
  /** Render the block inline on L0 (vs. a nested/expandable section). */
  inline?: boolean;
}

/** L0 payment-screen display customization (`config.display`). */
interface RazorpayDisplayConfig {
  blocks?: Record<string, RazorpayDisplayBlock>;
  /** Order of tiles on L0 — method ids ("upi", "card", …) or "block.<key>".
   *  Methods not listed still appear, after the sequenced ones. */
  sequence?: string[];
  hide?: { method: string }[];
}

interface RazorpayOptions {
  /** Public API Key ID from the Razorpay Dashboard (rzp_live_/rzp_test_). */
  key: string;
  /** Business name shown on the Checkout form. */
  name: string;
  /** Order ID from the Create-Order step (Step 2). */
  order_id: string;
  /** Optional brand logo shown in the modal header. */
  image?: string;
  /** Default true. Set false to hide the coupon widget. */
  show_coupons?: boolean;
  prefill?: RazorpayPrefill;
  notes?: Record<string, string>;
  theme?: { color?: string };
  /** Per-method display overrides (e.g. Snapmint whitelabel/rename). */
  method?: RazorpayMethodOptions;
  /** L0 display customization — custom blocks + method ordering. */
  config?: { display?: RazorpayDisplayConfig };
  /** Called once on a successful, captured payment. */
  handler?: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
    /** Ask the shopper to confirm before closing a started payment. */
    confirm_close?: boolean;
    /** Allow Esc to close the modal. */
    escape?: boolean;
  };
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
  /** Subscribe to SDK events. `payment.failed` fires on a failed attempt. */
  on(
    event: "payment.failed",
    handler: (response: RazorpayFailedResponse) => void,
  ): void;
  /** Magic Checkout funnel analytics — emits one event per checkout step. */
  on(
    event: "mx-analytics",
    handler: (data: MagicAnalyticsEvent) => void,
  ): void;
  on(event: string, handler: (response: unknown) => void): void;
}

interface Window {
  Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
}
