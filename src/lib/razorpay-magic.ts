// Razorpay Magic Checkout — Shopify custom-frontend integration.
//
// Three server-style calls, all authenticated only by the PUBLIC `key_id`
// (no secret), so they run client-side from this static export:
//   Step 1  POST /v1/magic/checkout/shopify   → shopify_checkout_id
//   Step 2  POST /v1/magic/order/shopify      → order_id (for the SDK modal)
//   Step 5  POST /v1/1cc/shopify/complete     → creates the Shopify order
//
// Razorpay derives the order amount from the Shopify cart (via the checkout id),
// so the client never sends or controls the price. A server-side webhook
// (docs/razorpay-webhook) calls Complete independently and is the authoritative
// guarantee that a captured payment becomes a Shopify order.

import type { Cart } from "./shopify";

export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";

// Browser→api.razorpay.com is CORS-blocked (preflight returns 404 with no
// Access-Control-Allow-Origin), so Steps 1/2/5 MUST be routed through a proxy
// that mirrors these paths (docs/razorpay-proxy). Point NEXT_PUBLIC_RAZORPAY_PROXY_URL
// at that proxy's base URL.
//
// NOTE: use `||` (not `??`). Next inlines an unset public env var as an EMPTY
// STRING, which `??` would keep — producing a relative URL that hits our own
// origin. `||` correctly falls through to the absolute default.
const API_BASE = (
  (process.env.NEXT_PUBLIC_RAZORPAY_PROXY_URL || "").trim() ||
  "https://api.razorpay.com"
).replace(/\/$/, "");

export type CheckoutStep = "checkout" | "order" | "complete";

export class MagicCheckoutError extends Error {
  step: CheckoutStep;
  status?: number;
  constructor(message: string, step: CheckoutStep, status?: number) {
    super(message);
    this.name = "MagicCheckoutError";
    this.step = step;
    this.status = status;
  }
}

// -----------------------------------------------------------------------------
// Response shapes (per the integration doc)
// -----------------------------------------------------------------------------

export interface CreateCheckoutResponse {
  shopify_checkout_id: string;
  tax_details?: { total_tax: number; taxes_included: boolean };
}

export interface CreateOrderResponse {
  order_id: string;
  preferences?: unknown;
}

export interface CompleteCheckoutResponse {
  id: number;
  order_id: string; // e.g. "#32697"
  payment_id: string;
  payment_method: string;
  payment_currency: string;
  total_amount: number; // in paise
  total_tax: string;
  shipping_fee: number;
  cod_fee: number;
  promotions?: {
    reference_id: string;
    code: string;
    type: string;
    value: number;
    source: string;
  }[];
  shipping_country?: string;
  customer_details?: {
    email: string;
    contact: string;
    shipping_address?: Record<string, string>;
  };
  order_status_url: string;
  is_new_customer?: boolean;
}

export interface MagicCheckoutItem {
  id: number | string;
  quantity: number;
  product_id: number | string;
  variant_id: number | string;
  properties: Record<string, string>;
}

// -----------------------------------------------------------------------------
// Pure transforms (Shopify Storefront cart → Magic Checkout payload)
// -----------------------------------------------------------------------------

/**
 * Storefront cart id is `gid://shopify/Cart/<token>?key=<key>`. Magic Checkout
 * wants the token WITH the `?key=` suffix but WITHOUT the gid prefix.
 */
