"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import {
  BlueGradientFull,
  BlueGradientMiddle,
  BlueGradientShrink,
} from "@/assets/icons";

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

type AnimationSetters = {
  full: (value: number) => void;
  middle: (value: number) => void;
  shrink: (value: number) => void;
  scaleX: (value: number) => void;
  scaleY: (value: number) => void;
  borderRadius: (value: number) => void;
  y: (value: number) => void;
};

export function HeroBlueGradient({ progress }: { progress: number }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const fullRef = useRef<HTMLDivElement>(null);
  const middleRef = useRef<HTMLDivElement>(null);
  const shrinkRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const settersRef = useRef<AnimationSetters | null>(null);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    const full = fullRef.current;
    const middle = middleRef.current;
    const shrink = shrinkRef.current;
    if (!frame || !full || !middle || !shrink) return;

    // Fast, smooth setters (avoid creating a tween per scroll tick).
    settersRef.current = {
      full: gsap.quickTo(full, "opacity", { duration: 0.15, ease: "power2.out" }),
      middle: gsap.quickTo(middle, "opacity", {
        duration: 0.15,
        ease: "power2.out",
      }),
      shrink: gsap.quickTo(shrink, "opacity", {
        duration: 0.15,
        ease: "power2.out",
      }),
      scaleX: gsap.quickTo(frame, "scaleX", {
        duration: 0.2,
        ease: "power2.out",
      }),
      scaleY: gsap.quickTo(frame, "scaleY", {
        duration: 0.2,
        ease: "power2.out",
      }),
      borderRadius: gsap.quickTo(frame, "borderRadius", {
        duration: 0.2,
        ease: "power2.out",
      }),
      y: gsap.quickTo(frame, "y", {
        duration: 0.2,
        ease: "power2.out",
      }),
    };

    // Initial state
    gsap.set([full, middle, shrink], { opacity: 0 });
    gsap.set(full, { opacity: 1 });
    // Transform from center so it shrinks evenly
    gsap.set(frame, {
      transformOrigin: "50% 50%"
    });
  }, []);

  useEffect(() => {
    const setters = settersRef.current;
    if (!setters) return;

    const p = clamp01(progress);

    // Segment weights: Full -> Middle -> Shrink (crossfade between gradient states)
    // Phase 1 (0-0.4): Full fades out, Middle fades in
    // Phase 2 (0.4-1): Middle fades out, Shrink fades in
    let fullOpacity = 1;
    let middleOpacity = 0;
    let shrinkOpacity = 0;

    if (p < 0.4) {
      // Phase 1: Full -> Middle
      const phase = p / 0.4;
      fullOpacity = 1 - phase;
      middleOpacity = phase;
      shrinkOpacity = 0;
    } else {
      // Phase 2: Middle -> Shrink
      const phase = (p - 0.4) / 0.6;
      fullOpacity = 0;
      middleOpacity = 1 - phase;
      shrinkOpacity = phase;
    }

    setters.full(clamp01(fullOpacity));
    setters.middle(clamp01(middleOpacity));
    setters.shrink(clamp01(shrinkOpacity));

    // Shrink animation values:
    // Desktop: Initial 98% width, 88% height -> End 92% width, 72% height
    // Mobile: Initial 100% width, 100% height (no shrink animation on mobile since pinning is disabled)
    const scaleX = isMobile ? 1 : 0.98 - 0.06 * p;
    const initialScaleY = isMobile ? 1 : 0.88;
    const scaleYDelta = isMobile ? 0 : 0.16;
    const scaleY = initialScaleY - scaleYDelta * p;
    const borderRadius = isMobile ? 0 : 32 + 16 * p;
    const yOffset = isMobile ? 0 : 5 + 15 * p;

    setters.scaleX(scaleX);
    setters.scaleY(scaleY);
    setters.borderRadius(borderRadius);
    setters.y(yOffset);
  }, [progress]);

  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        ref={frameRef}
        className="absolute top-0 overflow-hidden h-[95dvh] w-[100dvw]"
        style={{ willChange: "transform, border-radius", borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}
      >
        <div
          ref={fullRef}
          className="absolute inset-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
          style={{ opacity: 1 }}
        >
          <BlueGradientFull />
        </div>
        <div
          ref={middleRef}
          className="absolute inset-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
          style={{ opacity: 0 }}
        >
          <BlueGradientMiddle />
        </div>
        <div
          ref={shrinkRef}
          className="absolute inset-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
          style={{ opacity: 0 }}
        >
          <BlueGradientShrink />
        </div>
      </div>
    </div>
  );
}
