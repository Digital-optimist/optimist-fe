// Ambient typings for the Meta (Facebook) Pixel global `fbq`, installed at
// runtime by the base-code snippet in app/layout.tsx. Mirrors gtag.d.ts.
// Merges into the global Window interface alongside gtag/dataLayer.

interface Window {
  fbq?: (...args: unknown[]) => void;
  _fbq?: unknown;
}
