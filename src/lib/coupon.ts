// A coupon the visitor has actually claimed (currently via the lead-capture
// popup's reveal step). When set, the Magic Checkout flow passes it as
// `prefill.coupon_code` so it auto-applies (see the integration doc, Step 4).
//
// We deliberately do NOT auto-apply a blanket discount to every checkout — only
// to shoppers who claimed one. The Magic Checkout coupon widget stays visible
// (`show_coupons: true`) so anyone can still enter a code manually.

const CLAIMED_COUPON_KEY = "optimist_claimed_coupon";

export function setClaimedCoupon(code: string): void {
  try {
    if (code) localStorage.setItem(CLAIMED_COUPON_KEY, code);
  } catch {
    /* storage unavailable (private mode / quota) — non-fatal */
  }
}

export function getClaimedCoupon(): string | undefined {
  try {
    return localStorage.getItem(CLAIMED_COUPON_KEY) || undefined;
  } catch {
    return undefined;
  }
}

export function clearClaimedCoupon(): void {
  try {
    localStorage.removeItem(CLAIMED_COUPON_KEY);
  } catch {
    /* noop */
  }
}
