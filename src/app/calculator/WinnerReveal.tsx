"use client";

/* eslint-disable @next/next/no-img-element -- local static webp asset. */

import { useCallback, useEffect, useRef, useState } from "react";
import { haptic, sx } from "./helpers";

interface WinnerRevealProps {
  amount: string; // pre-formatted, e.g. "₹18,400"
  onDismiss: () => void;
}

// Celebratory "Optimist wins" takeover shown once results are ready. Auto-
// dismisses after 5s, or on click / button / backdrop; plays a fade-out first.
export function WinnerReveal({ amount, onDismiss }: WinnerRevealProps) {
  const [gone, setGone] = useState(false);
  const dismissed = useRef(false);

  const dismiss = useCallback(() => {
    if (dismissed.current) return;
    dismissed.current = true;
    haptic([0, 45, 65]);
    setGone(true);
    window.setTimeout(onDismiss, 600);
  }, [onDismiss]);

  useEffect(() => {
    haptic([0, 35, 55, 35, 80]);
    const auto = window.setTimeout(dismiss, 5000);
    return () => window.clearTimeout(auto);
  }, [dismiss]);

  return (
    <div
      className={sx("winner-screen", gone && "gone")}
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div className={sx("wflash")} />
      <div className={sx("win-inner")}>
        <div className={sx("win-burst")} />
        <div className={sx("win-badge")}>🏆 And the winner is</div>
        <img src="/calculator/optimist-ac.webp" alt="Optimist AC" />
        <h2 className={sx("win-title")}>
          Optimist <em>wins.</em>
        </h2>
        <p className={sx("win-sub")}>
          Saving you <b>{amount}</b> every year
        </p>
        <button className={sx("win-go")} onClick={dismiss}>
          See my savings
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
