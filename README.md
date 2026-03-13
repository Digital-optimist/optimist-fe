# Optimist - Premium Washing Machines

A high-end 3D e-commerce platform for premium washing machines, built with Next.js, React Three Fiber, GSAP, and Lenis.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **3D Graphics**: React Three Fiber + Three.js
- **Animations**: GSAP + ScrollTrigger
- **Smooth Scroll**: Lenis
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

First, install dependencies:

```bash
yarn install
```

Copy environment variables and run the development server:

```bash
cp .env.example .env.local
# Edit .env.local with your Shopify and contact form URLs (see .env.example)
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment variables

See [.env.example](.env.example) for all supported variables. Key ones:

- **Shopify**: `NEXT_PUBLIC_SHOPIFY_DOMAIN`, `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` (required for products, cart, auth).
- **Contact form**: `NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL` (Google Apps Script web app URL).
- **Optional**: `NEXT_PUBLIC_S3_BUCKET_URL`, `NEXT_PUBLIC_SNAPMINT_MERCHANT`.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── canvas/            # React Three Fiber components
│   ├── layout/            # Navigation, Footer, SmoothScroll
│   └── ui/                # Standard HTML/Tailwind components
├── hooks/                 # Custom animation and 3D hooks
└── lib/                   # GSAP and Three.js utilities
```

## Available Scripts

```bash
yarn dev         # Start development server
yarn build       # Build for production
yarn start       # Start production server
yarn lint        # Run ESLint
yarn test         # Run Vitest unit tests (formatPrice, getCartLines, etc.)
yarn test:watch   # Run Vitest in watch mode
yarn test:e2e     # Run Playwright e2e tests (starts dev server if needed)
yarn test:e2e:ci  # Build static export, then run e2e against built site (set CI=true)
```

### E2E testing (Playwright)

Smoke and critical-path tests live in `e2e/`. Run against the dev server with `yarn test:e2e`. For CI (e.g. after static export), run `CI=true yarn build && CI=true yarn test:e2e` so tests run against the built `out/` folder served locally. Install browsers once with `npx playwright install`.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [GSAP](https://gsap.com/docs)
- [Lenis](https://github.com/darkroomengineering/lenis)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
