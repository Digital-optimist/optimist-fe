# Razorpay Magic Checkout — full deployment guide (AWS + Razorpay)

Click-by-click for everything you must do by hand. The code is done; this is the
infra + dashboard work. Companion to `razorpay-magic-checkout-runbook.md` (the
short checklist).

**Do the phases in order — each produces a value the next needs.**

| Value | From | Used in |
|---|---|---|
| `key_id` (rzp_live_…) | Phase 1 | both Lambdas, buildspec |
| Proxy URL | Phase 3 | buildspec `NEXT_PUBLIC_RAZORPAY_PROXY_URL` |
| Webhook URL | Phase 3 | Razorpay webhook (Phase 4) |
| Webhook secret | Phase 3 | webhook Lambda env **and** Razorpay webhook (must match) |

---

## Phase 0 — Prerequisites

1. **Magic Checkout enabled** on the Razorpay account — ask your Razorpay account
   manager if it isn't (not self-serve).
2. **Razorpay ⇄ Shopify connected** for store `octolife-3` (the integration needs
   the platform to be Shopify behind the custom frontend).
3. **AWS access** to the account that hosts your existing Lambdas
   (`mg1up8l9ee.execute-api…`), with permission to create Lambdas + IAM use.
4. Tools on your machine: `aws` CLI v2 (`aws configure` done), `zip`, `openssl`.

---

## Phase 1 — Rotate the Razorpay key pair

1. Sign in to **dashboard.razorpay.com**.
2. Toggle to **Live Mode** (top-left/top-right mode switch).
3. **Account & Settings** (gear icon) → **API Keys** (under "Website and app settings").
4. Click **Regenerate Live Key** → confirm.
5. A dialog shows **Key Id** and **Key Secret**. Click **Download Key Details**
   and store both in your password manager. (Our code uses only the public Key
   Id; the secret is never used by the frontend/Lambdas, but rotate to kill the
   previously-shared one.)
6. ⚠️ Before regenerating, confirm no other live integration uses the old keys —
   regeneration deactivates them.

➡️ You now have **`key_id`** (rzp_live_…).

---

## Phase 2 — Pick / create a Lambda execution role

If you already have a basic Lambda role (you do — the GST/invoice Lambdas use
one), reuse its ARN and skip to Phase 3. Otherwise:

1. AWS Console → **IAM** → **Roles** → **Create role**.
2. Trusted entity: **AWS service** → **Lambda** → **Next**.
3. Attach policy: **AWSLambdaBasicExecutionRole** → **Next**.
4. Name: `optimist-lambda-exec` → **Create role**.
5. Open the role, copy its **ARN** (`arn:aws:iam::<acct-id>:role/optimist-lambda-exec`).

➡️ You now have **`LAMBDA_ROLE_ARN`**.

---

## Phase 3 — Deploy both Lambdas

Two ways. **Option A (script)** is fastest and re-runnable. **Option B (console)**
is full click-by-click if you prefer the UI.

First generate a webhook secret and keep it:
```bash
openssl rand -hex 32        # copy the output → this is RZP_WEBHOOK_SECRET
```

### Option A — one script (recommended)
```bash
cd /path/to/optimist-fe
chmod +x scripts/deploy-razorpay-lambdas.sh

AWS_REGION=ap-south-1 \
LAMBDA_ROLE_ARN=arn:aws:iam::<acct-id>:role/optimist-lambda-exec \
RZP_KEY_ID=rzp_live_YOUR_KEY \
RZP_WEBHOOK_SECRET=YOUR_GENERATED_SECRET \
./scripts/deploy-razorpay-lambdas.sh
```
It creates (or updates) `razorpay-magic-proxy` and `razorpay-magic-webhook`,
gives each a public Function URL, and prints the **Proxy URL** + **Webhook URL**.
Skip to Phase 4.

### Option B — AWS Console, the proxy Lambda
1. **Lambda** → **Create function** → **Author from scratch**.
2. Function name: `razorpay-magic-proxy`. Runtime: **Node.js 20.x**. Architecture:
   default. Permissions → **Use an existing role** → `optimist-lambda-exec`.
   **Create function**.
3. **Code** tab → open `index.js` in the editor, delete its contents, and paste
   the full contents of `docs/razorpay-proxy/index.js` from this repo → **Deploy**.
4. **Configuration → General configuration → Edit** → Timeout **15s** → **Save**.
5. **Configuration → Environment variables → Edit → Add**:
   - `RZP_KEY_ID` = `rzp_live_YOUR_KEY`
   - *(optional)* `ALLOWED_ORIGINS` = `https://www.optimist.in,https://optimist.in`
   → **Save**.
6. **Configuration → Function URL → Create function URL**:
   - Auth type: **NONE**
   - **Do NOT enable the "Configure cross-origin resource sharing (CORS)" box** —
     the function returns CORS headers itself; enabling it here causes duplicate
     headers. → **Save**.
7. Copy the **Function URL** (e.g. `https://abc.lambda-url.ap-south-1.on.aws/`).
   Drop the trailing slash → this is your **Proxy URL**.

### Option B — AWS Console, the webhook Lambda
Repeat the steps above with:
- Function name: `razorpay-magic-webhook`
- Paste `docs/razorpay-webhook/index.js`
- Env vars: `RZP_KEY_ID` = your key, **and** `RZP_WEBHOOK_SECRET` = the secret you
  generated with `openssl`.
- Create a Function URL (Auth **NONE**, no CORS box). Copy it → this is your
  **Webhook URL**.

