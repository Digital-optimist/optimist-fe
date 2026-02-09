"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

// =============================================================================
// Animated Lines Section - Cooling reimagined for Indian reality
// Video background with ripple effect - text lines animate on scroll
// =============================================================================

// Animated lines content
const animatedLines = [
  "Cooling reimagined for Indian reality.",
  "Performance sustained through extreme heat.",
  "Comfort without the compromise.",
];

export function BreathworkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);

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

      // Animate each text line one by one with stagger
      if (linesRef.current) {
        const lines = linesRef.current.querySelectorAll(".animated-line");

        lines.forEach((line, index) => {
          tl.fromTo(
            line,
            {
              opacity: 0,
              y: 60,
              scale: 0.95,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.2,
              ease: "power3.out",
            },
            index * 0.7, // Each line starts 0.7s after the previous
          );
        });
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-[600px] md:min-h-[700px] lg:min-h-[800px]"
    >
      {/* Video Background with Ripple Effect */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="/animations/68e6057dd670c86ab26c8544_Kore Hero Banner Ripple BG-transcode.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Center content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 py-16 md:py-24 lg:py-32">
        {/* Animated lines */}
        <div
          ref={linesRef}
          className="flex flex-col items-center justify-center gap-6 md:gap-8 lg:gap-10 min-h-[400px] md:min-h-[480px] lg:min-h-[560px]"
        >
          {animatedLines.map((line, index) => (
            <p
              key={index}
              className="animated-line font-light text-[22px] md:text-[32px] lg:text-[42px] text-center leading-[1.3] tracking-[-0.01em] will-change-transform"
              style={{ opacity: 0 }}
            >
              {index === 0 ? (
                <>
                  <span className="text-[#1a1a1a]">
                    Cooling reimagined for{" "}
                  </span>
                  <span className="text-[#3478F6] font-normal">
                    Indian reality.
                  </span>
                </>
              ) : index === 1 ? (
                <>
                  <span className="text-[#1a1a1a]">
                    Performance sustained through{" "}
                  </span>
                  <span className="text-[#3478F6] font-normal">
                    extreme heat.
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[#1a1a1a]">Comfort without the </span>
                  <span className="text-[#3478F6] font-normal">
                    compromise.
                  </span>
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
