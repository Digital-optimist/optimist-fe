"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useCart, getCartLines } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/shopify";
import { CartItem } from "./CartItem";

export function CartDrawer() {
  const { cart, isCartOpen, closeCart, totalQuantity, isLoading } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const cartLines = getCartLines(cart);
  const subtotal = cart?.cost.subtotalAmount;
  const checkoutUrl = cart?.checkoutUrl;

  // Animation
  useGSAP(() => {
    if (!drawerRef.current || !overlayRef.current || !panelRef.current) return;

    if (isCartOpen) {
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(panelRef.current, {
        x: 0,
        duration: 0.4,
        ease: "power3.out",
      });
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
      gsap.to(panelRef.current, {
        x: "100%",
        duration: 0.3,
        ease: "power3.in",
      });
    }
  }, [isCartOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isCartOpen, closeCart]);

  // Prevent body scroll when open
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

  if (!isCartOpen) return null;

  return (
    <div
      ref={drawerRef}
      className="fixed inset-0 z-[60]"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/60 opacity-0"
        onClick={closeCart}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="absolute top-0 right-0 h-full w-full max-w-md bg-optimist-black border-l border-optimist-border translate-x-full flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-optimist-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-optimist-cream" />
            <h2 className="text-lg font-semibold text-optimist-cream">
              Your Cart
            </h2>
            {totalQuantity > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-optimist-blue-primary text-white rounded-full">
                {totalQuantity}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-optimist-cream-muted hover:text-optimist-cream transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {cartLines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-optimist-cream-muted mb-4" />
              <p className="text-lg font-medium text-optimist-cream mb-2">
                Your cart is empty
              </p>
              <p className="text-sm text-optimist-cream-muted mb-6">
                Add some products to get started
              </p>
              <Link
                href="/products"
                onClick={closeCart}
                className="btn-primary px-6 py-3 rounded-full text-[#FFFCDC] font-medium inline-flex items-center gap-2"
              >
                Browse Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="py-2">
              {cartLines.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartLines.length > 0 && (
          <div className="border-t border-optimist-border px-6 py-4 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-optimist-cream-muted">Subtotal</span>
              <span className="text-lg font-semibold text-optimist-cream">
                {subtotal
                  ? formatPrice(subtotal.amount, subtotal.currencyCode)
                  : "—"}
              </span>
            </div>
            <p className="text-xs text-optimist-cream-muted">
              Shipping and taxes calculated at checkout
            </p>

            {/* Actions */}
            <div className="space-y-2">
              <a
                href={checkoutUrl || "#"}
                className={`w-full btn-primary px-6 py-3 rounded-full text-[#FFFCDC] font-semibold flex items-center justify-center gap-2 ${
                  !checkoutUrl || isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={(e) => {
                  if (!checkoutUrl || isLoading) e.preventDefault();
                }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Checkout
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </a>
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full btn-secondary px-6 py-3 rounded-full text-optimist-cream font-medium flex items-center justify-center"
              >
                View Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
