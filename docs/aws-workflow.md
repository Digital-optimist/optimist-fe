# How the "Buying for Business" Workflow Works

This document explains, in plain language, what happens behind the scenes when a
customer buys something for their company on our website. It is written so that
anyone — engineer or not — can follow along.

If you only read one section, read **Section 2: The story of one order**.

---

## 1. The cast of characters

There are five systems involved. Each has one job.

| System         | What it is                                                          | Its job here                                                                  |
| -------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Website**    | Our Next.js storefront (this codebase).                             | Shows the toggle, takes the GSTIN, talks to Shopify, shows the final invoice. |
| **Shopify**    | Our e-commerce backend (cart, checkout, payment, orders).           | Handles the cart, accepts payment, stores the order, sends out notifications. |
| **Surepass**   | A third-party service that knows the official GST records of India. | Tells us whether a GSTIN is real, and what company name is registered to it.  |
| **AWS**        | Amazon's cloud. We use a small piece of it called **Lambda**.       | Runs three small programs (described below) that act as the "glue."           |
| **ZohoBooks** | Our accounting software.                                            | Stores the customer as a Contact and creates a proper GST invoice for them.   |

> **What is a Lambda?**
> A Lambda is a small program that lives in the cloud and wakes up only when
> something asks it to do something. We don't run a server for it; AWS does.
> Think of it like a vending machine — it sits there idle, and when you press a
> button, it gives you exactly one thing.

---

## 2. The story of one order

Here is what happens when a customer named Priya, who runs Acme Pvt Ltd, buys a
washing machine in her company's name.

### Step 1 — Priya turns on "Buying for a business?"
On the product page she flips the toggle and types her company's GSTIN.

### Step 2 — The website checks the GSTIN
The website does two checks:

- **Quick check (offline):** Is this 15 characters long? Does the checksum
  match? This catches typos without bothering anyone.
- **Real check (online):** The website sends the GSTIN to **AWS Lambda #1**
  (the "Verify" function).

### Step 3 — Verify Lambda asks Surepass
Lambda #1 calls Surepass, which looks it up in the official GST database and
replies with the company's legal name, trade name, and state. Lambda #1 passes
that back to the website.

The website shows Priya: "Acme Technologies Private Limited, Karnataka,
Active." She confirms.

### Step 4 — Priya checks out on Shopify
She clicks **Buy Now**. The website tells Shopify: "Here's a cart, and by the
way, attach these business details to it" — company name, GSTIN, trade name,
state. Shopify takes her through its normal checkout, she pays, and the order
is recorded inside Shopify with those business details attached.

### Step 5 — Shopify tells AWS about the new order
Shopify is configured to "ping" us every time a new order is placed. That ping
goes to **AWS Lambda #2** (the "Generate Invoice" function).

### Step 6 — Generate Invoice Lambda talks to ZohoBooks
Lambda #2 reads the order and asks: "Is this a business order?" If yes, it:

1. Asks ZohoBooks: "Do we already have a Contact for GSTIN `29ABCDE1234F1Z5`?"
   - If yes, it reuses that Contact.
   - If no, it creates a new one, using the company name, GSTIN, and state.
2. Creates a proper GST invoice in ZohoBooks tied to that Contact, with the
   washing machine as a line item.
3. Stores a note for itself: "Shopify order #1234 → ZohoBooks invoice
   INV-00042 → here is the PDF link."

### Step 7 — Priya checks her account page
After payment, Priya lands on the order detail page. The page asks
**AWS Lambda #3** (the "Invoice Lookup" function): "Hey, do you have an
invoice for order #1234 yet?"

- If the answer is **not yet**, the page shows "Invoice pending — please check
  back shortly." (This is normal — generating the invoice takes a few
  seconds.)
- If the answer is **yes**, the page shows a **Download GST Invoice** button
  that opens the PDF.

That's it. Priya has her GST-compliant invoice, and our accountant has a
Contact and an invoice already filed in ZohoBooks. Nobody had to type
anything twice.

---

## 3. The three Lambdas, one line each

| #   | Name              | Triggered by                     | Talks to     | Returns                                          |
| --- | ----------------- | -------------------------------- | ------------ | ------------------------------------------------ |
| 1   | **Verify**        | Website, when user enters GSTIN. | Surepass     | "Yes, that GSTIN belongs to Acme, in Karnataka." |
| 2   | **Generate Invoice** | Shopify, when an order is placed. | ZohoBooks    | (Nothing to the website — it works in the background.) |
| 3   | **Invoice Lookup** | Website, when user opens the order page. | Its own records of what Lambda #2 created. | A link to the invoice PDF, or "not ready yet."   |

---

## 4. The whole picture

