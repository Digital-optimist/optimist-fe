"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  
  // Configure ScrollTrigger for optimal performance
  ScrollTrigger.config({
    // Limit calculations per scroll event
    limitCallbacks: true,
    // Reduce frequency of scroll position checks
    syncInterval: 150, // Check every 150ms instead of every frame
    // Prevent redundant refreshes
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });
  
  // Set default ScrollTrigger properties for better performance
  ScrollTrigger.defaults({
    // Use less frequent updates
    scrub: true,
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

