export const GA4_ID = "G-FMPV82QJV9";

// =============================================================================
// Checkout attribution — best-effort analytics for Razorpay Magic Checkout
// Step 2 (`createMagicOrder`). Every field is optional; nothing here is allowed
// to throw or block checkout. The shape mirrors the integration doc's Step 2
// `analytics` / `ga_id` / `fb_analytics` / `utm_parameters` blocks.
// =============================================================================

// The GA4 session cookie is `_ga_<suffix>` where suffix is the id minus "G-".
const GA4_COOKIE_SUFFIX = GA4_ID.replace(/^G-/, "");
const UTM_STORAGE_KEY = "optimist_utm_v1";
const EXTERNAL_ID_KEY = "optimist_external_id";

const UTM_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "wbraid",
  "gbraid",
] as const;

interface StoredUtm {
  landing_page_url: string;
  [key: string]: string;
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/** Capture first-touch UTM + landing page once per session. Call on app mount. */
export function captureUtmOnce(): void {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(UTM_STORAGE_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const data: StoredUtm = { landing_page_url: window.location.href };
    for (const field of UTM_FIELDS) {
      const value = params.get(field);
      if (value) data[field] = value;
    }
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* sessionStorage unavailable — skip attribution */
  }
}

function getStoredUtm(): StoredUtm | null {
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredUtm) : null;
  } catch {
    return null;
  }
}

/** Stable per-browser id for Meta advanced matching (external_id). */
function getOrCreateExternalId(): string | undefined {
  try {
    let id = localStorage.getItem(EXTERNAL_ID_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `ext_${Date.now()}_${Math.floor(Math.random() * 1e9)}`;
      localStorage.setItem(EXTERNAL_ID_KEY, id);
    }
    return id;
  } catch {
    return undefined;
  }
}

/**
 * Assembles the analytics block for Razorpay Step 2. Returns only the fields we
 * can resolve (GA whenever the `_ga` cookie exists; FB only if a Pixel has set
 * `_fbp`; UTM/Google-Ads from first-touch capture).
 */
export function getCheckoutAnalytics(): Record<string, unknown> {
  if (typeof window === "undefined") return {};

  const sourceUrl = window.location.href;
  const ga = getCookie("_ga"); // "GA1.1.<client>.<ts>"
  const gaSession = getCookie(`_ga_${GA4_COOKIE_SUFFIX}`); // "GS1.1...."
  const fbp = getCookie("_fbp");
  const fbc = getCookie("_fbc");
  const utm = getStoredUtm();

  const payload: Record<string, unknown> = {};
  const analytics: Record<string, unknown> = { source_url: sourceUrl };

  if (ga) {
    payload.ga_id = ga;
    analytics.ga4 = {
      client_id: ga,
      ...(gaSession
        ? { session_ids: { [`_ga_${GA4_COOKIE_SUFFIX}`]: gaSession } }
        : {}),
    };
  }

  if (fbp) {
    const externalId = getOrCreateExternalId();
    const fb = {
      external_id: externalId ?? "",
      fbp,
      fbc: fbc ?? "",
    };
    payload.fb_analytics = { ...fb, event_source_url: sourceUrl };
    analytics.fb_analytics = fb;
  }

  if (utm) {
    if (utm.gclid || utm.wbraid || utm.gbraid) {
      analytics.google_ads = {
        gclid: utm.gclid ?? "",
        wbraid: utm.wbraid ?? "",
        gbraid: utm.gbraid ?? "",
      };
    }
    payload.utm_parameters = {
      landing_page_url: utm.landing_page_url ?? sourceUrl,
      user_agent: navigator.userAgent,
      utm_campaign: utm.utm_campaign ?? "",
      utm_content: utm.utm_content ?? "",
      utm_medium: utm.utm_medium ?? "",
      utm_source: utm.utm_source ?? "",
    };
  }

  payload.analytics = analytics;
  return payload;
}