```
                        ┌──────────────────┐
                        │     CUSTOMER     │
                        │   (the browser)  │
                        └────────┬─────────┘
                                 │
                                 │ types GSTIN
                                 ▼
                        ┌──────────────────┐
                        │     WEBSITE      │
                        │   (Next.js, in   │
                        │   this codebase) │
                        └──┬──────────┬────┘
                           │          │
        ┌──────────────────┘          └────────────────────┐
        │ "Is this GSTIN real?"                            │ "Place this order"
        ▼                                                  ▼
┌────────────────┐        ┌──────────────┐        ┌───────────────────┐
│ AWS LAMBDA #1  │───────▶│   SUREPASS   │        │      SHOPIFY      │
│    "Verify"    │        │ (GST records │        │  (cart, checkout, │
│                │◀───────│    of India) │        │   payment, order) │
└────────────────┘        └──────────────┘        └─────────┬─────────┘
        ▲                                                   │
        │ company name,                                     │ "New order!"
        │ state                                             │  (webhook)
        │                                                   ▼
        │                                          ┌────────────────┐
        │                                          │ AWS LAMBDA #2  │
        │                                          │   "Generate    │
        │                                          │    Invoice"    │
        │                                          └───────┬────────┘
        │                                                  │ create contact,
        │                                                  │ create invoice
        │                                                  ▼
        │                                          ┌────────────────┐
        │                                          │   ZOHOBOOKS    │
        │                                          │  (accounting:  │
        │                                          │  contacts,     │
        │                                          │  invoices)     │
        │                                          └───────┬────────┘
        │                                                  │ invoice PDF
        │                                                  │ + number
        │                                                  ▼
        │                                          ┌────────────────┐
        │                                          │ AWS LAMBDA #3  │
        │                                          │ "Invoice       │
        │                                          │   Lookup"      │
        │                                          │ (remembers     │
        │                                          │  order → PDF)  │
        │                                          └───────┬────────┘
        │                                                  │
        │                                                  │ "here's the
        │                                                  │  invoice link"
        │                                                  ▼
        └──────────────────────────────────────── ┌────────────────┐
                                                  │     WEBSITE    │
                                                  │ (order detail  │
                                                  │   page polls)  │
                                                  └────────────────┘
```

---

## 5. Why we built it this way

A few design choices worth knowing:

- **Why use Surepass at all?**
  Anyone can type a GSTIN that *looks* valid. Surepass tells us whether it
  actually exists and is currently active, and gives us the legal company name
  straight from the GST database. This means the customer doesn't have to type
  their company name (no typos), and our invoice is always addressed to the
  legally registered entity.

- **Why call Surepass through AWS instead of directly from the website?**
  Surepass requires an API key. If we put the key in the website (which runs
  in the customer's browser), anyone could steal it. The Lambda holds the key
  in the cloud where customers can't see it.

- **Why use a webhook instead of waiting for the customer?**
  The customer's job ends when they click Pay. The invoice generation happens
  in the background, so there's no spinning loader at checkout. Even if the
  customer closes their browser, the invoice still gets created.

- **Why is the website polling Lambda #3, instead of Lambda #2 telling the
  website directly?**
  Browsers don't have a fixed address — there's no way for a Lambda to "call
  back" a specific browser tab. So the browser checks back every few seconds
  until the invoice is ready. This is normal for this kind of flow.

- **Why does ZohoBooks live in this picture at all?**
  ZohoBooks is where our finance team works. By having every B2B sale show up
  there as a proper Contact + Invoice, we never have to manually re-enter
  anything for accounting or GST filing.

---

## 6. What can go wrong, and what the user sees

| Thing that fails                          | What the customer sees                                             | What we should do                                                |
| ----------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| GSTIN is mistyped (wrong format)          | "Invalid GSTIN format" (caught instantly, no network call)          | Nothing — they'll retype it.                                     |
| GSTIN format is valid but doesn't exist    | "GSTIN not found in GST records."                                  | Nothing — they'll double-check it.                               |
| Surepass is down                          | "Unable to verify GSTIN. Please try again."                        | Check Surepass status; the Lambda logs will say why.            |
| Verify Lambda is misconfigured in prod    | "GST verification is temporarily unavailable."                     | Set `NEXT_PUBLIC_GST_VERIFY_API_URL` in the production env.      |
| Shopify webhook fails to reach Lambda #2 | The order goes through fine, but no invoice ever appears.          | Check Shopify's webhook delivery log and Lambda #2's error log.  |
| ZohoBooks rejects the contact or invoice  | The order page shows "Invoice pending" indefinitely.                | Look at Lambda #2's error log — usually a bad field (e.g. state name too long; we already strip that). |
| Invoice Lookup Lambda is misconfigured   | The order page shows "Invoice unavailable."                        | Set `NEXT_PUBLIC_INVOICE_API_URL` in the production env.         |

---

## 7. The handoff between systems, in one sentence each

1. **Website → Lambda #1:** "Is this GSTIN real?"
2. **Lambda #1 → Surepass:** "Look this up in the official records."
3. **Website → Shopify:** "Here's a paid cart, with these company details attached."
4. **Shopify → Lambda #2:** "A new order just happened — here are all the details."
5. **Lambda #2 → ZohoBooks:** "Make sure this company exists as a Contact, then issue them an invoice for this order."
6. **Website → Lambda #3:** "Is the invoice for order X ready yet?"
7. **Lambda #3 → Website:** "Yes, here's the PDF link" (or "not yet").

---

## 8. A glossary, for non-technical readers

- **GSTIN** — The 15-character Goods & Services Tax Identification Number that
  every Indian business has. It encodes the state, the company's PAN, and a
  checksum.
- **GST invoice** — A tax invoice formatted to satisfy Indian GST rules. The
  business buyer needs one to claim input-tax credit.
- **Webhook** — A pre-arranged phone number that one system uses to call
  another. "When X happens, please call this number." Shopify uses webhooks
  to notify us about new orders.
- **API** — A way for one piece of software to ask another piece of software
  to do something, over the internet.
- **Endpoint** — A specific address (URL) on an API. We have endpoints like
  `/gst/verify` and `/invoice/by-order/123`.
- **Polling** — When a system repeatedly asks "is it ready yet? is it ready
  yet?" because there's no way for the other side to call back.
- **Contact** (in ZohoBooks) — A customer record. We create one per unique
  GSTIN.
