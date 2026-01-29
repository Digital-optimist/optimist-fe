import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ViewCanvas } from "@/components/canvas/ViewCanvas";
import { LayoutContent } from "@/components/layout/LayoutContent";
import { Providers } from "@/components/providers/Providers";

const GTM_ID = "GTM-KNHD6RHP";

// ABC Solar Display - For headlines
const abcSolarDisplay = localFont({
  src: [
    {
      path: "../assets/fonts/ABCSolarDisplay-Regular-Trial.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/ABCSolarDisplay-RegularItalic-Trial.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../assets/fonts/ABCSolarDisplay-Medium-Trial.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/ABCSolarDisplay-MediumItalic-Trial.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../assets/fonts/ABCSolarDisplay-Bold-Trial.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/ABCSolarDisplay-BoldItalic-Trial.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../assets/fonts/ABCSolarDisplay-Extrabold-Trial.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../assets/fonts/ABCSolarDisplay-ExtraboldItalic-Trial.otf",
      weight: "800",
      style: "italic",
    },
  ],
  variable: "--font-abc-solar-display",
  display: "swap",
});

// ABC Solar - For body text and UI
const abcSolar = localFont({
  src: [
    {
      path: "../assets/fonts/ABCSolar-Light-Trial.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/ABCSolar-Regular-Trial.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/ABCSolar-RegularItalic-Trial.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../assets/fonts/ABCSolar-Medium-Trial.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/ABCSolar-Semibold-Trial.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/ABCSolar-Bold-Trial.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-abc-solar",
  display: "swap",
});

// S3 bucket URL for assets (from environment variable)
const S3_BUCKET_URL = process.env.NEXT_PUBLIC_S3_BUCKET_URL || "";
const faviconUrl = `${S3_BUCKET_URL}/${encodeURIComponent("Favicon_Optimist_32px X 32px.png")}`;

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
    icon: faviconUrl,
    shortcut: faviconUrl,
    apple: faviconUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
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
            {/* <ViewCanvas /> */}
            <LayoutContent>{children}</LayoutContent>
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
