# Razorpay Magic Checkout — Complete backstop webhook (Lambda)

The Shopify order is created only when Razorpay's **Complete** API
(`/v1/1cc/shopify/complete`) is called. The storefront calls it from the browser
right after payment, but a browser can die between "payment captured" and that
call — which would capture money with no Shopify order.

This webhook is the **authoritative guarantee**: Razorpay calls it server-side on
`payment.captured` / `order.paid`, and it runs Complete independently. Complete
is idempotent, so it's harmless when the browser already completed the order.

## Deploy

1. Create a Node 20+ Lambda from `index.js` (no dependencies — uses the runtime
   global `fetch` + built-in `crypto`).
2. Set env vars:
   - `RZP_KEY_ID` = public key id (`rzp_live_…` / `rzp_test_…`)
   - `RZP_WEBHOOK_SECRET` = the signing secret you set on the webhook (below)
3. API Gateway (HTTP API): route `POST /razorpay/webhook` → this Lambda.
4. In the Razorpay Dashboard → **Settings → Webhooks → Add New Webhook**:
   - URL: `https://<api-id>.execute-api.<region>.amazonaws.com/razorpay/webhook`
   - Secret: a strong random string — set the **same** value as
     `RZP_WEBHOOK_SECRET`.
   - Active events: **`payment.captured`** and **`order.paid`**.

## Security

- Verifies the `X-Razorpay-Signature` header (HMAC-SHA256 over the raw body with
  the webhook secret) using a constant-time compare before doing anything.
- Requests with a missing/incorrect signature get `401` and are ignored.

## Response semantics (so Razorpay retries correctly)

- `2xx` — Complete succeeded → `200`.
- Complete returned `4xx` (already completed / permanent) → `200` (ack, no retry).
- Complete returned `5xx` or network error → `502` (Razorpay retries later).
