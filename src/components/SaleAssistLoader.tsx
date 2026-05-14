"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SaleAssistButton = dynamic(() => import("./SaleAssistButton"), {
  ssr: false,
});

const SALEASSIST_ROUTES = ["/", "/products", "/cart", "/contact-us"];

// Defer SaleAssist until either the user interacts with the page or 5s have elapsed.
// Keeps the chat widget out of the critical path entirely.
const DEFER_MS = 5000;

export default function SaleAssistLoader() {
  const pathname = usePathname();
  const [shouldMount, setShouldMount] = useState(false);

  const isRouteAllowed = SALEASSIST_ROUTES.some(
    (route) => pathname === route || pathname?.startsWith(route + "/"),
  );

  useEffect(() => {
    if (!isRouteAllowed) return;

    let mounted = true;
    const trigger = () => {
      if (mounted) setShouldMount(true);
    };

    const events: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "scroll",
      "touchstart",
    ];
    const opts: AddEventListenerOptions = { once: true, passive: true };
    events.forEach((e) => window.addEventListener(e, trigger, opts));

    const timer = window.setTimeout(trigger, DEFER_MS);

    return () => {
      mounted = false;
      events.forEach((e) => window.removeEventListener(e, trigger));
      window.clearTimeout(timer);
    };
  }, [isRouteAllowed, pathname]);

  if (!isRouteAllowed || !shouldMount) return null;
  return <SaleAssistButton />;
}
