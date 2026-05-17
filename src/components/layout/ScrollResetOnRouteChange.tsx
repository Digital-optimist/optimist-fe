"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Resets the page scroll position to the top whenever the route changes.
 * Next.js's default scroll restoration sometimes misses during client-side
 * navigation in our setup; this guarantees the new route starts at the top.
 *
 * If the URL contains a hash (#section), the browser's anchor scroll
 * behavior is preserved.
 */
export function ScrollResetOnRouteChange() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;

    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
    };

    scrollToTop();
    const raf = requestAnimationFrame(scrollToTop);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}

export default ScrollResetOnRouteChange;
