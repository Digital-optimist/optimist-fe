"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Resets the page scroll position to the top whenever the route changes.
 *
 * This is needed because Lenis (smooth scroll) intercepts the scroll position
 * and Next.js' default scroll restoration does not always reset to the top
 * during client-side navigation in our setup. We handle both Lenis and the
 * native window scroll (mobile / iOS) so navigation always lands at the top.
 *
 * If the URL contains a hash (#section), we keep the browser's anchor scroll
 * behavior intact and do not override it.
 */
export function ScrollResetOnRouteChange() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.location.hash) return;

    const scrollToTop = () => {
      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      }
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
