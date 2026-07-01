"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/layout/Navigation";
import { HomeHeader } from "@/components/home/HomeHeader";
import { useApp } from "@/components/home/useApp";
import { Footer } from "@/components/layout/Footer";
import { ScrollResetOnRouteChange } from "@/components/layout/ScrollResetOnRouteChange";

// Routes that should not have Footer
const NO_FOOTER_ROUTES = [
  "/login",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/product-installation",
  // /home ships its own footer (HomeFooter), so the global Footer is hidden.
  "/home",
];

// Routes that render their own header (or none), so the layout adds no header:
//   /home  → ships its own inline HomeHeader (keeps its hero/background detail)
//   /product-installation → standalone noindex page with its own banner
const NO_HEADER_ROUTES = ["/product-installation", "/home"];

interface LayoutContentProps {
  children: React.ReactNode;
  footerImageSrc: string | null;
}

export function LayoutContent({ children, footerImageSrc }: LayoutContentProps) {
  const pathname = usePathname();
  const { isScrollHead } = useApp();
  const hideFooter = NO_FOOTER_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  const hideHeader = NO_HEADER_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  // The landing page (/) keeps the original floating Navigation; every other
  // route uses the site-wide HomeHeader (Poppins, scroll-to-frosted-pill).
  const isLanding = pathname === "/";
  const usesGlobalHeader = !hideHeader && !isLanding;

  // The in-flow HomeHeader shrinks ~40px on desktop when it turns into the
  // scrolled pill (h-fit≈120px → h-20=80px). Left uncompensated, that height
  // change fights the browser's scroll-anchoring near the threshold and makes
  // the header jitter. So <main> gains exactly that 40px back when scrolled
  // (md:pt-14 → md:pt-24), keeping the content's flow position fixed — the same
  // trick /home's hero uses. The extra base padding also gives a comfortable
  // gap below the header at the top. (Mobile shrink is ~2px, so it's constant.)
  const mainTopPad = usesGlobalHeader
    ? isScrollHead
      ? "pt-8 md:pt-24"
      : "pt-8 md:pt-14"
    : undefined;

  return (
    <>
      <ScrollResetOnRouteChange />
      {!hideHeader && (isLanding ? <Navigation /> : <HomeHeader />)}
      <main className={mainTopPad}>{children}</main>
      {!hideFooter && <Footer footerImageSrc={footerImageSrc} />}
    </>
  );
}
