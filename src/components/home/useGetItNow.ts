"use client";

import { useMemo, useState } from "react";
import { useProducts } from "@/contexts/ProductsContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/Toast";
import { useMagicCheckout } from "@/contexts/MagicCheckoutContext";

// Shared "Get it now" → buyNow → Razorpay flow. Used by both the home product
// section and the sticky header CTA so the two entry points resolve the same
// variant and behave identically.
export function useGetItNow() {
  const { combinedProduct, getVariantByTonnage } = useProducts();
  const { buyNow } = useCart();
  const { startCheckout } = useMagicCheckout();
  const { showToast } = useToast();

  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);

  // The store currently sells a single 1.4-ton AC. Resolve it by tonnage, and
  // fall back to the first non–Inner-Circle variant so this keeps working if
  // the catalogue changes.
  const variant = useMemo(() => {
    return (
      getVariantByTonnage("1.4") ??
      combinedProduct?.allVariants.find(
        (v) => !v.productTitle.toLowerCase().includes("inner circle"),
      )
    );
  }, [getVariantByTonnage, combinedProduct]);

  const handleGetItNow = async () => {
    if (!variant?.variantId) {
      showToast("Product is currently unavailable", "error");
      return;
    }
    if (!variant.available) {
      showToast("This AC is out of stock", "error");
      return;
    }
    // Pincode serviceability is handled inside Razorpay Magic Checkout now, so
    // "Get it now" goes straight to the SDK (no pre-checkout pincode gate).
    setIsBuyNowLoading(true);
    try {
      const cart = await buyNow(variant.variantId, 1);
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
  };

  return {
    variant,
    isBuyNowLoading,
    handleGetItNow,
  };
}
