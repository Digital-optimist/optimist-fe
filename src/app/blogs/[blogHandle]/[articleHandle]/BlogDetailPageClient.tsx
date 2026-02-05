"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  BlogDetailHero,
  BlogDetailImage,
  BlogDetailContent,
  BlogSidebar,
  BlogCTASection,
} from "@/components/blogs";
import { BlogArticle } from "@/lib/shopify";

// =============================================================================
// Blog Detail Page Client Component
// =============================================================================

// Easing
const easeOutExpo = "easeOut" as const;

// Page transition variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.4, ease: easeOutExpo },
  },
  exit: { opacity: 0 },
};

// Section reveal variants
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.6,
      ease: easeOutExpo,
    },
  }),
};

interface BlogDetailPageClientProps {
  article: BlogArticle;
}

export default function BlogDetailPageClient({
  article,
}: BlogDetailPageClientProps) {
  return (
    <motion.main
      className="bg-white min-h-screen"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Back to Blogs Link */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-[32px] pt-20 sm:pt-24 md:pt-28">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-[14px] sm:text-[15px] text-[#3478f6] font-medium hover:text-[#1265FF] transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all articles</span>
        </Link>
      </div>

      {/* Hero Section - Tags, Title, Excerpt */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        custom={0}
        variants={sectionVariants}
      >
        <BlogDetailHero article={article} />
      </motion.div>

      {/* Featured Image and Meta */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        custom={1}
        variants={sectionVariants}
      >
        <BlogDetailImage article={article} />
      </motion.div>

      {/* Content and Sidebar */}
      <section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-[32px]">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 xl:gap-24">
            {/* Main Content */}
            <motion.div
              className="flex-1 max-w-full lg:max-w-[720px]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              custom={2}
              variants={sectionVariants}
            >
              <BlogDetailContent contentHtml={article.contentHtml} />
            </motion.div>

            {/* Sidebar */}
            <motion.div
              className="w-full lg:w-[340px] xl:w-[384px] shrink-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              custom={3}
              variants={sectionVariants}
            >
              <div className="lg:sticky lg:top-[120px]">
                <BlogSidebar />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        custom={4}
        variants={sectionVariants}
      >
        <BlogCTASection />
      </motion.div>
    </motion.main>
  );
}
