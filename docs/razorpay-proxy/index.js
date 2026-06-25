"use strict";

/**
 * Razorpay Magic Checkout — CORS proxy (AWS Lambda).
 *
 * The browser cannot call api.razorpay.com directly: a preflight to the Magic
 * Checkout endpoints returns 404 with no Access-Control-Allow-Origin, so the
 * storefront's Steps 1/2/5 are routed through this proxy. It answers CORS
 * preflights, injects the public key_id from env, and forwards the request to
 * Razorpay server-side.
 *
 * The storefront sets NEXT_PUBLIC_RAZORPAY_PROXY_URL to this Lambda's base URL,
 * e.g. https://<api-id>.execute-api.<region>.amazonaws.com/rzp — then it fetches
 * `${base}/v1/magic/checkout/shopify?key_id=…` etc.
 *
 * Safe by design: only the three known Magic Checkout paths are forwarded (not
 * an open relay), the caller's origin is checked against an allowlist, and the
 * key_id is taken from env (the client's query value is ignored).
 *
 * DEPLOY: API Gateway route `ANY /rzp/{proxy+}` → this Lambda (proxy
 * integration). Keep it on a DIFFERENT prefix than the webhook (which uses
 * /razorpay/webhook) so the greedy path doesn't swallow it. See README.md.
 *
 * ENV:
 *   RZP_KEY_ID        public key id (rzp_live_… / rzp_test_…)
 *   ALLOWED_ORIGINS   optional CSV of allowed origins (defaults below)
 */

const RZP_API = "https://api.razorpay.com";

const ALLOWED_PATHS = new Set([
  "/v1/magic/checkout/shopify",
  "/v1/magic/order/shopify",
  "/v1/1cc/shopify/complete",
]);

const DEFAULT_ORIGINS = [
  "https://optimist.in",
  "https://www.optimist.in",
  "https://shop.optimist.in",
  "http://localhost:3000",
  "http://localhost:3001",
];

const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
    : DEFAULT_ORIGINS
).filter(Boolean);

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Accept",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

// Extract the /v1/... suffix regardless of the stage/prefix in front of it.
function magicPath(event) {
  const raw =
    event.rawPath || event.requestContext?.http?.path || event.path || "";
  const i = raw.indexOf("/v1/");
  return i >= 0 ? raw.slice(i) : raw;
}

const lower = (h = {}) =>
  Object.fromEntries(Object.entries(h).map(([k, v]) => [k.toLowerCase(), v]));

function json(statusCode, origin, obj) {
  return {
    statusCode,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  };
}

exports.handler = async (event) => {
  const headers = lower(event.headers);
  const origin = headers.origin || "";
  const method =
    event.requestContext?.http?.method || event.httpMethod || "POST";

  if (method === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(origin), body: "" };
  }
  if (!process.env.RZP_KEY_ID) {
    return json(500, origin, { error: "proxy not configured" });
  }

  const path = magicPath(event);
  if (method !== "POST" || !ALLOWED_PATHS.has(path)) {
    return json(404, origin, { error: "not found" });
  }

  const body = event.isBase64Encoded
    ? Buffer.from(event.body || "", "base64").toString("utf8")
    : event.body || "";

  const target = `${RZP_API}${path}?key_id=${encodeURIComponent(
    process.env.RZP_KEY_ID,
  )}`;

  try {
    const res = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    });
    const text = await res.text();
    return {
      statusCode: res.status,
      headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
      body: text,
    };
  } catch (err) {
    console.error("razorpay-proxy: upstream error", err);
    return json(502, origin, { error: "upstream error" });
  }
};
