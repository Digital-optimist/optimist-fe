"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

interface FadeInWrapperProps {
  children: ReactNode;
  className?: string;
}

export function FadeInWrapper({ children, className }: FadeInWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      );
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={className}>
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
