"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  preloadSaleAssistTracking,
  saPageView,
} from "@/lib/saleassist-events";

// Fires the SaleAssist `page_view` on every route and brings the tracking
// widget up once per session on browser idle (off the critical path). Rendered
// globally from the root layout; renders nothing itself.
export default function SaleAssistTracker() {
  const pathname = usePathname();

  // Deferred, once-per-session widget preload so queued events (starting with
  // the first page_view) are delivered even on pages with no conversion event.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      preloadSaleAssistTracking();
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(run, { timeout: 4000 });
      return () => window.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(run, 2500);
    return () => window.clearTimeout(id);
  }, []);

  // page_view on initial load + every client-side navigation.
  useEffect(() => {
    if (pathname) saPageView();
  }, [pathname]);

  return null;
}
