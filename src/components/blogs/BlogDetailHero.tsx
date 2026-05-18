"use client";

import { motion } from "framer-motion";
import { BlogArticle } from "@/lib/shopify";
import {
  fadeUp,
  fadeUpSmall,
  staggerParent,
  viewportOnce,
} from "@/lib/motion-variants";

interface BlogDetailHeroProps {
  article: BlogArticle;
}

const stagger = staggerParent(0.2);

export function BlogDetailHero({ article }: BlogDetailHeroProps) {
  const tags = article.tags || [];

  return (
    <section className="bg-white md:pt-8 pt-4 pb-6 md:pb-8">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-[32px]">
        <motion.div
          className="max-w-[768px]"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
        >
          <div className="flex flex-col gap-[16px]">
            {tags.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-[12px] sm:gap-[16px]"
                variants={fadeUpSmall}
              >
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="relative inline-flex items-center justify-center px-[8px] py-[6px] sm:px-[10px] sm:py-[8px] rounded-[45px] bg-[rgba(52,120,246,0.12)]"
                  >
                    <span className="text-[13px] sm:text-[14px] text-[#3478f6] leading-normal">
                      {tag}
                    </span>
                    <div
                      className="absolute inset-0 pointer-events-none rounded-[inherit]"
                      style={{ boxShadow: "inset 0px -2px 4px 0px #ccdeff" }}
                    />
                  </div>
                ))}
              </motion.div>
            )}

            <motion.h1
              className="font-display font-semibold text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] text-[#101828] leading-[1.2] lg:leading-[60px] tracking-[-0.02em]"
              variants={fadeUp}
            >
              {article.title}
            </motion.h1>
          </div>

          {article.excerpt && (
            <motion.p
              className="mt-[16px] sm:mt-[20px] md:mt-[24px] font-display text-[16px] sm:text-[18px] md:text-[20px] text-[rgba(0,0,0,0.5)] leading-[1.5] lg:leading-[26px]"
              variants={fadeUpSmall}
            >
              {article.excerpt}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default BlogDetailHero;
