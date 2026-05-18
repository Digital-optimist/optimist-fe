"use client";

import { motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { viewportOnce } from "@/lib/motion-variants";

const sectionStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const textReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const buttonReveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export function CTASection() {
  const router = useRouter();

  return (
    <motion.section
      className="bg-white py-12 md:py-16 lg:py-20 xl:py-24 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={sectionStagger}
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 xl:px-[40px]">
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-4 md:gap-6 lg:gap-8">
          <motion.div
            className="flex flex-col font-display text-center lg:text-left lg:max-w-[809px]"
            variants={textReveal}
          >
            <p className="font-semibold text-[28px] sm:text-[40px] md:text-[56px] lg:text-[64px] xl:text-[64px] text-black leading-[1.2] lg:leading-normal">
              Best Cooling.{" "}
              <span className="text-[#3478F6]">Lowest Bills.</span>
            </p>

            <p className="font-semibold text-[28px] sm:text-[40px] md:text-[56px] lg:text-[64px] xl:text-[64px] text-black leading-[1.2] lg:leading-normal">
              Designed for <span className="text-[#3478F6]">Tomorrow.</span>
            </p>
          </motion.div>

          <motion.button
            onClick={() => router.push("/products")}
            className="group relative flex items-center justify-center gap-2.5 min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[241px] w-auto px-8 md:px-10 lg:px-[48px] h-[52px] sm:h-[56px] md:h-[60px] lg:h-[64px] rounded-[36px] overflow-hidden shrink-0 transition-transform duration-300 hover:scale-[1.03]"
            style={{ background: "#3478F6" }}
            variants={buttonReveal}
          >
            <span className="font-display font-semibold text-[16px] md:text-[18px] lg:text-[20px] text-[#FFFCDC] text-center whitespace-nowrap">
              Buy Now
            </span>

            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path
                d="M7 17L17 7M17 7H7M17 7V17"
                stroke="#FFFCDC"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}

export default CTASection;
