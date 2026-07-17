"use client";

import { useRef } from "react";
import { haptic, sx } from "./helpers";

const RMIN = 2;
const RMAX = 16;
const LABELS = [16, 14, 12, 10, 8, 6, 4, 2];

interface UsageRulerProps {
  value: number;
  onChange: (hours: number) => void;
}

// Vertical draggable "ruler" for daily runtime hours (1–24). Controlled: the
// parent owns the value. Supports pointer drag and keyboard (arrow keys).
export function UsageRuler({ value, onChange }: UsageRulerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  // 0 at the top (24h) → 1 at the bottom (1h).
  const frac = (RMAX - value) / (RMAX - RMIN);

  const commit = (next: number) => {
    const clamped = Math.min(RMAX, Math.max(RMIN, Math.round(next)));
    if (clamped !== value) {
      haptic(11);
      onChange(clamped);
    }
  };

  const setFromClientY = (clientY: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    commit(RMAX - t * (RMAX - RMIN));
  };

  return (
    <div className={sx("ruler-field")}>
      <div className={sx("ruler")}>
        <div
          ref={trackRef}
          className={sx("ruler-track")}
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            setFromClientY(e.clientY);
          }}
          onPointerMove={(e) => {
            if (dragging.current) setFromClientY(e.clientY);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
        >
          <div className={sx("ruler-fill")} style={{ height: `${(1 - frac) * 100}%` }} />
          <div className={sx("ruler-glow")} style={{ top: `${frac * 100}%` }} />
          <div
            className={sx("ruler-handle")}
            style={{ top: `${frac * 100}%` }}
            tabIndex={0}
            role="slider"
            aria-label="Daily usage hours"
            aria-valuemin={RMIN}
            aria-valuemax={RMAX}
            aria-valuenow={value}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowRight") {
                commit(value + 1);
                e.preventDefault();
              } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
                commit(value - 1);
                e.preventDefault();
              }
            }}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="m7 9 5-5 5 5M7 15l5 5 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className={sx("ruler-labels")}>
        {LABELS.map((h) => {
          const f = (RMAX - h) / (RMAX - RMIN);
          return (
            <span key={h} style={{ top: `${f * 100}%` }}>
              {h}h
            </span>
          );
        })}
      </div>

      <div className={sx("ruler-readout")}>
        <div className={sx("big")}>
          {value}
          <small>hrs</small>
        </div>
        <div className={sx("cap")}>
          <b>per day</b> — average runtime
        </div>
      </div>
    </div>
  );
}
