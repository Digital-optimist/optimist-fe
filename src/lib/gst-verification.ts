// GST Verification API service
// Currently uses a mock implementation for testing.
// Replace with real Surepass API proxy call when Lambda is deployed.

export interface GSTBillingAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  full: string;
}

export interface GSTVerificationResult {
  success: boolean;
  data?: {
    gstin: string;
    legalName: string;
    tradeName: string;
    status: "Active" | "Cancelled" | "Suspended" | "Inactive";
    state: string;
    businessType: string;
    dateOfRegistration: string;
    // Registered principal place of business — used as the GST billing address.
    address: GSTBillingAddress;
  };
  error?: string;
}

// Simulated latency for realistic UX testing
const MOCK_DELAY_MS = 1200;

const MOCK_DATABASE: Record<string, GSTVerificationResult["data"]> = {
  "29ABCDE1234F1Z5": {
    gstin: "29ABCDE1234F1Z5",
    legalName: "ACME TECHNOLOGIES PRIVATE LIMITED",
    tradeName: "Acme Tech",
    status: "Active",
    state: "Karnataka",
    businessType: "Private Limited Company",
    dateOfRegistration: "2018-07-01",
    address: {
      line1: "12, 2nd Floor",
      line2: "MG Road, Ashok Nagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
      country: "India",
      full: "12, 2nd Floor, MG Road, Ashok Nagar, Bengaluru, Karnataka, 560001",
    },
  },
  "27AABCU9603R1ZM": {
    gstin: "27AABCU9603R1ZM",
    legalName: "RELIANCE INDUSTRIES LIMITED",
    tradeName: "Reliance Industries",
    status: "Active",
    state: "Maharashtra",
    businessType: "Public Limited Company",
    dateOfRegistration: "2017-07-01",
    address: {
      line1: "3rd Floor, Maker Chambers IV",
      line2: "222, Nariman Point",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400021",
      country: "India",
      full: "3rd Floor, Maker Chambers IV, 222, Nariman Point, Mumbai, Maharashtra, 400021",
    },
  },
  "07AAACW8569R1ZE": {
    gstin: "07AAACW8569R1ZE",
    legalName: "WIPRO LIMITED",
    tradeName: "Wipro",
    status: "Active",
    state: "Delhi",
    businessType: "Public Limited Company",
    dateOfRegistration: "2017-07-01",
    address: {
      line1: "Plot No. 5, Sector 18",
      line2: "Dwarka",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110075",
      country: "India",
      full: "Plot No. 5, Sector 18, Dwarka, New Delhi, Delhi, 110075",
    },
  },
  "33AABCT1332L1ZB": {
    gstin: "33AABCT1332L1ZB",
    legalName: "TATA CONSULTANCY SERVICES LIMITED",
    tradeName: "TCS",
    status: "Active",
    state: "Tamil Nadu",
    businessType: "Public Limited Company",
    dateOfRegistration: "2017-07-01",
    address: {
      line1: "No. 1, Software Park",
      line2: "Siruseri SIPCOT IT Park",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "603103",
      country: "India",
      full: "No. 1, Software Park, Siruseri SIPCOT IT Park, Chennai, Tamil Nadu, 603103",
    },
  },
};

// GSTIN that will return "Cancelled" status for testing error states
const CANCELLED_GSTIN = "24AAACC1206D1ZM";

