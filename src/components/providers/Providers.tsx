"use client";

import { type ReactNode } from "react";
import { ShopifyProvider } from "@shopify/hydrogen-react";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WaitlistProvider } from "@/contexts/WaitlistContext";
import { ProductsProvider } from "@/contexts/ProductsContext";
import { ToastProvider } from "@/components/ui/Toast";
import { WaitlistModal } from "@/components/ui/WaitlistModal";

interface ProvidersProps {
  children: ReactNode;
}

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
            <ProductsProvider>
              <WaitlistProvider>
                {children}
                <WaitlistModal />
              </WaitlistProvider>
            </ProductsProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ShopifyProvider>
  );
}
