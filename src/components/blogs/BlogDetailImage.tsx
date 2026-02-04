"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import Image from "next/image";
import { BlogArticle, formatArticleDate } from "@/lib/shopify";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

// =============================================================================
// Blog Detail Image - Featured image with author info and social share
// =============================================================================

interface BlogDetailImageProps {
  article: BlogArticle;
}

export function BlogDetailImage({ article }: BlogDetailImageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // Image animation
      tl.from(imageRef.current, {
        opacity: 0,
        scale: 0.98,
        duration: 0.8,
        ease: "power3.out",
      });

      // Meta animation
      tl.from(
        metaRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.4"
      );
    },
    { scope: sectionRef }
  );

  const formattedDate = formatArticleDate(article.publishedAt);
  const articleUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(article.title);
    const url = encodeURIComponent(articleUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(articleUrl);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section ref={sectionRef} className="bg-white pb-8 md:pb-12 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-[32px]">
        <div className="flex flex-col gap-[20px] sm:gap-[24px]">
          {/* Featured Image */}
          <div
            ref={imageRef}
            className="relative w-full aspect-[16/9] md:aspect-[2.4/1] rounded-[16px] sm:rounded-[20px] md:rounded-[24px] overflow-hidden bg-gray-100 will-change-[transform,opacity]"
          >
            {article.image ? (
              <Image
                src={article.image.url}
                alt={article.image.altText || article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1216px"
                priority
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

          {/* Meta and Social Share */}
          <div
            ref={metaRef}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-8 will-change-[transform,opacity]"
          >
            {/* Author and Date */}
            <div className="flex flex-wrap items-start sm:items-center gap-4 sm:gap-8 md:gap-16">
              {/* Written by */}
              <div className="flex flex-col gap-[4px]">
                <span className="font-display font-medium text-[13px] sm:text-[14px] text-[#3478f6] leading-[20px]">
                  Written by
                </span>
                <span className="font-display font-semibold text-[16px] sm:text-[18px] text-[#101828] leading-[28px]">
                  {article.author?.name || "Optimist Team"}
                </span>
              </div>

              {/* Published on */}
              <div className="flex flex-col gap-[4px]">
                <span className="font-display font-medium text-[13px] sm:text-[14px] text-[#3478f6] leading-[20px]">
                  Published on
                </span>
                <span className="font-display font-semibold text-[16px] sm:text-[18px] text-[#101828] leading-[28px]">
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-[8px] sm:gap-[12px]">
              {/* Copy Link Button */}
              <button
                onClick={handleCopyLink}
                className="group flex items-center gap-[8px] px-[12px] sm:px-[16px] py-[8px] sm:py-[10px] bg-white border border-[rgba(0,0,0,0.12)] rounded-[39px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:border-[#3478f6] transition-colors duration-200"
              >
                {copied ? (
                  <Check className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-green-500" />
                ) : (
                  <Copy className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-[#3478f6]" />
                )}
                <span className="font-display font-medium text-[13px] sm:text-[14px] text-[#3478f6] leading-[20px]">
                  {copied ? "Copied!" : "Copy link"}
                </span>
              </button>

              {/* Twitter/X Button */}
              <button
                onClick={handleShareTwitter}
                className="flex items-center justify-center p-[8px] sm:p-[10px] bg-white border border-[rgba(0,0,0,0.12)] rounded-[39px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:border-[#3478f6] transition-colors duration-200"
                aria-label="Share on Twitter"
              >
                <svg
                  className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-[#101828]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>

              {/* LinkedIn Button */}
              <button
                onClick={handleShareLinkedIn}
                className="flex items-center justify-center p-[8px] sm:p-[10px] bg-white border border-[rgba(0,0,0,0.12)] rounded-[39px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:border-[#3478f6] transition-colors duration-200"
                aria-label="Share on LinkedIn"
              >
                <svg
                  className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-[#101828]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlogDetailImage;
