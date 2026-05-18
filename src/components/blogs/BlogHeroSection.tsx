"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";

const stagger = staggerParent(0.2);

export function BlogHeroSection() {
  return (
    <section className="bg-white pt-24 sm:pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-[40px]">
        <motion.div
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
        >
          <motion.div className="font-display" variants={fadeUp}>
            <h1 className="text-[36px] sm:text-[44px] md:text-[54px] lg:text-[54px] font-bold leading-[1.1]">
              <span className="text-[#1265FF]">Industry news,</span>
              <br />
              <span className="text-black">insights and more</span>
            </h1>
          </motion.div>

          <motion.p
            className="text-[16px] sm:text-[18px] md:text-[20px] text-[#475467] max-w-[360px] lg:max-w-[320px] leading-[1.5] lg:text-right lg:pb-2"
            variants={fadeUp}
          >
            Here&apos;s a peek at what we&apos;re up to in terms of technology,
            design and intelligence.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

export default BlogHeroSection;
