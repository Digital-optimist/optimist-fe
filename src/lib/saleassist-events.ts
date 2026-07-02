// =============================================================================
// Client-side SaleAssist conversion/event tracking.
//
// Mirrors analytics-events.ts: a thin forwarding layer that NEVER throws and
// never blocks the app. Every event is QUEUED the instant it fires and flushed
// once the SaleAssist widget script has attached `window.saleassist.track`
// (see ensureSaleAssistLoaded in ./saleassist). This makes tracking lossless —
// nothing fired before the widget loads is dropped — while keeping the heavy
// widget.js off the critical path: it's brought up lazily on the first
// high-value event, and on browser idle from the app shell (SaleAssistTracker).
//
// `saleassist.track(eventName, data, [widgetIds])` — the event shapes below
// follow SaleAssist's integration doc (view_data / actionField / products).
// =============================================================================

import { ensureSaleAssistLoaded, SALEASSIST_WIDGET_IDS } from "./saleassist";
import type { Cart, CartLine } from "./shopify";
import type { CompleteCheckoutResponse } from "./razorpay-magic";
import type { DisplayVariant } from "@/contexts/ProductsContext";

const BRAND = "Optimist";
const CATEGORY = "Air Conditioner";
const CURRENCY = "INR";

interface SAProduct {
  name: string;
  id: string;
  price?: string;
  brand?: string;
  category?: string;
  variant?: string;
  quantity?: number;
  position?: number;
}

interface SAEventData {
  view_data: { url: string };
  actionField?: Record<string, unknown>;
  currencyCode?: string;
  products?: SAProduct[];
}

// ---------------------------------------------------------------------------
// Queue + flush
// ---------------------------------------------------------------------------
type QueuedEvent = { event: string; data: SAEventData };
const queue: QueuedEvent[] = [];

function currentUrl(): string {
  try {
    return window.location.href;
  } catch {
    return "";
  }
}

/** Drain the queue to `saleassist.track` if the API is up; otherwise no-op. */
export function flushSaleAssistQueue(): void {
  if (typeof window === "undefined") return;
  const track = window.saleassist?.track;
  if (typeof track !== "function") return;
  while (queue.length) {
    const { event, data } = queue.shift()!;
    try {
      track(event, data, SALEASSIST_WIDGET_IDS);
    } catch {
      /* tracking must never break the app */
    }
  }
}

/**
 * Queue an event and ensure it is sent. `forceLoad` (default true) triggers the
 * lazy widget load if it isn't up yet — pass false for low-value events
 * (page_view) so they ride along on the app shell's idle preload instead of
 * pulling the heavy widget onto the critical path themselves. Either way the
 * event is queued and flushed once the widget is available, so nothing is lost.
 */
function saTrack(
  event: string,
  data: Omit<SAEventData, "view_data">,
  forceLoad = true,
): void {
  if (typeof window === "undefined") return;
  queue.push({ event, data: { view_data: { url: currentUrl() }, ...data } });
  if (typeof window.saleassist?.track === "function") {
    flushSaleAssistQueue();
    return;
  }
  if (forceLoad) {
    ensureSaleAssistLoaded()
      .then(flushSaleAssistQueue)
      .catch(() => {});
  }
}

/**
 * Bring the widget up (deferred/idle) and flush anything already queued. Called
 * once per session from the app shell so page_view (and any pre-load events)
 * are delivered even on pages with no high-value conversion event.
 */
export function preloadSaleAssistTracking(): void {
  ensureSaleAssistLoaded()
    .then(flushSaleAssistQueue)
    .catch(() => {});
}

// ---------------------------------------------------------------------------
// Product shape builders
// ---------------------------------------------------------------------------
function variantProduct(v: DisplayVariant, quantity?: number): SAProduct {
  return {
    name: v.productTitle,
    id: v.variantId || v.productId || v.id,
    price: v.price != null ? String(v.price) : undefined,
    brand: BRAND,
    category: CATEGORY,
    variant: v.name,
    ...(quantity != null ? { quantity } : {}),
  };
}

function lineProduct(line: CartLine): SAProduct {
  const m = line.merchandise;
  const variant =
    m.selectedOptions?.map((o) => o.value).join(" / ") || m.title;
  return {
    name: m.product.title,
    id: m.id,
    price: m.price?.amount,
    brand: BRAND,
    category: CATEGORY,
    variant,
    quantity: line.quantity,
  };
}

function cartProducts(cart: Cart): SAProduct[] {
  return cart.lines.edges.map(({ node }) => lineProduct(node));
}

// ---------------------------------------------------------------------------
// Public event API
// ---------------------------------------------------------------------------

/** A page/route view. Rides along on the idle preload (doesn't force a load). */
export function saPageView(): void {
  saTrack("page_view", { actionField: {} }, false);
}

/** The shopper is viewing the product (the /products PDP). */
export function saProductDetail(v: DisplayVariant): void {
  saTrack("productDetail", {
    actionField: { list: "Product Page" },
    products: [variantProduct(v)],
  });
}

/** The shopper selected a different variant card on the PDP. */
export function saProductClick(v: DisplayVariant, position?: number): void {
  saTrack("productClick", {
    actionField: { list: "Product Page — Variants" },
    products: [
      position != null
        ? { ...variantProduct(v), position }
        : variantProduct(v),
    ],
  });
}

/** The shopper added a variant to the cart. */
export function saAddToCart(v: DisplayVariant, quantity: number): void {
  saTrack("addToCart", {
    currencyCode: CURRENCY,
    actionField: { id: v.productId },
    products: [variantProduct(v, quantity)],
  });
}

/** The shopper initiated checkout (covers Buy Now, "Get it now", and cart). */
export function saCheckout(cart: Cart): void {
  saTrack("checkout", {
    currencyCode: CURRENCY,
    actionField: { step: 1 },
    products: cartProducts(cart),
  });
}

// Deduped so a repeated completion path (finalize / crash-recovery / retry)
// can't double-count a purchase in one session — mirrors trackPurchase.
const firedPurchases = new Set<string>();

/**
 * The order completed. Fire alongside GA/Meta's trackPurchase (where the amount
 * is known). `cart` is optional — the recovery/retry paths only have the order,
 * so `products` is omitted there; the transaction fields still fire.
 */
export function saPurchase(order: CompleteCheckoutResponse, cart?: Cart): void {
  if (!order?.order_id || firedPurchases.has(order.order_id)) return;
  firedPurchases.add(order.order_id);

  // total_amount / shipping_fee are paise (integers); total_tax is a paise
  // string. SaleAssist wants human amounts, so convert to rupees.
  const toRupees = (paise: number | string | undefined) =>
    String(Number(paise ?? 0) / 100);

  saTrack("purchase", {
    actionField: {
      id: order.order_id,
      affiliation: "Optimist Online Store",
      revenue: toRupees(order.total_amount),
      tax: toRupees(order.total_tax),
      shipping: toRupees(order.shipping_fee),
      coupon: order.promotions?.[0]?.code ?? "",
    },
    products: cart ? cartProducts(cart) : [],
  });
}
