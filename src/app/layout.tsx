import { LayoutContent } from "@/components/layout/LayoutContent";
import { Providers } from "@/components/providers/Providers";
import SaleAssistLoader from "@/components/SaleAssistLoader";
import SaleAssistTracker from "@/components/SaleAssistTracker";
import SnapmintLoader from "@/components/SnapmintLoader";
import { getLandingPageContent, getProducts } from "@/lib/shopify";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { WebVitals } from "./_components/WebVitals";
import "./globals.css";

const GTM_ID = "GTM-KNHD6RHP";
const GA4_ID = "G-FMPV82QJV9";
// Meta (Facebook) Pixel — wired via env so it can be set per-environment. Empty
// (the default) injects no base code, so `fbq` stays undefined and every Meta
// call no-ops safely until a real Pixel ID is provided.
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

// ABC Solar Display - For headlines.
const abcSolarDisplay = localFont({
  src: [
    {
      path: "../assets/fonts/ABCSolarDisplay-Regular-Trial.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/ABCSolarDisplay-Medium-Trial.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/ABCSolarDisplay-Bold-Trial.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-abc-solar-display",
  display: "swap",
});

// ABC Solar - For body text and UI. RegularItalic is omitted: no Tailwind
// `italic` class is applied anywhere in src/, so it would only ship bytes
// no one uses.
const abcSolar = localFont({
  src: [
    {
      path: "../assets/fonts/ABCSolar-Light-Trial.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/ABCSolar-Regular-Trial.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/ABCSolar-Medium-Trial.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/ABCSolar-Semibold-Trial.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/ABCSolar-Bold-Trial.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-abc-solar",
  display: "swap",
});

// Poppins drives the site-wide header (HomeHeader) so the navbar reads
// identically on every route. Loaded once here and exposed via --font-poppins;
// the /home route reuses this same variable for its body copy.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Optimist | Premium Air Conditioners",
    template: "%s | Optimist",
  },
  description:
    "Premium air conditioners engineered for modern living. Cools more. Uses less. Experience the highest ISEER rated ACs in India.",
  keywords: [
    "air conditioner",
    "AC",
    "cooling",
    "home appliance",
    "premium",
    "energy efficient",
    "ISEER",
  ],
  icons: {
    icon: [
      { url: "/icons/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/icons/favicon.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [landingContent, products] = await Promise.all([
    getLandingPageContent(),
    getProducts(10),
  ]);
  const footerImageSrc = landingContent?.footerImageUrl ?? null;

  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        {/* Preconnect to the S3 assets bucket so the first image request
            skips DNS + TCP + TLS handshakes (~100-300 ms saved on cold loads).
            No crossOrigin — S3 images are loaded as plain <img>/<Image> without
            credentials, so the anonymous-CORS preconnect was flagged by
            Lighthouse as "unused" because the actual request didn't match. */}
        <link
          rel="preconnect"
          href="https://optimist-fe-assets.s3.amazonaws.com"
        />
        <link
          rel="dns-prefetch"
          href="https://optimist-fe-assets.s3.amazonaws.com"
        />
        {/* Preconnect to Shopify CDN — serves the product gallery, including
            the LCP image on /products/. Saves ~80 ms on the LCP fetch. */}
        <link
          rel="preconnect"
          href="https://cdn.shopify.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />
        {/* Razorpay Magic Checkout SDK — preloaded during idle so the in-page
            payment modal is ready by the time the shopper reaches checkout.
            loadRazorpay.ts reuses this same tag (matching id) and guarantees
            readiness on demand. Replaces the old Shopflo checkout bridge. */}
        <Script
          id="razorpay-magic-sdk"
          src="https://checkout.razorpay.com/v1/magic-checkout.js"
          strategy="lazyOnload"
        />
        {/* Google Tag Manager — `afterInteractive` so GTM + GA4 boot right after
            hydration and set the `_ga`/session cookies BEFORE a shopper can tap
            an above-the-fold CTA (e.g. /home's header "Get it now"). Under the
            old `lazyOnload`, an early checkout click snapshotted empty
            attribution because `_ga` wasn't set yet, so conversions from /home
            went untracked. Costs ~50-150 ms of TBT — accepted for reliable
            conversion tracking on landing pages. */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
        {/* Google Analytics 4 — `afterInteractive` (see GTM note) so `gtag` and
            the `_ga` cookie are ready before checkout can start on any route. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
          strategy="afterInteractive"
        />
        <Script
          id="ga4-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4_ID}', {
                linker: {
                  domains: ['www.optimist.in', 'shop.optimist.in']
                }
              });
            `,
          }}
        />
        {/* Meta (Facebook) Pixel base code. Loaded `afterInteractive` (a touch
            earlier than GA4's lazyOnload) so the `_fbp` cookie is set before the
            shopper reaches checkout — the server-side fb_analytics attribution
            in lib/analytics.ts only emits its block when `_fbp` exists. Only
            injected when a Pixel ID is configured; otherwise `fbq` is undefined
            and the forwarding helpers no-op. */}
        {META_PIXEL_ID && (
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window,document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${META_PIXEL_ID}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
        {/* <LimeChatWidget /> */}
      </head>
      <body
        className={`${abcSolar.variable} ${abcSolarDisplay.variable} ${poppins.variable} antialiased bg-white text-optimist-cream`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* Meta Pixel (noscript) */}
        {META_PIXEL_ID && (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}
        <Providers products={products}>
          <LayoutContent footerImageSrc={footerImageSrc}>
            {children}
          </LayoutContent>
        </Providers>

        <WebVitals />
        <SnapmintLoader />
        <SaleAssistLoader />
        <SaleAssistTracker />
      </body>
    </html>
  );
}
