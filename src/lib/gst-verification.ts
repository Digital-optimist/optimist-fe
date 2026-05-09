// GST Verification API service
// Currently uses a mock implementation for testing.
// Replace with real Surepass API proxy call when Lambda is deployed.

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
  },
  "27AABCU9603R1ZM": {
    gstin: "27AABCU9603R1ZM",
    legalName: "RELIANCE INDUSTRIES LIMITED",
    tradeName: "Reliance Industries",
    status: "Active",
    state: "Maharashtra",
    businessType: "Public Limited Company",
    dateOfRegistration: "2017-07-01",
  },
  "07AAACW8569R1ZE": {
    gstin: "07AAACW8569R1ZE",
    legalName: "WIPRO LIMITED",
    tradeName: "Wipro",
    status: "Active",
    state: "Delhi",
    businessType: "Public Limited Company",
    dateOfRegistration: "2017-07-01",
  },
  "33AABCT1332L1ZB": {
    gstin: "33AABCT1332L1ZB",
    legalName: "TATA CONSULTANCY SERVICES LIMITED",
    tradeName: "TCS",
    status: "Active",
    state: "Tamil Nadu",
    businessType: "Public Limited Company",
    dateOfRegistration: "2017-07-01",
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

    return await response.json();
  } catch {
    return {
      success: false,
      error: "Unable to verify GSTIN. Please try again.",
    };
  }
}
