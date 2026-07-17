"use client";

/* eslint-disable @next/next/no-img-element -- local static webp assets in
   public/; next/image adds no value here (static export, custom passthrough
   loader) and complicates the object-fit:contain art direction. */

import { BASELINES, CITY_NAMES, TESTIMONIALS } from "./logic";
import type { City } from "./logic";
import { UsageRuler } from "./UsageRuler";
import { sx } from "./helpers";

// --- little inline icons ------------------------------------------------------

const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path
      d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path
      d="M5 13l4 4L19 7"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PREVIEW_FEATURES = [
  {
    title: "Dual Inverter compressor",
    sub: "Quieter, steadier cooling at lower power",
  },
  {
    title: "Anti-corrosive copper coils",
    sub: "Faster cooling, longer compressor life",
  },
  { title: "Wi-Fi + voice control", sub: "Run it from your phone or Alexa" },
  { title: "10-year compressor warranty", sub: "Backed by Optimist Care" },
];

interface CalcFormProps {
  city: City;
  hours: number;
  baselineIseer: number;
  onCityChange: (c: City) => void;
  onHoursChange: (h: number) => void;
  onBaselineChange: (iseer: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CalcForm({
  city,
  hours,
  baselineIseer,
  onCityChange,
  onHoursChange,
  onBaselineChange,
  onSubmit,
}: CalcFormProps) {
  return (
    <section className={sx("view show")}>
      <div className={sx("wrap")}>
        <div className={sx("hero")}>
          <span className={sx("eyebrow")}>❄ Compare &amp; Save</span>
          <h1>
            See what your old AC really <span className={sx("accent")}>costs you.</span>
          </h1>
          <p className={sx("sub")}>
            Switch to an Optimist inverter (ISEER 6.05) and see your real savings — in
            rupees and CO₂, modelled season-by-season for your city.
          </p>

          <div className={sx("layout")}>
            {/* ---------- form ---------- */}
            <form className={sx("panel")} onSubmit={onSubmit} noValidate>
              <div className={sx("section-tag")}>
                <span className={sx("n")}>1</span> Your city &amp; usage
              </div>

              <div className={sx("field")}>
                <label>Your city</label>
                <div className={sx("chip-row")} role="group" aria-label="City">
                  {CITY_NAMES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={sx("chip")}
                      aria-pressed={city === c}
                      onClick={() => onCityChange(c)}
                    >
                      <IconPin />
                      {c}
                    </button>
                  ))}
                </div>
                <div className={sx("hint")}>
                  <IconPin /> Sets your climate profile and electricity tariff.
                </div>
              </div>

              <div className={sx("field")}>
                <label>
                  Daily usage <span className={sx("opt")}>— drag the dial</span>
                </label>
                <UsageRuler value={hours} onChange={onHoursChange} />
              </div>

              <div className={sx("section-tag")}>
                <span className={sx("n")}>2</span> Your current AC
              </div>

              <div className={sx("field")}>
                <label>What are you cooling with today?</label>
                <div className={sx("seg")} role="group" aria-label="Current AC">
                  {BASELINES.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      aria-pressed={baselineIseer === b.iseer}
                      onClick={() => onBaselineChange(b.iseer)}
                    >
                      {b.label}
                      <span className={sx("u")}>ISEER {b.iseer.toFixed(1)}</span>
                    </button>
                  ))}
                </div>
                <div className={sx("hint")}>
                  <IconCheck /> We compare it against Optimist&apos;s ISEER 6.05 — the only
                  variable that changes.
                </div>
              </div>

              <button type="submit" className={sx("calc-btn")}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="#fff"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Calculate My Savings
              </button>
            </form>

            {/* ---------- live preview ---------- */}
            <aside className={sx("preview")}>
              <div className={sx("glow")} />
              <div className={sx("pv-top")}>
                <img
                  className={sx("pv-logo")}
                  src="/calculator/optimist-logo.webp"
                  alt="Optimist"
                />
                <span className={sx("matched")}>
                  <IconCheck /> Auto-selected
                </span>
              </div>
              <div className={sx("ac-stage")}>
                <img src="/calculator/optimist-ac.webp" alt="Optimist AC" />
              </div>
              <div>
                <div className={sx("pv-model")}>
                  Optimist Frostorm <span className={sx("ton")}>Pro</span>
                </div>
                <div className={sx("pv-specs")} style={{ marginTop: 12 }}>
                  <span className={sx("spec-chip")}>
                    ★★★★★ <b>5★</b>
                  </span>
                  <span className={sx("spec-chip")}>
                    ISEER <b>6.05</b>
                  </span>
                  <span className={sx("spec-chip")}>
                    Capacity <b>1.5 Ton</b>
                  </span>
                </div>
              </div>
              <div className={sx("pv-feats")}>
                {PREVIEW_FEATURES.map((f) => (
                  <div key={f.title} className={sx("pv-feat")}>
                    <span className={sx("fi")}>
                      <IconCheck />
                    </span>
                    <div>
                      <b>{f.title}</b>
                      <span>{f.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className={sx("pv-highlight")}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C12 2 5 6 5 13a7 7 0 0 0 14 0c0-7-7-11-7-11Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
                <div>
                  <b>Cuts cooling bills 25–35%</b>
                  <span>vs a typical old AC, season-adjusted</span>
                </div>
              </div>
            </aside>
          </div>

          {/* ---------- social proof ---------- */}
          <section className={sx("proof")}>
            <div className={sx("proof-head")}>
              <span className={sx("eyebrow")}>★ Real switchers</span>
              <h3>People are already saving with Optimist.</h3>
            </div>
            <div className={sx("marquee")}>
              <div className={sx("track")}>
                {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                  <div className={sx("tcard")} key={`${t.name}-${i}`}>
                    <div className={sx("av")}>
                      {t.name
                        .split(" ")
                        .map((x) => x[0])
                        .join("")}
                    </div>
                    <div className={sx("who")}>
                      <b>{t.name}</b>
                      <span>{t.city}</span>
                    </div>
                    <div className={sx("amt")}>
                      <b>{t.amount}</b>
                      <span>saved/yr · {t.model}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
