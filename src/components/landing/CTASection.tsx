"use client";

import { motion, type Variants } from "framer-motion";
import { ASSETS } from "@/lib/assets";
import { useRouter } from "next/navigation";
import { viewportOnce } from "@/lib/motion-variants";

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export function CTASection() {
  const router = useRouter();

  return (
    <section className="relative py-4 md:py-6 overflow-x-hidden bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 flex flex-col gap-4 md:gap-6">
        <motion.div
          className="relative rounded-[24px] md:rounded-[32px] overflow-hidden h-[200px] md:h-[380px]"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={cardReveal}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={ASSETS.videos.treeCool} type="video/mp4" />
          </video>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, rgba(52, 120, 246, 0.5) 0%, rgba(52, 120, 246, 0.3) 50%, transparent 70%)",
              transform: "translateZ(0)",
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)",
            }}
          />

          <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-6 md:px-10 md:pb-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-[32px] md:text-[48px] lg:text-[56px] font-bold text-[#AEFFD8] leading-tight">
                  50°C+ performance.
                </h2>
                <p className="text-white/80 text-base md:text-lg mt-1">
                  Tested for consistent cooling.
                </p>
              </div>
              <button
                onClick={() => router.push("/products")}
                className="btn-buy-now text-[#FFFCDC] hidden md:inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold"
              >
                Buy Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
