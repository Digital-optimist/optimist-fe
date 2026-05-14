"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const SaleAssistButton = dynamic(() => import("./SaleAssistButton"), {
  ssr: false,
});

const SALEASSIST_ROUTES = ["/", "/products", "/cart", "/contact-us"];

export default function SaleAssistLoader() {
  const pathname = usePathname();
  const shouldLoad = SALEASSIST_ROUTES.some(
    (route) => pathname === route || pathname?.startsWith(route + "/"),
  );

  if (!shouldLoad) return null;
  return <SaleAssistButton />;
}
