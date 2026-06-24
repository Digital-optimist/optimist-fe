// Crash-recovery for the Complete-Checkout step (Step 5).
//
// The Shopify order is created only when Complete succeeds. If the browser dies
// between "payment captured" and a successful Complete call, we persist the
// identifiers here so the next app load can retry. (The Razorpay server-side
// webhook is the authoritative backstop; this is the fast, client-side second
// line of defence.)

import type { CompleteCheckoutResponse } from "./razorpay-magic";

const PENDING_KEY = "optimist_pending_order";
const LAST_ORDER_KEY = "optimist_last_order";

// Stop retrying client-side after this; by now the webhook has reconciled it.
const PENDING_MAX_AGE_MS = 6 * 60 * 60 * 1000; // 6h

export interface PendingOrder {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  /** The Shopify cart id this order came from, so recovery can clear it. */
  cartId: string | null;
  createdAt: number;
}

export function savePendingOrder(order: PendingOrder): void {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(order));
  } catch {
    /* storage full / unavailable — non-fatal */
  }
}

export function getPendingOrder(): PendingOrder | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingOrder;
    if (!parsed.razorpay_payment_id || !parsed.razorpay_order_id) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingOrder(): void {
  try {
    localStorage.removeItem(PENDING_KEY);
  } catch {
    /* noop */
  }
}

export function isPendingExpired(order: PendingOrder): boolean {
  return Date.now() - order.createdAt > PENDING_MAX_AGE_MS;
}

/** Persists the last completed order so /order-confirmation can render it. */
export function saveLastOrder(result: CompleteCheckoutResponse): void {
  try {
    sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(result));
  } catch {
    /* noop */
  }
}

export function getLastOrder(): CompleteCheckoutResponse | null {
  try {
    const raw = sessionStorage.getItem(LAST_ORDER_KEY);
    return raw ? (JSON.parse(raw) as CompleteCheckoutResponse) : null;
  } catch {
    return null;
  }
}
