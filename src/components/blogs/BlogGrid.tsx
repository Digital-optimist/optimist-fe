"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { BlogArticle } from "@/lib/shopify";
import BlogCard from "./BlogCard";

// =============================================================================
// Blog Grid - Grid of blog cards
// =============================================================================

interface BlogGridProps {
  articles: BlogArticle[];
  isLoading?: boolean;
}

export function BlogGrid({ articles, isLoading = false }: BlogGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!gridRef.current || isLoading) return;

      const cards = gridRef.current.querySelectorAll(".blog-card");
      gsap.from(cards, {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    },
    { scope: gridRef, dependencies: [articles, isLoading] },
  );

  if (isLoading) {
    return (
      <div className="bg-white py-8 md:py-10 lg:py-12">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-[40px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-100 rounded-2xl overflow-hidden"
              >
                <div className="w-full aspect-[16/10] bg-gray-200" />
                <div className="p-4 md:p-5 space-y-3">
                  <div className="w-20 h-6 bg-gray-200 rounded-full" />
                  <div className="w-full h-5 bg-gray-200 rounded" />
                  <div className="w-3/4 h-5 bg-gray-200 rounded" />
                  <div className="w-full h-4 bg-gray-200 rounded" />
                  <div className="w-2/3 h-4 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="bg-white py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-[40px]">
          <div className="text-center">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="font-display font-semibold text-xl text-[#101828] mb-2">
              No articles found
            </h3>
            <p className="text-[#475467]">
              Check back later for new content or try a different category.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-8 md:py-10 lg:py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-[40px]">
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {articles.map((article, index) => (
            <div key={article.id} className="blog-card">
              <BlogCard article={article} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogGrid;
