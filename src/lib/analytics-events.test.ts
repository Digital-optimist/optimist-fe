import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { trackMagicCheckoutEvent, trackPurchase } from "./analytics-events";
import type { CompleteCheckoutResponse } from "./razorpay-magic";

let gtag: ReturnType<typeof vi.fn>;
let fbq: ReturnType<typeof vi.fn>;

beforeEach(() => {
  gtag = vi.fn();
  fbq = vi.fn();
  vi.stubGlobal("window", { gtag, fbq, dataLayer: [] });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// Amounts are paise, mirroring the integration doc's payloads.
const baseEvent = {
  paymentMode: "online",
  lineItems: [
    {
      sku: "AC-PRO",
      name: "Optimist AC",
      price: 49900,
      offer_price: 39900,
      quantity: 2,
      variant_id: 123,
    },
  ],
  totalAmount: 99800,
  latestTotal: 79800,
  currency: "INR",
};

describe("trackMagicCheckoutEvent", () => {
  it("maps `initiate` → GA4 begin_checkout + Meta InitiateCheckout (standard)", () => {
    trackMagicCheckoutEvent({ ...baseEvent, event: "initiate" });

    expect(gtag).toHaveBeenCalledWith(
      "event",
      "begin_checkout",
      expect.objectContaining({
        currency: "INR",
        value: 798, // 79800 paise → ₹798
        items: [
          expect.objectContaining({
            item_id: "AC-PRO",
            item_name: "Optimist AC",
            price: 399, // 39900 paise → ₹399 (offer_price wins)
            quantity: 2,
          }),
        ],
      }),
    );
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "InitiateCheckout",
      expect.objectContaining({
        currency: "INR",
        value: 798,
        content_type: "product",
        contents: [{ id: "AC-PRO", quantity: 2 }],
      }),
    );
  });

  it("maps `shipping_selected` → add_shipping_info + Meta custom AddShippingInfo", () => {
    trackMagicCheckoutEvent({ ...baseEvent, event: "shipping_selected" });
    expect(gtag).toHaveBeenCalledWith(
      "event",
      "add_shipping_info",
      expect.anything(),
    );
    expect(fbq).toHaveBeenCalledWith(
      "trackCustom",
      "AddShippingInfo",
      expect.anything(),
    );
  });

  it("maps `payment_initiated` → add_payment_info + Meta AddPaymentInfo (standard)", () => {
    trackMagicCheckoutEvent({ ...baseEvent, event: "payment_initiated" });
    expect(gtag).toHaveBeenCalledWith(
      "event",
      "add_payment_info",
      expect.anything(),
    );
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "AddPaymentInfo",
      expect.anything(),
    );
  });

  it("forwards the coupon code when present", () => {
    trackMagicCheckoutEvent({
      ...baseEvent,
      event: "coupon_applied",
      couponCode: "SAVE10",
    });
    expect(gtag).toHaveBeenCalledWith(
      "event",
      "select_promotion",
      expect.objectContaining({ coupon: "SAVE10" }),
    );
  });

  it("ignores events it doesn't map", () => {
    trackMagicCheckoutEvent({ event: "totally_unknown" });
    expect(gtag).not.toHaveBeenCalled();
    expect(fbq).not.toHaveBeenCalled();
  });

  it("forwards user_data to GA4 but not Meta (avoids sending PII to the Pixel)", () => {
    trackMagicCheckoutEvent({ ...baseEvent, event: "user_data" });
    expect(gtag).toHaveBeenCalledWith("event", "user_data", expect.anything());
    expect(fbq).not.toHaveBeenCalled();
  });

  it("queues onto dataLayer when gtag hasn't loaded yet (lazyOnload safety)", () => {
    const dataLayer: unknown[] = [];
    vi.stubGlobal("window", { fbq, dataLayer }); // no gtag
    trackMagicCheckoutEvent({ ...baseEvent, event: "initiate" });
    expect(dataLayer).toContainEqual([
      "event",
      "begin_checkout",
      expect.objectContaining({ value: 798 }),
    ]);
  });

  it("never throws on a malformed payload", () => {
    expect(() =>
      trackMagicCheckoutEvent({ event: "initiate", lineItems: "nope" } as never),
    ).not.toThrow();
  });
});

describe("trackPurchase", () => {
  const make = (id: string): CompleteCheckoutResponse =>
    ({
      order_id: id,
      total_amount: 79800,
      payment_currency: "INR",
    }) as CompleteCheckoutResponse;

  it("fires GA4 purchase + Meta Purchase with the order total", () => {
    trackPurchase(make("#A-1001"));
    expect(gtag).toHaveBeenCalledWith("event", "purchase", {
      transaction_id: "#A-1001",
      value: 798,
      currency: "INR",
    });
    expect(fbq).toHaveBeenCalledWith("track", "Purchase", {
      value: 798,
      currency: "INR",
    });
  });

  it("dedupes a repeated purchase for the same order id", () => {
    const order = make("#B-2002");
    trackPurchase(order);
    trackPurchase(order); // second call must be a no-op
    expect(gtag.mock.calls.filter((c) => c[1] === "purchase")).toHaveLength(1);
    expect(fbq.mock.calls.filter((c) => c[1] === "Purchase")).toHaveLength(1);
  });

  it("uses beacon transport + timeout fallback when a redirect follows", () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    trackPurchase(make("#C-3003"), onComplete);
    expect(gtag).toHaveBeenCalledWith(
      "event",
      "purchase",
      expect.objectContaining({
        transaction_id: "#C-3003",
        transport_type: "beacon",
        event_callback: expect.any(Function),
      }),
    );
    // Redirect must still fire even if GA never calls back (blocked/slow).
    expect(onComplete).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1000);
    expect(onComplete).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("redirects via GA4's event_callback without double-firing onComplete", () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    // Simulate gtag invoking the event_callback once the hit is dispatched.
    gtag.mockImplementationOnce((_evt, _name, params) => {
      (params as { event_callback?: () => void })?.event_callback?.();
    });
    trackPurchase(make("#D-4004"), onComplete);
    expect(onComplete).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(2000); // fallback must not fire a second time
    expect(onComplete).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("still runs onComplete when the purchase is deduped", () => {
    const order = make("#E-5005");
    trackPurchase(order); // first fire records the id
    const onComplete = vi.fn();
    trackPurchase(order, onComplete); // deduped — but redirect must not stall
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
