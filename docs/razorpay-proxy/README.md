# Razorpay Magic Checkout — CORS proxy (Lambda)

The storefront is a static export that calls Razorpay's Magic Checkout endpoints
(Steps 1/2/5) from the browser. `api.razorpay.com` does **not** send CORS
headers for these endpoints (a preflight returns `404` with no
`Access-Control-Allow-Origin`), so the browser blocks direct calls. This Lambda
sits in between: it answers the CORS preflight and forwards the request to
Razorpay server-side.

## What it does

- Answers `OPTIONS` preflight with the right CORS headers.
- Forwards **only** these three paths (not an open relay):
  - `POST /v1/magic/checkout/shopify`
  - `POST /v1/magic/order/shopify`
  - `POST /v1/1cc/shopify/complete`
- Injects `key_id` from the `RZP_KEY_ID` env var (the client's query value is
  ignored, so no one can substitute another merchant's key).
- Restricts `Access-Control-Allow-Origin` to an allowlist.

## Deploy

1. Create a Node 20+ Lambda from `index.js` (no dependencies — uses the runtime
   global `fetch`).
2. Set env vars:
   - `RZP_KEY_ID` = your public key id (`rzp_live_…` / `rzp_test_…`)
   - `ALLOWED_ORIGINS` (optional) = CSV of allowed origins. Defaults include
     `https://www.optimist.in`, `https://optimist.in`, `localhost:3000/3001`.
3. API Gateway (HTTP API): route `ANY /rzp/{proxy+}` → this Lambda (proxy
   integration). Use a prefix (`/rzp`) distinct from the webhook (`/razorpay`).
4. Set the storefront build env:
   - `NEXT_PUBLIC_RAZORPAY_PROXY_URL = https://<api-id>.execute-api.<region>.amazonaws.com/rzp`
   (the frontend appends `/v1/...` itself).

## Verify

```bash
# Preflight should return 204 with Access-Control-Allow-Origin
curl -i -X OPTIONS "$PROXY/v1/magic/order/shopify" \
  -H "Origin: https://www.optimist.in" \
  -H "Access-Control-Request-Method: POST"
```

## Local dev

You don't need this Lambda locally — run `node scripts/dev-razorpay-proxy.mjs`
(listens on `http://localhost:8787`) and point `NEXT_PUBLIC_RAZORPAY_PROXY_URL`
at it (already set in `.env.local`).
