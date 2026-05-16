import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { LayoutContent } from "@/components/layout/LayoutContent";
import { Providers } from "@/components/providers/Providers";
import SaleAssistLoader from "@/components/SaleAssistLoader";

const GTM_ID = "GTM-KNHD6RHP";
const GA4_ID = "G-FMPV82QJV9";

// ABC Solar Display - For headlines (only weights actually used; italics/800 dropped).
// preload: false — Next.js auto-preloads every weight by default, which shipped
// ~400 KiB of woff2 up-front on /products/. With display:"swap" the browser
// renders fallback text immediately and fetches woff2 only for weights actually
// painted on the visible page.
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
  preload: false,
});

// ABC Solar - For body text and UI.
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
      path: "../assets/fonts/ABCSolar-RegularItalic-Trial.woff2",
      weight: "400",
      style: "italic",
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
  preload: false,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        {/* Preconnect to the S3 assets bucket so the first image request
            skips DNS + TCP + TLS handshakes (~100-300 ms saved on cold loads). */}
        <link
          rel="preconnect"
          href="https://optimist-fe-assets.s3.amazonaws.com"
          crossOrigin="anonymous"
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
        {/* Google Tag Manager — loaded after the page is interactive so it doesn't block first paint. */}
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
          <SmoothScroll>
            <LayoutContent>{children}</LayoutContent>
          </SmoothScroll>
        </Providers>

        <SaleAssistLoader />
      </body>
    </html>
  );
}
