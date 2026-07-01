"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, ExternalLink } from "lucide-react";
import { getLastOrder } from "@/lib/pendingOrder";
import type { CompleteCheckoutResponse } from "@/lib/razorpay-magic";

function formatINR(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function OrderConfirmationPage() {
  const [state, setState] = useState<{
    order: CompleteCheckoutResponse | null;
    loaded: boolean;
  }>({ order: null, loaded: false });
  const { order, loaded } = state;

  useEffect(() => {
    // One-time read of client-only sessionStorage after mount (it's empty during
    // the static prerender), so a single post-mount setState is correct here.
    // NOTE: the GA4 + Meta `purchase` conversion is fired once at order
    // completion in MagicCheckoutContext — NOT here. Firing on this page raced
    // GA4's lazy-loaded gtag (often dropping the event) and double-counted on
    // refresh, and never reached Meta at all.
    const result = getLastOrder();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ order: result, loaded: true });
  }, []);

  return (
    <div className="min-h-screen bg-white pb-16">
      <div className="max-w-[640px] mx-auto px-6 lg:px-12 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9 text-emerald-500" />
        </div>

        <h1 className="text-[26px] md:text-[32px] font-bold text-[#0A0A0A]">
          Thank you for your order!
        </h1>

        {loaded && order ? (
          <>
            <p className="text-[15px] text-[#737373] mt-3">
              Your payment was successful and your order is confirmed.
            </p>

            <div className="mt-8 border border-[#E5E5E5] rounded-2xl p-6 text-left space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-[#737373]">Order</span>
                <span className="text-[15px] font-semibold text-[#0A0A0A]">
                  {order.order_id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-[#737373]">Amount paid</span>
                <span className="text-[15px] font-semibold text-[#0A0A0A]">
                  {formatINR(order.total_amount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-[#737373]">Payment ID</span>
                <span className="text-[13px] font-medium text-[#0A0A0A]">
                  {order.payment_id}
                </span>
              </div>
              {order.customer_details?.shipping_address?.name && (
                <div className="flex justify-between items-start gap-4">
                  <span className="text-[14px] text-[#737373]">Shipping to</span>
                  <span className="text-[13px] text-[#0A0A0A] text-right">
                    {order.customer_details.shipping_address.name},{" "}
                    {order.customer_details.shipping_address.city}{" "}
                    {order.customer_details.shipping_address.zipcode}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              {order.order_status_url && (
                <a
                  href={order.order_status_url}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#0A0A0A] text-white font-semibold hover:bg-[#1a1a1a] transition-colors"
                >
                  Track your order
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-[#E5E5E5] text-[#0A0A0A] font-semibold hover:bg-[#F5F5F5] transition-colors"
              >
                Continue shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="text-[15px] text-[#737373] mt-3 max-w-md mx-auto">
              {loaded
                ? "Your order is confirmed. You can view the details in your account."
                : "Loading your order details…"}
            </p>
            {loaded && (
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/account/orders"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#0A0A0A] text-white font-semibold hover:bg-[#1a1a1a] transition-colors"
                >
                  <Package className="w-4 h-4" />
                  View my orders
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-[#E5E5E5] text-[#0A0A0A] font-semibold hover:bg-[#F5F5F5] transition-colors"
                >
                  Continue shopping
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
