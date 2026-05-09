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
  return lines.slice(1).map((l) => l.split(",").map((c) => c.trim()));
}

function titleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Zone classification by city name from CSV
const DELHI_NCR_CITIES = new Set([
  "delhi",
  "new delhi",
  "noida",
  "gurgaon",
  "faridabad",
  "ghaziabad",
]);

const BANGALORE_CITIES = new Set(["bangalore"]);

const HYDERABAD_CITIES = new Set([
  "hyderabad",
  "hyderabad city division",
]);

function classifyZone(city) {
  const c = city.toLowerCase().trim();
  if (DELHI_NCR_CITIES.has(c)) return "delhi-ncr";
  if (BANGALORE_CITIES.has(c)) return "bangalore";
  if (HYDERABAD_CITIES.has(c)) return "hyderabad";
  return null;
}

const pikkolRaw = readFileSync(
  resolve(
    ASSETS,
    "Pincode Servicable List - Optimist - Pikkol Serviceable Pincode.csv",
  ),
  "utf-8",
);

const rows = parseCsvRows(pikkolRaw);
const pincodes = {};
const zoneCounts = { "delhi-ncr": 0, bangalore: 0, hyderabad: 0, skipped: 0 };

for (const row of rows) {
  const pin = row[0]?.replace(/\D/g, "");
  const city = row[1] || "";
  if (!pin || pin.length !== 6) continue;

  const zone = classifyZone(city);
  if (!zone) {
    zoneCounts.skipped++;
    continue;
  }

  pincodes[pin] = { city: titleCase(city), zone };
  zoneCounts[zone]++;
}

writeFileSync(resolve(OUT_DIR, "pincodes.json"), JSON.stringify(pincodes));
