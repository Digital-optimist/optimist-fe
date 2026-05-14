"use client";

import { createContext, type ReactNode } from "react";
import type { LandingPageContent } from "@/lib/shopify";

const LandingContentContext = createContext<LandingPageContent | null>(null);

export function LandingContentProvider({
  content,
  children,
}: {
  content: LandingPageContent | null;
  children: ReactNode;
}) {
  return (
    <LandingContentContext.Provider value={content}>
      {children}
    </LandingContentContext.Provider>
  );
}
