// ---------------------------------------------------------------------------
// IP-based city detection
//
// Optimist currently ships to three metros only — Delhi NCR, Bangalore and
// Hyderabad (the same zones as `usePincodeCheck`). This module resolves a
// visitor's approximate city from their IP (no permission prompt) so the PDP
// can show a city-specific scarcity line to serviceable shoppers.
//
// It is progressive enhancement: every failure path resolves to `null` and the
// caller simply renders nothing. Nothing here is allowed to throw.
// ---------------------------------------------------------------------------

export type CityZone = "delhi-ncr" | "bangalore" | "hyderabad";

export interface ServiceableCity {
  zone: CityZone;
  /** Display name shown in copy, e.g. "Bengaluru". */
  label: string;
}

// Canonical display name per zone. Keeps the on-screen city predictable even
// when the IP lookup returns a suburb (e.g. Gurugram → "Delhi").
const ZONE_LABEL: Record<CityZone, string> = {
  "delhi-ncr": "Delhi",
  bangalore: "Bengaluru",
  hyderabad: "Hyderabad",
};

// Normalised city name → zone. Includes the common NCR satellite cities so a
// shopper routed through Gurugram/Noida still counts as serviceable, matching
// the `delhi-ncr` pincode zone.
const CITY_TO_ZONE: Record<string, CityZone> = {
  delhi: "delhi-ncr",
  "new delhi": "delhi-ncr",
  gurugram: "delhi-ncr",
  gurgaon: "delhi-ncr",
  noida: "delhi-ncr",
  "greater noida": "delhi-ncr",
  ghaziabad: "delhi-ncr",
  faridabad: "delhi-ncr",
  bengaluru: "bangalore",
  bangalore: "bangalore",
  hyderabad: "hyderabad",
  secunderabad: "hyderabad",
};

const normalize = (value: string | null | undefined): string =>
  (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");

/**
 * Map a raw `city` (and `region` as a fallback) from a geo-IP response onto one
 * of the three serviceable zones. Returns `null` when the location is outside
 * the delivery footprint. Pure — exported for unit testing.
 */
export function resolveServiceableCity(
  city?: string | null,
  region?: string | null,
): ServiceableCity | null {
  const c = normalize(city);
  const zone = CITY_TO_ZONE[c];
  if (zone) return { zone, label: ZONE_LABEL[zone] };

  // Delhi is a city-state: when the IP only resolves to the territory, still
  // treat it as the Delhi NCR zone.
  const r = normalize(region);
  if (r === "delhi" || r === "national capital territory of delhi") {
    return { zone: "delhi-ncr", label: ZONE_LABEL["delhi-ncr"] };
  }

  return null;
}

// ---------------------------------------------------------------------------
// IP lookup — cached per session, deduped per page
// ---------------------------------------------------------------------------

// Free, keyless, HTTPS + CORS geo-IP endpoint. Swap for a keyed provider (or
// your own edge function) if you outgrow its rate limits — only the parsing of
// `city` / `region` below depends on the response shape.
const GEO_ENDPOINT = "https://ipwho.is/";
const REQUEST_TIMEOUT_MS = 6000;
const SESSION_KEY = "optimist_geo_city";

// Dedupe concurrent callers within a single page render.
let inFlight: Promise<ServiceableCity | null> | null = null;

// `undefined` = nothing cached yet; `null` = cached "not serviceable".
function readSession(): ServiceableCity | null | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw === null) return undefined;
    return JSON.parse(raw) as ServiceableCity | null;
  } catch {
    return undefined;
  }
}

function writeSession(value: ServiceableCity | null): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(value));
  } catch {
    /* private mode or quota — detection just won't persist */
  }
}

/**
 * Resolve the visitor's serviceable city from their IP, or `null` if they are
 * outside the footprint / detection failed. The result is cached in
 * `sessionStorage` so repeat navigations within a session don't re-hit the API.
 * Never rejects.
 */
export async function detectCity(): Promise<ServiceableCity | null> {
  const cached = readSession();
  if (cached !== undefined) return cached;
  if (inFlight) return inFlight;

  inFlight = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(GEO_ENDPOINT, { signal: controller.signal });
      if (!res.ok) return null;

      const data = (await res.json()) as {
        success?: boolean;
        city?: string;
        region?: string;
      };
      // ipwho.is signals lookup failures with `success: false`.
      if (data.success === false) return null;

      const resolved = resolveServiceableCity(data.city, data.region);
      writeSession(resolved); // cache deterministic outcomes (incl. "not serviceable")
      return resolved;
    } catch {
      // Network error / abort — don't cache, so the next navigation can retry.
      return null;
    } finally {
      clearTimeout(timer);
      inFlight = null;
    }
  })();

  return inFlight;
}
