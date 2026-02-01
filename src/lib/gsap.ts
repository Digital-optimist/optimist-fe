"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // Configure ScrollTrigger for optimal performance
  ScrollTrigger.config({
    // Limit calculations per scroll event
    limitCallbacks: true,
    // More frequent scroll position checks for smoother animations
    syncInterval: 40,
    // Prevent redundant refreshes
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });

  // Set default ScrollTrigger properties for better performance
  // Note: Don't set scrub default - let each animation control its own scrub value
  ScrollTrigger.defaults({
    // Reduce sensitivity - start animations earlier
    start: "top 75%",
    // Simpler toggle behavior
    toggleActions: "play none none none",
    // Add slight anticipation to reduce jank
    anticipatePin: 1,
  });
}

// Default GSAP configuration for smooth animations
gsap.defaults({
  ease: "power3.out",
  duration: 0.8,
  // Reduce render frequency for better performance
  lazy: false,
  // Force3D for hardware acceleration
  force3D: true,
});

export { gsap, ScrollTrigger };
