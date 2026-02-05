"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

// =============================================================================
// Blog Category Tabs - Filter tabs for blog categories
// =============================================================================

interface BlogCategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function BlogCategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: BlogCategoryTabsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    },
    { scope: sectionRef },
  );

  // Don't render if there are no categories or only "All"
  if (!categories || categories.length <= 1) {
    return null;
  }

  return (
    <div
      ref={sectionRef}
      className="bg-white pt-16 md:pt-20 lg:pt-24 will-change-[transform,opacity]"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-[40px]">
        {/* Section Title */}
        <h3 className="font-display font-semibold text-[28px] sm:text-[28px] md:text-[32px] lg:text-[36px] text-[#101828] text-center mb-6 md:mb-8">
          Explore more topics
        </h3>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2.5 text-[13px] sm:text-[14px] font-medium rounded-full transition-all duration-300 whitespace-nowrap border ${
                activeCategory === category
                  ? "bg-[#1265FF] text-white border-[#1265FF] shadow-md"
                  : "bg-white text-[#344054] border-[#D0D5DD] hover:border-[#98A2B3] hover:text-[#101828]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogCategoryTabs;
