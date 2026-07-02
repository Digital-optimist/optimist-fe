import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Isolate the module from the real widget loader — no DOM, no script injection.
vi.mock("./saleassist", () => ({
  SALEASSIST_WIDGET_IDS: ["W1", "W2"],
  ensureSaleAssistLoaded: vi.fn().mockResolvedValue(true),
}));

import {
  saPageView,
  saProductDetail,
  saProductClick,
  saAddToCart,
  saCheckout,
  saPurchase,
  flushSaleAssistQueue,
} from "./saleassist-events";
import { ensureSaleAssistLoaded } from "./saleassist";
import type { DisplayVariant } from "@/contexts/ProductsContext";
import type { Cart } from "./shopify";
import type { CompleteCheckoutResponse } from "./razorpay-magic";

const URL = "https://optimist.in/products/";
let track: ReturnType<typeof vi.fn>;

function stubWindow(withTrack: boolean) {
  vi.stubGlobal("window", {
    ...(withTrack ? { saleassist: { track } } : {}),
    location: { href: URL },
  });
}

beforeEach(() => {
  // Drain anything a previous test left queued into a throwaway sink, then
  // install this test's fresh spy (module-level queue persists across tests).
  vi.stubGlobal("window", { saleassist: { track: vi.fn() }, location: { href: URL } });
  flushSaleAssistQueue();
  track = vi.fn();
  stubWindow(true);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

const variant: DisplayVariant = {
  id: "15ton",
  variantId: "gid://shopify/ProductVariant/123",
  productId: "gid://shopify/Product/1",
  productTitle: "Optimist 1.5 Ton 5 Star Inverter Split AC",
  name: "1.5 Ton",
  subtitle: "For medium rooms",
  price: 45990,
  compareAtPrice: 52990,
  available: true,
  tonnage: "1.5",
  images: [],
  description: "",
  descriptionHtml: "",
};

const cart = {
  id: "gid://shopify/Cart/abc",
  checkoutUrl: "https://checkout",
  totalQuantity: 2,
  cost: {
    subtotalAmount: { amount: "91980.00", currencyCode: "INR" },
    totalAmount: { amount: "91980.00", currencyCode: "INR" },
    totalTaxAmount: null,
  },
  lines: {
    edges: [
      {
        node: {
          id: "line1",
          quantity: 2,
          merchandise: {
            id: "gid://shopify/ProductVariant/123",
            title: "1.5 Ton",
            product: {
              id: "gid://shopify/Product/1",
              handle: "1-5-ton-split-ac",
              title: "Optimist 1.5 Ton 5 Star Inverter Split AC",
              featuredImage: null,
            },
            price: { amount: "45990.00", currencyCode: "INR" },
            selectedOptions: [{ name: "Capacity", value: "1.5 Ton" }],
          },
        },
      },
    ],
  },
} satisfies Cart;

const order = (id: string): CompleteCheckoutResponse =>
  ({
    order_id: id,
    total_amount: 4599000, // paise → ₹45,990
    total_tax: "700000", // paise → ₹7,000
    shipping_fee: 0,
    payment_currency: "INR",
    promotions: [
      { reference_id: "r", code: "SAVE10", type: "coupon", value: 10, source: "s" },
    ],
  }) as CompleteCheckoutResponse;

describe("saleassist-events", () => {
  it("productDetail → track('productDetail', …, widgetIds) with product fields", () => {
    saProductDetail(variant);
    expect(track).toHaveBeenCalledWith(
      "productDetail",
      expect.objectContaining({
        view_data: { url: URL },
        actionField: { list: "Product Page" },
        products: [
          expect.objectContaining({
            name: "Optimist 1.5 Ton 5 Star Inverter Split AC",
            id: "gid://shopify/ProductVariant/123",
            price: "45990",
            brand: "Optimist",
            category: "Air Conditioner",
            variant: "1.5 Ton",
          }),
        ],
      }),
      ["W1", "W2"],
    );
  });

  it("productClick includes position when provided", () => {
    saProductClick(variant, 2);
    expect(track).toHaveBeenCalledWith(
      "productClick",
      expect.objectContaining({
        products: [expect.objectContaining({ position: 2, variant: "1.5 Ton" })],
      }),
      ["W1", "W2"],
    );
  });

  it("addToCart carries currency, quantity and the actionField product id", () => {
    saAddToCart(variant, 3);
    expect(track).toHaveBeenCalledWith(
      "addToCart",
      expect.objectContaining({
        currencyCode: "INR",
        actionField: { id: "gid://shopify/Product/1" },
        products: [expect.objectContaining({ quantity: 3, price: "45990" })],
      }),
      ["W1", "W2"],
    );
  });

  it("checkout maps every cart line item to a product", () => {
    saCheckout(cart);
    expect(track).toHaveBeenCalledWith(
      "checkout",
      expect.objectContaining({
        currencyCode: "INR",
        actionField: { step: 1 },
        products: [
          expect.objectContaining({
            name: "Optimist 1.5 Ton 5 Star Inverter Split AC",
            id: "gid://shopify/ProductVariant/123",
            price: "45990.00",
            variant: "1.5 Ton",
            quantity: 2,
          }),
        ],
      }),
      ["W1", "W2"],
    );
  });

  it("purchase converts paise→rupees and forwards the coupon + products", () => {
    saPurchase(order("#A-1"), cart);
    expect(track).toHaveBeenCalledWith(
      "purchase",
      expect.objectContaining({
        actionField: expect.objectContaining({
          id: "#A-1",
          revenue: "45990",
          tax: "7000",
          shipping: "0",
          coupon: "SAVE10",
        }),
        products: [expect.objectContaining({ quantity: 2 })],
      }),
      ["W1", "W2"],
    );
  });

  it("purchase dedupes a repeated order id", () => {
    const o = order("#B-2");
    saPurchase(o, cart);
    saPurchase(o, cart); // must be a no-op
    expect(track.mock.calls.filter((c) => c[0] === "purchase")).toHaveLength(1);
  });

  it("page_view does NOT force a widget load when the widget isn't up", () => {
    stubWindow(false);
    saPageView();
    expect(ensureSaleAssistLoaded).not.toHaveBeenCalled();
    expect(track).not.toHaveBeenCalled();
  });

  it("a conversion event DOES force the widget load when it isn't up", () => {
    stubWindow(false);
    saProductDetail(variant);
    expect(ensureSaleAssistLoaded).toHaveBeenCalled();
  });

  it("queues events before the widget is up, then flushes once track appears", () => {
    stubWindow(false);
    saAddToCart(variant, 1); // queued — nothing to send yet
    expect(track).not.toHaveBeenCalled();
    // Widget comes up; the queue drains.
    (window as unknown as { saleassist: { track: typeof track } }).saleassist = {
      track,
    };
    flushSaleAssistQueue();
    expect(track).toHaveBeenCalledWith("addToCart", expect.any(Object), [
      "W1",
      "W2",
    ]);
  });

  it("never throws if track itself throws", () => {
    track.mockImplementation(() => {
      throw new Error("boom");
    });
    expect(() => saProductDetail(variant)).not.toThrow();
  });
});