async function mockVerify(gstin: string): Promise<GSTVerificationResult> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  if (gstin === CANCELLED_GSTIN) {
    return {
      success: false,
      error: "This GSTIN is cancelled/inactive",
    };
  }

  const entry = MOCK_DATABASE[gstin];
  if (entry) {
    return { success: true, data: entry };
  }

  // For any structurally valid GSTIN not in the mock DB, generate a plausible response
  // This allows testing with any valid-format GSTIN
  const stateCode = gstin.substring(0, 2);
  const stateNames: Record<string, string> = {
    "01": "Jammu & Kashmir",
    "02": "Himachal Pradesh",
    "03": "Punjab",
    "04": "Chandigarh",
    "05": "Uttarakhand",
    "06": "Haryana",
    "07": "Delhi",
    "08": "Rajasthan",
    "09": "Uttar Pradesh",
    "10": "Bihar",
    "11": "Sikkim",
    "12": "Arunachal Pradesh",
    "13": "Nagaland",
    "14": "Manipur",
    "15": "Mizoram",
    "16": "Tripura",
    "17": "Meghalaya",
    "18": "Assam",
    "19": "West Bengal",
    "20": "Jharkhand",
    "21": "Odisha",
    "22": "Chhattisgarh",
    "23": "Madhya Pradesh",
    "24": "Gujarat",
    "26": "Dadra & Nagar Haveli and Daman & Diu",
    "27": "Maharashtra",
    "28": "Andhra Pradesh (Old)",
    "29": "Karnataka",
    "30": "Goa",
    "31": "Lakshadweep",
    "32": "Kerala",
    "33": "Tamil Nadu",
    "34": "Puducherry",
    "35": "Andaman & Nicobar",
    "36": "Telangana",
    "37": "Andhra Pradesh",
    "38": "Ladakh",
  };

  const state = stateNames[stateCode];
  if (!state) {
    return { success: false, error: "GSTIN not found in GST records" };
  }

  return {
    success: true,
    data: {
      gstin,
      legalName: `MOCK BUSINESS (${gstin.substring(2, 7)}) PRIVATE LIMITED`,
      tradeName: `Mock Business ${gstin.substring(2, 7)}`,
      status: "Active",
      state,
      businessType: "Private Limited Company",
      dateOfRegistration: "2020-01-01",
      address: {
        line1: "100, Commercial Complex",
        line2: "Main Road",
        city: "",
        state,
        pincode: "",
        country: "India",
        full: composeFullAddress({
          line1: "100, Commercial Complex",
          line2: "Main Road",
          city: "",
          state,
          pincode: "",
          country: "India",
        }),
      },
    },
  };
}

// Compose a single-line address string from structured parts.
function composeFullAddress(a: Omit<GSTBillingAddress, "full">): string {
  return [a.line1, a.line2, a.city, a.state, a.pincode]
    .map((p) => (p || "").trim())
    .filter(Boolean)
    .join(", ");
}

// Surepass's `corporate/gstin` plan returns no structured address breakdown —
// only a flat comma-joined string, e.g.
//   "Plot 82, Udyog Vihar, Phase-4, Gurugram, Gurugram, Gurugram, Haryana, 122015".
// Recover usable fields: the trailing tokens are reliably `…, <state>,
// <pincode>`, and Surepass repeats the location/city/district, so collapse the
// duplicates and treat the leftmost token as line 1.
function parseFlatAddress(
  full: string,
  fallbackState: string,
): Omit<GSTBillingAddress, "full" | "country"> {
  const tokens = full
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  let pincode = "";
  if (tokens.length && /^\d{6}$/.test(tokens[tokens.length - 1])) {
    pincode = tokens.pop() as string;
  }
  const state = tokens.length ? (tokens.pop() as string) : fallbackState;
  const city = tokens.length ? (tokens.pop() as string) : "";

  const rest: string[] = [];
  for (const t of tokens) if (rest[rest.length - 1] !== t) rest.push(t);
  while (rest.length && rest[rest.length - 1] === city) rest.pop();

  return {
    line1: rest.length ? rest[0] : "",
    line2: rest.slice(1).join(", "),
    city,
    state,
    pincode,
  };
}

