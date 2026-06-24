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
  on(event: string, handler: (response: unknown) => void): void;
}

interface Window {
  Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
}
