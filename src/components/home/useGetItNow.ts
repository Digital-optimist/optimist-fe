"use client";

import { useCallback, useMemo, useState } from "react";
import { useProducts, type DisplayVariant } from "@/contexts/ProductsContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/Toast";
import { useMagicCheckout } from "@/contexts/MagicCheckoutContext";

// Shared "Get it now" → buyNow → Razorpay flow. Used by the home product cards
// and the sticky header CTA so every entry point resolves variants and behaves
// identically. `handleGetItNow` buys the default (1.4-ton) variant; `buyVariant`
// buys a specific one (used by the multi-size product cards).
export function useGetItNow() {
  const { combinedProduct, getVariantByTonnage } = useProducts();
  const { buyNow } = useCart();
  const { startCheckout } = useMagicCheckout();
  const { showToast } = useToast();

  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);

  // The flagship 1.4-ton AC. Resolve it by tonnage, falling back to the first
  // non–Inner-Circle variant so this keeps working if the catalogue changes.
  const variant = useMemo(() => {
    return (
      getVariantByTonnage("1.4") ??
      combinedProduct?.allVariants.find(
        (v) => !v.productTitle.toLowerCase().includes("inner circle"),
      )
    );
  }, [getVariantByTonnage, combinedProduct]);

  // Buy a specific variant (defaults to the flagship 1.4-ton).
  const buyVariant = useCallback(
    async (target?: DisplayVariant) => {
      const v = target ?? variant;
      if (!v?.variantId) {
        showToast("Product is currently unavailable", "error");
        return;
      }
      if (!v.available) {
        showToast("This AC is out of stock", "error");
        return;
      }
      // Pincode serviceability is handled inside Razorpay Magic Checkout now, so
      // "Get it now" goes straight to the SDK (no pre-checkout pincode gate).
      setIsBuyNowLoading(true);
      try {
        const cart = await buyNow(v.variantId, 1);
        if (cart) {
          await startCheckout(cart);
        } else {
          showToast("Failed to initiate checkout", "error");
        }
      } catch {
        showToast("Failed to proceed to checkout", "error");
      } finally {
        setIsBuyNowLoading(false);
      }
    },
    [variant, buyNow, startCheckout, showToast],
  );

  const handleGetItNow = useCallback(() => buyVariant(), [buyVariant]);

  return {
    variant,
    getVariantByTonnage,
    isBuyNowLoading,
    handleGetItNow,
    buyVariant,
  };
}
