"use client";

import { m as motion } from "framer-motion";
import { fadeUp } from "@/lib/motion-variants";

interface BlogDetailContentProps {
  contentHtml: string;
}

export function BlogDetailContent({ contentHtml }: BlogDetailContentProps) {
  return (
    <motion.div
      className="blog-detail-content w-full"
      initial="hidden"
      // Reveal on mount, NOT on scroll. This is a very tall element, and a
      // whileInView threshold (amount: 0.2 ≈ 800px) is near the max fraction the
      // viewport can ever show, so it fired only intermittently — leaving the
      // article body stuck at opacity 0. `animate` guarantees it always shows.
      animate="visible"
      variants={fadeUp}
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}

export default BlogDetailContent;
