"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { BlogArticle } from "@/lib/shopify";

// =============================================================================
// Blog Detail Hero - Tags, Title, and Excerpt
// =============================================================================

interface BlogDetailHeroProps {
  article: BlogArticle;
}

export function BlogDetailHero({ article }: BlogDetailHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const excerptRef = useRef<HTMLParagraphElement>(null);

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

      // Badges animation
      tl.from(badgesRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
      });

      // Title animation
      tl.from(
        titleRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.4",
      );

      // Excerpt animation
      tl.from(
        excerptRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.4",
      );
    },
    { scope: sectionRef },
  );

  const tags = article.tags || [];

  return (
    <section
      ref={sectionRef}
      className="bg-white md:pt-8 pt-4 pb-6 md:pb-8"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-[32px]">
        <div className="max-w-[768px]">
          {/* Tags and Title */}
          <div className="flex flex-col gap-[16px]">
            {/* Tags */}
            {tags.length > 0 && (
              <div
                ref={badgesRef}
                className="flex flex-wrap gap-[12px] sm:gap-[16px] will-change-[transform,opacity]"
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
              </div>
            )}

            {/* Title */}
            <h1
              ref={titleRef}
              className="font-display font-semibold text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] text-[#101828] leading-[1.2] lg:leading-[60px] tracking-[-0.02em] will-change-[transform,opacity]"
            >
              {article.title}
            </h1>
          </div>

          {/* Excerpt */}
          {article.excerpt && (
            <p
              ref={excerptRef}
              className="mt-[16px] sm:mt-[20px] md:mt-[24px] font-display text-[16px] sm:text-[18px] md:text-[20px] text-[rgba(0,0,0,0.5)] leading-[1.5] lg:leading-[26px] will-change-[transform,opacity]"
            >
              {article.excerpt}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default BlogDetailHero;
