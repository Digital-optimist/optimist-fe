"use client";

import { type ReactNode } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WaitlistProvider } from "@/contexts/WaitlistContext";
import { LeadCaptureProvider } from "@/contexts/LeadCaptureContext";
import { ToastProvider } from "@/components/ui/Toast";
import { WaitlistModal } from "@/components/ui/WaitlistModal";
import { LeadCaptureModal } from "@/components/ui/LeadCaptureModal";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <LazyMotion features={domAnimation} strict={false}>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WaitlistProvider>
              <LeadCaptureProvider>
                {children}
                <WaitlistModal />
                <LeadCaptureModal />
              </LeadCaptureProvider>
            </WaitlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </LazyMotion>
  );
}
