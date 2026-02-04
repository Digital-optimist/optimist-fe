"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BlogHeroSection,
  FeaturedBlogCard,
  BlogCategoryTabs,
  BlogGrid,
  BlogPagination,
  BlogCTASection,
} from "@/components/blogs";
import { getArticles, BlogArticle } from "@/lib/shopify";

// =============================================================================
// Blogs Listing Page
// =============================================================================

const ARTICLES_PER_PAGE = 6;

// Helper function to extract unique tags from articles
function extractUniqueTags(articles: BlogArticle[]): string[] {
  const tagSet = new Set<string>();
  articles.forEach((article) => {
    article.tags.forEach((tag) => {
      tagSet.add(tag);
    });
  });
  return Array.from(tagSet).sort();
}

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

export default function BlogsPage() {
  const [allArticles, setAllArticles] = useState<BlogArticle[]>([]); // Store all articles for tag extraction
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<BlogArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Extract dynamic categories from all articles
  const dynamicCategories = useMemo(() => {
    const tags = extractUniqueTags(allArticles);
    return ["All", ...tags];
  }, [allArticles]);

  // Fetch all articles initially to extract tags
  const fetchAllArticles = useCallback(async () => {
    try {
      // Fetch a larger batch to get all available tags
      const { articles: fetchedArticles } = await getArticles(50);
      setAllArticles(fetchedArticles);
    } catch (error) {
      console.error("Error fetching all articles for tags:", error);
    }
  }, []);

  // Fetch articles for display (with optional tag filter)
  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      // Build query based on active category
      const query = activeCategory === "All" ? undefined : `tag:${activeCategory}`;
      
      const { articles: fetchedArticles, pageInfo } = await getArticles(
        ARTICLES_PER_PAGE,
        undefined,
        query
      );

      if (fetchedArticles.length > 0) {
        // First article is the featured one
        setFeaturedArticle(fetchedArticles[0]);
        // All articles including featured are shown in the grid
        setArticles(fetchedArticles.slice(0, ARTICLES_PER_PAGE));
        
        // Calculate total pages (this is simplified - in production you'd get total count from API)
        // For now, we'll show pagination if there are more articles
        setTotalPages(pageInfo.hasNextPage ? Math.max(currentPage + 1, 5) : currentPage);
      } else {
        setFeaturedArticle(null);
        setArticles([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      setFeaturedArticle(null);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, currentPage]);

  // Fetch all articles on mount for tag extraction
  useEffect(() => {
    fetchAllArticles();
  }, [fetchAllArticles]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1); // Reset to first page
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of grid
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  return (
    <motion.main
      className="bg-white min-h-screen overflow-x-hidden"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Hero Section */}
      <BlogHeroSection />

      {/* Featured Article */}
      {!isLoading && featuredArticle && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          custom={0}
          variants={sectionVariants}
        >
          <FeaturedBlogCard article={featuredArticle} />
        </motion.div>
      )}

      {/* Loading state for featured article */}
      {isLoading && (
        <div className="bg-white py-8">
          <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-10 xl:px-[80px]">
            <div className="animate-pulse flex flex-col lg:flex-row gap-6 lg:gap-10">
              <div className="w-full lg:w-1/2 aspect-[16/11] bg-gray-200 rounded-2xl" />
              <div className="lg:w-1/2 space-y-4 py-4">
                <div className="w-24 h-8 bg-gray-200 rounded-full" />
                <div className="w-full h-8 bg-gray-200 rounded" />
                <div className="w-3/4 h-8 bg-gray-200 rounded" />
                <div className="w-full h-4 bg-gray-200 rounded" />
                <div className="w-full h-4 bg-gray-200 rounded" />
                <div className="w-1/2 h-4 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        custom={1}
        variants={sectionVariants}
      >
        <BlogCategoryTabs
          categories={dynamicCategories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </motion.div>

      {/* Blog Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        custom={2}
        variants={sectionVariants}
      >
        <BlogGrid articles={articles} isLoading={isLoading} />
      </motion.div>

      {/* Pagination */}
      {!isLoading && articles.length > 0 && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          custom={3}
          variants={sectionVariants}
        >
          <BlogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </motion.div>
      )}

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
