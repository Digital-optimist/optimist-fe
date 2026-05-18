"use client";

import { useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { viewportOnce } from "@/lib/motion-variants";

// Animated lines content
const animatedLines = [
  "Cooling reimagined for Indian reality.",
  "Performance sustained through extreme heat.",
  "Comfort without the compromise.",
];

// Stagger 0.7s between each line — matches the original GSAP "index * 0.7" cadence.
const linesStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.7 } },
};

const lineReveal: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.2, ease: "easeOut" },
  },
};

export function BreathworkSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="relative overflow-hidden min-h-[600px] md:min-h-[700px] lg:min-h-[800px]">
      {/* Video Background with Ripple Effect */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/animations/ripple-bg.webm" type="video/webm" />
          <source src="/animations/ripple-bg.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 py-16 md:py-24 lg:py-32">
        <motion.div
          className="flex flex-col items-center justify-center gap-6 md:gap-8 lg:gap-10 min-h-[400px] md:min-h-[480px] lg:min-h-[560px]"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={linesStagger}
        >
          {animatedLines.map((line, index) => (
            <motion.p
              key={index}
              className="font-light text-[22px] md:text-[32px] lg:text-[42px] text-center leading-[1.3] tracking-[-0.01em]"
              variants={lineReveal}
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
            </motion.p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default BreathworkSection;
