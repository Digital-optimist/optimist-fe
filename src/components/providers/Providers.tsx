"use client";

import { type ReactNode } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WaitlistProvider } from "@/contexts/WaitlistContext";
import { ToastProvider } from "@/components/ui/Toast";
import { WaitlistModal } from "@/components/ui/WaitlistModal";

interface ProvidersProps {
  children: ReactNode;
}

// NOTE: ProductsProvider used to be mounted globally here. It triggered a
// Shopify GraphQL fetch on mount of every route, including /products/ where
// the page already fetches the same data on the server. The provider has
// been pushed down to the routes that actually consume useProducts() — the
// landing page (HomePageClient) and /products/ (ProductsPageClient) — so it
// no longer runs (and no longer fetches) on unrelated routes.
//
// ShopifyProvider from @shopify/hydrogen-react was removed: a codebase grep
// shows zero consumers of any Hydrogen-React hook (`useShop`, Hydrogen's
// `useCart`, `useShopifyCookies`, etc.). The custom CartContext uses
// @/lib/shopify directly. ShopifyProvider was shipping ~15-25 KB of
// hydrogen-react context provider code on every page for no benefit.
//
// LazyMotion wraps everything so the lighter `m` component (used via the
// `import { m as motion }` alias across the codebase) loads its animation
// features lazily as a single ~25 KB chunk instead of inlining the full
// ~52 KB framer-motion engine into every chunk that touches an animation.
// domAnimation covers animate / initial / exit / whileHover / whileTap /
// whileInView / drag — every animation type used in this codebase. If
// `layout`/`layoutId` animations are added later, switch to `domMax`.
export function Providers({ children }: ProvidersProps) {
  return (
    <LazyMotion features={domAnimation} strict={false}>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WaitlistProvider>
              {children}
              <WaitlistModal />
            </WaitlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </LazyMotion>
  );
}
