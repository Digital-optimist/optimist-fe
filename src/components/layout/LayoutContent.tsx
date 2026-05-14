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
];

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();
  const hideFooter = NO_FOOTER_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  return (
    <>
      <ScrollResetOnRouteChange />
      <Navigation />
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
}
