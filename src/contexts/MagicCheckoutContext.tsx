"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useCart, buildBusinessCartAttributes } from "./CartContext";
import { useAuth } from "./AuthContext";
import { useToast } from "@/components/ui/Toast";
import type { Cart } from "@/lib/shopify";
import { loadRazorpay } from "@/lib/loadRazorpay";
import {
  RAZORPAY_KEY_ID,
  createMagicCheckoutId,
  createMagicOrder,
  completeMagicCheckoutWithRetry,
  MagicCheckoutError,
} from "@/lib/razorpay-magic";
import {
  captureUtmOnce,
  getCheckoutAnalytics,
  waitForAnalyticsCookies,
} from "@/lib/analytics";
import { trackMagicCheckoutEvent, trackPurchase } from "@/lib/analytics-events";
import { saCheckout, saPurchase } from "@/lib/saleassist-events";
import { getClaimedCoupon } from "@/lib/coupon";
import {
  savePendingOrder,
  getPendingOrder,
  clearPendingOrder,
  isPendingExpired,
  saveLastOrder,
} from "@/lib/pendingOrder";

const STORE_NAME = "Optimist";
const THEME_COLOR = "#0A0A0A";
const CONFIRMATION_PATH = "/order-confirmation/";

/**
 * Razorpay's checkout snapshots `document.body`'s scroll styles when it opens
 * and re-applies them when it closes. Checkout can launch from inside the cart
 * drawer, which locks body scroll (`overflow: hidden`) — so Razorpay captures
 * "hidden" and restores it on dismiss/success, leaving the page permanently
 * unscrollable. Normalising the body (and html) to the unlocked state both
 * before opening (clean snapshot) and after closing (defensive backstop)
 * guarantees scrolling is restored once Razorpay is gone.
 */
function releaseBodyScrollLock(): void {
  if (typeof document === "undefined") return;
  const { body } = document;
  const html = document.documentElement;
  body.style.overflow = "";
  body.style.position = "";
  body.style.top = "";
  body.style.width = "";
  html.style.overflow = "";
}

type Phase = "idle" | "preparing" | "completing" | "completeError";

interface MagicCheckoutContextType {
  /**
   * Runs Steps 1→2 then opens the Magic Checkout modal. Resolves `true` once
   * the modal is open, or `false` on a pre-payment failure (already toasted).
   */
  startCheckout: (cart: Cart) => Promise<boolean>;
  phase: Phase;
  /** Steps 1/2 in flight — drive a "preparing" state on the trigger button. */
  isPreparing: boolean;
  /** Any stage of the flow is active. */
  isBusy: boolean;
}

const MagicCheckoutContext = createContext<MagicCheckoutContextType | null>(
  null,
);

