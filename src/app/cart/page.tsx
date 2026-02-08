"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ShoppingBag, ArrowRight, ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { useCart, getCartLines } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/shopify";

export default function CartPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { cart, updateQuantity, removeFromCart, isLoading, totalQuantity } = useCart();

  const cartLines = getCartLines(cart);
  const subtotal = cart?.cost.subtotalAmount;
  const total = cart?.cost.totalAmount;
  const checkoutUrl = cart?.checkoutUrl;

  useGSAP(
    () => {
      const elements = containerRef.current?.querySelectorAll(".animate-in");
      if (!elements) return;

      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="min-h-screen pt-24 pb-16">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="animate-in mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-optimist-cream-muted hover:text-optimist-cream transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-optimist-cream">
            Shopping Cart
          </h1>
          {totalQuantity > 0 && (
            <p className="text-optimist-cream-muted mt-2">
              {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
            </p>
          )}
        </div>

        {cartLines.length === 0 ? (
          /* Empty Cart */
          <div className="animate-in text-center py-16">
            <ShoppingBag className="w-20 h-20 text-optimist-cream-muted mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-optimist-cream mb-3">
              Your cart is empty
            </h2>
            <p className="text-optimist-cream-muted mb-8 max-w-md mx-auto">
              Looks like you haven't added any products yet. Browse our collection
              to find something you'll love.
            </p>
            <Link
              href="/products"
              className="btn-primary px-8 py-4 rounded-full text-[#FFFCDC] font-semibold inline-flex items-center gap-2"
            >
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Table Header - Desktop */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-optimist-border text-sm font-medium text-optimist-cream-muted animate-in">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Cart Items */}
              {cartLines.map((item, index) => {
                const { merchandise, quantity } = item;
                const product = merchandise.product;
                const image = product.featuredImage;
                const variantTitle =
                  merchandise.title !== "Default Title" ? merchandise.title : null;
                const itemTotal = (
                  parseFloat(merchandise.price.amount) * quantity
                ).toString();

                return (
                  <div
                    key={item.id}
                    className="animate-in grid grid-cols-1 md:grid-cols-12 gap-4 py-6 border-b border-optimist-border items-center"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Product */}
                    <div className="md:col-span-6 flex gap-4">
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-optimist-dark">
                        {image ? (
                          <Image
                            src={image.url}
                            alt={image.altText || product.title}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-optimist-cream-muted text-xs">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <Link
                          href="/products"
                          className="font-medium text-optimist-cream hover:text-optimist-blue-light transition-colors"
                        >
                          {product.title}
                        </Link>
                        {variantTitle && (
                          <p className="text-sm text-optimist-cream-muted mt-1">
                            {variantTitle}
                          </p>
                        )}
                        {/* Mobile Price */}
                        <p className="md:hidden text-sm text-optimist-cream mt-2">
                          {formatPrice(
                            merchandise.price.amount,
                            merchandise.price.currencyCode
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Price - Desktop */}
                    <div className="hidden md:block md:col-span-2 text-center text-optimist-cream">
                      {formatPrice(
                        merchandise.price.amount,
                        merchandise.price.currencyCode
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="md:col-span-2 flex items-center justify-start md:justify-center gap-2">
                      <div className="flex items-center border border-optimist-border rounded-lg">
                        <button
                          onClick={() =>
                            quantity > 1
                              ? updateQuantity(item.id, quantity - 1)
                              : removeFromCart(item.id)
                          }
                          disabled={isLoading}
                          className="p-2 text-optimist-cream-muted hover:text-optimist-cream transition-colors disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center text-optimist-cream">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, quantity + 1)}
                          disabled={isLoading}
                          className="p-2 text-optimist-cream-muted hover:text-optimist-cream transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        disabled={isLoading}
                        className="p-2 text-optimist-cream-muted hover:text-optimist-red transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Total */}
                    <div className="md:col-span-2 text-right font-semibold text-optimist-cream">
                      {formatPrice(itemTotal, merchandise.price.currencyCode)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="animate-in sticky top-24 bg-optimist-dark rounded-2xl p-6 space-y-6">
                <h2 className="text-lg font-semibold text-optimist-cream">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-optimist-cream-muted">Subtotal</span>
                    <span className="text-optimist-cream">
                      {subtotal
                        ? formatPrice(subtotal.amount, subtotal.currencyCode)
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-optimist-cream-muted">Shipping</span>
                    <span className="text-optimist-cream-muted">
                      Calculated at checkout
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-optimist-cream-muted">Tax</span>
                    <span className="text-optimist-cream-muted">
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                <div className="border-t border-optimist-border pt-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-optimist-cream">Total</span>
                    <span className="text-xl font-bold text-optimist-cream">
                      {total
                        ? formatPrice(total.amount, total.currencyCode)
                        : "—"}
                    </span>
                  </div>
                </div>

                <a
                  href={checkoutUrl || "#"}
                  className={`w-full btn-primary px-6 py-4 rounded-full text-[#FFFCDC] font-semibold flex items-center justify-center gap-2 ${
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
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </a>

                <p className="text-xs text-center text-optimist-cream-muted">
                  Secure checkout powered by Shopify
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
