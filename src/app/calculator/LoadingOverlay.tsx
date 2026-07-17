"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion, sx } from "./helpers";

export interface LoadStep {
  label: string;
  value: string;
}

interface LoadingOverlayProps {
  steps: LoadStep[];
  onDone: () => void;
}

// Full-screen "calculating…" overlay. Reveals each step in sequence (marking the
// previous one done) and fills a progress bar, then calls onDone. Mirrors the
// prototype's runCalculation() timeline; collapses to near-instant under reduced
// motion.
export function LoadingOverlay({ steps, onDone }: LoadingOverlayProps) {
  // `c` = number of ticks elapsed (1-indexed). Step k is visible when k < c and
  // marked done when k < c - 1; the bar tracks min(c, len)/len.
  const [c, setC] = useState(0);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const stepDelay = reduce ? 90 : 470;
    const endDelay = reduce ? 120 : 420;
    let timer: ReturnType<typeof setTimeout>;

    const run = (n: number) => {
      setC(n);
      if (n <= steps.length) {
        timer = setTimeout(() => run(n + 1), stepDelay);
      } else {
        timer = setTimeout(onDone, endDelay);
      }
    };
    timer = setTimeout(() => run(1), reduce ? 40 : 120);
    return () => clearTimeout(timer);
    // Steps/onDone are stable for a given calculation run; run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const barPct = (Math.min(c, steps.length) / steps.length) * 100;

  return (
    <div className={sx("loading")} role="status" aria-live="polite">
      <div className={sx("loader-box")}>
        <div className={sx("ring-spin")}>
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(20,40,90,.10)" strokeWidth="6" />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="url(#calc-ring)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="80 200"
            />
            <defs>
              <linearGradient id="calc-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#69CDEB" />
                <stop offset="1" stopColor="#1265FF" />
              </linearGradient>
            </defs>
          </svg>
          <div className={sx("leaf")}>
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2v20M2 12h20M4.6 4.6l14.8 14.8M19.4 4.6 4.6 19.4"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <div className={sx("ltxt")}>Calculating your savings…</div>
        <div className={sx("lsteps")}>
          {steps.map((s, k) => (
            <div key={s.label} className={sx("lstep", k < c && "in", k < c - 1 && "done")}>
              <span className={sx("ic")}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className={sx("ll")}>{s.label}</span>
              <span className={sx("lv")}>{s.value}</span>
            </div>
          ))}
        </div>
        <div className={sx("loader-bar")}>
          <i
            style={{
              width: `${barPct}%`,
              transition: "width .45s cubic-bezier(.22,1,.36,1)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
