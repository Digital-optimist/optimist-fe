"use client";

import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Package, ChevronRight, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AccountLayout } from "@/components/account";
import {
  getCustomerOrders,
  formatPrice,
  type Order,
} from "@/lib/shopify";

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

function getStatusDisplay(fulfillmentStatus: string) {
  switch (fulfillmentStatus) {
    case "FULFILLED":
      return { label: "Delivered", isDelivered: true };
    case "IN_PROGRESS":
    case "PARTIALLY_FULFILLED":
      return { label: "In transit", isDelivered: false };
    default:
      return { label: "To be delivered", isDelivered: false };
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function LoadingSpinner() {
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

function OrderDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const {
    accessToken,
    customer,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  useEffect(() => {
    async function fetchOrder() {
      if (!accessToken || !orderNumber) return;
      try {
        const orders = await getCustomerOrders(accessToken, 50);
        const found = orders.find(
          (o) => String(o.orderNumber) === orderNumber
        );
        setOrder(found || null);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (accessToken) {
      fetchOrder();
    }
  }, [accessToken, orderNumber]);

  if (isAuthLoading || isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !customer) {
    return null;
  }

  if (!orderNumber) {
    return (
      <AccountLayout
        activeTab="orders"
        customerName={customer.firstName || "User"}
      >
        <div className="py-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F5F5F5] flex items-center justify-center">
            <Package className="w-8 h-8 text-[#737373]" />
          </div>
          <h2 className="text-[18px] font-semibold text-[#0A0A0A] mb-2">
            Order not found
          </h2>
          <p className="text-[#737373] mb-6">
            We couldn&apos;t find this order in your history.
          </p>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium bg-[#0A0A0A] hover:bg-[#1a1a1a] transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </AccountLayout>
    );
  }

  if (!order) {
    return (
      <AccountLayout
        activeTab="orders"
        customerName={customer.firstName || "User"}
      >
        <div className="py-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F5F5F5] flex items-center justify-center">
            <Package className="w-8 h-8 text-[#737373]" />
          </div>
          <h2 className="text-[18px] font-semibold text-[#0A0A0A] mb-2">
            Order not found
          </h2>
          <p className="text-[#737373] mb-6">
            We couldn&apos;t find this order in your history.
          </p>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium bg-[#0A0A0A] hover:bg-[#1a1a1a] transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </AccountLayout>
    );
  }

  const lineItems = order.lineItems.edges.map((e) => e.node);
  const status = getStatusDisplay(order.fulfillmentStatus);
  const fulfillment = order.successfulFulfillments?.[0];

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
        {/* Breadcrumb */}
        <motion.nav
          variants={fadeInUp}
          className="flex items-center gap-1.5 text-[14px] text-[#737373] mb-6 flex-wrap"
        >
          <Link
            href="/account"
            className="hover:text-[#0A0A0A] transition-colors"
          >
            My Account
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href="/account/orders"
            className="hover:text-[#0A0A0A] transition-colors"
          >
            Past Orders
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#0A0A0A] font-medium">
            Order ID {order.name}
          </span>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column — Product + Delivery Info */}
          <div className="lg:col-span-3 space-y-6">
            {/* Product Card */}
            {lineItems.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="border border-[#E5E5E5] rounded-xl p-5"
              >
                <div className="flex gap-4 sm:gap-6">
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

                  <div className="flex-1 min-w-0">
                    <p className="text-[16px] font-semibold text-[#0A0A0A]">
                      {item.title}
                      <span className="text-[14px] font-normal text-[#737373] ml-2">
                        x {item.quantity}
                      </span>
                    </p>

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

                    <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-[#F0F0F0]">
                      <Link
                        href="/products123"
                        className="text-[14px] text-[#3478F6] hover:underline font-medium"
                      >
                        View product
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Delivery Information */}
            {order.shippingAddress && (
              <motion.div
                variants={fadeInUp}
                className="border border-[#E5E5E5] rounded-xl p-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#0A0A0A] mb-3">
                      Delivered to:
                    </h3>
                    <div className="text-[14px] text-[#737373] space-y-1">
                      <p>
                        {order.shippingAddress.firstName}{" "}
                        {order.shippingAddress.lastName}
                      </p>
                      {order.shippingAddress.phone && (
                        <p>Contact info- {order.shippingAddress.phone}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#0A0A0A] mb-3">
                      Delivered at:
                    </h3>
                    <address className="not-italic text-[14px] text-[#737373] space-y-0.5">
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
              </motion.div>
            )}
          </div>

          {/* Right Column — Status + Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Status */}
            <motion.div
              variants={fadeInUp}
              className="border border-[#E5E5E5] rounded-xl p-5"
            >
              {/* Status Header */}
              <div className="flex items-center gap-2 mb-5">
                {status.isDelivered ? (
                  <>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="flex-shrink-0"
                    >
                      <circle cx="10" cy="10" r="10" fill="#16A34A" />
                      <path
                        d="M6 10L9 13L14 7.5"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-[15px] font-semibold text-[#16A34A]">
                      Delivered on {formatDate(order.processedAt)}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 rounded-full bg-[#D97706]" />
                    <span className="text-[15px] font-semibold text-[#D97706]">
                      {status.label}
                    </span>
                  </>
                )}
              </div>

              {/* Tracking Info */}
              {fulfillment && (
                <div className="space-y-4">
                  {fulfillment.trackingCompany && (
                    <div className="flex items-center justify-between text-[14px]">
                      <span className="text-[#737373]">Shipped via</span>
                      <span className="font-medium text-[#0A0A0A]">
                        {fulfillment.trackingCompany}
                      </span>
                    </div>
                  )}
                  {fulfillment.trackingInfo?.[0]?.number && (
                    <div className="flex items-center justify-between text-[14px]">
                      <span className="text-[#737373]">Tracking number</span>
                      <span className="font-medium text-[#0A0A0A]">
                        {fulfillment.trackingInfo[0].number}
                      </span>
                    </div>
                  )}
                  {fulfillment.trackingInfo?.[0]?.url && (
                    <a
                      href={fulfillment.trackingInfo[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full border border-[#3478F6] text-[14px] font-medium text-[#3478F6] hover:bg-[rgba(52,120,246,0.05)] transition-colors"
                    >
                      Track order
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}

              {/* Shopify Order Status Link */}
              {order.statusUrl && !fulfillment?.trackingInfo?.[0]?.url && (
                <a
                  href={order.statusUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full border border-[#3478F6] text-[14px] font-medium text-[#3478F6] hover:bg-[rgba(52,120,246,0.05)] transition-colors mt-2"
                >
                  Track order
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {/* Order Timeline (basic: placed date + status) */}
              <div className="mt-5 pt-5 border-t border-[#E5E5E5]">
                <div className="relative pl-6 space-y-5">
                  {/* Order placed */}
                  <div className="relative">
                    <div className="absolute left-[-24px] top-[3px] w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                    <p className="text-[14px] font-medium text-[#0A0A0A]">
                      Order confirmed
                    </p>
                    <p className="text-[13px] text-[#737373]">
                      {formatDate(order.processedAt)}
                    </p>
                  </div>

                  {fulfillment?.trackingCompany && (
                    <div className="relative">
                      <div className="absolute left-[-24px] top-[3px] w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                      <p className="text-[14px] font-medium text-[#0A0A0A]">
                        Order shipped to {fulfillment.trackingCompany}
                      </p>
                    </div>
                  )}

                  {status.isDelivered && (
                    <div className="relative">
                      <div className="absolute left-[-24px] top-[3px] w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                      <p className="text-[14px] font-medium text-[#0A0A0A]">
                        Order delivered
                      </p>
                      <p className="text-[13px] text-[#737373]">
                        {formatDate(order.processedAt)}
                      </p>
                    </div>
                  )}

                  {/* Vertical line connecting dots */}
                  <div className="absolute left-[-20px] top-[8px] bottom-[8px] w-[1px] bg-[#16A34A]" />
                </div>
              </div>
            </motion.div>

            {/* Payment Summary */}
            <motion.div
              variants={fadeInUp}
              className="border border-[#E5E5E5] rounded-xl p-5"
            >
              <h3 className="text-[16px] font-semibold text-[#0A0A0A] mb-4">
                Payment summary
              </h3>

              <div className="space-y-3 text-[14px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#737373]">Purchase price</span>
                  <span className="font-medium text-[#0A0A0A]">
                    {formatPrice(
                      order.subtotalPrice.amount,
                      order.subtotalPrice.currencyCode
                    )}
                  </span>
                </div>

                {order.totalTax && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#737373]">Taxes</span>
                    <span className="font-medium text-[#0A0A0A]">
                      {formatPrice(
                        order.totalTax.amount,
                        order.totalTax.currencyCode
                      )}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[#737373]">Shipping charges</span>
                  <span className="font-medium text-[#0A0A0A]">
                    {parseFloat(order.totalShippingPrice.amount) === 0 ? (
                      <span className="text-[#16A34A] font-semibold">FREE</span>
                    ) : (
                      formatPrice(
                        order.totalShippingPrice.amount,
                        order.totalShippingPrice.currencyCode
                      )
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E5E5E5]">
                  <span className="font-semibold text-[#0A0A0A]">
                    Total amount
                  </span>
                  <span className="font-bold text-[#0A0A0A]">
                    {formatPrice(
                      order.totalPrice.amount,
                      order.totalPrice.currencyCode
                    )}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AccountLayout>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <OrderDetailContent />
    </Suspense>
  );
}
