"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { ScrollResetOnRouteChange } from "@/components/layout/ScrollResetOnRouteChange";

// Routes that should not have Navigation (header)
const NO_NAV_ROUTES = ["/inner-circle", "/inner-circle-club"];

// Routes that should not have Footer
const NO_FOOTER_ROUTES = [
  "/login",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/inner-circle",
  "/inner-circle-club",
];

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();
  const hideNav = NO_NAV_ROUTES.some((route) => pathname.startsWith(route));
  const hideFooter = NO_FOOTER_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  return (
    <>
      <ScrollResetOnRouteChange />
      {!hideNav && <Navigation />}
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
}
