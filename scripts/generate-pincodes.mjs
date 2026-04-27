import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ASSETS = resolve(ROOT, "src/assets");
const OUT_DIR = resolve(ROOT, "public/data");

mkdirSync(OUT_DIR, { recursive: true });

function parseCsvRows(text) {
  const lines = text.split("\n").filter((l) => l.trim());
  const header = lines[0].split(",").map((h) => h.trim());
  return { header, rows: lines.slice(1).map((l) => l.split(",").map((c) => c.trim())) };
}

function titleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// --- Pikkol (express / within 48 hrs) ---
const pikkolRaw = readFileSync(
  resolve(ASSETS, "Pincode Servicable List - Optimist - Pikkol Serviceable Pincode.csv"),
  "utf-8",
);
const pikkol = parseCsvRows(pikkolRaw);
const expressMap = {};

for (const row of pikkol.rows) {
  const pin = row[0]?.replace(/\D/g, "");
  const city = row[1] || "";
  if (pin && pin.length === 6) {
    expressMap[pin] = titleCase(city);
  }
}

// --- Proship (standard / 5-7 business days) ---
const proshipRaw = readFileSync(
  resolve(ASSETS, "Pincode Servicable List - Optimist - Proship Serviceable Pincode.csv"),
  "utf-8",
);
const proship = parseCsvRows(proshipRaw);

const carrierStartIdx = 3; // columns after Pincode, City, State
const standardMap = {};

for (const row of proship.rows) {
  const pin = row[0]?.replace(/\D/g, "");
  const city = row[1] || "";
  if (!pin || pin.length !== 6) continue;

  // Skip if already in express (express takes priority)
  if (expressMap[pin]) continue;

  const hasServiceable = row
    .slice(carrierStartIdx)
    .some((val) => val.toLowerCase() === "serviceable");

  if (hasServiceable) {
    standardMap[pin] = titleCase(city);
  }
}

writeFileSync(resolve(OUT_DIR, "pincodes-express.json"), JSON.stringify(expressMap));
writeFileSync(resolve(OUT_DIR, "pincodes-standard.json"), JSON.stringify(standardMap));

const expressCount = Object.keys(expressMap).length;
const standardCount = Object.keys(standardMap).length;
console.log(
  `[generate-pincodes] express: ${expressCount}, standard: ${standardCount}, total: ${expressCount + standardCount}`,
);
