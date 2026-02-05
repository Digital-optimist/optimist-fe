"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface SmoothScrollProps {
  children: React.ReactNode;
}

// Check if device is mobile/touch device
const isMobileDevice = () => {
  if (typeof window === "undefined") return false;
  return (
    window.innerWidth < 768 ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0
  );
};

// Check if device is iOS
const isIOSDevice = () => {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
};

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  // Initialize isMobile synchronously to prevent Lenis from ever initializing on mobile
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== "undefined" ? isMobileDevice() : false
  );
  const [isIOS, setIsIOS] = useState(() =>
    typeof window !== "undefined" ? isIOSDevice() : false
  );

  // Update on resize (for orientation changes)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobileDevice());
      setIsIOS(isIOSDevice());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Skip Lenis on mobile/iOS - use native scrolling for better touch experience
    if (isMobile || isIOS) {
      // Still need to update ScrollTrigger on native scroll
      const handleScroll = () => {
        ScrollTrigger.update();
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      
      // Ensure native scrolling works properly on iOS
      document.documentElement.style.setProperty("-webkit-overflow-scrolling", "touch");
      
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }

    // Initialize Lenis for smooth scrolling with optimized settings - DESKTOP ONLY
    const lenis = new Lenis({
      // Reduced duration for faster response and less processing
      duration: 0.8,
      // Simplified easing for better performance
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      // Reduce wheel multiplier for better control
      wheelMultiplier: 0.8,
      // Enable autoRaf to reduce manual RAF overhead
      autoRaf: false, // We'll handle RAF manually for better control with GSAP
    });

    lenisRef.current = lenis;

    // Sync Lenis scroll with GSAP's ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Add Lenis to GSAP's ticker for smooth animation frame updates
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);

    // Disable GSAP's default lag smoothing for better sync with Lenis
    gsap.ticker.lagSmoothing(0);

    // Cleanup on unmount
    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafCallback);
    };
  }, [isMobile, isIOS]);

  // On mobile/iOS, render without the wrapper div that might interfere with scrolling
  if (isMobile || isIOS) {
    return <>{children}</>;
  }

  return <div data-lenis-prevent-wheel={false}>{children}</div>;
}

export default SmoothScroll;

