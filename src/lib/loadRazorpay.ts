// Loads the Razorpay Magic Checkout Web SDK on demand and resolves once
// `window.Razorpay` is available. The script is also preloaded in layout.tsx
// (lazyOnload) so it is usually ready before the shopper reaches checkout; this
// helper guarantees readiness even if that preload was blocked or hasn't run,
// and surfaces a clean error if the network drops it.

const SCRIPT_ID = "razorpay-magic-sdk";
const SCRIPT_SRC = "https://checkout.razorpay.com/v1/magic-checkout.js";
const LOAD_TIMEOUT_MS = 12000;

let loadPromise: Promise<void> | null = null;

export function loadRazorpay(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay can only load in the browser"));
  }
  if (window.Razorpay) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      loadPromise = null; // allow a later retry
      reject(new Error("Razorpay SDK load timed out"));
    }, LOAD_TIMEOUT_MS);

    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (ok && window.Razorpay) {
        resolve();
      } else {
        loadPromise = null; // allow a later retry
        reject(new Error("Razorpay SDK failed to load"));
      }
    };

    const existing = document.getElementById(
      SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existing) {
      // A tag is already present (e.g. the layout preload). It may have finished
      // (window.Razorpay would be set, handled above) or still be loading — so
      // attach listeners to catch whichever happens.
      existing.addEventListener("load", () => finish(true));
      existing.addEventListener("error", () => finish(false));
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.addEventListener("load", () => finish(true));
    script.addEventListener("error", () => finish(false));
    document.body.appendChild(script);
  });

  return loadPromise;
}

export function isRazorpayReady(): boolean {
  return typeof window !== "undefined" && !!window.Razorpay;
}
