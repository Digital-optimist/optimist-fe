"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BlogArticle,
  calculateReadTime,
  formatArticleDate,
} from "@/lib/shopify";
import { ArrowUpRight } from "lucide-react";

// =============================================================================
// Blog Card - Individual blog card for the grid
// =============================================================================

interface BlogCardProps {
  article: BlogArticle;
  index?: number;
}

export function BlogCard({ article, index = 0 }: BlogCardProps) {
  const readTime = calculateReadTime(article.content);
  const formattedDate = formatArticleDate(article.publishedAt);
  const tags = article.tags || [];

  return (
    <Link
      href={`/blogs/${article.blog?.handle || "news"}/${article.handle}`}
      className="group relative flex flex-col bg-white rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-lg"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Inset shadow overlay */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-[inherit] z-10"
        style={{ boxShadow: "inset 6px -8px 24px 0px rgba(0, 0, 0, 0.04)" }}
      />

      {/* Image */}
      <div className="relative w-full h-[240px] m-[24px] mb-0 rounded-[16px] overflow-hidden bg-gray-100" style={{ width: "calc(100% - 48px)" }}>
        {article.image ? (
          <Image
            src={article.image.url}
            alt={article.image.altText || article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
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
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-[24px] p-[24px]">
        <div className="flex flex-col gap-[12px]">
          {/* Category Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="relative inline-flex w-fit items-center justify-center px-[8px] py-[6px] rounded-[45px] bg-[rgba(52,120,246,0.12)]"
              >
                <span className="text-[13px] text-[#3478f6] leading-normal">
                  {tag}
                </span>
                <div 
                  className="absolute inset-0 pointer-events-none rounded-[inherit]"
                  style={{ boxShadow: "inset 0px -2px 4px 0px #ccdeff" }}
                />
              </div>
            ))}
          </div>

          {/* Title with Arrow */}
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-start justify-between gap-[16px]">
              <h3 className="font-display font-semibold text-[20px] text-[#101828] leading-[28px] group-hover:text-[#1265FF] transition-colors duration-300 line-clamp-2 flex-1">
                {article.title}
              </h3>
              <div className="pt-[4px] shrink-0">
                <ArrowUpRight className="w-[24px] h-[24px] text-[#101828] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#1265FF]" />
              </div>
            </div>

            {/* Excerpt */}
            <p className="text-[14px] text-[#475467] leading-[20px] line-clamp-2">
              {article.excerpt ||
                article.content.replace(/<[^>]*>/g, "").slice(0, 120) + "..."}
            </p>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-[11px] text-[14px] font-medium text-black mt-auto">
          <span>By- {article.author?.name || "Optimist Team"}</span>
          <span className="text-[#D0D5DD]">|</span>
          <span>{readTime} min read</span>
          <span className="text-[#D0D5DD]">|</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </Link>
  );
}

export default BlogCard;
