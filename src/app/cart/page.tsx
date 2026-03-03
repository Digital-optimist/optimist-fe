"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, ArrowLeft, Minus, Plus, Trash2, Package } from "lucide-react";
import { useCart, getCartLines } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/shopify";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, isLoading, totalQuantity } = useCart();

  const cartLines = getCartLines(cart);
  const subtotal = cart?.cost.subtotalAmount;
  const total = cart?.cost.totalAmount;
  const checkoutUrl = cart?.checkoutUrl;

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-28 lg:pt-32 pb-16">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="max-w-[1200px] mx-auto px-6 lg:px-12"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[14px] text-[#737373] hover:text-[#0A0A0A] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <h1 className="text-[28px] md:text-[32px] lg:text-[36px] font-bold text-[#0A0A0A]">
            Shopping Cart
          </h1>
          {totalQuantity > 0 && (
            <p className="text-[14px] text-[#737373] mt-2">
              {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
            </p>
          )}
        </motion.div>

        {cartLines.length === 0 ? (
          /* Empty Cart */
          <motion.div variants={fadeInUp} className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#F5F5F5] flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-[#737373]" />
            </div>
            <h2 className="text-[20px] font-semibold text-[#0A0A0A] mb-3">
              Your cart is empty
            </h2>
            <p className="text-[14px] text-[#737373] mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added any products yet. Browse our collection
              to find something you&apos;ll love.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold bg-[#0A0A0A] hover:bg-[#1a1a1a] transition-colors"
            >
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        ) : (
          <motion.div variants={fadeInUp} className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Table Header - Desktop */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-[#E5E5E5] text-[14px] font-medium text-[#737373]">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Cart Items */}
              {cartLines.map((item) => {
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
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 border-b border-[#E5E5E5] items-center"
                  >
                    {/* Product */}
                    <div className="md:col-span-6 flex gap-4">
                      <div className="relative w-[100px] h-[100px] flex-shrink-0 rounded-lg overflow-hidden bg-[#F5F5F5] border border-[#E5E5E5]">
                        {image ? (
                          <Image
                            src={image.url}
                            alt={image.altText || product.title}
                            fill
                            sizes="100px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#737373]">
                            <Package className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <Link
                          href="/products"
                          className="text-[15px] font-medium text-[#0A0A0A] hover:text-[#3478F6] transition-colors"
                        >
                          {product.title}
                        </Link>
                        {variantTitle && (
                          <p className="text-[13px] text-[#737373] mt-1">
                            {variantTitle}
                          </p>
                        )}
                        {/* Mobile Price */}
                        <p className="md:hidden text-[14px] text-[#0A0A0A] mt-2">
                          {formatPrice(
                            merchandise.price.amount,
                            merchandise.price.currencyCode
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Price - Desktop */}
                    <div className="hidden md:block md:col-span-2 text-center text-[14px] text-[#0A0A0A]">
                      {formatPrice(
                        merchandise.price.amount,
                        merchandise.price.currencyCode
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="md:col-span-2 flex items-center justify-start md:justify-center gap-2">
                      <div className="flex items-center border border-[#E5E5E5] rounded-lg">
                        <button
                          onClick={() =>
                            quantity > 1
                              ? updateQuantity(item.id, quantity - 1)
                              : removeFromCart(item.id)
                          }
                          disabled={isLoading}
                          className="p-2 text-[#737373] hover:text-[#0A0A0A] transition-colors disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center text-[14px] text-[#0A0A0A]">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, quantity + 1)}
                          disabled={isLoading}
                          className="p-2 text-[#737373] hover:text-[#0A0A0A] transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        disabled={isLoading}
                        className="p-2 text-[#737373] hover:text-red-500 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Total */}
                    <div className="md:col-span-2 text-right text-[15px] font-semibold text-[#0A0A0A]">
                      {formatPrice(itemTotal, merchandise.price.currencyCode)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 border border-[#E5E5E5] rounded-xl p-6 space-y-6">
                <h2 className="text-[16px] font-semibold text-[#0A0A0A]">
                  Order Summary
                </h2>

                <div className="space-y-3 text-[14px]">
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Subtotal</span>
                    <span className="font-medium text-[#0A0A0A]">
                      {subtotal
                        ? formatPrice(subtotal.amount, subtotal.currencyCode)
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Shipping</span>
                    <span className="text-[#737373]">
                      Calculated at checkout
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Tax</span>
                    <span className="text-[#737373]">
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#E5E5E5] pt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#0A0A0A]">Total</span>
                    <span className="text-[18px] font-bold text-[#0A0A0A]">
                      {total
                        ? formatPrice(total.amount, total.currencyCode)
                        : "—"}
                    </span>
                  </div>
                </div>

                <a
                  href={checkoutUrl || "#"}
                  className={`flex items-center justify-center gap-2 w-full py-4 rounded-full text-white font-semibold bg-[#0A0A0A] hover:bg-[#1a1a1a] transition-colors ${
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

                <p className="text-[12px] text-center text-[#737373]">
                  Secure checkout powered by Shopify
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
