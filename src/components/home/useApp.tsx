"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// Lightweight matchMedia hook (replaces usehooks-ts from the reference). Starts
// `false` on the server + first client render so hydration matches, then syncs
// to the real viewport after mount.
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

type AppContextType = {
  isMobile: boolean;
  isLargeDesktop: boolean;
  isScrollHead: boolean;
};

const AppContext = createContext<AppContextType | null>(null);

// Mirrors optimist-website's AppProvider: exposes responsive flags and toggles
// the `scroll-head` body class that condenses the sticky header on scroll.
export function HomeAppProvider({ children }: { children: ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isLargeDesktop = useMediaQuery("(min-width: 1440px)");
  const [isScrollHead, setIsScrollHead] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > (isMobile ? 0 : 16)) {
        document.body.classList.add("scroll-head");
        setIsScrollHead(true);
      } else {
        document.body.classList.remove("scroll-head");
        setIsScrollHead(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.classList.remove("scroll-head");
    };
  }, [isMobile]);

  return (
    <AppContext.Provider value={{ isMobile, isLargeDesktop, isScrollHead }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within a HomeAppProvider");
  }
  return context;
}
