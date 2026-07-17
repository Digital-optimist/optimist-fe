// =============================================================================
// Compare & Save calculator — pure logic (no React, no DOM).
//
// Implements the client's "Savings & Impact Calculator — Technical Specification"
// v1.0: a bottom-up, four-season energy simulation. The ONLY variable that
// differentiates Optimist from the compared unit is the ISEER value — climate,
// usage and physics constants are identical across both, so the displayed saving
// is a pure efficiency delta. Figures are illustrative estimates.
//
// Model is framework-free so it can be unit-tested and re-implemented identically.
// =============================================================================

export type City =
  | "Delhi"
  | "Mumbai"
  | "Bengaluru"
  | "Hyderabad"
  | "Chennai"
  | "Kolkata";

// One season: [days, avgAmbientTemp°C, baseON_hours_per_day, humidityCF].
// Season index 0 is the peak season and its ON-hours are the scaling anchor.
export type Season = readonly [number, number, number, number];

// Climate dataset per city (IMD climate normals; CSE India Urban Heat Study 2024
// for the humidity CF). Four seasons per city; days sum to the operating year.
export const CITIES: Record<City, readonly [Season, Season, Season, Season]> = {
  Delhi: [
    [75, 41, 9, 1.15],
    [75, 36, 7, 1.1],
    [75, 31, 3.5, 1.18],
    [140, 22, 1, 1.05],
  ],
  Mumbai: [
    [75, 34, 7, 1.23],
    [90, 32, 6, 1.2],
    [90, 30, 4, 1.25],
    [95, 28, 2, 1.15],
  ],
  Bengaluru: [
    [90, 35, 7, 1.04],
    [75, 32, 5.5, 1.04],
    [60, 28, 2.5, 1.06],
    [140, 23, 1, 1.03],
  ],
  Hyderabad: [
    [90, 40, 8.5, 1.06],
    [75, 35, 6.5, 1.06],
    [60, 30, 3, 1.08],
    [140, 24, 1.5, 1.04],
  ],
  Chennai: [
    [90, 38, 9, 1.32],
    [90, 35, 7.5, 1.28],
    [60, 32, 4.5, 1.3],
    [95, 28, 3, 1.25],
  ],
  Kolkata: [
    [75, 38, 8.5, 1.3],
    [75, 34, 7, 1.25],
    [90, 32, 4.5, 1.3],
    [110, 25, 1.5, 1.18],
  ],
};

export const CITY_NAMES = Object.keys(CITIES) as City[];

// ---- model constants (see spec §3) ------------------------------------------
export const OPTIMIST_ISEER = 6.05; // BEE ISEER label
export const SETPOINT = 24; // thermostat setpoint (°C)
export const TONS = 1.5; // representative capacity (ton)
export const PLF = 0.85; // inverter part-load factor
export const TARIFF = 7.0; // ₹/kWh, India domestic average
export const CO2_PER_KWH = 0.71; // kg/kWh, India grid (CEA)
export const TON_W = 3.517; // kW cooling per ton (physics constant)
export const DEG = 0.04; // 4%/yr efficiency degradation
export const ESC = 0.06; // 6%/yr tariff escalation
export const YEARS = 10; // product-life horizon
export const KG_PER_TREE = 21; // kg CO₂ a mature tree absorbs / yr
export const KG_PER_KM = 0.12; // kg CO₂ / km, petrol car

// ---- usage slider domain (spec §2) ------------------------------------------
export const HOURS_MIN = 2;
export const HOURS_MAX = 16;
export const DEFAULT_HOURS = 8;

// ---- "Current AC" baseline options (spec §2) --------------------------------
export interface BaselineOption {
  id: string;
  label: string;
  iseer: number;
}
export const BASELINES: readonly BaselineOption[] = [
  { id: "3star", label: "3-star", iseer: 3.8 },
  { id: "old5", label: "Old 5-star", iseer: 5.0 },
  { id: "new5", label: "New 5-star", iseer: 5.6 },
];
export const DEFAULT_CITY: City = "Delhi";
export const DEFAULT_BASELINE_ISEER = 3.8;

export function baselineLabel(iseer: number): string {
  return BASELINES.find((b) => b.iseer === iseer)?.label ?? "current AC";
}

// ---- inputs / outputs -------------------------------------------------------
export interface CalcState {
  city: City;
  hours: number;
  baselineIseer: number;
}

export interface CalcResult {
  baselineIseer: number;
  kWhBase1: number; // year-1 annual kWh — current AC
  kWhOpt1: number; // year-1 annual kWh — Optimist
  kWhSavedYr1: number; // year-1 units saved
  rupeesYr1: number; // year-1 ₹ saved
  kwhTen: number; // 10-yr units saved (degraded)
  rupeesTen: number; // 10-yr ₹ saved (degraded + escalated)
  co2Ten: number; // 10-yr CO₂ avoided (kg) — hero figure
  pct: number; // % lower bills vs baseline
  trees: number; // equivalence: trees' worth of carbon / yr
  km: number; // equivalence: km of car driving
}

