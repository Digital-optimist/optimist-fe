"use client";

// Isolated end-to-end tester for the Razorpay Magic Checkout flow.
// It drives the API directly (createCart → Step 1 → Step 2 → modal → Step 5)
// and prints every step's RAW request/response so the tax_details, order amount,
// and Complete result/error are all visible inline. It does NOT use the app's
// CartContext / entry points, so it cannot affect the live checkout.

import { useState } from "react";
import { createCart } from "@/lib/shopify";
import { loadRazorpay } from "@/lib/loadRazorpay";
import {
  RAZORPAY_KEY_ID,
  createMagicCheckoutId,
  createMagicOrder,
  completeMagicCheckout,
} from "@/lib/razorpay-magic";

const DEFAULT_VARIANT = "gid://shopify/ProductVariant/43202653323342";

type Level = "info" | "ok" | "error";
interface Entry {
  label: string;
  data?: unknown;
  level: Level;
}

export default function MagicCheckoutTester() {
  const [variantId, setVariantId] = useState(DEFAULT_VARIANT);
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<Entry[]>([]);

  const proxy =
    process.env.NEXT_PUBLIC_RAZORPAY_PROXY_URL || "(direct: api.razorpay.com)";
  const keyHint = RAZORPAY_KEY_ID
    ? `${RAZORPAY_KEY_ID.slice(0, 12)}…`
    : "❌ MISSING";

  const push = (level: Level, label: string, data?: unknown) =>
    setLog((p) => [...p, { level, label, data }]);

  const run = async () => {
    setBusy(true);
    setLog([]);
    try {
      if (!RAZORPAY_KEY_ID) {
        throw new Error(
          "NEXT_PUBLIC_RAZORPAY_KEY_ID is not set in this build/env",
        );
      }
      push("info", "Config", { key_id: keyHint, proxy });

      push("info", "1 · Creating Shopify cart…", { variantId, quantity });
      const cart = await createCart([{ merchandiseId: variantId, quantity }]);
      push("ok", "Cart created", {
        id: cart.id,
        subtotal: cart.cost.subtotalAmount,
        total: cart.cost.totalAmount,
        totalTax: cart.cost.totalTaxAmount,
      });

      push("info", "Loading Razorpay SDK…");
      await loadRazorpay();
      push("ok", "SDK ready");

      push("info", "2 · Step 1 — create checkout id…");
      const step1 = await createMagicCheckoutId(cart);
      push("ok", "Step 1 ✓  ← check tax_details here", step1);

      push("info", "3 · Step 2 — create order id…");
      const step2 = await createMagicOrder(step1.shopify_checkout_id);
      push("ok", "Step 2 ✓", step2);

      push(
        "info",
        "4 · Opening Magic Checkout modal — complete the payment in the modal…",
      );
      const Ctor = window.Razorpay;
      if (!Ctor) throw new Error("window.Razorpay unavailable after load");
      const rzp = new Ctor({
        key: RAZORPAY_KEY_ID,
        name: "Optimist (TEST)",
        order_id: step2.order_id,
        show_coupons: true,
        theme: { color: "#0A0A0A" },
        handler: (resp) => {
          push("ok", "Payment captured ✓", resp);
          push("info", "5 · Step 5 — Complete (creates the Shopify order)…");
          completeMagicCheckout(resp.razorpay_payment_id, resp.razorpay_order_id)
            .then((done) =>
              push("ok", "Step 5 Complete ✓ — Shopify order created", done),
            )
            .catch((e) =>
              push(
                "error",
                "Step 5 Complete ✗",
                e instanceof Error ? e.message : String(e),
              ),
            );
        },
        modal: {
          ondismiss: () => push("info", "Modal dismissed (no payment captured)"),
        },
      });
      rzp.on("payment.failed", (r) => push("error", "payment.failed", r?.error));
      rzp.open();
      push("info", "Modal opened — finish the payment to trigger Step 5.");
    } catch (e) {
      push("error", "ERROR", e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 px-6">
      <div className="max-w-[760px] mx-auto">
        <h1 className="text-[24px] font-bold text-[#0A0A0A]">
          Magic Checkout — Internal Test
        </h1>
        <p className="text-[13px] text-[#737373] mt-1">
          Isolated test of the Razorpay flow (Step 1 → 2 → modal → 5). It does
          not touch the live checkout. Unlisted / noindex page.
        </p>

        <div className="mt-4 rounded-lg border border-[#E5E5E5] p-3 text-[12px] text-[#555] grid grid-cols-1 sm:grid-cols-2 gap-1">
          <div>
            key_id: <span className="font-mono">{keyHint}</span>
          </div>
          <div>
            proxy: <span className="font-mono break-all">{proxy}</span>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <label className="text-[12px] font-semibold text-[#555]">
            Variant GID
            <input
              value={variantId}
              onChange={(e) => setVariantId(e.target.value)}
              className="mt-1 w-full h-[40px] px-3 rounded-lg border border-[#ddd] font-mono text-[13px] outline-none focus:border-[#3478F6]"
            />
          </label>
          <label className="text-[12px] font-semibold text-[#555] w-[140px]">
            Quantity
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Number(e.target.value) || 1))
              }
              className="mt-1 w-full h-[40px] px-3 rounded-lg border border-[#ddd] text-[13px] outline-none focus:border-[#3478F6]"
            />
          </label>
          <button
            type="button"
            onClick={() => void run()}
            disabled={busy}
            className="h-[44px] rounded-full bg-[#0A0A0A] text-white font-semibold border-none cursor-pointer disabled:opacity-50"
          >
            {busy ? "Running…" : "Run full Magic Checkout flow"}
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-[13px] font-semibold text-[#0A0A0A] mb-2">Log</h2>
          <div className="rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] p-3 space-y-2 text-[12px] font-mono max-h-[60vh] overflow-auto">
            {log.length === 0 && (
              <div className="text-[#999]">No run yet.</div>
            )}
            {log.map((e, i) => (
              <div
                key={i}
                className={
                  e.level === "error"
                    ? "text-red-600"
                    : e.level === "ok"
                      ? "text-emerald-700"
                      : "text-[#333]"
                }
              >
                <div className="font-semibold">{e.label}</div>
                {e.data != null && (
                  <pre className="whitespace-pre-wrap break-all text-[11px] mt-0.5 text-[#555]">
                    {typeof e.data === "string"
                      ? e.data
                      : JSON.stringify(e.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
