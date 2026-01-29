"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AccountLayout } from "@/components/account";
import { getCustomerOrders, formatPrice, type Order } from "@/lib/shopify";

// Animation variants
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

export default function OrdersPage() {
  const router = useRouter();
  const { accessToken, customer, isAuthenticated, isLoading: isAuthLoading } =
    useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  // Fetch orders
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
        {/* Section Header */}
        <motion.div
          variants={fadeInUp}
          className="pb-6 border-b border-[#E5E5E5]"
        >
          <h1 className="text-[24px] font-semibold text-[#0A0A0A] leading-[1.5]">
            Past orders
          </h1>
          <p className="text-[16px] text-[#737373] leading-[1.5]">
            View and track your order history
          </p>
        </motion.div>

        {/* Orders List */}
        {isLoading ? (
          <motion.div variants={fadeInUp} className="py-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-[#F5F5F5] rounded-xl animate-pulse"
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
            <a
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium"
              style={{
                background:
                  "linear-gradient(176.74deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
                boxShadow: "inset 0px 2px 12.5px 2px #003FB2",
              }}
            >
              Start Shopping
            </a>
          </motion.div>
        ) : (
          <motion.div variants={fadeInUp} className="divide-y divide-[#E5E5E5]">
            {orders.map((order, index) => (
              <OrderCard
                key={order.id}
                order={order}
                index={index}
                isExpanded={expandedOrder === order.id}
                onToggle={() =>
                  setExpandedOrder(expandedOrder === order.id ? null : order.id)
                }
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </AccountLayout>
  );
}

function OrderCard({
  order,
  index,
  isExpanded,
  onToggle,
}: {
  order: Order;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    PAID: { bg: "bg-emerald-100", text: "text-emerald-700" },
    PENDING: { bg: "bg-amber-100", text: "text-amber-700" },
    REFUNDED: { bg: "bg-red-100", text: "text-red-700" },
    FULFILLED: { bg: "bg-[rgba(52,120,246,0.1)]", text: "text-[#3478F6]" },
    UNFULFILLED: { bg: "bg-[#F5F5F5]", text: "text-[#737373]" },
  };

  const date = new Date(order.processedAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const lineItems = order.lineItems.edges.map((e) => e.node);
  const status = statusColors[order.fulfillmentStatus] || statusColors.UNFULFILLED;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="py-4"
    >
      {/* Order Header - Clickable */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-[#FAFAFA] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F5F5F5] flex items-center justify-center">
            <Package className="w-6 h-6 text-[#737373]" />
          </div>
          <div className="text-left">
            <p className="text-[16px] font-semibold text-[#0A0A0A]">
              {order.name}
            </p>
            <div className="flex items-center gap-3 mt-1 text-[14px] text-[#737373]">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {date}
              </span>
              <span>•</span>
              <span>
                {lineItems.length} item{lineItems.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[16px] font-semibold text-[#0A0A0A]">
              {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
            </p>
            <span
              className={`inline-block mt-1 px-2 py-0.5 text-[12px] rounded-full ${status.bg} ${status.text}`}
            >
              {order.fulfillmentStatus.replace("_", " ")}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-[#737373]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#737373]" />
          )}
        </div>
      </button>

      {/* Order Details - Expandable */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 space-y-4">
              {/* Line Items */}
              <div className="space-y-3 p-4 bg-[#FAFAFA] rounded-xl">
                {lineItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#E5E5E5] flex-shrink-0">
                      {item.variant?.image ? (
                        <Image
                          src={item.variant.image.url}
                          alt={item.title}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#737373]">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-[#0A0A0A] truncate">
                        {item.title}
                      </p>
                      <p className="text-[13px] text-[#737373]">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    {item.variant?.price && (
                      <p className="text-[14px] font-medium text-[#0A0A0A]">
                        {formatPrice(
                          item.variant.price.amount,
                          item.variant.price.currencyCode
                        )}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="flex items-start gap-3 p-4 bg-[#FAFAFA] rounded-xl">
                  <MapPin className="w-5 h-5 text-[#737373] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[14px] font-medium text-[#0A0A0A] mb-1">
                      Shipping Address
                    </p>
                    <address className="not-italic text-[13px] text-[#737373] space-y-0.5">
                      <p>
                        {order.shippingAddress.firstName}{" "}
                        {order.shippingAddress.lastName}
                      </p>
                      {order.shippingAddress.address1 && (
                        <p>{order.shippingAddress.address1}</p>
                      )}
                      {order.shippingAddress.address2 && (
                        <p>{order.shippingAddress.address2}</p>
                      )}
                      <p>
                        {[
                          order.shippingAddress.city,
                          order.shippingAddress.province,
                          order.shippingAddress.zip,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      {order.shippingAddress.country && (
                        <p>{order.shippingAddress.country}</p>
                      )}
                    </address>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
