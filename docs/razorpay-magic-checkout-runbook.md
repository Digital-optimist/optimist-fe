# Razorpay Magic Checkout — go-live runbook

This storefront checks out via **Razorpay Magic Checkout** (Shopify-merchant /
custom-frontend integration). Orders still land in Shopify admin; invoicing
(Unicommerce / GST) is unchanged. This doc is everything needed to take it live.

## ✅ As-deployed (2026-06-24, account 836347236601, ap-south-1)

Proxy + webhook run behind **API Gateway HTTP API `vytsjfjfb8`** (NOT Lambda
Function URLs — this org blocks anonymous Function-URL invoke; API Gateway
invokes Lambda via a service principal, so it works).

- Proxy base (in `buildspec.yml` as `NEXT_PUBLIC_RAZORPAY_PROXY_URL`):
  `https://vytsjfjfb8.execute-api.ap-south-1.amazonaws.com`
- Webhook URL (for the Razorpay dashboard):
  `https://vytsjfjfb8.execute-api.ap-south-1.amazonaws.com/razorpay/webhook`
- Routes: `ANY /v1/{proxy+}` → `razorpay-magic-proxy`; `POST /razorpay/webhook` → `razorpay-magic-webhook`.
- Verified: proxy OPTIONS → 204 + CORS and forwards to Razorpay; webhook unsigned POST → 401.

Recreate/extend with `scripts/deploy-razorpay-lambdas.sh` (creates the Lambdas)
then the API Gateway block in `docs/razorpay-deployment-guide.md`.

## Architecture recap

```
Shopify cart ─▶ Step1 /v1/magic/checkout/shopify ─▶ shopify_checkout_id
            ─▶ Step2 /v1/magic/order/shopify      ─▶ order_id
            ─▶ Magic Checkout modal (order_id)    ─▶ payment captured
            ─▶ Step5 /v1/1cc/shopify/complete     ─▶ Shopify order created
```

- All three API calls authenticate with the **public `key_id` only** (no
  secret), so they run client-side. Razorpay derives the amount from the Shopify
  cart — the client never sends price.
- Code map: `src/lib/razorpay-magic.ts` (Steps 1/2/5), `src/contexts/MagicCheckoutContext.tsx`
  (orchestration + overlays + crash recovery), `src/lib/loadRazorpay.ts` (SDK),
  `src/lib/pendingOrder.ts` (recovery storage), `src/lib/analytics.ts`
  (`getCheckoutAnalytics` for Step 2), `src/app/order-confirmation/page.tsx`.

## Two non-negotiable backend pieces

### 1. CORS proxy (REQUIRED — checkout is broken without it)

`api.razorpay.com` sends no CORS headers for the Magic Checkout endpoints
(verified: preflight returns `404`, no `Access-Control-Allow-Origin`). The
browser blocks direct calls, so Steps 1/2/5 route through a proxy.

- Deploy `docs/razorpay-proxy/` (see its README). API Gateway `ANY /rzp/{proxy+}`.
- Set `NEXT_PUBLIC_RAZORPAY_PROXY_URL` to its base URL (in `buildspec.yml` for
  prod; `.env.local` already points dev at `http://localhost:8787`).

### 2. Complete-backstop webhook (REQUIRED for reliability)

The Shopify order exists only once **Complete** runs. The browser calls it after
payment, but if it dies in between, money is captured with no order. The webhook
calls Complete server-side as the guarantee.

- Deploy `docs/razorpay-webhook/` (see its README). API Gateway `POST /razorpay/webhook`.
- Razorpay Dashboard → Settings → Webhooks: add the URL, set a secret (== the
  Lambda's `RZP_WEBHOOK_SECRET`), subscribe **`payment.captured`** + **`order.paid`**.

## Go-live checklist

- [ ] **Rotate the Razorpay key pair.** The previous live secret was shared, so
      rotate key_id + secret in the Dashboard before launch. Only the **public
      key_id** is used by the storefront/Lambdas; the secret is never needed by
      this code (Complete uses key_id; the webhook uses the webhook secret).
- [ ] Deploy the **proxy** Lambda; set `RZP_KEY_ID` (+ optional `ALLOWED_ORIGINS`).
- [ ] Deploy the **webhook** Lambda; set `RZP_KEY_ID` + `RZP_WEBHOOK_SECRET`.
- [ ] Subscribe the webhook to `payment.captured` + `order.paid` with the matching secret.
- [ ] Set `NEXT_PUBLIC_RAZORPAY_KEY_ID` (rotated) + `NEXT_PUBLIC_RAZORPAY_PROXY_URL`
      (proxy base URL) in `buildspec.yml`. Prefer SSM Parameter Store over inline.
- [ ] Upload serviceability: run `node scripts/export-serviceable-pincodes.mjs`
      and upload `docs/razorpay-serviceable-pincodes.csv` in Dashboard → Magic
      Checkout → Serviceability. (Adapt columns to Razorpay's template if needed;
      the `pincode` column is the one that matters.)
- [ ] Enable Magic Checkout for the Shopify store in the Razorpay Dashboard.
- [ ] Deploy the storefront (`yarn build` → S3/CloudFront via `buildspec.yml`).

## Live-order test (do this before announcing)

1. With a **test-mode** key first: add to cart → Buy Now → enter a serviceable
   pincode → modal opens → pay with a Razorpay test card.
2. Confirm you land on `/order-confirmation/` with order id + amount + a working
   "Track your order" link.
3. In Shopify admin, confirm the order exists.
4. For a **business** purchase: verify a GSTIN on the PDP, then check out, and
   confirm the Shopify order's **Additional details / note_attributes** include
   `Business Purchase`, `GSTIN`, `Billing *` (this is what drives invoicing).
5. Confirm the order fires **invoicing** as expected (Unicommerce / GST).
6. Switch to the **live** key and repeat once with a real low-value order.

## Edge cases already handled in code

- **Browser dies after payment, before Complete** → webhook completes it; the
  client also retries on next load (`pendingOrder` + on-mount recovery).
- **Complete fails after retries** → full-screen "Payment received, finalizing"
  with a manual retry + payment-id reference (never a blank charged screen).
- **Payment failed** → Magic Checkout shows its retry UI; we log and let
  `ondismiss` reset state if the shopper gives up.
- **SDK fails to load** → 12s timeout → error toast, no hang.
- **Double-submit** → in-flight guard; **dismiss-after-success race** → guarded.
- **Coupons** → a claimed coupon (lead-capture `EXTRACOOL5`) auto-applies via
  `prefill.coupon_code`; the coupon widget stays open for manual entry.

## Rollback

Revert the commit(s) on this branch (re-adds the Shopflo bridge `<Script>` in
`src/app/layout.tsx` and restores `cart.checkoutUrl` redirects). No data
migration is involved — carts and orders are unaffected.
