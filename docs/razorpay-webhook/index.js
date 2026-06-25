"use strict";

/**
 * Razorpay Magic Checkout — server-side "Complete" backstop (AWS Lambda).
 *
 * WHY THIS EXISTS
 * The Shopify order is created only when Razorpay's Complete API is called. The
 * storefront calls it from the browser after payment, but if the browser dies
 * between "payment captured" and that call, money is captured with no Shopify
 * order. This webhook calls Complete independently and is the authoritative
 * guarantee that every captured payment becomes a Shopify order.
 *
 * Complete is idempotent server-side, so it's safe even when the browser already
 * completed the order (the common case) — this just covers the gap.
 *
 * DEPLOY: behind API Gateway as POST /razorpay/webhook (Lambda proxy / HTTP
 * API). Subscribe the Razorpay webhook to `payment.captured` and `order.paid`.
 * See README.md.
 *
 * ENV:
 *   RZP_KEY_ID          public key id (rzp_live_… / rzp_test_…)
 *   RZP_WEBHOOK_SECRET  the signing secret you set on the Razorpay webhook
 *   RZP_API_BASE        optional, defaults to https://api.razorpay.com
 *
 * NOTE: the Razorpay Key *Secret* is NOT needed — Complete authenticates with
 * key_id only, and signature verification uses the webhook secret.
 */

const crypto = require("crypto");

const API_BASE = (
  process.env.RZP_API_BASE || "https://api.razorpay.com"
).replace(/\/$/, "");

function lowerHeaders(headers = {}) {
  const out = {};
  for (const [k, v] of Object.entries(headers)) out[k.toLowerCase()] = v;
  return out;
}

function rawBodyOf(event) {
  if (!event || event.body == null) return "";
  return event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;
}

function verifySignature(rawBody, signature, secret) {
  if (!signature || !secret) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Pull the payment id + razorpay order id out of any supported event shape. */
function extractIds(body) {
  const payment = body?.payload?.payment?.entity;
  const order = body?.payload?.order?.entity;
  const razorpay_payment_id = payment?.id || null;
  const razorpay_order_id = payment?.order_id || order?.id || null;
  return { razorpay_payment_id, razorpay_order_id };
}

async function completeCheckout(paymentId, orderId) {
  const url = `${API_BASE}/v1/1cc/shopify/complete?key_id=${encodeURIComponent(
    process.env.RZP_KEY_ID,
  )}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      razorpay_payment_id: paymentId,
      razorpay_order_id: orderId,
    }),
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

const reply = (statusCode, msg) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: msg }),
});

exports.handler = async (event) => {
  if (!process.env.RZP_KEY_ID || !process.env.RZP_WEBHOOK_SECRET) {
    console.error(
      "razorpay-webhook: missing RZP_KEY_ID / RZP_WEBHOOK_SECRET env",
    );
    return reply(500, "not configured");
  }

  const headers = lowerHeaders(event.headers);
  const rawBody = rawBodyOf(event);
  const signature = headers["x-razorpay-signature"];

  if (!verifySignature(rawBody, signature, process.env.RZP_WEBHOOK_SECRET)) {
    console.warn("razorpay-webhook: bad signature");
    return reply(401, "invalid signature");
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return reply(400, "invalid json");
  }

  const eventName = body?.event;
  // Only act on the success events. Ack everything else so Razorpay stops.
  if (eventName !== "payment.captured" && eventName !== "order.paid") {
    return reply(200, `ignored ${eventName || "unknown"}`);
  }

  const { razorpay_payment_id, razorpay_order_id } = extractIds(body);
  if (!razorpay_payment_id || !razorpay_order_id) {
    console.error(
      "razorpay-webhook: missing ids on",
      eventName,
      JSON.stringify(body?.payload || {}),
    );
    return reply(200, "missing ids");
  }

  try {
    const result = await completeCheckout(
      razorpay_payment_id,
      razorpay_order_id,
    );

    if (result.status >= 200 && result.status < 300) {
      console.log(
        `razorpay-webhook: completed order for payment ${razorpay_payment_id}`,
      );
      return reply(200, "completed");
    }

    // 4xx: typically "already completed" (browser beat us to it) or a permanent
    // rejection. Don't make Razorpay retry forever — log loudly for review.
    if (result.status >= 400 && result.status < 500) {
      console.warn(
        `razorpay-webhook: complete returned ${result.status} for payment ${razorpay_payment_id} — ${result.body}`,
      );
      return reply(200, "acknowledged (no-op or already completed)");
    }

    // 5xx: transient — return non-2xx so Razorpay retries the webhook later.
    console.error(
      `razorpay-webhook: complete failed ${result.status} for payment ${razorpay_payment_id} — ${result.body}`,
    );
    return reply(502, "complete failed, will retry");
  } catch (err) {
    console.error("razorpay-webhook: network error calling complete", err);
    return reply(502, "network error, will retry");
  }
};
