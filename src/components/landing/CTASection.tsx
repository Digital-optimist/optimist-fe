"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useWaitlist } from "@/contexts/WaitlistContext";

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const topCardRef = useRef<HTMLDivElement>(null);
  const bottomGridRef = useRef<HTMLDivElement>(null);
  const { openModal } = useWaitlist();

  useGSAP(
    () => {
      gsap.fromTo(
        topCardRef.current,
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: topCardRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );

      gsap.fromTo(
        bottomGridRef.current,
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bottomGridRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-4 md:py-6 overflow-x-hidden bg-white"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 flex flex-col gap-4 md:gap-6">
        {/* Top Card - 45°C+ Performance */}
        <div
          ref={topCardRef}
          className="relative rounded-[24px] md:rounded-[32px] overflow-hidden h-[200px] md:h-[380px]"
        >
          {/* Video Background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/TreeCool.mp4" type="video/mp4" />
          </video>

          {/* Blue Overlay with Blur */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "#3478F6",
              filter: "blur(100px)",
              opacity: 0.5,
            }}
          />

          {/* Gradient Overlay - from transparent to black at bottom */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-6 md:px-10 md:pb-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-[32px] md:text-[48px] lg:text-[56px] font-bold text-[#AEFFD8] leading-tight">
                  45°C+ performance.
                </h2>
                <p className="text-white/80 text-base md:text-lg mt-1">
                  Tested for consistent cooling.
                </p>
              </div>
              <button
                onClick={openModal}
                className="hidden md:inline-flex items-center justify-center px-8 py-3 rounded-full text-white font-semibold text-base"
                style={{ background: "#3478F6" }}
              >
                Join the Waitlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
