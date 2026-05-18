"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { ScrollResetOnRouteChange } from "@/components/layout/ScrollResetOnRouteChange";

// Routes that should not have Footer
const NO_FOOTER_ROUTES = [
  "/login",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/feedback",
];

// Routes that should not have the top Navigation
const NO_NAV_ROUTES = ["/feedback"];

interface LayoutContentProps {
  children: React.ReactNode;
  footerImageSrc: string | null;
}

export function LayoutContent({ children, footerImageSrc }: LayoutContentProps) {
  const pathname = usePathname();
  const hideFooter = NO_FOOTER_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  const hideNav = NO_NAV_ROUTES.some((route) => pathname.startsWith(route));

  return (
    <>
      <ScrollResetOnRouteChange />
      {!hideNav && <Navigation />}
      <main>{children}</main>
      {!hideFooter && <Footer footerImageSrc={footerImageSrc} />}
    </>
  );
}
