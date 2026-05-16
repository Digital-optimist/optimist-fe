"use client";

import { type ReactNode } from "react";
import { ShopifyProvider } from "@shopify/hydrogen-react";
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
export function Providers({ children }: ProvidersProps) {
  return (
    <ShopifyProvider
      storeDomain={`https://octolife-3.myshopify.com`}
      storefrontToken={"3b12d6020365806434052cc061a5b5e3"}
      storefrontApiVersion="2025-07"
      countryIsoCode="IN"
      languageIsoCode="EN"
    >
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
    </ShopifyProvider>
  );
}
