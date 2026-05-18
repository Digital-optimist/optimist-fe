"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    loadOnPage?: () => void;
  }
}

const SNAPMINT_SCRIPT_ID = "snapmint-script";
const MERCHANT_ID = "8097";

/**
 * Loads the Snapmint EMI widget script on /products routes only. The widget
 * binds itself to `.snapmint_lowest_emi_value` elements, which live inside
 * ProductsPageClient — so we don't pay the script cost on landing/about/etc.
 *
 * Loads ~400ms after route mount so the script doesn't compete with hydration
 * or the LCP fetch. Once the script is loaded, `window.loadOnPage()` re-binds
 * the widget; ProductsPageClient calls it again whenever the selected variant
 * changes so the EMI price stays in sync.
 */
export default function SnapmintLoader(): null {
  const pathname = usePathname();
  const isProductsRoute = pathname?.startsWith("/products");

  useEffect(() => {
    if (!isProductsRoute) return;

    const loadSnapmint = () => {
      const existingScript = document.getElementById(SNAPMINT_SCRIPT_ID);

      if (!existingScript) {
        const script = document.createElement("script");
        script.id = SNAPMINT_SCRIPT_ID;
        script.async = true;
        script.defer = true;
        script.src = `https://checkout-merchant.snapmint.com/js/v1/${MERCHANT_ID}`;

        script.onload = () => {
          setTimeout(() => {
            window.loadOnPage?.();
          }, 800);
        };

        document.body.appendChild(script);
      } else {
        setTimeout(() => {
          window.loadOnPage?.();
        }, 800);
      }
    };

    const timeoutId = setTimeout(loadSnapmint, 400);
    return () => clearTimeout(timeoutId);
  }, [pathname, isProductsRoute]);

  return null;
}