// Surepass returns the registered "principal place of business" address under
// varying shapes depending on API version: `principal_address.address` (+ a
// `full_address` string), the raw GSTN `pradr.addr` (+ `adr`), or a flat
// `address`. The Lambda proxy may also pre-normalize it into our own shape
// (`{ line1, line2, ..., full }`). Pull a normalized billing address out of
// whichever shape exists — idempotent, so an already-normalized address passes
// through unchanged.
function extractAddress(
  d: Record<string, unknown>,
  fallbackState: string,
): GSTBillingAddress {
  const asObj = (v: unknown): Record<string, unknown> =>
    v && typeof v === "object" ? (v as Record<string, unknown>) : {};

  const pa = asObj(d.principal_address ?? d.pradr ?? d.address);
  const addr = asObj(pa.address ?? pa.addr ?? pa);

  const s = (obj: Record<string, unknown>, ...keys: string[]): string => {
    for (const k of keys) {
      const v = obj[k];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    return "";
  };

  const building = s(addr, "building_number", "bno", "door_number");
  const buildingName = s(addr, "building_name", "bnm");
  const floor = s(addr, "floor", "flno", "floor_number");
  const street = s(addr, "street", "st");
  const location = s(addr, "location", "loc", "landmark");

  const line1 =
    [building, buildingName, floor].filter(Boolean).join(", ") ||
    s(addr, "line1");
  const line2 =
    [street, location].filter(Boolean).join(", ") || s(addr, "line2");
  const city = s(addr, "city", "district", "dst");
  const state = s(addr, "state") || fallbackState;
  const pincode = s(addr, "pincode", "pncd", "pin", "zip");

  const base = {
    line1,
    line2,
    city,
    state,
    pincode,
    country: s(addr, "country") || "India",
  };
  // A flat string under `address` (raw Surepass) or `full` is the only address
  // some plans return. Use it for `full`, and when no structured fields came
  // through, parse it so the billing fields still populate.
  const flatString = typeof d.address === "string" ? d.address.trim() : "";
  const rawFull = s(pa, "full_address", "adr") || s(addr, "full") || flatString;
  const full = rawFull || composeFullAddress(base);

  if (!base.line1 && !base.city && !base.pincode && rawFull) {
    return {
      ...parseFlatAddress(rawFull, fallbackState),
      country: base.country,
      full,
    };
  }

  return { ...base, full };
}

// The Lambda proxy may return Surepass's raw field names (snake_case) rather
// than our camelCase shape. Map both so `companyName` (legal name) is always
// populated before it flows into cart creation.
export function normalizeVerificationResult(raw: unknown): GSTVerificationResult {
  const r = raw as Record<string, unknown>;
  if (!r || r.success !== true || !r.data) {
    return {
      success: false,
      error: typeof r?.error === "string" ? r.error : "Unable to verify GSTIN. Please try again.",
    };
  }

  const d = r.data as Record<string, unknown>;
  const pick = (...keys: string[]): string => {
    for (const k of keys) {
      if (typeof d[k] === "string" && d[k]) return d[k] as string;
    }
    return "";
  };

  const state = pick("state", "state_jurisdiction", "stj");

  return {
    success: true,
    data: {
      gstin: pick("gstin", "gst_in", "gstin_number"),
      legalName: pick("legalName", "legal_name", "business_name", "lgnm"),
      tradeName: pick("tradeName", "trade_name", "tradeNam"),
      status: (pick("status", "gstin_status", "sts") ||
        "Active") as NonNullable<GSTVerificationResult["data"]>["status"],
      state,
      businessType: pick("businessType", "constitution_of_business", "taxpayer_type"),
      dateOfRegistration: pick("dateOfRegistration", "date_of_registration", "rgdt"),
      address: extractAddress(d, state),
    },
  };
}

/**
 * Verify a GSTIN against the GST verification service.
 *
 * In production, this calls the AWS Lambda proxy → Surepass API.
 * In dev/staging without the env var set, falls back to a mock implementation.
 *
 * IMPORTANT: In production builds, mock mode is disabled to prevent
 * silently returning fake "verified" data. If the API URL is missing
 * in production, verification fails with a clear error.
 */
export async function verifyGSTIN(
  gstin: string,
): Promise<GSTVerificationResult> {
  const apiUrl = process.env.NEXT_PUBLIC_GST_VERIFY_API_URL;
  const IS_MOCK = !apiUrl;

  if (IS_MOCK) {
    if (process.env.NODE_ENV === "production") {
      return {
        success: false,
        error:
          "GST verification is temporarily unavailable. Please try again later.",
      };
    }
    return mockVerify(gstin);
  }

  // Production: call the Lambda proxy
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gstin }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: "Unable to verify GSTIN. Please try again.",
      };
    }

    return normalizeVerificationResult(await response.json());
  } catch {
    return {
      success: false,
      error: "Unable to verify GSTIN. Please try again.",
    };
  }
}
