"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./helpers";

interface CountUpProps {
  to: number;
  dur?: number;
  prefix?: string;
  suffix?: string;
  // Decimal places; 0 → Indian-grouped integer (e.g. 18,400).
  dec?: number;
}

// Animated number that eases from 0 → `to` on mount (cubic ease-out), matching
// the prototype's countUp(). Renders the final value immediately under reduced
// motion. Remounts (e.g. when the results view is shown) restart the animation.
export function CountUp({ to, dur = 1200, prefix = "", suffix = "", dec = 0 }: CountUpProps) {
  const [val, setVal] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVal(to);
      return;
    }
    let startTs: number | null = null;
    const tick = (now: number) => {
      if (startTs === null) startTs = now;
      const t = Math.min(1, (now - startTs) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(to * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [to, dur]);

  const text = dec ? val.toFixed(dec) : Math.round(val).toLocaleString("en-IN");
  return (
    <>
      {prefix}
      {text}
      {suffix}
    </>
  );
}
