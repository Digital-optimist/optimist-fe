"use client";

import { useEffect, useState, type RefObject } from "react";
import { ScrollTrigger } from "@/lib/gsap";

interface ScrollProgressOptions {
  start?: string;
  end?: string;
  scrub?: boolean | number;
}

/**
 * Custom hook that returns normalized scroll progress (0-1) for a given element
 * Uses GSAP ScrollTrigger for optimal performance
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  options: ScrollProgressOptions = {}
) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const { start = "top bottom", end = "bottom top", scrub = true } = options;

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start,
      end,
      scrub: scrub === true ? 1 : scrub,
      onUpdate: (self) => {
        setProgress(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [ref, options]);

  return progress;
}

/**
 * Hook that returns the overall page scroll progress (0-1)
 */
export function usePageScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setProgress(Math.min(1, Math.max(0, scrollProgress)));
    };

    // Update ScrollTrigger and calculate progress
    ScrollTrigger.addEventListener("refresh", handleScroll);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      ScrollTrigger.removeEventListener("refresh", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return progress;
}

export default useScrollProgress;

