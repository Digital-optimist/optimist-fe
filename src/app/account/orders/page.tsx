"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { AccountLayout } from "@/components/account";
import {
  getCustomerOrders,
  formatPrice,
  type Order,
  type OrderLineItem,
} from "@/lib/shopify";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

function getStatusDisplay(fulfillmentStatus: string): {
  label: string;
  color: string;
  dotColor: string;
  isDelivered: boolean;
} {
  switch (fulfillmentStatus) {
    case "FULFILLED":
      return {
        label: "Delivered",
        color: "text-[#16A34A]",
        dotColor: "bg-[#16A34A]",
        isDelivered: true,
      };
    case "IN_PROGRESS":
    case "PARTIALLY_FULFILLED":
      return {
        label: "In transit",
        color: "text-[#D97706]",
        dotColor: "bg-[#D97706]",
        isDelivered: false,
      };
    case "UNFULFILLED":
    case "PENDING_FULFILLMENT":
    default:
      return {
        label: "To be delivered",
        color: "text-[#D97706]",
        dotColor: "bg-[#D97706]",
        isDelivered: false,
      };
  }
}

function formatDeliveryDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OrdersPage() {
  const router = useRouter();
  const {
    accessToken,
    customer,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  useEffect(() => {
    async function fetchOrders() {
      if (!accessToken) return;
      try {
        const data = await getCustomerOrders(accessToken, 50);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (accessToken) {
      fetchOrders();
    }
  }, [accessToken]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-12 h-12 border-3 border-[#3478F6]/20 rounded-full" />
            <div className="absolute top-0 left-0 w-12 h-12 border-3 border-transparent border-t-[#3478F6] rounded-full animate-spin" />
          </div>
          <p className="text-[#737373] text-sm animate-pulse">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated || !customer) {
    return null;
  }

  return (
    <AccountLayout
      activeTab="orders"
      customerName={customer.firstName || "User"}
    >
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="w-full"
      >
        <motion.div
          variants={fadeInUp}
          className="pb-6 border-b border-[#E5E5E5]"
        >
          <h1 className="text-[24px] font-semibold text-[#0A0A0A] leading-[1.5]">
            Your Past Orders
          </h1>
          <p className="text-[16px] text-[#737373] leading-[1.5]">
            Here is a list of the purchases you made
          </p>
        </motion.div>

        {isLoading ? (
          <motion.div variants={fadeInUp} className="py-8 space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-[#F5F5F5] rounded-xl animate-pulse"
              />
            ))}
          </motion.div>
        ) : orders.length === 0 ? (
          <motion.div variants={fadeInUp} className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F5F5F5] flex items-center justify-center">
              <Package className="w-8 h-8 text-[#737373]" />
            </div>
            <h2 className="text-[18px] font-semibold text-[#0A0A0A] mb-2">
              No orders yet
            </h2>
            <p className="text-[#737373] mb-6">
              When you place orders, they will appear here
            </p>
            <Link
              href="/products123"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium"
              style={{
                background:
                  "linear-gradient(176.74deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
                boxShadow: "inset 0px 2px 12.5px 2px #003FB2",
              }}
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <motion.div variants={fadeInUp} className="space-y-6 pt-6">
            {orders.map((order, index) => (
              <OrderCard key={order.id} order={order} index={index} />
            ))}
          </motion.div>
        )}
      </motion.div>
    </AccountLayout>
  );
}

