"use client";

import { m } from "framer-motion";
import { cn } from "@/lib/cn";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion-variants";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

// Ported from optimist-website (blue eyebrow + ABC Solar Display title + muted
// description), now self-animating: the block is a staggered parent that fades
// its eyebrow → title → description up on scroll-into-view. `whitespace-pre-line`
// honours \n line breaks in title/description on md+ (matching the reference).
export function SectionTitle({
  eyebrow,
  title,
  description,
  className,
}: SectionTitleProps) {
  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerParent(0.1)}
      className={cn("text-center", className)}
    >
      {eyebrow && (
        <m.p
          variants={fadeUp}
          className="text-base sm:text-lg md:text-[20px] leading-[160%] font-poppins font-normal text-[#3478F6]"
        >
          {eyebrow}
        </m.p>
      )}
      <m.h2
        variants={fadeUp}
        className="mt-3 sm:mt-4 md:mt-5 md:whitespace-pre-line text-[28px] sm:text-[36px] md:text-[48px] leading-[120%] font-solar font-medium"
      >
        {title}
      </m.h2>
      {description && (
        <m.p
          variants={fadeUp}
          className="mt-2 text-sm sm:text-base leading-[160%] font-light text-[#6A6A6A] md:whitespace-pre-line"
        >
          {description}
        </m.p>
      )}
    </m.div>
  );
}