export function MagicCheckoutProvider({ children }: { children: ReactNode }) {
  const {
    businessDetails,
    cart: persistentCart,
    clearCheckoutCart,
  } = useCart();
  const { customer } = useAuth();
  const { showToast } = useToast();

  const [phase, setPhase] = useState<Phase>("idle");
  const [lastPaymentId, setLastPaymentId] = useState<string | null>(null);

  // Guards re-entry between "modal opening" and "dismiss/success".
  const inFlightRef = useRef(false);
  // Set once payment is captured, so a late `ondismiss` can't tear down the
  // "Confirming your order…" overlay.
  const succeededRef = useRef(false);

  // -- crash recovery + attribution capture (runs once on mount) -------------
  useEffect(() => {
    captureUtmOnce();

    const pending = getPendingOrder();
    if (!pending) return;
    if (isPendingExpired(pending)) {
      clearPendingOrder();
      return;
    }
    // A payment was captured but Complete didn't confirm last time. Retry
    // silently — the server webhook is the authoritative backstop, so we don't
    // redirect or alarm the shopper; we just reconcile and clear.
    completeMagicCheckoutWithRetry(
      pending.razorpay_payment_id,
      pending.razorpay_order_id,
    )
      .then((result) => {
        saveLastOrder(result);
        // Recovered a payment that wasn't finalized last session — the purchase
        // conversion never fired, so fire it now (deduped by order id).
        saPurchase(result);
        trackPurchase(result);
        clearPendingOrder();
      })
      .catch(() => {
        /* leave the record for the next load / webhook */
      });
  }, []);

  const buildPrefill = useCallback(() => {
    const name = [customer?.firstName, customer?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
    const prefill: Record<string, string> = {};
    if (name) prefill.name = name;
    if (customer?.email) prefill.email = customer.email;
    if (customer?.phone) prefill.contact = customer.phone;
    const coupon = getClaimedCoupon();
    if (coupon) prefill.coupon_code = coupon;
    return prefill;
  }, [customer]);

  const finalizeOrder = useCallback(
    async (
      paymentId: string,
      orderId: string,
      checkoutCart: Cart,
    ): Promise<void> => {
      setPhase("completing");
      // Persist BEFORE the network call so a crash mid-Complete is recoverable.
      savePendingOrder({
        razorpay_payment_id: paymentId,
        razorpay_order_id: orderId,
        cartId: checkoutCart.id,
        createdAt: Date.now(),
      });
      try {
        const result = await completeMagicCheckoutWithRetry(paymentId, orderId);
        saveLastOrder(result);
        clearPendingOrder();
        // Only the persistent shopping cart needs clearing; "Buy Now" uses a
        // throwaway cart that was never persisted.
        if (persistentCart && persistentCart.id === checkoutCart.id) {
          clearCheckoutCart();
        }
        // Fire the purchase conversion here (not on the confirmation page): the
        // amount/currency are known and it can't double-count on refresh. Then
        // redirect once GA4 has actually dispatched the hit (trackPurchase uses
        // a beacon + event_callback, with a timeout fallback) so the conversion
        // isn't lost to the navigation. (SaleAssist purchase fires here too,
        // with the checkout cart's line items; both dedupe by order id.)
        saPurchase(result, checkoutCart);
        trackPurchase(result, () => {
          window.location.href = CONFIRMATION_PATH;
        });
      } catch {
        setLastPaymentId(paymentId);
        setPhase("completeError");
      }
    },
    [persistentCart, clearCheckoutCart],
  );

  const openModal = useCallback(
    (orderId: string, checkoutCart: Cart) => {
      const RazorpayCtor = window.Razorpay;
      if (!RazorpayCtor) {
        throw new MagicCheckoutError("Razorpay SDK unavailable", "order");
      }
      const rzp = new RazorpayCtor({
        key: RAZORPAY_KEY_ID,
        name: STORE_NAME,
        order_id: orderId,
        show_coupons: true,
        prefill: buildPrefill(),
        theme: { color: THEME_COLOR },
        handler: (response) => {
          succeededRef.current = true;
          // Razorpay's modal is closing — make sure the scroll lock it captured
          // on open is released (the completeError overlay keeps us on this page).
          releaseBodyScrollLock();
          void finalizeOrder(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            checkoutCart,
          );
        },
        modal: {
          confirm_close: true,
          escape: true,
          ondismiss: () => {
            // Razorpay fires ondismiss when the shopper closes the modal. After
            // a successful payment we're already finalizing, so ignore it.
            if (succeededRef.current) return;
            inFlightRef.current = false;
            setPhase("idle");
            // Restore scrolling on the next frame, after Razorpay's own teardown
            // (which would otherwise re-apply the locked body styles it snapshotted).
            requestAnimationFrame(releaseBodyScrollLock);
          },
        },
      });
      // Forward Magic Checkout's funnel analytics (initiate, otp_*,
      // shipping_selected, payment_initiated, …) to GA4 + Meta. Without this
      // listener none of the in-checkout events ever leave the SDK, which is why
      // the funnel was invisible in both dashboards. (integration doc: "mx-analytics")
      rzp.on("mx-analytics", (data) => {
        trackMagicCheckoutEvent(data);
      });
      // Magic Checkout keeps the modal open on a failed attempt so the shopper
      // can retry, and shows its own inline error — so we only log here and let
      // ondismiss handle teardown if they ultimately give up.
      rzp.on("payment.failed", (response) => {
        console.warn("Razorpay payment failed", response?.error);
      });
      // Clear any body scroll lock (set by the cart drawer) BEFORE opening, so
      // Razorpay snapshots the unlocked state and restores it — not "hidden" —
      // when the modal closes. This is the core scroll-stuck fix.
      releaseBodyScrollLock();
      rzp.open();
    },
    [buildPrefill, finalizeOrder],
  );

  const startCheckout = useCallback(
    async (cart: Cart): Promise<boolean> => {
      if (inFlightRef.current) return false;
      if (!RAZORPAY_KEY_ID) {
        showToast("Checkout is temporarily unavailable.", "error");
        return false;
      }
      if (!cart || cart.lines.edges.length === 0) {
        showToast("Your cart is empty.", "error");
        return false;
      }

      // SaleAssist: checkout initiated (covers Buy Now, "Get it now", and cart).
      saCheckout(cart);

      inFlightRef.current = true;
      succeededRef.current = false;
      setPhase("preparing");
      try {
        // GA4/Meta load asynchronously — start waiting for their cookies now so
        // an early click on an above-the-fold CTA (e.g. /home's "Get it now")
        // still captures attribution. Runs concurrently with the SDK load +
        // Step 1, so it adds no delay in the common case (and is bounded).
        const analyticsReady = waitForAnalyticsCookies();
        await loadRazorpay();

        // Business GST details (when verified) flow to the Shopify order's
        // Additional Attributes via Step 1, which drives downstream invoicing.
        const attributes =
          businessDetails.isBusinessPurchase && businessDetails.verified
            ? buildBusinessCartAttributes(businessDetails)
            : undefined;

        const { shopify_checkout_id } = await createMagicCheckoutId(cart, {
          attributes,
        });

        await analyticsReady;
        const { order_id } = await createMagicOrder(
          shopify_checkout_id,
          getCheckoutAnalytics(),
        );
        if (!order_id) {
          throw new MagicCheckoutError("Could not create order", "order");
        }

        openModal(order_id, cart);
        setPhase("idle"); // Razorpay's modal now owns the screen
        return true;
      } catch (err) {
        inFlightRef.current = false;
        setPhase("idle");
        const message =
          err instanceof MagicCheckoutError
            ? err.message
            : "Something went wrong starting checkout.";
        showToast(message, "error");
        return false;
      }
    },
    [businessDetails, openModal, showToast],
  );

  const retryComplete = useCallback(async () => {
    const pending = getPendingOrder();
    if (!pending) {
      setPhase("idle");
      return;
    }
    setPhase("completing");
    try {
      const result = await completeMagicCheckoutWithRetry(
        pending.razorpay_payment_id,
        pending.razorpay_order_id,
      );
      saveLastOrder(result);
      clearPendingOrder();
      if (persistentCart && persistentCart.id === pending.cartId) {
        clearCheckoutCart();
      }
      saPurchase(result);
      trackPurchase(result, () => {
        window.location.href = CONFIRMATION_PATH;
      });
    } catch {
      setPhase("completeError");
    }
  }, [persistentCart, clearCheckoutCart]);

  return (
    <MagicCheckoutContext.Provider
      value={{
        startCheckout,
        phase,
        isPreparing: phase === "preparing",
        isBusy: phase !== "idle",
      }}
    >
      {children}

      {phase === "completing" && (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm px-6 text-center">
          <Loader2 className="w-10 h-10 text-[#0A0A0A] animate-spin mb-5" />
          <h2 className="text-[18px] font-semibold text-[#0A0A0A]">
            Confirming your order…
          </h2>
          <p className="text-[14px] text-[#737373] mt-2 max-w-sm">
            Payment received. Please don&apos;t close or refresh this window.
          </p>
        </div>
      )}

      {phase === "completeError" && (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm px-6 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-4" />
          <h2 className="text-[18px] font-semibold text-[#0A0A0A]">
            Payment received
          </h2>
          <p className="text-[14px] text-[#737373] mt-2 max-w-md">
            We&apos;re finalizing your order. This can take a moment and will
            complete automatically.
            {lastPaymentId && (
              <>
                {" "}
                Keep this reference safe:{" "}
                <span className="font-medium text-[#0A0A0A]">
                  {lastPaymentId}
                </span>
                .
              </>
            )}
          </p>
          <div className="flex items-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => void retryComplete()}
              className="px-5 py-2.5 rounded-full bg-[#0A0A0A] text-white text-[14px] font-semibold hover:bg-[#1a1a1a] transition-colors border-none cursor-pointer"
            >
              Try again
            </button>
            <Link
              href="/account/orders"
              className="px-5 py-2.5 rounded-full border border-[#E5E5E5] text-[#0A0A0A] text-[14px] font-semibold hover:bg-[#F5F5F5] transition-colors"
            >
              View my orders
            </Link>
          </div>
          <p className="text-[12px] text-[#9CA3AF] mt-4 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Already charged once — you will not be charged again.
          </p>
        </div>
      )}
    </MagicCheckoutContext.Provider>
  );
}

export function useMagicCheckout() {
  const context = useContext(MagicCheckoutContext);
  if (!context) {
    throw new Error(
      "useMagicCheckout must be used within a MagicCheckoutProvider",
    );
  }
  return context;
}

export default MagicCheckoutContext;
