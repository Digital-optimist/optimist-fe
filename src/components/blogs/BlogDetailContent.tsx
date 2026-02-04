"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

// =============================================================================
// Blog Detail Content - Rich HTML content rendering
// =============================================================================

interface BlogDetailContentProps {
  contentHtml: string;
}

export function BlogDetailContent({ contentHtml }: BlogDetailContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    },
    { scope: contentRef }
  );

  return (
    <div
      ref={contentRef}
      className="blog-detail-content w-full will-change-[transform,opacity]"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}

export default BlogDetailContent;
