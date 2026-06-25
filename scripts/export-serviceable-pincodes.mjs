// Export the serviceable pincodes to a CSV for Magic Checkout serviceability.
//
//   node scripts/export-serviceable-pincodes.mjs
//
// Source of truth is public/data/pincodes.json (the same file the storefront's
// pincode gate uses). Every key in that file is a serviceable pincode. Output
// is docs/razorpay-serviceable-pincodes.csv — upload it in the Razorpay
// Dashboard → Magic Checkout → Serviceability.
//
// NOTE: Razorpay's serviceability template may expect specific columns. We emit
// `pincode,city,zone`; adapt the header to match the dashboard template if it
// differs (the pincode column is the one that matters).

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const SRC = join(root, "public", "data", "pincodes.json");
const OUT = join(root, "docs", "razorpay-serviceable-pincodes.csv");

const data = JSON.parse(readFileSync(SRC, "utf8"));

const rows = Object.entries(data)
  .map(([pincode, info]) => ({
    pincode,
    city: (info && info.city) || "",
    zone: (info && info.zone) || "",
  }))
  .sort((a, b) => a.pincode.localeCompare(b.pincode));

const csvEscape = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const lines = ["pincode,city,zone"];
for (const r of rows) {
  lines.push([r.pincode, csvEscape(r.city), csvEscape(r.zone)].join(","));
}

writeFileSync(OUT, lines.join("\n") + "\n", "utf8");
console.log(`Wrote ${rows.length} serviceable pincodes → ${OUT}`);
