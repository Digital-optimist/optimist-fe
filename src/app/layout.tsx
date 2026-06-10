import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { LayoutContent } from "@/components/layout/LayoutContent";
import { Providers } from "@/components/providers/Providers";
import SaleAssistLoader from "@/components/SaleAssistLoader";
import SnapmintLoader from "@/components/SnapmintLoader";
import { WebVitals } from "./_components/WebVitals";
import { getLandingPageContent } from "@/lib/shopify";

const GTM_ID = "GTM-KNHD6RHP";
const GA4_ID = "G-FMPV82QJV9";

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
  const landingContent = await getLandingPageContent();
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
        {/* Shopflo checkout bridge */}
        <Script
          src="https://bridge.shopflo.com/js/shopflo.bundle.js"
          strategy="afterInteractive"
        />
        {/* Google Tag Manager — pushed to `lazyOnload` (matches GA4 below) so
            it runs during browser idle time instead of immediately after
            interactive. GTM was costing 50-150 ms of TBT on the main thread;
            this trades ~1-2 s of analytics-attribution accuracy for a
            noticeably cleaner main thread on first paint. Site events still
            fire correctly because GTM's `dataLayer.push` calls queue until
            the snippet loads. */}
        <Script
          id="gtm-script"
          strategy="lazyOnload"
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
        {/* Google Analytics 4 — pushed to lazyOnload so it only fires when the browser is idle. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
          strategy="lazyOnload"
        />
        <Script
          id="ga4-script"
          strategy="lazyOnload"
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
      </head>
      <body
        className={`${abcSolar.variable} ${abcSolarDisplay.variable} antialiased bg-white text-optimist-cream`}
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
        <Providers>
          <LayoutContent footerImageSrc={footerImageSrc}>
            {children}
          </LayoutContent>
        </Providers>

        <WebVitals />
        <SnapmintLoader />
        <SaleAssistLoader />
      </body>
    </html>
  );
}
