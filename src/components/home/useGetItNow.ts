"use client";

import { useMemo, useState } from "react";
import { useProducts } from "@/contexts/ProductsContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/Toast";
import { redirectWithAnalytics } from "@/lib/analytics";

// Shared "Get it now" → pincode-gate → buyNow flow. Used by both the home
// product section and the sticky header CTA so the two entry points resolve the
// same variant and behave identically.
export function useGetItNow() {
  const { combinedProduct, getVariantByTonnage } = useProducts();
  const { buyNow } = useCart();
  const { showToast } = useToast();

  const [showPincodeModal, setShowPincodeModal] = useState(false);
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

  const handleGetItNow = () => {
    if (!variant?.variantId) {
      showToast("Product is currently unavailable", "error");
      return;
    }
    if (!variant.available) {
      showToast("This AC is out of stock", "error");
      return;
    }
    setShowPincodeModal(true);
  };

  const handleConfirmed = async () => {
    if (!variant?.variantId) return;
    setIsBuyNowLoading(true);
    try {
      const checkoutUrl = await buyNow(variant.variantId, 1);
      if (checkoutUrl) {
        redirectWithAnalytics(checkoutUrl);
      } else {
        showToast("Failed to initiate checkout", "error");
        setIsBuyNowLoading(false);
      }
    } catch {
      showToast("Failed to proceed to checkout", "error");
      setIsBuyNowLoading(false);
    }
  };

  const closeModal = () => {
    setShowPincodeModal(false);
    setIsBuyNowLoading(false);
  };

  return {
    variant,
    showPincodeModal,
    isBuyNowLoading,
    handleGetItNow,
    handleConfirmed,
    closeModal,
  };
}