export function cartTokenFromId(cartId: string): string {
  return cartId.replace(/^gid:\/\/shopify\/Cart\//, "");
}

/** Numeric id from a Shopify gid, e.g. `gid://shopify/ProductVariant/123` → 123. */
function numericId(gid: string): number | string {
  const last = (gid.split("/").pop() ?? "").split("?")[0];
  const n = Number(last);
  return last !== "" && Number.isFinite(n) ? n : last;
}

export function cartLinesToMagicItems(cart: Cart): MagicCheckoutItem[] {
  return cart.lines.edges.map(({ node }) => {
    const variantId = numericId(node.merchandise.id);
    return {
      // Shopify cart.js convention: the item `id` is the variant id.
      id: variantId,
      quantity: node.quantity,
      product_id: numericId(node.merchandise.product.id),
      variant_id: variantId,
      properties: Object.fromEntries(
        node.merchandise.selectedOptions.map((o) => [o.name, o.value]),
      ),
    };
  });
}

/** Shopify cart attributes are `[{key,value}]`; Magic Checkout wants an object. */
export function attributesToObject(
  attributes?: { key: string; value: string }[],
): Record<string, string> {
  if (!attributes?.length) return {};
  return Object.fromEntries(attributes.map((a) => [a.key, a.value]));
}

// -----------------------------------------------------------------------------
// Low-level fetch
// -----------------------------------------------------------------------------

async function razorpayPost<T>(
  path: string,
  body: unknown,
  step: CheckoutStep,
): Promise<T> {
  if (!RAZORPAY_KEY_ID) {
    throw new MagicCheckoutError("Razorpay key is not configured", step);
  }

  const url = `${API_BASE}${path}?key_id=${encodeURIComponent(RAZORPAY_KEY_ID)}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new MagicCheckoutError("Network error while reaching Razorpay", step);
  }

  const data = (await response.json().catch(() => null)) as
    | (T & { error?: { description?: string } })
    | null;

  if (!response.ok) {
    const message =
      data?.error?.description ?? `Razorpay request failed (${response.status})`;
    throw new MagicCheckoutError(message, step, response.status);
  }
  if (!data) {
    throw new MagicCheckoutError("Empty response from Razorpay", step);
  }
  return data;
}

// -----------------------------------------------------------------------------
// Steps
// -----------------------------------------------------------------------------

/** Step 1 — create the Magic Checkout id from the Shopify cart. */
export function createMagicCheckoutId(
  cart: Cart,
  options: {
    attributes?: { key: string; value: string }[];
    note?: string | null;
  } = {},
): Promise<CreateCheckoutResponse> {
  const items = cartLinesToMagicItems(cart);
  const body = {
    cart: {
      token: cartTokenFromId(cart.id),
      note: options.note ?? null,
      attributes: attributesToObject(options.attributes),
      item_count: items.reduce((n, i) => n + i.quantity, 0),
      items,
    },
  };
  return razorpayPost<CreateCheckoutResponse>(
    "/v1/magic/checkout/shopify",
    body,
    "checkout",
  );
}

/** Step 2 — create the Razorpay order id required by the SDK modal. */
export function createMagicOrder(
  shopifyCheckoutId: string,
  analytics: Record<string, unknown> = {},
): Promise<CreateOrderResponse> {
  const body = { shopify_checkout_id: shopifyCheckoutId, ...analytics };
  return razorpayPost<CreateOrderResponse>(
    "/v1/magic/order/shopify",
    body,
    "order",
  );
}

/** Step 5 — after payment, create the order in Shopify. Idempotent server-side. */
export function completeMagicCheckout(
  razorpayPaymentId: string,
  razorpayOrderId: string,
): Promise<CompleteCheckoutResponse> {
  return razorpayPost<CompleteCheckoutResponse>(
    "/v1/1cc/shopify/complete",
    {
      razorpay_payment_id: razorpayPaymentId,
      razorpay_order_id: razorpayOrderId,
    },
    "complete",
  );
}

/** Complete with bounded retry/backoff (the webhook is the ultimate backstop). */
export async function completeMagicCheckoutWithRetry(
  razorpayPaymentId: string,
  razorpayOrderId: string,
  attempts = 3,
): Promise<CompleteCheckoutResponse> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await completeMagicCheckout(razorpayPaymentId, razorpayOrderId);
    } catch (err) {
      lastError = err;
      // 4xx (other than 429) won't fix themselves — stop early.
      const status = err instanceof MagicCheckoutError ? err.status : undefined;
      if (status && status >= 400 && status < 500 && status !== 429) break;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 800 * (i + 1)));
      }
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new MagicCheckoutError("Failed to complete checkout", "complete");
}
