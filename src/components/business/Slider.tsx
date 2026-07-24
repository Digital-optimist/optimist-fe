"use client";

import { Fragment, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface SliderValueBoxProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  /** Small unit label after the number (e.g. "units", "hrs", "/units"). */
  unit: string;
  /** Optional prefix before the number (e.g. "₹"). */
  prefix?: string;
  onChange: (v: number) => void;
  ariaLabel: string;
}

// The bordered value box that pairs with a Slider — now an editable input.
// Typing live-updates the slider while the number is inside [min, max]; on
// blur/Enter the value is clamped to the range and snapped to the step (so
// out-of-range entries settle on the nearest bound). Focus feedback matches
// the lead-form inputs (blue border + soft glow).
export function SliderValueBox({
  value,
  min,
  max,
  step = 1,
  unit,
  prefix,
  onChange,
  ariaLabel,
}: SliderValueBoxProps) {
  // While editing, the raw text lives here so partial entries ("1" on the way
  // to "12") aren't clamped mid-keystroke; null = not editing.
  const [draft, setDraft] = useState<string | null>(null);

  const snap = (raw: number) =>
    Math.min(max, Math.max(min, Math.round(raw / step) * step));

  const shown = draft ?? String(value);

  // Reserve room for the widest value this slider can show ("100", "11.5"),
  // so the box keeps one constant footprint while dragging — 1/2/3-digit
  // values all render in the same-sized box instead of reflowing the row.
  const reservedCh =
    String(Math.trunc(max)).length + (Number.isInteger(step) ? 0 : 2);

  const commit = () => {
    if (draft !== null) {
      const n = parseFloat(draft);
      if (!Number.isNaN(n)) onChange(snap(n));
      setDraft(null);
    }
  };

  return (
    <label className="flex h-10 shrink-0 cursor-text items-center rounded-[8px] border border-[#E9E9E9] bg-white px-3 transition-colors focus-within:border-[#3478F6]">
      <span className="flex items-baseline gap-1">
        {/* Fixed-width cluster, right-aligned: the prefix hugs the number and
            the spare room sits invisibly on the left, so "₹8" and "₹11.5"
            occupy the same footprint. */}
        <span
          className="flex items-baseline justify-end text-[20px]"
          style={{ width: `${reservedCh + (prefix ? 1.1 : 0)}ch` }}
        >
          {prefix && (
            <span className="font-semibold leading-none text-[#3478F6]">
              {prefix}
            </span>
          )}
          <input
            type="text"
            inputMode="decimal"
            value={shown}
            aria-label={ariaLabel}
            maxLength={reservedCh + 1}
            onChange={(e) => {
              const raw = e.target.value;
              if (!/^\d*\.?\d*$/.test(raw)) return;
              const n = parseFloat(raw);
              // Hard-stop anything above the slider's upper bound — the
              // keystroke is rejected instead of waiting for blur to clamp.
              // (Below-min partials stay allowed: "1" on the way to "12".)
              if (!Number.isNaN(n) && n > max) return;
              setDraft(raw);
              if (!Number.isNaN(n) && n >= min && n <= max) onChange(snap(n));
            }}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            className="bg-transparent text-left text-[20px] font-semibold leading-none text-[#3478F6] caret-[#3478F6] outline-hidden selection:bg-[#3478F6]/10 focus:outline-none"
            style={{ width: `${Math.max(1, shown.length)}ch` }}
          />
        </span>
        <span className="text-[12px] font-semibold leading-none text-[#4D4D4D]">
          {unit}
        </span>
      </span>
    </label>
  );
}

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  ariaLabel: string;
  /** Scale labels (e.g. ["1", "50", "100"]) — tick marks are drawn between them. */
  ticks?: (string | number)[];
  className?: string;
}

// Horizontal, fully controlled slider matching the Figma calculator spec:
// 12px white track with a hairline border, brand-gradient fill, 24px white
// knob with a soft shadow, and a scale row underneath (labels in #BABABA with
// 6/12/6px tick marks between them). Custom-drawn (not a native <input
// type=range>) so it styles identically across browsers. Supports pointer
// drag and arrow-key nudges.
export function Slider({
  min,
  max,
  step = 1,
  value,
  onChange,
  ariaLabel,
  ticks,
  className,
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const pct = ((value - min) / (max - min)) * 100;

  const commit = (raw: number) => {
    const stepped = Math.round(raw / step) * step;
    const clamped = Math.min(max, Math.max(min, stepped));
    if (clamped !== value) onChange(clamped);
  };

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    commit(min + t * (max - min));
  };

  return (
    <div className={className}>
      {/* Track row — Figma: 24px tall; 12px track (white, #E9E9E9 border),
          gradient fill, 24px knob riding the fill's end. */}
      <div
        ref={trackRef}
        className="relative flex h-6 cursor-pointer touch-none select-none items-center"
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (dragging.current) setFromClientX(e.clientX);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
      >
        <div className="absolute inset-x-0 h-3 rounded-full border border-[#E9E9E9] bg-white" />
        <div
          className="absolute h-3 rounded-full bg-[linear-gradient(90deg,#1265FF_0%,#69CDEB_85%,#4466FF_100%)]"
          style={{ width: `${pct}%` }}
        />
        <div
          role="slider"
          tabIndex={0}
          aria-label={ariaLabel}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowUp") {
              commit(value + step);
              e.preventDefault();
            } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
              commit(value - step);
              e.preventDefault();
            }
          }}
          className="absolute size-6 -translate-x-1/2 rounded-full border border-black/5 bg-white shadow-[0_2px_8px_rgba(33,33,33,0.25)] outline-none focus-visible:ring-2 focus-visible:ring-[#3478F6]/40"
          style={{ left: `${pct}%` }}
        />
      </div>

      {/* Scale — labels with 6/12/6px hairline ticks between each pair */}
      {ticks && (
        <div className="mt-2 flex items-start justify-between">
          {ticks.map((t, i) => (
            <Fragment key={i}>
              {i > 0 && (
                <>
                  <span aria-hidden className="h-1.5 w-px bg-[#E9E9E9]" />
                  <span aria-hidden className="h-3 w-px bg-[#E9E9E9]" />
                  <span aria-hidden className="h-1.5 w-px bg-[#E9E9E9]" />
                </>
              )}
              <span
                className={cn(
                  "text-[12px] font-medium leading-none text-[#BABABA]",
                  i === 0 && "text-left",
                  i === ticks.length - 1 && "text-right",
                )}
              >
                {t}
              </span>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