// ---- formatters -------------------------------------------------------------
export const fmt = (n: number): string => Math.round(n).toLocaleString("en-IN");
export const kFmt = (n: number): string =>
  n >= 1000 ? "₹" + Math.round(n / 1000) + "K" : "₹" + Math.round(n);

// ---- engine (spec §5) -------------------------------------------------------

// Annual compressor-hours: iterate the four seasons and accumulate effective
// run-hours. `peakHours` (the usage slider) scales the whole seasonal profile
// relative to the peak season's baseline ON-hours (season 0).
export function compHours(city: City, peakHours: number): number {
  const seasons = CITIES[city];
  const peakBase = seasons[0][2];
  let total = 0;
  for (const [days, amb, baseOn, humidityCF] of seasons) {
    // Scale ON-hours to the user's usage, relative to the peak season.
    const on = baseOn * (peakHours / peakBase);
    // Heat-load factor: compressor runs longer when hotter.
    const hlf = 1 + Math.max(0, (amb - 35) * 0.025);
    // Part-load run fraction (bounded ≤ 0.98), then humidity (bounded ≤ 0.98).
    const run = Math.min(0.98, (((amb - SETPOINT) / 13) * 0.6 + 0.35) * hlf);
    const eff = Math.min(0.98, run * humidityCF);
    total += on * eff * days;
  }
  return total;
}

// Annual electricity for a given ISEER. The single-ISEER chain (spec §5.2):
// 3.517 converts tonnage → cooling kW, ÷ISEER → electrical draw, ×PLF → avg draw.
// ISEER appears exactly once — never divide by it more than once.
export function annualKWh(city: City, iseer: number, peakHours: number): number {
  return compHours(city, peakHours) * ((TONS * TON_W) / iseer) * PLF;
}

// The full computation for a single 1.5-ton unit.
export function compute(state: CalcState): CalcResult {
  const { city, hours, baselineIseer } = state;

  const kOpt1 = annualKWh(city, OPTIMIST_ISEER, hours);
  const kBase1 = annualKWh(city, baselineIseer, hours);
  const kWhSavedYr1 = Math.max(kBase1 - kOpt1, 0);
  const rupeesYr1 = Math.round(kWhSavedYr1 * TARIFF);

  // 10-year lifetime: draw degrades equally each year; money escalates by tariff.
  let kwhTen = 0;
  let rupeesTenRaw = 0;
  for (let yr = 1; yr <= YEARS; yr++) {
    const deg = 1 + (yr - 1) * DEG;
    const ks = Math.max(kBase1 * deg - kOpt1 * deg, 0);
    kwhTen += ks;
    rupeesTenRaw += ks * TARIFF * Math.pow(1 + ESC, yr - 1);
  }
  const rupeesTen = Math.round(rupeesTenRaw);
  const co2Ten = Math.round(kwhTen * CO2_PER_KWH);
  const pct = kBase1 > 0 ? Math.round((1 - kOpt1 / kBase1) * 100) : 0;

  return {
    baselineIseer,
    kWhBase1: kBase1,
    kWhOpt1: kOpt1,
    kWhSavedYr1,
    rupeesYr1,
    kwhTen,
    rupeesTen,
    co2Ten,
    pct,
    trees: Math.round(co2Ten / KG_PER_TREE),
    km: Math.round(co2Ten / KG_PER_KM),
  };
}

// ---- social proof (design element, not part of the client spec) -------------
export interface Testimonial {
  name: string;
  city: string;
  amount: string;
  model: string;
}
export const TESTIMONIALS: Testimonial[] = [
  { name: "Rahul S.", city: "Mumbai", amount: "₹5,400", model: "New 5-star" },
  { name: "Priya M.", city: "Pune", amount: "₹4,900", model: "3-star" },
  { name: "Arjun K.", city: "Delhi", amount: "₹4,400", model: "3-star" },
  { name: "Sneha R.", city: "Bengaluru", amount: "₹3,900", model: "Old 5-star" },
  { name: "Vikram T.", city: "Hyderabad", amount: "₹5,100", model: "3-star" },
  { name: "Ananya D.", city: "Chennai", amount: "₹5,800", model: "3-star" },
  { name: "Karan P.", city: "Nagpur", amount: "₹4,700", model: "Old 5-star" },
  { name: "Meera J.", city: "Kolkata", amount: "₹5,200", model: "3-star" },
];