function OrderCard({ order, index }: { order: Order; index: number }) {
  const { addToCart } = useCart();
  const [buyingAgain, setBuyingAgain] = useState<string | null>(null);
  const lineItems = order.lineItems.edges.map((e) => e.node);
  const status = getStatusDisplay(order.fulfillmentStatus);
  const orderDate = formatDeliveryDate(order.processedAt);

  const handleBuyAgain = async (item: OrderLineItem) => {
    if (!item.variant?.id) return;
    setBuyingAgain(item.variant.id);
    try {
      await addToCart(item.variant.id, 1);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setBuyingAgain(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border border-[#E5E5E5] rounded-xl overflow-hidden"
    >
      {/* Order Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#FAFAFA] border-b border-[#E5E5E5]">
        <p className="text-[14px] text-[#737373]">
          Order ID{" "}
          <span className="text-[#0A0A0A] font-medium">{order.name}</span>
        </p>
        <div className="flex items-center gap-2">
          {status.isDelivered ? (
            <>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                className="flex-shrink-0"
              >
                <circle cx="9" cy="9" r="9" fill="#16A34A" />
                <path
                  d="M5.5 9L8 11.5L12.5 7"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[14px] font-medium text-[#16A34A]">
                Delivered on {orderDate}
              </span>
            </>
          ) : (
            <>
              <span
                className={`w-2.5 h-2.5 rounded-full ${status.dotColor}`}
              />
              <span className={`text-[14px] font-medium ${status.color}`}>
                {status.label}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Line Items */}
      {lineItems.map((item, i) => (
        <div
          key={i}
          className={`px-5 py-5 ${i < lineItems.length - 1 ? "border-b border-[#E5E5E5]" : ""}`}
        >
          <div className="flex gap-4 sm:gap-6">
            {/* Product Image */}
            <div className="relative w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-lg overflow-hidden bg-[#F5F5F5] border border-[#E5E5E5] flex-shrink-0">
              {item.variant?.image ? (
                <Image
                  src={item.variant.image.url}
                  alt={item.title}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#737373]">
                  <Package className="w-8 h-8" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <p className="text-[16px] font-semibold text-[#0A0A0A]">
                    {item.title}
                    <span className="text-[14px] font-normal text-[#737373] ml-2">
                      x {item.quantity}
                    </span>
                  </p>

                  {/* Variant Pills */}
                  {item.variant?.selectedOptions &&
                    item.variant.selectedOptions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.variant.selectedOptions
                          .filter(
                            (opt) =>
                              opt.name !== "Title" ||
                              opt.value !== "Default Title"
                          )
                          .map((opt) => (
                            <span
                              key={opt.name}
                              className="inline-flex items-center px-3 py-1 rounded-full text-[13px] text-[#737373] border border-[#E5E5E5] bg-white"
                            >
                              {opt.name}- {opt.value}
                            </span>
                          ))}
                      </div>
                    )}
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <p className="text-[13px] text-[#737373]">Total amount</p>
                  <p className="text-[16px] font-bold text-[#0A0A0A]">
                    {formatPrice(
                      String(
                        parseFloat(
                          item.variant?.price?.amount || "0"
                        ) * item.quantity
                      ),
                      item.variant?.price?.currencyCode || "INR"
                    )}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-[#F0F0F0]">
                <div className="flex items-center gap-4">
                  {item.variant?.product?.handle && (
                    <Link
                      href={`/products123/${item.variant.product.handle}`}
                      className="text-[14px] text-[#3478F6] hover:underline font-medium"
                    >
                      View product
                    </Link>
                  )}
                  {status.isDelivered && (
                    <button
                      onClick={() => handleBuyAgain(item)}
                      disabled={buyingAgain === item.variant?.id}
                      className="text-[14px] text-[#3478F6] hover:underline font-medium disabled:opacity-50 flex items-center gap-1"
                    >
                      {buyingAgain === item.variant?.id ? (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5 animate-pulse" />
                          Adding...
                        </>
                      ) : (
                        "Buy again"
                      )}
                    </button>
                  )}
                </div>
                <Link
                  href={`/account/orders/order?orderNumber=${order.orderNumber}`}
                  className="inline-flex items-center justify-center px-5 py-2 rounded-full text-[14px] font-medium text-white bg-[#0A0A0A] hover:bg-[#1a1a1a] transition-colors"
                >
                  Order details
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