### Verify the proxy (either option)
```bash
curl -i -X OPTIONS "<PROXY_URL>/v1/magic/order/shopify" \
  -H "Origin: https://www.optimist.in" \
  -H "Access-Control-Request-Method: POST"
```
Expect **`HTTP/1.1 204`** with an **`access-control-allow-origin`** header. If you
get that, CORS is solved.

---

## Phase 4 — Razorpay Dashboard configuration

### 4a. Webhook
1. Dashboard (Live Mode) → **Account & Settings** → **Webhooks** → **Add New Webhook**.
2. **Webhook URL** = your **Webhook URL** from Phase 3.
3. **Secret** = the **RZP_WEBHOOK_SECRET** you set on the webhook Lambda (must be
   byte-for-byte identical).
4. **Active Events** → tick **`payment.captured`** and **`order.paid`**.
5. **Create Webhook**. Use the **"Send test webhook"** action — the Lambda should
   return 2xx (check CloudWatch logs).

### 4b. Serviceability (delivery pincodes)
1. Regenerate the CSV if needed: `node scripts/export-serviceable-pincodes.mjs`
   → produces `docs/razorpay-serviceable-pincodes.csv` (468 pincodes).
2. Dashboard → **Magic Checkout** → **Serviceability** (or **Shipping & Serviceability**)
   → **Upload**/import the CSV. If Razorpay's template expects different columns,
   map the **pincode** column (city/zone are extra context).

### 4c. Branding & COD
1. **Magic Checkout → Settings**: upload your **logo**, set the **theme color**
   (the storefront also sends `theme.color = #0A0A0A`).
2. If you want **Cash on Delivery**: enable COD here and set any COD rules. COD
   orders fire `order.paid` (not `payment.captured`) — the webhook already handles
   both, so they'll still create the Shopify order.

### 4d. Confirm Magic Checkout is ON for the store
Magic Checkout → ensure the integration status for `octolife-3` is **enabled/live**.

---

## Phase 5 — Build & deploy the storefront

1. Edit `buildspec.yml` (placeholders are already there), or set these in CodeBuild
   project env / SSM Parameter Store:
   ```yaml
   NEXT_PUBLIC_RAZORPAY_KEY_ID: rzp_live_YOUR_KEY
   NEXT_PUBLIC_RAZORPAY_PROXY_URL: <PROXY_URL>     # no trailing slash
   ```
2. Push the branch → CodeBuild runs `yarn build` → S3 sync → CloudFront
   invalidation (existing pipeline). No other changes needed.

### Local dev (for the team)
`.env.local` already has `NEXT_PUBLIC_RAZORPAY_PROXY_URL=http://localhost:8787`.
Run the dev proxy in a second terminal:
```bash
node scripts/dev-razorpay-proxy.mjs   # then: yarn dev
```

---

## Phase 6 — Test with a TEST-mode key (before going live)

1. Set `RZP_KEY_ID` (both Lambdas) and `NEXT_PUBLIC_RAZORPAY_KEY_ID` to your
   **`rzp_test_…`** key, and switch the Razorpay dashboard to **Test Mode** for
   the webhook/test events.
2. Add to cart → **Buy Now** → enter a serviceable pincode → modal opens → pay
   with a Razorpay **test card** (e.g. `4111 1111 1111 1111`, any future expiry/CVV).
3. ✅ Land on `/order-confirmation/` with order id + amount + a working **Track
   your order** link.
4. ✅ Order appears in **Shopify admin**.
5. ✅ **Business order**: verify a GSTIN on the PDP → check out → the Shopify
   order's **Additional details / note_attributes** show `Business Purchase`,
   `GSTIN`, `Billing *` → and invoicing (Unicommerce) fires.
6. ✅ **Resilience**: pay, then immediately close the tab → within ~a minute the
   **webhook** creates the order anyway (check CloudWatch: "completed order for
   payment …").

---

## Phase 7 — Go live

1. Switch every key back to the **live** rotated `key_id` (both Lambdas +
   buildspec). Razorpay dashboard back to **Live Mode**.
2. Re-deploy the storefront.
3. Place **one real low-value order** end-to-end as a smoke test; refund it.
4. Watch the webhook Lambda's **CloudWatch logs** for the first day.

---

## Troubleshooting

- **Checkout button does nothing / "Network error" toast** → proxy not reachable
  or `NEXT_PUBLIC_RAZORPAY_PROXY_URL` wrong. Re-run the curl verify in Phase 3.
- **CORS error in browser console** → you enabled CORS on the Function URL *and*
  the Lambda sends headers (duplicate). Turn OFF Function URL CORS.
- **"Checkout is temporarily unavailable" toast** → `NEXT_PUBLIC_RAZORPAY_KEY_ID`
  is empty in the build.
- **Webhook 401 in CloudWatch** → the dashboard secret ≠ Lambda `RZP_WEBHOOK_SECRET`.
- **Paid but no Shopify order** → check the webhook fired (CloudWatch) and Complete
  returned 2xx; the on-site recovery also retries on next load.
- **note_attributes missing on order** → confirm the GSTIN was *verified* before
  checkout (only verified business details are attached in Step 1).

## Security recap — who needs which secret
- Frontend / buildspec → **key_id only** (public).
- Proxy Lambda → `RZP_KEY_ID`.
- Webhook Lambda → `RZP_KEY_ID` + `RZP_WEBHOOK_SECRET`.
- **Nobody** needs the Razorpay **Key Secret** — by design.
