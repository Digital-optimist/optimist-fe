"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, getCartLines } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/shopify";
import { CartItem } from "./CartItem";
import PincodeModal from "@/components/ui/PincodeModal";
import { redirectWithAnalytics } from "@/lib/analytics";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
};

export function CartDrawer() {
  const { cart, isCartOpen, closeCart, totalQuantity, isLoading } = useCart();
  const [showPincodeModal, setShowPincodeModal] = useState(false);

  const cartLines = getCartLines(cart);
  const subtotal = cart?.cost.subtotalAmount;
  const checkoutUrl = cart?.checkoutUrl;

  const handleCheckoutClick = useCallback(() => {
    if (!checkoutUrl || isLoading) return;
    setShowPincodeModal(true);
  }, [checkoutUrl, isLoading]);

  const handleCheckoutConfirmed = useCallback(() => {
    if (checkoutUrl) {
      redirectWithAnalytics(checkoutUrl);
    }
  }, [checkoutUrl]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isCartOpen, closeCart]);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  return (
  <>
    <AnimatePresence>
      {isCartOpen && (
        <div
          className="fixed inset-0 z-[60]"
          aria-modal="true"
          role="dialog"
        >
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/40"
            onClick={closeCart}
          />

          {/* Panel */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute top-0 right-0 h-full w-full max-w-md bg-white border-l border-[#E5E5E5] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#0A0A0A]" />
                <h2 className="text-[16px] font-semibold text-[#0A0A0A]">
                  Your Cart
                </h2>
                {totalQuantity > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-[#3478F6] text-white rounded-full">
                    {totalQuantity}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-[#737373] hover:text-[#0A0A0A] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6">
              {cartLines.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-[#737373]" />
                  </div>
                  <p className="text-[16px] font-semibold text-[#0A0A0A] mb-2">
                    Your cart is empty
                  </p>
                  <p className="text-[14px] text-[#737373] mb-6">
                    Add some products to get started
                  </p>
                  <Link
                    href="/products"
                    onClick={closeCart}
                    className="btn-buy-now inline-flex items-center gap-2 px-6 py-3 rounded-full text-[#FFFCDC] font-medium"
                  >
                    Browse Products
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="py-4 space-y-4">
                  {cartLines.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartLines.length > 0 && (
              <div className="border-t border-[#E5E5E5] px-6 py-5 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#737373]">Subtotal</span>
                  <span className="text-[16px] font-semibold text-[#0A0A0A]">
                    {subtotal
                      ? formatPrice(subtotal.amount, subtotal.currencyCode)
                      : "—"}
                  </span>
                </div>
                <p className="text-[13px] text-[#737373]">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleCheckoutClick}
                    disabled={!checkoutUrl || isLoading}
                    className="btn-buy-now flex items-center justify-center gap-2 w-full py-3 rounded-full text-[#FFFCDC] font-medium border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-[#FFFCDC]/30 border-t-[#FFFCDC] rounded-full animate-spin" />
                    ) : (
                      <>
                        Checkout
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="flex items-center justify-center w-full py-3 rounded-full text-[14px] font-medium text-[#0A0A0A] border border-[rgba(0,0,0,0.12)] hover:border-[rgba(0,0,0,0.24)] hover:bg-[#F5F5F5] transition-all"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    <PincodeModal
      isOpen={showPincodeModal}
      onClose={() => setShowPincodeModal(false)}
      onConfirm={handleCheckoutConfirmed}
      confirmLabel="Proceed to Checkout →"
      loadingLabel="Redirecting…"
    />
  </>
  );
}
