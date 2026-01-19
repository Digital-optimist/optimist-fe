import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ViewCanvas } from "@/components/canvas/ViewCanvas";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/providers/Providers";

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
    icon: "/Favicon_Optimist_32px X 32px.png",
    shortcut: "/Favicon_Optimist_32px X 32px.png",
    apple: "/Favicon_Optimist_32px X 32px.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${abcSolar.variable} ${abcSolarDisplay.variable} antialiased bg-[#FFFFFF] text-optimist-cream`}
      >
        <Providers>
          <SmoothScroll>
            {/* <ViewCanvas /> */}
            <Navigation />
            <main>{children}</main>
            <Footer />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
