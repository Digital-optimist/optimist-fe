"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ASSETS from "@/lib/assets";
import { useWaitlist } from "@/contexts/WaitlistContext";
import { FAQSection } from "./FAQSection";

// =============================================================================
// Main Component
// =============================================================================

export function BuiltForSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  const [videoEnded, setVideoEnded] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const { openModal } = useWaitlist();

  // Use Framer Motion's useInView to detect when section is visible
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // Play video when section comes into view
  useEffect(() => {
    if (isInView && !hasStartedPlaying) {
      setHasStartedPlaying(true);

      // Play desktop video
      if (videoRef.current) {
        videoRef.current.play().catch((e) => {
          console.log("Desktop video play failed", e);
          setVideoEnded(true);
        });
      }

      // Play mobile video
      if (mobileVideoRef.current) {
        mobileVideoRef.current.play().catch((e) => {
          console.log("Mobile video play failed", e);
          setVideoEnded(true);
        });
      }
    }
  }, [isInView, hasStartedPlaying]);

  const handleVideoEnded = () => {
    setVideoEnded(true);
  };

  // Animation variants for callouts
  const calloutVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Container variants for staggered children
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  // Section entrance animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as const },
    },
  };

  const imageContainerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: [0, 0, 0.2, 1] as const, delay: 0.2 },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="bg-white mt-8 py-6 md:py-8 lg:py-10 overflow-hidden"
    >
      <div className="max-w-[1400px]  mx-auto px-4 md:px-6 lg:px-8">
        {/* Title */}
        <motion.div
          className="text-center mb-8 md:mb-11"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={sectionVariants}
        >
          <p className="text-[#3478F6] text-sm md:text-base mb-2">
            India’s Real AC{" "}
          </p>
          <h2 className="font-display text-2xl md:text-4xl lg:text-[40px] font-semibold text-black">
            Your Optimist
          </h2>
        </motion.div>

        {/* Desktop Layout - AC Video with Absolute Positioned Callouts */}
        <motion.div
          className="hidden md:block relative w-full max-w-[1229px] mx-auto mb-12 md:mb-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={imageContainerVariants}
        >
          {/* Container with relative positioning for absolute children */}
          <div className="relative" style={{ height: "550px" }}>
            {/* AC Video - plays on scroll, stops at last frame */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: "950px",
                height: "550px",
              }}
            >
              <video
                ref={videoRef}
                src={ASSETS.videos.productCardAnimation2}
                className="w-full h-full object-contain mix-blend-multiply"
                muted
                playsInline
                onEnded={handleVideoEnded}
              />
            </div>

            {/* Callouts Container - animated after video ends */}
            <motion.div
              initial="hidden"
              animate={videoEnded ? "visible" : "hidden"}
              variants={containerVariants}
            >
              {/* Callout: Cools consistently - Top Left */}
              <motion.div
                className="absolute flex flex-col items-start"
                style={{ left: "0", top: "0" }}
                variants={calloutVariants}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <p className="font-semibold text-[32px] leading-normal text-black">
                  Tested to cool
                </p>
                <p className="font-semibold text-[32px] leading-normal text-[#3478F6]">
                  at 50°C
                </p>
              </motion.div>

              {/* Callout: Live Energy Meter - Top Right (blue) */}
              <motion.div
                className="absolute flex flex-col items-start"
                style={{ right: "0px", top: "122px", width: "324px" }}
                variants={calloutVariants}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <p className="font-semibold text-[32px] leading-normal text-black">
                  Live Energy
                </p>
                <p className="font-semibold text-[32px] leading-normal text-[#3478F6]">
                  Meter
                </p>
              </motion.div>

              {/* Callout: Live Gas Level Indicator - Bottom Left */}
              <motion.div
                className="absolute flex flex-col items-start"
                style={{ left: "208px", bottom: 0, width: "324px" }}
                variants={calloutVariants}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <p className="font-semibold text-[32px] leading-normal text-black">
                  Live Gas Level
                </p>
                <p className="font-semibold text-[32px] leading-normal text-[#3478F6]">
                  Indicator
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Mobile Layout - AC Video with Absolute Positioned Callouts */}
        <motion.div
          className="md:hidden relative w-full mb-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={imageContainerVariants}
        >
          {/* Container with relative positioning */}
          <div className="relative" style={{ minHeight: "400px" }}>
            {/* AC Video - plays on scroll, stops at last frame (Mobile) */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  "
              style={{
                width: "340px",
                height: "350px",
              }}
            >
              <video
                ref={mobileVideoRef}
                src={ASSETS.videos.productCardAnimation2}
                className="w-full h-full object-contain   mix-blend-multiply"
                muted
                playsInline
                onEnded={handleVideoEnded}
              />
            </div>

            {/* Callouts - animated after video ends */}
            <motion.div
              initial="hidden"
              animate={videoEnded ? "visible" : "hidden"}
              variants={containerVariants}
            >
              {/* Callout: Cools consistently - Top Left */}
              <motion.div
                className="absolute flex flex-col items-start"
                style={{ left: "0", top: "20px" }}
                variants={calloutVariants}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <p className="font-semibold text-base leading-normal text-black">
                  Tested to cool
                </p>
                <p className="font-semibold text-base leading-normal text-[#3478F6]">
                  at 50°C
                </p>
              </motion.div>

              {/* Callout: Live Energy Meter - Top Right */}
              <motion.div
                className="absolute flex flex-col items-end text-right"
                style={{ right: "0", top: "120px" }}
                variants={calloutVariants}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <p className="font-semibold text-base leading-normal text-black">
                  Live Energy
                </p>
                <p className="font-semibold text-base leading-normal text-[#3478F6]">
                  Meter
                </p>
              </motion.div>

              {/* Callout: Live Gas Level Indicator - Bottom Left */}
              <motion.div
                className="absolute flex flex-col items-start"
                style={{ left: "0", bottom: "20px" }}
                variants={calloutVariants}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <p className="font-semibold text-base leading-normal text-black">
                  Live Gas Level
                </p>
                <p className="font-semibold text-base leading-normal text-[#3478F6]">
                  Indicator
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={sectionVariants}
          transition={{ delay: 0.3 }}
          className="mb-12 md:mb-16"
        >
          <FAQSection />
        </motion.div>

        {/* Bottom Section - Outcome and CTA */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={sectionVariants}
          transition={{ delay: 0.4 }}
        >
          {/* Outcome */}
          <div className="font-display text-center md:text-left">
            <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight">
              <span className="text-black">Nothing more,</span>
            </p>
            <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight mt-1">
              <span className="text-[#3478F6]">nothing less.</span>
            </p>
          </div>

          {/* Join the Waitlist Button */}
          <button
            onClick={openModal}
            className="btn-buy-now flex items-center justify-center gap-2.5 px-8 md:px-12 py-4 h-14 md:h-16 rounded-full text-[#FFFCDC] font-semibold text-base md:text-xl whitespace-nowrap"
          >
            <span>Join the Waitlist</span>
            <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
