"use client";

/* eslint-disable @next/next/no-img-element -- local static webp assets. */

import { useState } from "react";
import {
  OPTIMIST_ISEER,
  TARIFF,
  baselineLabel,
  fmt,
  kFmt,
  type CalcResult,
  type CalcState,
} from "./logic";
import { CountUp } from "./CountUp";
import { AreaChart } from "./AreaChart";
import { sx } from "./helpers";

interface ResultsViewProps {
  result: CalcResult;
  state: CalcState;
  isBuyLoading: boolean;
  onBack: () => void;
  onRecalc: () => void;
  onBuy: () => void;
  onShare: () => void;
  onPdf: () => void;
}

export function ResultsView({
  result,
  state,
  isBuyLoading,
  onBack,
  onRecalc,
  onBuy,
  onShare,
  onPdf,
}: ResultsViewProps) {
  const [accOpen, setAccOpen] = useState(false);

  const { city, hours } = state;
  const baseLbl = baselineLabel(result.baselineIseer);
  const costBaseYr = result.kWhBase1 * TARIFF;
  const costOptYr = result.kWhOpt1 * TARIFF;
  const maxK = Math.max(result.kWhBase1, result.kWhOpt1);
  const buyLabel = `Save ${kFmt(result.rupeesYr1)} a year`;

  return (
    <section className={sx("view show")}>
      <div className={sx("wrap")}>
        <div className={sx("res-top")}>
          <button className={sx("back-btn")} onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Edit my details
          </button>
          <span className={sx("pill-badge")}>
            <span className={sx("dot")} /> Results ready
          </span>
        </div>

        <div className={sx("res-head")}>
          <span className={sx("eyebrow")}>✦ Your results</span>
          <h2>
            Switching to Optimist saves you <em>₹{fmt(result.rupeesYr1)}</em> every year.
          </h2>
          <p>
            Based on a 1.5-ton AC running {hours} hrs/day in {city}, vs your {baseLbl}.
          </p>
        </div>

        <div className={sx("stack")}>
          {/* HERO savings */}
          <div className={sx("card hero-card reveal")} style={{ animationDelay: "0ms" }}>
            <div className={sx("ctitle")}>
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              Yearly savings
            </div>
            <div className={sx("inner")}>
              <div className={sx("gauge")} aria-hidden="true">
                <i />
                <i className={sx("lit")} />
                <i className={sx("lit")} />
                <i className={sx("lit mark")} />
                <i />
                <i />
                <i />
              </div>
              <div>
                <div className={sx("big")}>
                  <span className={sx("rupee")}>₹</span>
                  <CountUp to={result.rupeesYr1} />
                </div>
                <div className={sx("per")}>
                  saved every year — {result.pct}% lower cooling bills
                </div>
                <div className={sx("ann")}>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 17l6-6 4 4 8-8M21 7v5M21 7h-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>₹{fmt(result.rupeesTen)} over 10 years</span>
                </div>
              </div>
            </div>
          </div>

          {/* ELECTRICITY area chart (year one) */}
          <div className={sx("card reveal")} style={{ animationDelay: "90ms" }}>
            <div className={sx("ctitle")}>
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
              Electricity consumption
            </div>
            <div className={sx("echart")}>
              <div className={sx("ecol")}>
                <div className={sx("ecol-num")}>
                  <CountUp to={result.kWhBase1} />
                  <small>kWh/yr</small>
                </div>
                <div className={sx("ecol-cap")}>Your {baseLbl}</div>
                <AreaChart value={result.kWhBase1} max={maxK} variant="yours" />
              </div>
              <div className={sx("ecol optim")}>
                <div className={sx("ecol-num")}>
                  <CountUp to={result.kWhOpt1} />
                  <small>kWh/yr</small>
                </div>
                <div className={sx("ecol-cap")}>Optimist</div>
                <AreaChart value={result.kWhOpt1} max={maxK} variant="optim" />
              </div>
            </div>
            <div className={sx("echart-foot")}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                style={{ color: "var(--blue)" }}
              >
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <b>{fmt(result.kWhSavedYr1)} kWh</b>&nbsp;fewer units every year
            </div>
          </div>

          {/* COMPARISON */}
          <div className={sx("compare")}>
            <div className={sx("cmp yours card")} style={{ opacity: 1, transform: "none" }}>
              <div>
                <div className={sx("ctag2")}>Your current AC</div>
                <div className={sx("cname")}>{baseLbl}</div>
              </div>
              <div className={sx("cmp-ac")}>
                <img src="/calculator/current-ac.webp" alt="Your current AC" />
              </div>
              <div>
                <div className={sx("cmoney")}>
                  <span className={sx("rupee")}>₹</span>
                  <CountUp to={costBaseYr} />
                </div>
                <div className={sx("cmeta")}>
                  <span>
                    ISEER <b>{result.baselineIseer.toFixed(1)}</b>
                  </span>
                  <span>per year</span>
                </div>
              </div>
            </div>
            <div className={sx("cmp optim card")} style={{ opacity: 1, transform: "none" }}>
              <span className={sx("badge")}>SAVE {result.pct}%</span>
              <div>
                <div className={sx("ctag2")}>Optimist AC</div>
                <div className={sx("cname")}>Optimist Frostorm Pro</div>
              </div>
              <div className={sx("cmp-ac")}>
                <img src="/calculator/optimist-ac.webp" alt="Optimist AC" />
              </div>
              <div>
                <div className={sx("cmoney")}>
                  <span className={sx("rupee")}>₹</span>
                  <CountUp to={costOptYr} />
                </div>
                <div className={sx("cmeta")}>
                  <span>
                    ISEER <b>{OPTIMIST_ISEER.toFixed(2)}</b>
                  </span>
                  <span>per year</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARBON impact (10-year) */}
          <div className={sx("scards")}>
            <div className={sx("scard hot card")} style={{ opacity: 1, transform: "none" }}>
              <div className={sx("scard-ic")}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 16a5 5 0 0 1 4-8 6 6 0 0 1 11 2 4 4 0 0 1-1 8H7a4 4 0 0 1-4-2Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className={sx("scard-num")}>
                <CountUp to={result.co2Ten} />
                <small>kg</small>
              </div>
              <div className={sx("scard-label")}>CO₂ kept out of the air</div>
              <div className={sx("scard-sub")}>Over 10 years, by switching to Optimist.</div>
            </div>
            <div className={sx("scard card")} style={{ opacity: 1, transform: "none" }}>
              <div className={sx("scard-ic")}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C12 2 5 6 5 13a7 7 0 0 0 14 0c0-7-7-11-7-11Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              </div>
              <div className={sx("scard-num")}>
                <CountUp to={result.trees} />
                <small>🌳</small>
              </div>
              <div className={sx("scard-label")}>Trees&apos; worth of carbon</div>
              <div className={sx("scard-sub")}>What that many trees soak up in a year.</div>
            </div>
            <div className={sx("scard card")} style={{ opacity: 1, transform: "none" }}>
              <div className={sx("scard-ic")}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 17h14M6 17l1.5-5h9L18 17M7 12l1-4h8l1 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <circle cx="8" cy="17" r="1.6" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="16" cy="17" r="1.6" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </div>
              <div className={sx("scard-num")}>
                <CountUp to={result.km} />
                <small>km</small>
              </div>
              <div className={sx("scard-label")}>Car driving avoided</div>
              <div className={sx("scard-sub")}>The same CO₂ as this much petrol-car travel.</div>
            </div>
          </div>

          {/* ACCORDION */}
          <div className={sx("accordion", accOpen && "open")}>
            <button
              type="button"
              className={sx("acc-head")}
              aria-expanded={accOpen}
              onClick={() => setAccOpen((o) => !o)}
            >
              <span className={sx("ic")}>
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M12 11v5M12 8v.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                How we calculate this
              </span>
              <svg className={sx("chev")} viewBox="0 0 24 24" fill="none">
                <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className={sx("acc-body")}>
              <div>
                <div className={sx("acc-inner")}>
                  <ul>
                    <li>
                      <AccCheck />
                      <span>
                        We don&apos;t use a flat &quot;units per month&quot;. For {city} we run{" "}
                        <b>four seasons</b> (peak summer → winter), each with its own average
                        temperature, daily run-hours and humidity.
                      </span>
                    </li>
                    <li>
                      <AccCheck />
                      <span>
                        Three real-world corrections per season: a <b>heat-load factor</b>{" "}
                        (~<code>2.5%</code> longer runtime per °C above 35°C), a{" "}
                        <b>part-load run%</b> from how far ambient sits above your 24°C
                        setpoint, and a <b>humidity correction</b> (CSE India 2024).
                      </span>
                    </li>
                    <li>
                      <AccCheck />
                      <span>
                        Annual units = compressor-hours × (1.5T × <code>3.517</code> ÷ ISEER)
                        × <code>0.85</code> part-load. ISEER 6.05 is the only lever that
                        changes vs your current AC.
                      </span>
                    </li>
                    <li>
                      <AccCheck />
                      <span>
                        Money at <code>₹{TARIFF.toFixed(0)}</code>/unit. The 10-year figure adds{" "}
                        <code>4%/yr</code> efficiency degradation and <code>6%/yr</code> tariff
                        escalation. CO₂ uses <code>0.71 kg/kWh</code>; one tree absorbs ≈{" "}
                        <code>21 kg/yr</code>.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <p className={sx("disclaimer")}>
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 11v5M12 8v.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            A season-by-season model from IMD climate normals, CSE 2024 and the BEE ISEER
            label. Illustrative estimates — actual savings vary with usage, room size and
            weather.
          </p>

          <div className={sx("actions")}>
            <button className={sx("act")} onClick={onShare}>
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.8" />
                <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              Share
            </button>
            <button className={sx("act")} onClick={onPdf}>
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3v12m0 0 4-4m-4 4-4-4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Download PDF
            </button>
            <button
              className={sx("act primary")}
              onClick={onBuy}
              disabled={isBuyLoading}
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6h15l-1.5 9h-12L6 6Zm0 0L5 3H2"
                  stroke="#fff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="9" cy="20" r="1.6" fill="#fff" />
                <circle cx="18" cy="20" r="1.6" fill="#fff" />
              </svg>
              {isBuyLoading ? "Opening…" : buyLabel}
            </button>
            <button className={sx("act ghost recalcBtn")} onClick={onRecalc}>
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Recalculate
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const AccCheck = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path
      d="M5 13l4 4L19 7"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
