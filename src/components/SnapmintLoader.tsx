"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    loadOnPage?: () => void;
  }
}

const SNAPMINT_SCRIPT_ID = "snapmint-script";

export default function SnapmintLoader(): null {
  const pathname = usePathname();

  const isProductsRoute =
    pathname.startsWith("/products") && !pathname.startsWith("/products123");

  useEffect(() => {
    if (isProductsRoute) return;

    let timeoutId: NodeJS.Timeout;

    const loadSnapmint = () => {
      const existingScript = document.getElementById(SNAPMINT_SCRIPT_ID);

      if (!existingScript) {
        const script = document.createElement("script");
        script.id = SNAPMINT_SCRIPT_ID;
        script.async = true;
        script.defer = true;

        const merchantId = "8097";
        script.src = `https://checkout-merchant.snapmint.com/js/v1/${merchantId}`;

        script.onload = () => {
          setTimeout(() => {
            window.loadOnPage?.();
          }, 800);
        };

        script.onerror = () => console.error("Snapmint script failed to load");

        document.body.appendChild(script);
      } else {
        setTimeout(() => {
          window.loadOnPage?.();
        }, 800);
      }
    };

    timeoutId = setTimeout(loadSnapmint, 400);

    return () => clearTimeout(timeoutId);
  }, [pathname, isProductsRoute]);

  return null;
}
