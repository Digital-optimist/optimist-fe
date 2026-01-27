"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

// =============================================================================
// Animated Lines Section - Cooling reimagined for Indian reality
// Kore.ai exact ripple effect - triggers once on scroll into view
// =============================================================================

// Animated lines content
const animatedLines = [
  "Cooling reimagined for Indian reality.",
  "Performance sustained through extreme heat.",
  "Comfort without the compromise.",
];

// Static ring sizes
const ringSizes = [100, 180, 280, 400, 540, 700, 880, 1080];

export function BreathworkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const ripplesContainerRef = useRef<HTMLDivElement>(null);
  const staticRingsRef = useRef<HTMLDivElement>(null);
  const centerDotRef = useRef<HTMLDivElement>(null);
  const innerRingRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const waveLinesRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      // Main timeline triggered once on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // 1. Center dot appears with glow
      tl.fromTo(
        centerDotRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)" },
        0
      );

      // 2. Inner ring expands
      tl.fromTo(
        innerRingRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out" },
        0.2
      );

      // 3. Glow pulse
      tl.fromTo(
        glowRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" },
        0.3
      );

      // 4. Static concentric rings appear with stagger (from center outward)
      if (staticRingsRef.current) {
        const rings = staticRingsRef.current.querySelectorAll(".static-ring");
        tl.fromTo(
          rings,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.1,
          },
          0.4
        );
      }

      // 5. Expanding ripple waves (one-time expansion)
      if (ripplesContainerRef.current) {
        const ripples = ripplesContainerRef.current.querySelectorAll(".ripple-wave");
        ripples.forEach((ripple, index) => {
          tl.fromTo(
            ripple,
            { scale: 1, opacity: 0.6 },
            {
              scale: 15,
              opacity: 0,
              duration: 3,
              ease: "power1.out",
            },
            0.5 + index * 0.4
          );
        });
      }

      // 6. Wave lines fade in
      if (waveLinesRef.current) {
        const paths = waveLinesRef.current.querySelectorAll("path");
        tl.fromTo(
          paths,
          { opacity: 0, y: 20 },
          {
            opacity: (i) => 0.08 - i * 0.008,
            y: 0,
            duration: 1,
            ease: "power2.out",
            stagger: 0.1,
          },
          0.3
        );
      }

      // 7. Content fade-in
      tl.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
        0.6
      );

      // 8. Stagger animation for each text line
      if (linesRef.current) {
        const lines = linesRef.current.querySelectorAll(".animated-line");
        tl.fromTo(
          lines,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.2,
          },
          0.8
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-[600px] md:min-h-[700px] lg:min-h-[800px]"
      style={{
        background: "linear-gradient(180deg, #f8faff 0%, #ffffff 50%, #f0f6ff 100%)",
      }}
    >
      {/* Kore.ai Wavy Background Lines - SVG Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          ref={waveLinesRef}
          className="absolute w-full h-full"
          viewBox="0 0 1440 800"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Wavy lines - Kore.ai style */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <path
              key={`wave-${i}`}
              d={`M-100 ${300 + i * 40} Q 200 ${280 + i * 40 + (i % 2 === 0 ? 30 : -30)}, 400 ${300 + i * 40} T 800 ${300 + i * 40} T 1200 ${300 + i * 40} T 1600 ${300 + i * 40}`}
              fill="none"
              stroke="#3478F6"
              strokeWidth="1"
              opacity="0"
            />
          ))}
        </svg>
      </div>

      {/* Kore.ai Ripple Effect Container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Static concentric circles */}
        <div ref={staticRingsRef}>
          {ringSizes.map((size, index) => (
            <div
              key={`static-ring-${index}`}
              className="static-ring absolute rounded-full border left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                borderColor: `rgba(52, 120, 246, ${0.12 - index * 0.012})`,
                borderWidth: "1px",
                borderStyle: index % 2 === 0 ? "solid" : "dashed",
                opacity: 0,
              }}
            />
          ))}
        </div>

        {/* Expanding ripple waves - one-time expansion */}
        <div ref={ripplesContainerRef}>
          {[0, 1, 2, 3, 4, 5].map((waveIndex) => (
            <div
              key={`ripple-${waveIndex}`}
              className="ripple-wave absolute rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: "80px",
                height: "80px",
                border: "1.5px solid rgba(52, 120, 246, 0.4)",
                opacity: 0,
              }}
            />
          ))}
        </div>

        {/* Inner gradient glow */}
        <div
          ref={glowRef}
          className="absolute rounded-full"
          style={{
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(52, 120, 246, 0.06) 0%, rgba(52, 120, 246, 0.02) 35%, transparent 70%)",
            opacity: 0,
          }}
        />

        {/* Center dot */}
        <div
          ref={centerDotRef}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: "linear-gradient(135deg, #3478F6 0%, #5B9BF8 100%)",
            boxShadow:
              "0 0 12px rgba(52, 120, 246, 0.6), 0 0 24px rgba(52, 120, 246, 0.3), 0 0 36px rgba(52, 120, 246, 0.15)",
            opacity: 0,
          }}
        />

        {/* Secondary inner ring */}
        <div
          ref={innerRingRef}
          className="absolute w-6 h-6 rounded-full border"
          style={{
            borderColor: "rgba(52, 120, 246, 0.3)",
            opacity: 0,
          }}
        />
      </div>

      {/* Center content */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-[1440px] mx-auto px-4 py-16 md:py-24 lg:py-32 will-change-[transform,opacity]"
        style={{ opacity: 0 }}
      >
        {/* Animated lines */}
        <div
          ref={linesRef}
          className="flex flex-col items-center justify-center gap-4 md:gap-5 lg:gap-6 min-h-[400px] md:min-h-[480px] lg:min-h-[560px]"
        >
          {animatedLines.map((line, index) => (
            <p
              key={index}
              className="animated-line font-light text-[22px] md:text-[32px] lg:text-[42px] text-center leading-[1.3] tracking-[-0.01em]"
              style={{ opacity: 0 }}
            >
              {index === 0 ? (
                <>
                  <span className="text-[#1a1a1a]">Cooling reimagined for </span>
                  <span className="text-[#3478F6] font-normal">Indian reality.</span>
                </>
              ) : index === 1 ? (
                <>
                  <span className="text-[#1a1a1a]">Performance sustained through </span>
                  <span className="text-[#3478F6] font-normal">extreme heat.</span>
                </>
              ) : (
                <>
                  <span className="text-[#1a1a1a]">Comfort without the </span>
                  <span className="text-[#3478F6] font-normal">compromise.</span>
                </>
              )}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BreathworkSection;
