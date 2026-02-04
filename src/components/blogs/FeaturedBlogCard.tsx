"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import Image from "next/image";
import Link from "next/link";
import {
  BlogArticle,
  calculateReadTime,
  formatArticleDate,
} from "@/lib/shopify";

// =============================================================================
// Featured Blog Card - Large horizontal card for the latest/featured article
// =============================================================================

interface FeaturedBlogCardProps {
  article: BlogArticle;
}

export function FeaturedBlogCard({ article }: FeaturedBlogCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    },
    { scope: cardRef },
  );

  const readTime = calculateReadTime(article.content);
  const formattedDate = formatArticleDate(article.publishedAt);
  const category = article?.tags || [];

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-[24px] overflow-hidden will-change-[transform,opacity] max-w-[1280px] mx-auto px-4 md:px-6 lg:px-[40px] "
    >
      <div
        className="max-w-[1280px] mx-auto rounded-[24px]"
        style={{ boxShadow: "6px -8px 24px 13px rgba(0, 0, 0, 0.04) inset" }}
      >
        <Link
          href={`/blogs/${article.blog?.handle || "news"}/${article.handle}`}
          className="group flex flex-col lg:flex-row gap-6 lg:gap-10"
        >
          {/* Image */}
          <div className="relative w-full lg:w-1/2 aspect-[4/3] lg:aspect-[16/11] rounded-2xl overflow-hidden bg-gray-100">
            {article.image ? (
              <Image
                src={article.image.url}
                alt={article.image.altText || article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-400"
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
          <div className="flex flex-col justify-center lg:w-1/2 py-2 lg:py-4">
            {/* Category Tag */}
            <div className="flex flex-wrap gap-2">
              {category.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex w-fit px-3 py-1.5 text-[13px] sm:text-[14px] font-medium text-[#1265FF] bg-[#E8F0FE] rounded-full mb-4"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h2 className="font-display font-semibold text-[22px] sm:text-[26px] md:text-[28px] lg:text-[30px] text-[#000000] leading-[1.25] mb-4 group-hover:text-[#1265FF] transition-colors duration-300">
              {article.title}
            </h2>

            {/* Excerpt */}
            <p className="text-[15px] sm:text-[16px] text-[#475467] leading-[1.6] mb-6 line-clamp-3">
              {article.excerpt ||
                article.content.replace(/<[^>]*>/g, "").slice(0, 200) + "..."}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-2 text-[13px] sm:text-[14px] text-[#475467]">
              <span className="font-medium text-[#101828]">
                By- {article.author?.name || "Optimist Team"}
              </span>
              <span className="text-[#D0D5DD]">|</span>
              <span>{readTime} min read</span>
              <span className="text-[#D0D5DD]">|</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default FeaturedBlogCard;
