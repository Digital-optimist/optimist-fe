"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ASSETS } from "@/lib/assets";
import {
  fadeLeft,
  fadeUp,
  staggerParent,
  viewportOnce,
} from "@/lib/motion-variants";

const stagger = staggerParent(0.15);

// =============================================================================
// Mission Section - "To redefine what comfort means for India."
// =============================================================================

export function MissionSection() {
  return (
    <motion.section
      className="bg-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={stagger}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8 sm:gap-10 md:gap-12 lg:gap-14 xl:gap-16">
          <motion.div
            className="flex flex-col gap-5 sm:gap-6 md:gap-7 lg:gap-8 w-full xl:w-[580px] 2xl:w-[620px] shrink-0"
            variants={fadeLeft}
          >
            {/* Label */}
            <p className="font-normal text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px] text-[#3478F6] leading-normal">
              Our Mission
            </p>

            {/* Title and Description */}
            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 text-black">
              <h2 className="font-display font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[44px] 2xl:text-[48px] leading-[1.2] sm:leading-[1.25] lg:leading-[1.15] xl:leading-normal">
                Engineering Cooling India Can Rely On
              </h2>
              <p className="font-light text-sm sm:text-base md:text-lg lg:text-lg xl:text-[20px] leading-[1.6] sm:leading-[1.65] md:leading-[1.7]">
                Reliable cooling in extreme heat. Efficiency that keeps bills
                under control. Clear performance you can trust. We build air
                conditioning designed for real homes and real Indian summers. No
                compromises. No shortcuts. Just cooling that performs when it
                matters.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row xl:flex-row gap-4 sm:gap-5 md:gap-6 items-stretch w-full xl:w-auto"
            variants={staggerParent(0.15)}
          >
            <motion.div
              className="relative w-full sm:flex-1 xl:w-[320px] 2xl:w-[396px] h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] xl:h-[460px] 2xl:h-[480px] rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] overflow-hidden"
              variants={fadeUp}
            >
              <Image
                src={ASSETS.missionImage}
                alt="Comfort redefined for India"
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 396px"
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(268deg, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.5) 98%)",
                }}
              />
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-[#3478F6] to-[#1E4690] w-full sm:flex-1 xl:w-[260px] 2xl:w-[301px] h-[220px] sm:h-[320px] md:h-[380px] lg:h-[420px] xl:h-[460px] 2xl:h-[480px] rounded-[16px] sm:rounded-[20px] overflow-hidden p-4 sm:p-5 md:p-6"
              variants={fadeUp}
            >
              <div className="flex flex-col justify-between h-full text-white">
                <div className="flex flex-col gap-1 sm:gap-2">
                  <p className="font-medium text-sm sm:text-base md:text-lg lg:text-[18px] xl:text-[20px] leading-none opacity-90">
                    India&apos;s Highest
                  </p>
                  <p className="font-bold text-2xl sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[40px] leading-none">
                    ISEER Rating
                  </p>
                </div>
                <div className="flex flex-col gap-1 sm:gap-2">
                  {/* Star rating visual */}
                  <div className="flex gap-0.5 sm:gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 text-[#FFD700]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="font-bold text-5xl sm:text-6xl md:text-[64px] lg:text-[72px] xl:text-[80px] leading-none">
                    6.05
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export default MissionSection;
