"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/layout/Navigation";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeFooter } from "@/components/home/HomeFooter";
import { useApp } from "@/components/home/useApp";
import { Footer } from "@/components/layout/Footer";
import { ScrollResetOnRouteChange } from "@/components/layout/ScrollResetOnRouteChange";

// Routes that should not have Footer. The main home (/) is handled separately
// below — it ships its own HomeFooter.
const NO_FOOTER_ROUTES = [
  "/login",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/product-installation",
];

// Routes that render their own header (or none), so the layout adds no header:
//   /product-installation → standalone noindex page with its own banner
// The main home (/) is handled separately below (it ships its own HomeHeader).
const NO_HEADER_ROUTES = ["/product-installation"];

interface LayoutContentProps {
  children: React.ReactNode;
  footerImageSrc: string | null;
}

export function LayoutContent({ children, footerImageSrc }: LayoutContentProps) {
  const pathname = usePathname();
  const { isScrollHead } = useApp();

  // The main home page (/) renders the optimist-styled homepage, which ships its
  // OWN HomeHeader + HomeFooter — the layout must not add duplicates.
  const isMainHome = pathname === "/";
  // The previous landing page now lives at /home and keeps the original floating
  // Navigation + Footer it was designed around.
  const isLegacyLanding = pathname === "/home" || pathname === "/home/";

  const hideFooter =
    isMainHome || NO_FOOTER_ROUTES.some((route) => pathname.startsWith(route));
  const hideHeader =
    isMainHome || NO_HEADER_ROUTES.some((route) => pathname.startsWith(route));
  // The legacy landing (/home) keeps the original floating Navigation; every
  // other route uses the site-wide HomeHeader (Poppins, scroll-to-frosted-pill).
  const usesGlobalHeader = !hideHeader && !isLegacyLanding;

  // The in-flow HomeHeader shrinks ~40px on desktop when it turns into the
  // scrolled pill (h-fit≈120px → h-20=80px). Left uncompensated, that height
  // change fights the browser's scroll-anchoring near the threshold and makes
  // the header jitter. So <main> gains exactly that 40px back when scrolled
  // (md:pt-14 → md:pt-24), keeping the content's flow position fixed — the same
  // trick /home's hero uses. The extra base padding also gives a comfortable
  // gap below the header at the top. (Mobile shrink is ~2px, so it's constant.)
  const mainTopPad = usesGlobalHeader
    ? isScrollHead
      ? "pt-10 md:pt-24"
      : "pt-10 md:pt-14"
    : undefined;

  return (
    <>
      <ScrollResetOnRouteChange />
      {!hideHeader && (isLegacyLanding ? <Navigation /> : <HomeHeader />)}
      <main className={mainTopPad}>{children}</main>
      {/* Legacy landing (/home) keeps the original Footer; every other route that
          shows a footer uses the site-wide HomeFooter (mirrors the header). */}
      {!hideFooter &&
        (isLegacyLanding ? (
          <Footer footerImageSrc={footerImageSrc} />
        ) : (
          <HomeFooter />
        ))}
    </>
  );
}
