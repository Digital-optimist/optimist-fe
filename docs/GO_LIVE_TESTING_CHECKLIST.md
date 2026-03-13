# Go-live testing checklist

Use this checklist before launch. Mark each item Pass / Fail / Blocked and add notes.

## 1. Commerce (Shopify)

### Product page (`/products`, `/products123`)

- [ ] First product loads (no blank screen)
- [ ] Variant selection updates price, availability, Add to cart / Buy now
- [ ] Add to cart: success toast, cart count updates, drawer opens
- [ ] Buy now: redirects to Shopify checkout URL
- [ ] Out-of-stock variant: add to cart disabled or clear message
- [ ] Reviews (Judge.me): load and display
- [ ] Snapmint / EMI widget loads when `NEXT_PUBLIC_SNAPMINT_MERCHANT` is set
- [ ] Mobile: gallery, sticky CTA, quantity selector, navigation work
- [ ] Product unavailable: when product fails to load, "Product unavailable" message and link to homepage

### Cart

- [ ] Empty cart: message and link to products
- [ ] Add / update quantity / remove: state and subtotal in sync; loading and error states
- [ ] Proceed to checkout: redirects to Shopify; button disabled when no checkout URL or loading
- [ ] Cart drawer: open/close, same actions, link to /cart
- [ ] Cart persistence: refresh and reopen; cart id in localStorage
- [ ] After login: cart associates with customer

### Checkout

- [ ] Redirect to Shopify domain; complete a test order

---

## 2. Auth (Shopify customer API)

### Login (`/login`)

- [ ] Valid credentials: login, redirect to /account, toast
- [ ] Invalid: error message and toast, no redirect
- [ ] Remember me and token persistence; after refresh still logged in until expiry
- [ ] If already logged in, redirect to /account

### Sign-up (`/sign-up`)

- [ ] New customer: account created, auto-login, redirect to /account
- [ ] Duplicate email: clear error from API
- [ ] Validation: email format, password rules, required fields

### Forgot password (`/forgot-password`)

- [ ] Submit email: success message; `customerRecover` is called

### Reset password (`/reset-password`)

- [ ] Token from email link; new password set and redirect/login

### Logout

- [ ] From account/header: session cleared, redirect; cart remains for next visit

---

## 3. Account

### Account dashboard (`/account`)

- [ ] Requires auth; redirect to login if not authenticated
- [ ] Shows customer info; edit profile if applicable
- [ ] Links to orders and addresses

### Orders (`/account/orders`)

- [ ] List loads; empty and non-empty states
- [ ] Order detail: correct order data, line items, status, totals

### Addresses (`/account/addresses`)

- [ ] List, add, edit, delete; validation and Shopify mutations work

---

## 4. Contact and waitlist

### Contact form (`/contact-us`)

- [ ] Required fields and validation (phone, reason, consent)
- [ ] File upload: optional; size/type limits and errors
- [ ] Submit: success and error paths (after no-cors fix)
- [ ] No double submit; loading state during submit

### Waitlist (modal)

- [ ] Phone submit: success state
- [ ] Duplicate phone (TAKEN): treated as success
- [ ] Invalid phone: clear error message

---

## 5. Content and static pages

### Home (`/`)

- [ ] Hero, sections, CTAs render; no console errors
- [ ] Lenis/GSAP/Lottie/3D or canvas components run
- [ ] Links to products, about, contact, blogs
- [ ] Waitlist modal from CTA

### About (`/about`)

- [ ] Content and CTA section render; links work

### Blogs (`/blogs`)

- [ ] List loads; pagination and tag filter work
- [ ] Article detail: test a few articles (pre-rendered or client)
- [ ] Direct article URLs work (or expected 404)

### Legal and info

- [ ] FAQ, warranty, terms, privacy-policy, return-policy: pages render and content correct

---

## 6. Layout and global

### Navigation

- [ ] Desktop and mobile menu; active route; cart icon with count; login/account/logout
- [ ] No broken links (especially after static export)

### Footer

- [ ] Links and waitlist/social links work

### Providers

- [ ] No hydration errors in console

---

## 7. Build and deploy

- [ ] `yarn build` completes; `out/` exists
- [ ] `test -d out || exit 1` passes (e.g. in buildspec)
- [ ] Production env vars set: Shopify, Google webhook, S3, Snapmint (if used)
- [ ] Key pages work with missing optional env (e.g. Snapmint) without crash

---

## 8. Cross-browser and device

- [ ] Critical path on Chrome and Safari (or one mobile browser)
- [ ] Key flows on mobile viewport: cart drawer, product gallery, nav, account

---

## Sign-off

| Role    | Name | Date | Notes |
|---------|------|------|--------|
| QA      |      |      |        |
| Dev     |      |      |        |
| Product |      |      |        |
