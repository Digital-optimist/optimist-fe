// GSTIN (GST Identification Number) validation for India
// Format: 2-digit state code + 10-char PAN + entity code + "Z" + check digit

const GSTIN_REGEX =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const STATE_CODES: Record<string, string> = {
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

const CHECKSUM_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function computeCheckDigit(gstin14: string): string {
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    const idx = CHECKSUM_CHARS.indexOf(gstin14[i]);
    const factor = i % 2 === 0 ? 1 : 2;
    const product = idx * factor;
    sum += Math.floor(product / 36) + (product % 36);
  }
  const remainder = sum % 36;
  return CHECKSUM_CHARS[(36 - remainder) % 36];
}

export interface GSTINValidationResult {
  valid: boolean;
  error?: string;
  state?: string;
}

export function validateGSTIN(input: string): GSTINValidationResult {
  const gstin = input.toUpperCase().trim();

  if (gstin.length !== 15) {
    return { valid: false, error: "GSTIN must be exactly 15 characters" };
  }

  if (!GSTIN_REGEX.test(gstin)) {
    return { valid: false, error: "Invalid GSTIN format" };
  }

  const stateCode = gstin.substring(0, 2);
  const stateName = STATE_CODES[stateCode];
  if (!stateName) {
    return { valid: false, error: `Invalid state code: ${stateCode}` };
  }

  const expectedCheck = computeCheckDigit(gstin.substring(0, 14));
  if (gstin[14] !== expectedCheck) {
    return {
      valid: false,
      error: "Invalid check digit — please verify the GSTIN",
    };
  }

  return { valid: true, state: stateName };
}

export function getStateFromGSTIN(gstin: string): string | undefined {
  const code = gstin.substring(0, 2);
  return STATE_CODES[code];
}

export function formatGSTINInput(input: string): string {
  return input.toUpperCase().replace(/[^0-9A-Z]/g, "").slice(0, 15);
}
