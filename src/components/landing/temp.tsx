"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ShrinkingHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Path data strings
  const startPath =
    "M0 191C0 191 410.62 285.689 680 285.689C949.38 285.689 1360 191 1360 191V2209H0V191Z";
  const endPath = "M0 191 L1360 191 V2209 H0 V191 Z";

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=100%", // The animation lasts for 100% of the viewport height
          scrub: 1, // Smoothly links animation to scroll
          pin: true, // Locks the section in place while animating
          anticipatePin: 1,
        },
      });

      // 1. Shrink the main card
      tl.to(
        cardRef.current,
        {
          width: "92%",
          height: "85vh",
          borderRadius: "48px",
          y: "4vh", // Adds a slight vertical offset for a floating look
          ease: "power2.inOut",
        },
        0
      );

      // 2. Flatten the SVG Path (Morph-like effect)
      tl.to(
        pathRef.current,
        {
          attr: { d: endPath },
          ease: "power2.inOut",
        },
        0
      );

      // 3. Fade out text or scale it slightly
      tl.to(
        contentRef.current,
        {
          scale: 0.9,
          opacity: 0.8,
          ease: "power2.inOut",
        },
        0
      );
    },
    { scope: containerRef }
  );

  return (
    <main className="bg-black">
      {/* PINNED SECTION */}
      <section
        ref={containerRef}
        className="relative h-screen w-full flex items-start justify-center overflow-hidden"
      >
        <div
          ref={cardRef}
          className="relative w-full h-full bg-[#3478F6] overflow-hidden origin-top"
        >
          {/* Background SVG */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1360 622"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#hero-blur)">
              <path ref={pathRef} d={startPath} fill="#3478F6" />
            </g>
            <defs>
              <filter
                id="hero-blur"
                x="-200"
                y="-9"
                width="1760"
                height="2418"
                filterUnits="userSpaceOnUse"
              >
                <feGaussianBlur stdDeviation="100" />
              </filter>
            </defs>
          </svg>

          {/* Foreground Content */}
          <div
            ref={contentRef}
            className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6"
          >
            <h1 className="text-white text-5xl md:text-8xl font-bold tracking-tight">
              More Chill.
              <br />
              Lower Bill.
            </h1>

            <div className="mt-10 flex gap-4">
              <button className="px-6 py-3 rounded-full border border-white/30 text-white backdrop-blur-md">
                Why Optimist?
              </button>
              <button className="px-8 py-3 rounded-full bg-white text-blue-600 font-semibold shadow-xl">
                Join the Waitlist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NEXT SECTION (To test the scroll-away effect) */}
      <section className="h-screen bg-white flex items-center justify-center">
        <h2 className="text-black text-4xl font-medium">
          Scroll down to see the next section.
        </h2>
      </section>
    </main>
  );
}
