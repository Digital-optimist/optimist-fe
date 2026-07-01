"use client";

import { type ReactNode } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { MagicCheckoutProvider } from "@/contexts/MagicCheckoutContext";
import { WaitlistProvider } from "@/contexts/WaitlistContext";
import { LeadCaptureProvider } from "@/contexts/LeadCaptureContext";
import { ProductsProvider } from "@/contexts/ProductsContext";
import { HomeAppProvider } from "@/components/home/useApp";
import { ToastProvider } from "@/components/ui/Toast";
import { WaitlistModal } from "@/components/ui/WaitlistModal";
import { LeadCaptureModal } from "@/components/ui/LeadCaptureModal";
import type { Product } from "@/lib/shopify";

interface ProvidersProps {
  children: ReactNode;
  // Build-time products, seeded into a global ProductsProvider so the site-wide
  // header's "Get it now" resolves a variant on every route.
  products?: Product[];
}

export function Providers({ children, products }: ProvidersProps) {
  return (
    <LazyMotion features={domAnimation} strict={false}>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <MagicCheckoutProvider>
              <WaitlistProvider>
                <LeadCaptureProvider>
                  {/* Global providers for the site-wide HomeHeader: products for
                      the CTA, HomeAppProvider for the scroll-to-pill state.
                      Route-scoped ProductsProviders (/, /home, /products) nest
                      inside and shadow this one with their own server data. */}
                  <ProductsProvider initialProducts={products}>
                    <HomeAppProvider>{children}</HomeAppProvider>
                  </ProductsProvider>
                  <WaitlistModal />
                  <LeadCaptureModal />
                </LeadCaptureProvider>
              </WaitlistProvider>
            </MagicCheckoutProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </LazyMotion>
  );
}
