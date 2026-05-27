# Buying for Business — Onboarding Guide

This document walks a new engineer through the **Buying for Business** feature end-to-end:
what the customer sees, how the frontend captures and validates business details,
how the order travels into AWS and ZohoBooks, and what each environment variable
turns on or off.

> TL;DR
> A customer who is purchasing in their company's name enters a GSTIN on the product
> or cart page. The frontend verifies it against a Surepass-backed AWS Lambda, stamps
> the verified company name + state onto the Shopify cart as custom attributes, and
> lets the customer check out normally. A backend Lambda listens to the Shopify
> order webhook, creates a Contact + Bill in ZohoBooks, and exposes the resulting
> GST invoice via a second Lambda endpoint that the order-detail page polls.

---

## 1. What the customer experiences

1. **Toggle on a product page or in the cart.**
   On any product page and inside the order summary in the cart, there is a
   "Buying for a business?" switch. See
   [BusinessPurchaseSection.tsx](src/components/products/BusinessPurchaseSection.tsx),
   embedded by [ProductsPageClient.tsx:659](src/app/products/ProductsPageClient.tsx#L659)
   and [cart/page.tsx:258](src/app/cart/page.tsx#L258).

2. **Enter GSTIN.**
   The customer types a 15-character GSTIN. The input formats characters live
   (uppercase, alphanumeric) and validates format + checksum *offline* before
   ever calling the network. See [src/lib/gstin.ts](src/lib/gstin.ts).

3. **Verify.**
   On submit, the frontend calls the GST verify endpoint and shows a result
   card with **Legal Name**, **Trade Name**, **State**, and **Status**.
   The customer can confirm or change the GSTIN.

4. **Add to Cart / Buy Now.**
   Once verified, the business details are attached to the Shopify cart as
   `customAttributes`. These travel through Shopify's hosted checkout
   unchanged. See [CartContext.tsx:68-78](src/contexts/CartContext.tsx#L68).

5. **After payment.**
   On the order-detail page under `/account/orders/order`, business orders
   display the company name + GSTIN read-only, plus a **Download GST Invoice**
   button. The button appears when the backend has finished generating the
   ZohoBooks invoice — until then the UI shows "Pending".
   See [account/orders/order/page.tsx:483-565](src/app/account/orders/order/page.tsx#L483).

---

## 2. End-to-end data flow

```
                  ┌────────────────────────────┐
                  │  Customer clicks toggle    │
                  │  enters GSTIN              │
                  └─────────────┬──────────────┘
                                │
                  ┌─────────────▼──────────────┐
                  │ src/lib/gstin.ts           │   format + checksum
                  │ validateGSTIN (offline)    │   (no network)
                  └─────────────┬──────────────┘
                                │ valid
                  ┌─────────────▼──────────────┐
                  │ src/lib/gst-verification   │   POST { gstin }
                  │ verifyGSTIN()              │──────────────────┐
                  └────────────────────────────┘                  │
                                                                  ▼
                                          ┌──────────────────────────────────┐
                                          │ AWS API Gateway → Lambda         │
                                          │ NEXT_PUBLIC_GST_VERIFY_API_URL   │
                                          │                                  │
                                          │ Lambda → Surepass API → GSTN     │
                                          └──────────────┬───────────────────┘
                                                         │ { legalName, state, … }
                  ┌──────────────────────────────────────▼─┐
                  │ CartContext.applyVerificationResult()  │   store in state +
                  │ → localStorage("optimist_business_…")  │   localStorage
                  └─────────────┬──────────────────────────┘
                                │
                  ┌─────────────▼──────────────┐
                  │ Buy Now / Add to Cart      │
                  │ buildBusinessCartAttributes│   attaches:
                  │ → Shopify cart attributes  │   Business Purchase=Yes
                  └─────────────┬──────────────┘   Company Name, GSTIN,
                                │                  Trade Name, GST State
                  ┌─────────────▼──────────────┐
                  │ Shopify hosted checkout    │
                  │ (no B2B-specific code)     │
                  └─────────────┬──────────────┘
                                │ order paid
                                ▼
                  ┌────────────────────────────────────┐
                  │ Shopify order webhook              │
                  │                                    │
                  │ → AWS Lambda                       │
                  │   1. reads custom attributes       │
                  │   2. if Business Purchase=Yes:     │
                  │      - create Zoho Contact         │
                  │        (company, GSTIN, state)     │
                  │      - create Zoho Bill / Invoice  │
                  │      - store mapping               │
                  │        shopifyOrderId → invoice    │
                  └────────────────────────────────────┘

                                │ later
                  ┌─────────────▼─────────────────────────┐
                  │ Order detail page polls               │
                  │ GET ${INVOICE_API_URL}/by-order/{id}  │
                  │                                       │
                  │ 202 → "Pending"                       │
                  │ 200 + invoiceUrl → "Download invoice" │
                  │ 404 → "Unavailable"                   │
                  └───────────────────────────────────────┘
```

---

## 3. Where AWS fits in

There are **two AWS Lambdas** (both currently fronted by the same API Gateway,
`mg1up8l9ee.execute-api.us-east-1.amazonaws.com`):

| Endpoint                  | Env var                              | Purpose                                                                              |
| ------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------ |
| `POST /gst/verify`        | `NEXT_PUBLIC_GST_VERIFY_API_URL`     | Proxies to Surepass GSTIN verification. Returns legal name, trade name, state, etc. |
| `GET /invoice/by-order/{id}` | `NEXT_PUBLIC_INVOICE_API_URL`        | Looks up the ZohoBooks invoice generated for a Shopify order ID.                     |

The Lambdas themselves are **not in this repo** — they live separately and
must be deployed for the feature to work in production.

The `NEXT_PUBLIC_S3_BUCKET_URL` variable is unrelated to this feature; it's
the base URL for static assets (3D model `.glb` files, etc.) and is *not*
used for B2B file uploads. There currently are no B2B file uploads.

---

## 4. Where ZohoBooks fits in

The frontend never talks to ZohoBooks directly. All Zoho calls happen inside
the AWS Lambda that consumes the Shopify order webhook:

1. **Read the order's custom attributes.** If `Business Purchase=Yes` is
   present, treat it as a business order.
2. **Upsert a ZohoBooks Contact.** Identified by GSTIN; address state comes
   from `GST State`.
   - Note the `cleanStateName()` helper in
     [CartContext.tsx:53](src/contexts/CartContext.tsx#L53) — it strips the
     long Surepass jurisdiction string ("State - Karnataka, Division - …")
     down to just the state name, because Zoho's `billing_address.state` field
     rejects values longer than 100 characters.
3. **Create a Bill or Invoice** linked to that Contact, with line items
   matching the Shopify order.
4. **Store the mapping** `shopifyOrderId → invoiceUrl + invoiceNumber` so
   the frontend's invoice-lookup endpoint can serve it.

---

## 5. Key files in this repo

| File                                                                                                | What it does                                                                            |
| --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [src/components/products/BusinessPurchaseSection.tsx](src/components/products/BusinessPurchaseSection.tsx) | The toggle + GSTIN form + verification status card.                                     |
| [src/contexts/CartContext.tsx](src/contexts/CartContext.tsx)                                        | `businessDetails` state, localStorage persistence, builds Shopify cart attributes.      |
| [src/lib/gstin.ts](src/lib/gstin.ts)                                                                | Offline format + checksum validation, state code → state name lookup.                   |
| [src/lib/gst-verification.ts](src/lib/gst-verification.ts)                                          | `verifyGSTIN()` — calls Lambda in prod, mock DB in dev.                                 |
| [src/lib/invoice.ts](src/lib/invoice.ts)                                                            | `getInvoiceByOrder()`, `isBusinessOrder()`, `getOrderAttribute()`.                      |
| [src/app/products/ProductsPageClient.tsx:468](src/app/products/ProductsPageClient.tsx#L468)         | Passes business attributes into the temporary "Buy Now" cart.                           |
| [src/app/cart/page.tsx:258](src/app/cart/page.tsx#L258)                                             | Renders the business section in the order summary, saves attributes before checkout.    |
| [src/app/account/orders/order/page.tsx:483](src/app/account/orders/order/page.tsx#L483)             | Shows business details + invoice download / pending state on the order-detail page.    |

The Shopify cart attribute keys are the contract between the frontend, the
order-detail UI, and the backend Lambda. **Do not rename them** without
updating all three. The canonical list is `buildBusinessCartAttributes()` in
[CartContext.tsx:68](src/contexts/CartContext.tsx#L68):

```
Business Purchase = "Yes"
Company Name      = <legal name from Surepass>
GSTIN             = <15-char GSTIN>
Trade Name        = <trade name from Surepass>
GST State         = <cleaned state name, ≤100 chars>
```

---

## 6. Environment variables

All declared in [.env.example](.env.example) (lines 48-58):

```
NEXT_PUBLIC_GST_VERIFY_API_URL=   # AWS Lambda: GSTIN → Surepass verify
NEXT_PUBLIC_INVOICE_API_URL=      # AWS Lambda: Shopify order → Zoho invoice lookup
```

Plus the usual Shopify variables, which the regular checkout flow needs:

```
NEXT_PUBLIC_SHOPIFY_DOMAIN
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
NEXT_PUBLIC_SHOPIFY_API_VERSION
```

### Behavior matrix

| `NEXT_PUBLIC_GST_VERIFY_API_URL` | `NODE_ENV`  | Result                                                                                                          |
| -------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------- |
| set                              | any         | Real Lambda → Surepass verification.                                                                            |
| unset                            | development | Mock verification — uses the hardcoded company DB in [gst-verification.ts:22](src/lib/gst-verification.ts#L22). |
| unset                            | production  | Verification disabled — user-facing message: "GST verification is temporarily unavailable."                     |

| `NEXT_PUBLIC_INVOICE_API_URL` | Result                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| set                           | Order-detail page polls Lambda; shows "Download GST Invoice" when ready.              |
| unset                         | `getInvoiceByOrder()` returns `unavailable`; order detail page shows no invoice CTA.  |

---

## 7. Testing locally

Mock mode is on by default in dev (no env var needed). Useful GSTINs:

| GSTIN              | What happens                                                              |
| ------------------ | ------------------------------------------------------------------------- |
| `29ABCDE1234F1Z5`  | Verifies as "ACME TECHNOLOGIES PRIVATE LIMITED" (Karnataka).              |
| `27AABCU9603R1ZM`  | Verifies as "RELIANCE INDUSTRIES LIMITED" (Maharashtra).                  |
| `07AAACW8569R1ZE`  | Verifies as "WIPRO LIMITED" (Delhi).                                      |
| `33AABCT1332L1ZB`  | Verifies as "TATA CONSULTANCY SERVICES LIMITED" (Tamil Nadu).             |
| `24AAACC1206D1ZM`  | Returns "This GSTIN is cancelled/inactive" — for testing error states.    |
| any other valid format | Generated as a plausible "MOCK BUSINESS …" record using the state code. |

End-to-end test flow:

1. `yarn dev`
2. Visit any product page.
3. Toggle "Buying for a business?" on, paste one of the GSTINs above, click Verify.
4. Click **Buy Now** (or add to cart and proceed to checkout).
5. In Shopify's test checkout, the order's `customAttributes` will contain
   `Business Purchase=Yes` and the company fields.
6. On `/account/orders/order?id=…` for that order, the business panel renders.
   Without a deployed invoice Lambda, you'll see "Invoice unavailable".

---

## 8. What is NOT implemented (yet)

- **No file uploads.** PAN / address proof / authorization letter uploads
  are not collected. If finance starts requiring these, S3 is already
  configured (`NEXT_PUBLIC_S3_BUCKET_URL`) and could host them.
- **No email logic in the frontend.** All customer/internal notifications
  are expected to be sent by Shopify (order confirmation) and the backend
  Lambda (invoice ready). Nothing in `src/` triggers email.
- **Naive invoice polling.** The order-detail page polls without exponential
  backoff or a max-attempts cap. Fine for now since responses are cheap.
- **The backing Lambdas are not in this repo.** Treat the API contract above
  as the source of truth and keep them in sync.
- **`NEXT_PUBLIC_GST_VERIFY_API_URL` and `NEXT_PUBLIC_INVOICE_API_URL` are
  empty in [.env.production](.env.production).** Set them before going live
  or the feature is silently disabled in production.

---

## 9. Quick FAQ

**Q: Where is the customer's address captured?**
Not on the B2B form. Address is collected by Shopify checkout like any
other order. The GST state from verification is stored separately and is
what the Zoho contact uses.

**Q: Why is `cleanStateName()` so defensive?**
Surepass returns long jurisdiction strings like
`"State - Karnataka, Division - DGSTO-0, Bengaluru, …"`. Zoho's
`billing_address.state` field rejects anything over 100 characters, so the
helper splits on the first comma, strips the `"State - "` prefix, and clips
to 100 chars. Don't remove it.

**Q: Can a customer go back and edit business details after verifying?**
Yes — toggling off clears `businessDetails`. Re-verifying overwrites them.
They are persisted to `localStorage` under the key
`optimist_business_details` so a refresh preserves the entry.

**Q: What if the same GSTIN is used by two different customers?**
Handled on the Zoho side — the Lambda upserts the Contact by GSTIN. The
frontend doesn't care about uniqueness.
