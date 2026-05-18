"use client";

import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "@/lib/motion-variants";

interface BlogDetailContentProps {
  contentHtml: string;
}

export function BlogDetailContent({ contentHtml }: BlogDetailContentProps) {
  return (
    <motion.div
      className="blog-detail-content w-full"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}

export default BlogDetailContent;
